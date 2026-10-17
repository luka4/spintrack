/* The full app icon (blue rounded background, paddle, spinning arc ring)
   drawn as particles. Geometry comes from src/components/TableTennisLoader.js
   (1024 art board). The ring rotates slowly; the pointer scatters every dot. */
(function () {
  var mount = document.querySelector('[data-fx="icon"]');
  if (!mount || !window.HTMLCanvasElement) return;

  // Canvas fills its container up to MAX px (full width on phones), then everything scales with it.
  var MAX = 460, MIN = 260;
  var S = Math.max(MIN, Math.min(MAX, Math.round(mount.clientWidth || 300))), K = S / 1024;
  var R = S / 300;                           // dot sizes, spacing and pointer reach were tuned at 300px
  var CX = 512 * K, CY = 505 * K;            // ring centre
  var PADDLE_BOX = { x: 311, y: 251, w: 404, h: 636 };
  var BG_STEP = 6 * R, BG_R = 2.2 * R;
  var PAD_STEP = 3.4 * R, PAD_R = 1.4 * R;
  var RING_STEP = 2.9 * R, RING_R = 1.3 * R;
  var SPIN_SECONDS = 16;                     // one slow clockwise turn
  var REACH = 42 * R, FORCE = 8 * R, SPRING = 0.12, DAMP = 0.8;
  var NAVY = [23, 41, 84], CYAN = [30, 207, 219];
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var img = new Image();
  img.onload = function () {
    // ---- masks, drawn once on an offscreen canvas -------------------------------------------
    function mask() { var c = document.createElement("canvas"); c.width = S; c.height = S; return c; }
    function pix(c) { return c.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, S, S).data; }
    function rad(deg) { return (deg - 90) * Math.PI / 180; }   // 0 = 12 o'clock, clockwise

    var padC = mask(), pctx = padC.getContext("2d");
    pctx.drawImage(img, PADDLE_BOX.x * K, PADDLE_BOX.y * K, PADDLE_BOX.w * K, PADDLE_BOX.h * K);
    var padPx = pix(padC);

    var ringC = mask(), rctx = ringC.getContext("2d");
    rctx.strokeStyle = rctx.fillStyle = "#fff";
    rctx.lineWidth = 24 * K; rctx.lineCap = "round";
    function arc(a0, a1, r, dash) {
      rctx.setLineDash(dash ? [dash[0] * K, dash[1] * K] : []);
      rctx.beginPath(); rctx.arc(CX, CY, r * K, rad(a0), rad(a1)); rctx.stroke();
    }
    arc(-2, 167, 396); arc(193, 355, 396, [38, 65]); arc(191, 355, 344); arc(9, 168, 344);
    function pol(a, r) { return [CX + r * K * Math.sin(a * Math.PI / 180), CY - r * K * Math.cos(a * Math.PI / 180)]; }
    rctx.beginPath();
    [pol(3, 341), pol(-5, 364), pol(-5, 319)].forEach(function (p, i) { i ? rctx.lineTo(p[0], p[1]) : rctx.moveTo(p[0], p[1]); });
    rctx.fill();
    var ringPx = pix(ringC);

    var bgC = mask(), bctx = bgC.getContext("2d");
    bctx.fillStyle = "#fff"; bctx.beginPath();
    bctx.roundRect ? bctx.roundRect(16 * K, 16 * K, 992 * K, 992 * K, 230 * K) : bctx.rect(16 * K, 16 * K, 992 * K, 992 * K);
    bctx.fill();
    var bgPx = pix(bgC);

    function at(px, x, y) { var xi = Math.round(x), yi = Math.round(y); return xi < 0 || yi < 0 || xi >= S || yi >= S ? 0 : px[(yi * S + xi) * 4 + 3]; }

    // ---- dots, grouped by quantised colour so each frame is a handful of fills --------------
    var groups = {}, ring = [];
    function add(x, y, rgb, r, isRing) {
      var q = (rgb[0] >> 4) + "," + (rgb[1] >> 4) + "," + (rgb[2] >> 4) + "," + r;
      var g = groups[q] || (groups[q] = { fill: "rgb(" + (rgb[0] >> 4 << 4) + "," + (rgb[1] >> 4 << 4) + "," + (rgb[2] >> 4 << 4) + ")", r: r, dots: [] });
      var d = { hx: x, hy: y, x: x, y: y, vx: 0, vy: 0, a: 0, rad: 0 };
      if (isRing) { var dx = x - CX, dy = y - CY; d.a = Math.atan2(dy, dx); d.rad = Math.sqrt(dx * dx + dy * dy); ring.push(d); }
      g.dots.push(d);
    }
    var x, y, row;
    for (row = 0, y = BG_STEP / 2; y < S; y += BG_STEP, row++) {
      for (x = BG_STEP / 2 + (row % 2 ? BG_STEP / 2 : 0); x < S; x += BG_STEP) {
        if (at(bgPx, x, y) < 200) continue;
        if (at(padPx, x, y) > 20) continue;          // paddle covers the background
        add(x, y, NAVY, BG_R, false);
      }
    }
    for (row = 0, y = PAD_STEP / 2; y < S; y += PAD_STEP, row++) {
      for (x = PAD_STEP / 2 + (row % 2 ? PAD_STEP / 2 : 0); x < S; x += PAD_STEP) {
        var i = (Math.round(y) * S + Math.round(x)) * 4;
        if (padPx[i + 3] < 140) continue;
        add(x, y, [padPx[i], padPx[i + 1], padPx[i + 2]], PAD_R, false);
      }
    }
    for (row = 0, y = RING_STEP / 2; y < S; y += RING_STEP, row++) {
      for (x = RING_STEP / 2 + (row % 2 ? RING_STEP / 2 : 0); x < S; x += RING_STEP) {
        if (at(ringPx, x, y) < 140) continue;
        add(x, y, CYAN, RING_R, true);
      }
    }
    var list = Object.keys(groups).map(function (k) { return groups[k]; });
    var all = []; list.forEach(function (g) { all = all.concat(g.dots); });

    // ---- canvas ----------------------------------------------------------------------------
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var canvas = document.createElement("canvas");
    canvas.className = "hero-paddle hero-paddle-icon";
    canvas.width = S * dpr; canvas.height = S * dpr;
    canvas.style.width = S + "px"; canvas.style.height = S + "px"; canvas.style.maxWidth = "100%";
    canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", "SpinBook");
    var ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr);
    mount.appendChild(canvas);

    function draw() {
      ctx.clearRect(0, 0, S, S);
      for (var gi = 0; gi < list.length; gi++) {
        var g = list[gi]; ctx.fillStyle = g.fill; ctx.beginPath();
        for (var k = 0; k < g.dots.length; k++) { var d = g.dots[k]; ctx.moveTo(d.x + g.r, d.y); ctx.arc(d.x, d.y, g.r, 0, 6.2832); }
        ctx.fill();
      }
    }
    function push(cx, cy, reach, force) {
      for (var k = 0; k < all.length; k++) {
        var d = all[k], dx = d.x - cx, dy = d.y - cy, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < reach && dist > 0.01) { var f = (1 - dist / reach) * force; d.vx += dx / dist * f; d.vy += dy / dist * f; }
      }
    }

    var ptr = null, running = false, visible = true, last = 0, spin = 0;
    function step(t) {
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0; last = t;
      var moving = false;
      if (!reduced) {
        spin += dt * 2 * Math.PI / SPIN_SECONDS;
        for (var j = 0; j < ring.length; j++) { var rd = ring[j], a = rd.a + spin; rd.hx = CX + rd.rad * Math.cos(a); rd.hy = CY + rd.rad * Math.sin(a); }
      }
      if (ptr) push(ptr.x, ptr.y, REACH, FORCE * 0.35);
      for (var k = 0; k < all.length; k++) {
        var d = all[k];
        d.vx = (d.vx + (d.hx - d.x) * SPRING) * DAMP; d.vy = (d.vy + (d.hy - d.y) * SPRING) * DAMP;
        d.x += d.vx; d.y += d.vy;
        if (!moving && Math.abs(d.vx) + Math.abs(d.vy) > 0.02) moving = true;
      }
      draw();
      if (!reduced || moving || ptr) requestAnimationFrame(step); else running = false;
    }
    function kick() { if (!running && visible) { running = true; last = 0; requestAnimationFrame(step); } }
    function pos(e) { var r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * S / r.width, y: (e.clientY - r.top) * S / r.height }; }
    canvas.addEventListener("pointermove", function (e) { ptr = pos(e); kick(); });
    canvas.addEventListener("pointerleave", function () { ptr = null; kick(); });
    canvas.addEventListener("pointerdown", function (e) { var p = pos(e); push(p.x, p.y, REACH * 2.4, FORCE * 2.2); kick(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); else running = false; }).observe(canvas);
    }
    draw(); kick();
  };
  img.src = "/assets/paddle.png";
})();
