/* Storehouse Fine Arts — progressive enhancement only.
   Every page works with this file absent: the journey reads as a plain row of
   captioned images, the services open as ordinary <details>, the menu is a
   link list, and the pointer stays the one the operating system provides. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- masthead */

  var masthead = document.querySelector(".masthead");
  if (masthead) {
    var darkZones = document.querySelectorAll("[data-dark]");
    var mark = function () {
      masthead.dataset.scrolled = window.scrollY > 8 ? "true" : "false";

      // Step out of the way where the masthead sits over a dark section.
      var mid = masthead.offsetHeight / 2;
      var over = false;
      for (var i = 0; i < darkZones.length; i++) {
        var r = darkZones[i].getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) { over = true; break; }
      }
      masthead.dataset.over = over ? "dark" : "light";
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
    };

    document.addEventListener("mousemove", function (e) {
      dx = e.clientX; dy = e.clientY;
      if (!drawing) { drawing = true; window.requestAnimationFrame(draw); }

      var el = e.target;
      var interactive = el.closest && el.closest("a, button, summary, [role='button'], input, label");
      dot.dataset.over = interactive ? "link" : "";

      // Invert over the dark and ultramarine grounds.
      var onDark = el.closest && el.closest("[data-dark], .journey, .panel, .footer, .menu");
      dot.dataset.ground = onDark ? "dark" : "";
    }, { passive: true });

    // Hide the native cursor only now that the dot is definitely present.
    document.documentElement.dataset.cursor = "on";

    document.addEventListener("mouseleave", function () { dot.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { dot.style.opacity = ""; });
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
