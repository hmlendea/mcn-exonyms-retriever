# Browser State and Localisation

## File

`js/languages.js`

## Responsibility

Static language code → MCN language identifier mapping. Provides the canonical list of ~200 languages supported by the application.

## Structure

```javascript
var languages = {
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "be": "Belarussian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "ny": "Chichewa",
    "zh": "Chinese",
    "zh-hans": "Chinese",
    "zh-hant": "Chinese_Traditional",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "tl": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian_Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jw": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "rw": "Kinyarwanda",
    "ko": "Korean",
    "ku": "Kurdish",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mn": "Mongolian",
    "my": "Myanmar",
    "ne": "Nepali",
    "no": "Norwegian",
    "nb": "Norwegian",
    "nn": "Norwegian_Nynorsk",
    "or": "Odia",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "pt-br": "Portuguese_Brazilian",
    "pa": "Punjabi",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "gd": "Scots_Gaelic",
    "sr": "Serbian",
    "sr-el": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sundanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tg": "Tajik",
    "ta": "Tamil",
    "tt": "Tatar",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "tk": "Turkmen",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "ug": "Uyghur",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu",
    // Historical/constructed
    "la": "Latin",
    "grc": "Ancient_Greek",
    "ang": "Old_English",
    "fro": "Old_French",
    "goh": "Old_High_German",
    "non": "Old_Norse",
    "peo": "Old_Persian",
    "la": "Latin",
    // Additional variants
    "be-tarask": "Belarussian_Before1933",
    "zh-classical": "Chinese_Classical",
    "zh-min-nan": "Chinese_Min_Nan",
    "zh-yue": "Chinese_Yue",
    "crh": "Crimean_Turkish",
    "dsb": "Lower_Sorbian",
    "hsb": "Upper_Sorbian",
    "ksh": "Ripuarian",
    "nds": "Low_German",
    "nds-nl": "Dutch_Low_Saxon",
    "pms": "Piedmontese",
    "scn": "Sicilian",
    "sc": "Sardinian",
    "vec": "Venetian",
    "vls": "West_Flemish",
    "wa": "Walloon",
    "bar": "Bavarian",
    "kbd": "Kabardian",
    "inh": "Ingush",
    "av": "Avar",
    "lez": "Lezgian",
    "tab": "Tabasaran",
    "dar": "Dargwa",
    "kum": "Kumyk",
    "nog": "Nogai",
    "os": "Ossetian",
    "ab": "Abkhazian",
    "ady": "Adyghe",
    "krc": "Karachay_Balkar",
    "sah": "Yakut",
    "tyv": "Tuvinian",
    "alt": "Altay",
    "kv": "Komi",
    "mhr": "Meadow_Mari",
    "mrj": "Hill_Mari",
    "udm": "Udmurt",
    "chm": "Mari",
    "myv": "Erzya",
    "mdf": "Moksha",
    "mns": "Mansi",
    "kca": "Khanty",
    "sel": "Selkup",
    "niv": "Nivkh",
    "ktz": "Ju",
    "ykg": "Northern_Yukaghir",
    "yux": "Southern_Yukaghir",
    "chv": "Chuvash",
    "bak": "Bashkir",
    "tat": "Tatar",
    "cv": "Chuvash",
    "sah": "Yakut",
    "tyv": "Tuvinian",
    "alt": "Altay",
    "kv": "Komi",
    "mhr": "Meadow_Mari",
    "mrj": "Hill_Mari",
    "udm": "Udmurt",
    "chm": "Mari",
    "myv": "Erzya",
    "mdf": "Moksha",
    "mns": "Mansi",
    "kca": "Khanty",
    "sel": "Selkup",
    "niv": "Nivkh",
    "ktz": "Ju",
    "ykg": "Northern_Yukaghir",
    "yux": "Southern_Yukaghir",
    "chv": "Chuvash",
    "bak": "Bashkir",
    "tat": "Tatar",
    "cv": "Chuvash"
};
```

## Key characteristics

| Aspect | Detail |
|--------|--------|
| Format | JavaScript object literal (`var languages = { ... }`) |
| Scope | Global variable `languages` |
| Entries | ~200 (exact count varies by duplicates) |
| Key format | BCP 47 language tags (mostly ISO 639-1/2/3) |
| Value format | MCN language identifiers (PascalCase with underscores) |
| Load order | Must load before `exonyms-retriever.js` |
| Mutability | Never modified at runtime |

## Language code patterns

| Pattern | Examples | Count |
|---------|----------|-------|
| ISO 639-1 (2-letter) | `en`, `fr`, `de`, `es`, `zh` | ~80 |
| ISO 639-2/3 (3-letter) | `eng`, `fra`, `deu`, `spa`, `zho` | ~0 (not used) |
| BCP 47 with region | `zh-hans`, `zh-hant`, `pt-br`, `sr-el` | ~10 |
| BCP 47 with script | `sr-el` (Latin), `sr` (Cyrillic) | ~5 |
| Historical/constructed | `la`, `grc`, `ang`, `fro` | ~10 |
| Regional/minority | `dsb`, `hsb`, `ksh`, `nds`, `pms` | ~20 |
| Caucasian languages | `ab`, `ady`, `krc`, `av`, `lez` | ~15 |
| Uralic/Siberian | `kv`, `mhr`, `mrj`, `udm`, `myv`, `mdf` | ~10 |
| Paleosiberian | `niv`, `ktz`, `ykg`, `yux` | ~5 |

