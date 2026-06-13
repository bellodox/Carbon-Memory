# Dart language support

**Date:** 2026-06-13
**Status:** Approved — ready for implementation plan
**Scope:** `understand-anything-plugin/packages/core/{src/languages/configs,src/plugins/extractors,package.json}`

## Problem

Understand Anything currently ships 14 code-language configs (TypeScript,
JavaScript, Python, Go, Rust, Java, Ruby, PHP, Swift, Kotlin, Lua, C, C++, C#)
plus 25 non-code config-file parsers. **Dart is absent.** Any `.dart` file in a
scanned project is classified as `plaintext` by the language registry, gets no
structural analysis, and contributes no nodes or edges to the project knowledge
graph.

Dart is in widespread big-tech use (Google's Flutter — official cross-platform
mobile language; production codebases at BMW, Toyota, Alibaba, ByteDance) and
its absence is the single largest mobile/cross-platform gap in the current
language gallery. Flutter codebases analyzed today produce empty graphs even
though the project's whole point is to make codebases understandable.

## Goal

Add deep Dart support — `LanguageConfig` + tree-sitter WASM grammar +
`DartExtractor` + vitest coverage — at parity with the recently landed Kotlin
support (PR #347). After this change, `.dart` files in a scanned project must
produce structural nodes (functions, classes, mixins, extensions, enums) and
call-graph edges identical in shape to what Kotlin/Java/Go produce today.

## Non-Goals

- **No Flutter framework config.** The Flutter ecosystem (pubspec.yaml manifest
  detection, widget vs service vs model layer hints) is a follow-up. The language
  config alone unlocks structural analysis for both Flutter and non-Flutter Dart
  code; framework-level detection is a separate, additive PR against
  `frameworks/` and `framework-registry.ts`.
- **No schema extensions.** Mixins, extensions, and enums are folded into the
  existing `StructuralAnalysis.classes[]` bucket. Adding `mixins[]` / `extensions[]`
  as first-class fields would require coordinated changes to `types.ts`,
  `graph-builder.ts`, dashboard rendering, and every existing extractor's tests —
  out of scope here. Tracked as a future cross-cutting refactor.
- **No support for `part of` / `part` multi-file libraries.** Each `.dart` file
  is analyzed independently; cross-`part` relationships would need a second pass
  over the project. Tracked as a follow-up.
- **No first-class modeling of Dart records or pattern matching.** Both appear
  only inside function bodies and have no project-graph impact.
- **No dashboard changes.** The new language slots into the existing
  config-driven pipeline; the dashboard already renders whatever `classes[]` /
  `functions[]` the extractor produces.

## Approach (chosen)

Strictly parallel to the Kotlin add (PR #347): six file changes, no edits to
shared types, registries, plugin loader, graph builder, or dashboard. The
existing config-driven `TreeSitterPlugin` picks the new language up unchanged.

Alternative considered and rejected:

- **Shallow Swift-style stub** (LanguageConfig only, no tree-sitter wiring):
  smallest PR but produces no structural graph for `.dart` files — fails the
  goal. The existing 14-language gallery already covers the shallow tier; the
  user-visible win is the deep tier.
- **Schema-extension approach** (first-class `mixins[]` / `extensions[]`):
  more accurate Dart modeling but touches every existing extractor's tests and
  the dashboard. High review risk; better as a separate, scoped follow-up.

## File-level changes

| # | File | Change | Approx LOC |
|---|---|---|---|
| 1 | `understand-anything-plugin/pnpm-workspace.yaml` | Register `packages/tree-sitter-dart-wasm/*` | 1 |
| 2 | `.../packages/tree-sitter-dart-wasm/package.json` | **New** — workspace package metadata | ~6 |
| 3 | `.../packages/tree-sitter-dart-wasm/tree-sitter-dart.wasm` | **New** — vendored freshly-built wasm (~745 KB binary) | binary |
| 4 | `.../packages/tree-sitter-dart-wasm/BUILD.md` | **New** — provenance + rebuild instructions | ~30 |
| 5 | `.../packages/core/package.json` | Add `"@understand-anything/tree-sitter-dart-wasm": "workspace:*"` dependency | 1 |
| 6 | `.../packages/core/src/languages/configs/dart.ts` | **New** — `LanguageConfig` with `treeSitter` field pointing at the workspace package | ~35 |
| 7 | `.../packages/core/src/languages/configs/index.ts` | Import + register `dartConfig` in the code-languages block (both `builtinLanguageConfigs` array and the named re-export block) | ~4 |
| 8 | `.../packages/core/src/plugins/extractors/dart-extractor.ts` | **New** — `DartExtractor` class implementing `LanguageExtractor` | ~400 |
| 9 | `.../packages/core/src/plugins/extractors/index.ts` | Import `DartExtractor`, re-export it, and add `new DartExtractor()` to `builtinExtractors` | ~3 |
| 10 | `.../packages/core/src/plugins/extractors/__tests__/dart-extractor.test.ts` | **New** — ~22 vitest cases | ~370 |

`pnpm-lock.yaml` regenerates automatically via `pnpm install`.

## `dartConfig` shape

```ts
export const dartConfig = {
  id: "dart",
  displayName: "Dart",
  extensions: [".dart"],
  treeSitter: {
    wasmPackage: "@understand-anything/tree-sitter-dart-wasm",
    wasmFile: "tree-sitter-dart.wasm",
  },
  concepts: [
    "null safety",
    "mixins",
    "extensions",
    "isolates",
    "async/await",
    "streams",
    "factory constructors",
    "named constructors",
    "records",
    "sealed classes",
  ],
  filePatterns: {
    entryPoints: ["lib/main.dart", "bin/*.dart"],
    barrels: ["lib/*.dart"],
    tests: ["test/**/*_test.dart"],
    config: ["pubspec.yaml", "analysis_options.yaml"],
  },
} satisfies LanguageConfig;
```

**Notes:**

- Single `.dart` extension; Flutter widgets share it.
- `entryPoints` covers both Flutter (`lib/main.dart`) and Dart CLI (`bin/*.dart`).
- `barrels` matches Dart's idiomatic top-level re-export files (`lib/foo.dart`
  re-exporting `lib/src/*.dart`).

## WASM grammar source

**Ship a freshly-built wasm as a workspace-internal package**
`@understand-anything/tree-sitter-dart-wasm`, built from the `tree-sitter-dart`
grammar source. The grammar source is sound; only the prebuilt npm artifact is
ABI-incompatible with the current `web-tree-sitter`.

### Why not the upstream `tree-sitter-dart` package directly

The published `tree-sitter-dart@1.0.0` tarball does ship a `.wasm`, but it was
built in 2023-02 with a tree-sitter CLI that emitted the OLD WebAssembly dynamic
linking format. The wasm header is `\0asm` then a custom section named
`"dylink"` (no `.0` suffix). The project's current `web-tree-sitter@^0.26.6`
expects the newer `"dylink.0"` format (the standardized name since tree-sitter
CLI ~0.22). Attempting to load the upstream wasm fails inside
`getDylinkMetadata` with a bare `Error`. Verified during design via a live
probe against `web-tree-sitter@0.26.8` in the project's own `node_modules`.

`@tree-sitter-grammars/tree-sitter-dart` does not exist (404 on npm);
`@driftlog/tree-sitter-dart@1.0.4` ships no wasm at all. There is no
WASM-shipping Dart grammar on the npm registry that works with the current
`web-tree-sitter`.

### How the freshly-built wasm is sourced

Rebuilding the same grammar source with the current `tree-sitter-cli@0.26.x` +
`wasi-sdk-29` toolchain produces a `dylink.0`-format wasm (~745 KB) that loads
cleanly. Confirmed during design: the rebuilt wasm parses every construct the
extractor needs (functions, classes, mixins, extensions, enums, imports,
exports, calls). The grammar.js itself is unchanged from the upstream package.

### Packaging approach

Add a new workspace package at
`understand-anything-plugin/packages/tree-sitter-dart-wasm/` containing:

- `tree-sitter-dart.wasm` — the freshly-built artifact (vendored binary).
- `package.json` — `{ "name": "@understand-anything/tree-sitter-dart-wasm",
  "version": "0.1.0", "main": "tree-sitter-dart.wasm" }`.
- `BUILD.md` — short note documenting **how the wasm was built** (CLI version,
  grammar source SHA, wasi-sdk version) so the next maintainer can rebuild it.

Register the new workspace package in
`understand-anything-plugin/pnpm-workspace.yaml`. Add it as a dependency of
`@understand-anything/core` via `"workspace:*"`. The existing `TreeSitterPlugin`
loader resolves it unchanged via
`require.resolve("@understand-anything/tree-sitter-dart-wasm/tree-sitter-dart.wasm")`
— **no loader code changes**.

This approach was chosen over three alternatives:

- **Depend on broken upstream**: would fail at runtime; rejected.
- **Modify the loader to support local file paths**: more invasive, sets a
  precedent that complicates other languages.
- **Publish under a third-party npm scope**: cleaner long-term but requires
  external infra; can transition later if a published fix lands.

Tradeoff acknowledged: ~745 KB binary committed to git. Comparable in size to
the wasms already pulled in by `tree-sitter-rust` / `tree-sitter-go` at install
time (those just aren't committed). If amaanq/tree-sitter-dart later publishes
a refreshed npm release with a `dylink.0` wasm, switching back is a two-line
change: delete the workspace package, depend on `tree-sitter-dart` directly,
flip the `wasmPackage` field.

## `DartExtractor` — what it extracts

Implements the `LanguageExtractor` interface with `languageIds = ["dart"]`.
Walks the tree-sitter AST and produces `StructuralAnalysis` +
`CallGraphEntry[]`. Follows the existing convention used by `KotlinExtractor`
and `GoExtractor` of pushing class/mixin methods to BOTH `methods[]` and the
top-level `functions[]` array so the call graph can resolve them.

### Top-level AST nodes handled

| AST node | Maps to | Notes |
|---|---|---|
| `function_signature` (top-level) | `functions[]` | name, params, returnType, lineRange |
| `class_definition` | `classes[]` | walks `class_body` for methods + fields |
| `mixin_declaration` | `classes[]` | folded in per chosen approach |
| `extension_declaration` | `classes[]` | name may be absent → use target type name (`extension on Foo` → `"on Foo"`) so the entry isn't dropped |
| `enum_declaration` | `classes[]` | constants surfaced as `properties` |
| `import_or_export` / `library_import` | `imports[]` | strips quotes from URI string; `show` / `hide` clauses captured as `specifiers`; `as` prefix becomes the sole specifier |
| Top-level `export` directive | `exports[]` | URI as `name`, line number from the directive |
| `package_directive` / `library_name` | skipped | metadata, not graph members |

### Visibility rule (Dart-specific)

Dart has no `public` / `private` keywords — names starting with `_` are
file-private (library-private to be precise), everything else is exported. The
`isExported(name)` helper is a one-liner: `!name.startsWith("_")`. This is the
**opposite** of Kotlin (where the default is exported and the presence of a
modifier opts out). The Dart rule is name-based, not modifier-based, and
applies uniformly to top-level declarations AND class members.

An inline comment in the extractor must document this contrast explicitly,
because a reviewer comparing line-for-line against `KotlinExtractor` will
otherwise expect modifier inspection.

### Class body walking

Mirrors `KotlinExtractor.collectClassBody`:

- `method_signature` / `function_signature` inside `class_body` → push name to
  the class's `methods[]` AND append a full entry to top-level `functions[]`
  (matches Kotlin/Swift/Go convention; required for call-graph resolution).
- `field_declaration` → `properties[]`.
- Constructor naming follows the source spelling so call sites resolve in the
  call graph:
  - Unnamed constructor `Foo(...)` → method name `"Foo"`.
  - Named constructor `Foo.named(...)` → method name `"Foo.named"`.
  - Factory named constructor `factory Foo.fromJson(...)` → method name
    `"Foo.fromJson"`.

### Call graph

Reuses the recursive-walk + function-stack pattern from `KotlinExtractor`:

- Push on `function_signature` / `method_signature`; pop on exit.
- On any node representing an invocation, emit `{ caller, callee, lineNumber }`.
  Dart's grammar represents calls as `assignable_expression > selector >
  arguments`. The callee identifier is the named child immediately preceding
  the `arguments` node. Two shapes:
  - Bare call `foo(...)` → callee is the `identifier` child.
  - Method call `target.foo(...)` → callee is the last `identifier` in the
    `selector` chain (analogous to Kotlin's `navigation_expression` handling).

### Imports — three forms

- `import 'package:flutter/material.dart';` → `source =
  "package:flutter/material.dart"`, `specifiers = []`
- `import 'foo.dart' show Bar, Baz;` → `source = "foo.dart"`, `specifiers =
  ["Bar", "Baz"]`
- `import 'foo.dart' as f;` → `source = "foo.dart"`, `specifiers = ["f"]`

## Tests — `dart-extractor.test.ts`

~22 vitest cases, matching the bar set by `kotlin-extractor.test.ts` (22 cases,
364 lines). Each test parses a small Dart snippet through the real WASM grammar
(no mocks) and asserts on extractor output. Setup copies Kotlin's pattern
verbatim: `createRequire` + `Parser.init()` + `Language.load(wasmPath)` in
`beforeAll`, snippet-per-test parsing via a local `parse()` helper. The only
difference is the WASM path:
`require.resolve("tree-sitter-dart/tree-sitter-dart.wasm")`.

**Coverage matrix:**

| Bucket | Cases | Examples |
|---|---|---|
| Functions | 3 | simple `int add(int a, int b)`; no-args/no-return `void noop()`; async + generic `Future<T> fetch<T>(String id)` |
| Classes | 4 | plain class with fields + methods; class with named + factory constructors; abstract class; class with `extends` + `with` + `implements` |
| Mixins | 2 | `mixin Foo {...}`; `mixin Foo on Bar {...}` |
| Extensions | 2 | named `extension StringX on String {...}`; anonymous `extension on int {...}` |
| Enums | 2 | simple `enum Color { red, green, blue }`; enhanced enum with methods |
| Imports | 4 | `package:` URI; relative path; `show` clause; `as` prefix |
| Exports | 1 | top-level `export 'foo.dart';` directive |
| Visibility | 2 | underscore-prefixed name is NOT in `exports[]`; non-underscore IS exported; covers both top-level and class-member cases |
| Call graph | 2 | top-level fn calling another top-level fn; method calling another method (`a.b()` shape) |

Existing test that should keep passing: `tree-sitter-plugin.test.ts` (the
end-to-end pipeline test). No new assertions required there — Dart enters the
same code path; if structural analysis works for `.dart` files in unit tests,
the integration path will follow.

## Error handling

All inherited from the existing pipeline; no new failure modes are introduced:

- **WASM load failure** (package missing / corrupt): `TreeSitterPlugin.init()`
  already catches and logs a `console.debug` "skipping structural analysis"
  message; `.dart` files fall back to LLM-only analysis. Same path Swift uses
  today (Swift has a `LanguageConfig` but no `treeSitter` field, so the loader
  silently skips it).
- **Parse failure on a malformed `.dart` file**: tree-sitter returns a partial
  tree; the extractor walks what's present and returns whatever it found.
  Matches `KotlinExtractor` behavior.
- **Empty / `library` / `part` only files**: extractor returns
  `{ functions: [], classes: [], imports: [], exports: [] }`. Not an error.

## Edge cases handled in code

- **Anonymous extension** (`extension on Foo`): the class entry's `name` is
  set to `"on Foo"` rather than empty string. Without this, the entry would be
  dropped by the graph builder. WHY-comment required inline.
- **Constructor naming**: `factory Foo.fromJson(...)` → method name
  `"Foo.fromJson"` (not `"fromJson"`), so call sites like `Foo.fromJson(map)`
  resolve correctly in the call graph.
- **Underscore visibility on class members**: applied identically to top-level
  declarations and to declarations inside class/mixin/extension bodies. A
  `class _PrivateImpl` is not in `exports[]`. A `class Public` with a method
  `_helper()` has the class itself in `exports[]` but `_helper` is excluded.
  Non-underscore class members ARE pushed to `exports[]` alongside the class
  entry, matching `KotlinExtractor.collectClassBody`'s behavior of pushing
  exported members to the top-level `exports[]` array.

## Edge cases explicitly OUT of scope

Documented in code via short comments at the relevant walk site:

- Dart records `(int, String)` and pattern matching — function-local only.
- `part of` / `part` multi-file libraries — would require a second project-wide
  pass.

## Verification

Before marking the implementation complete, run all of:

```
pnpm install                                          # picks up tree-sitter-dart
pnpm --filter @understand-anything/core build         # tsc clean
pnpm --filter @understand-anything/core test          # all existing + 22 new Dart tests pass
pnpm --filter @understand-anything/skill build        # no regressions
pnpm lint                                             # clean
pnpm test                                             # full suite, no regressions
```

Plus a manual smoke test: run `/understand` against a small Flutter sample
repo, then inspect `.understand-anything/knowledge-graph.json` to confirm it
contains Dart-derived class/function nodes and call-graph edges.

## Open questions

None at design time. Three genuine unknowns were resolved during exploration:

- **WASM availability**: the upstream `tree-sitter-dart@1.0.0` wasm uses the
  pre-`dylink.0` format and fails to load in `web-tree-sitter@0.26.x`. A
  fresh build with the current `tree-sitter-cli@0.26.x` + `wasi-sdk-29`
  produces a `dylink.0`-format wasm that loads and parses correctly. Ship via
  a workspace-internal package; documented above.
- **Grammar node-type coverage**: confirmed via inspection of
  `node-types.json` (316 named types) and via a live AST probe on a Dart
  sample covering every construct the extractor handles. Concrete AST shapes
  for each construct are documented in the implementation plan.
- **Visibility semantics**: Dart's name-based `_`-prefix rule is the opposite
  of Kotlin's modifier-based rule; encoded as a one-line `isExported` helper
  with an explanatory comment.
