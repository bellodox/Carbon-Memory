# Carbon Memory — Agent Guide

## Project identity and scope

Carbon Memory is a pnpm monorepo for analyzing codebases and markdown knowledge bases into interactive knowledge graphs. Durable maintainer documentation lives in [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md).

## Source-of-truth policy

- Product overview and end-user usage: [`README.md`](README.md)
- Agent/operator notes for this repository: [`AGENTS.md`](AGENTS.md)
- Durable maintainer knowledge: [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md)
- Implementation truth: source files under [`understand-anything-plugin/packages/core/src`](understand-anything-plugin/packages/core/src), [`understand-anything-plugin/packages/dashboard/src`](understand-anything-plugin/packages/dashboard/src), and the agent contracts under [`understand-anything-plugin/agents`](understand-anything-plugin/agents)

When documentation conflicts with code, verify against implementation before updating docs.

## Carbon Memory usage

Carbon Memory is the collective repository-memory system for Kilo Code in this repository. It combines:

- the durable maintainer wiki under [`docs/maintainer-wiki/`](docs/maintainer-wiki/)
- the local volatile memory bank under [`.kilocode/rules/memory-bank/`](.kilocode/rules/memory-bank/)
- indexed repository context drawn from [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md), [`README.md`](README.md), and the implementation source of truth

Use [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md) as the durable entry point.

- Keep durable architecture, workflow, and operational notes in the maintainer wiki.
- Keep temporary session context in the memory bank only.
- Add new wiki pages to [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md) immediately.
- Treat the commands `Initialize carbon memory.` and `Update carbon memory.` as requests to initialize or refresh this combined wiki + memory-bank architecture.
- These commands MUST use the Understand Anything plugin to analyze the codebase first, then persist the findings into Carbon Memory. The canonical analysis entrypoint is `/understand`. After analysis, feed relevant structural and semantic insights into the maintainer wiki (`docs/maintainer-wiki/`) and volatile memory bank (`.kilocode/rules/memory-bank/`).
- Incremental updates (`Update carbon memory.`) should reuse `/understand` (incremental by default) to minimize token usage, then update only the affected wiki and memory-bank sections.
- Available codebase-understanding skills to leverage:
  - `/understand` — full or incremental codebase scan and graph generation
  - `/understand-chat` — query the knowledge graph (e.g. "How does the payment flow work?")
  - `/understand-diff` — analyze impact of current changes
  - `/understand-explain <path>` — deep-dive into a specific file or function
  - `/understand-onboard` — generate an onboarding guide for new team members
  - `/understand-domain` — extract business domain knowledge (domains, flows, steps)
  - `/understand-knowledge <path>` — analyze a Karpathy-pattern LLM wiki knowledge base (requires existing wiki/memory bank; use after initialization)
  - `/understand-knowledge docs/maintainer-wiki` — analyze the maintainer wiki as a knowledge base during Carbon Memory initialization
  - `/understand --auto-update` — enable incremental auto-update via post-commit hook
  - `/understand <subdir>` — scope analysis to a subdirectory for large monorepos

## Citation and provenance expectations

- Prefer direct references to implementation files such as [`useDashboardStore()`](understand-anything-plugin/packages/dashboard/src/store.ts:289), [`TreeSitterPlugin`](understand-anything-plugin/packages/core/src/plugins/tree-sitter-plugin.ts:31), and [`validateGraph()`](understand-anything-plugin/packages/core/src/schema.ts:499).
- When describing behavior, prefer tests and contracts such as [`tests/skill/understand/test_scan_project.test.mjs`](tests/skill/understand/test_scan_project.test.mjs:1), [`tests/skill/understand/test_extract_import_map.test.mjs`](tests/skill/understand/test_extract_import_map.test.mjs:1), [`understand-anything-plugin/agents/project-scanner.md`](understand-anything-plugin/agents/project-scanner.md:1), and [`understand-anything-plugin/agents/file-analyzer.md`](understand-anything-plugin/agents/file-analyzer.md:1).
- Mark uncertain statements as unverified until confirmed from code or tests.

## Security and documentation restrictions

- Do not store secrets, credentials, tokens, or local machine paths in wiki or memory content.
- Treat persisted graphs under [`.understand-anything/`](.understand-anything/) as project artifacts, but not as canonical documentation.
- Sanitize path-sensitive references consistently with the behavior documented by [`sanitiseFilePaths()`](understand-anything-plugin/packages/core/src/persistence/index.ts:38).

## Documentation validation commands

- Install dependencies: [`pnpm install`](package.json:29)
- Run tests: [`pnpm test`](package.json:29)
- Run lint: [`pnpm lint`](package.json:29)
- Build all workspaces: [`pnpm build`](package.json:29)

## Volatile memory rule

If local volatile memory is present under [`.kilocode/rules/memory-bank/`](.kilocode/rules/memory-bank/), treat it as the local-only working layer of Carbon Memory, not as canonical truth. Durable facts must be recorded in [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md).
