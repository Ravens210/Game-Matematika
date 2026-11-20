/* =====================================================================
   CORE: Konstanta, Dunia 3D Kota, NPC, Pemain, Kontrol (keyboard/mouse/joystick)
   ===================================================================== */
const $ = id => document.getElementById(id);
const TOTAL_COINS = 14, R = 0.8, WORLD = 190;
const WALK = 16, RUN = 28;

/* =====================================================================
   BAGIAN 1: DUNIA 3D UTAMA (JELAJAH KOTA)
   ===================================================================== */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x78b7e6);
scene.fog = new THREE.Fog(0x9cc9ec, 70, 230);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
$('game').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x4a8f3a, 0.85));
const sun = new THREE.DirectionalLight(0xffffff, 0.6);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, far: 300 });
scene.add(sun, sun.target);

const M = c => new THREE.MeshLambertMaterial({ color: c });
const hex = n => '#' + n.toString(16).padStart(6, '0');
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const colliders = [];

function box(w, h, d, c, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(c));
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  scene.add(m);
  return m;
}
const blocked = (x, z, m = 0) => colliders.some(c => Math.abs(x - c.x) < c.hw + m && Math.abs(z - c.z) < c.hd + m);

/* ---------- Tanah & Jalan ---------- */
const ground = new THREE.Mesh(new THREE.PlaneGeometry(420, 420), M(0x3fbf3f));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

box(12, 0.1, 420, 0x6b6a73, 0, 0.05, 0);
box(420, 0.1, 12, 0x6b6a73, 0, 0.06, 0);
for (let i = -200; i <= 200; i += 8) {
  if (Math.abs(i) < 8) continue;
  box(0.4, 0.02, 3, 0xe8c800, 0, 0.12, i);
  box(3, 0.02, 0.4, 0xe8c800, i, 0.13, 0);
}

/* ---------- Kota Mainan: Bangunan + NPC ---------- */
const npcs = [];
let nearNpc = null;

function label(text, w, h, bg, fg, font) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = Math.round(512 * h / w);
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, c.width / 2, c.height / 2 + 3);
  return new THREE.CanvasTexture(c);
}

function makeBuilding(o) {
  const { x, z, color, accent, dir, sign, npc } = o, w = 16, d = 20, h = 14;
  const xf = x + dir * w / 2;
  box(w, h, d, color, x, h / 2, z);
  box(w + 1, .8, d + 1, accent, x, h + .4, z);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) =>
    box(2, 1.4, 2, accent, x + a * (w / 2 - .5), h + 1.5, z + b * (d / 2 - .5)));
  box(.3, 6, 4, 0x3b2a1a, xf + dir * .15, 3, z);
  box(.3, 1.2, d, accent, xf + dir * .15, .6, z);
  [-6, 6].forEach(dz => box(.3, 3, 3, 0xbfe6ff, xf + dir * .15, 4, z + dz));
  box(3, .4, 6, accent, xf + dir * 1.5, 6.6, z);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(11, 2.6),
    new THREE.MeshBasicMaterial({ map: label(sign, 11, 2.6, hex(accent), '#ffffff', '700 76px system-ui, sans-serif') }));
  sg.position.set(xf + dir * .4, 10.5, z);
  sg.rotation.y = dir * Math.PI / 2;
  scene.add(sg);
  colliders.push({ x, z, hw: w / 2, hd: d / 2 });

  box(2.4, 2.4, 2.4, accent, xf + dir * 6, 1.2, z + 7);
  colliders.push({ x: xf + dir * 6, z: z + 7, hw: 1.2, hd: 1.2 });
  box(1.2, 1.2, 5, 0xc9b27a, xf + dir * 7, .6, z - 8);
  colliders.push({ x: xf + dir * 7, z: z - 8, hw: .6, hd: 2.5 });

  const ch = makeChar(npc.shirt, npc.pants);
  const hat = new THREE.Mesh(new THREE.BoxGeometry(1.5, .45, 1.5), M(accent));
  hat.position.y = 5.4; hat.castShadow = true; ch.g.add(hat);
  ch.g.position.set(xf + dir * 5, 0, z - 5);
  ch.g.rotation.y = dir * Math.PI / 2;
  const tc = document.createElement('canvas'); tc.width = 512; tc.height = 128;
  const tg = tc.getContext('2d');
  tg.fillStyle = 'rgba(20,22,28,.82)'; tg.fillRect(0, 0, 512, 128);
  tg.fillStyle = '#fff'; tg.font = '700 56px system-ui, sans-serif'; tg.textAlign = 'center'; tg.textBaseline = 'middle';
  tg.fillText(npc.name, 256, 66);
  const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(tc) }));
  tag.scale.set(6, 1.5, 1); tag.position.y = 7.6; ch.g.add(tag);
  scene.add(ch.g);
  colliders.push({ x: ch.g.position.x, z: ch.g.position.z, hw: .8, hd: .8 });
  npcs.push({ ch, name: npc.name, say: npc.say, base: dir * Math.PI / 2, t: Math.random() * 6, i: 0, isRedCommander: !!npc.isRedCommander, isBlueCommander: !!npc.isBlueCommander });
}
function coinHint() {
  if (!coins.length) return 'Semua koin sudah kamu temukan. Hebat!';
  let b = coins[0], bd = 1e9;
  for (const c of coins) { const d = Math.hypot(c.position.x - pos.x, c.position.z - pos.z); if (d < bd) { bd = d; b = c; } }
  const dx = b.position.x - pos.x, dz = b.position.z - pos.z;
  const arah = Math.abs(dz) > Math.abs(dx) ? (dz < 0 ? 'utara' : 'selatan') : (dx > 0 ? 'timur' : 'barat');
  return `Koin terdekat ada di arah ${arah}, sekitar ${Math.round(bd)} meter dari sini.`;
}
makeBuilding({ x: -22, z: -20, dir: 1, color: 0x2f6fe0, accent: 0x1b3f8a, sign: 'Markas Biru',
  npc: { name: 'Komandan Biru', shirt: 0x2f6fe0, pants: 0x1b2a55, isBlueCommander: true, say: () => [
    'Selamat datang di Markas Biru! Di dalam ada Arena Grafik SPLDV (5 Level) berlatar Koordinat Kartesius.',
    'Kumpulkan 2 bola kristal di tiap ruangan, pilih titik koordinat altarnya, lalu tekan tombol di titik potong kedua garis!'] } });

