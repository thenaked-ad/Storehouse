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
| `--ink-muted` | `#6B6B6B` | Captions and secondary text. |
| `--ink-strong-muted` | `#4A4A4A` | Section numbers and service points, where a little more contrast helps. Same charcoal-to-slate family; not a new brand colour. |

Ultramarine is used sparingly and deliberately — once per page as a full-bleed
panel, and otherwise only on things you can act on. That restraint is the point;
please resist spreading it around.

### Type

The brand faces, self-hosted as woff2 in `assets/fonts/`:

| Role | Face | Files |
|---|---|---|
| Headings, navigation, labels | Beausite Classic | `beausite-classic-400/500.woff2` |
| Body copy | Rhymes Text | `rhymes-text-400/500.woff2` |
| Index numbers, captions | IBM Plex Mono | Google Fonts |

Arrows are drawn in CSS rather than typed — a shaft with a square turned about
its own centre so the vertex lands exactly on the end of it. That is both
because the Beausite trial has no arrow glyph and because it lets the line run
on from the words, as on the About page's "Get in touch".

> **These are trial files and are not licensed for use on a public site.**
> One of them says so in its own filename
> (`RhymesTextTrialUnlicensed`). Web licences must be bought and the licensed
> woff2s dropped in over these before the site goes live. Nothing else has to
> change: the `@font-face` blocks at the top of `site.css` point at those four
> filenames and nowhere else names a typeface.
>
> The Beausite trial also carries a cut-down character set — 155 glyphs, where
> the full face has far more. It has **no ampersand and no arrow**. Every
> arrow on the site is drawn in CSS rather than typed, so those are fine, but
> an `&` in a heading (`Storage & Handling`, `Budgets & timelines`,
> `Framing & conservation`) falls back to Helvetica for that one character.
> It is subtle but visible, and it will fix itself with the licensed files.

Each token keeps a close open substitute behind the brand face, both for the
moment before the font loads and for any character the trial is missing.


Note that the **STOREHOUSE wordmark is not type**. It is vector artwork
extracted from the brand PDF and inlined as an SVG `<symbol>` near the top of
each page, so the logo is exact regardless of which fonts load. Do not retype
it as text.

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
stored, moved, installed, photographed. Eight real frames from the Storehouse
shoot, in the order they happen, on the charcoal ground.

One line of 3:4 cards, each with its number top-left and its label bottom-left
against a gradient scrim. The row waits a second, then drifts along on its own
at 18px a second, and can be dragged; a drag carries momentum when
you let go, and a click nudges it. A "Drag" mark sits at the right-hand edge to
say so.

The loop is seamless because the eight cards are cloned once at runtime and the
scroll position wraps at half the width. The clones are `aria-hidden`.

Two things worth knowing if you touch this:

- The drift keeps its own `pos` variable rather than adding to `scrollLeft`
  directly. The browser rounds `scrollLeft` to whole pixels, so a sub-pixel
  step added to it each frame is rounded away and nothing moves at all.
- Both the drift and its momentum are timed off the clock rather than counted
  in frames. A 120Hz display — which most recent Macs are — would otherwise run
  the whole thing at twice the intended speed.
- The gap between cards and the short line drawn across it both come from
  `--jgap` on the strip. They were separate values, and a mobile override moved
  one without the other, so the line stopped 8px short of the next card.
- There is no scroll-snap and no `-webkit-overflow-scrolling`. Both fight a
  flick, and with `scroll-padding` set the last card could never reach a valid
  snap position, so the strip kept dragging itself back.
  `overscroll-behavior-x: contain` stops a swipe past either end chaining out
  to the browser's own back gesture.
- Drag is bound wherever there is a mouse — `(hover: hover) and (pointer:
  fine)` — including a desktop window narrowed to a phone's width, because a
  mouse cannot swipe a scroller. The drift on top of it needs `min-width:
  56rem`. On a real touch device **nothing at all is bound**: a non-passive
  pointer listener on a scroller makes the browser run it before it can decide
  whether to scroll, and that is what makes a swipe feel like it is fighting
  back. The pointermove listener is passive and nothing calls preventDefault.
- The strip runs the full width of the window and insets its own content with
  padding. It used to pull itself out with negative margins, which escaped the
  page and scrolled the whole site sideways below 1024px.

Drift and cloning are desktop-only and are skipped for reduced motion: on a
phone a strip that moves while you are reading it is a nuisance, so it stays a
plain swipe. Without JavaScript it is eight cards you can scroll by hand.

To change a stage, edit `index.html` and drop a replacement 3:4 image into
`assets/img/journey/`.

## The three service pages

Storage & Handling, Exhibition Services and Collection Management all share one
shape, built to Tom's reference:

1. `.page-split` — the number, a large two-line title and the standfirst in a
   narrow left column; a 4:3 picture beside them, running to the right edge.
2. `.entry-grid` — every entry as a card, two to a row, ruled between and
   divided by a vertical rule, each with heading, paragraph, any specification
   list, then its own 3:2 picture beneath.

Exhibition Services and Collection Management have four entries each, two to a
row in even halves (`.entry-grid`).

Storage & Handling has six and takes a row each (`.svc-row`), in a container
capped at 1400px and centred. Two columns sitting close together — the words
one side, the picture the other, turned round on each row — with a short rule
at the head of every section aligned to the grid rather than ruled across the
page.

Each row has three parts, and the split matters: `__head` (number, heading,
description), `__figure`, and `__tail` (service points and the call to action).
On a wide screen `grid-template-areas` puts head and tail in one column with
the picture beside them; on a phone the areas fall away and the DOM order gives
number, heading, description, picture, points, call to action, which is the
order the brief asked for.

