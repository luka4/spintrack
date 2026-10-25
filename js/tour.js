/* Home-page tour loader. The page ships a snap-scrolling strip of store screenshots (#tour .tour-strip) as the
   safety net; whenever WebGL is available this swaps it for the live blueprint tour (js/tour-stage.js, which
   needs js/vendor/three.min.js): the wide 16:9 sheet on roomy screens, a portrait sheet on phones. With
   "reduce motion" on, the tour is shown paused on a finished frame and only plays when the visitor presses Play.
   Nothing is fetched until the section is about to scroll into view, and any failure puts the strip back
   (the reason is logged to the console). */
(function () {
  var root = document.getElementById("tour");
  if (!root) return;
  var frame = root.querySelector(".tour-frame");
  if (!frame) return;

  var narrow = window.matchMedia("(max-width: 719px)");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var ICONS = {
    pause: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1.5" width="3.4" height="11" fill="currentColor"/><rect x="8.6" y="1.5" width="3.4" height="11" fill="currentColor"/></svg>',
    play: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>',
  };

  var scripts = null; // promise: three.js, then the stage
  var generation = 0; // bumped on every (re)start so a stale load can tell it was replaced
  var controller = null;
  var button = null;
  var observer = null;
  var armed = false;
  var failed = false;
  var visible = false;
  var userPaused = false;

  function note(reason) {
    if (window.console && console.info) console.info("[tour] fallback to screenshots:", reason);
  }

  function hasWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch (e) {
      return false;
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("failed to load " + src)); };
      document.head.appendChild(s);
    });
  }

  function ensureScripts() {
    if (!scripts) {
      scripts = Promise.all([loadScript("/js/vendor/three.min.js"), document.fonts && document.fonts.ready])
        .then(function () { return loadScript("/js/tour-stage.js"); })
        .catch(function (e) { scripts = null; throw e; });
    }
    return scripts;
  }

  function teardown() {
    if (observer) observer.disconnect();
    observer = null;
    if (controller) controller.destroy();
    controller = null;
    if (button) button.remove();
    button = null;
  }

  function fallback(reason) {
    note(reason);
    failed = true;
    teardown();
    frame.hidden = true;
    root.classList.remove("is-pending", "is-live");
  }

  function sync() {
    if (!controller || !button) return;
    var strings = controller.labels;
    if (visible && !userPaused && !document.hidden) controller.play(); else controller.pause();
    button.innerHTML = userPaused ? ICONS.play : ICONS.pause;
    var label = userPaused ? strings.ui_play : strings.ui_pause;
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  function wire(c) {
    frame.setAttribute("role", "img");
    frame.setAttribute("aria-label", c.labels.ui_label);

    button = document.createElement("button");
    button.type = "button";
    button.className = "tour-toggle";
    button.addEventListener("click", function () { userPaused = !userPaused; sync(); });
    frame.appendChild(button);

    // "Reduce motion": show a finished frame and wait for Play.
    userPaused = reduced.matches;
    if (userPaused) c.showPoster();

    visible = false;
    observer = new IntersectionObserver(function (entries) {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    }, { threshold: 0.25 });
    observer.observe(frame);
    sync();
  }

  function start() {
    if (failed) return;
    var mine = ++generation;
    teardown();
    root.classList.add("is-pending");
    root.classList.remove("is-live");
    frame.hidden = false;
    ensureScripts()
      .then(function () {
        if (mine !== generation) return null;
        return window.SpinBookTour(frame, document.documentElement.lang, {
          layout: narrow.matches ? "tall" : "wide",
          onSlow: function () { fallback("slow device"); },
        });
      })
      .then(function (c) {
        if (!c) return;
        if (mine !== generation) { c.destroy(); return; }
        controller = c;
        root.classList.add("is-live");
        root.classList.remove("is-pending");
        wire(c);
      })
      .catch(function (e) {
        if (mine === generation) fallback("error: " + (e && e.message));
      });
  }

  function arm() {
    if (armed) return;
    armed = true;
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        io.disconnect();
        start();
      }
    }, { rootMargin: "400px 0px" });
    io.observe(root);
  }

  if (!window.requestAnimationFrame || !("IntersectionObserver" in window)) {
    note("no requestAnimationFrame/IntersectionObserver");
    return;
  }
  if (!hasWebGL()) {
    note("WebGL is not available");
    return;
  }

  // An empty frame of the right shape holds the place while the scripts load (no strip flash, no jump).
  root.classList.add("is-pending");
  frame.hidden = false;
  arm();

  // Turning the phone, or resizing across the breakpoint, swaps the sheet.
  narrow.addEventListener("change", function () { if (controller || (armed && root.classList.contains("is-pending") && generation)) start(); });
  // Switching "reduce motion" on while the tour plays stops it.
  reduced.addEventListener("change", function () { if (reduced.matches) { userPaused = true; sync(); } });
  document.addEventListener("visibilitychange", sync);
})();
