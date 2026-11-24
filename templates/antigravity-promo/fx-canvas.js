// fx-canvas.js - Seek-safe Google Antigravity Canvas 2D back/front FX layers.
// Exact frame-quantized timing matching scenes.js; zero Math.random(), zero accumulated state.
(function () {
  'use strict';

  function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const easeOutCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3);

  const rng = mulberry32(2028);
  const GOOGLE_RGB = [
    [49, 134, 255],  // Blue #3186FF
    [252, 65, 61],   // Red #FC413D
    [251, 188, 4],   // Yellow #FBBC04
    [0, 185, 92],    // Green #00B95C
    [235, 244, 255], // White-blue
  ];

  const SPARKS = Array.from({ length: 100 }, () => ({
    x: rng() * 1920,
    y0: rng() * 1080,
    vy: 55 + rng() * 135,
    amp: 12 + rng() * 28,
    freq: 1.5 + rng() * 3.5,
    phase: rng() * Math.PI * 2,
    r: 1.4 + rng() * 2.8,
    cIdx: Math.floor(rng() * GOOGLE_RGB.length),
    alpha: 0.38 + rng() * 0.62,
  }));

  const RADIAL_LINES = Array.from({ length: 58 }, (_, i) => ({
    angle: (i / 58) * Math.PI * 2 + (rng() - 0.5) * 0.08,
    rStart: 120 + rng() * 220,
    len: 170 + rng() * 440,
    speed: 380 + rng() * 520,
    w: 1.4 + rng() * 2.2,
    cIdx: rng() < 0.6 ? 0 : Math.floor(rng() * 4),
    alpha: 0.25 + rng() * 0.55,
  }));

  const STREAKS = Array.from({ length: 85 }, () => ({
    x: rng() * 1920,
    y0: rng() * 1080,
    speed: 2200 + rng() * 2600,
    len: 100 + rng() * 270,
    w: 1.5 + rng() * 2.6,
    cIdx: rng() < 0.52 ? 0 : rng() < 0.78 ? 4 : 2,
    alpha: 0.35 + rng() * 0.62,
  }));

  let backCanvas = null, backCtx = null;
  let frontCanvas = null, frontCtx = null;

  window.__initFX = function (backEl, frontEl) {
    backCanvas = backEl;
    backCanvas.width = 1920;
    backCanvas.height = 1080;
    backCtx = backCanvas.getContext('2d');

    frontCanvas = frontEl;
    frontCanvas.width = 1920;
    frontCanvas.height = 1080;
    frontCtx = frontCanvas.getContext('2d');
  };

  function drawSparks(ctx, t, intensity, redOnly) {
    for (let i = 0; i < SPARKS.length; i++) {
      const p = SPARKS[i];
      const y = ((p.y0 - t * p.vy) % 1140 + 1140) % 1140 - 30;
      const x = p.x + Math.sin(t * p.freq + p.phase) * p.amp;
      const tw = 0.55 + 0.45 * Math.sin(t * 7.0 + p.phase);
      const rgb = redOnly ? [252, 65, 61] : GOOGLE_RGB[p.cIdx];
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(p.alpha * tw * intensity).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawRadialBurst(ctx, t, t0, intensity) {
    const dt = Math.max(0, t - t0);
    const cx = 960, cy = 540;
    for (let i = 0; i < RADIAL_LINES.length; i++) {
      const l = RADIAL_LINES[i];
      const r0 = l.rStart + dt * l.speed;
      const r1 = r0 + l.len;
      const rgb = GOOGLE_RGB[l.cIdx];
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(l.alpha * intensity).toFixed(3)})`;
      ctx.lineWidth = l.w;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(l.angle) * r0, cy + Math.sin(l.angle) * r0);
      ctx.lineTo(cx + Math.cos(l.angle) * r1, cy + Math.sin(l.angle) * r1);
      ctx.stroke();
    }
  }

  function drawVerticalStreaks(ctx, t, intensity) {
    for (let i = 0; i < STREAKS.length; i++) {
      const s = STREAKS[i];
      const y = ((s.y0 + t * s.speed) % 1360) - 240;
      const rgb = GOOGLE_RGB[s.cIdx];
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(s.alpha * intensity).toFixed(3)})`;
      ctx.lineWidth = s.w;
      ctx.beginPath();
      ctx.moveTo(s.x, y);
      ctx.lineTo(s.x, y + s.len);
      ctx.stroke();
    }
  }

  function drawPrismaticLaser(ctx, y, alpha, sweepX, multiColor) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const xEnd = 1920 * clamp01(sweepX);

    // Primary Electric Google Blue glow
    const grad = ctx.createLinearGradient(0, y - 58, 0, y + 58);
    grad.addColorStop(0, 'rgba(49, 134, 255, 0)');
    grad.addColorStop(0.42, `rgba(49, 134, 255, ${(0.45 * alpha).toFixed(3)})`);
    grad.addColorStop(0.5, `rgba(210, 232, 255, ${(0.92 * alpha).toFixed(3)})`);
    grad.addColorStop(0.58, `rgba(49, 134, 255, ${(0.45 * alpha).toFixed(3)})`);
    grad.addColorStop(1, 'rgba(49, 134, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, y - 58, xEnd, 116);

    if (multiColor) {
      // Subtle 4-color Google prismatic streaks flanking beam
      ctx.fillStyle = `rgba(252, 65, 61, ${(0.35 * alpha).toFixed(3)})`;
      ctx.fillRect(0, y - 14, xEnd * 0.92, 3);
      ctx.fillStyle = `rgba(251, 188, 4, ${(0.35 * alpha).toFixed(3)})`;
      ctx.fillRect(xEnd * 0.08, y + 11, xEnd * 0.88, 3);
      ctx.fillStyle = `rgba(0, 185, 92, ${(0.35 * alpha).toFixed(3)})`;
      ctx.fillRect(xEnd * 0.04, y + 20, xEnd * 0.94, 2.5);
    }

    ctx.fillStyle = `rgba(255, 255, 255, ${(0.96 * alpha).toFixed(3)})`;
    ctx.fillRect(0, y - 2, xEnd, 4);
    ctx.restore();
  }

  function drawWireframeTunnel(ctx, t, t0) {
    const dt = Math.max(0, t - t0);
    const u = easeOutCubic(clamp01(dt / 0.45));
    const drift = dt * 0.8;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 205px "Poppins", sans-serif';

    const layers = 13;
    for (let i = layers; i >= 1; i--) {
      const k = i / layers;
      const scale = 1.0 + k * (0.68 * u + 0.05 * Math.sin(drift * 2 + k));
      const yOff = 695 + k * (245 * u);
      const xOff = 960 + Math.sin(drift + k * 0.5) * 6;
      const alpha = (1 - k * 0.86) * 0.54 * u;

      ctx.save();
      ctx.translate(xOff, yOff);
      ctx.scale(scale, scale * (1 - k * 0.05));
      ctx.lineWidth = 2.4 / scale;
      ctx.strokeStyle = `rgba(49, 134, 255, ${alpha.toFixed(3)})`;
      ctx.strokeText('QUISER.', 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  window.__drawFX = function (t) {
    if (!backCtx || !frontCtx || !window.BEATS) return;
    const sc = window.BEATS.scenes;
    const fNow = Math.round(t * 30);
    const fr = (sec) => Math.round(sec * 30);
    const inFr = (a, b) => fNow >= fr(a) && fNow < fr(b);

    backCtx.clearRect(0, 0, 1920, 1080);
    frontCtx.clearRect(0, 0, 1920, 1080);

    // Multi-color Antigravity sparks vs crimson error sparks
    if (inFr(sc.s04.start, sc.s05.end)) drawSparks(backCtx, t, 0.58, false);
    if (inFr(sc.s07.cues.antigravity - 0.1, sc.s07.end)) drawSparks(backCtx, t, 0.95, false);
    if (inFr(sc.s13.start, sc.s13.end)) drawSparks(backCtx, t, 0.52, true);
    if (inFr(sc.s17.start, sc.s17.end)) drawSparks(backCtx, t, 0.72, false);
    if (inFr(sc.s21.start, sc.s21.end)) drawSparks(backCtx, t, 0.55, false);
    if (inFr(sc.s22.start, sc.s22.end - 0.9)) drawSparks(backCtx, t, 0.62, false);

    // S07 radial burst
    if (inFr(sc.s07.start, sc.s07.cues.antigravity + 0.35)) {
      const tAg = sc.s07.cues.antigravity;
      const fade = t < tAg ? 0.70 : 0.95 * (1 - clamp01((t - tAg) / 0.35));
      drawRadialBurst(backCtx, t, sc.s07.start, fade);
    }

    // S11 vertical zero-G streaks
    if (inFr(sc.s11.cues.fly, sc.s11.cues.explode + 0.16)) {
      const fade = t < sc.s11.cues.explode ? 1.0 : 1 - clamp01((t - sc.s11.cues.explode) / 0.16);
      drawVerticalStreaks(backCtx, t, fade);
    }

    // S12 electric blue wireframe tunnel
    if (inFr(sc.s12.cues.quiser - 0.04, sc.s12.end)) {
      drawWireframeTunnel(backCtx, t, sc.s12.cues.quiser - 0.04);
    }

    // S07 prismatic 4-color Google laser across ANTIGRAVITY
    if (inFr(sc.s07.cues.antigravity - 0.12, sc.s07.end)) {
      const dtL = t - (sc.s07.cues.antigravity - 0.12);
      const lDur = Math.max(0.3, sc.s07.end - sc.s07.cues.antigravity);
      const sweep = clamp01(dtL / 0.16);
      const lAlpha = dtL < 0.25 ? 1.0 : 0.72 * (1 - clamp01((dtL - 0.25) / (lDur - 0.25)));
      drawPrismaticLaser(frontCtx, 540, lAlpha, sweep, true);
    }

    // S10 blue laser slice into blue square
    const tSq = sc.s10.cues.sq_in;
    if (inFr(tSq - 0.22, tSq + 0.20)) {
      const u = clamp01((t - (tSq - 0.22)) / 0.42);
      drawPrismaticLaser(frontCtx, 540, Math.sin(u * Math.PI) * 0.92, clamp01(u * 2.1), false);
    }

    // S18 prismatic wipe into Skills, Direção e Referência
    if (inFr(sc.s18.start, sc.s18.start + 0.26)) {
      const u = (t - sc.s18.start) / 0.26;
      drawPrismaticLaser(frontCtx, 540, 1 - u, 1.0, true);
    }

    // 2-frame hard impact flashes
    const flashes = [
      [sc.s07.cues.antigravity, 'rgba(49, 134, 255, 0.45)'],
      [sc.s11.cues.fly, 'rgba(255, 255, 255, 0.52)'],
      [sc.s11.cues.explode, 'rgba(49, 134, 255, 0.58)'],
      [sc.s16.cues.cara, 'rgba(255, 255, 255, 0.35)'],
      [sc.s19.cues.blue_flash, 'rgba(49, 134, 255, 0.45)'],
    ];
    for (const [ft, col] of flashes) {
      if (t >= ft && t < ft + 0.068) {
        frontCtx.save();
        frontCtx.globalAlpha = 1 - (t - ft) / 0.068;
        frontCtx.fillStyle = col;
        frontCtx.fillRect(0, 0, 1920, 1080);
        frontCtx.restore();
      }
    }
  };
})();
