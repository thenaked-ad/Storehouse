# Storehouse Fine Arts — website

A static site for Storehouse Fine Arts. Plain HTML, CSS and a small amount of
vanilla JavaScript — no build step, no framework, no dependencies. Open any
`.html` file in a browser and it works.

Built from the *Storehouse Brand Identity* (2025) document and Fred's copy.

---

## Pages

**Storehouse is a storage business first.** Fred's October 2026 brief, written
after two existing clients advised it, leads with storage — the simplest thing
to say yes to, and the one that earns the trust for everything else. Collectors,
artists and estates are the audience; galleries are welcome but not the focus.

Fred's own way of putting the three headings: **Storage** is the building,
**Transport & Handling** is getting a work from A to B, and **Additional
Services** are the optional extras. (That page was "Services" until his final
round of feedback; the file is still `services.html`, so no link breaks.)

| File | Nav | Page |
|---|---|---|
| `index.html` | — | Home |
| `storage.html` | 01 | Overview, Security, Handling, Insurance, Climate-Controlled Storage, Ambient Storage, Viewing Room |
| `transport-and-handling.html` | 02 | Transport, Packing & Crating |
| `services.html` | 03 | Additional Services: Photography, Installation, Project Management, Collection & Estate Management |
| `about.html` | 04 | About |
| `contact.html` | 05 | Contact |
| `404.html` | — | Not found |

The three old addresses still answer, as forwards — see *Old addresses* below.

## Where the copy comes from

**Every descriptive line on the three service pages, the home page overview and
About is verbatim from Fred's brief** — *Storehouse Website Rethink — Brief for
Tom (Oct 2026)* — and nothing has been added to it. Before writing anything new
on those pages, check the brief first and add it there.

Things that are ours rather than his, and the places to look if something reads
oddly: the button labels on Additional Services, the enquiry rows on Contact,
the subject lines the buttons put on an email, and the alt text on the
photographs.

The site was then trimmed back in Fred's final design round (19 October 2026,
after he had shown it to people whose judgement he trusts): no typed line on
arrival, no dropdowns, no case-study or Location sections, no signature over
the About portrait, and a simpler footer.

## Editing the copy

All text lives directly in the `.html` files. Find the sentence you want and
change it — nothing is compiled or generated.

The header and footer are repeated in each page. If you change a navigation
link, change it in all seven pages (`index`, `storage`, `transport-and-handling`,
`services`, `about`, `contact`, `404`) — once in the desktop bar and once in the
phone menu on each.

**A photograph in a carousel** is one `<img>` inside its `.carousel__plate`.
To add one, copy a line, point `src` at the new file and give it `alt` text;
its count ("1 / 4") updates itself. **A caption** is the image's
`data-caption="…"`: leave it empty and the line under the photograph is blank
for that frame.

**One place is waiting on content:** the Recent work grid in `index.html`,
between `<!-- instagram:start -->` and `<!-- instagram:end -->`. See *Recent
work* below.

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

The domain is `storehousefinearts.com`, registered with **Squarespace**
(it came over from Google Domains). Email for the domain runs through
**Google Workspace** — the `MX` record (`smtp.google.com`), the SPF `TXT`
record and the `google._domainkey` DKIM record. **Never touch those.**

Pointing the domain at this site, in Squarespace → Domains →
storehousefinearts.com → DNS:

1. Remove the **Squarespace Defaults** records (four `A` records on `@` to
   `198.185.159.x` / `198.49.23.x`, and `www` as a `CNAME` to
   `ext-sq.squarespace.com`). They point at the old Squarespace "Coming Soon"
   page.
2. Add, on `@`, four `A` records — `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153` — and, optionally, four `AAAA` records —
   `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
   `2606:50c0:8003::153`.
3. Add `www` as a `CNAME` to `thenaked-ad.github.io`.
4. Once those resolve (`dig +short storehousefinearts.com` returns the
   `185.199.x.153` addresses), set the domain on the GitHub side:
   **Settings → Pages → Custom domain** → `storehousefinearts.com`, then tick
   **Enforce HTTPS** once the certificate has been issued. The deploy is by
   GitHub Actions, so the domain lives in that setting rather than in a `CNAME`
   file. **Do this after the DNS, not before** — as soon as it is set, the
   `github.io` address starts redirecting to the domain.
5. Worth doing too: verify the domain for the `thenaked-ad` account
   (github.com → Settings → Pages → Add a domain), which gives a `TXT` record to
   add in Squarespace. It stops anyone else's GitHub Pages site claiming the
   domain.

The site already assumes `https://storehousefinearts.com` in its canonical
tags, `sitemap.xml`, `robots.txt` and social preview URLs.

