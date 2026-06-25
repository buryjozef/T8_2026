# Tajchová osmička — website

Static marketing site for the **Tajchová osmička** trail-running race in Nová Baňa, Slovakia. Plain HTML/CSS/JS, no build step, no package manager — deployed as-is via GitHub Pages.

- Live domain: `tajchovaosmicka.sk` (see `CNAME`)
- Language: Slovak

## Running locally

No build tooling is required. Serve the folder with any static file server, e.g.:

```bash
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

Opening the HTML files directly via `file://` mostly works too, but some features (fetch-based things, if added later) require a real server.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home page — hero, stats, about, trail teaser cards, upcoming race CTA, gallery teaser, partners, contact |
| `trasy.html` | Route details — embedded Google My Maps, per-route description, GPX downloads |
| `program.html` | Race-day schedule, downloadable propozície (rules) PDFs, important info |
| `infoservis.html` | Past-years results/info, filterable by year (tabs) |
| `galeria.html` | Full photo gallery, filterable by year (buttons), masonry layout, lightbox |
| `clanky.html` | List of post-race summary articles (teaser cards) |
| `clanok-[rok].html` | One full article per race edition (e.g. `clanok-13-rocnik-2025.html`) |

All pages share the same nav, footer, `css/style.css`, and `js/main.js`.

## Structure

```
index.html, trasy.html, program.html, infoservis.html, galeria.html
clanky.html, clanok-13-rocnik-2025.html, ...
css/style.css        — single shared stylesheet (CSS custom properties, no preprocessor)
js/main.js           — shared behavior (nav, scroll-reveal, lightbox, year filters, partners)
js/partners-data.js  — sponsor/partner data (see below)
assets/
  images/
    hero-bg.jpg       — home page hero background photo
    gallery/          — photos for galeria.html
    partners/         — sponsor/partner logo files
    trails/           — route map header images (home + trasy.html cards)
    articles/         — cover/inline photos for clanky article pages
  gpx/                — downloadable GPX route files
  downloads/
    propozicie/       — race rules PDFs
    vysledky/         — results PDFs
CNAME                 — GitHub Pages custom domain
```

`project_info/` and `.claude/` exist locally for internal reference/tooling but are git-ignored — they are not part of the deployed site and must never be committed (the repo is intended to go public).

## Conventions

- **Section headers**: HTML uses `<!-- ===== NAME ===== -->` comments to mark major sections within a page.
- **Scroll-in animation**: any element with `data-reveal` fades/slides in via `IntersectionObserver` (wired up in `js/main.js`). Add this attribute to new sections that should animate in on scroll.
- **Placeholders**: until a real photo/logo is available, content uses a colored-gradient placeholder block with text (e.g. `.g-placeholder`, `.sponsor-main-placeholder`, `.partner-card-placeholder`) instead of a broken `<img>`. Image-based components fall back to this automatically via `onerror` where JS renders them (gallery teaser is hand-coded placeholders; partners are JS-rendered with automatic fallback).
- **Backgrounds alternate** down the page: plain white `.section`, cream `.section--cream`, and dark `.section--forest`, to create visual rhythm between sections.
- **Colors/fonts** are CSS custom properties defined once in `:root` in `css/style.css` (`--c-forest`, `--c-orange`, `--c-lime`, `--font-h` for headings/Oswald, `--font-b` for body/Inter). Don't hardcode new color values — reuse or extend these tokens.

## Hero banner photo

The home page hero (`.hero` in `css/style.css`) renders a photo background with a green gradient overlay on top (darker at top/bottom, lighter in the middle), so text stays readable without obscuring the photo. The nav bar itself is unaffected — it has its own solid background and is not part of the hero photo/overlay.

```css
.hero {
  background:
    linear-gradient(to bottom, rgba(26,61,43,.88) 0%, rgba(26,61,43,.65) 55%, rgba(26,61,43,.92) 100%),
    url('../assets/images/hero-bg.jpg') center/cover no-repeat;
  background-color: var(--c-forest); /* fallback if the image is missing */
}
```

**To replace the hero photo**, just overwrite `assets/images/hero-bg.jpg` — no CSS/HTML changes needed. Recommended specs:

- **Dimensions**: 1920×1080px minimum; 2400×1350px or 2560×1440px recommended for sharpness on larger/retina screens. Avoid going much beyond ~3000px wide — no visual benefit, just a bigger download.
- **Aspect ratio / framing**: landscape, roughly 16:9 to 3:2. The image uses `background-size: cover`, so it gets cropped to fill the viewport — sides crop first on mobile (narrow), top/bottom crop first on very wide desktop screens. Keep the important subject **centered**.
- **Avoid key details near the top/bottom edges** — that's where the green overlay is darkest (`.88`–`.92` opacity vs `.65` in the middle).
- **File size**: aim for roughly 150–400 KB (compress with something like Squoosh, `jpegoptim`, or `cwebp`) since it loads above the fold on every page view.
- **Format**: JPEG is fine and is what's currently used. WebP would shrink it further but would need a small markup change (`<picture>` with a JPEG fallback) to support older browsers — not done currently.

## Inner-page banner photos (`.page-hero`)

Every inner page (`trasy.html`, `program.html`, `infoservis.html`, `galeria.html`, `clanky.html`, each `clanok-*.html`) has a small `<header class="page-hero">` banner. Once a page has its own photo, it's styled the same way as the home hero (`.hero`): the photo with the same green gradient overlay on top. Each page has its own photo.