The picture column keeps the larger share whichever side it is on
(`1fr 1.12fr`, reversed for `data-side="right"`), so every photograph on the
page comes out the same size — verified identical from 768px to 2560px.

There is an empty fourth row in the grid, `slack`, sized `1fr`. It exists to
absorb however much taller the picture is than the words beside it. Without it
that slack is shared between the head and tail rows, which pushes the service
points away from the paragraph by a different amount on every section,
depending on how long the paragraph happens to be.

The call to action is `.btn`: an outlined button in the brand blue that fills
on hover.

Every entry picture is 3:2 at every width and on all three pages; only the lead
is 4:3. There is no breakpoint where a ratio changes. No picture carries a caption on these pages.

Cards are flex columns with the picture pushed to the foot (`margin-top: auto`).
Grid items are the same height across a row, so this lines every picture up
with the one beside it however much text sits above it.




## The services list

The first section below the fold, on canvas. The preview is a 3:4 portrait
plate in a narrow column, which leaves the list most of the width.

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
masthead.

Dragging across it draws a mark of ultramarine the width of the cursor dot,
exactly under the pointer. It is a `<canvas>` laid over the hero's content
rather than behind it, so a stroke can cross type and photograph alike, and it
does not intercept clicks. The drag suppresses text selection, so you get a
mark rather than a mark plus a highlight.

The canvas is given an explicit CSS `width` and `height`. A canvas is a
replaced element: without them its layout size comes from the backing-store
attributes, which are multiplied by the device pixel ratio — so on a retina
screen it renders at twice the width of the page and scrolls the whole site
sideways. Test this page at `devicePixelRatio` 2, not just 1.

## Single-screen pages

Contact and About are laid out to hold one screen on desktop: the title sits in
the grid beside the content rather than above it, and `.page--single` is
`100svh` minus the masthead. The footer sits below that and is scrolled to.

Each column groups its content at the top. The one thing that stretches is
Contact's enquiry list, whose eight rows share the column between them, so the
page still reaches the foot of the screen; About's portraits do the same.

The two portraits on About are captioned **Antony Cundy** and **Fred Henderson**
in the order they were given. Which name belongs to which photograph has not
been confirmed — swap the two `<figcaption>` lines if they are the wrong way
round. Roles are not shown; the business card in the brand document gives Fred
Henderson as Director, but Antony Cundy's is not recorded anywhere we have.

## The order of the home page

Hero, services, the journey cards on charcoal, case studies, Location in
ultramarine, then the closing enquiry block. The masthead reads the ground
beneath it as it goes — light, mid, dark — and takes a matching backdrop each
time.

## The ultramarine panels

The enquiry block that closes each page, and Location on the home page, are
`.panel` sections. They are deliberately **not** given `data-reveal`: the reveal
fades a whole section, background included, so the page showed through the blue
for a moment as it scrolled into view.

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

## Performance

Nothing is fetched from a third party. All three typefaces are self-hosted
woff2 in `assets/fonts/` and the two used above the fold are preloaded; the
mono is subsetted to the characters the site actually draws, which takes it
from 10KB to 4KB. There is no Google Fonts request, no preconnect, no DNS
lookup off-origin — the only external thing on the site is the Google Maps
iframe, and that is only created when someone opens the map.

Images are WebP, sized to about twice their largest rendered width, and every
`<img>` carries explicit `width` and `height` so nothing shifts as the page
loads. Keep those attributes matching the file if you swap an image.

Weights, on a cold load: home 692KB, the service pages 360-465KB, About and
Contact under 175KB. The home page is image-led and carries the most; the rest
is a third of that. GitHub Pages compresses text assets on the wire, so the
48KB stylesheet arrives at a fraction of that.

## Security

There is no back end. The site is static files, there is no form that posts
anywhere, no cookie, no analytics and no third-party script, so most of the
usual surface does not exist.

A Content Security Policy is set by `<meta>` on every page, since GitHub Pages
cannot send headers:

```
default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline';
script-src 'self' 'sha256-…'; font-src 'self'; connect-src 'self';
frame-src https://www.google.com; form-action 'self'; base-uri 'self';
object-src 'none'; upgrade-insecure-requests
```

Two things to know if you edit it. `style-src` allows inline styles because the
pages use `style="…"` attributes throughout. `script-src` names the SHA-256 hash
of the one inline script — the line that adds the `js` class. **If you change
that line by even a character, the hash no longer matches and the script is
blocked**, which would leave the reveal animations and the card row inert.
Recompute it, or move the line into `site.js`.

`frame-src` exists only for the map. If the map goes, that can go too.

## Search

Every page carries a title, a description, a canonical URL, Open Graph and
Twitter card tags with image alt text, and JSON-LD:

- Home — `ProfessionalService` and `WebSite`, with the address and VAT number.
- The three service pages — `Service` with an `OfferCatalog` of what each
  covers, and a `BreadcrumbList`.
- About and Contact — `AboutPage` / `ContactPage`, and a `BreadcrumbList`.

`robots.txt` allows everything and points at `sitemap.xml`, which lists all six
public pages with `lastmod` and priorities. The 404 page is `noindex`.

**Before launch:** submit the sitemap in Google Search Console, and check the
canonical URLs match the live domain. Everything currently says
`storehousefinearts.com` — if that changes, search for it and replace
throughout, including in `robots.txt`, `sitemap.xml` and the JSON-LD.

## Accessibility and standards

- One `<h1>` per page; headings in order.
- Every image has an `alt` attribute; decorative frames are `aria-hidden`.
- Keyboard reachable throughout, with a visible ultramarine focus ring and a skip link.
- `prefers-reduced-motion` disables the scrub, the reveals and the page transitions.
- Content is never hidden by CSS that depends on JavaScript succeeding.
- A print stylesheet renders the site as a plain document — this trade still prints things.
