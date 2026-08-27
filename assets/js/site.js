/* Storehouse Fine Arts — progressive enhancement only.
   Every page works with this file absent: the passage reads as a written log,
   the services open as plain <details>, and the menu is a link list. */

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

  /* ----------------------------------------------------------- the passage */

  var passage = document.querySelector("[data-passage-scroll]");
  if (passage && !reduced) {
    var plate    = passage.querySelector(".passage__plate");
    var stepEl   = passage.querySelector(".passage__step");
    var textEl   = passage.querySelector(".passage__text");
    var ticksEl  = passage.querySelector(".passage__ticks");
    var logItems = Array.prototype.slice.call(passage.querySelectorAll(".passage__log li"));
    var total    = logItems.length;

    if (plate && total > 1) {
      var captions = logItems.map(function (li) {
        return (li.querySelector("p") || {}).textContent || "";
      });

      // Frame 0 is already in the markup; the rest are added only once the
      // reader is approaching this section, so nobody downloads a megabyte of
      // sequence to read the paragraph at the top of the page.
      var frames = [plate.querySelector("img")];
      var base   = frames[0].getAttribute("src").replace(/passage-\d+\.webp$/, "");

      // Progress ticks, one per frame.
      if (ticksEl) {
        for (var t = 0; t < total; t++) ticksEl.appendChild(document.createElement("span"));
      }
      var ticks = ticksEl ? Array.prototype.slice.call(ticksEl.children) : [];

      document.documentElement.dataset.passage = "on";
      frames[0].dataset.active = "true";

      var current = -1;
      var show = function (index) {
        if (index === current) return;
        // Never fade to a frame that has not been created or has not arrived.
        var next = frames[index];
        if (!next || !next.complete || next.naturalWidth === 0) return;
        if (current > -1) frames[current].dataset.active = "false";
        frames[index].dataset.active = "true";
        current = index;

        if (stepEl) stepEl.textContent =
          String(index + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
        if (textEl) textEl.textContent = captions[index];
        ticks.forEach(function (tick, n) { tick.dataset.on = n <= index ? "true" : "false"; });
      };

      var ticking = false;
      var update = function () {
        ticking = false;
        var rect  = passage.getBoundingClientRect();
        var span  = rect.height - window.innerHeight;
        if (span <= 0) return;
        var p     = Math.min(Math.max(-rect.top / span, 0), 1);
        show(Math.min(total - 1, Math.floor(p * total)));
      };
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      };

      // Fetch the remaining frames, each one re-running the scrub as it lands so
      // a slow connection catches up rather than sticking on an early frame.
      var loadFrames = function () {
        for (var i = 1; i < total; i++) {
          var img = document.createElement("img");
          img.src = base + "passage-" + String(i).padStart(2, "0") + ".webp";
          img.alt = "";
          img.setAttribute("aria-hidden", "true");
          img.decoding = "async";
          if ("fetchPriority" in img) img.fetchPriority = i < 4 ? "high" : "low";
          img.addEventListener("load", update, { once: true });
          plate.appendChild(img);
          frames.push(img);
        }
      };

      if ("IntersectionObserver" in window) {
        // The section begins just below the fold, so waiting for it to actually
        // reach the viewport is what keeps the sequence off the initial load.
        // The first frames are high priority and land while the reader scrolls.
        var loader = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting) return;
          loader.disconnect();
          loadFrames();
        }, { rootMargin: "0px" });
        loader.observe(passage);
      } else {
        loadFrames();
      }

      show(0);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      frames[0].addEventListener("load", update, { once: true });
      update();
    }
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
