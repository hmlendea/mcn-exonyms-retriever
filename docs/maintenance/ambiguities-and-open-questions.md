# Ambiguities and Open Questions

## Architecture ambiguities

| Question | Context | Impact |
|----------|---------|--------|
| Is this a prototype or production tool? | No tests, no build, minimal error handling | Determines investment level |
| Who is the target user? | MCN modders? General public? | Affects UX priorities |
| Expected usage volume? | Single user? Community? | Affects API rate limit concerns |
| Long-term maintenance commitment? | Single maintainer? Team? | Affects technical debt tolerance |

## API ambiguities

| Question | Context | Impact |
|----------|---------|--------|
| Exonyms API stability? | Custom API, single maintainer | May break without notice |
| Exonyms API rate limits? | Unknown | May need caching/backoff |
| Exonyms API authentication? | None currently | May change |
| GeoNames demo account longevity? | Shared `geonamesfreeaccountt` | May stop working |
| WikiData API rate limits? | Generous but not infinite | May need caching at scale |

## Data ambiguities

| Question | Context | Impact |
|----------|---------|--------|
| Language mapping completeness? | ~200 entries, some duplicates | Missing languages = no output |
| Language mapping accuracy? | Manual, not from CLDR | May not match API codes |
| Variant pair correctness? | 9 hardcoded pairs | May produce wrong XML |
| Transform algorithm correctness? | 20+ ad-hoc rules | May not match MCN expectations |
| XML output schema? | No formal schema | Consumers may reject |

## Functional ambiguities

| Question | Context | Impact |
|----------|---------|--------|
| Should output be valid XML? | No escaping currently | Invalid XML for names with `&`, `<`, `>` |
| Should UI show loading state? | Currently frozen | Poor UX |
| Should errors be user-visible? | Currently console-only | Users don't know failures |
| Should input be validated? | Currently none | Garbage in, confusing out |
| Should copy give feedback? | Currently silent | Uncertainty |

## Technical ambiguities

| Question | Context | Impact |
|----------|---------|--------|
| Browser support target? | ES5, sync XHR | Old browsers work, modern APIs unused |
| HTTPS for GeoNames? | Currently HTTP | Mixed content warning |
| Sync XHR deprecation? | Deprecated in spec | May stop working |
| `execCommand('copy')` deprecation? | Deprecated | May stop working |
| jQuery dependency? | Required by Bootstrap | Could migrate to vanilla |

## MCN integration ambiguities

| Question | Context | Impact |
|----------|---------|--------|
| MCN XML schema version? | Not specified | Output may not match |
| GameIds element purpose? | Always empty | May need population |
| Location ID format requirements? | Transform algorithm assumed | May not match MCN parser |
| Required languages? | All ~200 generated | May be excessive |
| Variant handling in MCN? | Custom logic | May not match MCN expectations |

## Maintenance ambiguities

| Question | Context | Impact |
|----------|---------|--------|
| Documentation update process? | Manual, ad-hoc | Drifts from code |
| Dependency update process? | Manual CDN URLs | Security patches missed |
| Testing process? | Manual only | Regressions likely |
| Release process? | Git push only | No versioning |

## Open technical questions

1. **Why synchronous XHR?** Simpler code, but blocks UI. Was async considered?
2. **Why no XML escaping?** Oversight or assumption names are safe?
3. **Why `execCommand('copy')`?** Clipboard API available but not used.
4. **Why jQuery?** Bootstrap 4 requires it. Bootstrap 5 doesn't.
5. **Why StartBootstrap template?** Provides UI but adds 2 CDN dependencies.
6. **Why hardcoded variant pairs?** Could be derived from language data.
7. **Why double sort in `getNameLines()`?** Main loop + variants, then sort all.
8. **Why `geoNamesUsername` in code?** Should be configurable.
9. **Why no `package.json`?** Even for documentation of dependencies.
10. **Why no README badges?** Build status, license, etc.

## Open product questions

1. **Is the default WikiData ID (Q20717572) intentional?** It's a Minecraft-related location.
2. **Should the tool support batch processing?** Multiple IDs at once?
3. **Should output be downloadable as file?** Currently only copy-paste.
4. **Should there be a history of recent lookups?** No persistence currently.
5. **Should language list be filterable?** Currently all or nothing.

## Decision needed

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Add error handling | Try/catch + UI messages | High priority |
| Add XML escaping | Replace `&`, `<`, `>`, `"` | High priority |
| Migrate to async/await | `fetch()` + promises | Medium priority |
| Add input validation | Regex for `^Q\d+$` | Medium priority |
| Add loading indicator | Spinner during XHR | Medium priority |
| Update to Bootstrap 5 | Remove jQuery dependency | Low priority |
| Add Clipboard API | Replace `execCommand` | Low priority |
| Add HTTPS GeoNames | If available | Low priority |
| Formalize language data | Generate from CLDR | Low priority |
| Add tests | Jest + JSDOM | Low priority |