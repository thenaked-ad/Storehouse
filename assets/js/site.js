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

    section.addEventListener("click", function (e) {
      var summary = e.target.closest("details.service > summary");
      if (!summary) return;
      // Held before the browser opens and shuts anything, so the page never
      // gets the chance to be shorter for even a frame.
      var before = section.offsetHeight;
      var from = summary.getBoundingClientRect().top;
      section.style.minHeight = before + "px";
      window.requestAnimationFrame(function () {
        natural = measure();
        if (natural >= before) release();
        else {
          held = before;
          window.removeEventListener("scroll", follow);
          window.addEventListener("scroll", follow, { passive: true });
        }
        // The heading just clicked stays put: its segment opens underneath
        // it, and the one above shutting moves nothing on screen.
        var top = summary.getBoundingClientRect().top;
        if (Math.abs(top - from) > 1) window.scrollBy({ top: top - from, behavior: "instant" });
      });
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

})();
