"""Fill the home page's Recent work grid from Storehouse's Instagram.

Run by the deploy workflow after the site is built and before it is published.
It reads a Behold JSON feed (https://behold.so) from the INSTAGRAM_FEED_URL
environment variable, downloads the latest posts' pictures into the built site's
assets/img/gram/ as WebP, and rewrites everything between
<!-- instagram:start --> and <!-- instagram:end --> in the built index.html.
SITE_DIR names the built site (the workflow passes _site). Nothing from Instagram is loaded by visitors' browsers: the
pictures are served from the site itself, so the Content Security Policy does
not change.

It never fails a deploy. With no feed address set, or if the feed cannot be
reached, it leaves the page exactly as it is in the repository and says why.
"""
import html
import io
import json
import os
import re
import sys
import urllib.request

PROFILE = "https://www.instagram.com/storehousefinearts/"
MAX_POSTS = 8
TILE = (800, 1000)  # 4:5, the grid's own shape
SITE = os.environ.get("SITE_DIR", ".")
PAGE = os.path.join(SITE, "index.html")
OUT = "assets/img/gram"


def log(msg):
    print("instagram:", msg)


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": "storehouse-site-build"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    return data if binary else json.loads(data.decode("utf-8"))


def picture_url(post):
    sizes = post.get("sizes") or {}
    for key in ("large", "full", "medium"):
        if sizes.get(key, {}).get("mediaUrl"):
            return sizes[key]["mediaUrl"]
    if post.get("mediaType") == "VIDEO":
        return post.get("thumbnailUrl")
    return post.get("mediaUrl")


def alt_text(post):
    text = (post.get("altText") or post.get("prunedCaption") or "").strip()
    text = re.sub(r"\s+", " ", text)
    if len(text) > 140:
        text = text[:137].rsplit(" ", 1)[0] + "…"
    return text or "A recent post from Storehouse on Instagram."


def tile(post, src):
    return ('        <li class="gram__tile"><a href="%s" rel="noopener"><img src="%s" width="%d" height="%d"\n'
            '             loading="lazy" decoding="async" alt="%s"></a></li>'
            % (html.escape(post["permalink"], quote=True), src, TILE[0], TILE[1],
               html.escape(alt_text(post), quote=True)))


def main():
    url = os.environ.get("INSTAGRAM_FEED_URL", "").strip()
    if not url:
        log("no INSTAGRAM_FEED_URL set — keeping the grid as it is in the repository")
        return
    try:
        from PIL import Image, ImageOps
    except ImportError:
        log("Pillow is not installed — keeping the grid as it is")
        return
    try:
        feed = fetch(url)
        posts = [p for p in feed.get("posts", []) if p.get("permalink")][:MAX_POSTS]
        # Whole rows of four only: Behold's free plan gives six posts, which
        # would leave a half-empty second row, so six shows as one row of four.
        if len(posts) >= 4:
            posts = posts[:len(posts) - len(posts) % 4]
    except Exception as e:  # never fail the deploy over the feed
        log("could not read the feed (%s) — keeping the grid as it is" % e)
        return
    if not posts:
        log("the feed has no posts — keeping the grid as it is")
        return

    os.makedirs(os.path.join(SITE, OUT), exist_ok=True)
    tiles = []
    for post in posts:
        src_url = picture_url(post)
        if not src_url:
            continue
        try:
            im = Image.open(io.BytesIO(fetch(src_url, binary=True)))
            im = ImageOps.exif_transpose(im).convert("RGB")
            im = ImageOps.fit(im, TILE, Image.LANCZOS)          # centre-cropped to 4:5
            name = "%s/%s.webp" % (OUT, re.sub(r"[^0-9A-Za-z_-]", "", str(post.get("id", len(tiles)))))
            im.save(os.path.join(SITE, name), "WEBP", quality=78, method=6)
            tiles.append(tile(post, "/" + name))
        except Exception as e:
            log("skipped a post (%s)" % e)
    if not tiles:
        log("no pictures could be fetched — keeping the grid as it is")
        return

    page = io.open(PAGE, encoding="utf-8").read()
    block = '<!-- instagram:start -->\n    <ul class="gram" data-gram>\n%s\n    </ul>\n    <!-- instagram:end -->' % "\n".join(tiles)
    new, n = re.subn(r"<!-- instagram:start -->.*?<!-- instagram:end -->", lambda m: block, page, count=1, flags=re.S)
    if n != 1:
        log("markers not found in index.html — keeping the grid as it is")
        return
    io.open(PAGE, "w", encoding="utf-8").write(new)
    log("grid filled with %d posts" % len(tiles))


if __name__ == "__main__":
    main()
    sys.exit(0)
