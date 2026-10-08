# Presentation Layer

## File

`index.html`

## Responsibility

- Render the complete user interface
- Load all external and internal dependencies in correct order
- Wire UI event handlers to application logic functions
- Provide default values and placeholder text

## Structure

### Navigation bar

```html
<nav class="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" id="mainNav">
  <a class="navbar-brand js-scroll-trigger" href="https://github.com/hmlendea/mcn-exonyms-retriever">
    <i class="fab fa-fw fa-github"></i> MCN Exonyms Retriever
  </a>
  <div class="collapse navbar-collapse" id="navbarResponsive">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item mx-0 mx-lg-1">
        <a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger"
           href="https://github.com/hmlendea/more-cultural-names">
          More Cultural Names
        </a>
      </li>
    </ul>
  </div>
</nav>
```

### Generator section

```html
<section class="page-section" id="generator">
  <div class="divider-custom"></div>
  <div class="container">
    <!-- WikiData ID input -->
    <div class="row">
      <div class="col-lg-3 ml-auto">
        <p><i class="fas fa-fw fa-location-dot"></i> WikiData ID:</p>
      </div>
      <div class="col-lg-9 mr-auto">
        <input class="form-control" id="wikiDataId" type="text"
               placeholder="Q20717572" value="Q20717572" />
      </div>
    </div>

    <!-- XML output textarea -->
    <div class="row">
      <div class="col-lg-3 ml-auto">
        <p><i class="fas fa-fw fa-code"></i> Location:</p>
      </div>
      <div class="col-lg-9 mr-auto">
        <textarea class="form-control" id="location" rows="24" readonly></textarea>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="row text-center">
      <div class="col-lg-12 ml-auto mr-auto">
        <span id="retrieve" class="btn btn-lg btn-outline-dark"
              onclick="retrieveExonyms()">
          <i class="fas fa-fw fa-cogs"></i> Retrieve
        </span>
        <span id="clear" class="btn btn-lg btn-outline-dark"
              onclick="clearPage()">
          <i class="fas fa-fw fa-trash"></i> Clear
        </span>
        <span id="copy" class="btn btn-lg btn-outline-dark"
              onclick="copyLocation()">
          <i class="fas fa-fw fa-copy"></i> Copy
        </span>
      </div>
    </div>
  </div>
</section>
```

## Dependencies (load order)

```html
<!-- 1. jQuery -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.12.1/jquery.easing.min.js"></script>

<!-- 2. Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- 3. StartBootstrap template -->
<link href="https://startbootstrap.github.io/startbootstrap-freelancer/css/styles.css" rel="stylesheet">

<!-- 4. Custom CSS -->
<link href="css/custom.css" rel="stylesheet">

<!-- 5. Font Awesome -->
<script src="https://use.fontawesome.com/releases/v6.4.0/js/all.js" crossorigin="anonymous"></script>

<!-- 6. Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet">

<!-- 7. Application scripts (MUST be after jQuery) -->
<script src="js/languages.js"></script>
<script src="js/exonyms-retriever.js"></script>
```

## Event wiring

All event handlers use inline `onclick` attributes on `<span>` elements acting as buttons:

| Element | Handler | Function called |
|---------|---------|-----------------|
| `#retrieve` | `onclick="retrieveExonyms()"` | `retrieveExonyms()` |
| `#clear` | `onclick="clearPage()"` | `clearPage()` |
| `#copy` | `onclick="copyLocation()"` | `copyLocation()` |

**No jQuery event binding** — handlers are direct global function calls.

## DOM elements referenced by application logic

| Selector | Element | Used by |
|----------|---------|---------|
| `#wikiDataId` | `<input>` | `clearPage()`, `retrieveExonyms()` |
| `#location` | `<textarea>` | `clearPage()`, `retrieveExonyms()`, `copyLocation()` |

## Initialisation

```javascript
// In exonyms-retriever.js
$(document).ready(function() {
    clearPage();
});
```

Runs after all scripts loaded and DOM parsed. Sets default WikiData ID and clears output.

## Styling

- **Bootstrap 4.5.3** — Grid, forms, buttons, utilities
- **StartBootstrap Freelancer** — Template styles (`styles.css`)
- **Font Awesome 6.4.0** — Icons (`fa-github`, `fa-location-dot`, `fa-code`, `fa-cogs`, `fa-trash`, `fa-copy`)
- **Google Fonts** — Montserrat (headings), Lato (body)
- **Custom CSS** — `css/custom.css` (currently minimal)

## Responsive behaviour

- Bootstrap grid: `col-lg-3`/`col-lg-9` for label/input split
- `ml-auto`/`mr-auto` for centering
- Fixed-top navbar collapses on mobile (`navbar-expand-lg`)

## Accessibility

- `readonly` on output textarea prevents editing
- Semantic `<nav>`, `<section>`, `<button>`-like spans
- Icon-only buttons have no `aria-label` (accessibility gap)
- No `label` elements for inputs (uses `<p>` with icon)

## Modification points

| Change | Files to modify |
|--------|-----------------|
| Add/remove UI fields | `index.html` |
| Change default WikiData ID | `index.html` (input `value`) |
| Change placeholder | `index.html` (input `placeholder`) |
| Change textarea rows | `index.html` (textarea `rows`) |
| Add/remove buttons | `index.html` + `exonyms-retriever.js` (new function) |
| Update CDN versions | `index.html` (script/link URLs) |
| Add CSP meta tag | `index.html` (`<meta http-equiv="Content-Security-Policy">`) |
| Change fonts | `index.html` (Google Fonts links) |