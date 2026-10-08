# Documentation Index

## Repository summary

The MCN Exonyms Retriever is a static, browser-only web application that retrieves exonym names for a given WikiData location ID and generates an XML snippet compatible with MCN (More Cultural Names) Minecraft configuration files. The application has no server-side component; all logic executes in the user's browser via JavaScript.

## Root document map

- [ARCHITECTURE.md](../ARCHITECTURE.md) — High-level architecture, system context, runtime flow, and deployment model
- [SECURITY.md](../SECURITY.md) — Vulnerability reporting and supported versions
- [PRIVACY.md](../PRIVACY.md) — Data-handling behaviour and external integrations
- [LICENSE](../LICENSE) — GNU General Public License v3
- [README.md](../README.md) — Project overview, features, usage, and contributing guidelines

## Documentation catalogue

### Architecture and overview

- [Repository overview](./repository-overview.md) — Purpose, scope, and entry points
- [Repository structure](./repository-structure.md) — Source tree layout and module organisation
- [Architecture](./architecture.md) — High-level architecture complementing root ARCHITECTURE.md
- [Design decisions](./design-decisions.md) — Key architectural and design choices with rationale
- [Dependencies](./dependencies.md) — External and internal dependencies
- [Configuration](./configuration.md) — Configuration schema, sources, and precedence

### Data and state

- [Data model](./data-model.md) — Domain entities, relationships, and XML output schema
- [State and persistence](./state-and-persistence.md) — State management, stores, and lifecycle

### Components

- [Components overview](./components/presentation.md) — Presentation layer (index.html)
- [Components overview](./components/host-and-composition.md) — Host and composition (script loading, DOM ready)
- [Components overview](./components/application-services.md) — Application logic (exonyms-retriever.js)
- [Components overview](./components/browser-state-and-localisation.md) — Language data and localisation (languages.js)
- [Components overview](./components/integration-models.md) — External API integration models

### Execution flows

- [Startup and rendering](./flows/startup-and-rendering.md) — Page load, DOM ready, and initialisation
- [Exonym retrieval flow](./flows/exonym-retrieval.md) — End-to-end exonym retrieval and XML generation

### Behaviour

- [Browse and search](./behaviours/browse-and-search.md) — User input and retrieval interaction
- [Inspect edit delete](./behaviours/inspect-edit-delete.md) — Output display and clipboard copy

### Integrations

- [Integrations](./integrations/integrations.md) — External system integrations (Exonyms API, WikiData, GeoNames, CDNs)

### Quality attributes

- [Testing](./quality-attributes/testing.md) — Test strategy, organisation, and coverage
- [Concurrency and scheduling](./quality-attributes/concurrency-and-scheduling.md) — Synchronous XHR and browser threading
- [Error handling](./quality-attributes/error-handling.md) — Error taxonomy, handling patterns, and recovery
- [Logging](./quality-attributes/logging.md) — Console logging, debug output, and redaction
- [Invariants](./quality-attributes/invariants.md) — System-wide invariants and contracts

### Operations

- [Build and deployment](./operations/build-and-deployment.md) — Build pipeline, deployment, and environments

### Maintenance

- [Ambiguities and open questions](./maintenance/ambiguities-and-open-questions.md) — Unresolved items and known gaps
- [Change guide](./maintenance/change-guide.md) — How to modify common areas safely
- [Documentation maintenance](./maintenance/documentation-maintenance.md) — How to keep docs current

### API reference

- [API reference](./api-reference/api-reference.md) — Global functions, objects, and external API contracts

## Navigation aids

- **Start here:** [Repository overview](./repository-overview.md) → [Architecture](./architecture.md) → [Repository structure](./repository-structure.md)
- **Deep dive:** [Components overview](./components/application-services.md) → [Exonym retrieval flow](./flows/exonym-retrieval.md) → [Data model](./data-model.md)
- **Flows:** [Startup and rendering](./flows/startup-and-rendering.md) → [Exonym retrieval flow](./flows/exonym-retrieval.md)

## Maintenance metadata

- **Last reviewed:** 2026-10-08
- **Owner:** MCN Exonyms Retriever maintainers
- **Coverage status:** Complete — all source files and execution paths documented
