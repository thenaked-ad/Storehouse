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

**Two places are waiting on content:**

- `about.html` — `FRED: your "Why we set up" copy goes here`; replace the comment with `<p>` paragraphs.
- `index.html` — the case studies placeholder, see below.

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
| `--charcoal` | `#1F1F1F` | Body text, and the dark ground behind The Journey. |
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
document.

All vertical spacing comes from two variables — `--band` between major sections
and `--stack` within one. Change those two and the whole site re-spaces
coherently; avoid hard-coded margins. Figures inside a marginalia column are
capped in width so the inner pages do not become an endless scroll.

The main navigation carries a faint index number per page, set by `data-index`
on each link and drawn by CSS.

---

## The Journey

One work travelling the whole service: received, wrapped, boarded, crated,
stored, moved, installed. Seven real frames from the Storehouse shoot, in the
order they happened, strung along a single line.

On a wide screen the group waits off to the right. When the section is reached,
a stick figure hauls the line in until the seven stages sit centred; the tow
rope then parts and the figure carries on out of frame. One team, one record.
The section is sized from viewport height so it holds a single screen.

On a phone the figure is dropped and the row becomes a swipeable strip with the
line running through it.

The ground is `--slate` taken 55% toward `--charcoal`, which is what lets it
carry white type at AA contrast. Straight `--slate` at `#9A9A9A` will not.

To change a stage, edit the `<ol class="journey__strip">` list in `index.html`
and drop a replacement square into `assets/img/journey/`. Stages are equal-width
flex items, so adding or removing one needs no other change.

## The services list

Compact rows, one per service, opening as ordinary `<details>`. On a wide screen
the image of whichever service you are pointing at appears in the column beside
the list; on a phone that column is dropped and each service carries its own
image inside the panel it opens. The pairing is set by `data-service` on each
`<details>` matching `data-service` on an image in `.services__preview`.

## The pointer

An ultramarine dot replaces the cursor, as on Dougal's holding page, opening up
over anything you can act on and inverting to white over the dark and blue
grounds. Position is the only thing updated per frame; hit-testing writes to the
DOM only when the answer changes, which is what keeps it from feeling a step
behind the mouse.

It is gated three ways — a real mouse, scripting available, and motion not
reduced — and the native cursor is only hidden once the dot is confirmed
running, so a script failure can never leave someone without a pointer. Touch
devices never see it.

## The first screen

The hero is `100svh` minus the real masthead height, which JavaScript measures
and writes to `--masthead-h`, so it ends exactly at the fold on any viewport.
`scroll-padding-top` uses the same value, so anchor links land just under the
masthead. `--footer-h` is measured the same way and used by Contact and About.

Clicking anywhere on it that is not a link drops a mark of ultramarine that
grows from the point you clicked — paint on paper, building up with each click.

The type is never caught underneath it. Every text block carries its own ground
of `--canvas`, which is invisible against the unpainted page and becomes a card
once paint arrives, so the paint washes around the words rather than under
them. Nothing changes state, so nothing can flicker, and no line is ever dark
ink on dark blue.

## Single-screen pages

Contact and About are laid out to hold one screen on desktop: the title sits in
the grid beside the content rather than above it, and `.page--single` subtracts
both the masthead and the footer from `100svh`. They fit from 1366x768 upward.
On a 1280x720 screen Contact runs about 30px long.

## Case studies

`index.html` carries a three-card placeholder with a comment showing where each
project goes. Replace the placeholder text with the project name, the year and
one line on the job; add an image by putting a `<div class="plate plate--wide">`
above the `<h3>`.

## The map

"See on map" on the home page opens a `<dialog>` containing a Google Maps embed.
The iframe is only created the first time it is opened, so no visitor loads
Google unless they ask to see the map. Without `<dialog>` support the button
opens Google Maps in a new tab instead.

A dialog renders in the browser's top layer, above everything else on the page,
so the cursor dot cannot be drawn over it. The native cursor is handed back
while the dialog is open and taken again when it closes.

## Imagery

`assets/img/` holds WebP derivatives generated from the client photography in
`Photography/Storehouse` and `Photography/Portraits`. Originals are not in the
repository — they are large, and the site does not need them.

- Feature images: 900px wide, which is what the pages use
- Journey stages: 560px square (`assets/img/journey/`)
- A 1600px variant exists for most feature images. Nothing references them yet;
  they are there for `srcset` or for a future full-bleed treatment.
- Total: about 4 MB

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
