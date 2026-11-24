// scenes.js - Google Antigravity 22-scene frame-accurate motion choreography synced to window.BEATS.
(function () {
  'use strict';

  const B = window.BEATS;
  const SC = B.scenes;
  const FPS = B.fps;

  const M = Motion.film({
    fps: FPS,
    duration: B.duration,
    width: 1920,
    height: 1080,
    clock: 'smooth',
  });

  const fr = (sec) => Math.round(sec * FPS);

  // Set root data-duration dynamically from beats.js
  document.getElementById('main').setAttribute('data-duration', String(B.duration));

  // Build S16 5x5 generic orange tiles & S19 Antigravity config wall before selfTest
  (function buildStaticGrids() {
    const grid = document.getElementById('s16-grid');
    for (let i = 0; i < 25; i++) {
      const tile = document.createElement('div');
      tile.className = 'slop-tile';
      tile.innerHTML =
        '<div class="slop-circle" style="width:150px;height:150px;left:-35px;bottom:-35px"></div>' +
        '<div class="slop-circle" style="width:100px;height:100px;right:20px;top:20px"></div>' +
        '<div style="font-size:32px;font-weight:800;z-index:2">Seu vídeo incrível</div>' +
        '<div style="font-size:15px;opacity:0.86;margin-top:6px;z-index:2">feito com inteligência artificial</div>';
      grid.appendChild(tile);
    }

    const wall = document.getElementById('s19-wall');
    const lines = [
      '<b>SKILL:</b> motionmaxxing + hero3d + google-antigravity-sdk',
      '<b>ENGINE:</b> Three.js WebGL r186 + GSAP 3.12.5 timeline determinística',
      '<b>BEATS:</b> beats.js ancorado palavra por palavra em 30 fps exatos',
      '<b>CÂMERA:</b> M.camera, M.snap, M.dive e M.whip com blur direcional',
      '<b>3D RIG A:</b> interrogação glossy chanfrada com RoomEnvironment HDR',
      '<b>3D RIG B:</b> 5 torres NASA + horizonte orbital Google Blue #3186FF',
      '<b>3D RIG C:</b> quadrado plano → cubo c/ sombra → zero-G → 140 fragmentos',
      '<b>LASER:</b> feixe prismático 4 cores (#4285F4 #EA4335 #FBBC04 #34A853)',
      '<b>VOZ:</b> Gemini 3.8 Flash TTS (Puck) gravada frase a frase + auditoria',
      '<b>ÁUDIO:</b> beat 126 BPM + 4 beat drops + 46 SFX + loudnorm 2-pass',
      '<b>TIPOGRAFIA:</b> Anton condensada + Poppins Black + JetBrains Mono',
      '<b>LEGENDAS:</b> renderização por linha sem cruzamento de frases',
      '<b>SAFETY:</b> gate G0 (duração), G2 (sem frame vazio), G3 (end hold <= 1.4s)',
      '<b>SEAMS:</b> cortes WebGL/Canvas quantizados por frame (zero lag)',
      '<b>CURSOR:</b> trajetória bezier suavizada + compressão física no clique',
      '<b>PIP:</b> janela 16:9 arredondada sincronizada com os atos anteriores',
      '<b>CONFIG:</b> rules, skills, mcp servers e workflows locais em .agents/',
      '<b>MIXAGEM:</b> sidechain ducking -9.5 dB + True Peak -1.5 dBTP',
      '<b>BRANDING:</b> logo oficial antigravity.google + daylight editorial',
      '<b>RENDER:</b> Chrome headless determinístico em 1920x1080 bt709',
    ];
    lines.forEach((html, idx) => {
      const d = document.createElement('div');
      d.className = 'spec-line';
      d.dataset.idx = String(idx);
      d.innerHTML = html;
      wall.appendChild(d);
    });
  })();

  function stampShake(el, atFr) {
    M.kf(el, 'x', [[atFr, 0], [atFr + 1, -14], [atFr + 2, 11], [atFr + 3, -6], [atFr + 4, 3], [atFr + 5, 0]]);
    M.kf(el, 'y', [[atFr, 0], [atFr + 1, 9], [atFr + 2, -8], [atFr + 3, 4], [atFr + 4, 0]]);
  }

  // S01: Peraí... tu tá achando que só o Claude... (Google Blue)
  {
    const s = SC.s01, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fSo = fr(c.so), fCl = fr(c.claude);

    M.cut(f0, { show: ['#world-blue', '#s01'], hide: ['#world-dark-blue', '#world-dark-red', '#world-daylight'] });
    M.hide('#s01', fEnd);

    M.show('#s01-pill', f0, fCl);
    M.enter('#s01-perai', { at: f0, frames: 6, ease: 'crashIn', from: { scale: 1.75 } });
    M.hide('#s01-perai', fSo);

    M.enter('#s01-so', { at: fSo, frames: 5, ease: 'crashIn', from: { scale: 1.8 } });
    M.hide('#s01-so', fCl);

    M.enter('#s01-claude-wrap', { at: fCl, frames: 8, ease: 'snapSettle', from: { scale: 1.55, x: -75 }, smear: { axis: 'x', px: 34, frames: 3 } });
    M.drift('#s01-claude', { prop: 'x', from: 20, to: -45, start: fCl, end: fEnd });
  }

  // S02: ou um computador da NASA fazem um vídeo desse nível? (Daylight)
  {
    const s = SC.s02, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fNasa = fr(c.nasa), fNiv = fr(c.nivel);

    M.cut(f0, { show: ['#world-daylight', '#s02'], hide: ['#world-blue'] });
    M.hide('#s02', fEnd);

    M.enter('#s02-comp', { at: f0, frames: 7, ease: 'snapSettle', from: { y: -70 } });
    M.hide('#s02-comp', fNiv);

    M.enter('#s02-nasa', { at: fNasa, frames: 8, ease: 'whip', from: { x: 380 }, smear: { axis: 'x', px: 44, frames: 3 } });
    M.hide('#s02-nasa', fNiv);

    M.enter('#s02-nivel', { at: fNiv, frames: 7, ease: 'snapSettle', from: { scale: 1.35, y: 45 } });
  }

  // S03: Pensou errado, meu parceiro! (Dark Crimson)
  {
    const s = SC.s03, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fErr = fr(c.errado), fPar = fr(c.parceiro);

    M.cut(f0, { show: ['#world-dark-red', '#s03'], hide: ['#world-daylight'] });
    M.hide('#s03', fEnd);

    M.enter('#s03-pensou', { at: f0, frames: 5, ease: 'crashIn', from: { scale: 1.75 } });
    M.hide('#s03-pensou', fErr);

    M.enter('#s03-errado', { at: fErr, frames: 5, ease: 'crashIn', from: { scale: 1.7 } });
    M.hide('#s03-errado', fPar);

    M.enter('#s03-parceiro', { at: fPar, frames: 7, ease: 'snapSettle', from: { scale: 1.4, y: 40 } });
  }

  // S04: Cara, eu não abri o After nenhuma vez pra fazer o que tu tá vendo aqui. (Dark Blue + AE UI)
  {
    const s = SC.s04, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fEu = fr(c.eu), fAft = fr(c.after);

    M.cut(f0, { show: ['#world-dark-blue', '#s04'], hide: ['#world-dark-red'] });
    M.hide('#s04', fEnd);

    M.enter('#s04-ae', { at: f0, frames: 11, ease: 'softLand', from: { x: -180, y: 90, scale: 0.88 }, smear: { axis: 'x', px: 28, frames: 3 } });
    M.drift('#s04-ae', { prop: 'x', from: 0, to: 22, start: f0 + 11, end: fEnd });

    M.enter('#s04-txt1', { at: fEu, frames: 8, ease: 'snapSettle', from: { x: 140 }, smear: { axis: 'x', px: 32, frames: 3 } });
    M.hide('#s04-txt1', fAft);

    M.enter('#s04-txt2', { at: fAft, frames: 7, ease: 'crashIn', from: { scale: 1.4, x: 90 } });
  }

  // S05: Nenhuma keyframe na mão. Zero dor de cabeça. (Dark Blue + Bokeh)
  {
    const s = SC.s05, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fKey = fr(c.keyframe), fZero = fr(c.zero);

    M.cut(f0, { show: ['#world-dark-blue', '#s05'] });
    M.hide('#s05', fEnd);

    M.enter('#s05-nenhuma', { at: f0, frames: 6, ease: 'snapSettle', from: { scale: 1.45 } });
    M.hide('#s05-nenhuma', fKey);

    M.enter('#s05-key', { at: fKey, frames: 6, ease: 'crashIn', from: { scale: 1.55 } });
    M.hide('#s05-key', fZero);

    M.enter('#s05-zero', { at: fZero, frames: 7, ease: 'snapSettle', from: { scale: 0.78 } });
    M.drift('#s05-zero', { prop: 'scale', from: 1.0, to: 1.09, start: fZero + 7, end: fEnd });
  }

  // S06: Quer saber o que gerou esse vídeo inteiro? (Google Blue + REC + 3D ?)
  {
    const s = SC.s06, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fGer = fr(c.gerou);

    M.cut(f0, { show: ['#world-blue', '#s06'], hide: ['#world-dark-blue'] });
    M.hide('#s06', fEnd);

    M.enter('#s06-esse', { at: f0, frames: 8, ease: 'whip', from: { x: -240 }, smear: { axis: 'x', px: 42, frames: 3 } });
    M.enter('#s06-aqui', { at: fGer, frames: 7, ease: 'snapSettle', from: { y: 110, scale: 1.25 }, smear: { axis: 'y', px: 30, frames: 3 } });
  }

  // S07: Isso aqui é Antigravity, meus amigos! Direto do Google, rapaz! (MEGA REVEAL)
  {
    const s = SC.s07, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fAg = fr(c.antigravity), fDir = fr(c.direto);

    M.cut(f0, { show: ['#world-dark-blue', '#s07'], hide: ['#world-blue'] });
    M.hide('#s07', fEnd);

    M.enter('#s07-isso', { at: f0, frames: 7, ease: 'snapSettle', from: { scale: 0.65 } });
    M.hide('#s07-isso', fAg);

    const agWrap = M.wrap('#s07-ag');
    M.enter('#s07-ag', { at: fAg, frames: 8, ease: 'crashIn', from: { scale: 2.25, rotation: -5 }, smear: { axis: 'x', px: 44, frames: 3 } });
    M.drift(agWrap, { prop: 'scale', from: 1.0, to: 1.07, start: fAg + 8, end: fEnd });

    M.enter('#s07-sub', { at: fDir, frames: 8, ease: 'softLand', from: { y: 45, opacity: 0 } });
  }

  // S08: E eu não escrevi nenhuma linha de código! (Daylight + Antigravity IDE + CÓDIGO)
  {
    const s = SC.s08, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fNen = fr(c.nenhuma), fLin = fr(c.linha), fDe = fr(c.de), fCod = fr(c.codigo);

    M.cut(f0, { show: ['#world-daylight', '#s08'], hide: ['#world-dark-blue'] });
    M.hide('#s08', fEnd);

    M.enter('#s08-code', { at: f0, frames: 10, ease: 'softLand', from: { x: -200, y: 70 }, smear: { axis: 'x', px: 30, frames: 3 } });
    M.hide('#s08-code', fDe);

    M.enter('#s08-r1', { at: fNen, frames: 6, ease: 'snapSettle', from: { x: 140 } });
    M.hide('#s08-r1', fLin);

    M.enter('#s08-r2', { at: fLin, frames: 5, ease: 'crashIn', from: { scale: 1.35 } });
    M.hide('#s08-r2', fDe);

    M.enter('#s08-cod-wrap', { at: fDe, frames: 7, ease: 'snapSettle', from: { scale: 1.3 } });
    M.kf('#s08-slash', 'scaleX', [[fCod, 0], [fCod + 6, 1, 'whip']]);
  }

  // S09: Não precisa de máquina da NASA... (Dark Blue + 3D Servers)
  {
    const s = SC.s09, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fMaq = fr(c.maquina), fNasa = fr(c.nasa);

    M.cut(f0, { show: ['#world-dark-blue', '#s09'], hide: ['#world-daylight'] });
    M.hide('#s09', fEnd);

    M.enter('#s09-top', { at: f0, frames: 7, ease: 'softLand', from: { y: 60 } });
    M.enter('#s09-maq', { at: fMaq, frames: 8, ease: 'crashIn', from: { scale: 1.55 }, smear: { axis: 'y', px: 28, frames: 3 } });
    M.enter('#s09-nasa', { at: fNasa, frames: 7, ease: 'snapSettle', from: { scale: 1.7, y: 40 } });
  }

  // S10: Com ele configurado do jeito certo, tu simplesmente pede o que tu quiser! (Daylight)
  {
    const s = SC.s10, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fPede = fr(c.pede), fSq = fr(c.sq_in);

    M.cut(f0, { show: ['#world-daylight', '#s10'], hide: ['#world-dark-blue'] });
    M.hide('#s10', fEnd);

    M.enter('#s10-et', { at: f0, frames: 6, ease: 'snapSettle', from: { x: -140 } });
    M.hide('#s10-et', fPede);

    M.enter('#s10-pedir', { at: fPede, frames: 8, ease: 'whip', from: { x: 260 }, smear: { axis: 'x', px: 42, frames: 3 } });
    M.hide('#s10-pedir', fSq);

    M.enter('#s10-sq', { at: fSq, frames: 7, ease: 'popOver', from: { scale: 0.15 } });
  }

  // S11: Olha esse quadrado aqui: quero que ele vire 3D, perca a gravidade... e exploda!
  {
    const s = SC.s11, c = s.cues;
    const f0 = fr(s.start), fFly = fr(c.fly), fEnd = fr(s.end);

    M.cut(f0, { show: ['#world-daylight', '#s11'], hide: ['#world-dark-blue'] });
    M.cut(fFly, { show: ['#world-dark-blue'], hide: ['#world-daylight'] });
    M.hide('#s11', fEnd);
  }

  // S12: Tu pode pedir literalmente o que tu quiser, bicho! (Dark Blue + 4-color shards + Blue Wireframe)
  {
    const s = SC.s12, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fQuis = fr(c.quiser);

    M.cut(f0, { show: ['#world-dark-blue', '#s12'], hide: ['#world-daylight'] });
    M.hide('#s12', fEnd);

    M.enter('#s12-a', { at: f0, frames: 7, ease: 'snapSettle', from: { x: -160 }, smear: { axis: 'x', px: 34, frames: 3 } });
    M.hide('#s12-a', fQuis - 4);

    const bWrap = M.wrap('#s12-b');
    M.enter('#s12-b', { at: fQuis - 4, frames: 8, ease: 'crashIn', from: { scale: 1.45, y: 50 } });
    M.drift(bWrap, { prop: 'scale', from: 1.0, to: 1.07, start: fQuis + 4, end: fEnd });
  }

  // S13: Só que calma lá... não foi só abrir o Antigravity puro e jogar um pedido genérico. (Dark Crimson)
  {
    const s = SC.s13, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fAg = fr(c.antigravity), fPuro = fr(c.puro), fGen = fr(c.generico);

    M.cut(f0, { show: ['#world-dark-red', '#s13'], hide: ['#world-dark-blue'] });
    M.hide('#s13', fEnd);

    M.show('#s13-a', f0, fGen - 10);
    M.enter('#s13-calma', { at: f0, frames: 6, ease: 'snapSettle', from: { scale: 1.5 } });
    M.enter('#s13-nao', { at: f0 + 14, frames: 6, ease: 'softLand', from: { y: 40 } });
    M.enter('#s13-ag', { at: fAg, frames: 6, ease: 'softLand', from: { y: 50 } });
    M.enter('#s13-puro', { at: fPuro, frames: 5, ease: 'crashIn', from: { scale: 2.5 } });
    stampShake('#s13', fPuro + 1);

    M.show('#s13-b', fGen - 10, fEnd);
    M.enter('#s13-jogar', { at: fGen - 10, frames: 6, ease: 'snapSettle', from: { y: 40 } });
    M.enter('#s13-gen', { at: fGen, frames: 5, ease: 'crashIn', from: { scale: 2.5 } });
    stampShake('#s13', fGen + 1);
  }

  // S14: Se tu chegar no Antigravity zerado, sem configurar nada, e pedir um vídeo igual esse... não vai sair!
  {
    const s = SC.s14, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fAg = fr(c.antigravity), fZer = fr(c.zerado), fSem = fr(c.sem), fNao = fr(c.nao);

    M.cut(f0, { show: ['#world-daylight', '#s14'], hide: ['#world-dark-red'] });
    M.hide('#s14', fEnd);

    M.show('#s14-a', f0, fSem);
    M.enter('#s14-ag', { at: fAg, frames: 7, ease: 'crashIn', from: { scale: 2.0 } });
    M.enter('#s14-zerado', { at: fZer, frames: 6, ease: 'softLand', from: { y: 50 } });

    M.enter('#s14-b', { at: fSem, frames: 7, ease: 'snapSettle', from: { scale: 1.25 } });
    M.enter('#s14-naovai', { at: fNao, frames: 6, ease: 'crashIn', from: { scale: 1.6 } });
  }

  // S15: Porque se tu pede igual cliente indeciso: "faz um vídeo bem bacana aí", a IA vai no piloto automático.
  {
    const s = SC.s15, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fCl = fr(c.cliente), fIa = fr(c.ia), fPil = fr(c.piloto);

    M.cut(f0, { show: ['#world-dark-red', '#s15'], hide: ['#world-daylight'] });
    M.hide('#s15', fEnd);

    const typeEnd = f0 + 42;
    M.type('#s15-input', { at: f0 + 2, style: 'fast', seed: 12, caret: '#s15-caret', caretGap: 4, caretOff: typeEnd + 4 });
    M.press('#s15-caret', '#s15-send', { at: typeEnd + 2, cursorDepth: 0.9, targetDepth: 0.78, frames: 3 });
    M.hide('#s15-input', typeEnd + 5);

    M.enter('#s15-msg-u', { at: typeEnd + 6, frames: 7, ease: 'popOver', from: { y: 24, scale: 0.9 } });
    M.enter('#s15-msg-ai', { at: typeEnd + 18, frames: 8, ease: 'softLand', from: { y: 26, scale: 0.94 } });

    M.enter('#s15-r1', { at: fCl, frames: 6, ease: 'snapSettle', from: { x: 120 } });
    M.hide('#s15-r1', fIa);

    M.enter('#s15-r2', { at: fIa, frames: 6, ease: 'crashIn', from: { scale: 1.6 } });
    M.hide('#s15-r2', fPil);

    M.enter('#s15-g1', { at: fPil, frames: 5, ease: 'crashIn', from: { scale: 2.3 } });

    const fZoomStart = Math.max(fPil + 4, fEnd - 18);
    M.camera('#s15-cam', [
      [fZoomStart, { scale: 1, x: 0, y: 0 }],
      [fEnd, { scale: 5.4, x: 622, y: 52 }, 'accelExit'],
    ], { origin: '338px 488px' });
  }

  // S16: Aí não tem milagre: ela entrega o mesmo template... com cara de IA.
  {
    const s = SC.s16, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fOut = fr(c.grid_out), fIG = fr(c.ig_card), fCara = fr(c.cara), fDeIa = fr(c.de_ia);

    M.cut(f0, { show: ['#world-dark-red', '#s16'] });
    M.hide('#s16', fEnd);

    M.camera('#s16-grid', [
      [f0, { scale: 3.20, x: 0 }],
      [fOut, { scale: 3.20, x: 0 }],
      [fOut + 18, { scale: 1.0, x: 0 }, 'snapSettle'],
      [fIG, { scale: 1.0, x: 0 }],
      [fIG + 14, { scale: 0.92, x: -240 }, 'softLand'],
    ], { origin: '50% 50%' });

    M.enter('#s16-ig', { at: fIG, frames: 12, ease: 'snapSettle', from: { x: 460 }, smear: { axis: 'x', px: 38, frames: 3 } });

    M.enter('#s16-cara', { at: fCara, frames: 5, ease: 'crashIn', from: { scale: 2.8 } });
    stampShake('#s16', fCara + 1);

    M.enter('#s16-deia', { at: fDeIa, frames: 5, ease: 'crashIn', from: { scale: 2.8 } });
    stampShake('#s16', fDeIa + 1);
  }

  // S17: Pra chegar nesse nível, não basta só o Antigravity puro: configurações certas:
  {
    const s = SC.s17, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fPuro = fr(c.puro), fCfg = fr(c.config);

    M.cut(f0, { show: ['#world-dark-blue', '#s17'], hide: ['#world-dark-red'] });
    M.hide('#s17', fEnd);

    M.show('#s17-a', f0, fCfg);
    M.enter('#s17-pra', { at: f0, frames: 6, ease: 'softLand', from: { y: 40 } });
    M.enter('#s17-ag', { at: fPuro - 6, frames: 7, ease: 'snapSettle', from: { scale: 1.35 } });

    M.enter('#s17-b', { at: fCfg, frames: 7, ease: 'crashIn', from: { scale: 1.45 } });
  }

  // S18: Skills, direção... e referência. (Daylight + 3 Fanned Google Cards)
  {
    const s = SC.s18, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fDir = fr(c.direcao), fRef = fr(c.referencia);

    M.cut(f0, { show: ['#world-daylight', '#s18'], hide: ['#world-dark-blue'] });
    M.hide('#s18', fEnd);

    M.enter('#s18-skills', { at: f0, frames: 7, ease: 'crashIn', from: { scale: 1.55 } });
    M.hide('#s18-skills', fRef);

    M.enter('#s18-ref', { at: fRef, frames: 7, ease: 'snapSettle', from: { y: -60, scale: 1.25 } });
    M.enter('#s18-c1', { at: f0 + 2, frames: 8, ease: 'popOver', from: { y: 190, scale: 0.78 } });
    M.enter('#s18-c2', { at: fDir, frames: 8, ease: 'popOver', from: { y: 190, scale: 0.78 } });
    M.enter('#s18-c3', { at: fRef, frames: 7, ease: 'popOver', from: { y: 190, scale: 0.78 } });
  }

  // S19: Só que configurar tudo isso do zero — skills, câmera, ritmo, áudio e 3D... dá trabalho...
  {
    const s = SC.s19, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fSk = fr(c.skills), fCam = fr(c.camera), fRit = fr(c.ritmo), fAud = fr(c.audio), f3d = fr(c.d3), fTrab = fr(c.trabalho);

    M.cut(f0, { show: ['#world-dark-blue', '#s19'], hide: ['#world-daylight'] });
    M.hide('#s19', fEnd);

    M.show('#s19-a', f0, fSk);
    M.enter('#s19-so', { at: f0, frames: 6, ease: 'crashIn', from: { scale: 1.55 } });
    M.enter('#s19-zero', { at: f0 + 12, frames: 6, ease: 'softLand', from: { y: 40 } });

    // Blue flash on skills/camera/ritmo/audio/3d
    M.show('#s19-bluebg', fSk, f3d + 10);
    M.enter('#s19-b', { at: fSk, frames: 6, ease: 'snapSettle', from: { scale: 1.4 } });
    M.hide('#s19-b', f3d + 10);

    // Back to Dark + Wall + Center Punch + Shatter on DÁ TRABALHO...
    M.show('#s19-wall', f3d + 10, fEnd);
    M.enter('#s19-top', { at: f3d + 10, frames: 6, ease: 'softLand', from: { y: -40 } });
    M.show('#s19-punch', f3d + 10, fEnd);

    M.kf('#s19-punch', 'scale', [
      [f3d + 10, 1.3], [f3d + 15, 1.0, 'snapSettle'],
      [fTrab, 1.65], [fTrab + 6, 1.05, 'crashIn'],
    ]);
  }

  // S20: principalmente se você tá começando do zero. (Daylight Breath)
  {
    const s = SC.s20, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fSe = fr(c.se), fCom = fr(c.comecando), fDo = fr(c.do);

    M.cut(f0, { show: ['#world-daylight', '#s20'], hide: ['#world-dark-blue'] });
    M.hide('#s20', fEnd);

    M.enter('#s20-princ', { at: f0, frames: 8, ease: 'whip', from: { x: 260 }, smear: { axis: 'x', px: 38, frames: 3 } });
    M.hide('#s20-princ', fSe);

    M.enter('#s20-sevoce', { at: fSe, frames: 6, ease: 'snapSettle', from: { scale: 1.35 } });
    M.hide('#s20-sevoce', fCom);

    M.enter('#s20-comec', { at: fCom, frames: 7, ease: 'snapSettle', from: { y: 60 } });
    M.hide('#s20-comec', fDo);

    M.enter('#s20-zero', { at: fDo, frames: 7, ease: 'snapSettle', from: { scale: 0.78 } });
    M.kf('#s20-0', 'opacity', [[fDo, 0.14], [fr(c.zero), 1.0, 'snapSettle']]);
  }

  // S21: Mas eu já montei esse fluxo inteiro rodando liso aqui no Antigravity — pronto pra criar nesse nível.
  {
    const s = SC.s21;
    const f0 = fr(s.start), fEnd = fr(s.end);

    M.cut(f0, { show: ['#world-dark-blue', '#s21'], hide: ['#world-daylight'] });
    M.hide('#s21', fEnd);

    M.enter('#s21-left1', { at: f0, frames: 8, ease: 'softLand', from: { x: -120 } });
  }

  // S22: Então já comenta FLUXO aqui embaixo que eu te mostro o fluxo completo! (@marcelo.vydo CTA)
  {
    const s = SC.s22, c = s.cues;
    const f0 = fr(s.start), fEnd = fr(s.end);
    const fCom = fr(c.comenta), fFlx = fr(c.fluxo), fMost = fr(c.mostro);

    M.cut(f0, { show: ['#world-dark-blue', '#s22'] });

    const cardWrap = M.wrap('#s22-card');
    M.enter('#s22-card', { at: f0, frames: 11, ease: 'snapSettle', from: { y: 80, scale: 0.92 } });
    M.drift(cardWrap, { prop: 'scale', from: 0.96, to: 1.035, start: f0 + 11, end: fEnd - 26 });
    M.drift('#world-dark-blue', { prop: 'scale', from: 1.0, to: 1.34, start: f0, end: fEnd - 26 });

    // Type "FLUXO" in the comment box right on cue, then cursor clicks Seguir + Send
    M.type('#s22-input', { at: fCom, style: 'fast', seed: 5, caret: '#s22-caret', caretGap: 4, caretOff: fFlx + 12 });

    const curPress = M.wrap('#s22-cursor');
    const followX = 1272, followY = 386;
    const sendX = 1248, sendY = 524;

    M.cursor('#s22-cursor', {
      keys: [
        [f0 + 4, 1380, 860, null, -12],
        [fCom, followX, followY, null, 0],
        [fFlx + 2, followX, followY, null, 0],
        [fMost - 6, sendX, sendY, null, -6],
      ],
      ease: 'glide',
    });

    M.press(curPress, '#s22-follow-btn', { at: fCom + 2, cursorDepth: 0.78, targetDepth: 0.88, lag: 1, frames: 3, hold: 2, release: true });
    M.press(curPress, '#s22-send', { at: fMost - 4, cursorDepth: 0.78, targetDepth: 0.88, lag: 1, frames: 3, hold: 2, release: true });

    M.enter('#s22-confirm', { at: fMost, frames: 8, ease: 'popOver', from: { y: 20, scale: 0.9 } });
  }

  // Deterministic Per-Frame State Renderer
  const elS04Tc = document.getElementById('s04-tc');
  const elS04Ph = document.getElementById('s04-playhead');
  const elS04Cube = document.getElementById('s04-cube');
  const elS11Sub = document.getElementById('s11-sub');
  const elS19Lines = Array.from(document.getElementById('s19-wall').children);
  const elS19Punch = document.getElementById('s19-punch');
  const elS21Sub = document.getElementById('s21-sub');
  const elS22Sub = document.getElementById('s22-sub');
  const elS22Follow = document.getElementById('s22-follow-btn');
  const pipShots = [1, 2, 3, 4, 5].map((i) => document.getElementById('pip-' + i));
  const elPipSq = document.getElementById('pip-sq');

  function renderSub(el, t, startIdx, endIdx) {
    const ws = B.words.slice(startIdx, endIdx + 1);
    const active = ws.findLastIndex((w) => t >= w.start);
    const winStart = active < 0 ? 0 : Math.floor(active / 6) * 6;
    const chunk = ws.slice(winStart, winStart + 6);
    el.innerHTML = chunk
      .map((w) =>
        t >= w.start && t <= w.end + 0.14
          ? `<span style="color:#3186ff">${w.word}</span>`
          : `<span>${w.word}</span>`
      )
      .join(' ');
  }

  const s21LineStart = B.words.findIndex((w) => w.start >= B.lines[20].start - 0.02);
  const s21LineEnd = B.words.findLastIndex((w) => w.end <= B.lines[20].end + 0.02);
  const s22LineStart = B.words.findIndex((w) => w.start >= B.lines[21].start - 0.02);
  const s22LineEnd = B.words.length - 1;

  function renderCustomState(t) {
    if (t >= SC.s04.start && t < SC.s04.end) {
      const dt = t - SC.s04.start;
      elS04Tc.textContent = `00:00:0${5 + Math.floor(dt)}:${String(Math.floor(dt * 30) % 30).padStart(2, '0')}`;
      elS04Ph.style.left = (160 + dt * 195).toFixed(1) + 'px';
      elS04Cube.style.transform = `rotate(${(dt * 95).toFixed(1)}deg) scale(${(0.85 + 0.25 * Math.sin(dt * 4)).toFixed(3)})`;
    }

    if (t >= SC.s11.start && t < SC.s11.end) {
      const c = SC.s11.cues;
      elS11Sub.style.color = t >= c.fly ? '#ffffff' : '#16181d';
      if (t < c.vire3d) elS11Sub.textContent = 'olha esse quadrado aqui:';
      else if (t < c.fly) elS11Sub.textContent = 'quero que ele vire 3D,';
      else if (t < c.explode) elS11Sub.textContent = 'perca a gravidade...';
      else elS11Sub.textContent = 'e exploda!';
    }

    if (t >= SC.s19.start && t < SC.s19.end) {
      const c = SC.s19.cues;
      if (t >= c.d3 + 0.3) {
        const isTrab = t >= c.trabalho;
        elS19Punch.textContent = isTrab ? 'DÁ TRABALHO...' : 'PRA SAIR IGUAL';
        elS19Punch.style.color = isTrab ? '#3186ff' : '#ffffff';
      }
      const dtWall = t - (c.d3 + 0.3);
      const shDt = t >= c.trabalho ? t - c.trabalho : 0;
      const uSh = Math.min(1, shDt / 0.45);
      elS19Lines.forEach((ln, idx) => {
        if (shDt <= 0) {
          ln.style.transform = `translate3d(0, ${(-dtWall * 26).toFixed(1)}px, 0)`;
          ln.style.opacity = '1';
        } else {
          const dirX = ((idx % 5) - 2) * 165 * uSh;
          const dirY = ((idx % 7) - 3) * 125 * uSh;
          const rot = (idx % 2 === 0 ? 1 : -1) * (8 + (idx % 6) * 5) * uSh;
          ln.style.transform = `translate3d(${dirX.toFixed(1)}px, ${dirY.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`;
          ln.style.opacity = (1 - uSh * 0.72).toFixed(3);
        }
      });
    }

    if (t >= SC.s21.start && t < SC.s21.end) {
      const dt = t - SC.s21.start;
      const dur = SC.s21.end - SC.s21.start;
      const slot = Math.min(4, Math.floor((dt / dur) * 5));
      pipShots.forEach((p, idx) => { p.style.visibility = idx === slot ? '' : 'hidden'; });
      elPipSq.style.transform = `rotate(${(dt * 32).toFixed(1)}deg) scale(${(0.9 + 0.25 * Math.sin(dt * 3)).toFixed(3)})`;
      renderSub(elS21Sub, t, s21LineStart, s21LineEnd);
    }

    if (t >= SC.s22.start) {
      const followed = t >= SC.s22.cues.comenta + 4 / FPS;
      elS22Follow.textContent = followed ? 'Seguindo ✓' : 'Seguir';
      elS22Follow.style.background = followed ? '#dbeafe' : '#e8ecf4';
      elS22Follow.style.color = followed ? '#1d4ed8' : '#111827';
      renderSub(elS22Sub, t, s22LineStart, s22LineEnd);
    }
  }

  if (window.__initFX) {
    window.__initFX(document.getElementById('fx-back'), document.getElementById('fx-front'));
  }

  const baseSeek = window.__seek;
  window.__seek = function (t) {
    baseSeek(t);
    renderCustomState(t);
    if (window.__drawFX) window.__drawFX(t);
    if (window.__draw3D) window.__draw3D(t);
  };

  window.__ready = Promise.all([Motion.loaded(), window.__glReady || Promise.resolve()]).then(() => {
    window.__seek(0);
  });
})();
