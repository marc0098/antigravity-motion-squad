import * as THREE from './runtime/hero3d/vendor/three.module.js';
import { RoomEnvironment } from './runtime/hero3d/vendor/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from './runtime/hero3d/vendor/addons/geometries/RoundedBoxGeometry.js';

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a, b, u) => a + (b - a) * u;
const easeOutCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp01(x)));
const easeInOutCubic = (x) => {
  x = clamp01(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const easeOutBack = (x) => {
  x = clamp01(x);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSoftShadowTexture() {
  const cv = document.createElement('canvas');
  cv.width = 256;
  cv.height = 256;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  g.addColorStop(0, 'rgba(10,20,45,0.48)');
  g.addColorStop(0.45, 'rgba(10,20,45,0.20)');
  g.addColorStop(0.78, 'rgba(10,20,45,0.05)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(cv);
}

function makeQuestionMarkGroup() {
  const grp = new THREE.Group();
  const s = new THREE.Shape();
  s.moveTo(-0.88, 0.72);
  s.bezierCurveTo(-0.86, 1.48, -0.45, 1.88, 0.14, 1.88);
  s.bezierCurveTo(0.80, 1.88, 1.18, 1.48, 1.18, 0.92);
  s.bezierCurveTo(1.18, 0.38, 0.85, 0.12, 0.45, -0.14);
  s.bezierCurveTo(0.28, -0.26, 0.25, -0.42, 0.25, -0.66);
  s.lineTo(-0.28, -0.66);
  s.bezierCurveTo(-0.28, -0.22, -0.18, 0.04, 0.12, 0.28);
  s.bezierCurveTo(0.42, 0.50, 0.56, 0.66, 0.56, 0.90);
  s.bezierCurveTo(0.56, 1.18, 0.36, 1.36, 0.10, 1.36);
  s.bezierCurveTo(-0.18, 1.36, -0.34, 1.14, -0.36, 0.72);
  s.closePath();

  const extrudeGeo = new THREE.ExtrudeGeometry(s, {
    depth: 0.58,
    bevelEnabled: true,
    bevelThickness: 0.13,
    bevelSize: 0.09,
    bevelSegments: 5,
    curveSegments: 28,
  });
  extrudeGeo.center();

  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#091326'),
    roughness: 0.14,
    metalness: 0.28,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.7,
  });

  const bodyMesh = new THREE.Mesh(extrudeGeo, mat);
  bodyMesh.position.set(0, 0.32, 0);

  const dotCap = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 18), mat);
  dotCap.scale.set(1, 1, 0.85);
  dotCap.position.set(-0.02, -1.25, 0);

  grp.add(bodyMesh, dotCap);
  return grp;
}