makeBuilding({ x: 22, z: -20, dir: -1, color: 0xd8362f, accent: 0x8a1f1b, sign: 'Markas Merah',
  npc: { name: 'Komandan Merah', shirt: 0xd8362f, pants: 0x551818, isRedCommander: true, say: () => [
    'Selamat datang di Markas Merah! Masuk lewat pintu markas di belakangku untuk berlatih soal Eksponen.',
    'Gunakan pelontar cat untuk menembak balon dengan nilai eksponen yang benar. Ada 5 level menantang!',
    coinHint()] } });

makeBuilding({ x: -22, z: -52, dir: 1, color: 0xffb020, accent: 0xb36b00, sign: 'Toko Blaster Busa',
  npc: { name: 'Penjual Blaster', shirt: 0xffb020, pants: 0x5a3a00, say: () => [
    'Pelontar cat warna-warni sudah terpasang di Arena Markas Merah!',
    'Masuk ke pintu Markas Merah untuk menguji ketepatan berhitung eksponenmu!'] } });

makeBuilding({ x: 22, z: -52, dir: -1, color: 0x2fa84f, accent: 0x1d6b32, sign: 'Pos Penjaga',
  npc: { name: 'Penjaga Pos', shirt: 0x2fa84f, pants: 0x1f3d28, say: () => [
    'Tahan klik kanan atau Shift untuk berlari.',
    'Tekan Spasi untuk melompat. Dekati pintu Markas Merah dan tekan E untuk masuk!'] } });

/* Penanda Portal Pintu Markas Merah */
const redPortalRing = new THREE.Mesh(
  new THREE.TorusGeometry(2.3, 0.16, 12, 32),
  new THREE.MeshBasicMaterial({ color: 0xffc400 })
);
redPortalRing.position.set(13.6, 3.1, -20);
redPortalRing.rotation.y = Math.PI / 2;
scene.add(redPortalRing);

const portalBannerTex = label('🎯 ARENA BALON EKSPONEN', 10, 2.2, '#ffc400', '#1b1b1b', '800 56px system-ui, sans-serif');
const portalBanner = new THREE.Sprite(new THREE.SpriteMaterial({ map: portalBannerTex }));
portalBanner.scale.set(7.5, 1.65, 1);
portalBanner.position.set(12.2, 6.2, -20);
scene.add(portalBanner);

/* Penanda Portal Pintu Markas Biru */
const bluePortalRing = new THREE.Mesh(
  new THREE.TorusGeometry(2.3, 0.16, 12, 32),
  new THREE.MeshBasicMaterial({ color: 0x3bc9db })
);
bluePortalRing.position.set(-13.6, 3.1, -20);
bluePortalRing.rotation.y = Math.PI / 2;
scene.add(bluePortalRing);