---

## Design system

Everything visual is controlled by tokens at the top of `assets/css/site.css`.

### Colour — from page 10 of the brand document

The four brand values are unchanged; what changed is which one is the ground.
**The page sits on the ultramarine, and the paper colour is the ink.**

| Token | Value | Use |
|---|---|---|
| `--ultramarine` | `#0F1B70` | The ground of the whole site. |
| `--canvas` | `#FDFDFD` | The ink on it — type, rules, the brush, the pointer. |
| `--charcoal` | `#1F1F1F` | Ink on the paper sections. |
| `--paper` | `#F4F4F4` | Behind an image while it loads, on a paper section. |
| `--slate` | `#9A9A9A` | Kept as a brand value; the interface now uses the muted inks below instead. |

Nothing in the stylesheet names a brand colour directly. Six semantic tokens
carry it, and a section inverts by redeclaring them — nothing else:

| Token | On the blue | On the paper |
|---|---|---|
| `--ground` | ultramarine | canvas |
| `--ink` | canvas | charcoal |
| `--ink-muted` | canvas at 62% | `#6B6B6B` |
| `--ink-strong-muted` | canvas at 84% | `#4A4A4A` |
| `--accent` | canvas | ultramarine |
| `--rule` / `--rule-strong` | white at 20% / 48% | black at 16% / 40% |

`.on-paper` holds the second column, and `.panel`, `.footer`, `.menu` and
`.map-dialog` share the rule. To turn any new section over, give it one of those
classes — do not write a colour into it. The print stylesheet redeclares the same
six tokens as black on white, so the site prints as a document either way up.

### Type

The brand faces, self-hosted as woff2 in `assets/fonts/`:

| Role | Face | File | Licence |
|---|---|---|---|
| Headings, navigation, labels | Beausite Classic Clear | `BeausiteClassicWeb-Clear.woff2` | bought (Fatype) |
| — available, nothing uses it yet | Beausite Classic Medium | `BeausiteClassicWeb-Medium.woff2` | bought (Fatype) |
| Body copy | Rhymes Text Light | `RhymesText-Light.woff` | bought (MaxiType) |
| — available, nothing uses it yet | Rhymes Text Medium | `RhymesText-Medium.woff` | bought (MaxiType) |
| Index numbers, captions | IBM Plex Mono | `ibm-plex-mono-400.woff2` | open (SIL OFL) |

Arrows are drawn in CSS rather than typed — a shaft with a square turned about
its own centre so the vertex lands exactly on the end of it. The licensed face
does have an arrow glyph, but the drawn one stays: it lets the line run on from
the words, as on the About page's "Get in touch".

### Beausite is licensed, with two conditions outstanding

Fatype's own WOFF2 files, copied in **byte for byte** — verified by sha256
against the delivered files. They are deliberately **not subset**: the licence
says "modification … strictly forbidden", so Clear is 72KB rather than the 9KB
the trial cut was. Total font weight on first load is 147KB.

That size buys the full 1030-glyph set, and one thing in particular: the trial
had 155 glyphs and **no ampersand**, so every `Storage & Handling`,
`Budgets & timelines` and `Framing & conservation` on the site was quietly
falling back to Helvetica for that one character. Measured: the `&` is 135.41px
wide in Beausite against 133.41px in the fallback, so it is now coming from the
real face.

Medium is declared at weight 500 so the family is complete, but nothing on the
site asks for it — there is no bold anywhere in the markup — so the browser
never downloads it. If Dougal's system wants Medium somewhere, it is already
wired up and costs one `font-weight`.