function makeNasaServersGroup() {
  const grp = new THREE.Group();
  const rng = mulberry32(2026);

  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(14, 96, 48),
    new THREE.MeshStandardMaterial({ color: '#04070e', roughness: 0.9, metalness: 0.12 })
  );
  planet.position.set(0, -15.9, -2.5);
  grp.add(planet);

  // Google Antigravity blue glowing planetary horizon
  const arc = new THREE.Mesh(
    new THREE.TorusGeometry(14.03, 0.06, 16, 160),
    new THREE.MeshBasicMaterial({ color: '#3186ff', transparent: true, opacity: 0.96 })
  );
  arc.position.copy(planet.position);
  grp.add(arc);

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(14.08, 0.26, 16, 160),
    new THREE.MeshBasicMaterial({ color: '#1a73e8', transparent: true, opacity: 0.34 })
  );
  halo.position.copy(planet.position);
  grp.add(halo);

  const orbit1 = new THREE.Mesh(
    new THREE.TorusGeometry(7.2, 0.022, 12, 180),
    new THREE.MeshBasicMaterial({ color: '#3186ff', transparent: true, opacity: 0.84 })
  );
  orbit1.position.set(0, -2.1, -1.0);
  orbit1.rotation.set(1.36, 0.18, -0.14);
  grp.add(orbit1);

  const orbit2 = new THREE.Mesh(
    new THREE.TorusGeometry(8.9, 0.015, 10, 180),
    new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.24 })
  );
  orbit2.position.set(0, -1.8, -1.6);
  orbit2.rotation.set(1.42, -0.22, 0.10);
  grp.add(orbit2);

  const specs = [
    { x: -3.75, y: -0.6, z: -1.4, w: 1.05, h: 4.3, d: 1.05 },
    { x: -1.85, y: -0.2, z: -0.4, w: 1.15, h: 4.9, d: 1.15 },
    { x: 0.15,  y: -0.45, z: 0.3, w: 1.10, h: 4.5, d: 1.10 },
    { x: 2.05,  y: -0.1, z: -0.6, w: 1.20, h: 5.1, d: 1.15 },
    { x: 3.85,  y: -0.65, z: -1.5, w: 1.00, h: 4.2, d: 1.00 },
  ];

  const rackMat = new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.40, metalness: 0.72 });
  const edgeMat = new THREE.LineBasicMaterial({ color: '#1e428a', transparent: true, opacity: 0.65 });
  const ledColors = ['#3186ff', '#00b95c', '#fbbc04', '#ffffff'];
  const leds = [];
  const ledGeo = new THREE.BoxGeometry(0.085, 0.042, 0.03);

  specs.forEach((sp, idx) => {
    const rack = new THREE.Group();
    rack.position.set(sp.x, sp.y, sp.z);
    rack.rotation.y = (idx - 2) * -0.14;

    const boxGeo = new RoundedBoxGeometry(sp.w, sp.h, sp.d, 2, 0.03);
    rack.add(new THREE.Mesh(boxGeo, rackMat));
    rack.add(new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo, 20), edgeMat));

    const rows = 14, cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rng() < 0.42) continue;
        const pick = rng();
        const colHex = pick < 0.50 ? ledColors[0] : pick < 0.68 ? ledColors[1] : pick < 0.82 ? ledColors[2] : ledColors[3];
        const ledMat = new THREE.MeshBasicMaterial({ color: colHex, transparent: true, opacity: 0.92 });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(
          (c / (cols - 1) - 0.5) * (sp.w * 0.72),
          (r / (rows - 1) - 0.42) * (sp.h * 0.80),
          sp.d * 0.506
        );
        rack.add(led);
        leds.push({ mat: ledMat, freq: 3.0 + rng() * 9.0, phase: rng() * Math.PI * 2, base: 0.9 });
      }
    }
    grp.add(rack);
  });

  return { grp, orbit1, orbit2, leds };
}

function makeCubeExplosionGroup() {
  const grp = new THREE.Group();

  const cubeGeo = new RoundedBoxGeometry(1.58, 1.58, 1.58, 3, 0.025);
  const cubeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a73e8'),
    emissive: new THREE.Color('#145ec4'),
    emissiveIntensity: 0.45,
    roughness: 0.54,
    metalness: 0.04,
    envMapIntensity: 0.14,
  });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  grp.add(cube);

  const shadowMat = new THREE.MeshBasicMaterial({
    map: makeSoftShadowTexture(),
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 3.8), shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(0.18, -1.42, -0.15);
  grp.add(shadowPlane);

  // 140 sharp shards in the 4 Google Antigravity colors + crisp white
  const shardsGrp = new THREE.Group();
  shardsGrp.visible = false;
  grp.add(shardsGrp);

  const rng = mulberry32(2027);
  const baseGeos = [
    new THREE.TetrahedronGeometry(0.16, 0),
    new THREE.ConeGeometry(0.13, 0.28, 3),
    new THREE.BoxGeometry(0.22, 0.14, 0.06),
  ];

  const palette = [
    { color: '#3186ff', emissive: '#0c4eb8', ei: 0.42 }, // Google Blue
    { color: '#3186ff', emissive: '#0c4eb8', ei: 0.42 },
    { color: '#fc413d', emissive: '#991b1b', ei: 0.38 }, // Google Red
    { color: '#fbbc04', emissive: '#a16207', ei: 0.35 }, // Google Yellow
    { color: '#00b95c', emissive: '#065f46', ei: 0.35 }, // Google Green
    { color: '#ffffff', emissive: '#667799', ei: 0.30 }, // Crisp White
  ];

  const mats = palette.map(
    (p) => new THREE.MeshStandardMaterial({
      color: p.color,
      emissive: p.emissive,
      emissiveIntensity: p.ei,
      roughness: 0.26,
      metalness: 0.20,
    })
  );

  const shards = [];
  for (let i = 0; i < 140; i++) {
    const geo = baseGeos[i % baseGeos.length];
    const mat = mats[Math.floor(rng() * mats.length)];
    const m = new THREE.Mesh(geo, mat);

    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const speed = 2.6 + rng() * 6.2;
    const nearCam = rng() < 0.24;

    const vx = Math.sin(phi) * Math.cos(theta) * speed * (nearCam ? 1.15 : 1.0);
    const vy = Math.cos(phi) * speed * 0.72 + (rng() - 0.35) * 1.4;
    const vz = nearCam ? 1.8 + rng() * 4.5 : Math.sin(phi) * Math.sin(theta) * speed * 0.85;

    m.scale.set(0.55 + rng() * 1.55, 0.45 + rng() * 1.45, 0.45 + rng() * 1.25);
    shardsGrp.add(m);
    shards.push({
      mesh: m, vx, vy, vz,
      rx0: rng() * Math.PI * 2, ry0: rng() * Math.PI * 2, rz0: rng() * Math.PI * 2,
      wx: (rng() - 0.5) * 10, wy: (rng() - 0.5) * 10, wz: (rng() - 0.5) * 10,
      grav: 0.35 + rng() * 0.75,
    });
  }

  return { grp, cube, cubeMat, shadowPlane, shadowMat, shardsGrp, shards };
}

