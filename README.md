[![Donate](https://img.shields.io/badge/%E2%99%A5%20Donate-%23ff69b4)](https://hmlendea.go.ro/funding)
[![Website](https://img.shields.io/badge/Website-Visit-blue)](https://hmlendea.github.io/mcn-exonyms-retriever)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://gnu.org/licenses/gpl-3.0)

# MCN Exonyms Retriever

The **mcn‑exonyms‑retriever** is a lightweight web tool that fetches exonym data for a given MCN (Minecraft) location. It queries the public Exonyms API and, when possible, enriches the result with GeoNames identifiers.

## 📑 Table of Contents
- [Features](#features)
- [Usage](#usage)
- [Known Limitations](#known-limitations)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## ✨ Features
- Retrieve exonyms in multiple languages from the [Exonyms API](https://hmlendea.go.ro/apis/exonyms-api).
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

## 🤝 Contributing
You are welcome to bring any suggestion, feedback or modification to this project.

When doing so, please:
- Maintain cross‑platform compatibility.
- Maintain the pull requests as focused and consistent with the existing code style.
- Maintain your branch up‑to‑date with `master`.
- Revise the documentation when behaviour changes.

## 💝 Helping out

If you encounter an issue, please open a ticket in the GitHub repository. For general questions, feel free to reach out via the project's discussion forum or contact the maintainer directly.

## 🔒 Privacy

See [PRIVACY.md](./PRIVACY.md) for data-handling details.

## 🛡️ Security

See [SECURITY.md](./SECURITY.md) for vulnerability reporting and supported versions.

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for system architecture, data flows, and deployment details.

## 📄 License

This project is being distributed under the `GNU General Public Licence v3` or later.
See [LICENSE](./LICENSE) for details.
