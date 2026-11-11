[![Donate](https://img.shields.io/badge/-%E2%99%A5%20Donate-%23ff69b4)](https://hmlendea.go.ro/funding)
[![Website](https://img.shields.io/badge/Website-Visit-blue)](https://hmlendea.github.io/mcn-exonyms-retriever)
[![License](https://img.shields.io/github/license/hmlendea/mcn-exonyms-retriever)](https://github.com/hmlendea/mcn-exonyms-retriever/blob/master/LICENSE)

# MCN Exonyms Retriever

The **MCN Exonyms Retriever** is a lightweight web tool that fetches exonym data for a given MCN (Minecraft) location. It queries the public Exonyms API and, when possible, enriches the result with GeoNames identifiers.

## 📑 Table of Contents

- [Capabilities](#-capabilities)
- [Usage](#-usage)
- [Known Limitations](#-known-limitations)
- [Privacy and Data](#-privacy-and-data)
- [Contributing](#-contributing)
- [Code of Conduct](#-code-of-conduct)
- [Security](#-security)
- [Support](#-support)
- [Architecture](#-architecture)
- [Documentation](#-documentation)
- [Project Engagement](#-project-engagement)
- [License](#-license)

## ✨ Capabilities

- Retrieve exonyms in multiple languages from the [Exonyms API](https://exonyms.nucilandia.ro).
- Resolve a WikiData ID to a GeoNames ID via the Wikidata or GeoNames services.
- Generate an XML snippet that can be pasted into MCN configuration files.

## 🚀 Usage

Open the tool in a browser:

```text
https://hmlendea.github.io/mcn-exonyms-retriever/index.html
```

1. Enter a WikiData ID (e.g., `Q20717572`).
2. Click **Retrieve Exonyms**.
3. The XML output appears in the textarea; copy it to your clipboard with the **Copy** button.

## ⚠️ Known Limitations

- The tool relies on external APIs; if they are unavailable, retrieval will fail.
- GeoNames lookup may return `null` for some WikiData IDs.

## 🛡️ Privacy and Data

MCN Exonyms Retriever runs entirely in the browser, stores no personal data, and transmits no data to the project maintainers.

For the detailed description of how the application handles privacy and personal data, see the [Privacy Statement](./PRIVACY.md).

## 🤝 Contributing

You are welcome to submit any suggestion, feedback, or modification to this project.

When doing so, please:
- Maintain cross-platform compatibility
- Submit focused pull requests that conform to the existing code style
- Maintain your branch synchronised with `master`
- Revise the documentation when functionality changes
- Raise a new [issue](https://github.com/hmlendea/mcn-exonyms-retriever/issues) for problems or suggestions

See the [Contributing Guidelines](./CONTRIBUTING.md) for details on how to report issues, suggest enhancements, and submit changes.

## 📜 Code of Conduct

See the [Code of Conduct](./CODE_OF_CONDUCT.md) for the standards of conduct expected in all project spaces.

## 🔒 Security

MCN Exonyms Retriever follows coordinated disclosure for security vulnerabilities.

For information on reporting security vulnerabilities, see the [Security Policy](./SECURITY.md).

## 💬 Support

For support, please [open an issue](https://github.com/hmlendea/mcn-exonyms-retriever/issues)

## 🏗️ Architecture

MCN Exonyms Retriever is a static client-side web tool with no server-side component.

See the [Architecture Documentation](./ARCHITECTURE.md) for the system context, principal components, runtime flows, ownership boundaries, dependencies, constraints, and extension points.

## 📚 Documentation

| Resource | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | High-level architecture, system context, runtime flow, and deployment model |
| [Security Policy](./SECURITY.md) | Vulnerability reporting and supported versions |
| [Privacy Statement](./PRIVACY.md) | Data-handling behaviour and external integrations |
| [Contributing Guidelines](./CONTRIBUTING.md) | Issue reporting, enhancement suggestions, and code contribution process |
| [Code of Conduct](./CODE_OF_CONDUCT.md) | Standards of conduct for project spaces |
| [Documentation Index](./docs/INDEX.md) | Complete documentation catalogue |

## 💝 Project Engagement

Discovered a problem with MCN Exonyms Retriever or have a suggestion for it? [Open an issue](https://github.com/hmlendea/mcn-exonyms-retriever/issues)!

If you find this project useful, consider [funding it](https://hmlendea.go.ro/funding) or starring ⭐️ it on GitHub!

[![Donate](https://raw.githubusercontent.com/hmlendea/readme-assets/master/donate_generic.png)](https://hmlendea.go.ro/funding)

## 📄 License

This project is being distributed under the `GNU General Public Licence v3` or later.
See [LICENSE](./LICENSE) for additional information.
