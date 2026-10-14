# Storehouse Fine Arts — website

A static site for Storehouse Fine Arts. Plain HTML, CSS and a small amount of
vanilla JavaScript — no build step, no framework, no dependencies. Open any
`.html` file in a browser and it works.

Built from the *Storehouse Brand Identity* (2025) document and Fred's copy.

---

## Pages

**Storehouse is a storage business first.** Fred's October 2026 brief, written
after two existing clients advised it, leads with storage — the simplest thing
to say yes to, and the one that earns the trust for everything else — and moves
the site away from the consultancy positioning it launched with. Collectors,
artists and estates are the audience; galleries are welcome but not the focus.

Fred's own way of putting the three headings: **Storage** is the building,
**Transport & Handling** is getting a work from A to B, and **Services** are the
optional extras.

| File | Nav | Page |
|---|---|---|
| `index.html` | — | Home |
| `storage.html` | 01 | Overview, Climate-Controlled Storage, Ambient Storage, Viewing Room |
| `transport-and-handling.html` | 02 | Transport, Packing & Crating — and the card row |
| `services.html` | 03 | Photography, Installation, Project Management, Collection & Estate Management |
| `about.html` | 04 | About |
| `contact.html` | 05 | Contact |
| `404.html` | — | Not found |

The three old addresses still answer, as forwards — see *Old addresses* below.

## Where the copy comes from

**Every descriptive line on the three service pages, the home page overview and
About is verbatim from Fred's brief** — *Storehouse Website Rethink — Brief for
Tom (Oct 2026)* — and nothing has been added to it. Before writing anything new
on those pages, check the brief first and add it there.

Three things are ours rather than his, and are the places to look if something
reads oddly: the button labels on the service entries, the enquiry rows on
Contact, and the line typed on arrival (which is lifted from his About copy).

Two pieces are still to come from Fred, agreed on the call of 14 October: the
wording for the Recent work section and a short location blurb.

## Editing the copy

All text lives directly in the `.html` files. Find the sentence you want and
change it — nothing is compiled or generated.

The header and footer are repeated in each page. If you change a navigation
link, change it in all seven pages (`index`, `storage`, `transport-and-handling`,
`services`, `about`, `contact`, `404`) — the desktop dropdowns and the mobile
menu both carry the sub-items, so there are two places per page.

**Two places are waiting on content:**

- `index.html` — the Recent work grid, between `<!-- instagram:start -->` and
  `<!-- instagram:end -->`. See *Recent work* below.
- `index.html` — the Location panel, which says only "North-west London." until
  Fred's blurb arrives.

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

## The Journey

One work travelling the whole service: received, wrapped, boarded, crated,
stored, moved, installed, photographed. Eight real frames from the Storehouse
shoot, in the order they happen.

**It lives on `transport-and-handling.html`,** directly under the services —
the page about a work's movement is the natural home for a work moving.

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
the same specificity, so a paper, slate or charcoal section still overrides the
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

Five items, in Fred's order: **Storage | Transport & Handling | Services |
About | Contact**. The first three open a panel on hover, after the reference
Fred sent, but drawn in the site's own language rather than a stock mega-menu:
**a compact panel hung under its own link**, not the width of the page. It is
the sub-items alone, with the same mono numbers the pages use (`01.1`, `01.2`…),
ruled only between items, with no outline round the panel. No title
(it would repeat the link it hangs from) and no photographs, both at Tom's
request.

**The panel takes the ground the bar is on.** Its colours are custom properties
(`--drop-bg`, `--drop-ink`, `--drop-soft`, `--drop-faint`, `--drop-rule`) set
under each `.masthead[data-over]` state, so as the bar turns slate, charcoal or
paper going down the home page, the panel under it turns with it. A new ground
needs a line here as well as its masthead rule.

- **Placing it.** The panel is positioned against its own nav item, so it
  follows the link. The script measures the gap from the foot of the link to the
  foot of the masthead (`--drop-gap`) so the panel starts exactly under the bar,
  and turns a panel to hang from the right of its link (`data-align="end"`)
  where it would otherwise run past the page margin — Services, at every width.
  Without the script the gap falls back to a close guess and every panel hangs
  left.
