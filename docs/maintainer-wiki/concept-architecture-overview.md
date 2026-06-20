# Architecture Overview

## Repository structure

- Root documentation and packaging live at [`README.md`](README.md), [`package.json`](package.json:1), and [`pnpm-workspace.yaml`](pnpm-workspace.yaml:1).
- Product source is primarily under [`understand-anything-plugin/`](understand-anything-plugin/).
- The separate public website lives under [`homepage/`](homepage/).
- Historical design and implementation notes live under [`docs/superpowers/`](docs/superpowers/).

## System model

Understand Anything is best understood as three connected layers:

1. **Deterministic discovery and extraction**
   - inventory and import resolution defined in [`understand-anything-plugin/agents/project-scanner.md`](understand-anything-plugin/agents/project-scanner.md:14)
   - structural extraction and per-file graph emission defined in [`understand-anything-plugin/agents/file-analyzer.md`](understand-anything-plugin/agents/file-analyzer.md:13)
2. **Shared graph engine**
   - public core surface exported from [`understand-anything-plugin/packages/core/src/index.ts`](understand-anything-plugin/packages/core/src/index.ts:1)
   - schema and validation centered on [`KnowledgeGraphSchema`](understand-anything-plugin/packages/core/src/schema.ts:421) and [`validateGraph()`](understand-anything-plugin/packages/core/src/schema.ts:499)
3. **Visualization and platform delivery**
   - dashboard state in [`useDashboardStore()`](understand-anything-plugin/packages/dashboard/src/store.ts:289)
   - graph visualization in [`GraphView()`](understand-anything-plugin/packages/dashboard/src/components/GraphView.tsx:1575)
   - platform installation and packaging via [`install.sh`](install.sh), [`install.ps1`](install.ps1), [`.claude-plugin/`](.claude-plugin/), [`.cursor-plugin/`](.cursor-plugin/), and [`.copilot-plugin/`](.copilot-plugin/)

## Graph kinds

The schema supports more than a single code graph:

- codebase graph and knowledge graph are distinguished through the optional `kind` field in [`KnowledgeGraph`](understand-anything-plugin/packages/core/src/types.ts:91) and [`KnowledgeGraphSchema`](understand-anything-plugin/packages/core/src/schema.ts:421)
- domain-oriented graph features also exist through node and edge types in [`understand-anything-plugin/packages/core/src/types.ts`](understand-anything-plugin/packages/core/src/types.ts:2)

## Key execution flow

1. Scan files and classify them.
2. Build a deterministic import map.
3. Analyze files in batches to emit nodes and edges.
4. Validate, normalize, and persist the graph.
5. Load the graph into the dashboard for search, layer navigation, tours, diff overlays, domain view, and knowledge view.

## Performance and robustness themes

- Graph output is treated as a persistent artifact through [`saveGraph()`](understand-anything-plugin/packages/core/src/persistence/index.ts:69).
- Incremental refresh is supported via [`getChangedFiles()`](understand-anything-plugin/packages/core/src/staleness.ts:13) and [`mergeGraphUpdate()`](understand-anything-plugin/packages/core/src/staleness.ts:54).
- Large-graph visualization is optimized in [`GraphView.tsx`](understand-anything-plugin/packages/dashboard/src/components/GraphView.tsx) through staged layout, aggregation, and lazy expansion.
- Validation is intentionally defensive because LLM-generated graph fragments can be noisy; this is explicit in [`autoFixGraph()`](understand-anything-plugin/packages/core/src/schema.ts:196) and [`validateGraph()`](understand-anything-plugin/packages/core/src/schema.ts:499).
