# getspinbook.com (static marketing)

Plain **HTML + CSS** (and a small inline **JS** block only on `download.html` for the store redirect). No bundler, no generator, no npm scripts in this folder.

- **English (default):** `index.html`, `privacy.html`, `account-deletion.html`, `contact.html`, `download.html` at the root.
- **Other languages:** same filenames under `de/`, `fr/`, etc.

Edit files directly. Store links, copy, legal text, meta tags, and QR target URL are all **hardcoded** in the HTML. Shared layout/styling lives in `css/site.css`.

Home pages use the **official** store images, **self-hosted** in `assets/`: `badge-google-play.png` (Google’s `en_badge_web_generic.png`) and `badge-app-store.svg` (Apple’s black **Download on the App Store** badge, English). Both are unmodified artwork — the Apple SVG only has its root `width`/`height` scaled, with the `viewBox` untouched. To localize badges per language, download the localized artwork from [Google Play badge guidelines](https://play.google.com/intl/en_us/badges/) and Apple’s App Store marketing resources into `assets/` and swap the `src` in each `index.html`.

The landing-page screenshot slider (injected by `js/analytics.js`, styled in `css/site.css`) uses the **localized App Store screenshots** from `store/apple/screenshot/<App Store locale>/APP_IPHONE_65/`, downscaled to 900px-wide WebP and stored per site language in `assets/screenshots/<lang>/1.webp` … `8.webp` (8 shots, in App Store order). Those images already carry their own headline and subtitle, so the slider renders them **as-is** — no caption is drawn under a slide. `hi` has no localized store screenshots and falls back to `assets/screenshots/en/`. When the store screenshots are refreshed, regenerate these files at the same size and keep the numbering.

Below the slider, each `index.html` has a static **features section** (`#features`, six cards with inline SVG icons). It is plain HTML so search engines index it; the slider inserts itself above it.

`faq.html` in every language is the in-app **Settings → How it works** guide: the questions and answers are copied from `settings.howItWorksFaq` in `src/i18n/locales/<lang>.js`, in the order of `HOW_IT_WORKS_FAQ_IDS` in `src/screens/AppSettingsScreen.js`, plus a `FAQPage` JSON-LD block with the same text. When that app copy changes, update both the page and its JSON-LD. The footer lists it in the Blog column.

`rubber-lifespan.html` in every language is a guide article ("How often should you replace table tennis rubbers?"). Its hours per level (130/100/90/80) and the pips/anti multipliers (≈1.8×/2.5×, rounded to ranges in the text) mirror the app's wear model in `src/utils/skillLevelHours.js` and `src/utils/lifespan.js` — if that model changes, update the article. The level names in its table are the app's `skillLevels` strings. Each language's FAQ links to it just above the store badges, and it opens with a "← Blog" link.

`beat-your-opponents.html` in every language is a guide article ("Table tennis notes that win the rematch") on keeping notes about opponents. Its SpinBook section describes the app's public/private activity notes, the opponent's FH/BH rubber type in the activity form, and the player page (head-to-head record, notes from all shared activities, general note) — if those features change, update the article.

**Footer** (every page except `404.html`): three columns — **Blog** (heading links to `blog.html`; then each article and the FAQ), **Support** (contact, account deletion) and **Legal** (privacy, cookie settings). The cookie banner takes its privacy link from the footer, so keep a `privacy.html` link there.

**Blog:** `blog.html` in every language lists the articles as cards, newest first, with `Blog` JSON-LD naming each post. To add an article, in all 19 languages:
1. create `<slug>.html` (copy `rubber-lifespan.html`: `.guide-doc` article, "← Blog" back link, full hreflang group, `Article` JSON-LD, own title and description, store badges at the end);
2. add a card to the top of `blog.html` (title on the left, hero image thumbnail on the right, same markup as the existing cards) and a `BlogPosting` entry to its JSON-LD;
3. add a short link to the footer's Blog column on every page;
4. add the pages to `sitemap.xml`.

Any new page needs the full set of `<link rel="alternate" hreflang>` tags (all 19 languages plus `x-default`) in its `<head>`, matching every other language version of that page, and an entry in `sitemap.xml`.

The language menu uses **no flags**: each entry is the uppercase ISO 639-1 code plus the language's own name (`EN - English`, `UK - Українська`); the closed picker shows only the current code, with the full name as its `aria-label`.

**No page loads anything from a third-party origin.** Badges, CSS and JS are all same-origin, so no visitor data reaches Google, Apple or a CDN before consent. Keep it that way — if you add a remote font, badge or script, it fires before the cookie banner is answered. The only external request is Google Analytics, loaded by `js/analytics.js` **only after** the visitor accepts the cookie banner (see `cookie-settings.html` for the per-language settings page).

When you split this into its own repository, copy the whole `getspinbook/` tree as-is.