- **It is CSS first.** `:hover` and `:focus-within` on `.nav__item--drop` open
  it, so a keyboard user tabbing along the bar gets the same panel, at once. The
  script adds Escape to shut it (`data-shut`).
- **Closing is delayed by 0.22s, opening on hover by 0.12s.** The close delay
  and an invisible bridge (`::after` on the link) carry the pointer from the
  link into its panel. The open delay stops a quick pass under a neighbouring
  link from opening that one.
- **Passing under a neighbour.** The panels sit side by side, so the way down
  from one link to the far end of its panel runs under the next link for longer
  than any sensible delay. The script handles that one case: entering a
  neighbour from *below* the line of the links while another panel is open
  holds the open one (`data-keep`) and keeps the neighbour shut (`data-wait`),
  and the neighbour only takes over if the pointer stays on it for 320ms.
  Moving along the bar itself switches panels normally.
- **There is no `pointer-events` toggle**, and that is deliberate. It switched
  instantly while the visibility waited, so the panel stopped receiving the
  pointer the moment it left the link and shut under it. Hidden visibility
  already refuses the pointer; nothing else is needed.
- The sub-items are anchors (`storage.html#ambient`), and the page opens the
  matching entry on arrival and on `hashchange`, so a sub-item works whether you
  are already on that page or not. Without a hash every entry starts closed.

Testing this with Playwright: use `mouse.move` to the link, not `hover()`.
`hover()` scrolls the element into view first, which moves the page under the
sticky bar and changes its ground — it looks as though the panel ignored the
colour when it did not.

On a phone the menu lists the sub-items under each heading; there is no hover to
hide them behind.

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

## The expanding index — all three service pages

All three service pages use it; the card row follows underneath on Transport &
Handling. **Title and services run down one side, one standing photograph down
the other**, and each service opens to its copy — the pictures are out of the
entries entirely. The entries are numbered from the page's ledger number —
`01.1`, `01.2` on Storage — and Storage's Overview is entry `01`. Everything
starts closed; an entry opens when it is clicked or linked to.

Each open entry leaves `clamp(2.5rem, 4vw, 3.25rem)` under its button before the
next rule.

**The Overview is laid out differently**, because it carries four paragraphs
against a sentence or two everywhere else. The first stands on its own, at the
same size as every other entry; the other three are ruled rows with a mono label beside them — *Security*,
*Handling*, *Insurance* — like a facility report. The labels are ours; the words
are Fred's, unchanged.

**The entries open independently** — opening one does not close another. They
used to be exclusive (a shared `name` on the `<details>`), but closing an entry
above the one clicked shortens the page under the reader: near the foot of the
page the browser then has to shift the whole view, and the photograph beside the
list visibly jumped. Measured after the change: 234 opens and closes across the
three pages at three window sizes, the photograph moved on none.

**The photograph is not sticky.** It was for a round, to keep pace with the long
Overview, but a sticky element resting against the foot of its section is moved
by anything that changes the section's height, which was the same jump again.

`.services-page` carries `min-height: calc(100svh - var(--masthead-h))`, so the
blue holds the screen whatever the window. Without it the paper panel below
climbs into the first screen on a tall display and the page reads as a short
blue band with a white page underneath. Checked at five sizes from 1280×800 to
1920×1200: the white never starts above the fold.

The standing photograph takes its width from the **height** of the window —
`clamp(18rem, 58vh, 38rem)` — so it fills the screen it is on rather than the
column it sits in. Same trick as the About portrait. It is the one `loading`
value on the site set to `eager`, because it is above the fold on both pages.

### The standing photograph is a slideshow

It turns over every 2s through that page's own frames — four on Storage, five
on Transport & Handling, five on Services. Every frame
is in the markup and **the first is the only one that starts opaque**, so with
the script absent the panel is simply a photograph.

A row of dots is laid on the foot of the photograph — white, with a little
shadow, because what is behind them is a different picture every two seconds and
cannot be relied on to be dark. They are built in script rather than written
into the page, because without the script there is nothing for them to indicate.

