# Legacy Indexing Comparison

## Summary

Understand Anything is not just a replacement name for legacy codebase indexing. It overlaps with indexing in search and navigation goals, but its architecture is broader and more structured.

## Main distinction

- **Legacy codebase indexing** is primarily retrieval-oriented: find relevant files, chunks, or code snippets quickly.
- **Understand Anything** is graph-oriented: scan a repository, create explicit nodes and typed edges, persist the result, and expose it through a dedicated dashboard and follow-up workflows.

## Evidence in this repository

- The system persists graph artifacts through [`saveGraph()`](understand-anything-plugin/packages/core/src/persistence/index.ts:69), rather than only keeping an internal search index.
- The public graph model in [`understand-anything-plugin/packages/core/src/types.ts`](understand-anything-plugin/packages/core/src/types.ts:1) defines many node and edge categories instead of plain document chunks.
- The hybrid deterministic-plus-LLM approach is explained in [`README.md`](README.md:300).
- The dashboard uses graph-specific state and behavior through [`useDashboardStore()`](understand-anything-plugin/packages/dashboard/src/store.ts:289) and [`GraphView()`](understand-anything-plugin/packages/dashboard/src/components/GraphView.tsx:1575).

## Comparison table

| Aspect | Legacy indexing | Understand Anything |
|---|---|---|
| Main job | Retrieval | Persistent graph construction and exploration |
| Primary data model | Files or chunks | Nodes, typed edges, layers, tours |
| Deterministic structure extraction | Usually limited | Core architectural feature via [`TreeSitterPlugin`](understand-anything-plugin/packages/core/src/plugins/tree-sitter-plugin.ts:31) and bundled scan/import-map scripts |
| LLM role | Query-time reasoning over retrieved material | Semantic enrichment on top of deterministic structural facts |
| Output surface | Search results | Search + graph JSON + dashboard + tours + diff overlays |
| Docs/wiki handling | Searchable text | Can become a knowledge graph per [`docs/superpowers/specs/2026-04-09-understand-knowledge-design.md`](docs/superpowers/specs/2026-04-09-understand-knowledge-design.md:1) |

## Maintainer interpretation

For Carbon Memory, legacy indexing would mainly support “search the docs.” Understand Anything can support “model the docs, connect them to implementation, and browse them structurally.”

That difference matters because Carbon Memory is meant to serve as repository memory, not only retrieval.
