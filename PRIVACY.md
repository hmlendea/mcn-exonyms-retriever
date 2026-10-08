# Privacy and Personal Data

This document describes the data-handling behaviour of the MCN Exonyms Retriever, a static web tool that retrieves exonym data for Minecraft locations from public APIs. The tool runs entirely in the browser, stores no personal data, and transmits no data to the project maintainers.

**Information reviewed:** 2026-10-08

## 📑 Table of Contents

- What This Document Covers
- Self-Hosted Deployments
- Data We Handle
- Processing and Use
- Storage, Retention, and Deletion
- External Processing and Integrations
- Document Changes
- Contact

## 🔎 What This Document Covers

This document describes how MCN Exonyms Retriever at https://github.com/hmlendea/mcn-exonyms-retriever handles personal data. It covers the application behaviour and verified integrations described below. Where the software is self-hosted, the instance operator may have separate responsibilities described below.

## 🏠 Self-Hosted Deployments

This project is a static HTML/JavaScript application that can be deployed and operated by any user or organisation. The project maintainers do not operate a central service; the GitHub Pages deployment at https://hmlendea.github.io/mcn-exonyms-retriever/index.html is a convenience build of the same static files.

Instance operators control their deployment's configuration, local storage, logs, backups, access controls, retention, and request handling. The project maintainers do not receive any data from self-hosted instances.

The application makes the following network requests from the user's browser:
- Exonyms API at `https://hmlendea.go.ro/apis/exonyms-api` (maintainer-operated public API)
- WikiData at `https://www.wikidata.org` (public API)
- GeoNames at `http://api.geonames.org` (public API, uses a shared demo account)
- CDN resources: jQuery, Bootstrap, Font Awesome, Google Fonts, StartBootstrap assets

Operators who self-host may replace or proxy any of these endpoints by modifying the source code. No telemetry, update checks, crash reports, or authentication flows are built into the application.

## 📥 Data We Handle

### Data Provided to the Application

- A WikiData entity ID (e.g., `Q20717572`) entered by the user in the input field. This is a public identifier for a geographic location and is not personal data.

### Data Generated or Collected by the Application

- No personal data is generated or collected automatically. The application logs API requests and responses to the browser console for debugging; these logs remain in the user's browser and are not transmitted.

### Data Received from Integrations

- Exonym names in multiple languages from the Exonyms API (public geographic names).
- GeoNames identifiers from WikiData or GeoNames (public geographic identifiers).
- No personal data is received from any integration.

## 🧭 Processing and Use

The application processes the data described above for these verified functions:
- Retrieve exonyms for a WikiData ID — WikiData ID provided by user
- Resolve WikiData ID to GeoNames ID — WikiData ID provided by user
- Generate MCN-compatible XML output — Exonym names and GeoNames ID from APIs

## 🗄️ Storage, Retention, and Deletion

- The application stores no data server-side.
- In the browser, the WikiData ID input and XML output exist only in the DOM during the session. No `localStorage`, `sessionStorage`, `IndexedDB`, or cookies are used.
- Browser console logs persist according to the user's browser settings and are controlled by the user.
- For self-hosted deployments, the instance operator controls any web server access logs, proxy logs, or CDN logs; the application itself writes no logs.

## 🔗 External Processing and Integrations

| Service or integration | Purpose | Data involved | Configuration or documentation |
|-----------------------|---------|---------------|--------------------------------|
| Exonyms API (`hmlendea.go.ro/apis/exonyms-api`) | Retrieve exonym names for a WikiData ID | WikiData ID (public) | https://hmlendea.go.ro/apis/exonyms-api |
| WikiData (`wikidata.org`) | Resolve WikiData ID to GeoNames ID via entity claims | WikiData ID (public) | https://www.wikidata.org/wiki/Wikidata:Data_access |
| GeoNames (`api.geonames.org`) | Fallback GeoNames lookup by WikiData ID | WikiData ID (public) | http://www.geonames.org/export/web-services.html |
| jQuery CDN (`code.jquery.com`) | JavaScript library | None (static asset) | https://code.jquery.com/ |
| Bootstrap CDN (`cdn.jsdelivr.net`) | CSS/JS framework | None (static asset) | https://getbootstrap.com/ |
| Font Awesome (`use.fontawesome.com`) | Icon font | None (static asset) | https://fontawesome.com/ |
| Google Fonts (`fonts.googleapis.com`) | Web fonts | None (static asset) | https://fonts.google.com/ |
| StartBootstrap (`startbootstrap.github.io`) | Template assets | None (static asset) | https://startbootstrap.com/ |

## 🛡️ Data Protection and Security

- The application is static; there is no server-side attack surface from the project code.
- All API communication uses HTTPS except the GeoNames API (HTTP only). The GeoNames demo account (`geonamesfreeaccountt`) is a public shared credential with no access to private data.
- No secrets, credentials, or personal data are embedded in the code.
- For self-hosted deployments, the instance operator is responsible for HTTPS termination, CSP headers, dependency updates, and securing any reverse proxy or CDN configuration.

## 🔄 Document Changes

Update this document when application data flows, storage, integrations, or deployment responsibilities change. The current version is published at https://github.com/hmlendea/mcn-exonyms-retriever/blob/master/PRIVACY.md.

## 📬 Contact

For questions about application data handling, contact the project maintainers via GitHub issues at https://github.com/hmlendea/mcn-exonyms-retriever/issues. For a self-hosted instance, contact the instance operator. Include the WikiData ID used and the approximate time of the request if relevant; do not send passwords, access tokens, or other secrets.