const bluePortalBannerTex = label('📐 ARENA GRAFIK SPLDV', 10, 2.2, '#3bc9db', '#0b1c34', '800 56px system-ui, sans-serif');
const bluePortalBanner = new THREE.Sprite(new THREE.SpriteMaterial({ map: bluePortalBannerTex }));
bluePortalBanner.scale.set(7.5, 1.65, 1);
bluePortalBanner.position.set(-12.2, 6.2, -20);
scene.add(bluePortalBanner);

/* Tombol bicara NPC */
const talkBtn = document.createElement('div');
talkBtn.style.cssText = 'position:fixed;left:50%;bottom:58px;transform:translateX(-50%);display:none;background:#ffc400;color:#1b1b1b;font:700 14px system-ui,sans-serif;padding:9px 18px;border-radius:999px;cursor:pointer;z-index:6;box-shadow:0 6px 18px rgba(0,0,0,.3)';
talkBtn.addEventListener('click', () => talk());
document.body.appendChild(talkBtn);

let nearRedDoor = false;
let nearBlueDoor = false;
$('redDoorBtn').addEventListener('click', () => openExponentMiniGame());
$('blueDoorBtn').addEventListener('click', () => openBlueMiniGame());

function talk() {
  if (!nearNpc || !panel.hidden || isFpsActive || isBlueActive) return;
  const n = nearNpc, lines = n.say();
  $('pTitle').textContent = n.name;
  let html = `<p>${lines[n.i++ % lines.length]}</p>`;
  if (n.isRedCommander) {
    html += `<button class="opt primary" id="startArenaFromNpc">🎯 Masuk Arena Balon Eksponen (5 Level)</button>`;
  }
  if (n.isBlueCommander) {
    html += `<button class="opt primary" id="startBlueArenaFromNpc" style="background:#1c7ed6;border-color:#66d9e8;">📐 Masuk Arena Grafik SPLDV (5 Level)</button>`;
  }
  pBody.innerHTML = html;
  const startBtn = $('startArenaFromNpc');
  if (startBtn) {
    startBtn.onclick = () => {
      panel.hidden = true;
      openExponentMiniGame();
    };
  }
  const startBlueBtn = $('startBlueArenaFromNpc');
  if (startBlueBtn) {
    startBlueBtn.onclick = () => {
      panel.hidden = true;
      openBlueMiniGame();
    };
  }
  panel.hidden = false;
  if (document.pointerLockElement) document.exitPointerLock();
}

function updateNPCs(dt) {
  nearNpc = null; let best = 9;
  for (const n of npcs) {
    const p = n.ch.g.position, d = Math.hypot(pos.x - p.x, pos.z - p.z);
    n.t += dt;
    const target = d < 22 ? Math.atan2(pos.x - p.x, pos.z - p.z) : n.base;
    let a = target - n.ch.g.rotation.y; a = Math.atan2(Math.sin(a), Math.cos(a));
    n.ch.g.rotation.y += a * Math.min(1, dt * 6);
    n.ch.armR.p.rotation.z = d < 16 ? 2.7 + Math.sin(n.t * 6) * .3 : 0;
    n.ch.armL.p.rotation.x = Math.sin(n.t * 1.5) * .08;
    if (d < best) { best = d; nearNpc = n; }
  }
  talkBtn.style.display = nearNpc ? 'block' : 'none';
  if (nearNpc) talkBtn.textContent = `Tekan F · bicara dengan ${nearNpc.name}`;

  /* Deteksi jarak pemain ke pintu Markas Merah (x: 14, z: -20) */
  const distToRedDoor = Math.hypot(pos.x - 13.5, pos.z - (-20));
  nearRedDoor = distToRedDoor < 5.2;
  $('redDoorBtn').style.display = nearRedDoor ? 'block' : 'none';

  /* Deteksi jarak pemain ke pintu Markas Biru (x: -14, z: -20) */
  const distToBlueDoor = Math.hypot(pos.x - (-13.5), pos.z - (-20));
  nearBlueDoor = distToBlueDoor < 5.2;
  $('blueDoorBtn').style.display = nearBlueDoor ? 'block' : 'none';
}