**The dots are marks; the two halves of the photograph are the controls.** Left
steps back, right steps on, both wrapping round. They are real buttons with real
labels, so they answer to a keyboard as well as a pointer — and two tab stops
that mean "back" and "forward" are worth more than six that each mean "jump to
frame four". The dots themselves take `pointer-events: none` so the halves
underneath get every click.

**Reduced motion keeps the controls and loses the turning.** The set is still
there to step through by hand, it just does not move on its own — a better
answer than showing one frame and hiding the rest.

It stops when it cannot be seen: an IntersectionObserver pauses it off screen
and `visibilitychange` pauses it in a background tab. A timer nobody can watch
is only work and battery.

> **`.slideshow` must stay `position: relative`.** The frames are absolutely
> positioned, and without a positioned plate they take their inset from the page
> itself — they stretch across the whole document, sit on top of the services and
> swallow every click on them. Found by a Playwright click timing out, not by
> looking: the page still rendered correctly.

Only the first frame carries alt text. The rest are `alt=""`, because a rotation
of six descriptions read aloud is noise, and the page's own copy carries the
meaning.

Each entry is an ordinary `<details>`, so **with the script absent every one
still opens and closes** — the browser does it, not us. The shared `name`
attribute is what keeps only one standing open at a time; where that is not
supported the entries simply toggle independently, which is a fair fallback.
Verified: keyboard reaches each `summary` by Tab, Enter opens it, and opening
one closes the last.

The plus is two crossed rules, the upright one turning flat when the entry
opens, so it becomes a minus without a second glyph or an icon font.

It is the layout at every width, not just desktop.

The text measure is `36rem` on the paragraph **and** the points. Capping only
the paragraph, as it was, left the block visibly ragged — a short paragraph
sitting above a bullet that ran almost to the picture.

## The signature writes itself

`pathLength="1"` normalises each path to a length of one, so a single dash
covers it and `stroke-dashoffset` can run from 1 to 0 in CSS — no
`getTotalLength`, no script, no measuring. The two paths are the two words, so
Henderson picks up as Fred finishes, and it starts the moment the page opens
rather than after a pause. Measured: Fred is already drawing at 0.25s and done
by 1.35s, Henderson done by 3.15s.

Outside the reduced-motion guard there is no dash at all and the signature is
simply there, drawn, which is the right resting state.

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

`min(100% - 6rem, …)` holds 6rem back from the column, because the signature
hangs 17% of the plate past its right edge. Without that, the bigger plate
pushed the flourish off the side of the page and the whole document scrolled
sideways — 37px over at 480px wide. Checked at thirteen widths from 360 to 1920.

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
that used to sit under it came off at Fred's request. `.hero__mark` is `width: 100%`, so the wordmark runs out to the
page's right margin rather than stopping at a measure of its own.

Two values decide how low the whole group sits, and nothing else needs to move:
`.hero`'s `padding-bottom` and `.hero__centre`'s `margin-bottom`.

### The arrival

On the first visit of a session, the screen is a single line typing itself out
in the middle — *We are art people who do logistics, not logistics people who do
art.* — and nothing else: **the navigation and the cue wait** until it is over.
Then the line becomes the wordmark. The rest of the sentence dissolves, and ten
of its letters — s, t, o, r, e, h, o, u, s, e — travel down to the foot of the
screen, growing and changing shape into the wordmark's own letters on the way,
in a wave from left to right. When they land the real wordmark takes over from
them, the navigation fades in, and the cue follows.

How it is built, in `site.js`:

- **The line is laid out whole from the start**, one span per character, and
  each is made visible in turn. Typing by slicing the text re-centred the line
  on every keystroke. Words are wrapped so the browser never breaks a line
  inside one; the caret hangs off the last letter typed so it never pushes the
  line along.
- **The wordmark is one SVG path.** The script splits it at each move-to and
  gathers the pieces by position, so the counters of the O and R stay with
  their letters: ten letterforms, left to right. If that ever yields anything
  other than ten, the morph is skipped and the wordmark simply wipes in.