window.__init3D = async function init3D(canvas) {
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(1);
  renderer.setSize(1920, 1080, false);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1920 / 1080, 0.1, 100);
  camera.position.set(0, 0, 10);

  const amb = new THREE.AmbientLight('#ffffff', 0.4);
  const key = new THREE.DirectionalLight('#ffffff', 2.4);
  key.position.set(-4.5, 6.5, 7.5);
  const fill = new THREE.DirectionalLight('#749bff', 0.65);
  fill.position.set(5.5, -2.5, 5.0);
  const rim = new THREE.DirectionalLight('#3186ff', 3.6);
  rim.position.set(5.0, 2.0, -6.0);
  scene.add(amb, key, fill, rim);

  const qMark = makeQuestionMarkGroup();
  const nasa = makeNasaServersGroup();
  const hero = makeCubeExplosionGroup();
  scene.add(qMark, nasa.grp, hero.grp);

  qMark.visible = nasa.grp.visible = hero.grp.visible = true;
  renderer.render(scene, camera);
  qMark.visible = nasa.grp.visible = hero.grp.visible = false;
  canvas.style.visibility = 'hidden';

  window.__draw3D = function draw3D(t) {
    const sc = window.BEATS && window.BEATS.scenes;
    if (!sc) return;

    const fNow = Math.round(t * 30);
    const fr = (sec) => Math.round(sec * 30);
    const inS06 = fNow >= fr(sc.s06.start) && fNow < fr(sc.s06.end);
    const inS09 = fNow >= fr(sc.s09.start) && fNow < fr(sc.s09.end);
    const inS11_12 = fNow >= fr(sc.s11.start) && fNow < fr(sc.s12.end);

    if (!inS06 && !inS09 && !inS11_12) {
      if (canvas.style.visibility !== 'hidden') canvas.style.visibility = 'hidden';
      return;
    }

    if (canvas.style.visibility !== '') canvas.style.visibility = '';
    qMark.visible = inS06;
    nasa.grp.visible = inS09;
    hero.grp.visible = inS11_12;

    if (inS06) {
      const dt = t - sc.s06.start;
      const dur = Math.max(0.2, sc.s06.end - sc.s06.start);
      const u = clamp01(dt / dur);
      const pop = easeOutBack(clamp01(dt / 0.35));

      camera.fov = 34;
      camera.position.set(0, 0, 10.5);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      amb.intensity = 0.35;
      key.intensity = 3.2;
      key.position.set(-3, 7, 8);
      rim.intensity = 4.4;
      rim.color.set('#749bff');

      qMark.position.set(2.38, -0.52, 0);
      qMark.scale.setScalar(lerp(0.55, 1.04, pop));
      qMark.rotation.set(
        lerp(0.28, -0.08, easeOutCubic(u)),
        lerp(-0.55, 0.38, easeOutCubic(u)),
        lerp(-0.28, -0.14, easeOutCubic(u))
      );
    } else if (inS09) {
      const dt = t - sc.s09.start;
      const dur = Math.max(0.5, sc.s09.end - sc.s09.start);
      const u = clamp01(dt / dur);

      camera.fov = 38;
      camera.position.set(lerp(-0.15, 0.12, u), lerp(0.15, 0.42, u), lerp(11.4, 9.6, easeOutCubic(u)));
      camera.lookAt(0, -0.15, 0);
      camera.updateProjectionMatrix();

      amb.intensity = 0.25;
      key.intensity = 1.6;
      key.position.set(-4, 5, 6);
      rim.intensity = 4.0;
      rim.color.set('#3186ff');

      nasa.orbit1.rotation.z = -0.14 + u * 0.24;
      nasa.orbit2.rotation.z = 0.10 - u * 0.18;
      for (let i = 0; i < nasa.leds.length; i++) {
        const l = nasa.leds[i];
        const pulse = 0.45 + 0.55 * Math.sin(t * l.freq + l.phase);
        l.mat.opacity = l.base * (pulse > 0.3 ? 1.0 : 0.22);
      }
    } else if (inS11_12) {
      const c11 = sc.s11.cues;
      const tStart = sc.s11.start;
      const tVire = c11.vire3d;
      const tFly = c11.fly;
      const tExp = c11.explode;

      camera.fov = 28;
      camera.position.set(0, 0.05, 11.2);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      if (t < tFly) {
        hero.cube.visible = true;
        hero.shardsGrp.visible = false;

        const uGrow = easeOutCubic(clamp01((t - tStart) / Math.max(0.25, tVire - tStart)));
        const u3D = easeOutCubic(clamp01((t - tVire) / Math.max(0.45, tFly - tVire - 0.08)));

        hero.cubeMat.color.set('#1a73e8');
        hero.cubeMat.emissive.set('#1a73e8');
        hero.cubeMat.emissiveIntensity = lerp(0.56, 0.0, u3D);
        hero.cubeMat.envMapIntensity = lerp(0.0, 0.14, u3D);
        amb.intensity = lerp(0.0, 0.44, u3D);
        key.intensity = lerp(0.0, 2.25, u3D);
        key.position.set(-4.0, 7.5, 5.5);
        fill.intensity = lerp(0.0, 0.45, u3D);
        rim.intensity = lerp(0.0, 1.3, u3D);
        rim.color.set('#749bff');

        const baseScale = lerp(0.82, 1.32, uGrow) * lerp(1.0, 1.08, u3D);
        hero.cube.scale.setScalar(baseScale);
        hero.cube.position.set(0, lerp(0.05, 0.15, u3D), 0);
        hero.cube.rotation.set(
          lerp(0, 0.44, u3D),
          lerp(0, -0.72, u3D),
          lerp(0, 0.14, u3D)
        );

        hero.shadowPlane.visible = u3D > 0.02;
        hero.shadowMat.opacity = 0.62 * u3D;
        hero.shadowPlane.scale.setScalar(lerp(0.65, 1.15, u3D));
      } else if (t < tExp) {
        // Zero-gravity float on Dark Space
        hero.cube.visible = true;
        hero.shardsGrp.visible = false;
        hero.shadowPlane.visible = false;

        const dtFly = t - tFly;
        const durFly = Math.max(0.15, tExp - tFly);
        const uf = clamp01(dtFly / durFly);

        hero.cubeMat.color.set('#1a73e8');
        hero.cubeMat.emissive.set('#0c3b80');
        hero.cubeMat.emissiveIntensity = 0.05;
        amb.intensity = 0.28;
        key.intensity = 1.35;
        key.position.set(-3.5, 6.0, 6.5);
        fill.intensity = 0.25;
        rim.intensity = 3.2;
        rim.color.set('#749bff');

        hero.cube.scale.setScalar(lerp(1.38, 1.52, easeOutCubic(uf)));
        hero.cube.position.set(
          Math.sin(uf * 2.5) * 0.18,
          lerp(-0.15, 0.65, easeInOutCubic(uf)),
          lerp(0, 0.8, uf)
        );
        hero.cube.rotation.set(
          0.44 + dtFly * 4.2,
          -0.72 + dtFly * 5.6,
          0.14 - dtFly * 2.4
        );
      } else {
        // 140 4-Color Google Shards Explosion
        hero.cube.visible = false;
        hero.shadowPlane.visible = false;
        hero.shardsGrp.visible = true;

        const dt = t - tExp;
        const burst = easeOutExpo(clamp01(dt / 0.55));
        const slowDrift = Math.max(0, dt - 0.3) * 0.42;
        const distK = burst * 0.78 + slowDrift * 0.26;

        amb.intensity = 0.62;
        key.intensity = 3.0;
        rim.intensity = 4.2;
        rim.color.set('#3186ff');

        for (let i = 0; i < hero.shards.length; i++) {
          const sh = hero.shards[i];
          sh.mesh.position.set(
            sh.vx * distK,
            0.45 + sh.vy * distK - 0.10 * sh.grav * dt * dt,
            sh.vz * distK
          );
          sh.mesh.rotation.set(
            sh.rx0 + sh.wx * (burst * 0.45 + slowDrift * 0.25),
            sh.ry0 + sh.wy * (burst * 0.45 + slowDrift * 0.25),
            sh.rz0 + sh.wz * (burst * 0.45 + slowDrift * 0.25)
          );
        }
      }
    }

    renderer.render(scene, camera);
  };
};