> **Two licence conditions are not met yet, and neither is a code change.**
>
> 1. **Registration.** Fatype require the site to be registered per domain at
>    `fatype.com/user/licenses`, and additional domains bought separately.
>    The live URL today is `thenaked-ad.github.io`, which is unlikely to be
>    what was registered.
>
> 2. **The referrer guard.** `assets/fonts/.htaccess` is Fatype's file with the
>    domain filled in as `storehousefinearts.com`. **It does nothing on GitHub
>    Pages** — Pages is static hosting with no Apache and no server config, so
>    htaccess is never read. It is committed so the condition is already met the
>    day the site moves to a host that does read it. Fatype ship it beside the fonts and
>    state in their Web Fonts Policy that *"failing to do so will terminate the
>    licensing agreement"*. **GitHub Pages cannot run htaccess at all** — it is
>    static hosting with no rewrite layer — so this cannot be satisfied on the
>    current host by any means. It needs either a host that supports it
>    (Netlify, Cloudflare, anything Apache/nginx) or written confirmation from
>    Fatype that they accept the site as hosted.

### Rhymes is licensed, and shipped as WOFF

MaxiType's files exactly as delivered, verified by sha256. **WOFF, not WOFF2,
on purpose:** their licence excludes *"modifying, reassembling"*, and
recompressing a WOFF into a WOFF2 is arguably both. It costs about 17KB a face
and WOFF is supported everywhere, so the only thing lost is bytes. Fonts are
164KB on first load, all self-hosted, still zero external requests.

#### The body copy moved from 400 to 300

The order has **Light (300) and Medium (500) and no 400**, which is what the
body copy was set in. So it had to move one way or the other, and it shows on
every paragraph.

It is **Light**. Almost all the body copy is white on the ultramarine, and light
type on a dark ground blooms optically — it prints heavier than the same weight
would on paper. Medium reads chunky against the hairline wordmark and the 1px
rules. One number on `body` changes it back.

A consequence worth knowing: **the sans and mono elements inherit that 300** and
none of them declares its own weight. They do not render light, because neither
family has a face below 400 — the font-matching rules say a request under 400
with nothing at or below it takes the next weight up. Verified rather than
assumed: `Handling` set in Beausite at an inherited 300 measures 496.33px, which
is identical to an explicit 400 and nothing like Medium's 480.25px.

Medium is declared at 500 for both families so they are complete. Nothing asks
for either, so neither is ever downloaded.

Each token keeps a close open substitute behind the brand face, for the moment
before the font loads.


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

## The masthead arrives with the scroll

At the top of a page the masthead is **transparent, with no backdrop at all** —
measured pixel for pixel, the bar, the seam under it and the ground below it are
all `rgb(15, 27, 112)`. It used to carry an 88% ultramarine plus a saturating
backdrop from the start, and against the plain ultramarine behind it that read
as a slightly different blue: a visible band across the top of the page before
anyone had done anything.

`[data-scrolled="true"]` — set by the script past 8px — brings on the backdrop
and draws the hairline.

**The backdrop is in the transition, and it has no `saturate()`.** Both matter.
It was `saturate(150%) blur(14px)` with `backdrop-filter` left out of the
transition list, so the filter landed whole on the first frame while the 88%
ultramarine was still fading in behind it — for a moment you saw the saturation
boost with nothing damping it, and the bar went bright blue before settling.
Measured on the home page, it jumped `rgb(15, 27, 112)` → `rgb(13, 26, 122)` and
eased back to `rgb(14, 27, 117)`.

Putting the filter in the transition removed the jump but left a 3-unit hump,
because `saturate` brightens faster in the middle of the curve than the
half-transparent colour damps it. Dropping the saturation removed that too: over
a flat ground it did nothing but brighten, while the **blur** is what actually
frosts photographs passing underneath. The bar now holds `rgb(15, 27, 112)` the
whole way through the transition on the home page — no jump, no hump.

The identity `blur(0px)` in the resting rule is there so the filter has
something to grow out of; without a filter to interpolate from, it switches on
whole again. The 1px border is declared `transparent` in the resting
rule rather than added later, so it is always in the box and the masthead never
changes height, which matters because `--masthead-h` is measured from it.

The `[data-over]` rules come after `[data-scrolled]` in the stylesheet and carry
the same specificity, so a paper section still overrides the
blue backdrop when the masthead is sitting on one.

### The browser's own image drag

