/* Hero logo: the app icon (assets/icon.png) drawn as particles. On load the icon is split into
   layers - background + paddle, and the cyan arrow ring - so the ring can rotate on top of the
   paddle, both as dots and as the crisp icon. The pointer scatters every dot. */
(function () {
  // data-morph on the <script> tag makes the dots periodically become the crisp icon:
  //   fade     - dots crossfade into the crisp icon
  //   dissolve - dots shrink away while scattering, the icon fades in; dots fly back in to return
  //   morph    - dots burst, swell until they fuse into a solid shape, then the icon sharpens it
  // On the way to the icon the arrows speed up and brake onto the icon's own pose; just before the
  // switch back they start turning again. Without the attribute the logo stays particles-only.
  var MORPH = MODE_OF(document.currentScript);
  function MODE_OF(el) { var m = el && el.getAttribute("data-morph"); return m === "fade" || m === "dissolve" || m === "morph" ? m : ""; }
  var icon = document.querySelector(".hero-icon");
  if (!icon || !window.HTMLCanvasElement) return;
  var mount = icon.parentNode;

  // Canvas fills its container up to MAX px (full width on phones), then everything scales with it.
  var MAX = 360, MIN = 240;
  var S = Math.max(MIN, Math.min(MAX, Math.round(mount.clientWidth || 300))), K = S / 1024;
  var R = S / 300;                           // dot sizes, spacing and pointer reach were tuned at 300px
  var CX = 512 * K, CY = 505 * K;            // ring centre on the 1024 art board
  var BG_STEP = 6 * R, BG_R = 2.2 * R;
  var PAD_STEP = 3.4 * R, PAD_R = 1.4 * R;
  var RING_STEP = 2.9 * R, RING_R = 1.3 * R;
  var SPIN_SECONDS = 16;                     // one slow clockwise turn
  var REACH = 42 * R, FORCE = 8 * R, SPRING = 0.12, DAMP = 0.8;
  var HOLD = 7, TRANSITION = 1.8;            // seconds each state stays / each switch takes
  var OMEGA = 2 * Math.PI / SPIN_SECONDS;    // ring speed, rad/s
  var LAND_SPEED = 4 * OMEGA, SPIN_UP = 1;   // rad/s while landing on the icon; s the arrows wake before the switch back
  var ACCEL = OMEGA / 0.6, LAND_ACCEL = (LAND_SPEED - OMEGA) / 0.6, BRAKE = LAND_SPEED / 1.6;   // rad/s^2
  var LAND_MIN = (LAND_SPEED * LAND_SPEED - OMEGA * OMEGA) / (2 * LAND_ACCEL) + LAND_SPEED * LAND_SPEED / (2 * BRAKE);
  // Measured from icon.png: the flat background navy and the arrow cyan. Background and ring pixels
  // all lie on the line between the two (anti-aliased ring edges are blends) - that lifts the ring out.
  var NAVY = [23, 42, 75], CYAN = [30, 206, 219];
  var BG_SEED = [512, 60];                                 // art-board point in the background
  var PADDLE_SEEDS = [[400, 450], [512, 820]];             // red rubber, handle (a dark seam splits them)
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = Math.round(S * dpr), P = W / S;

  var img = new Image();
  img.onload = function () {
    // ---- split icon.png into layers, once, at canvas resolution -------------------------------
    function layer() { var c = document.createElement("canvas"); c.width = W; c.height = W; return c; }
    var srcC = layer(), sctx = srcC.getContext("2d", { willReadFrequently: true });
    sctx.drawImage(img, 0, 0, W, W);
    var src = sctx.getImageData(0, 0, W, W).data, n = W * W;

    var vx = CYAN[0] - NAVY[0], vy = CYAN[1] - NAVY[1], vz = CYAN[2] - NAVY[2], vv = vx * vx + vy * vy + vz * vz;
    var ringT = new Float32Array(n), onLine = new Uint8Array(n), p, o;
    for (p = 0; p < n; p++) {
      o = p * 4;
      var r = src[o] - NAVY[0], g = src[o + 1] - NAVY[1], b = src[o + 2] - NAVY[2];
      var t = Math.max(0, Math.min(1, (r * vx + g * vy + b * vz) / vv));
      var er = r - t * vx, eg = g - t * vy, eb = b - t * vz;
      var tol = 28 + 40 * t;   // the arrow cyan has lighter highlights; near-navy must stay strict (black rubber)
      ringT[p] = t;
      onLine[p] = src[o + 3] > 250 && er * er + eg * eg + eb * eb < tol * tol ? 1 : 0;
    }
    function flood(seeds, ok) {   // 4-connected fill from art-board points over pixels where ok(p)
      var hit = new Uint8Array(n), stack = new Int32Array(n), top = 0;
      seeds.forEach(function (seed) {
        var s0 = Math.round(seed[1] * W / 1024) * W + Math.round(seed[0] * W / 1024);
        if (!hit[s0] && ok(s0)) { hit[s0] = 1; stack[top++] = s0; }
      });
      while (top) {
        var q = stack[--top], x = q % W;
        if (x > 0 && !hit[q - 1] && ok(q - 1)) { hit[q - 1] = 1; stack[top++] = q - 1; }
        if (x < W - 1 && !hit[q + 1] && ok(q + 1)) { hit[q + 1] = 1; stack[top++] = q + 1; }
        if (q >= W && !hit[q - W] && ok(q - W)) { hit[q - W] = 1; stack[top++] = q - W; }
        if (q < n - W && !hit[q + W] && ok(q + W)) { hit[q + W] = 1; stack[top++] = q + W; }
      }
      return hit;
    }
    var isBg = flood([BG_SEED], function (q) { return onLine[q]; });
    var isPad = flood(PADDLE_SEEDS, function (q) { return !isBg[q] && src[q * 4 + 3] > 10; });

    // base = icon with the ring painted over in navy; ring = the arrows alone.
    var baseC = layer(), ringC = layer();
    var baseD = sctx.getImageData(0, 0, W, W), base = baseD.data;
    var ringD = sctx.createImageData(W, W), ringPx = ringD.data;
    for (p = 0; p < n; p++) {
      o = p * 4;
      if (isBg[p] && ringT[p] > 0.04) {
        ringPx[o] = CYAN[0]; ringPx[o + 1] = CYAN[1]; ringPx[o + 2] = CYAN[2];
        ringPx[o + 3] = Math.round(255 * (ringT[p] - 0.04) / 0.96);
        base[o] = NAVY[0]; base[o + 1] = NAVY[1]; base[o + 2] = NAVY[2];
      }
    }
    baseC.getContext("2d").putImageData(baseD, 0, 0);
    ringC.getContext("2d").putImageData(ringD, 0, 0);

    // ---- dots, grouped by quantised colour so each frame is a handful of fills --------------
    function idx(x, y) {
      var xi = Math.min(W - 1, Math.max(0, Math.round(x * P))), yi = Math.min(W - 1, Math.max(0, Math.round(y * P)));
      return yi * W + xi;
    }
    function q8(v) { return Math.min(255, (v >> 3 << 3) + 4); }
    var bgGroups = {}, ringGroups = {}, padGroups = {}, ring = [];
    function add(groups, x, y, px, o, r, step, isRing) {
      var key = (px[o] >> 3) + "," + (px[o + 1] >> 3) + "," + (px[o + 2] >> 3);
      var g = groups[key] || (groups[key] = { grow: step * 0.62 / r, fill: "rgb(" + q8(px[o]) + "," + q8(px[o + 1]) + "," + q8(px[o + 2]) + ")", r: r, dots: [] });
      var d = { hx: x, hy: y, x: x, y: y, vx: 0, vy: 0, a: 0, rad: 0 };
      if (isRing) { var dx = x - CX, dy = y - CY; d.a = Math.atan2(dy, dx); d.rad = Math.sqrt(dx * dx + dy * dy); ring.push(d); }
      g.dots.push(d);
    }
    function grid(step, fn) {
      for (var row = 0, y = step / 2; y < S; y += step, row++) {
        for (var x = step / 2 + (row % 2 ? step / 2 : 0); x < S; x += step) fn(x, y, idx(x, y));
      }
    }
    // The paddle's dark-blue outline gets background-sized dots: as fine paddle dots it reads as a pale gap.
    function outline(o) { return src[o + 2] < 100 && src[o + 2] - Math.max(src[o], src[o + 1]) > 18; }
    grid(BG_STEP, function (x, y, q) {
      if (base[q * 4 + 3] < 200 || (isPad[q] && !outline(q * 4))) return;   // paddle covers the background
      add(bgGroups, x, y, base, q * 4, BG_R, BG_STEP, false);
    });
    grid(PAD_STEP, function (x, y, q) {
      if (isPad[q] && src[q * 4 + 3] > 140 && !outline(q * 4)) add(padGroups, x, y, src, q * 4, PAD_R, PAD_STEP, false);
    });
    grid(RING_STEP, function (x, y, q) { if (ringPx[q * 4 + 3] > 128) add(ringGroups, x, y, CYAN, 0, RING_R, RING_STEP, true); });
    function vals(o) { return Object.keys(o).map(function (k) { return o[k]; }); }
    var bgList = vals(bgGroups), padList = vals(padGroups), ringList = vals(ringGroups);
    var all = [];
    bgList.concat(padList, ringList).forEach(function (g) { all = all.concat(g.dots); });

    // ---- canvas ----------------------------------------------------------------------------
    var canvas = document.createElement("canvas");
    canvas.className = "hero-logo-fx";
    canvas.width = W; canvas.height = W;
    canvas.style.width = S + "px"; canvas.style.height = S + "px"; canvas.style.maxWidth = "100%";
    canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", icon.getAttribute("alt") || "SpinBook");
    var ctx = canvas.getContext("2d"); ctx.scale(P, P);
    mount.insertBefore(canvas, icon); icon.style.display = "none";
    var crispC = layer(), cctx = crispC.getContext("2d");

    // Morph state: 0 = pure particles, 1 = crisp icon. Set by applyMorph().
    var dotAlpha = 1, dotScale = 1, growT = 0, cleanAlpha = 0;
    function drawDots(list) {
      for (var gi = 0; gi < list.length; gi++) {
        var g = list[gi], rr = g.r * dotScale * (1 + (g.grow - 1) * growT);
        if (rr < 0.05) continue;
        ctx.fillStyle = g.fill; ctx.beginPath();
        for (var k = 0; k < g.dots.length; k++) { var d = g.dots[k]; ctx.moveTo(d.x + rr, d.y); ctx.arc(d.x, d.y, rr, 0, 6.2832); }
        ctx.fill();
      }
    }
    function drawCrisp() {   // composed off-screen first so a half-faded icon fades as one image
      cctx.clearRect(0, 0, W, W);
      cctx.drawImage(baseC, 0, 0);
      cctx.save(); cctx.translate(CX * P, CY * P); cctx.rotate(spin); cctx.translate(-CX * P, -CY * P);
      cctx.drawImage(ringC, 0, 0); cctx.restore();
      ctx.globalAlpha = cleanAlpha; ctx.drawImage(crispC, 0, 0, S, S);
    }
    function draw() {
      ctx.clearRect(0, 0, S, S);
      if (dotAlpha > 0.003 && dotScale > 0.003 && cleanAlpha < 0.999) {
        ctx.globalAlpha = dotAlpha;
        drawDots(bgList); drawDots(padList); drawDots(ringList);
      }
      if (cleanAlpha > 0.003) drawCrisp();
      ctx.globalAlpha = 1;
    }
    function smooth(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
    function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
    function applyMorph(m) {
      dotAlpha = 1; dotScale = 1; growT = 0;
      if (MORPH === "fade") { dotAlpha = 1 - m; cleanAlpha = m; }
      else if (MORPH === "dissolve") { dotScale = 1 - m; cleanAlpha = smooth((m - 0.4) / 0.6); }
      else { growT = m; cleanAlpha = smooth((m - 0.6) / 0.4); }
    }
    function jolt(amount) {
      for (var k = 0; k < all.length; k++) { var d = all[k]; d.vx += (Math.random() - 0.5) * amount; d.vy += (Math.random() - 0.5) * amount; }
    }
    function push(cx, cy, reach, force) {
      for (var k = 0; k < all.length; k++) {
        var d = all[k], dx = d.x - cx, dy = d.y - cy, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < reach && dist > 0.01) { var f = (1 - dist / reach) * force; d.vx += dx / dist * f; d.vy += dy / dist * f; }
      }
    }

    // ---- ring: cruises at spinGoal, or (spinTo >= 0) lands exactly on that angle ------------
    var spin = 0, spinV = reduced ? 0 : OMEGA, spinGoal = spinV, spinTo = -1;
    function turnRing(dt) {
      if (spinTo >= 0) {
        spinV = Math.min(spinV + LAND_ACCEL * dt, LAND_SPEED, Math.sqrt(2 * BRAKE * (spinTo - spin)));
        spin += spinV * dt;
        if (spin >= spinTo - 1e-4) { spin = 0; spinV = 0; spinTo = -1; }   // landed on the icon's pose
      } else {
        spinV += Math.max(-ACCEL * dt, Math.min(ACCEL * dt, spinGoal - spinV));
        spin += spinV * dt;
      }
    }

    var ptr = null, running = false, visible = true, last = 0;
    var phase = "p", pt = 0, wokeAt = -1;     // p = particles, in = to crisp, c = crisp, out = back
    function begin(next) {
      phase = next; pt = 0;
      if (next === "in") {
        spinTo = Math.ceil((spin + LAND_MIN) / (2 * Math.PI)) * 2 * Math.PI; spinGoal = 0; wokeAt = -1;
        if (MORPH === "morph") jolt(FORCE * 2.2); else if (MORPH === "dissolve") push(CX, CY, S, FORCE * 1.4);
      } else {
        spinTo = -1; spinGoal = OMEGA;
        if (MORPH === "morph") jolt(FORCE * 3);
        else if (MORPH === "dissolve") jolt(S * 0.12);   // dots start scattered and fly home
      }
    }
    function cycle(dt) {
      if (!MORPH || reduced) return;
      pt += dt;
      if (phase === "p") { if (pt >= HOLD) begin("in"); }
      else if (phase === "c") {   // arrows wake SPIN_UP s before the switch back (and never before they land)
        if (wokeAt < 0 && spinTo < 0 && pt >= HOLD - SPIN_UP) { wokeAt = pt; spinGoal = OMEGA; }
        if (wokeAt >= 0 && pt >= wokeAt + SPIN_UP) begin("out");
      } else {
        var p = Math.min(pt / TRANSITION, 1), e = ease(p);
        if (phase === "in") { applyMorph(e); if (p >= 1) { phase = "c"; pt = 0; } }
        else { applyMorph(1 - e); if (p >= 1) { phase = "p"; pt = 0; applyMorph(0); } }
      }
    }
    function step(t) {
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0; last = t;
      var moving = false;
      if (!reduced) {
        cycle(dt);
        turnRing(dt);
        for (var j = 0; j < ring.length; j++) { var rd = ring[j], a = rd.a + spin; rd.hx = CX + rd.rad * Math.cos(a); rd.hy = CY + rd.rad * Math.sin(a); }
      }
      if (ptr && phase !== "c") push(ptr.x, ptr.y, REACH, FORCE * 0.35);
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
    canvas.addEventListener("pointerdown", function (e) { if (phase === "c") { begin("out"); kick(); return; } var p = pos(e); push(p.x, p.y, REACH * 2.4, FORCE * 2.2); kick(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); else running = false; }).observe(canvas);
    }
    draw(); kick();
  };
  img.src = "/assets/icon.png";
})();
