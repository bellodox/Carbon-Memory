# Carbon Memory Initialization Rule

This rule defines the standardized process for initializing Carbon Memory for a repository. Carbon Memory is the collective repository-memory architecture in Kilo Code, combining the volatile memory bank, the durable maintainer wiki, and indexed repository context.

## Purpose

When starting work on a new project (or when these structures are missing), Kilo Code must initialize Carbon Memory across THREE layers:
1. Volatile memory bank (`.kilocode/rules/memory-bank/`) - local-only, gitignored, AI session context
2. Maintainer wiki (`docs/maintainer-wiki/`) - committed, canonical documentation
3. Indexed repository context - curated summaries sourced from repository entrypoints such as `AGENTS.md`, `CLAUDE.md`, `README.md`, and maintainer wiki index pages

These commands MUST use the Understand Anything plugin to analyze the codebase first, then persist the findings into Carbon Memory. The canonical analysis entrypoint is `/understand`. After analysis, feed relevant structural and semantic insights into the maintainer wiki and volatile memory bank.

## Initialization Triggers

Perform initialization when:
- Starting a new project with no existing memory bank or wiki
- The directive "initialize memory bank" or "initialize wiki" is given
- The directive "Initialize carbon memory." is given
- `.kilocode/rules/memory-bank/` or `docs/maintainer-wiki/` are missing or empty
- The user explicitly requests project setup

Perform an incremental refresh when:
- The directive "Update carbon memory." is given
- Important repository context files have changed and Carbon Memory should absorb those updates without losing existing durable context

## Initialization Workflow

### Phase 0: Agent Entrypoint File Initialization

Create these agent-facing entrypoint files during project initialization:

#### `AGENTS.md`
- Create if missing.
- Use it as the primary maintainer/agent operating manual for the repository.
- Include, at minimum:
  - project identity and scope
  - source-of-truth policy
  - maintainer wiki usage rule
  - citation/provenance expectations
  - security restrictions for docs and memory content
  - documentation validation command(s)
  - Carbon Memory usage rules, if local memory is used
- Point durable documentation to `docs/maintainer-wiki/index.md`.

#### `CLAUDE.md`
- Create if missing.
- Keep it minimal unless the project has a stronger reason to diverge.
- At minimum, make it explicitly defer to `AGENTS.md` so agent entry behavior stays consistent across tools.

#### Consistency requirement
- If the project uses additional agent/tool instruction entrypoints, keep them aligned with `AGENTS.md`.
- Do not initialize a project with wiki + memory only while omitting agent entrypoint files.

#### Native Git hook activation
- If the repository contains shared hooks under [`.githooks/`](.githooks/), initialization must activate them in the local clone by setting `core.hooksPath` to `.githooks`.
- Preferred activation command:
  - [`pnpm run setup:hooks`](package.json:29) when the repository provides it
- Fallback activation command:
  - `git config core.hooksPath .githooks`
- Do not assume checked-in hook files are active until `core.hooksPath` is configured in the local clone.

### Phase 1: Create Volatile Memory Bank

Create these files in `.kilocode/rules/memory-bank/`:

#### `brief.md`
- 1-2 paragraph project summary
- Core goals and scope
- What the project does and why
- Primary user persona(s)
- Must explicitly state: local-only volatile memory and noncanonical status
- Must point canonical durable facts to `docs/maintainer-wiki/index.md`
- Should identify Carbon Memory as the combined wiki + memory-bank + indexed-context system for the repository

#### `context.md`
- Start with: "Project initialization in progress"
- Keep short, factual, and focused on current work, recent changes, next steps, and uncertainties
- Do not duplicate detailed architecture/protocol analysis here; store durable detail in `docs/maintainer-wiki/`
- Must explicitly state local-only/noncanonical context
- After initialization: "Initial setup complete; ready for [next typical tasks]"
- When performing `Update carbon memory.`, record which indexed source files changed and what durable pages were refreshed

#### `active.md`
- List only immediate active tasks/known issues and next actions
- Include priorities if obvious
- Must explicitly state local-only/noncanonical context
- Otherwise keep minimal: "No active work items"
- May include a short Carbon Memory refresh queue when indexed files are awaiting durable wiki updates

**Important:** `brief.md` is the foundation - craft it carefully from analysis and user input.

### Phase 1A: Memory Safety and Compliance Requirements

For all generated files under `.kilocode/rules/memory-bank/`:
- Never store secrets, credentials, private keys, tokens, local machine secrets, or sensitive RPC credentials
- Treat memory-bank files as noncanonical operational context only
- Keep durable/canonical facts in `docs/maintainer-wiki/` and index them in `docs/maintainer-wiki/index.md`
- Use Documentation Specialist mode for memory-bank/wiki edits when mode workflows apply
- Preserve prior useful local context during `Update carbon memory.` unless it is stale or contradicted by current repository evidence

### Phase 2: Create Maintainer Wiki

