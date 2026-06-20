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

## Carbon Memory initialization and update flow

When `Initialize carbon memory.` or `Update carbon memory.` is invoked, the agent must:

1. Run `/understand` (or a scoped variant such as `/understand <subdir>` for large monorepos) to scan the codebase, extract structural elements, and generate or refresh `.understand-anything/knowledge-graph.json`.
2. Distill the findings into durable summaries covering architecture, component responsibilities, and maintainer workflows, then write or update the relevant pages under `docs/maintainer-wiki/`.
3. Also write or refresh `.kilocode/rules/memory-bank/brief.md`, `.kilocode/rules/memory-bank/context.md`, and `.kilocode/rules/memory-bank/active.md` with the current session's findings and next actions.
4. Update [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md) immediately if any new durable pages are created.

Relevant plugin skills to invoke during these flows include `/understand-chat`, `/understand-diff`, `/understand-explain <path>`, `/understand-onboard`, `/understand-domain`, `/understand-knowledge <path>`, `/understand-knowledge docs/maintainer-wiki`, and `/understand --auto-update`.

## Canonical boundaries

- User-facing overview: [`README.md`](README.md)
- Agent operating guide: [`AGENTS.md`](AGENTS.md)
- Durable maintainer knowledge: [Maintainer Wiki Index](docs/maintainer-wiki/index.md)
- Implementation truth: [`understand-anything-plugin/packages/core/src`](understand-anything-plugin/packages/core/src), [`understand-anything-plugin/packages/dashboard/src`](understand-anything-plugin/packages/dashboard/src), and [`understand-anything-plugin/agents`](understand-anything-plugin/agents)