`.page-hero` in `style.css` only defines a solid fallback gradient (no photo) — pages without a photo yet use that as-is:

```css
.page-hero {
  background: linear-gradient(135deg, var(--c-forest) 0%, var(--c-green) 100%);
}
```

Once a page has a photo, set the full `background` shorthand inline on that page's `<header>` (mirrors `.hero`'s pattern exactly, just inline since each page's image differs):

```html
<header class="page-hero" style="background: linear-gradient(to bottom, rgba(26,61,43,.88) 0%, rgba(26,61,43,.65) 55%, rgba(26,61,43,.92) 100%), url('assets/images/page-hero/trasy.jpg') center/cover no-repeat;">
```

**To add/replace a page's banner photo**: drop the file into `assets/images/page-hero/` and add (or update) that inline `style` attribute on the page's `<header class="page-hero">`, pointing at the file. Pages without a photo yet (currently `galeria.html`, `clanky.html`, `clanok-13-rocnik-2025.html`) just have `<header class="page-hero">` with no inline style — copy the pattern above once a photo is ready. Follow the same dimension/framing/file-size guidance as the home hero photo above, just scaled to a shorter banner (1920×600–800px is plenty).

**To set/replace a page's banner photo**, drop the file into `assets/images/page-hero/` using the filename already referenced in that page's `style="--page-hero-img: ..."` attribute — no CSS changes needed. Until a file exists at that path, the page falls back to a solid forest-green background (same overlay gradient, no visible photo) — there is no broken-image flash. Follow the same dimension/framing/file-size guidance as the home hero photo above, just scaled to a shorter banner (the area is much shorter than a full-viewport hero, so a 1920×600–800px crop is plenty).

## Partners / sponsors section

The home page "Partneri" section (between Galéria and Kontakt) is data-driven so sponsors can be updated each season without touching HTML.

- **Data**: `js/partners-data.js` exports a single global `PARTNERS_CONFIG`:
  ```js
  const PARTNERS_CONFIG = {
    showMainSponsor: true,        // set false (or mainSponsor: null) to hide the main-sponsor banner entirely
    mainSponsor: { name, logo, url },  // one optional, highlighted sponsor — rendered larger
    partners: [ { name, logo, url }, ... ] // any number, all rendered at uniform size
  };
  ```
- **Rendering**: `initPartners()` in `js/main.js` reads this config and injects markup into two empty containers in `index.html`: `#sponsorMain` and `#partnersGrid`. If a logo file fails to load, it automatically falls back to a text placeholder showing the partner's name — no broken-image icons.
- **Logo files**: drop them into `assets/images/partners/`, matching the `logo` path used in `partners-data.js`.
- **Reusable by design**: a future standalone partners page would only need the same two empty containers plus the `partners-data.js` + `main.js` script tags — `initPartners()` would render identically, no code duplication needed.
- The existing "Organizátori" list in the Contact section (`.partner-list` / `.partner-item` classes) is a **separate, unrelated** concept (organizational collaborators like Mesto Nová Baňa) — don't confuse it with the sponsor/partner grid above.

## Articles (Články)

Each race edition gets a post-race summary article, replacing the PDF "vyhodnotenie" that used to be the only format. There is no CMS — articles are hand-written HTML, same as every other page on this site.

- **`clanky.html`** is the article index — a grid of teaser cards (`.article-card`), each linking to one article page.
- **One file per article**, named `clanok-[poradie]-rocnik-[rok].html` (e.g. `clanok-13-rocnik-2025.html`). Use that file as the template for the next one: copy it, replace the title/date/body text, and update the image paths.
- **Body typography** (`.article-body` in `css/style.css`) supports `<h2>`/`<h3>` headings, `<p>` paragraphs, `<ul><li>` bullet lists, and `<blockquote>` — just write normal HTML inside the `.article-body` div, no special syntax needed.
- **Images**: a full-width cover placeholder (`.article-image-placeholder`) sits above the body text, and smaller inline placeholders (`.article-image-placeholder.article-image-placeholder--inline`) can be dropped anywhere inside the body for mid-article photos. Both show a tinted color block with a text label until a real photo is saved to `assets/images/articles/` and referenced via the `background-image` inline style — no code changes needed once the file is in place (same pattern as `hero-bg.jpg`).
- **Publishing a new article**:
  1. Copy `clanok-13-rocnik-2025.html` → `clanok-14-rocnik-2026.html` (or similar).
  2. Replace the `<title>`, breadcrumb, `<h1>`, meta row (date/author), and all body content.
  3. Add real photos to `assets/images/articles/` and point the placeholder `style="background-image:url(...)"` at them.
  4. Add a new `.article-card` to `clanky.html` linking to the new file (copy the existing card block — the comment above it marks where).
  5. Optionally add a link to it from the relevant year's "Správy a články" card in `infoservis.html` (see the 2025 section for an example).
- The "Články" nav link must be added to **every** page's desktop (`.nav-links`) and mobile (`.nav-mobile`) navigation if a brand-new top-level page is ever added — copy the pattern already used for `clanky.html` across all 7 pages.

## Deployment

GitHub Pages, custom domain via `CNAME`. Pushing to the deployed branch (`main`) publishes the site directly — there is no CI/build step in between.