Press on one of the photographs in the card row and the browser would rather
start its own drag of the image than hand us the pointer: you get a ghost of the
picture stuck to the cursor and the row never moves. Three things refuse it —
`preventDefault()` on `pointerdown` (safe, because nothing above it has run for
anything but a mouse), a `dragstart` handler that refuses as well, and
`-webkit-user-drag: none` on the images.

Worth knowing if you ever test this: **Playwright's synthetic mouse events do
not start a native drag**, so the drag test passed for weeks while the bug was
live. Verify it by dispatching a real `dragstart` and checking `defaultPrevented`,
not by driving the mouse.

## The navigation

Five items, in Fred's order: **Storage | Transport & Handling | Additional
Services | About | Contact**. Plain links — the hover dropdowns that were there
for a few rounds came off at Fred's request, because each page lists its own
segments neatly once you are on it. The phone menu is the same six links
(Home first), with nothing folded away.

On the home page the small wordmark is out of the bar until the large one has
scrolled away under it (`data-hero` on the masthead, set from the hero's
position on scroll), so the first screen carries the name once. With no
script it is simply there.

## Old addresses

`storage-and-handling.html`, `exhibition-services.html` and
`collection-management.html` were the site's first three service pages and may
be bookmarked or indexed. Each is now a one-line forward — a meta refresh,
`noindex`, and a canonical pointing at the new home:

| Old | New |
|---|---|
| `storage-and-handling.html` | `storage.html` |
| `exhibition-services.html` | `services.html#project-management` |
| `collection-management.html` | `services.html#collection` |

GitHub Pages cannot send a 301, which is why they are pages at all. On a host
that can, replace them with real redirects.

## The segments — all three service pages

Each page opens on its list of segments, every one closed, numbered from the
page's ledger number (`01.1` … `01.7` on Storage). **Only one stands open at a
time**: each is an ordinary `<details>`, and the shared `name` on them is what
closes one as another opens — the browser does it, so with no script the
segments still open and close. A link to `page.html#segment` opens that segment
on arrival.

All three pages are laid out the same way: the list runs the full width, and
an open segment has its copy on the left and its own carousel on the right,
sized from the height of the window so a whole photograph is in view under the
open heading. (Storage had a single standing set of photographs beside its list
for a round; Tom asked for it to match the other two.) Storage and Transport &
Handling have no buttons in their segments; Additional Services keeps one per
segment.

The carousels inside segments show every photograph **whole** (`object-fit:
contain`), because Fred will be adding his photographs of artworks and an
artwork must never be cropped. The shoot's own frames are 3:4, the same as the
plate, so they fill it exactly.

`.services-page` carries `min-height: calc(100svh - var(--masthead-h))`, so the
blue holds the screen whatever the window, and the paper panel below never
climbs into the first screen.

### Keeping the page steady

Opening a segment shuts the open one, and when that one is above, the page gets
shorter under the reader. Left alone, two things go wrong: near the foot of the
page the browser has to pull the whole view down, and the heading just clicked
can be carried off the top of the screen. The script handles both:

- **The section keeps its height for a moment.** It is held at its old height
  before the browser opens and shuts anything, the spare room sits at its foot,
  and it is given up as the reader scrolls back up, only ever below the bottom
  of the screen. So the page never shortens under anyone.
- **The heading just clicked stays exactly where it was**, and its segment
  opens underneath it.
- **The browser's own scroll anchoring is off** on these three pages
  (`:root:has(.services-page)`). It made a second, different decision about what
  to hold still; switched off on the section alone, it anchored to the panel
  below and pulled the page down as a segment opened.

Measured across 556 clicks — every segment opened from every state, from the
top, the middle and the foot of each page, at three desktop sizes and on a
phone: the heading clicked never moved and never went out of sight, except
when the page was already scrolled right to the top, where the segment
shutting above can be taller than there is room to scroll back; there it rises
a little but stays in view.

## The carousels

One component everywhere (`.carousel`, `data-carousel`): every frame stacked in
one plate, and a line under it with the frame's caption on the left and a count
and two arrows on the right.

- **It turns over on its own, slowly** — every 5 seconds, while it is on
  screen — and **stops for good the first time someone uses the arrows** (or
  swipes, on a phone), so it never moves on from a picture they chose. Fred
  found the old 2-second slideshow too fast.
- **Captions** are each image's `data-caption`. Blank by default; the line
  stays the same height either way, so the arrows never jump.