Create these files in `docs/maintainer-wiki/`:

#### `index.md`
Machine-readable catalog listing ALL wiki pages:
```markdown
# Maintainer Wiki Index

- [README](README.md) — Overview and getting started
- [Maintainer log](log.md) — Dated notable decisions, gotchas, and initialization notes
- [Decision log](decisions.md) — Dated maintainer decisions
- [Open work](open-work.md) — Unresolved items
- [Tech stack](tech-stack.md) — Technology inventory
- [Workflows](workflows.md) — Standard procedures
- [Concept: Architecture overview](concept-architecture-overview.md)
- [Agent guide](agent-guide.md) — Agent operating notes that defer repository policy to AGENTS
- [Concept: Carbon Memory](concept-carbon-memory.md) — Repository-memory architecture spanning wiki, memory bank, and indexed repository context
- [Reference: Canonical sources](reference-canonical-rod-sources.md) — if applicable
```

#### `README.md`
- Project-specific overview
- How to use the wiki
- Point to `index.md` for full catalog
- Explain that the wiki is the canonical durable layer of Carbon Memory

#### `log.md`
- First entry: "Initial wiki setup on [date]"
- Link to this initialization effort

#### `decisions.md`
- Template structure with rationale columns
- First entry: initialization decisions (e.g., "Adopted standard wiki structure from template")

#### `open-work.md`
- Initial items if any (e.g., "Verify chainparams against upstream", "Add SECURITY.md")
- Otherwise empty or minimal

#### `tech-stack.md`
Evidence-backed inventory:
- Runtime (Node.js version, if applicable)
- Frameworks and libraries (from package.json or equivalent)
- Build tools
- Test frameworks
- Deployment targets
- Include evidence links (package.json, Dockerfile, etc.)

#### `workflows.md`
Project-specific procedures:
- How to run tests
- How to build/deploy
- Code review process
- Documentation update process
- Link to `npm run docs:check` or equivalent validation
- Document any repository hook workflow that enforces documentation validation (for example a [`.githooks/pre-push`](c:/Users/VSCode/source/repos/rod-rpc-explorer/.githooks/pre-push) hook that runs `npm run docs:check`)

#### `concept-architecture-overview.md`
High-level map:
- Project type (explorer, API, CLI, etc.)
- Main directories and their purposes
- Key entry points
- Data flow overview
- External dependencies/services

#### `agent-guide.md`
Agent-operating bridge page:
- Summarize how maintainers/agents should use the wiki
- Explicitly defer repository policy to `AGENTS.md`
- Remind readers that volatile memory is noncanonical
- Point protocol-facing work to canonical source/provenance pages

#### Auto-update support
- Enable `/understand --auto-update` to set up a post-commit hook that incrementally updates the knowledge graph on every commit.
- This ensures the persisted graph stays in sync with repository changes without manual intervention.

#### `concept-carbon-memory.md`
- Define Carbon Memory as repository memory within Kilo Code
- Explain the roles of wiki, memory bank, and indexed repository context
- Document command semantics for `Initialize carbon memory.` and `Update carbon memory.`
- List mandatory indexed source files such as `AGENTS.md`, `CLAUDE.md`, `README.md`, and `docs/maintainer-wiki/index.md`
- Document that these commands MUST route through the Understand Anything plugin (`/understand`) for codebase analysis before persisting findings

### Phase 3: Gather Missing Information

If analysis reveals gaps, ask the user:
- Project name and tagline
- Primary purpose and problems it solves
- Target users/use cases
- Key technologies and frameworks (if not obvious)
- Deployment environment(s)
- Any special architectural decisions or constraints
- Team conventions or workflows to document

### Phase 4: Coin-Specific Pages (if applicable)

For blockchain/cryptocurrency projects:

#### `concept-rod-chainparams-parity.md` (or chain-specific)
- Why chainparams must match upstream core/spec
- Where official parameters are documented
- How to verify alignment
- Known discrepancies tracker

#### `gotcha-genesis-metadata.md`
- Genesis block verification requirements
- Fields that must not be edited without re-verification

#### `gotcha-name-value-validation.md`
- Current validation gaps and risks
- Where validation logic lives

#### `reference-canonical-rod-sources.md`
- Source hierarchy for protocol facts
- Which sources are canonical vs. visibility-only

#### `convention-protocol-fact-provenance.md`
- Citation rules and UNVERIFIED handling
- Code-wins policy

### Phase 5: Project Analysis and Codebase Understanding

Conduct exhaustive analysis through the Understand Anything plugin:
- Run `/understand` (or `/understand <subdir>` for scoped analysis) to perform a full or incremental codebase scan and generate `.understand-anything/knowledge-graph.json`.
- Use incremental updates (`Update carbon memory.`) by reusing `/understand` incremental mode to minimize token usage.
- Feed structural and semantic insights into the maintainer wiki and volatile memory bank after analysis.

