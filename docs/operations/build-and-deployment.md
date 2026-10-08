# Build and Deployment

## Build process

**None.** This is a static site with no build step.

| Aspect | Status |
|--------|--------|
| Build tool | None |
| Bundler | None |
| Transpiler | None |
| Minifier | None |
| Linter | None |
| Type checker | None |
| Test runner | None |
| Package manager | None |

## Source files

| File | Purpose |
|------|---------|
| `index.html` | Application shell |
| `js/languages.js` | Language mappings |
| `js/exonyms-retriever.js` | Application logic |
| `css/custom.css` | Custom styles |

## Deployment target

**GitHub Pages** (static hosting).

### Deployment method

1. Push to `main` branch (or `gh-pages` branch)
2. GitHub Pages serves `index.html` at `https://username.github.io/repo/`

### No CI/CD pipeline

| Pipeline | Status |
|----------|--------|
| GitHub Actions | None configured |
| Build step | None |
| Test step | None |
| Deploy step | GitHub Pages auto-deploy |

## File structure for deployment

```
/
├── index.html          (entry point)
├── LICENSE             (legal)
├── README.md           (documentation)
├── js/
│   ├── exonyms-retriever.js
│   └── languages.js
├── css/
│   └── custom.css
└── docs/               (documentation, not deployed)
    └── ...
```

## CDN dependencies

| Resource | URL | Purpose |
|----------|-----|---------|
| jQuery | `code.jquery.com` | DOM manipulation |
| jQuery Easing | `cdnjs.cloudflare.com` | Animation easing |
| Bootstrap CSS | `cdn.jsdelivr.net` | Styles |
| Bootstrap JS | `cdn.jsdelivr.net` | Components |
| Font Awesome | `use.fontawesome.com` | Icons |
| Google Fonts | `fonts.googleapis.com` | Typography |
| StartBootstrap CSS | `startbootstrap.github.io` | Template styles |
| StartBootstrap JS | `startbootstrap.github.io` | Template scripts |

## External API dependencies

| API | URL | Purpose |
|-----|-----|---------|
| Exonyms | `hmlendea.go.ro` | Exonym data |
| WikiData | `wikidata.org` | GeoNames ID lookup |
| GeoNames | `api.geonames.org` | Fallback GeoNames ID |

## No build configuration

| File | Exists? |
|------|---------|
| `package.json` | No |
| `webpack.config.js` | No |
| `rollup.config.js` | No |
| `vite.config.js` | No |
| `tsconfig.json` | No |
| `.eslintrc` | No |
| `jest.config.js` | No |

## Deployment checklist

| Step | Command/Action |
|------|----------------|
| 1. Commit changes | `git add . && git commit -m "..."` |
| 2. Push to main | `git push origin main` |
| 3. Verify GitHub Pages | Check `Settings → Pages` |
| 4. Test live site | Open deployed URL |
| 5. Verify CDN loads | Network tab |
| 6. Test API calls | Console logs |

## No build artifacts

| Artifact | Generated? |
|----------|------------|
| Minified JS | No |
| Bundled JS | No |
| Source maps | No |
| CSS bundle | No |
| HTML minified | No |
| Asset hashes | No |

## File sizes (uncompressed)

| File | Size |
|------|------|
| `index.html` | ~5KB |
| `js/exonyms-retriever.js` | ~10KB |
| `js/languages.js` | ~10KB |
| `css/custom.css` | ~2KB |
| **Total** | **~27KB** |

## CDN load times

| Resource | Typical load time |
|----------|-------------------|
| jQuery | 50-200ms |
| Bootstrap CSS | 50-150ms |
| Bootstrap JS | 50-150ms |
| Font Awesome | 50-100ms |
| Google Fonts | 50-100ms |
| StartBootstrap CSS | 50-100ms |
| StartBootstrap JS | 50-100ms |

## No optimization

| Optimization | Status |
|--------------|--------|
| Gzip compression | Host-dependent |
| Brotli compression | Host-dependent |
| HTTP/2 | Host-dependent |
| Resource hints | No (`<link rel="preload">`) |
| Critical CSS | No |
| Lazy loading | No |
| Code splitting | No |
| Tree shaking | No |

## Deployment environment

| Aspect | Value |
|--------|-------|
| Host | GitHub Pages |
| Protocol | HTTPS |
| Domain | `username.github.io/repo` |
| Custom domain | Optional |
| SSL | Automatic (GitHub) |
| CDN | GitHub's global CDN |

## Rollback procedure

| Step | Action |
|------|--------|
| 1 | `git checkout <previous-commit>` |
| 2 | `git push origin main --force` |
| 3 | Wait for GitHub Pages to update |

## No versioning

| Artifact | Versioned? |
|----------|------------|
| API endpoints | No |
| Language mappings | No |
| Transform algorithm | No |
| Output format | No |

## Future build considerations

| Feature | When to add |
|---------|-------------|
| Minification | When payload > 100KB |
| Bundling | When > 5 external scripts |
| TypeScript | When codebase > 1000 LOC |
| Testing | When bugs increase |
| CI/CD | When team grows |
| Linting | When code quality degrades |