- **Each of the ten picks the matching letter in the sentence** that sits nearest
  its destination along the line, so the letters mostly travel down rather than
  across each other. The sentence has no u; the U is made from a spare o.
- **The morph is two elements on one curve.** The sentence's letter grows
  towards the wordmark's position and size while a copy of the wordmark's
  letter, shrunk back to the sentence's, grows in along the same path; half way,
  one hands over to the other under a little blur. They end exactly where the
  real wordmark is, so the swap at the end is invisible.

It is written to read with any sentence (`data-type` in `index.html`), as long
as the sentence has most of the letters of STOREHOUSE.

About six and a half seconds in all, and **it always plays out in full**: the
page is held still until the wordmark has landed. Scrolling input (wheel, touch,
and the scrolling keys) is refused rather than the page being set to
`overflow: hidden`, which would take the scrollbar away and shift the layout
sideways on any system that shows one. A safety timer releases the page at 9s
whatever happens, and the arrival is not played at all if the page opens
part-way down. It plays **once per session** (`sessionStorage`,
`storehouse-arrival`) — open a new tab to see it again.

States on `.hero[data-intro]`, which the stylesheet reads: empty (script not run
yet), `running`, `morph`, `done` (with `data-morphed` if it got there by the
morph) and `rest` (never played). The navigation is hidden with
`body:has(.hero[data-intro=…])`.

Every way it can fail ends on the wordmark:

- **No script, or reduced motion** — the resting state in the stylesheet is the
  wordmark and the navigation, visible; the typed line is never shown.
- **The script stalls** — failsafe animations bring the wordmark and the
  navigation in at 9s and the cue at 9.5s on their own.
- The typed line is `aria-hidden`; the wordmark is the page's heading
  throughout, so a screen reader hears the same page either way.

The arrival runs in its own function inside `site.js`, because its variables
would otherwise collide with the painting code's — keep it wrapped.
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

During the arrival the cue is held back entirely, and it follows the wordmark
up 1.1s after the arrival ends. That is a different animation name (`cue-late`) while the
arrival runs, so the switch to `done` restarts the fade rather than inheriting
the time already elapsed. Return visits keep the original 2.2s.

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

About carries a single portrait, captioned Director as the business card in the
brand document has it. The second portrait came off at the client's request.

His name is signed across the bottom-right corner of the plate and off the edge
of it, so the photograph is not a sealed rectangle. It is **drawn**, not set, by
`tools/signature.py`.

That script defines each letter as a list of **waypoints the pen passes
through**, in handwriting coordinates (y up, baseline 0, x-height 20, ascenders
42), and fits a Catmull-Rom spline through them. Waypoints are far easier to
reason about than bezier control points, which is the whole reason for the
approach: to change a letter, move a point. Two things are worth knowing — every
lower-case letter begins and ends on the join line (y = 6) so letters chain
without the pen lifting, and two waypoints placed close together give the spline
a corner to turn on, which is what makes an s an s rather than a loop. The
capitals are printed rather than looped, which is what keeps it legible.

The `viewBox` is cropped to the ink. If you change the letters or the tilt,
re-measure it — render the SVG and call `getBBox()` on a wrapper group — or the
signature will sit off-centre in its box.

There is no script typeface to license and nothing extra to load. The corner of
this photograph is almost black and the page behind it is the ultramarine, so a
single white ink reads on both; the name is in the photograph's alt text for
anything that is reading rather than looking.

If the portrait is ever swapped for a lighter one, check the signature still
reads — there is a small drop shadow behind it for exactly that case.

## The order of the home page

The first screen is the wordmark on the ultramarine (after the arrival, on a
first visit), with the scroll cue at the foot.

Then: the overview on the slate, Recent work back on the blue, Location on the
charcoal, and the closing enquiry block on the paper — *Begin with a collection
audit or a visit to see the collection*, the call to action from Fred's brief.
Four grounds in order down one page, which is the whole reason the palette is
written as tokens rather than as colours.

