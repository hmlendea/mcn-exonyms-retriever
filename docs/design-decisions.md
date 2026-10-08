# Design Decisions

This document records key architectural and design choices with their rationale.

## 1. Static SPA with no build step

**Decision:** Deploy source files directly as a static site with no bundler, transpiler, or build process.

**Rationale:**
- Zero infrastructure complexity
- Immediate deployment via GitHub Pages
- No dependency on Node.js, npm, or build tools
- Source code is directly inspectable in browser DevTools

**Trade-offs:**
- No minification or tree-shaking
- No TypeScript or modern ES module support
- Synchronous XHR blocks UI (see Decision 3)
- No automated testing pipeline

## 2. Synchronous XMLHttpRequest (XHR)

**Decision:** Use `XMLHttpRequest` with `async: false` (`request.open('GET', url, false)`) for all API calls.

**Rationale:**
- Simplifies control flow: sequential, blocking calls read like synchronous code
- No callback hell or Promise chaining needed
- `fetchData()` returns parsed JSON directly or throws

**Trade-offs:**
- **Blocks the main thread** — UI freezes during each API call (3 sequential calls = ~1-3s total freeze)
- Deprecated in modern browsers; may be removed in future
- No timeout control (browser default only)
- Cannot show loading indicators during requests
- Violates modern web performance best practices

**Alternatives considered:**
- `fetch()` with `async/await` — would require restructuring all callers
- `XMLHttpRequest` with `async: true` + callbacks — more complex flow control

## 3. Global namespace via script load order

**Decision:** No module system (ES modules, CommonJS, AMD). Scripts loaded in order via `<script>` tags; functions and data attached to global `window`.

**Rationale:**
- Works without any build tooling
- Compatible with all browsers supporting `<script>`
- Simple mental model: load order = dependency order

**Trade-offs:**
- Global namespace pollution
- No explicit dependency declaration
- Load order must be maintained manually in `index.html`
- No tree-shaking or dead code elimination
- Difficult to test in isolation

## 4. jQuery for DOM manipulation

**Decision:** Use jQuery 3.5.1 for DOM selection, event handling, and AJAX (though AJAX uses raw XHR).

**Rationale:**
- Familiar API for DOM manipulation
- Bootstrap 4 requires jQuery
- Concise syntax for `$('#id').val()` etc.

**Trade-offs:**
- Adds ~30KB gzipped dependency
- Modern browsers have native `document.querySelector`, `fetch`, `classList`
- jQuery 3.5.1 is outdated (current is 3.7+)

## 5. Bootstrap 4.5.3 for UI framework

**Decision:** Use Bootstrap 4 via CDN for layout, components, and styling.

**Rationale:**
- Rapid UI development with pre-built components
- Responsive grid system
- Familiar to many developers

**Trade-offs:**
- Large CSS/JS payload (~50KB gzipped CSS + JS)
- Bootstrap 4 is EOL (v5 is current)
- jQuery dependency required
- Custom CSS (`custom.css`) is minimal/empty

## 6. Hardcoded API endpoints and credentials

**Decision:** API base URLs and GeoNames username are hardcoded constants in `exonyms-retriever.js`.

**Rationale:**
- No configuration system exists
- Simplifies deployment (no env files, no build-time substitution)
- APIs are public and stable

**Trade-offs:**
- Cannot change endpoints without code modification
- GeoNames demo account is shared and rate-limited
- No environment-specific configuration (dev/staging/prod)
- HTTP GeoNames endpoint causes mixed-content warnings on HTTPS pages

## 7. Language mapping as static JavaScript object

**Decision:** `languages.js` exports a plain object with ~200 key-value pairs.

**Rationale:**
- Zero parsing overhead at runtime
- Direct property access: `languages[code]`
- No JSON parsing or fetch required

**Trade-offs:**
- ~15KB of JavaScript parsed on every page load
- No lazy loading or code splitting
- Difficult to maintain (manual edits to large object)
- No validation of language codes

## 8. Special-case language variant handling

**Decision:** `getNameLines()` explicitly handles 10 language variant pairs with custom logic.

**Rationale:**
- Some languages have multiple WikiData codes mapping to same or related MCN identifiers
- Variant pairs need custom deduplication logic (e.g., prefer one variant when names differ)

**Trade-offs:**
- Hardcoded list; not data-driven
- Adding new variants requires code changes
- Logic duplicated across variant pairs
- Sorting applied after variant handling may reorder unexpectedly

## 9. XML generation via string concatenation

**Decision:** Build XML output via string concatenation in `retrieveExonyms()` and `getNameLine()`.

**Rationale:**
- Simple, no XML library needed
- Output format is fixed and simple
- Direct control over formatting/indentation

**Trade-offs:**
- No XML escaping — if exonym names contain `&`, `<`, `>`, `"`, output is invalid XML
- Brittle: missing newlines or indentation breaks readability
- No schema validation

## 10. No input validation

**Decision:** WikiData ID input is used directly in API URLs without validation.

**Rationale:**
- WikiData IDs follow predictable pattern (`Q` + digits)
- APIs return 404/errors for invalid IDs anyway
- Simplifies code

**Trade-offs:**
- User typos cause confusing API errors
- Potential for injection if ID contains unexpected characters (though URL path segment)
- No UX feedback for invalid format

## 11. Clipboard copy via `document.execCommand('copy')`

**Decision:** Use deprecated `execCommand('copy')` on a temporary textarea.

**Rationale:**
- Works in all target browsers (including older ones)
- No Clipboard API permission prompts
- Simple implementation

**Trade-offs:**
- `execCommand` is deprecated and may be removed
- Requires temporary DOM element
- Synchronous; blocks during copy

## 12. No Content Security Policy (CSP)

**Decision:** No CSP header or meta tag.

**Rationale:**
- Inline `onclick` handlers would require `unsafe-inline`
- CDN scripts would need hashes or nonces
- Static hosting (GitHub Pages) doesn't easily support custom headers

**Trade-offs:**
- No protection against XSS via injected scripts
- Mixed content (HTTP GeoNames) not blocked
- Supply-chain attacks on CDNs not mitigated

## 13. No automated tests

**Decision:** No unit tests, integration tests, or E2E tests.

**Rationale:**
- Small codebase (~300 lines JS)
- Manual testing via browser is fast
- No CI pipeline configured

**Trade-offs:**
- Regressions not caught automatically
- Refactoring risky (e.g., changing XHR to fetch)
- No documentation of expected behaviour via tests

## 14. GitHub Pages deployment

**Decision:** Deploy via GitHub Pages from `master` branch.

**Rationale:**
- Free, integrated with repository
- Automatic HTTPS
- Custom domain support
- No separate hosting account needed

**Trade-offs:**
- Limited to static files only
- No server-side logic possible
- Build step not supported (must commit built files or use source directly)
- Jekyll processing may interfere (mitigated by `.nojekyll` or config)