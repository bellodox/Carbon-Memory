# Maintainer Wiki Integration

## Summary

Inside Carbon Memory, the maintainer wiki is the durable repository-memory layer. It fits the existing Understand Anything architecture naturally because the product already supports markdown and knowledge-graph oriented analysis, so a maintainer wiki is not a foreign input type.

## Why it fits

- The product overview already positions the system as able to analyze codebases, docs, and knowledge bases in [`README.md`](README.md:4).
- Knowledge-oriented node types already exist in [`understand-anything-plugin/packages/core/src/types.ts`](understand-anything-plugin/packages/core/src/types.ts:2), including `article`, `entity`, `topic`, `claim`, and `source`.
- Validation already supports graph kind discrimination in [`KnowledgeGraphSchema`](understand-anything-plugin/packages/core/src/schema.ts:421).
- A dedicated knowledge-base design already exists in [`docs/superpowers/specs/2026-04-09-understand-knowledge-design.md`](docs/superpowers/specs/2026-04-09-understand-knowledge-design.md:1).

## Integration models

### 1. Wiki as a standalone knowledge graph

In this model, markdown under something like [`docs/maintainer-wiki/`](docs/maintainer-wiki/) is analyzed as a knowledge base and rendered through the knowledge graph pipeline. This is the cleanest extension path because it matches the article/topic/claim/source design already described in [`docs/superpowers/specs/2026-04-09-understand-knowledge-design.md`](docs/superpowers/specs/2026-04-09-understand-knowledge-design.md:171).

### 2. Wiki linked to the code graph

In this model, wiki pages become graph nodes that connect back to implementation nodes, for example:

- documentation page to file node
- design note to service node
- claim or concept to a function or class node

That model fits existing edge vocabulary in [`EdgeType`](understand-anything-plugin/packages/core/src/types.ts:10) and the current graph-oriented dashboard architecture in [`GraphView()`](understand-anything-plugin/packages/dashboard/src/components/GraphView.tsx:1575).

## Practical implication for maintainers

If a future maintainer wiki becomes a real project feature, the shortest implementation path is to treat it as an `/understand-knowledge` input. The more ambitious Carbon Memory path is a hybrid graph that links wiki content directly to code nodes emitted by the analyzer contracts in [`understand-anything-plugin/agents/project-scanner.md`](understand-anything-plugin/agents/project-scanner.md:14) and [`understand-anything-plugin/agents/file-analyzer.md`](understand-anything-plugin/agents/file-analyzer.md:249).
