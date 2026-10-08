# Inspect, Edit, Delete

## Overview

The application has minimal inspect/edit/delete capabilities. It is a read-only data retrieval tool with no persistent storage.

## Inspect

### Input inspection

| Element | Inspection method |
|---------|-------------------|
| WikiData ID input | View `#wikiDataId` value in DevTools Elements tab |
| Output XML | View `#location` value in DevTools Elements tab |
| Console logs | Open DevTools Console |
| Network requests | Open DevTools Network tab |

### Runtime inspection

```javascript
// In browser console:
languages                    // View language mapping object
exonymsApiBaseUrl            // "https://hmlendea.go.ro/apis/exonyms-api"
wikiDataBaseUrl              // "https://www.wikidata.org"
geoNamesBaseUrl              // "http://api.geonames.org"
geoNamesUsername             // "geonamesfreeaccountt"
$('#wikiDataId').val()       // Current input value
$('#location').val()         // Current output value
```

### Network inspection

| Request | Tab | Details |
|---------|-----|---------|
| WikiData API | Network | `Special:EntityData/Q{id}.json` |
| GeoNames API | Network | `searchJSON?username=...&q=Q{id}` |
| Exonyms API | Network | `Exonyms?wikiDataId=Q{id}&geoNamesId={id}` |

All requests are synchronous XHR — appear in Network tab but block main thread.

### Response inspection

Click any request in Network tab → Response tab to view JSON.

## Edit

### Editable elements

| Element | Editable? | Method |
|---------|-----------|--------|
| WikiData ID input | Yes | Type in input field |
| Output textarea | Yes | Click and type (not recommended) |
| Language mapping | No | Edit `js/languages.js` and reload |
| API endpoints | No | Edit `js/exonyms-retriever.js` constants and reload |
| Transform algorithm | No | Edit `js/exonyms-retriever.js` and reload |

### Editing output XML

**Not recommended.** The textarea is not read-only, allowing manual edits, but:

- No validation
- No sync back to internal state
- Copy button copies whatever is in textarea
- Changes lost on next retrieval or clear

### Editing source code

To modify behaviour, edit source files and reload page:

| File | Purpose | Reload required |
|------|---------|-----------------|
| `index.html` | Structure, UI, script order | Yes |
| `js/languages.js` | Language mappings | Yes |
| `js/exonyms-retriever.js` | All logic | Yes |
| `css/custom.css` | Styling | Yes (or hard refresh) |

No build step — changes take effect on reload.

## Delete

### Clear operation

```javascript
function clearPage() {
    $('#wikiDataId').val('Q20717572');
    $('#location').val('');
}
```

| Aspect | Detail |
|--------|--------|
| Trigger | Clear button click |
| Effect | Resets input to default, clears output |
| Confirmation | None |
| Undo | None |
| Keyboard shortcut | None |

### No other delete operations

| Operation | Exists? |
|-----------|---------|
| Delete individual name line | No |
| Delete language from output | No (manual edit only) |
| Delete API configuration | No |
| Delete language mapping | No (edit source) |
| Clear browser cache | Manual (DevTools) |
| Clear localStorage | N/A (not used) |
| Clear sessionStorage | N/A (not used) |
| Clear cookies | N/A (not used) |

## State inspection summary

| State | Location | Inspect via |
|-------|----------|-------------|
| Input value | `#wikiDataId` DOM | DevTools Elements / `$('#wikiDataId').val()` |
| Output value | `#location` DOM | DevTools Elements / `$('#location').val()` |
| Language map | `window.languages` | Console: `languages` |
| API constants | `window` globals | Console: `exonymsApiBaseUrl`, etc. |
| Network logs | DevTools Network | Network tab |
| Console logs | DevTools Console | Console tab |
| JavaScript errors | DevTools Console | Console tab (red) |

## No persistent state to delete

| Storage | Used? |
|---------|-------|
| localStorage | No |
| sessionStorage | No |
| IndexedDB | No |
| Cookies | No |
| Cache API | No |
| Service Worker | No |

## Reset to initial state

| Method | Effect |
|--------|--------|
| Click Clear button | Resets input + output |
| Refresh page (F5) | Full reset (reloads all scripts) |
| Hard refresh (Ctrl+Shift+R) | Full reset + bypass cache |
| Close/reopen tab | Full reset |

## Debugging tips

1. **Open DevTools before clicking Retrieve** — Network tab won't show sync XHR if opened after
2. **Use `debugger` statement** — Add in source, reload, triggers breakpoint
3. **Monitor console** — All `fetchData` URLs logged; errors appear here
4. **Inspect `languages` object** — Verify mapping before debugging name generation
5. **Check mixed content warning** — GeoNames uses HTTP; shows in Console