/* Bangunan kota tambahan & pepohonan */
for (let i = 0; i < 9; i++) {
  const sx = rnd() < .5 ? -1 : 1, sz = rnd() < .5 ? -1 : 1;
  const x = sx * (30 + rnd() * 110), z = sz * (30 + rnd() * 110);
  const w = 14 + rnd() * 12, h = 8 + rnd() * 16, d = 14 + rnd() * 12;
  if (blocked(x, z, 12)) continue;
  box(w, h, d, [0x55555e, 0x6d7d99, 0x8c6f5a][i % 3], x, h / 2, z);
  colliders.push({ x, z, hw: w / 2, hd: d / 2 });
}

const trunkG = new THREE.CylinderGeometry(0.8, 1, 6, 8), leafG = new THREE.SphereGeometry(3.6, 14, 12);
const trunkM = M(0x6b3f23), leafM = M(0x1e8a2e);
for (let n = 0, tries = 0; n < 85 && tries < 600; tries++) {
  const x = (rnd() - .5) * 360, z = (rnd() - .5) * 360;
  if (Math.abs(x) < 12 || Math.abs(z) < 12 || blocked(x, z, 3)) continue;
  const t = new THREE.Mesh(trunkG, trunkM); t.position.set(x, 3, z);
  const l = new THREE.Mesh(leafG, leafM); l.position.set(x, 9, z); l.scale.y = .9;
  t.castShadow = l.castShadow = true;
  scene.add(t, l);
  colliders.push({ x, z, hw: 1, hd: 1 });
  n++;
}

for (let z = -180; z <= 180; z += 30) {
  if (Math.abs(z) < 10) continue;
  box(0.6, 15, 0.6, 0x7a5030, 9, 7.5, z);
  box(5, 0.4, 0.4, 0x7a5030, 9, 13.5, z);
  colliders.push({ x: 9, z, hw: .4, hd: .4 });
}

/* Koin */
const coins = [];
const coinG = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 20), coinM = new THREE.MeshLambertMaterial({ color: 0xffc400, emissive: 0x7a5a00 });
const beamG = new THREE.CylinderGeometry(0.5, 0.5, 14, 10), beamM = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: .28 });
for (let n = 0; n < TOTAL_COINS;) {
  const x = (rnd() - .5) * 240, z = (rnd() - .5) * 240;
  if (blocked(x, z, 3) || (Math.abs(x) < 20 && Math.abs(z) < 30)) continue;
  const g = new THREE.Group(), c = new THREE.Mesh(coinG, coinM);
  c.rotation.x = Math.PI / 2; c.position.y = 2;
  const b = new THREE.Mesh(beamG, beamM); b.position.y = 7;
  g.add(c, b); g.position.set(x, 0, z); g.userData.disc = c;
  scene.add(g); coins.push(g); n++;
}

/* Karakter Blok */
function makeChar(shirt, pants, skin = 0xf5cd30) {
  const g = new THREE.Group();
  const mk = (w, h, d, c, x, y, z) => {
    const p = new THREE.Group(); p.position.set(x, y, z);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(c));
    m.position.y = -h / 2; m.castShadow = true; p.add(m); g.add(p);
    return { p, m };
  };
  const legL = mk(1, 2, 1, pants, -.5, 2, 0), legR = mk(1, 2, 1, pants, .5, 2, 0);
  const torso = mk(2, 2, 1, shirt, 0, 4, 0);
  const armL = mk(1, 2, 1, skin, -1.5, 4, 0), armR = mk(1, 2, 1, skin, 1.5, 4, 0);
  const head = mk(1.2, 1.2, 1.2, skin, 0, 5.2, 0);
  [-.25, .25].forEach(x => { const e = new THREE.Mesh(new THREE.BoxGeometry(.15, .15, .05), M(0x111111)); e.position.set(x, -.45, .6); head.p.add(e); });
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(.45, .08, .05), M(0x111111)); mouth.position.set(0, -.85, .6); head.p.add(mouth);
  return { g, legL, legR, armL, armR, torso };
}
const hero = makeChar(0x2f6fe0, 0x2b2b35);
hero.g.position.set(0, 0, 22);
scene.add(hero.g);
const pos = hero.g.position;

/* Status Pemain */
let found = 0, walked = 0, vy = 0, emote = null, emoteT = 0, anim = 0, toastTimer;
let jx = 0, jy = 0, jumpReq = false, rightHeld = false;
let yaw = 0, pitch = .35, dist = 16;
let isFpsActive = false;
let isBlueActive = false;

/* Kontrol Keyboard */
const keys = {};
const keyId = e => (e.code && e.code !== 'Unidentified') ? e.code : (e.key.length === 1 ? 'Key' + e.key.toUpperCase() : e.key);
const dbg = document.createElement('div');
dbg.style.cssText = 'position:fixed;left:12px;top:12px;font:12px monospace;background:rgba(0,0,0,.7);padding:6px 10px;border-radius:6px;display:none;z-index:20';
document.body.appendChild(dbg);
const showKeys = () => dbg.textContent = 'tombol aktif: ' + (Object.keys(keys).filter(k => keys[k]).join(', ') || '-');

