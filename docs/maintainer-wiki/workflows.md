# Workflows

## Standard validation workflow

1. Install dependencies with [`pnpm install`](package.json:29).
2. Activate shared Git hooks with [`pnpm run setup:hooks`](package.json:29).
2. Run repository tests with [`pnpm test`](package.json:29).
3. Run lint with [`pnpm lint`](package.json:29).
4. Build all workspaces with [`pnpm build`](package.json:29).

## Focused package workflows

- Build core only: [`pnpm --filter @understand-anything/core build`](CLAUDE.md:35)
- Test core only: [`pnpm --filter @understand-anything/core test`](CLAUDE.md:36)
- Start dashboard development server: [`pnpm dev:dashboard`](package.json:33)

## Documentation workflow

- Keep user-facing overview in [`README.md`](README.md).
- Keep agent operating policy in [`AGENTS.md`](AGENTS.md).
- Keep durable maintainer knowledge in [Maintainer Wiki Index](docs/maintainer-wiki/index.md).
- When documentation claims behavior, prefer code and tests such as [`validateGraph()`](understand-anything-plugin/packages/core/src/schema.ts:499), [`TreeSitterPlugin`](understand-anything-plugin/packages/core/src/plugins/tree-sitter-plugin.ts:31), [`tests/skill/understand/test_scan_project.test.mjs`](tests/skill/understand/test_scan_project.test.mjs:1), and [`tests/skill/understand/test_extract_import_map.test.mjs`](tests/skill/understand/test_extract_import_map.test.mjs:1).

## Carbon Memory hook workflow

This repository now includes shared native Git hooks at [`.githooks/pre-commit`](.githooks/pre-commit) and [`.githooks/pre-push`](.githooks/pre-push).

- The pre-commit hook blocks commits when repository-memory source files changed but no Carbon Memory update was staged.
- The pre-push hook blocks pushes if the durable Carbon Memory entrypoint is missing.

These hooks reinforce the Carbon Memory commands documented in [`docs/maintainer-wiki/concept-carbon-memory.md`](docs/maintainer-wiki/concept-carbon-memory.md). If you intentionally need to bypass the pre-commit guard once, use `SKIP_CARBON_MEMORY_HOOK=1` for that command.

To activate them in a local clone, run [`pnpm run setup:hooks`](package.json:29). That script configures Git `core.hooksPath` to [`.githooks/`](.githooks/).

## Analysis pipeline workflow

The analysis flow described in [`README.md`](README.md:311), [`understand-anything-plugin/agents/project-scanner.md`](understand-anything-plugin/agents/project-scanner.md:23), and [`understand-anything-plugin/agents/file-analyzer.md`](understand-anything-plugin/agents/file-analyzer.md:27) is:

1. Project scan and inventory
2. Import map extraction
3. File-batch structural and semantic analysis
4. Graph assembly, validation, and persistence
5. Dashboard exploration and follow-up commands

## Local graph artifacts

- Persisted graph artifacts live under [`.understand-anything/`](.understand-anything/).
- Graph persistence is handled by [`saveGraph()`](understand-anything-plugin/packages/core/src/persistence/index.ts:69), [`saveMeta()`](understand-anything-plugin/packages/core/src/persistence/index.ts:107), and [`saveFingerprints()`](understand-anything-plugin/packages/core/src/persistence/index.ts:118).
- Absolute file paths should not be documented as canonical facts; persistence sanitization is handled by [`sanitiseFilePaths()`](understand-anything-plugin/packages/core/src/persistence/index.ts:38).