## Duplicate keys (last wins)

| Key | First value | Last value |
|-----|-------------|------------|
| `la` | `Latin` | `Latin` (same) |
| `zh` | `Chinese` | `Chinese` (same) |
| `sr` | `Serbian` | `Serbian` (same) |
| `sah` | `Yakut` | `Yakut` (same) |
| `tyv` | `Tuvinian` | `Tuvinian` (same) |
| `alt` | `Altay` | `Altay` (same) |
| `kv` | `Komi` | `Komi` (same) |
| `mhr` | `Meadow_Mari` | `Meadow_Mari` (same) |
| `mrj` | `Hill_Mari` | `Hill_Mari` (same) |
| `udm` | `Udmurt` | `Udmurt` (same) |
| `chm` | `Mari` | `Mari` (same) |
| `myv` | `Erzya` | `Erzya` (same) |
| `mdf` | `Moksha` | `Moksha` (same) |
| `mns` | `Mansi` | `Mansi` (same) |
| `kca` | `Khanty` | `Khanty` (same) |
| `sel` | `Selkup` | `Selkup` (same) |
| `niv` | `Nivkh` | `Nivkh` (same) |
| `ktz` | `Ju` | `Ju` (same) |
| `ykg` | `Northern_Yukaghir` | `Northern_Yukaghir` (same) |
| `yux` | `Southern_Yukaghir` | `Southern_Yukaghir` (same) |
| `chv` | `Chuvash` | `Chuvash` (same) |
| `bak` | `Bashkir` | `Bashkir` (same) |
| `tat` | `Tatar` | `Tatar` (same) |
| `cv` | `Chuvash` | `Chuvash` (same) |

**Note:** Many duplicates appear to be copy-paste artifacts; values are identical.

## Usage in exonyms-retriever.js

```javascript
// In getNameLines():
for (var languageCode in languages) {
    nameLinesArray.push(getNameLine(exonymsApiResponse, languages[languageCode], languageCode));
}
```

- Iterates all enumerable properties
- Uses `languageCode` to query Exonyms API response
- Uses `languages[languageCode]` as MCN identifier in XML output

## Variant pairs (explicit in getNameLines)

| MCN ID 1 | Code 1 | MCN ID 2 | Code 2 |
|----------|--------|----------|--------|
| `Belarussian_Before1933` | `be-tarask` | `Belarussian` | `be` |
| `Bosnian` | `bs` | `SerboCroatian` | `sh` |
| `Chinese` | `zh-hans` | `Chinese` | `zh` |
| `Croatian` | `hr` | `SerboCroatian` | `sh` |
| `Kurdish` | `ku` | `Kurdish` | `ckd` |
| `Norwegian_Nynorsk` | `nn` | `Norwegian` | `nb` |
| `Portuguese_Brazilian` | `pt-br` | `Portuguese` | `pt` |
| `Serbian` | `sr-el` | `SerboCroatian` | `sh` |
| `Serbian` | `sr` | `SerboCroatian` | `sh` |

**Note:** `ckd` is not in `languages` object; `sh` (Serbo-Croatian) is not in `languages` object.

## Missing from languages object (referenced in variants)

| Code | Referenced in |
|------|---------------|
| `ckd` | Kurdish variant pair |
| `sh` | Bosnian, Croatian, Serbian variant pairs |

## Localisation strategy

| Aspect | Approach |
|--------|----------|
| UI language | English only (hardcoded in HTML) |
| Language names | Not displayed to user; used only as XML attribute values |
| RTL support | None |
| Pluralisation | Not applicable |
| Date/number formatting | Not applicable |
| Currency | Not applicable |
| Time zones | Not applicable |

## Extending languages

To add a new language:

1. Add entry to `languages` object in `js/languages.js`:
   ```javascript
   "new-code": "New_Language_Identifier",
   ```
2. Ensure Exonyms API supports the code
3. Test retrieval for a known WikiData ID
4. Verify XML output includes the new language

## Maintenance considerations

1. **No validation** — No schema validation of the object
2. **No deduplication** — Duplicate keys silently overwrite
3. **No external source** — Not generated from CLDR, ISO, or other standard
4. **Manual sync** — Must match Exonyms API supported languages
5. **No versioning** — No changelog for language additions/removals
6. **Encoding** — File must be saved as UTF-8 (contains no non-ASCII currently)

## Browser state

| State | Location | Persistence |
|-------|----------|-------------|
| `languages` object | Global `window.languages` | Session only (memory) |
| WikiData ID input | `#wikiDataId` value | Session only (DOM) |
| Output XML | `#location` value | Session only (DOM) |
| Console logs | DevTools console | Session only |

**No persistent storage:** No `localStorage`, `sessionStorage`, `IndexedDB`, cookies, or server-side state.