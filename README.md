# getspinbook.com (static marketing)

Plain **HTML + CSS** (and a small inline **JS** block only on `download.html` for the store redirect). No bundler, no generator, no npm scripts in this folder.

- **English (default):** `index.html`, `privacy.html`, `account-deletion.html`, `contact.html`, `download.html` at the root.
- **Other languages:** same filenames under `de/`, `fr/`, etc.

Edit files directly. Store links, copy, legal text, meta tags, and QR target URL are all **hardcoded** in the HTML. Shared layout/styling lives in `css/site.css`.

Home pages use the **official** store images: Google’s `en_badge_web_generic.png` from `play.google.com` and Apple’s black **Download on the App Store** badge from `tools.applemediaservices.com` (English). To localize badges per language, swap the `src` URLs in each `index.html` to match [Google Play badge guidelines](https://play.google.com/intl/en_us/badges/) and Apple’s App Store marketing resources.

Language menu flags are **24×18 PNGs** from [flagcdn.com](https://flagcdn.com) (same mapping as `src/utils/languageFlagCdn.js` in the app), so they show correctly on Linux/WSL where Unicode flag emoji often do not.

When you split this into its own repository, copy the whole `getspinbook/` tree as-is.
