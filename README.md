# getspinbook.com (static marketing)

Plain **HTML + CSS** (and a small inline **JS** block only on `download.html` for the store redirect). No bundler, no generator, no npm scripts in this folder.

- **English (default):** `index.html`, `privacy.html`, `account-deletion.html`, `contact.html`, `download.html` at the root.
- **Other languages:** same filenames under `de/`, `fr/`, etc.

Edit files directly. Store links, copy, legal text, meta tags, and QR target URL are all **hardcoded** in the HTML. Shared layout/styling lives in `css/site.css`.

Home pages use the **official** store images, **self-hosted** in `assets/`: `badge-google-play.png` (Google’s `en_badge_web_generic.png`) and `badge-app-store.svg` (Apple’s black **Download on the App Store** badge, English). Both are unmodified artwork — the Apple SVG only has its root `width`/`height` scaled, with the `viewBox` untouched. To localize badges per language, download the localized artwork from [Google Play badge guidelines](https://play.google.com/intl/en_us/badges/) and Apple’s App Store marketing resources into `assets/` and swap the `src` in each `index.html`.

The landing-page screenshot slider (injected by `js/analytics.js`, styled in `css/site.css`) uses the **localized App Store screenshots** from `store/apple/screenshot/<App Store locale>/APP_IPHONE_65/`, downscaled to 900px-wide WebP and stored per site language in `assets/screenshots/<lang>/1.webp` … `8.webp` (8 shots, in App Store order). Those images already carry their own headline and subtitle, so the slider renders them **as-is** — no caption is drawn under a slide. `hi` has no localized store screenshots and falls back to `assets/screenshots/en/`. When the store screenshots are refreshed, regenerate these files at the same size and keep the numbering.

Language menu flags are **24×18 PNGs** in `assets/flags/`, originally from [flagcdn.com](https://flagcdn.com) (same mapping as `src/utils/languageFlagCdn.js` in the app), so they show correctly on Linux/WSL where Unicode flag emoji often do not.

**No page loads anything from a third-party origin.** Badges, flags, CSS and JS are all same-origin, so no visitor data reaches Google, Apple or a CDN before consent. Keep it that way — if you add a remote font, badge or script, it fires before the cookie banner is answered. The only external request is Google Analytics, loaded by `js/analytics.js` **only after** the visitor accepts the cookie banner (see `cookie-settings.html` for the per-language settings page).

When you split this into its own repository, copy the whole `getspinbook/` tree as-is.
