window.addEventListener('DOMContentLoaded', () => {
  const M = Motion.film({
    main: '#main',
    fps: 30,
    width: 1920,
    height: 1080,
  });

  const fr = (sec) => Math.round(sec * 30);

  // Cena 1 (0s .. 4s)
  M.cut(0, { show: ['#s01'] });
  M.enter('#s01-title', { at: 2, frames: 8, ease: 'crashIn', from: { scale: 1.8 } });
  M.enter('#s01-sub', { at: 14, frames: 8, ease: 'snapSettle', from: { y: 40 } });
  M.hide('#s01', fr(4.0));

  // Cena 2 (4s .. 8s)
  M.cut(fr(4.0), { show: ['#s02'] });
  M.enter('#s02-title', { at: fr(4.0) + 2, frames: 7, ease: 'crashIn', from: { scale: 1.8 } });
  M.enter('#s02-sub', { at: fr(4.0) + 14, frames: 8, ease: 'snapSettle', from: { y: 40 } });
  M.hide('#s02', fr(8.0));

  // Cena 3 (8s .. 12s)
  M.cut(fr(8.0), { show: ['#s03'] });
  M.enter('#s03-title', { at: fr(8.0) + 2, frames: 8, ease: 'snapSettle', from: { scale: 1.4 } });
  M.enter('#s03-sub', { at: fr(8.0) + 16, frames: 8, ease: 'softLand', from: { y: 40 } });

  Motion.loaded();
});
