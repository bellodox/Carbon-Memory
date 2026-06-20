# Carbon Memory

## Definition

Carbon Memory is the collective repository-memory architecture for Kilo Code in this repository. It combines three layers:

1. **Durable layer** — the maintainer wiki under [`docs/maintainer-wiki/`](docs/maintainer-wiki/)
2. **Volatile local layer** — the memory bank under [`.kilocode/rules/memory-bank/`](.kilocode/rules/memory-bank/)
3. **Indexed repository context** — automatically harvested context from key repository entrypoints such as [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md), [`README.md`](README.md), and implementation sources like [`understand-anything-plugin/packages/core/src/index.ts`](understand-anything-plugin/packages/core/src/index.ts:1)

## Command semantics

- `Initialize carbon memory.` means: create or refresh the Carbon Memory structure, including maintainer wiki, memory bank, and indexed repository summaries.
- `Update carbon memory.` means: incrementally refresh Carbon Memory from repository changes while preserving existing durable context.

## Relationship to Understand Anything

Carbon Memory uses the same architectural strengths that already appear in the product:

- deterministic structure and persistence via [`saveGraph()`](understand-anything-plugin/packages/core/src/persistence/index.ts:69)
- incremental refresh patterns via [`getChangedFiles()`](understand-anything-plugin/packages/core/src/staleness.ts:13) and [`mergeGraphUpdate()`](understand-anything-plugin/packages/core/src/staleness.ts:54)
- knowledge-base modeling direction described in [`docs/superpowers/specs/2026-04-09-understand-knowledge-design.md`](docs/superpowers/specs/2026-04-09-understand-knowledge-design.md:1)

## Indexed repository sources

At minimum, Carbon Memory should index and summarize:

- [`AGENTS.md`](AGENTS.md)
- [`CLAUDE.md`](CLAUDE.md)
- [`README.md`](README.md)
- [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md)

When relevant, it should also absorb updates from implementation-facing source-of-truth files such as [`understand-anything-plugin/packages/core/src/schema.ts`](understand-anything-plugin/packages/core/src/schema.ts:499), [`understand-anything-plugin/packages/dashboard/src/store.ts`](understand-anything-plugin/packages/dashboard/src/store.ts:289), and behavioral tests like [`tests/skill/understand/test_scan_project.test.mjs`](tests/skill/understand/test_scan_project.test.mjs:1).

## Retrieval model

Carbon Memory is intended for quick retrieval of:

- architecture summaries
- component responsibilities
- maintainer workflows
- documentation provenance
- operational gotchas

The wiki is the durable place to read those summaries. The memory bank is the local working layer. Indexed repository context keeps both synchronized with important repository files.

## Connection to Git hooks

Carbon Memory is not a Git feature, but Git hooks are a useful enforcement point for it.

- [`.githooks/pre-commit`](.githooks/pre-commit) can prevent commits when Carbon Memory source files changed without corresponding repository-memory updates.
- [`.githooks/pre-push`](.githooks/pre-push) can prevent sharing repository history when the durable Carbon Memory entrypoint is missing.

This repository did not have those native Git hooks earlier because the existing automation was implemented at the tool layer in [`understand-anything-plugin/hooks/hooks.json`](understand-anything-plugin/hooks/hooks.json:1), where commit-like shell commands trigger the auto-update prompt in [`understand-anything-plugin/hooks/auto-update-prompt.md`](understand-anything-plugin/hooks/auto-update-prompt.md:1). That mechanism detects commit activity inside the AI environment, but it is not a repository-native Git hook.

Checked-in hooks also are not automatically active in a clone unless Git is configured to use them. This repository now provides [`scripts/setup-git-hooks.mjs`](scripts/setup-git-hooks.mjs:1) and exposes it through [`pnpm run setup:hooks`](package.json:29), which sets Git `core.hooksPath` to [`.githooks/`](.githooks/).