- Nothing turns while it is off screen, shut inside a closed segment, or in a
  background tab. Reduced motion keeps the arrows and loses the turning.
- With no script it is simply its first photograph; the arrows and count are
  hidden, because they would do nothing.

**Photographs are fetched before they are needed.** They are lazy in the
markup, and a closed segment is not on screen, so left alone nothing was fetched
until a segment opened and the picture arrived about a second after the words.
Now each segment's first photograph is fetched quietly once the page has
finished loading, pointing at or touching a heading fetches the rest of that
segment's set, and opening it does the same. Measured on a throttled
connection (150ms latency, 4 Mbit/s): 1.15s from click to photograph before,
none after. It costs one photograph per segment in the background (about 1MB
on Storage), and is skipped when the browser is set to save data.

> **`.carousel__plate` must stay `position: relative`.** The frames are
> absolutely positioned, and without a positioned plate they take their inset
> from the page itself, cover the segments and swallow every click on them.

## The Contact list keeps its own rhythm

The order is Tom's: the rate card, then Storage, Transport & Handling,
Photography, Installation, Viewing Room, Project Management and Collection &
Estate Management. The labels are in Title Case to match the navigation.

The eight enquiry rows used to carry `flex: 1` and share out the whole height of
their column, which made each one about 90px tall with the words floating in the
middle. That reads nothing like the ruled lists on the service pages, which are
set by their padding and come out around 60px.

They now take the same `padding-block: 0.95rem` and sit at their own height:
56px against the service pages' 60px at a 900px window. The list ends where it
ends rather than being stretched to the foot of the column.

Below about 850px tall the page still compresses the rows to hold one screen,
because Contact fitting the screen is the older requirement and it wins. So the
two only match on a tall window, which is where anyone is comparing them.

**One column of eight at every width.** It used to split into two of four below
62rem, which halved the height but read as a grid of tiles rather than a list.
The cost is honest and worth knowing: at 390×844 and 430×932 — most current
phones — the page still holds one screen, but a small phone (360×640) now runs
about 190px over, and a tablet about 130px. Contact scrolls a little on those.
The list reading as a list was judged worth it.

## The About portrait is sized from the window, not its column

`clamp(20rem, 46vh, 30rem)`: the plate is 3:4, so a width of 46vh stands about
61vh tall and sits on the centre line of the screen with room above and below.
It is 414×552 at 1440×900, against 352×469 before.

It used to hold 6rem back from its column for the signature that hung off its
corner; with the signature gone it takes the full column.

## Two closing tags the browsers had been repairing

`journey__track` on Storage & Handling and `.shell.marginalia` on the home
page's Location panel were never closed. Browsers repair that silently, so
nothing ever looked wrong, but the markup did not parse as written. Both are
closed now and all seven pages parse with no unclosed or mismatched tags —
worth re-checking with a parser rather than by eye if sections get moved again.

## The pointer

A dot replaces the cursor, as on Dougal's holding page, opening up over anything
you can act on. It is the paper colour on the blue and turns over to ultramarine
on the paper sections, so it stays visible either way up. It is painted straight from the pointer event rather than waiting for the next
animation frame — a rendering opportunity can be a frame away, and that reads
as lag. The two `closest()` walks that decide its size and colour are skipped
entirely while the pointer stays over the same element, and the dot is given
its own compositor layer so moving it never repaints the page.

It is gated three ways — a real mouse, scripting available, and motion not
reduced — and the native cursor is only hidden once the dot is confirmed
running, so a script failure can never leave someone without a pointer. Touch
devices never see it.

## The first screen

The hero is `100svh` minus the real masthead height, which JavaScript measures
and writes to `--masthead-h`, so it ends **exactly** at the fold on any viewport
— nothing of the section below shows above it. Checked at ten sizes from
1600x1000 down to 360x560 and a landscape phone: 0px of slate visible at every
one. If you ever put a term back into that `calc()`, that is what you are
trading away.

`scroll-padding-top` uses the same value, so anchor links land just under the
masthead.

Inside, `.hero__centre` takes a single auto margin **above** it, so the free
space is all spent there and the wordmark sits low on the screen the way a title
sits low on an exhibition poster, with the cue beneath it. The four disciplines
that used to sit under it, and the typed line that used to arrive before it,
came off at Fred's request. `.hero__mark` is `width: 100%`, so the wordmark runs out to the
page's right margin rather than stopping at a measure of its own.

