/* Home-page tour loader. The page ships a snap-scrolling strip of store screenshots (#tour .tour-strip);
   on a roomy screen with motion allowed and WebGL available this swaps it for the live blueprint tour
   (js/tour-stage.js, which needs js/vendor/three.min.js). Nothing is fetched until the section is about
   to scroll into view, and any failure leaves the strip in place. */
(function () {
  var root = document.getElementById("tour");
  if (!root) return;
  var frame = root.querySelector(".tour-frame");
  if (!frame) return;

  var narrow = window.matchMedia("(max-width: 719px)");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var started = false;
  var controller = null;
  var ICONS = {
    pause: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1.5" width="3.4" height="11" fill="currentColor"/><rect x="8.6" y="1.5" width="3.4" height="11" fill="currentColor"/></svg>',
    play: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>',
  };

  function canRun() {
    if (narrow.matches || reduced.matches) return false;
    try {
      var c = document.createElement("canvas");
      return !!(window.requestAnimationFrame && (c.getContext("webgl2") || c.getContext("webgl")));
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

  function giveUp() {
    if (controller) controller.destroy();
    controller = null;
    frame.hidden = true;
    root.classList.remove("is-live");
  }

  function start() {
    if (started || !canRun()) return;
    started = true;
    Promise.all([
      loadScript("/js/vendor/three.min.js"),
      document.fonts && document.fonts.ready,
    ])
      .then(function () { return loadScript("/js/tour-stage.js"); })
      .then(function () {
        frame.hidden = false;
        return window.SpinBookTour(frame, document.documentElement.lang, { onSlow: giveUp });
      })
      .then(function (c) {
        controller = c;
        root.classList.add("is-live");
        wire(c);
      })
      .catch(function () {
        started = false;
        giveUp();
      });
  }

  function wire(c) {
    var strings = c.labels;
    frame.setAttribute("role", "img");
    frame.setAttribute("aria-label", strings.ui_label);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tour-toggle";
    frame.appendChild(btn);

    var visible = false;
    var userPaused = false;
    function sync() {
      var shouldPlay = visible && !userPaused && !document.hidden && !narrow.matches && !reduced.matches;
      if (shouldPlay) c.play(); else c.pause();
      btn.innerHTML = userPaused ? ICONS.play : ICONS.pause;
      var label = userPaused ? strings.ui_play : strings.ui_pause;
      btn.setAttribute("aria-label", label);
      btn.title = label;
    }
    btn.addEventListener("click", function () { userPaused = !userPaused; sync(); });
    new IntersectionObserver(function (entries) {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    }, { threshold: 0.25 }).observe(frame);
    document.addEventListener("visibilitychange", sync);
    narrow.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    sync();
  }

  if (!canRun()) {
    // A phone turned sideways, or motion switched on later, may make the tour possible afterwards.
    narrow.addEventListener("change", function () { arm(); });
    reduced.addEventListener("change", function () { arm(); });
  }

  function arm() {
    if (started || !canRun() || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        io.disconnect();
        start();
      }
    }, { rootMargin: "400px 0px" });
    io.observe(root);
  }

  arm();
})();
