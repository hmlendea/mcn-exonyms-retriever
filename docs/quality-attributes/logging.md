# Logging

## Logging strategy

**Console-only, minimal, development-focused.** No structured logging, no log levels, no remote logging.

## Log output

| Function | Log calls | Level |
|----------|-----------|-------|
| `fetchData()` | `console.log('Fetching ' + url + ' ...')` | Info |
| `getGeoNamesId()` | `console.log('Found GeoNames ID by searching on WikiData: ' + geoNamesId)` | Info |
| `getGeoNamesId()` | `console.log('Found GeoNames ID by searching on GeoNames: ' + geoNamesId)` | Info |
| `getGeoNamesId()` | `console.error('Error:', error)` | Error |

## Log format

```
Fetching https://www.wikidata.org/wiki/Special:EntityData/Q20717572.json ...
Found GeoNames ID by searching on WikiData: 683506
Fetching https://hmlendea.go.ro/apis/exonyms-api/Exonyms?wikiDataId=Q20717572&geoNamesId=683506 ...
```

## Log destinations

| Destination | Used? |
|-------------|-------|
| Browser console | Yes (only) |
| File | No |
| Remote service | No |
| LocalStorage | No |
| IndexedDB | No |
| Server | No |

## Log levels

**Not implemented.** All logs use `console.log` or `console.error` directly.

| Level | Used? |
|-------|-------|
| Debug | No |
| Info | Yes (`console.log`) |
| Warn | No |
| Error | Yes (`console.error`) |
| Fatal | No |

## Structured logging

**Not implemented.** Logs are plain strings.

## Context enrichment

**None.** No correlation IDs, no request IDs, no user context, no timestamps (browser adds).

## Log sampling

**Not applicable.** Low volume (3-4 logs per retrieval).

## Performance impact

**Negligible.** ~4 log calls per retrieval.

## Security

| Aspect | Status |
|--------|--------|
| PII in logs | No (only public IDs and URLs) |
| Secrets in logs | No (GeoNames username in URL, but public demo) |
| Credentials in logs | No |
| Token in logs | No |

## Log retention

**Browser session only.** Cleared on page reload or tab close.

## Debugging with logs

### Enable verbose logging

Open DevTools Console (F12) before clicking Retrieve.

### Filter logs

- Type `Fetching` in filter to see only API calls
- Type `Found GeoNames` to see resolution
- Type `Error` to see errors

### Log analysis

| Pattern | Meaning |
|---------|---------|
| `Fetching ...wikiData...` | WikiData API call started |
| `Fetching ...searchJSON...` | GeoNames API call started |
| `Fetching ...Exonyms...` | Exonyms API call started |
| `Found GeoNames ID by searching on WikiData` | P1566 claim found |
| `Found GeoNames ID by searching on GeoNames` | Fallback search succeeded |
| `Error:` | Exception in `getGeoNamesId()` |

## Missing logging

| Missing | Impact |
|---------|--------|
| Request duration | Cannot measure API latency |
| Response size | Cannot monitor payload |
| Error details (Exonyms) | Uncaught exceptions only show in console |
| User actions | No audit trail |
| Performance marks | No `performance.mark()` |

## Production logging (not applicable)

| Feature | Status |
|---------|--------|
| Log aggregation | N/A |
| Alerting | N/A |
| Dashboards | N/A |
| Retention policy | N/A |
| Compliance | N/A |

## Recommendations

| Improvement | Effort |
|-------------|--------|
| Add timing to `fetchData()` | Low |
| Use `console.time`/`console.timeEnd` | Low |
| Add request ID correlation | Medium |
| Structured JSON logging | Medium |
| Remote logging endpoint | High |
| Log level configuration | Medium |