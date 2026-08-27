# Storehouse Fine Arts — website

A static site for Storehouse Fine Arts. Plain HTML, CSS and a small amount of
vanilla JavaScript — no build step, no framework, no dependencies. Open any
`.html` file in a browser and it works.

Built from the *Storehouse Brand Identity* (2025) document and Fred's copy.

---

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `storage-and-handling.html` | Storage, transport, packing, installation, photography, viewing room |
| `exhibition-services.html` | Budgets, agreements, shipping, framing |
| `collection-management.html` | Cataloguing, inventory, reporting |
| `about.html` | About |
| `contact.html` | Contact |
| `404.html` | Not found |

## Editing the copy

All text lives directly in the `.html` files. Find the sentence you want and
change it — nothing is compiled or generated.

The header and footer are repeated in each page. If you change a navigation
link, change it in all seven files.

**Two places are waiting on content**, marked with comments in `about.html`:

- `FRED: your "Why we set up" copy goes here` — replace the comment with `<p>` paragraphs.
- Case studies — not yet built; the copy document had no examples in it.

The team portraits on `about.html` are currently captioned "Storehouse". Swap
those `<figcaption>` lines for real names and roles when you have them.

## Running it locally

```bash
python3 -m http.server 4321
```

Then open <http://localhost:4321>. (Opening the files directly with `file://`
also works, but a server is closer to the real thing.)

---

## Deployment

Pushing to `main` publishes the site via the workflow in
`.github/workflows/pages.yml`. Enable it once, in the repository:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

The first deploy takes a couple of minutes; after that it is about thirty seconds.

### Custom domain

1. Create a file called `CNAME` at the root containing one line: `storehousefinearts.com`
2. At the domain registrar, point the DNS at GitHub Pages:
   - Four `A` records for the apex — `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` for `www` → `<github-username>.github.io`
3. In **Settings → Pages**, enter the domain and tick **Enforce HTTPS** once the certificate is issued.

The site currently assumes `https://storehousefinearts.com` in its canonical
tags, `sitemap.xml`, `robots.txt` and social preview URLs. If the domain
changes, search for `storehousefinearts.com` and replace it throughout.

---

## Design system

Everything visual is controlled by tokens at the top of `assets/css/site.css`.

### Colour — from page 10 of the brand document

| Token | Value | Use |
|---|---|---|
| `--ultramarine` | `#0F1B70` | The one primary colour. Links, the open state of a service, full-bleed panels, text selection. |
| `--charcoal` | `#1F1F1F` | Body text, and the dark ground behind The Passage. |
| `--slate` | `#9A9A9A` | Index numbers, captions, quiet labels. |
| `--canvas` | `#FDFDFD` | The page. |
| `--paper` | `#F4F4F4` | Behind an image while it loads. |

Ultramarine is used sparingly and deliberately — once per page as a full-bleed
panel, and otherwise only on things you can act on. That restraint is the point;
please resist spreading it around.

### Type

The brand specifies **Beausite** (sans) and **Rhymes** (serif). Both are
licensed faces and are not included here. The site currently uses close open
substitutes served from Google Fonts:

| Role | Brand face | Substitute in use |
|---|---|---|
| Headings, navigation, labels | Beausite | Instrument Sans |
| Body copy | Rhymes | Newsreader |
| Index numbers, captions | — | IBM Plex Mono |

**To swap in the real faces**, buy web licences, drop the `.woff2` files into
`assets/fonts/`, add `@font-face` rules at the top of `site.css`, change the
`--sans` and `--serif` tokens, and delete the Google Fonts `<link>` from the
`<head>` of each page. That is the whole job — nothing else references a
typeface by name.

Note that the **STOREHOUSE wordmark is not type**. It is vector artwork
extracted from the brand PDF and inlined as an SVG `<symbol>` near the top of
each page, so the logo is pixel-accurate regardless of which fonts load. Do not
retype it as text.

### Layout

One grid, used everywhere: a short label in the left margin, the substance
beside it (`.marginalia`). This is the layout system from page 11 of the brand
document. Spacing comes from two variables — `--band` between sections and
`--stack` within one.

---

## The Passage

The sequence on the home page is the single artwork being wrapped and crated,
frame by frame, driven by scroll position. Nineteen real frames from the
Storehouse shoot, in the order they were taken.

It is built to fail gracefully:

- **No JavaScript** — the sequence reads as a numbered written log, and only one image is downloaded.
- **Reduced motion** — the same written log; nothing moves.
- **Slow connection** — the sequence is not fetched until the section reaches the viewport, and the scrub never advances to a frame that has not arrived.

To change the captions, edit the `<ol class="passage__log">` list in
`index.html`. That list is the single source of truth: the script reads the
captions from it, so the visible caption and the no-JavaScript fallback can
never disagree.

To change the length of the scroll, edit the inline `height` on
`.passage__scroll` — `20vh` per frame at present.

**The captions are a first draft and should be checked.** They describe what is
visibly happening in each photograph, but Fred should confirm the materials and
methods are described correctly before this goes live.

---

## Imagery

`assets/img/` holds WebP derivatives generated from the client photography in
`Photography/Storehouse` and `Photography/Portraits`. Originals are not in the
repository — they are large, and the site does not need them.

- Feature images: 1600px and 900px wide
- Passage frames: 760px wide (`assets/img/passage/`)
- Total: about 5 MB

To add an image, export a WebP at 900px or 1600px wide, drop it in
`assets/img/`, and reference it with explicit `width` and `height` attributes so
the page does not jump while it loads.

---

## Notes and assumptions

Worth confirming before launch:

- **Email** — `info@storehousefinearts.com`, from the copy document. The brand
  document's business card shows `fred@storehouse.com` and `storehouse.com`,
  which conflicts. The copy document was treated as newer.
- **Domain** — `storehousefinearts.com` assumed throughout.
- **Instagram** — the brand document's website concept lists an Instagram link,
  but no handle was supplied, so no Instagram link is on the site yet. Add it to
  the footer and the mobile menu once you have the handle.
- **Telephone** — not published. The only number available was Fred's mobile,
  from the business card.
- **Fonts** — Google Fonts is a third-party request. Self-hosting the `.woff2`
  files removes it, which is worth doing for a UK business with EU clients.
- **Contact** — the enquiry links are `mailto:` with the subject pre-filled.
  They need no server and cannot break. If a real form is wanted later,
  Formspree or Netlify Forms will drop in without changing the design.

## Accessibility and standards

- One `<h1>` per page; headings in order.
- Every image has an `alt` attribute; decorative frames are `aria-hidden`.
- Keyboard reachable throughout, with a visible ultramarine focus ring and a skip link.
- `prefers-reduced-motion` disables the scrub, the reveals and the page transitions.
- Content is never hidden by CSS that depends on JavaScript succeeding.
- A print stylesheet renders the site as a plain document — this trade still prints things.
