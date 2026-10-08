# Documentation Maintenance

## Documentation structure

```
docs/
├── INDEX.md                              # Master index
├── repository-overview.md                # Purpose, scope, entry points
├── repository-structure.md               # File layout, modules, dependencies
├── architecture.md                       # Implementation detail
├── design-decisions.md                   # 14 key decisions
├── dependencies.md                       # External/internal deps
├── configuration.md                      # Config system (none)
├── data-model.md                         # Entities, schemas, algorithms
├── state-and-persistence.md              # No persistent state
├── components/
│   ├── presentation.md                   # index.html structure
│   ├── host-and-composition.md           # Composition root, load order
│   ├── application-services.md           # exonyms-retriever.js API
│   ├── browser-state-and-localisation.md # languages.js
│   └── integration-models.md             # API contracts
├── flows/
│   ├── startup-and-rendering.md          # Page load sequence
│   └── exonym-retrieval.md               # Main flow detail
├── behaviours/
│   ├── browse-and-search.md              # User workflow
│   └── inspect-edit-delete.md            # DevTools inspection
├── integrations/
│   └── integrations.md                   # (to be created)
├── quality-attributes/
│   ├── testing.md                        # Manual testing only
│   ├── concurrency-and-scheduling.md     # Sync, blocking
│   ├── error-handling.md                 # Minimal
│   ├── logging.md                        # Console only
│   └── invariants.md                     # System invariants
├── operations/
│   └── build-and-deployment.md           # No build, GitHub Pages
└── maintenance/
    ├── ambiguities-and-open-questions.md # Open questions
    ├── change-guide.md                   # How to modify safely
    └── documentation-maintenance.md      # This file
```

## Documentation principles

| Principle | Application |
|-----------|-------------|
| Single source of truth | Code is authoritative; docs reflect code |
| Living documentation | Update docs with code changes |
| Audience: future agents | Technical, detailed, structured |
| Cross-references | Link related docs |
| No duplication | Each fact in one place |

## Update triggers

| Trigger | Action |
|---------|--------|
| Code change | Update affected docs |
| New feature | Add new docs |
| Bug fix | Update behaviour docs |
| Dependency change | Update dependencies.md |
| API change | Update integration-models.md |
| Architecture change | Update architecture.md, design-decisions.md |

## Documentation update process

1. **Identify affected docs** — Check file list above
2. **Make code change** — Follow change-guide.md
3. **Update docs** — Edit relevant .md files
4. **Verify cross-references** — Check links still work
5. **Commit together** — Code + docs in same commit

## File-specific maintenance

### INDEX.md
- Update document map when adding/removing files
- Keep catalogue current
- Verify all links resolve

### repository-overview.md
- Update when purpose/scope changes
- Update entry points if new HTML pages added
- Update runtime topology if architecture changes

### repository-structure.md
- Update file layout on add/remove/move
- Update module organization on new JS files
- Update dependency graph on new imports

### architecture.md / design-decisions.md
- Update when architectural decisions change
- Add new decisions with rationale
- Mark superseded decisions

### dependencies.md
- Update on CDN version changes
- Update on API endpoint changes
- Update supply chain risks

### configuration.md
- Update if config system added
- Document new constants

### data-model.md
- Update on API response changes
- Update on transform algorithm changes
- Update on XML output changes

### state-and-persistence.md
- Update if any persistence added
- Document new state types

### Component docs
- Update on function signature changes
- Update on new globals
- Update on load order changes

### Flow docs
- Update on flow changes
- Add new flows for new features

### Behaviour docs
- Update on UI changes
- Update on new user interactions

### Integration docs
- Update on API contract changes
- Update on new integrations

### Quality attribute docs
- Update on testing additions
- Update on error handling improvements
- Update on logging changes

### Operations docs
- Update on build/deployment changes
- Update on new environments

### Maintenance docs
- Update ambiguities when resolved
- Update change guide on process changes
- Update this file on doc structure changes

## Cross-reference maintenance

| Link type | Check method |
|-----------|--------------|
| Relative markdown links | Click in VS Code / GitHub |
| Anchor links | Verify heading exists |
| External URLs | Click to verify |

## Documentation quality checklist

- [ ] All files have proper headings
- [ ] No broken internal links
- [ ] Code snippets match actual code
- [ ] Tables render correctly
- [ ] No TODO/FIXME in docs
- [ ] Consistent terminology
- [ ] Diagrams (Mermaid) render

## Tools

| Task | Tool |
|------|------|
| Edit markdown | VS Code |
| Preview markdown | VS Code preview (Ctrl+Shift+V) |
| Check links | Manual or markdown-link-check |
| Spell check | VS Code spell checker |
| Format | Prettier (if configured) |

## No documentation build

- No static site generator
- No docs deployment
- Docs live in repo only
- GitHub renders markdown natively

## Future documentation improvements

| Improvement | Effort |
|-------------|--------|
| Auto-generate API docs from JSDoc | Medium |
| Add architecture diagrams (Mermaid) | Low |
| Add sequence diagrams for flows | Low |
| Generate dependency graph automatically | Medium |
| Add search index | High |
| Deploy docs to GitHub Pages | Low |