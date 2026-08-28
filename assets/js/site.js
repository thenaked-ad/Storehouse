/* Storehouse Fine Arts — progressive enhancement only.
   Every page works with this file absent: the journey reads as a plain row of
   captioned images, the services open as ordinary <details>, the menu is a
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

    var mark = function () {
      // Queried each time so the hero can join the dark grounds when inverted.
      var darkZones  = document.querySelectorAll("[data-dark]");
      var midZones   = document.querySelectorAll("[data-ground='mid']");
      var slateZones = document.querySelectorAll("[data-ground='slate']");
      masthead.dataset.scrolled = window.scrollY > 8 ? "true" : "false";

      // Step out of the way where the masthead sits over a dark section.
      var line = masthead.offsetHeight / 2;
      var straddles = function (el) {
        var r = el.getBoundingClientRect();
        return r.top <= line && r.bottom >= line;
      };
      var ground = "light";
      for (var i = 0; i < darkZones.length; i++) if (straddles(darkZones[i])) { ground = "dark"; break; }
      if (ground === "light") {
        for (var j = 0; j < midZones.length; j++) if (straddles(midZones[j])) { ground = "mid"; break; }
      }
      if (ground === "light") {
        for (var k = 0; k < slateZones.length; k++) if (straddles(slateZones[k])) { ground = "slate"; break; }
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

  /* ------------------------------------------- the services preview image */

  var preview = document.querySelector("[data-services-preview]");
  if (preview) {
    var previewImgs = {};
    Array.prototype.forEach.call(preview.querySelectorAll("img"), function (img) {
      previewImgs[img.dataset.service] = img;
    });

    var activePreview = null;
    var showPreview = function (key) {
      var img = previewImgs[key];
      if (!img || img === activePreview) return;
      if (activePreview) activePreview.dataset.active = "false";
      img.dataset.active = "true";
      activePreview = img;
    };

    var rows = document.querySelectorAll(".services .service > summary");
    Array.prototype.forEach.call(rows, function (row) {
      var key = row.closest(".service").dataset.service;
      row.addEventListener("mouseenter", function () { showPreview(key); });
      row.addEventListener("focus", function () { showPreview(key); });
    });

    // Start on the first, so the column is never empty.
    if (rows.length) showPreview(rows[0].closest(".service").dataset.service);
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
      if (pending) { classify(pending); pending = null; }
    };

    // Position is the only thing touched per frame. Hit-testing writes to the
    // DOM only when the answer actually changes, which is what was making the
    // dot feel a step behind the mouse.
    var lastOver = null, lastGround = null, pending = null;

    var classify = function (el) {
      if (!el || !el.closest) return;
      var over = el.closest("a, button, summary, [role='button'], input, label") ? "link" : "";
      if (over !== lastOver) { dot.dataset.over = over; lastOver = over; }
      var ground = el.closest("[data-dark], .panel, .footer, .menu") ? "dark" : "";
      if (ground !== lastGround) { dot.dataset.ground = ground; lastGround = ground; }
    };

    document.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      dx = e.clientX; dy = e.clientY;
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
        getComputedStyle(document.documentElement).getPropertyValue("--ultramarine").trim() || "#0f1b70";
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

  var strip = document.querySelector("[data-journey-strip]");
  if (strip && "IntersectionObserver" in window && !reduced) {
    var stripIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      stripIO.disconnect();
      strip.dataset.shown = "true";
    }, { threshold: 0.2 });
    stripIO.observe(strip);
  } else if (strip) {
    strip.dataset.shown = "true";
  }

  /* ---------------------------------------------------------------- the map */

  var mapDialog = document.querySelector("[data-map-dialog]");
  var mapOpen = document.querySelector("[data-map-open]");
  if (mapDialog && mapOpen && typeof mapDialog.showModal === "function") {
    var mapFrame = mapDialog.querySelector("[data-map-frame]");
    mapOpen.addEventListener("click", function () {
      if (!mapFrame.firstChild) {
        var f = document.createElement("iframe");
        f.src = "https://www.google.com/maps?q=141+Acton+Lane,+London+NW10+7PB&output=embed";
        f.loading = "lazy";
        f.referrerPolicy = "no-referrer-when-downgrade";
        f.title = "Map showing 141 Acton Lane, London NW10 7PB";
        mapFrame.appendChild(f);
      }
      mapDialog.showModal();
      document.documentElement.removeAttribute("data-cursor");
    });
    mapDialog.addEventListener("close", function () {
      if (cursorRunning) document.documentElement.dataset.cursor = "on";
    });
    mapDialog.querySelector("[data-map-close]").addEventListener("click", function () {
      mapDialog.close();
    });
    // Clicking the backdrop closes it.
    mapDialog.addEventListener("click", function (e) {
      if (e.target === mapDialog) mapDialog.close();
    });
  } else if (mapOpen) {
    // No dialog support: fall back to opening the map in a new tab.
    mapOpen.addEventListener("click", function () {
      window.open("https://www.google.com/maps/search/?api=1&query=141+Acton+Lane+London+NW10+7PB",
                  "_blank", "noopener");
    });
  }

  /* ------------------------------------------- one service open at a time */

  var services = document.querySelectorAll(".services .service");
  if (services.length) {
    services.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        services.forEach(function (other) { if (other !== d) other.open = false; });
      });
    });
  }
})();
