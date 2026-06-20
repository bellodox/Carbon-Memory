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

## Carbon Memory initialization and update workflow

Carbon Memory combines three layers: the durable maintainer wiki, the volatile local memory bank, and indexed repository context from key entrypoints. The `Initialize carbon memory.` and `Update carbon memory.` commands automate the refresh of all three layers by leveraging the Understand Anything plugin.

### Initialization workflow (`Initialize carbon memory.`)

1. Activate shared Git hooks with [`pnpm run setup:hooks`](package.json:29) if not already configured.
2. Run `/understand` to perform a full or scoped codebase scan and generate `.understand-anything/knowledge-graph.json`.
3. Distill findings into wiki pages under [`docs/maintainer-wiki/`](docs/maintainer-wiki/) and index them in [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md).
4. Write or refresh `.kilocode/rules/memory-bank/brief.md`, `.kilocode/rules/memory-bank/context.md`, and `.kilocode/rules/memory-bank/active.md`.
5. Obtain a list of all files and learn the existing architectures, workflows and other functionalities in the codebase
6. Analyze whether the current implementations correspond to the existing documentation
7. Propose improvements or new functionalities for the codebase.

### Incremental update workflow (`Update carbon memory.`)

1. Re-run `/understand` (incremental by default) to detect changed files since the last analysis.
2. If only source files changed, use the incremental pipeline rather than a full rebuild to reduce token usage.
3. Update only the affected wiki and memory-bank sections.
4. Update [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md) if new pages were created.
5. Commit the updated wiki and memory-bank files through the standard validation workflow.

### Available knowledge commands

- `/understand-chat <question>` — query the knowledge graph (e.g. "How does the payment flow work?").
- `/understand-diff` — analyze impact of uncommitted changes.
- `/understand-explain <path>` — deep-dive into a specific file or function.
- `/understand-onboard` — generate an onboarding guide for new team members.
- `/understand-domain` — extract business domain knowledge (domains, flows, steps).
- `/understand-knowledge <path>` — analyze a Karpathy-pattern LLM wiki knowledge base (requires existing wiki/memory bank; use after initialization).
- `/understand-knowledge docs/maintainer-wiki` — analyze the maintainer wiki as a knowledge base during Carbon Memory initialization.
- `/understand --auto-update` — enable incremental auto-update via post-commit hook.
- `/understand <subdir>` — scope analysis to a subdirectory for huge monorepos.

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
