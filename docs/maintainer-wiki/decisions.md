# Decision Log

| Date | Decision | Rationale | Evidence |
|---|---|---|---|
| 2026-06-20 | Adopt a dedicated maintainer wiki under [`docs/maintainer-wiki/`](docs/maintainer-wiki/) | Durable maintainer knowledge should be kept separate from transient session context and from user-facing README content | [`README.md`](README.md), [`AGENTS.md`](AGENTS.md) |
| 2026-06-20 | Treat code, domain, and knowledge analysis as one shared graph platform rather than separate products | The shared core schema and dashboard already support codebase, domain, and knowledge graph modes | [`understand-anything-plugin/packages/core/src/types.ts`](understand-anything-plugin/packages/core/src/types.ts:1), [`understand-anything-plugin/packages/dashboard/src/store.ts`](understand-anything-plugin/packages/dashboard/src/store.ts:17) |
