# Security Policy

This document describes the security maintenance scope, vulnerability reporting process, and disclosure expectations for the MCN Exonyms Retriever, a static client-side web tool deployed via GitHub Pages.

## 📑 Table of Contents

- Supported Versions
- Reporting a Vulnerability
- Scope
- Disclosure Policy
- Safe Harbour
- Recognition

## 🛡️ Supported Versions

Use this table to indicate which project versions currently receive security maintenance.

| Version | Distribution Channel | Supported |
|---------|--------------------|-----------|
| Latest version | GitHub Pages | ✅ |
| Latest version | GitHub Releases | ✅ |
| Preceding versions | Any distribution channel | ❌ |

## 🚨 Reporting a Vulnerability

Please do not disclose suspected vulnerabilities publicly before maintainers have had an opportunity to validate and remediate them.

To report a vulnerability:
- [GitHub Security Advisories](https://github.com/hmlendea/mcn-exonyms-retriever/security/advisories)
- Contact the maintainers directly via GitHub issues

## 📌 Scope

The subsequent report categories are in scope for this repository:
- Client-side cross-site scripting (XSS) in the application code
- Dependency vulnerabilities in bundled or CDN-loaded libraries (jQuery, Bootstrap, Font Awesome)
- Integrity or spoofing of the Exonyms API, WikiData, or GeoNames responses
- Content Security Policy bypasses
- Supply-chain compromise of CDN assets

The subsequent categories are out of scope unless explicitly stated to the contrary:
- Server-side vulnerabilities (no server-side code exists)
- Vulnerabilities in third-party APIs (Exonyms API, WikiData, GeoNames) — report to their maintainers
- Browser or platform vulnerabilities
- Denial-of-service against third-party APIs
- Social engineering or phishing unrelated to the application code

## 📢 Disclosure Policy

This project follows coordinated disclosure:
1. Vulnerabilities are investigated privately.
2. A remediation plan is prepared and validated.
3. Public disclosure is published after a fix, mitigation, or agreed risk decision is available.
4. Credit is attributed in accordance with reporter preference and project policy.

## 🧾 Safe Harbour

If your research is conducted in good faith, confined to authorised scope, and disclosed responsibly, the maintainers will not pursue action for policy-compliant activity.

## 🙏 Recognition

We appreciate responsible disclosure. Reporters who desire public attribution may be acknowledged in release notes, advisories, or a dedicated acknowledgements section.