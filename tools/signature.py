# -*- coding: utf-8 -*-
"""A cursive 'Fred Henderson', drawn rather than set in a face.

Handwriting coordinates: y increases upward, baseline 0, x-height 20,
ascenders about 30 above it. Every letter is a list of relative cubics, and
`glyph` corrects the last one so the letter's net displacement is exactly
(advance, 0) — which is what keeps the run of letters on its baseline instead
of wandering off it. The result is slanted and flipped into SVG space.
"""

def glyph(segs, adv):
    dx = sum(s[4] for s in segs)
    dy = sum(s[5] for s in segs)
    last = list(segs[-1])
    last[4] += adv - dx
    last[5] += -dy
    return segs[:-1] + [tuple(last)]

# --------------------------------------------------------- the lower case --
# Each starts and ends on the join line, 7 above the baseline.

N = glyph([(-2, -6,  -2, -7,   0, -7),      # down to the baseline
           ( 3,  0,   5, 13,   9, 13),      # over the arch
           ( 4,  0,   5, -8,   4, -13),
           ( 0,  4,   1,  6,   3,  7)], 18)

E = glyph([(-4,  3,  -6,  7,  -2,  9),      # into the loop
           ( 4,  2,   8, -3,   5, -7),
           (-3, -4,  -7, -3,  -7,  2),
           ( 0,  6,   5, 10,  11,  8)], 16)

R = glyph([(-1, -6,  -1, -7,   1, -7),
           ( 2,  0,   4, 11,   5, 14),
           ( 1,  3,   4,  1,   4, -3),
           ( 1, -3,   4, -3,   6,  0)], 14)

D = glyph([(-3,  1,  -8,  0,  -8, -5),      # the bowl
           ( 0, -5,   6, -7,  10, -3),
           ( 4,  4,   6, 16,   7, 27),      # up the tall stem
           ( 1,  9,  -3, 11,  -4,  3),
           (-1, -9,   3, -23,  7, -30),     # and back down it
           ( 2, -3,   5, -1,   6,  2)], 18)

O = glyph([(-3, -4,  -9, -2,  -9,  4),
           ( 0,  6,   6,  9,  10,  6),
           ( 4, -3,   3, -9,   0, -11),
           ( 3,  1,   6,  3,   8,  2)], 18)

S = glyph([(-1, -5,  -2, -7,   0, -7),
           ( 3, -1,   6,  6,   6, 10),
           ( 0,  4,  -5,  4,  -6,  0),
           (-1, -5,   4, -7,   9, -3)], 12)

def emit(p, segs):
    for s in segs:
        p.append("c %.1f %.1f %.1f %.1f %.1f %.1f" % s)

# ------------------------------------------------------------- the words ---
def fred():
    p = ["M 0 7"]
    # F: a tall loop up, the spine down, then the crossbar swept across it.
    emit(p, glyph([( 3, 12,  10, 24,  14, 31),
                   ( 4,  7,   7, 15,   2, 18),
                   (-6,  4, -11, -5, -11, -15),
                   ( 0, -14,  4, -27,  9, -36),
                   ( 3, -5,   8, -3,   8,  2)], 22))
    p.append("m -14 24")
    emit(p, [(7, -1, 15, -2, 21, -4)])
    p.append("m 1 -22")
    emit(p, R); emit(p, E); emit(p, D)
    return " ".join(p), 22 + 14 + 16 + 18

def henderson():
    p = ["M 0 7"]
    # H: two tall loops with a bar between them, the second running on.
    emit(p, glyph([( 2, 13,   8, 26,  12, 34),
                   ( 4,  8,   8, 17,   3, 21),
                   (-6,  4, -12, -6, -12, -18),
                   ( 0, -15,  4, -28,  9, -37),
                   ( 3, -5,   8, -3,   8,  3),
                   ( 0,  6,  -2, 14,  -3, 21)], 20))
    p.append("m -4 23")
    emit(p, [(8, 1, 18, 1, 27, -1)])
    p.append("m -2 -22")
    emit(p, glyph([( 2, -9,   5, -19,   9, -25),
                   ( 3, -4,   7, -2,   7,  3),
                   ( 0,  7,  -4, 18,  -6, 27),
                   (-2,  9,  -3, 15,  -2, 19)], 16))
    for g in (E, N, D, E, R, S, O, N):
        emit(p, g)
    # The flourish: out, round, and back underneath the whole name.
    emit(p, [( 9,  5,  18,  4,  22, -3),
             ( 4, -8,  -7, -13, -24, -12),
             (-44, 3, -104, 3, -162, -2)])
    return " ".join(p), 20 + 16 + 16 + 18 + 18 + 16 + 14 + 12 + 18 + 18

def svg():
    f, fw = fred()
    h, _ = henderson()
    gap = 14
    inner = ('<g transform="translate(12 104) scale(1 -1) matrix(1 0 0.2 1 0 0)">'
             '<path d="%s"/>'
             '<g transform="translate(%d 0)"><path d="%s"/></g>'
             '</g>' % (f, fw + gap, h))
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 135" '
            'fill="none" stroke="currentColor" stroke-width="3" '
            'stroke-linecap="round" stroke-linejoin="round">%s</svg>' % inner)

if __name__ == "__main__":
    open("sig.svg", "w").write(svg())
    print("written")
