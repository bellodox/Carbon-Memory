# Agent Guide

Use this wiki as the durable maintainer knowledge base for the repository. In Carbon Memory terms, this wiki is the canonical repository-memory layer. Repository policy, constraints, and operational rules defer to [`AGENTS.md`](AGENTS.md).

## How to use this wiki

- Start at [Maintainer Wiki Index](docs/maintainer-wiki/index.md).
- Add durable architecture and workflow knowledge here, not in volatile memory.
- Prefer evidence-backed statements linked to implementation and tests such as [`understand-anything-plugin/packages/core/src/index.ts`](understand-anything-plugin/packages/core/src/index.ts:1), [`useDashboardStore()`](understand-anything-plugin/packages/dashboard/src/store.ts:289), and [`tests/skill/understand/test_extract_import_map.test.mjs`](tests/skill/understand/test_extract_import_map.test.mjs:1).

## What belongs here

- architecture overviews
- maintainer workflows
- tooling and packaging notes
- product-shape distinctions, such as knowledge-graph support vs legacy indexing
- Carbon Memory conventions, indexing behavior, and repository-memory summaries

## What does not belong here

- secrets, tokens, or local machine-specific paths
- temporary session scratch notes
- claims that have not been checked against code or tests

## Canonical boundaries

- User-facing overview: [`README.md`](README.md)
- Agent operating guide: [`AGENTS.md`](AGENTS.md)
- Durable maintainer knowledge: [Maintainer Wiki Index](docs/maintainer-wiki/index.md)
- Implementation truth: [`understand-anything-plugin/packages/core/src`](understand-anything-plugin/packages/core/src), [`understand-anything-plugin/packages/dashboard/src`](understand-anything-plugin/packages/dashboard/src), and [`understand-anything-plugin/agents`](understand-anything-plugin/agents)
