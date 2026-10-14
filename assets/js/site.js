/* Storehouse Fine Arts — progressive enhancement only.
   Every page works with this file absent: the journey reads as a plain row of
   captioned images, the jump filter is an ordinary contents list, the menu is
   a link list, and the pointer stays the one the operating system provides. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cursorRunning = false;

  /* ---------------------------------------------------------------- masthead */

  var masthead = document.querySelector(".masthead");
  if (masthead) {
    var footer = document.querySelector(".footer");
    var setChromeHeights = function () {
      var root = document.documentElement.style;
      root.setProperty("--masthead-h", masthead.offsetHeight + "px");
      if (footer) root.setProperty("--footer-h", footer.offsetHeight + "px");
    };
    setChromeHeights();
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(setChromeHeights);
      ro.observe(masthead);
      if (footer) ro.observe(footer);
    }
    window.addEventListener("resize", setChromeHeights, { passive: true });

    var mark = function () {
      // Queried each time, so a section added to the page is picked up without
      // the list having to be rebuilt.
      var paperZones = document.querySelectorAll("[data-paper], .footer");
      masthead.dataset.scrolled = window.scrollY > 8 ? "true" : "false";

      // Turn over wherever the masthead is sitting on one of the paper sections.
      var line = masthead.offsetHeight / 2;
      var straddles = function (el) {
        var r = el.getBoundingClientRect();
        return r.top <= line && r.bottom >= line;
      };
      var ground = "blue";
      for (var i = 0; i < paperZones.length; i++) {
        if (straddles(paperZones[i])) {
          // Each section names its own ground, so a new one only has to carry
          // data-ground and a matching masthead rule. A bar in the wrong
          // colour over a section reads as a stray rectangle.
          ground = paperZones[i].dataset.ground || "paper";
          break;
        }
      }
      masthead.dataset.over = ground;
    };
    mark();
    window.addEventListener("scroll", mark, { passive: true });
    window.addEventListener("resize", mark, { passive: true });
  }

  /* ------------------------------------------------------------- mobile menu */

  var menu = document.getElementById("menu");
  if (menu) {
    var setMenu = function (open) {
      menu.dataset.open = open ? "true" : "false";
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.style.overflow = open ? "hidden" : "";
      document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
      if (open) {
        var first = menu.querySelector("a");
        if (first) first.focus({ preventScroll: true });
      }
    };
    setMenu(false);
    document.querySelectorAll("[data-menu-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setMenu(menu.dataset.open !== "true");
      });
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.dataset.open === "true") {
        setMenu(false);
        var t = document.querySelector("[data-menu-toggle]");
        if (t) t.focus();
      }
    });
  }

  /* ------------------------------------------------------------------ reveal */

  var revealables = document.querySelectorAll("[data-reveal]");
  if (revealables.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.dataset.shown = "true"; });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.dataset.shown = "true";
          io.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------------------------------------------------------- the scroll cue */

  var cue = document.querySelector("[data-scroll-cue]");
  if (cue) {
    cue.addEventListener("click", function () {
      var target = document.querySelector(cue.dataset.scrollCue);
      if (target) target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
    // Once you have started scrolling it has done its job.
    window.addEventListener("scroll", function () {
      cue.style.opacity = window.scrollY > 120 ? "0" : "";
      cue.style.pointerEvents = window.scrollY > 120 ? "none" : "";
    }, { passive: true });
  }

  /* -------------------------------------------------------------- dropdowns */

  /* The panels open on hover and focus in CSS. This adds the one thing CSS
     cannot do: Escape to shut one while focus is still inside it. */

  Array.prototype.forEach.call(document.querySelectorAll("[data-drop]"), function (item) {
    var reopen = function () { item.removeAttribute("data-shut"); };
    item.addEventListener("mouseenter", reopen);
    item.addEventListener("mouseleave", reopen);
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) reopen();
    });
    item.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      item.setAttribute("data-shut", "");
      var top = item.querySelector(".nav__link");
      if (top) top.focus();
    });
  });

  /* ---------------------------------------------------- opening an entry by link */

  /* A link to storage.html#ambient should land with Ambient Storage open, not
     closed under its heading. Browsers do not open a <details> that is itself
     the target, so this does. */

  var openFromHash = function () {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var d = document.getElementById(decodeURIComponent(id));
    if (!d || d.tagName !== "DETAILS") return;
    d.open = true;
    window.requestAnimationFrame(function () {
      d.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
    });
  };
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  /* ---------------------------------------------------------------- arrival */

  /* On the home page a line types itself out in the middle of the screen, holds,
     and then becomes the wordmark: the rest of the sentence dissolves while ten
     of its letters — s, t, o, r, e, h, o, u, s, e — travel down to the foot of
     the screen, growing and turning into the letters of the wordmark itself as
     they go. The navigation waits until it has landed.

     Once a session: coming back to the home page in the same visit goes straight
     to the wordmark. It always plays out in full: the page is held still until
     the wordmark has landed, rather than letting a scroll cut it short.

     States on the hero, which the stylesheet reads:
       ""       not decided yet (the script has not run)
       running  typing
       morph    letters travelling
       done     arrived (with data-morphed if it got there by the morph)
       rest     never played: seen already, reduced motion, or nothing to type */

  var hero = document.querySelector(".hero[data-intro]");
  var typed = hero && hero.querySelector("[data-type]");
  var seen = false;
  try { seen = window.sessionStorage.getItem("storehouse-arrival") === "1"; } catch (e) {}

  // Its own function, because var is scoped to the whole file: the painting code
  // further down declares an `at` of its own, and the two would overwrite each
  // other mid-sentence.
  // Not played if the page has opened part-way down (a reload mid-page): the
  // line would be typing off screen while the page refused to move.
  if (hero && (!typed || reduced || seen || window.scrollY > 0)) hero.dataset.intro = "rest";
  else if (hero) (function () {
    var line = typed.textContent.trim();
    var chars = [], timer = null, finished = false, overlay = null, at = 0;

    // Holding the page still. Scrolling input is refused rather than the page
    // being set to overflow: hidden, which would take the scrollbar away and
    // shift the whole layout sideways on any system that shows one.
    var held = ["wheel", "touchmove"];
    var scrollKeys = [" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "End", "Home"];
    var hold = function (e) { e.preventDefault(); };
    var holdKeys = function (e) { if (scrollKeys.indexOf(e.key) > -1) e.preventDefault(); };
    var release = function () {
      held.forEach(function (ev) { window.removeEventListener(ev, hold, { passive: false }); });
      window.removeEventListener("keydown", holdKeys);
    };

    // One span per character, laid out from the start and shown one at a time,
    // so the centred lines never shift as the sentence grows. Words are held
    // together, or the browser would break a line in the middle of one.
    typed.textContent = "";
    line.split(" ").forEach(function (word, w) {
      if (w) typed.appendChild(document.createTextNode(" "));
      var wrap = document.createElement("span");
      wrap.className = "hero__word";
      Array.prototype.forEach.call(word, function (c) {
        var ch = document.createElement("span");
        ch.className = "hero__ch";
        ch.textContent = c;
        wrap.appendChild(ch);
        chars.push(ch);
      });
      typed.appendChild(wrap);
    });

    var remember = function () {
      try { window.sessionStorage.setItem("storehouse-arrival", "1"); } catch (e) {}
    };

    var finish = function (morphed) {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      window.clearTimeout(safety);
      release();
      if (overlay) overlay.remove();
      chars.forEach(function (ch) {
        if (ch.getAnimations) ch.getAnimations().forEach(function (a) { a.cancel(); });
        ch.removeAttribute("data-caret");
        ch.dataset.on = "";
      });
      if (morphed === true || hero.dataset.intro === "morph") hero.dataset.morphed = "";
      hero.dataset.intro = "done";
      remember();
    };
    var safety = null;

    /* The wordmark is one path. Split it at each move-to and gather the pieces
       by where they sit, so the counters of the O and R stay with their letter:
       ten letters, left to right. */
    var letterforms = function (svg) {
      var src = document.querySelector("#wordmark path");
      if (!src) return null;
      var parts = src.getAttribute("d").split(/(?=M)/).filter(Boolean);
      var probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
      svg.appendChild(probe);
      var boxes = parts.map(function (d) {
        probe.setAttribute("d", d);
        var b = probe.getBBox();
        return { d: d, x: b.x, y: b.y, r: b.x + b.width, b: b.y + b.height };
      });
      probe.remove();
      boxes.sort(function (p, q) { return p.x - q.x; });
      var groups = [];
      boxes.forEach(function (p) {
        var g = groups[groups.length - 1];
        if (g && p.x < g.r - 0.5) {
          g.d += p.d;
          g.x = Math.min(g.x, p.x); g.y = Math.min(g.y, p.y);
          g.r = Math.max(g.r, p.r); g.b = Math.max(g.b, p.b);
        } else groups.push({ d: p.d, x: p.x, y: p.y, r: p.r, b: p.b });
      });
      return groups.length === 10 ? groups : null;
    };

    var morph = function () {
      var markSvg = hero.querySelector(".hero__mark svg");
      if (!markSvg || !Element.prototype.animate) return finish(true);
      var groups = letterforms(markSvg);
      if (!groups) return finish(true);

      hero.dataset.intro = "morph";
      chars.forEach(function (ch) { ch.removeAttribute("data-caret"); });

      var heroBox = hero.getBoundingClientRect();
      var markBox = markSvg.getBoundingClientRect();
      var typeBox = typed.getBoundingClientRect();
      var unit = markBox.width / 702;
      var fontPx = parseFloat(window.getComputedStyle(typed).fontSize);

      // For each letter of the wordmark, the same letter in the sentence whose
      // place along its line is nearest to where it has to go — so the letters
      // mostly travel down rather than across one another. There is no u in the
      // sentence; the U is made from a spare o.
      var used = [];
      var picks = "storehouse".split("").map(function (want, i) {
        var g = groups[i];
        var goal = ((g.x + g.r) / 2) / 702;
        var best = null, bestCost = Infinity;
        [want, "o", "n", "a"].some(function (letter) {
          chars.forEach(function (ch, n) {
            if (used.indexOf(n) > -1 || ch.textContent.toLowerCase() !== letter) return;
            var r = ch.getBoundingClientRect();
            var cost = Math.abs((r.left + r.width / 2 - typeBox.left) / typeBox.width - goal);
            if (cost < bestCost) { bestCost = cost; best = n; }
          });
          return best !== null;
        });
        used.push(best);
        return best;
      });

      overlay = document.createElement("div");
      overlay.className = "hero__morph";
      overlay.setAttribute("aria-hidden", "true");
      hero.appendChild(overlay);

      var ease = "cubic-bezier(0.76, 0, 0.24, 1)";
      var travel = 1450, lead = 280, step = 55;

      // Everything that is not one of the ten lets go first.
      chars.forEach(function (ch, n) {
        if (used.indexOf(n) > -1) return;
        ch.animate([
          { opacity: 1, filter: "blur(0px)", transform: "none" },
          { opacity: 0, filter: "blur(5px)", transform: "translateY(-0.35em)" }
        ], { duration: 700, delay: Math.random() * 320, easing: "ease", fill: "forwards" });
      });

      picks.forEach(function (n, i) {
        var ch = chars[n], g = groups[i];
        var from = ch.getBoundingClientRect();
        var w = (g.r - g.x) * unit, h = (g.b - g.y) * unit;
        var left = markBox.left + g.x * unit, top = markBox.top + g.y * unit;

        // Lower-case letters stand about half an em; t and h nearer three quarters.
        var k = h / (fontPx * (/[th]/.test(ch.textContent) ? 0.72 : 0.48));
        var dx = (left + w / 2) - (from.left + from.width / 2);
        var dy = (top + h / 2) - (from.top + from.height / 2);
        var delay = lead + i * step;

        var piece = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        piece.setAttribute("class", "hero__piece");
        piece.setAttribute("viewBox", [g.x, g.y, g.r - g.x, g.b - g.y].join(" "));
        piece.style.left = (left - heroBox.left) + "px";
        piece.style.top = (top - heroBox.top) + "px";
        piece.style.width = w + "px";
        piece.style.height = h + "px";
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", g.d);
        path.setAttribute("fill-rule", "evenodd");
        piece.appendChild(path);
        overlay.appendChild(piece);

        var timing = { duration: travel, delay: delay, fill: "both" };

        // The two travel together on the same curve: the sentence's letter
        // growing out towards the wordmark's, the wordmark's shrunk back to the
        // sentence's and growing in. Half way, one hands over to the other under
        // a little blur, so what you see is one letter changing shape in flight.
        ch.animate([
          { transform: "none" },
          { transform: "translate(" + dx + "px," + dy + "px) scale(" + k + ")" }
        ], Object.assign({ easing: ease }, timing));
        ch.animate([
          { opacity: 1, filter: "blur(0px)" },
          { opacity: 1, filter: "blur(0px)", offset: 0.3 },
          { opacity: 0, filter: "blur(1.5px)", offset: 0.62 },
          { opacity: 0, filter: "blur(1.5px)" }
        ], timing);

        piece.animate([
          { transform: "translate(" + (-dx) + "px," + (-dy) + "px) scale(" + (1 / k) + ")" },
          { transform: "none" }
        ], Object.assign({ easing: ease }, timing));
        piece.animate([
          { opacity: 0, filter: "blur(10px)" },
          { opacity: 0, filter: "blur(10px)", offset: 0.32 },
          { opacity: 1, filter: "blur(0px)", offset: 0.7 },
          { opacity: 1, filter: "blur(0px)" }
        ], timing);
      });

      timer = window.setTimeout(function () { finish(true); }, lead + 9 * step + travel + 60);
    };

    var tick = function () {
      var ch = chars[at];
      ch.dataset.on = "";
      if (at) chars[at - 1].removeAttribute("data-caret");
      else ch.removeAttribute("data-caret");
      ch.dataset.caret = "after";
      at += 1;
      if (at >= chars.length) { timer = window.setTimeout(morph, 900); return; }
      // Uneven, like a hand, with a breath at the comma and a gap between words.
      var c = ch.textContent;
      var gap = ch === ch.parentNode.lastChild ? 30 : 0;
      timer = window.setTimeout(tick, 26 + Math.random() * 24 + gap + (c === "," ? 240 : 0));
    };

    chars[0].dataset.caret = "before";
    hero.dataset.intro = "running";
    held.forEach(function (ev) { window.addEventListener(ev, hold, { passive: false }); });
    window.addEventListener("keydown", holdKeys);
    // Whatever happens, the page is never held for longer than this.
    safety = window.setTimeout(function () { finish(false); }, 9000);
    timer = window.setTimeout(tick, 600);
  })();

  /* --------------------------------------------------------- the slideshow */

  /* The standing photograph on a service page cycles through that page's own
     frames. Every frame is already in the markup and the first one shows on its
     own, so with this absent the panel is simply a photograph. */

  var shows = document.querySelectorAll("[data-slideshow]");
  Array.prototype.forEach.call(shows, function (box) {
    var imgs = Array.prototype.slice.call(box.querySelectorAll("img"));
    if (imgs.length < 2) return;

    var at = 0, timer = null;
    imgs[0].dataset.on = "true";

    // Built here rather than written into the page, because without this
    // script there is nothing for them to indicate and nothing to step through.
    //
    // The dots are marks, not controls — the two halves of the photograph are
    // the controls. Two tab stops that mean "back" and "forward" are worth more
    // to anyone on a keyboard than six that each mean "jump to frame four".
    var dots = document.createElement("div");
    dots.className = "slideshow__dots";
    var marks = imgs.map(function () {
      var d = document.createElement("span");
      d.className = "slideshow__dot";
      dots.appendChild(d);
      return d;
    });
    marks[0].dataset.on = "true";
    box.appendChild(dots);

    var zone = function (cls, label, delta) {
      var z = document.createElement("button");
      z.type = "button";
      z.className = "slideshow__zone slideshow__zone--" + cls;
      z.setAttribute("aria-label", label);
      z.addEventListener("click", function () {
        go((at + delta + imgs.length) % imgs.length);
        restart();
      });
      box.appendChild(z);
    };
    zone("prev", "Previous photograph", -1);
    zone("next", "Next photograph", 1);

    var go = function (i) {
      imgs[at].dataset.on = "false"; marks[at].dataset.on = "false";
      at = i;
      imgs[at].dataset.on = "true";  marks[at].dataset.on = "true";
    };
    var step  = function () { go((at + 1) % imgs.length); };
    var start = function () { if (!timer && !reduced) timer = window.setInterval(step, 2000); };
    var stop  = function () { if (timer) { window.clearInterval(timer); timer = null; } };
    var restart = function () { stop(); start(); };

    // Anyone who has asked for less movement gets the dots and no turning: the
    // set is still theirs to look through, it just does not move on its own.
    if (reduced) return;

    // Nothing turns over while it is off screen or the tab is in the
    // background: a timer nobody can see is only work and battery.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0.15 }).observe(box);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (box.getBoundingClientRect().top < window.innerHeight) start();
    });
  });

  /* ----------------------------------------------------------- the pointer */

  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduced) {
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);

    var dx = 0, dy = 0, drawing = false;
    var draw = function () {
      drawing = false;
      dot.style.transform = "translate3d(" + dx + "px," + dy + "px,0)";
      if (pending) { classify(pending); pending = null; }   // off the hot path
    };

    // Position is the only thing touched per frame. Hit-testing writes to the
    // DOM only when the answer actually changes, which is what was making the
    // dot feel a step behind the mouse.
    var lastOver = null, lastGround = null, pending = null, lastTarget = null;

    var classify = function (el) {
      // The two closest() walks are the only real work here, so they are
      // skipped entirely while the pointer stays over the same element.
      if (!el || !el.closest || el === lastTarget) return;
      lastTarget = el;
      var over = el.closest("a, button, summary, [role='button'], input, label") ? "link" : "";
      if (over !== lastOver) { dot.dataset.over = over; lastOver = over; }
      var ground = el.closest("[data-paper], .panel, .footer, .menu, .map-dialog") ? "paper" : "";
      if (ground !== lastGround) { dot.dataset.ground = ground; lastGround = ground; }
    };

    document.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = "translate3d(" + dx + "px," + dy + "px,0)";
      pending = e.target;
      if (!drawing) { drawing = true; window.requestAnimationFrame(draw); }
    }, { passive: true });

    // Hide the native cursor only now that the dot is definitely present.
    document.documentElement.dataset.cursor = "on";
    cursorRunning = true;

    document.addEventListener("mouseleave", function () { dot.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { dot.style.opacity = ""; });
  }

  /* ---------------------------------------------- painting the first screen */

  var heroField = document.querySelector("[data-hero-field]");
  if (heroField && !reduced) {
    var canvas = document.createElement("canvas");
    canvas.className = "paint";
    canvas.setAttribute("aria-hidden", "true");
    heroField.appendChild(canvas);

    var ctx = null, dpr = 1;
    var sizeCanvas = function () {
      var r = heroField.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = ctx.fillStyle =
        getComputedStyle(document.documentElement).getPropertyValue("--canvas").trim() || "#fdfdfd";
      ctx.lineWidth = 9;          // the width of the cursor dot
      ctx.lineCap = ctx.lineJoin = "round";
    };
    sizeCanvas();
    // Resizing resets the surface, so redraw nothing rather than smear it.
    window.addEventListener("resize", sizeCanvas, { passive: true });

    var down = false, lastX = 0, lastY = 0;
    var at = function (e) {
      var r = heroField.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    heroField.addEventListener("pointerdown", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      if (e.target.closest("a, button, summary, input, label")) return;
      // Stop the drag from also dragging out a text selection behind the mark.
      e.preventDefault();
      down = true;
      var p = at(e);
      lastX = p[0]; lastY = p[1];
      ctx.beginPath();
      ctx.arc(lastX, lastY, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    });

    heroField.addEventListener("pointermove", function (e) {
      if (!down) return;
      var p = at(e);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(p[0], p[1]);
      ctx.stroke();
      lastX = p[0]; lastY = p[1];
    }, { passive: true });

    var stop = function () { down = false; };
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  }

  /* ------------------------------------------------------------ the journey */

  var strip = document.querySelector("[data-journey-strip] .journey__stages");
  if (strip) {
    // Two separate questions. A mouse can't swipe a scroller, so wherever there
    // is one — including a desktop window narrowed to a phone's width — the row
    // is made draggable. The slow drift is a wide-screen thing on top of that.
    // On a real touch device neither applies and nothing at all is bound: a
    // non-passive pointer listener on a scroller makes the browser run it
    // before it can decide whether to scroll, which is what made a swipe feel
    // like it was fighting back.
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    var wide = window.matchMedia("(min-width: 56rem)");

    if (finePointer.matches && !reduced) {
      var dragging = false, lastX = 0, velocity = 0, moved = 0, drifting = false;

      strip.addEventListener("pointerdown", function (e) {
        if (e.pointerType && e.pointerType !== "mouse") return;
        // Press on one of the photographs and the browser would rather start
        // its own drag of the image than let us have the pointer: you get a
        // ghost of the picture stuck to the cursor and the row never moves.
        // Preventing the default here is what stops that happening, and it is
        // safe to do because nothing above has run for anything but a mouse.
        e.preventDefault();
        dragging = true; moved = 0; lastX = e.clientX; velocity = 0;
        strip.dataset.dragging = "true";
        strip.setPointerCapture(e.pointerId);
      });

      // Belt and braces: if a native drag begins by some other route, refuse it.
      strip.addEventListener("dragstart", function (e) { e.preventDefault(); });

      strip.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        var dx = e.clientX - lastX;
        lastX = e.clientX;
        moved += Math.abs(dx);
        strip.scrollLeft -= dx;
        velocity = -dx;
      }, { passive: true });

      var release = function () {
        if (!dragging) return;
        dragging = false;
        strip.dataset.dragging = "false";
      };
      strip.addEventListener("pointerup", release);
      strip.addEventListener("pointercancel", release);
      strip.addEventListener("click", function () { if (moved < 5) velocity += 26; });

      document.documentElement.dataset.journey = "draggable";

      // The position is kept here rather than read back from scrollLeft: the
      // browser rounds that to whole pixels, so a sub-pixel drift added to it
      // each frame would be rounded away and never move at all.
      var pos = strip.scrollLeft;
      var last = 0;
      var SPEED = 18;                     // pixels per second

      // Timed off the clock rather than counted in frames: a 120Hz display
      // would otherwise run this at twice the speed of a 60Hz one.
      var step = function (now) {
        var dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
        last = now;
        if (dragging) {
          pos = strip.scrollLeft;         // the hand is in charge
        } else if (drifting || velocity) {
          pos += (drifting ? SPEED * dt : 0) + velocity;
          velocity *= Math.pow(0.02, dt); // momentum, also time-based
          if (Math.abs(velocity) < 0.01) velocity = 0;
          if (drifting) {
            var half = strip.scrollWidth / 2;
            if (half > 0) {
              if (pos >= half) pos -= half;
              else if (pos < 0) pos += half;
            }
          } else {
            pos = Math.max(0, Math.min(pos, strip.scrollWidth - strip.clientWidth));
          }
          strip.scrollLeft = pos;
        } else {
          pos = strip.scrollLeft;         // wheel or trackpad moved it
        }
        window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);

      // The endless drift, and the second set of cards it needs, are for wide
      // screens only.
      if (wide.matches && "IntersectionObserver" in window) {
        var driftIO = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting) return;
          driftIO.disconnect();
          window.setTimeout(function () {
            Array.prototype.slice.call(strip.children).forEach(function (node) {
              var copy = node.cloneNode(true);
              copy.setAttribute("aria-hidden", "true");
              copy.querySelectorAll("img").forEach(function (i) { i.loading = "lazy"; });
              strip.appendChild(copy);
            });
            pos = strip.scrollLeft;
            drifting = true;
            document.documentElement.dataset.journey = "drift";
          }, 1100);
        }, { threshold: 0.2 });
        driftIO.observe(strip.closest(".journey"));
      }
    }
  }

})();