Two values decide how low the whole group sits, and nothing else needs to move:
`.hero`'s `padding-bottom` and `.hero__centre`'s `margin-bottom`.

### The cue arrives late

`.scroll-cue` carries `animation: cue-in 0.9s ease 2.2s backwards`, so the first
thing anyone sees is the wordmark on its own; the arrow fades up a couple of
seconds later.

The fill mode is **`backwards`, not `both`**, and that is the whole trick. CSS
animations outrank author declarations — inline styles included — so a finished
`both` animation would go on asserting `opacity: 1` and the script could never
fade the cue out once you started scrolling. `backwards` holds the opening frame
through the delay and then stops contributing, which leaves the inline style
free to work. Measured: opacity 0 at 0.4s, 1.2s and 2.1s; 0.92 at 2.8s; 1 at
3.6s; 0 again after scrolling 400px; back to 1 at the top of the page.

The block sits inside the reduced-motion guard, so anyone who has asked for less
movement gets the cue immediately and without the fade. With JavaScript off the
entrance still happens — it is CSS, and nothing about it needs a script.

Dragging across it draws a mark in the paper colour, the width of the cursor dot,
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
page still reaches the foot of the screen.

Contact is meant to hold one screen with no scrolling, and it does from about
700px of viewport height upward. Three things make that work, and all three are
worth knowing before adding anything to the page: the photograph is sized from
the height going spare (`clamp(6rem, 22vh, 15rem)`) rather than from its own
ratio; below 62rem the enquiry list runs as two columns of four instead of one
of eight; and below 30rem the photograph is dropped, as the one thing on the
page carrying no information. On a very short phone it still scrolls a little.

About carries a single portrait and lets it stand on its own — the drawn
signature that used to cross its corner came off in Fred's final round.

Contact: the email address sits in the left-hand column under the
introduction; the enquiry list is the middle column; the right-hand column is
the photograph with the company's registration details under it (Storehouse
Fine Arts Ltd, registered in England & Wales, company 16631030, VAT 499103269).
No street address — see *Location, and the insurer*.

## The order of the home page

The first screen is the wordmark on the ultramarine, alone, with the scroll cue
at the foot. Then: the overview on the paper, Recent work back on the blue, and
the closing enquiry panel on the paper.

The masthead reads the ground beneath it as it goes and takes a matching
backdrop: `data-over="blue"` by default, or the value of the section's own
`data-ground` (`paper`). `assets/js/site.js` looks for `[data-paper]` and
`.footer`, so **a new ground needs two things and no JavaScript**:
`data-paper data-ground="x"` on the section, and a `.masthead[data-over="x"]`
rule beside the others.

## The paper panels, and the enquiry panel on each page

The home page overview and the enquiry panel that closes each page are paper
`.panel`s — the inverse ground, and the moment of rest in a blue page. (The
overview was on the slate until Fred's final round; the slate and charcoal
grounds have gone from the site with it and with the Location section.)

Every enquiry panel is the same three things: the *Enquiries* label in the
margin, one serif line, and one button —

| Page | Button | Email subject |
|---|---|---|
| Home | Get in touch | Enquiry |
| Storage | Request a rate card | Rate card request |
| Transport & Handling | Get in touch | Transport & Handling enquiry |
| Additional Services | Get in touch | Additional Services enquiry |

Panels are deliberately **not** given `data-reveal`: the reveal fades a whole
section, background included, so the page showed through for a moment as it
scrolled into view.

## Buttons open an email

Every button on the site is a `mailto:` link with a subject line already filled
in from where it was clicked, so it opens an email draft straight away rather
than sending people to the Contact page first. The buttons on Additional
Services: *Book photography* (Photography enquiry), *Plan an installation*
(Installation enquiry), *Discuss a project* (Project management enquiry), *Book
a collection audit* (Collection audit request). About's *Get in touch* is
*Enquiry*. Contact's own list did this already.

All buttons are set in the serif, the same face as the copy around them.

## Labels and the footer