Additional analysis:
- All source code files and their relationships
- Configuration files (package.json, tsconfig.json, etc.)
- Build system and tooling
- Project structure and organization patterns
- Existing documentation (README.md, docs/, etc.)
- Repository entrypoint documents (`AGENTS.md`, `CLAUDE.md`, `README.md`, maintainer wiki pages)
- Dependencies and external integrations
- Testing frameworks and patterns
- Any project-specific conventions

### Phase 5A: Carbon Memory Source Indexing

Collect repository-memory source material after the codebase analysis.

At minimum, read and summarize when present:
- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `docs/maintainer-wiki/index.md`

Use these files as indexed Carbon Memory inputs. Their durable summaries should be reflected in the maintainer wiki, while short-lived current-task context should be reflected in the memory bank.

### Phase 6: Validation

1. Create all required files
2. Run validation if available: `npm run docs:check` (or create script if missing)
3. Verify memory bank files exist and are non-empty
4. Check that `.kilocode/rules/memory-bank/` is in `.gitignore`
5. Ensure `docs/maintainer-wiki/index.md` lists all created pages
6. Verify Carbon Memory indexing captured current repository entrypoint documents (`AGENTS.md`, `CLAUDE.md`, `README.md`, and if present `docs/maintainer-wiki/index.md`)
7. If the repository uses native Git hooks, ensure Carbon Memory checks are wired into shared hooks such as [`.githooks/pre-commit`](.githooks/pre-commit) and [`.githooks/pre-push`](.githooks/pre-push)
8. If volatile memory was updated in this work loop, also update `CHANGELOG.md` with a concise `Unreleased` entry reflecting task codebase/docs/test changes, or explicitly record in memory-bank updates that `CHANGELOG.md` is already up to date for the task
9. If shared hooks exist, activate them in the current local clone by configuring `core.hooksPath` to [`.githooks/`](.githooks/)

### Phase 6A: Optional Native Git Hook Integration

When the repository adopts shared Git hooks, Carbon Memory should participate in the commit/push path.

Recommended checks:
- [`.githooks/pre-commit`](.githooks/pre-commit) should block commits when repository-memory source files changed but Carbon Memory was not refreshed
- [`.githooks/pre-push`](.githooks/pre-push) should block pushes when the durable Carbon Memory entrypoint is missing

At minimum, treat these files as Carbon Memory source-of-truth triggers:
- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `docs/maintainer-wiki/`
- implementation directories that materially affect architecture summaries

If no native Git hook exists yet, document that the repository currently relies on tool-layer hooks or manual Carbon Memory refresh instead of pretending the Git hook is already active.

### Phase 7: User Presentation

Present a summary:
- What was discovered about the project
- What files were created
- Key decisions documented
- Anything that needs user verification or correction
- Instructions for future wiki updates (`npm run docs:check` before commits)
- Reminder: Carbon Memory = local memory bank + canonical wiki + indexed repository context

Invite user to review and correct misunderstandings.

### Phase 8: Analyze Maintainer Wiki Knowledge Base

After the wiki and memory bank are fully initialized and presented, analyze the maintainer wiki as a Karpathy-pattern LLM wiki knowledge base:
- Run `/understand-knowledge docs/maintainer-wiki` to extract entities, claims, and implicit relationships from the wiki.
- Use the results to improve cross-linking, identify gaps, and strengthen the knowledge graph.

## Template Usage

If this repository has a well-initialized wiki (like `rod-rpc-explorer`), use it as a template:
- Copy structures and page organization
- Adapt content to the new project's domain
- Preserve evidence-backed format
- Keep citation requirements

## Common Omissions to Avoid

- Forgetting to add new pages to `index.md`
- Missing evidence links in tech-stack.md
- Not documenting validation commands
- Assuming user knows when to update wiki vs. memory bank
- Forgetting to refresh indexed repository sources during `Update carbon memory.`
- Not running docs:check to catch issues early

## Post-Initialization

After successful initialization:
- Update `AGENTS.md` or project-specific agent rules to reference the new wiki
- Consider adding a `CONTRIBUTING.md` that points maintainers to the wiki
- Add any project-specific tooling (lint scripts, pre-commit hooks) if they don't exist
- Ensure Carbon Memory command language is documented somewhere durable if the repository relies on it operationally

## Example Initialization Output

When done, provide:
- Summary of project understanding
- List of created files with brief descriptions
- Any unanswered questions
- Next steps for the user

Example:
```
[Memory Bank: Active] Initialization complete for "MyChain Explorer".
Created:
- .kilocode/rules/memory-bank/brief.md (project overview)
- .kilocode/rules/memory-bank/context.md (current state: ready for development)
- docs/maintainer-wiki/ with 12 pages including tech-stack, workflows, architecture

Key findings: Node.js/Express app connecting to local RPC node. Tests use mocha.
Next: You can now start development. Remember to run `npm run docs:check` before commits.
```