addEventListener('keydown', e => {
  if (isFpsActive) {
    if (e.code === 'Escape') closeExponentMiniGame();
    return;
  }
  if (isBlueActive) {
    if (e.code === 'Escape') {
      if ($('coordPickerModal').classList.contains('show')) return;
      closeBlueMiniGame();
      return;
    }
    blueKeys[keyId(e)] = true;
    if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && !e.repeat) {
      e.preventDefault();
      triggerBlueJump();
    }
    return;
  }
  keys[keyId(e)] = true; showKeys();
  if (e.code === 'F3') { e.preventDefault(); dbg.style.display = dbg.style.display === 'none' ? 'block' : 'none'; }
  if (e.code === 'Space') { jumpReq = true; e.preventDefault(); }
  if (e.code === 'KeyF') talk();
  if (e.code === 'KeyE' && nearRedDoor && panel.hidden) openExponentMiniGame();
  if (e.code === 'KeyE' && nearBlueDoor && panel.hidden) openBlueMiniGame();
  if (e.code === 'Tab') { e.preventDefault(); toggleCursor(); }
});
addEventListener('keyup', e => {
  keys[keyId(e)] = false;
  blueKeys[keyId(e)] = false;
  showKeys();
});
addEventListener('blur', () => {
  for (const k in keys) keys[k] = false;
  for (const k in blueKeys) blueKeys[k] = false;
  rightHeld = false;
});
addEventListener('keyup', e => { keys[keyId(e)] = false; showKeys(); });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; rightHeld = false; });

/* Kontrol Mouse & Sentuh */
const cv = renderer.domElement;
const desktop = matchMedia('(pointer:fine)').matches;
const locked = () => document.pointerLockElement === cv;
function toggleCursor() {
  if (!desktop || isFpsActive || isBlueActive) return;
  locked() ? document.exitPointerLock() : cv.requestPointerLock();
}
cv.addEventListener('click', () => {
  if (desktop && !locked() && panel.hidden && !isFpsActive && !isBlueActive) cv.requestPointerLock();
});
addEventListener('mousemove', e => {
  if (!locked() || isFpsActive || isBlueActive) return;
  yaw -= e.movementX * .003;
  pitch = Math.min(1.25, Math.max(.05, pitch + e.movementY * .003));
});
addEventListener('mousedown', e => { if (e.button === 2 && !isFpsActive && !isBlueActive) rightHeld = true; });
addEventListener('mouseup', e => { if (e.button === 2) rightHeld = false; });
addEventListener('contextmenu', e => e.preventDefault());
cv.addEventListener('wheel', e => { if (!isFpsActive && !isBlueActive) dist = Math.min(35, Math.max(7, dist + e.deltaY * .02)); });

let drag = null;
cv.addEventListener('pointerdown', e => { if (e.pointerType === 'touch' && !isFpsActive && !isBlueActive) { drag = e.pointerId; cv.setPointerCapture(drag); } });
cv.addEventListener('pointermove', e => {
  if (e.pointerId !== drag || isFpsActive || isBlueActive) return;
  yaw -= e.movementX * .005;
  pitch = Math.min(1.25, Math.max(.05, pitch + e.movementY * .005));
});
cv.addEventListener('pointerup', () => drag = null);

const joy = $('joy'), knob = $('knob');
let joyId = null;
const joyMove = e => {
  const r = joy.getBoundingClientRect(), max = r.width / 2;
  let dx = e.clientX - (r.left + max), dy = e.clientY - (r.top + max);
  const l = Math.hypot(dx, dy); if (l > max) { dx *= max / l; dy *= max / l; }
  knob.style.transform = `translate(${dx}px,${dy}px)`;
  jx = dx / max; jy = dy / max;
};
joy.addEventListener('pointerdown', e => { joyId = e.pointerId; joy.setPointerCapture(joyId); joyMove(e); });
joy.addEventListener('pointermove', e => { if (e.pointerId === joyId) joyMove(e); });
const joyEnd = e => { if (e.pointerId === joyId) { joyId = null; jx = jy = 0; knob.style.transform = ''; } };
joy.addEventListener('pointerup', joyEnd);
joy.addEventListener('pointercancel', joyEnd);
$('jump').addEventListener('pointerdown', () => jumpReq = true);