Words in the margin — *Overview*, *Enquiries*, the section line above the
Instagram grid, the footer's headings — are the navigation's sans in capitals,
a size up from the numbers (`.label`, 0.8125rem, 0.08em tracking). The mono is
kept for numbering only (`.ledger`, the `01.1` indexes, the carousel count).

The footer is three columns — *What we do*, *Company*, *Contact* — under a
single rule at its top, inside the page margins. The wordmark, the colophon line
and the rate-card link that used to be in it came off in Fred's final round.

## Recent work

The four written case studies are gone; in their place is a grid from
Storehouse's Instagram, so the home page keeps itself current without anyone
editing the site. Eight square-ish tiles (4:5), four across on a desktop and two
on a phone.

The account is **@storehousefinearts** (`https://www.instagram.com/storehousefinearts/`). The word
*Instagram* in the heading links to it, as do the footer and the business's
structured data (`sameAs`).

**How the grid fills itself.** Every deploy — on every push, and on a schedule
every six hours — runs `tools/instagram.py` before the site is published. It
reads a [Behold](https://behold.so) JSON feed, downloads the latest posts'
pictures into `assets/img/gram/` as 800×1000 WebP, and rewrites everything
between the two markers in `index.html`:

```html
<!-- instagram:start -->
<ul class="gram" data-gram> … </ul>
<!-- instagram:end -->
```

Each tile links to its post, with the post's alt text or caption as the
picture's description. Nothing from Instagram is loaded by visitors' browsers —
the pictures are served from the site itself — so the Content Security Policy
does not change. Behold's free plan returns six posts, so with six the grid sets
itself three across in two rows; with eight it is four across.

**It never fails a deploy.** With no feed address set, or if the feed cannot be
reached, the step leaves the page exactly as it is in the repository (the
placeholder tiles, which link to the profile) and says why in the deploy log.

**To connect it** (one-off):

1. In the Instagram app, switch @storehousefinearts to a **Creator** or **Business**
   account (Settings → Account type and tools). Free, and reversible. Behold —
   like every Instagram feed since Meta closed its API to personal accounts in
   December 2024 — cannot read a personal account.
2. Sign up at behold.so, connect the Instagram account, create a feed, choose
   **JSON**, and copy the feed URL.
3. In this repository: **Settings → Secrets and variables → Actions → New
   repository secret**, named `INSTAGRAM_FEED_URL`, with the feed URL as its
   value. Then run the deploy once by hand (Actions → Deploy to GitHub Pages →
   Run workflow) to fill the grid straight away.

> GitHub switches off scheduled workflows in a public repository after 60 days
> with no commits. Any push turns the schedule back on, so this only matters if
> the site goes untouched for two months — the grid would then update on the
> next push rather than every six hours.

Fred is happy with the grid as it is. The heading reads *Follow us on Instagram
for all our recent work.*

## Location, and the insurer

At Fred's request — his insurer has grown wary of the site advertising where the
works are kept — **the site does not name Acton or give a street address
anywhere**: not in the footer, not on Contact, not in the JSON-LD. Where it
says where Storehouse is at all, it says *north-west London* and nothing more
precise. The home page's Location section and the Google Maps dialog have both
gone.

## Imagery

`assets/img/` holds WebP derivatives cut from the client photography. Originals
are not in the repository — they are large, and the site does not need them.

**Every picture on the site comes from `Photography/Udpated`** (the folder is
spelled that way on the client's disk) and from `Photography/Portraits`. Nothing
from the older `Photography/Storehouse` folder is used.

Two things follow from that set, and both are worth knowing before swapping a
picture:

- **It is all 3:4 portrait,** bar one frame. That is why the plates are cut to
  3:4 and 4:5 and nothing else, and why the portrait plates are held to a
  `max-width` rather than filling their column — at full width they would stand
  about twice the height of the words beside them.
- **There is no facility, racking or vehicle photography in it.** Storage and
  Transport are therefore carried by the crate frames, which are the closest
  thing the shoot has. If a warehouse or a van is ever shot, those two are the
  first pictures to replace.

Frames showing a technician's face or the back of their head are avoided
everywhere except About, which is a portrait.

| Set | Size | Ratio |
|---|---|---|
| Carousels (`assets/img/shoot/240726_NN.webp`, named after the original frame) | 1200 × 1600 | 3:4 |
| Instagram placeholders (`assets/img/journey/`) | 690 × 920 | 3:4 |
| Contact (`contact-900`) | 900 × 1125 | 4:5 |
| About portrait (`portrait-fred-900`) | 640 × 853 | 3:4 |
| Social card (`og-1600`) | 1600 × 900 | 16:9 |

| Carousel | Frames from the shoot (`240726_NN`) |
|---|---|
| Storage — Overview | 49, 52, 54 |
| Security | 43, 46 |
| Handling | 09, 89, 16 |
| Insurance | 08, 34 |
| Climate-Controlled Storage | 36, 44 |
| Ambient Storage | 47, 49 |
| Viewing Room | 54, 71 |
| Transport | 89, 47, 43, 36 |
| Packing & Crating | 14, 17, 19, 32, 35, 45 |
| Photography | 71, 72, 54 — Fred's own photographs of artworks to come |
| Installation | 111, 62, 95 |
| Project Management | 88, 97, 98 |
| Collection & Estate Management | 08, 44, 33 |

To add one, export a WebP at the size in that table, drop it in `assets/img/`,
and reference it with explicit `width` and `height` attributes so the page does
not jump while it loads.

---

## Notes and assumptions

Worth confirming before launch:

- **Email** — `info@storehousefinearts.com`, from the copy document. The brand
  document's business card shows `fred@storehouse.com` and `storehouse.com`,
  which conflicts. The copy document was treated as newer.
- **Domain** — `storehousefinearts.com` assumed throughout.
- **Instagram** — @storehousefinearts, linked from the home page and the footer. The grid
  fills itself once a Behold feed is connected; see *Recent work*.
- **Photography** — the Photography segment on Additional Services has its own
  large carousel, which shows each photograph whole. It is waiting on Fred's
  photographs of artworks; until then it carries three frames from the shoot.
- **Telephone** — not published. The only number available was Fred's mobile,
  from the business card.
- **Contact** — the enquiry links are `mailto:` with the subject pre-filled.
  They need no server and cannot break. If a real form is wanted later,
  Formspree or Netlify Forms will drop in without changing the design.

## Performance

Nothing is fetched from a third party. All three typefaces are self-hosted
woff2 in `assets/fonts/` and the two used above the fold are preloaded; the
mono is subsetted to the characters the site actually draws, which takes it
from 10KB to 4KB. There is no Google Fonts request, no preconnect, no DNS
lookup off-origin, and since the map came off there is no external request of
any kind.

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
frame-src 'none'; form-action 'self'; base-uri 'self';
object-src 'none'; upgrade-insecure-requests
```

Two things to know if you edit it. `style-src` allows inline styles because the
pages use `style="…"` attributes throughout. `script-src` names the SHA-256 hash
of the one inline script — the line that adds the `js` class. **If you change
that line by even a character, the hash no longer matches and the script is
blocked**, which would leave the reveal animations and the card row inert.
Recompute it, or move the line into `site.js`.

`frame-src` is `'none'`: the map was the only frame, and it has gone.

## Search

Every page carries a title, a description, a canonical URL, Open Graph and
Twitter card tags with image alt text, and JSON-LD:

- Home — `ProfessionalService` and `WebSite`, with the VAT number and a locality
  of north-west London (no street address — see *Location, and the insurer*).
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
- Keyboard reachable throughout, with a visible focus ring in the current ink and a skip link.

### The skip link is clipped, not parked above the page

`.skip-link` is hidden the visually-hidden way — 1px box, `overflow: hidden`,
`clip-path: inset(50%)` — and unfolds on `:focus`. It is **not** hidden with
`transform: translateY(-110%)`, which is what it used to do.

Safari paints the region above the document origin during a rubber-band
over-scroll, so a link parked up there appeared on screen every time anyone
pulled down at the top of the page. Chrome does not repaint that region, which
is why it only ever showed on one of them. Clipped in place there is nothing up
there to reveal; nothing on the page now renders above y = 0.

If you ever move an element off-screen to hide it, move it **down or sideways**,
or clip it. Never up.
- `prefers-reduced-motion` disables the scrub, the reveals and the page transitions.
- Content is never hidden by CSS that depends on JavaScript succeeding.
- A print stylesheet renders the site as a plain document — this trade still prints things.
