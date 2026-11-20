/* Storehouse Fine Arts — progressive enhancement only.
   Every page works with this file absent: each carousel is simply its first
   photograph, the segments open and close as ordinary <details>, the menu is a
   link list, and the pointer stays the one the operating system provides. */

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

    var hero = document.querySelector(".hero");
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

      // On the home page the small wordmark stays out of the bar until the large
      // one has scrolled away under it.
      if (hero) masthead.dataset.hero = hero.getBoundingClientRect().bottom > masthead.offsetHeight ? "on" : "off";
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

  /* ---------------------------------------------------- opening an entry by link */

  /* A link to /storage#ambient-storage should land with that section open, not
     closed under its heading. Browsers do not open a <details> that is itself
     the target, so this does. */

  var openFromHash = function () {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var d = document.getElementById(decodeURIComponent(id));
    if (!d || d.tagName !== "DETAILS") return;
    // One open at a time (the script takes that over from the shared name).
    Array.prototype.forEach.call(document.querySelectorAll("details.service[open]"), function (o) {
      if (o !== d) o.open = false;
    });
    d.open = true;
    window.requestAnimationFrame(function () {
      d.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
    });
  };
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  /* ---------------------------------------- one segment open, and steadily */

  /* Only one segment stands open at a time (the shared name on each <details>
     does that, in the browser). Opening one therefore shuts another, and when
     the one shutting is above, the page gets shorter under the reader. Near the
     foot of the page the browser then has to pull the whole view down, and
     everything on screen jumps. So for a moment the section keeps the height it
     had: the spare room sits at its foot, and it is given up as the reader
     scrolls back up, only ever below the bottom of the screen where nobody can
     see it go. */

  Array.prototype.forEach.call(document.querySelectorAll(".services-page"), function (section) {
    var held = 0, natural = 0;

    // The height the section would have on its own, measured without letting
    // it shrink: the foot of its lowest child, or a screen, whichever is more.
    var measure = function () {
      var top = section.getBoundingClientRect().top;
      var foot = 0;
      Array.prototype.forEach.call(section.children, function (child) {
        foot = Math.max(foot, child.getBoundingClientRect().bottom);
      });
      var pad = parseFloat(window.getComputedStyle(section).paddingBottom) || 0;
      var screen = window.innerHeight - (masthead ? masthead.offsetHeight : 0);
      return Math.max(foot - top + pad, screen);
    };
    var release = function () {
      held = 0;
      section.style.minHeight = "";
      window.removeEventListener("scroll", follow);
    };
    var follow = function () {
      var need = Math.min(held, window.innerHeight - section.getBoundingClientRect().top);
      if (need <= natural) release();
      else section.style.minHeight = need + "px";
    };

    // Opening and closing are animated (Tom, 20 Nov): the one opening grows
    // under its heading while the one shutting folds away, together. The
    // shared name would shut the other instantly, so the script takes over
    // keeping one open and the name comes off; with no script it stays, and
    // the browser does the same job without the movement.
    var segments = Array.prototype.slice.call(section.querySelectorAll("details.service"));
    segments.forEach(function (d) { d.removeAttribute("name"); });
    var DURATION = reduced ? 0 : 480;
    var EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
    var running = new Map(), clicks = 0;

    var fold = function (d, opening) {
      var panel = d.querySelector(".service__panel");
      var body = d.querySelector(".service__body");
      var was = running.get(d);
      var from = d.open ? panel.getBoundingClientRect().height : 0;
      if (was) { was.forEach(function (a) { a.cancel(); }); running.delete(d); }
      if (opening) d.open = true;
      if (!DURATION) { if (!opening) d.open = false; return; }
      var to = opening ? panel.getBoundingClientRect().height : 0;
      var grow = panel.animate([{ height: from + "px" }, { height: to + "px" }],
        { duration: DURATION, easing: EASE, fill: "forwards" });
      var fade = body.animate(opening ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }],
        { duration: opening ? DURATION : DURATION * 0.6, easing: "ease-out", fill: "forwards" });
      running.set(d, [grow, fade]);
      grow.onfinish = function () {
        if (running.get(d) && running.get(d)[0] !== grow) return;
        if (!opening) d.open = false;
        grow.cancel(); fade.cancel();
        running.delete(d);
      };
    };

    section.addEventListener("click", function (e) {
      var summary = e.target.closest("details.service > summary");
      if (!summary) return;
      e.preventDefault();
      var d = summary.parentNode;
      // Closed, or clicked again while still folding away: open it.
      var opening = !d.open || d.dataset.folding === "out";
      // Held before anything moves, so the page never gets the chance to be
      // shorter under the reader for even a frame.
      var before = section.offsetHeight;
      var from = summary.getBoundingClientRect().top;
      section.style.minHeight = before + "px";

      if (opening) {
        segments.forEach(function (o) { if (o !== d && o.open && o.dataset.folding !== "out") { o.dataset.folding = "out"; fold(o, false); } });
        d.dataset.folding = "in";
        fold(d, true);
      } else {
        d.dataset.folding = "out";
        fold(d, false);
      }

      // The heading just clicked stays put on screen the whole way through:
      // whatever folds away above it, the page scrolls by the same amount.
      // A newer click takes over the job from this one.
      var mine = ++clicks;
      var until = performance.now() + DURATION + 60;
      var steady = function () {
        if (mine !== clicks) return;
        var top = summary.getBoundingClientRect().top;
        if (Math.abs(top - from) > 0.5) window.scrollBy({ top: top - from, behavior: "instant" });
        if (performance.now() < until) window.requestAnimationFrame(steady);
        else settle();
      };
      var settle = function () {
        segments.forEach(function (o) { if (!running.has(o)) delete o.dataset.folding; });
        natural = measure();
        if (natural >= before) release();
        else {
          held = before;
          window.removeEventListener("scroll", follow);
          window.addEventListener("scroll", follow, { passive: true });
        }
      };
      window.requestAnimationFrame(steady);
    });
    window.addEventListener("resize", function () { if (held) release(); }, { passive: true });
  });

  /* ---------------------------------------------------------- the carousels */

  /* A set of photographs in one plate, stepped through with the arrows under
     it (or a swipe). Every frame is already in the markup and the first one
     shows on its own, so with this absent the set is simply a photograph. It
     turns over by itself, slowly, while it is on screen — and stops for good
     the first time someone takes it in hand, so it never moves on from a
     picture they chose. Each frame's caption is its data-caption; a frame
     without one leaves the line under it blank. */

  Array.prototype.forEach.call(document.querySelectorAll("[data-carousel]"), function (box) {
    var plate = box.querySelector(".carousel__plate");
    var imgs = Array.prototype.slice.call(plate.querySelectorAll("img"));
    var caption = box.querySelector(".carousel__caption");
    var count = box.querySelector(".carousel__count");
    var controls = box.querySelector(".carousel__controls");
    var at = 0, timer = null, handled = false;

    var show = function (i) {
      imgs[at].dataset.on = "false";
      at = (i + imgs.length) % imgs.length;
      imgs[at].dataset.on = "true";
      if (caption) caption.textContent = imgs[at].dataset.caption || "";
      if (count) count.textContent = (at + 1) + " / " + imgs.length;
    };
    imgs[0].dataset.on = "true";
    if (caption) caption.textContent = imgs[0].dataset.caption || "";
    if (imgs.length < 2) { if (controls) controls.hidden = true; return; }

    var stop  = function () { if (timer) { window.clearInterval(timer); timer = null; } };
    var start = function () {
      if (!timer && !reduced && !handled) timer = window.setInterval(function () { show(at + 1); }, 5000);
    };
    var byHand = function (step) { handled = true; stop(); show(at + step); };

    box.querySelector(".carousel__step--prev").addEventListener("click", function () { byHand(-1); });
    box.querySelector(".carousel__step--next").addEventListener("click", function () { byHand(1); });

    // A sideways swipe on a touch screen. The plate leaves vertical movement to
    // the page (touch-action: pan-y), so scrolling past it still works.
    var x0 = null, y0 = 0;
    plate.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") return;
      x0 = e.clientX; y0 = e.clientY;
    });
    plate.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) byHand(dx < 0 ? 1 : -1);
    });
    plate.addEventListener("pointercancel", function () { x0 = null; });

    // Anyone who has asked for less movement gets the arrows and no turning.
    if (reduced) return;

    // Nothing turns over while it is off screen, shut inside a closed segment,
    // or in a background tab: a timer nobody can see is only work and battery.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0.35 }).observe(plate);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (plate.getBoundingClientRect().top < window.innerHeight) start();
    });
  });

  /* ------------------------------------------------------------ the strips */

  /* The page's photographs in a sideways strip that loops (Fred, 20 Nov). The
     set is copied end to end, so there is always more to the right and to
     the left, and the strip drifts slowly left on its own while it is on
     screen. Anyone can take it in hand — trackpad, touch, a drag with the
     mouse, the arrows — and it waits a moment after they let go before it
     drifts on. Hovering over it holds it still, to read a caption.

     The position is kept as a number of pixels with a fraction; the scroll
     takes the whole pixels (browsers round scroll positions) and the row is
     moved by the fraction, so even a slow drift is smooth. The scroll is
     kept within the second copy of the set, quietly stepping back or on by
     one set's width when it strays — the copies are identical, so nothing
     visibly moves. With the script absent it is one set that scrolls. */

  var SPEED = 26;       // pixels a second
  var REST = 2500;      // ms after someone lets go before it drifts on

  Array.prototype.forEach.call(document.querySelectorAll("[data-strip]"), function (strip) {
    var track = strip.querySelector(".strip__track");
    var rail = strip.querySelector(".strip__rail");
    var controls = strip.querySelector(".strip__controls");
    var prev = strip.querySelector(".carousel__step--prev");
    var next = strip.querySelector(".carousel__step--next");
    var originals = Array.prototype.slice.call(rail.children);
    var behaviour = reduced ? "auto" : "smooth";
    if (originals.length < 2) { controls.hidden = true; return; }

    var sets = 1;
    var addSet = function () {
      originals.forEach(function (fig) {
        var copy = fig.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        copy.inert = true;
        var img = copy.querySelector("img");
        if (img) { img.alt = ""; img.loading = "lazy"; }
        rail.appendChild(copy);
      });
      sets++;
    };
    // One set's width: from the first photograph to its first copy.
    var W = 0;
    var measure = function () {
      W = rail.children[originals.length].getBoundingClientRect().left - originals[0].getBoundingClientRect().left;
      var need = Math.max(5, 3 + Math.ceil(track.clientWidth / Math.max(W, 1)));
      while (sets < need) addSet();
    };
    addSet();
    measure();
    if (W < 2) { controls.hidden = true; return; }
    strip.classList.add("is-looping");

    var pos = W, ours = -1;
    var paint = function () {
      var whole = Math.floor(pos);
      ours = whole;
      if (track.scrollLeft !== whole) track.scrollLeft = whole;
      var frac = pos - whole;
      rail.style.transform = frac > 0.01 ? "translate3d(" + (-frac).toFixed(2) + "px,0,0)" : "";
    };
    var normalise = function () {
      while (pos < W) pos += W;
      while (pos >= 2 * W) pos -= W;
    };
    paint();

    var holdUntil = 0, hovering = false, down = false, idle = null;
    var hold = function () { holdUntil = performance.now() + REST; };

    // Someone else moved it: the arrows' smooth scroll, a trackpad, a finger,
    // a drag. Follow them, and once they stop, step back into the middle set.
    track.addEventListener("scroll", function () {
      if (track.scrollLeft === ours) return;
      pos = track.scrollLeft; ours = pos;
      rail.style.transform = "";
      hold();
      clearTimeout(idle);
      idle = setTimeout(function settle() {
        if (down) { idle = setTimeout(settle, 200); return; }
        normalise(); paint();
      }, 180);
    }, { passive: true });

    // The arrows: a page at a time, resting a photograph on the left edge.
    var go = function (dir) {
      normalise(); paint(); hold();
      var at = track.scrollLeft, view = track.clientWidth;
      var origin = track.getBoundingClientRect().left;
      var stops = Array.prototype.map.call(rail.children, function (it) {
        var r = it.getBoundingClientRect();
        return { at: r.left - origin + at, end: r.right - origin + at };
      });
      var to;
      if (dir > 0) {
        var cut = stops.filter(function (s) { return s.end > at + view + 2 && s.at > at + 2; })[0];
        to = cut ? cut.at : at + view;
      } else {
        var back = stops.filter(function (s) { return s.at >= at - view - 2 && s.at < at - 2; })[0];
        to = back ? back.at : at - view;
      }
      track.scrollTo({ left: Math.round(to), behavior: behaviour });
    };
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });

    // A drag with the mouse. Touch and trackpads scroll natively already.
    var from = null, moved = false;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      from = { x: e.clientX, left: pos };
      down = true; moved = false;
    });
    window.addEventListener("pointermove", function (e) {
      if (!from) return;
      var dx = e.clientX - from.x;
      if (!moved && Math.abs(dx) < 4) return;
      if (!moved) { moved = true; track.classList.add("is-dragging"); }
      track.scrollLeft = Math.round(from.left - dx);
      e.preventDefault();
    });
    var end = function () {
      if (!from) return;
      from = null; down = false; hold();
      track.classList.remove("is-dragging");
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    // A drag that ends over a photograph is not a click on it.
    track.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    // A finger on it holds it, for as long as it is there.
    track.addEventListener("touchstart", function () { down = true; hold(); }, { passive: true });
    track.addEventListener("touchend", function () { down = false; hold(); }, { passive: true });
    track.addEventListener("touchcancel", function () { down = false; hold(); }, { passive: true });
    // Hovering holds it still, so a caption can be read.
    track.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hovering = true; });
    track.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { hovering = false; hold(); } });

    window.addEventListener("resize", function () { measure(); normalise(); paint(); }, { passive: true });

    // The drift. Not for anyone who has asked for less movement, and only
    // while the strip is on screen and the tab is in front.
    if (reduced) return;
    var running = false, last = 0, onScreen = false;
    var frame = function (t) {
      if (!running) return;
      var dt = last ? Math.min(t - last, 64) : 0;
      last = t;
      if (!hovering && !down && t >= holdUntil && W > 1) {
        pos += SPEED * dt / 1000;
        if (pos >= 2 * W) pos -= W;
        paint();
      }
      requestAnimationFrame(frame);
    };
    var start = function () { if (!running && onScreen && !document.hidden) { running = true; last = 0; requestAnimationFrame(frame); } };
    var stop = function () { running = false; };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        onScreen ? start() : stop();
      }, { threshold: 0.1 }).observe(track);
    } else { onScreen = true; start(); }
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
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
      var over = el.closest("a, button, summary, input, label") ? "link"
        : el.closest(".strip__track") ? "drag"
        : el.closest("[role='button']") ? "link" : "";
      if (over !== lastOver) { dot.dataset.over = over; lastOver = over; }
      var ground = el.closest("[data-paper], .panel, .footer, .menu, .map-dialog, .service__body") ? "paper" : "";
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

})();
