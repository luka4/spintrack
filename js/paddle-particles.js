/* Hero decoration: the SpinBook paddle drawn as a field of dots that scatter
   from the pointer and spring home. Dot positions and colours are sampled from
   /assets/paddle.png. Progressive enhancement: the static .hero-icon stays
   unless this runs; reduced-motion visitors get the dots without animation. */
(function () {
  var mount = document.querySelector('[data-fx="paddle"]');
  var icon = document.querySelector(".hero-icon");
  if (!(mount || icon) || !window.HTMLCanvasElement) return;

  var W = 160, H = 252;          // CSS px
  var STEP = 5;                  // grid spacing in CSS px (coarse grain)
  var RADIUS = 1.9;              // dot radius in CSS px
  var REACH = 46, FORCE = 9;     // pointer push distance / strength
  var SPRING = 0.12, DAMP = 0.8;
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var img = new Image();
  img.onload = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var off = document.createElement("canvas");
    off.width = W; off.height = H;
    var octx = off.getContext("2d", { willReadFrequently: true });
    var scale = Math.min(W / img.width, H / img.height);
    var dw = img.width * scale, dh = img.height * scale;
    octx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    var px = octx.getImageData(0, 0, W, H).data;

    var dots = [];
    for (var row = 0, y = STEP / 2; y < H; y += STEP, row++) {
      var shift = row % 2 ? STEP / 2 : 0;           // hex packing
      for (var x = STEP / 2 + shift; x < W; x += STEP) {
        var i = ((y | 0) * W + (x | 0)) * 4;
        if (px[i + 3] < 140) continue;
        var r = px[i], g = px[i + 1], b = px[i + 2];
        if (r + g + b < 150) { r = 78; g = 86; b = 100; }   // keep black rubber and outline visible on the dark page
        dots.push({ hx: x, hy: y, x: x, y: y, vx: 0, vy: 0, c: "rgb(" + r + "," + g + "," + b + ")" });
      }
    }

    var canvas = document.createElement("canvas");
    canvas.className = "hero-paddle";
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", icon ? icon.getAttribute("alt") || "SpinBook" : "SpinBook");
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    if (mount) { mount.appendChild(canvas); }
    else { icon.parentNode.insertBefore(canvas, icon); icon.style.display = "none"; }

    var ptr = null, running = false, visible = true;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var lastC = "";
      for (var k = 0; k < dots.length; k++) {
        var d = dots[k];
        if (d.c !== lastC) { ctx.fillStyle = d.c; lastC = d.c; }
        ctx.beginPath(); ctx.arc(d.x, d.y, RADIUS, 0, 6.2832); ctx.fill();
      }
    }

    function push(cx, cy, reach, force) {
      for (var k = 0; k < dots.length; k++) {
        var d = dots[k], dx = d.x - cx, dy = d.y - cy, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < reach && dist > 0.01) {
          var f = (1 - dist / reach) * force;
          d.vx += dx / dist * f; d.vy += dy / dist * f;
        }
      }
    }

    function step() {
      var moving = false;
      if (ptr) push(ptr.x, ptr.y, REACH, FORCE * 0.35);
      for (var k = 0; k < dots.length; k++) {
        var d = dots[k];
        d.vx = (d.vx + (d.hx - d.x) * SPRING) * DAMP;
        d.vy = (d.vy + (d.hy - d.y) * SPRING) * DAMP;
        d.x += d.vx; d.y += d.vy;
        if (Math.abs(d.vx) + Math.abs(d.vy) > 0.02 || Math.abs(d.hx - d.x) + Math.abs(d.hy - d.y) > 0.05) moving = true;
      }
      draw();
      if (moving || ptr) requestAnimationFrame(step); else running = false;
    }
    function kick() { if (!running && visible && !reduced) { running = true; requestAnimationFrame(step); } }

    function pos(e) { var r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
    canvas.addEventListener("pointermove", function (e) { ptr = pos(e); kick(); });
    canvas.addEventListener("pointerleave", function () { ptr = null; kick(); });
    canvas.addEventListener("pointerdown", function (e) { var p = pos(e); push(p.x, p.y, REACH * 2.4, FORCE * 2.2); kick(); });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }).observe(canvas);
    }
    draw();
  };
  img.src = "/assets/paddle.png";
})();
