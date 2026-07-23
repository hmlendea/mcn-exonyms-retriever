[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://gnu.org/licenses/gpl-3.0)

# MCN Exonyms Retriever

The **mcn‑exonyms‑retriever** is a lightweight web tool that fetches exonym data for a given MCN (Minecraft) location. It queries the public Exonyms API and, when possible, enriches the result with GeoNames identifiers.

## Features
- Retrieve exonyms in multiple languages from the [Exonyms API](https://hmlendea.go.ro/apis/exonyms-api).
- Resolve a WikiData ID to a GeoNames ID via the Wikidata or GeoNames services.
- Generate an XML snippet that can be pasted into MCN configuration files.

## Usage
Open the tool in a browser:

```text
https://hmlendea.github.io/mcn-exonyms-retriever/index.html
```
1. Enter a WikiData ID (e.g., `Q20717572`).
2. Click **Retrieve Exonyms**.
3. The XML output appears in the textarea; copy it to your clipboard with the **Copy** button.

## Known Limitations
- The tool relies on external APIs; if they are unavailable, retrieval will fail.
- GeoNames lookup may return `null` for some WikiData IDs.

## Contributing
You are welcome to bring any suggestion, feedback or modification to this project.

When doing so, please:
- Maintain cross‑platform compatibility.
- Keep the public contract intact unless a breaking change is intentional.
- Revise the documentation when behaviour changes.
- Add unit tests for any new or changed functionality.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details on contributing to this project.

## Support
If you encounter an issue, please open a ticket in the GitHub repository. For general questions, feel free to reach out via the project's discussion forum or contact the maintainer directly.

## License
This project is licensed under the GNU General Public Licence v3 – see the [LICENSE](./LICENSE) file for details.