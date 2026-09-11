# -*- coding: utf-8 -*-
"""'Fred Henderson' in a running hand, drawn rather than set in a face.

Each letter is a list of waypoints the pen passes through, in handwriting
coordinates: y increases upward, the baseline is 0, x-height 20, ascenders 42.
A Catmull-Rom spline is fitted through the points and converted to cubic
beziers, which is far easier to reason about than placing control points by
hand. Every lower-case letter starts and finishes on the join line (y = 6), so
they chain without the pen lifting. Two waypoints placed close together give
the spline a corner to turn on, which is what makes an s an s and not a loop.

Run this file to print the SVG. It is pasted into about.html rather than
loaded, so there is no request and no script typeface to license.
"""

XH, JOIN, ASC = 20.0, 6.0, 42.0

def spline(pts):
    """Catmull-Rom through pts, as cubic beziers."""
    n = len(pts)
    out = []
    for i in range(n - 1):
        p0 = pts[i - 1] if i > 0 else pts[0]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < n else pts[n - 1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6.0, p1[1] + (p2[1] - p0[1]) / 6.0)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6.0, p2[1] - (p3[1] - p1[1]) / 6.0)
        out.append("C %.1f %.1f %.1f %.1f %.1f %.1f" % (c1 + c2 + p2))
    return out

# --------------------------------------------------- lower case: (pts, advance)
LOWER = {
 # up the stem, down, over the arch, down, out
 "n": ([(0, 6), (2, 14), (3.2, 20), (4, 13), (4.2, 2), (6, 11),
        (8.5, 19), (11.5, 19.5), (13, 13), (13.2, 2), (14.5, 4), (16, 6)], 16),
 # the loop, then the bowl
 "e": ([(0, 6), (3.5, 10), (6.5, 14.5), (7, 17.5), (5, 18), (2.8, 14.5),
        (2.4, 10), (4, 6.5), (7, 5.5), (10, 7.5), (12, 6.5)], 13),
 # up, a shoulder, a kink, away high
 "r": ([(0, 6), (2, 13), (3.6, 19.5), (4.4, 13), (4.6, 3), (6, 10),
        (8, 15), (10.6, 16), (11.6, 13), (13.5, 13.5)], 13.5),
 # the bowl, then the tall stem and back down it
 "d": ([(0, 6), (2.4, 9.5), (4.8, 13.5), (7.4, 16), (9.6, 14.5),
        (9.9, 10.5), (8.2, 7), (5.2, 5.2), (2.6, 6.4), (2.1, 10),
        (3.8, 13.6), (6.8, 15.8), (9.6, 15.2), (10.8, 20),
        (11.6, 30), (11.9, 38.5), (11, 42.5), (9.9, 39.5), (10.2, 31),
        (10.8, 21), (11.6, 11), (12.8, 6.2), (14.4, 5.4), (16, 6)], 16),
 # the oval, closing at the top
 "o": ([(0, 6), (2.5, 10), (5, 14), (8, 17), (11, 15.5), (11.8, 11),
        (10.5, 7), (7.5, 5), (4.6, 5.6), (4, 8.5), (6, 12), (9, 15),
        (11.5, 15.5), (13.5, 11.5)], 14),
 # up to a point, back down the same side, a belly, a curl out
 "s": ([(0, 6), (2.4, 12.5), (4.0, 18.4), (4.9, 20.4), (5.4, 20.3),
        (5.2, 17.2), (3.9, 13.6), (2.7, 10.6), (2.5, 7.6), (3.9, 5.6),
        (6.3, 5.4), (8.3, 7.0), (9.2, 9.4), (11.2, 7.6)], 11.5),
}

# ------------------------------------------- capitals: (pts, advance, extras)
# Printed rather than looped, which is what keeps a signature legible.
CAPS = {
 "F": ([(7.5, 39), (10, 44.5), (13, 45.5), (13.4, 38), (12.6, 27),
        (11.6, 16), (10.8, 6), (10.4, 0.5)], 17.5,
       [[(5.5, 41.5), (12, 43.8), (19.5, 43)], [(6.6, 23), (12, 24.3), (17, 23.4)]]),
 "H": ([(1, 16), (3.5, 26), (6, 35), (8, 43), (8.6, 46), (7.5, 42),
        (5.5, 30), (4.5, 18), (4.4, 6), (5.5, 2)], 20,
       [[(19, 45), (18, 33), (16.5, 20), (16.4, 8), (17.5, 4), (20, 6)],
        [(5.2, 25), (11, 26), (17, 25.5)]]),
}

def word(letters, cap):
    pts, adv, extras = CAPS[cap]
    d = ["M %.1f %.1f" % pts[0]] + spline(pts)
    for e in extras:
        d += ["M %.1f %.1f" % e[0]] + spline(e)
    x = adv
    d.append("M %.1f %.1f" % (x, JOIN))
    for ch in letters:
        lp, la = LOWER[ch]
        d += spline([(px + x, py) for px, py in lp])
        x += la
    return " ".join(d), x

def svg(stroke=1.9, tilt=-7.0):
    fred, fw = word("red", "F")
    hend, _ = word("enderson", "H")
    inner = (
      '<g transform="rotate(%.1f 170 62)">'
      '<g transform="translate(6 96) scale(1 -1) matrix(1 0 0.17 1 0 0)">'
      '<path d="%s"/>'
      '<g transform="translate(%.1f 0)"><path d="%s"/></g>'
      '</g></g>' % (tilt, fred, fw + 9, hend))
    # The viewBox is cropped to the ink; see the note in README.
    return ('<svg class="signature__ink" aria-hidden="true" focusable="false" '
            'xmlns="http://www.w3.org/2000/svg" viewBox="8.8 42 213.3 75.1" '
            'fill="none" stroke="currentColor" stroke-width="%s" '
            'stroke-linecap="round" stroke-linejoin="round">%s</svg>'
            % (stroke, inner))

if __name__ == "__main__":
    print(svg())