The masthead reads the ground beneath it as it goes and takes a matching
backdrop: `data-over="blue"` by default, or the value of the section's own
`data-ground` (`paper`, `slate`, `charcoal`). `assets/js/site.js` looks for
`[data-paper]` and `.footer`, so **a new ground needs two things and no
JavaScript**: `data-paper data-ground="x"` on the section, and a
`.masthead[data-over="x"]` rule beside the others.

## The paper, slate and charcoal panels

The enquiry block that closes each page is a `.panel` — paper, the inverse
ground, and the one moment of rest in a blue page. The overview on the home page adds `.panel--slate`, the third brand value used
as a ground, set in white at the client's request. Location adds
`.panel--charcoal`, which carries white at 12:1 and up.

> **Contrast note — the slate section.** Slate is mid-toned, so white sits at
> about **2.6:1** against it: under the 4.5:1 every other surface on this site
> holds to, and under the 3:1 that even large text is meant to clear. This
> matters more than it used to, because the slate now carries the home page's
> main paragraph rather than a four-line address block.
>
> It is a deliberate client decision, recorded in the stylesheet next to the
> rule. Two ways out if it is ever wanted: bring the ground down to about
> `#767676`, which still reads as slate and puts white at 4.5:1, or put the
> charcoal ink back on the slate, which measures 5.9:1. The white ink itself
> has nowhere left to go.

The masthead has a third state to match, `data-over="slate"`. A paper bar over
the slate reads as a stray rectangle, which is what the state exists to avoid.

Panels are deliberately **not** given `data-reveal`: the reveal fades a whole
section, background included, so the page showed through for a moment as it
scrolled into view.

## Recent work

The four written case studies are gone; in their place is a grid from
Storehouse's Instagram, so the home page keeps itself current without anyone
editing the site. Eight square-ish tiles (4:5), four across on a desktop and two
on a phone.

**It is a placeholder until the feed is connected.** The tiles are currently the
card-row photographs. Everything the feed writes goes between two markers in
`index.html`:

```html
<!-- instagram:start -->
<ul class="gram" data-gram> … </ul>
<!-- instagram:end -->
```

Each tile is `<li class="gram__tile"><a href="{post}"><img src="{image}" alt="{caption}"></a></li>`.
Two ways to fill it, neither of which puts a third-party script on the page:

1. **A scheduled GitHub Action** that calls the Instagram API with a long-lived
   token, downloads the latest eight images into `assets/img/gram/`, and
   rewrites the block between the markers. Free, keeps the CSP as it is, and the
   pictures are served from the site itself. Needs Storehouse's Instagram to be
   a Business or Creator account linked to a Facebook page, and the token kept as
   a repository secret.
2. **A feed service** such as Behold, which exposes the posts as JSON. Simpler to
   set up, but it is a monthly subscription and the images then come from their
   CDN, which means adding it to `img-src` and `connect-src` in the CSP.

The heading reads *Follow us on Instagram for all our recent work.* — Tom's line,
lightly edited. Once there is a handle, make "Instagram" a link.

## Location, and the insurer

At Fred's request — his insurer has grown wary of the site advertising where the
works are kept — **the site no longer names Acton or gives a street address
anywhere**: not in the footer, not on Contact, not in the JSON-LD. It says
*North-west London* and nothing more precise. The footer's consultancy strapline
came off at the same time, leaving the name and the location.

The Google Maps dialog went with it, and with it the only third-party request
the site made. If a map is ever wanted back, it should be at a regional zoom,
not a pin.

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
| Card row (`assets/img/journey/`) | 690 × 920 | 3:4 |
| Service entries (`sh-*`, `ex-*`, `cm-*`) | 1000 × 1250 | 4:5 |
| Page titles (`*-hero`) | 1000 × 1333 | 3:4 |
| The list preview (`svc-0*`) | 700 × 933 | 3:4 |
| Social card (`og-1600`) | 1600 × 900 | 16:9 |

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
- **Instagram** — still no handle. It is needed for the Recent work feed, and
  for a link in the footer and the mobile menu.
- **Photography** — the brief asks for an image-led Photography page, with large
  reproductions of works Fred has photographed. It is an entry on Services for
  now; it wants those photographs before it can be its own page.
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
