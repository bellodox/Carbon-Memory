# Tech Stack

## Workspace shape

- Root monorepo: [`package.json`](package.json:1)
- Workspace declarations: [`pnpm-workspace.yaml`](pnpm-workspace.yaml:1)
- Main product package: [`understand-anything-plugin/package.json`](understand-anything-plugin/package.json:1)
- Marketing site: [`homepage/package.json`](homepage/package.json:1)

## Runtime and language baseline

- Node.js 22+ is required by maintainer notes in [`CLAUDE.md`](CLAUDE.md:7) and by the homepage engine declaration in [`homepage/package.json`](homepage/package.json:5).
- TypeScript is used across the monorepo root and plugin packages, as seen in [`package.json`](package.json:40), [`tsconfig.json`](tsconfig.json), and [`understand-anything-plugin/packages/core/package.json`](understand-anything-plugin/packages/core/package.json:36).
- ESM is used broadly via `"type": "module"` in [`package.json`](package.json:4), [`understand-anything-plugin/package.json`](understand-anything-plugin/package.json:4), [`homepage/package.json`](homepage/package.json:3), and [`understand-anything-plugin/packages/core/package.json`](understand-anything-plugin/packages/core/package.json:4).

## Core analysis engine

- Package: [`@understand-anything/core`](understand-anything-plugin/packages/core/package.json:2)
- Schema validation: [`zod`](understand-anything-plugin/packages/core/package.json:56)
- Fuzzy search: [`fuse.js`](understand-anything-plugin/packages/core/package.json:42)
- Ignore handling: [`ignore`](understand-anything-plugin/packages/core/package.json:43)
- Structural parsing: [`web-tree-sitter`](understand-anything-plugin/packages/core/package.json:54) plus language grammars such as [`tree-sitter-typescript`](understand-anything-plugin/packages/core/package.json:53), [`tree-sitter-python`](understand-anything-plugin/packages/core/package.json:50), and [`tree-sitter-rust`](understand-anything-plugin/packages/core/package.json:52)
- Config parsing support includes [`yaml`](understand-anything-plugin/packages/core/package.json:55)

## Plugin / skill layer

- Package: [`@understand-anything/skill`](understand-anything-plugin/package.json:2)
- Graph clustering dependencies: [`graphology`](understand-anything-plugin/package.json:13) and [`graphology-communities-louvain`](understand-anything-plugin/package.json:14)
- Agent contracts live under [`understand-anything-plugin/agents`](understand-anything-plugin/agents)

## Dashboard

- State management uses [`zustand`](understand-anything-plugin/packages/dashboard/src/store.ts:1)
- Graph rendering uses [`@xyflow/react`](understand-anything-plugin/packages/dashboard/src/components/GraphView.tsx:3)
- The dashboard consumes browser-safe core subpath exports as noted in [`CLAUDE.md`](CLAUDE.md:52)

## Website

- Framework: [`astro`](homepage/package.json:15)

## Testing and linting

- Root tests run with [`vitest`](package.json:42)
- Core package tests run with [`vitest`](understand-anything-plugin/packages/core/package.json:37)
- Core test include pattern is configured in [`understand-anything-plugin/packages/core/vitest.config.ts`](understand-anything-plugin/packages/core/vitest.config.ts:3)
- Linting uses [`eslint`](package.json:38)

## Primary evidence-backed commands

- Install dependencies: [`pnpm install`](package.json:29)
- Build all workspaces: [`pnpm build`](package.json:29)
- Run all tests: [`pnpm test`](package.json:29)
- Run lint: [`pnpm lint`](package.json:29)
- Start dashboard dev flow: [`pnpm dev:dashboard`](package.json:33)
