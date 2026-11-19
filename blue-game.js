/* =====================================================================
   MINI-GAME MARKAS BIRU: Platformer 2D Koordinat Kartesius SPLDV
   ===================================================================== */
/* =====================================================================
   BAGIAN 3B: MINI-GAME MARKAS BIRU — PLATFORMER 2D KOORDINAT KARTESIUS SPLDV
   ===================================================================== */
const SPLDV_LEVELS = [
  {
    level: 1,
    eq1: { text: '(i) x + y = 7', a: 1, b: 1, c: 7, hint: 'Titik potong sumbu-y: (0, 7) dan sumbu-x: (7, 0)' },
    eq2: { text: '(ii) x − y = 1', a: 1, b: -1, c: 1, hint: 'Titik potong sumbu-y: (0, −1) dan sumbu-x: (1, 0)' },
    intersection: { x: 4, y: 3 }
  },
  {
    level: 2,
    eq1: { text: '(i) 2x + y = 8', a: 2, b: 1, c: 8, hint: 'Titik potong sumbu-y: (0, 8) dan sumbu-x: (4, 0)' },
    eq2: { text: '(ii) x + y = 5', a: 1, b: 1, c: 5, hint: 'Titik potong sumbu-y: (0, 5) dan sumbu-x: (5, 0)' },
    intersection: { x: 3, y: 2 }
  },
  {
    level: 3,
    eq1: { text: '(i) 3x − y = 5', a: 3, b: -1, c: 5, hint: 'Titik pada garis: (0, −5) di sumbu-y dan (2, 1)' },
    eq2: { text: '(ii) x + y = 3', a: 1, b: 1, c: 3, hint: 'Titik potong sumbu-y: (0, 3) dan sumbu-x: (3, 0)' },
    intersection: { x: 2, y: 1 }
  },
  {
    level: 4,
    eq1: { text: '(i) 2x + 3y = 13', a: 2, b: 3, c: 13, hint: 'Titik bilangan bulat pada garis: (−1, 5) dan (5, 1)' },
    eq2: { text: '(ii) x − y = −1', a: 1, b: -1, c: -1, hint: 'Titik potong sumbu-x: (−1, 0) dan sumbu-y: (0, 1)' },
    intersection: { x: 2, y: 3 }
  },
  {
    level: 5,
    eq1: { text: '(i) x + 2y = 9', a: 1, b: 2, c: 9, hint: 'Titik pada garis: (1, 4) dan sumbu-x: (9, 0)' },
    eq2: { text: '(ii) 3x − 2y = 3', a: 3, b: -2, c: 3, hint: 'Titik pada garis: sumbu-x (1, 0) dan (3, 3)' },
    intersection: { x: 3, y: 3 }
  }
];

/* Dimensi Logis Arena Platformer 2D & Pemetaan Koordinat Kartesius */
const BW = 1100, BH = 680;
const B_PAD = 42;
const B_FLOOR_Y = BH - B_PAD;
const CART_X_MIN = -2, CART_X_MAX = 10;
const CART_Y_MIN = -6, CART_Y_MAX = 9;
const CART_ORIGIN_X = 216; /* x = 0 */
const CART_ORIGIN_Y = 398; /* y = 0 */
const CART_UNIT_X = 76;
const CART_UNIT_Y = 34;

const toScreenX = cx => CART_ORIGIN_X + cx * CART_UNIT_X;
const toScreenY = cy => CART_ORIGIN_Y - cy * CART_UNIT_Y;
const toCartX = sx => Math.max(CART_X_MIN, Math.min(CART_X_MAX, Math.round((sx - CART_ORIGIN_X) / CART_UNIT_X)));
const toCartY = sy => Math.max(CART_Y_MIN, Math.min(CART_Y_MAX, Math.round((CART_ORIGIN_Y - sy) / CART_UNIT_Y)));

const blueCanvas = $('blueCanvas');
const bCtx = blueCanvas.getContext('2d');
const blueKeys = {};

function resizeBlueCanvas() {
  const aspect = BW / BH;
  let w = innerWidth;
  let h = innerHeight;
  if (w / h > aspect) w = Math.floor(h * aspect);
  else h = Math.floor(w / aspect);
  blueCanvas.style.width = w + 'px';
  blueCanvas.style.height = h + 'px';
  const dpr = Math.min(devicePixelRatio || 1, 2);
  blueCanvas.width = Math.floor(BW * dpr);
  blueCanvas.height = Math.floor(BH * dpr);
  bCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const blueState = {
  levelIdx: 0,
  roomIdx: 0, /* 0 = Ruangan 1 (Persamaan i), 1 = Ruangan 2 (Persamaan ii) */
  unlockedLevel: 1,
  soundOn: true,
  musicOn: true,
  player: {
    x: 110, y: B_FLOOR_Y - 44, w: 30, h: 44,
    vx: 0, vy: 0, facing: 1,
    jumpsLeft: 2, onGround: false, walkAnim: 0,
    shirtColor: '#2f6fe0'
  },
  spawnPos: { x: 110, y: B_FLOOR_Y - 44 },
  platforms: [],
  pipes: [],
  hazards: [],
  crystals: [],
  altars: [],
  completedLines: [], /* { p1:{x,y}, p2:{x,y}, color, label } */
  tempLine: null,     /* { p1:{x,y}, p2:{x,y}, valid:boolean, timer:number } */
  roomDoor: null,     /* { x, y, w, h, open:boolean } */
  intersectionBtn: null, /* { cx, cy, sx, sy, pressed:boolean } */
  particles: [],
  jumpRings: [],
  confetti: [],
  pickerCrystalIdx: -1,
  pickX: 0,
  pickY: 0,
  levelCompleted: false
};

/* Efek Suara Platformer Markas Biru */
function playBlueSfx(type) {
  if (!blueState.soundOn) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    if (type === 'jump' || type === 'doublejump') {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      const f0 = type === 'doublejump' ? 420 : 280;
      const f1 = type === 'doublejump' ? 780 : 540;
      o.frequency.setValueAtTime(f0, now);
      o.frequency.exponentialRampToValueAtTime(f1, now + 0.14);
      g.gain.setValueAtTime(0.16, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      o.connect(g); g.connect(ctx.destination);
      o.start(now); o.stop(now + 0.14);
    } else if (type === 'crystal') {
      [659.25, 880, 1174.66].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, now + i * 0.055);
        g.gain.setValueAtTime(0.18, now + i * 0.055);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.055 + 0.2);
        o.connect(g); g.connect(ctx.destination);
        o.start(now + i * 0.055); o.stop(now + i * 0.055 + 0.2);
      });
    } else if (type === 'altar_place') {
      [523.25, 783.99].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, now + i * 0.07);
        g.gain.setValueAtTime(0.2, now + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.24);
        o.connect(g); g.connect(ctx.destination);
        o.start(now + i * 0.07); o.stop(now + i * 0.07 + 0.24);
      });
    } else if (type === 'line_ok' || type === 'victory') {
      const notes = type === 'victory'
        ? [523.25, 659.25, 783.99, 1046.5, 1318.51]
        : [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, now + i * 0.085);
        g.gain.setValueAtTime(0.22, now + i * 0.085);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.085 + 0.32);
        o.connect(g); g.connect(ctx.destination);
        o.start(now + i * 0.085); o.stop(now + i * 0.085 + 0.32);
      });
    } else if (type === 'shatter' || type === 'hurt') {
      [210, 145].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(f, now + i * 0.1);
        g.gain.setValueAtTime(0.18, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.16);
        o.connect(g); g.connect(ctx.destination);
        o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.16);
      });
    }
  } catch (err) {}
}

/* Musik Latar Petualangan Markas Biru */
const blueBgm = { timerId: null, step: 0, playing: false };
const BLUE_SONG = [392, 493.88, 587.33, 493.88, 659.25, 587.33, 493.88, 440, 523.25, 659.25, 783.99, 659.25, 587.33, 493.88, 440, 392];
function startBlueBgm() {
  stopBlueBgm();
  if (!isBlueActive || !blueState.musicOn || !blueState.soundOn) return;
  blueBgm.playing = true;
  blueBgm.timerId = setInterval(() => {
    if (!isBlueActive || !blueState.musicOn || !blueState.soundOn || $('coordPickerModal').classList.contains('show')) return;
    try {
      const ctx = getAudioContext();
      if (ctx.state !== 'running') return;
      const now = ctx.currentTime;
      const f = BLUE_SONG[blueBgm.step % BLUE_SONG.length];
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.04, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      o.connect(g); g.connect(ctx.destination);
      o.start(now); o.stop(now + 0.21);
      blueBgm.step++;
    } catch (err) {}
  }, 230);
}
function stopBlueBgm() {
  if (blueBgm.timerId) clearInterval(blueBgm.timerId);
  blueBgm.timerId = null;
  blueBgm.playing = false;
}

/* Tata Letak Rintangan & Platform untuk 5 Level × 2 Ruangan */
function buildRoomLayout(levelIdx, roomIdx) {
  const seedMix = levelIdx * 2 + roomIdx;
  blueState.altars = [];
  blueState.tempLine = null;
  blueState.roomDoor = null;
  blueState.intersectionBtn = null;
  blueState.pickerCrystalIdx = -1;

  /* Posisi awal pemain & pipa hijau dekoratif seperti pada gambar referensi */
  blueState.spawnPos = { x: 96, y: B_FLOOR_Y - 44 };
  blueState.player.x = blueState.spawnPos.x;
  blueState.player.y = blueState.spawnPos.y;
  blueState.player.vx = 0;
  blueState.player.vy = 0;
  blueState.player.jumpsLeft = 2;

  blueState.pipes = [
    { x: 170, y: B_FLOOR_Y - 56, w: 54, h: 56 },
    { x: 870, y: B_FLOOR_Y - 46, w: 54, h: 46 }
  ];

  /* Variasi platform kayu & blok L kuning seperti gambar referensi */
  const layouts = [
    /* Tata letak 0 (Ruangan 1 Level 1, 3, 5) */
    {
      platforms: [
        { x: 255, y: 525, w: 145, h: 22, kind: 'wood' },
        { x: 455, y: 445, w: 165, h: 22, kind: 'wood' },
        { x: 690, y: 515, w: 150, h: 22, kind: 'wood' },
        { x: 245, y: 315, w: 135, h: 24, kind: 'yellowL' },
        { x: 560, y: 295, w: 175, h: 24, kind: 'yellowL' },
        { x: 805, y: 365, w: 155, h: 22, kind: 'wood' },
        { x: 390, y: 195, w: 160, h: 22, kind: 'wood' }
      ],
      crystalSpots: [
        { x: 310, y: 278 },
        { x: 882, y: 328 }
      ],
      hazards: [
        { type: 'walker', x: 470, y: 415, minX: 460, maxX: 590, speed: 78 + levelIdx * 10, dir: 1 },
        { type: 'flyer', x: 735, y: 390, baseY: 390, amp: 52, speed: 2.3 + levelIdx * 0.2, phase: 0.4 },
        { type: 'walker', x: 360, y: B_FLOOR_Y - 30, minX: 250, maxX: 620, speed: 92 + levelIdx * 10, dir: -1 }
      ]
    },
    /* Tata letak 1 (Ruangan 2 & Level genap) */
    {
      platforms: [
        { x: 230, y: 510, w: 140, h: 22, kind: 'wood' },
        { x: 440, y: 540, w: 145, h: 22, kind: 'wood' },
        { x: 660, y: 465, w: 160, h: 22, kind: 'wood' },
        { x: 845, y: 380, w: 145, h: 22, kind: 'wood' },
        { x: 290, y: 355, w: 155, h: 24, kind: 'yellowL' },
        { x: 545, y: 285, w: 165, h: 24, kind: 'yellowL' },
        { x: 760, y: 215, w: 155, h: 22, kind: 'wood' }
      ],
      crystalSpots: [
        { x: 365, y: 318 },
        { x: 835, y: 178 }
      ],
      hazards: [
        { type: 'walker', x: 675, y: 435, minX: 665, maxX: 790, speed: 85 + levelIdx * 10, dir: 1 },
        { type: 'flyer', x: 495, y: 410, baseY: 410, amp: 58, speed: 2.5 + levelIdx * 0.2, phase: 1.3 },
        { type: 'flyer', x: 710, y: 270, baseY: 270, amp: 44, speed: 2.2 + levelIdx * 0.2, phase: 2.4 },
        { type: 'walker', x: 520, y: B_FLOOR_Y - 30, minX: 260, maxX: 820, speed: 100 + levelIdx * 10, dir: 1 }
      ]
    }
  ];

  const chosen = layouts[seedMix % layouts.length];
  blueState.platforms = chosen.platforms.map(p => ({ ...p }));
  blueState.hazards = chosen.hazards.map(h => ({ ...h }));
  blueState.crystals = chosen.crystalSpots.map((pt, idx) => ({
    id: idx === 0 ? 'A' : 'B',
    homeX: pt.x,
    homeY: pt.y,
    x: pt.x,
    y: pt.y,
    carried: false,
    placed: false,
    bob: idx * Math.PI
  }));

  updateBlueHud();
}

function loadBlueLevel(levelIdx) {
  blueState.levelIdx = levelIdx;
  blueState.roomIdx = 0;
  blueState.completedLines = [];
  blueState.levelCompleted = false;
  buildRoomLayout(levelIdx, 0);
}

function updateBlueHud() {
  const lvl = SPLDV_LEVELS[blueState.levelIdx];
  $('blueLevelLabel').textContent = `Level ${lvl.level} / ${SPLDV_LEVELS.length}`;
  $('blueRoomLabel').textContent = blueState.intersectionBtn
    ? 'Ruangan Akhir · Titik Potong'
    : (blueState.roomIdx === 0 ? 'Ruangan 1 · Garis (i)' : 'Ruangan 2 · Garis (ii)');

  const placedCount = blueState.crystals.filter(c => c.placed).length;
  $('blueCrystalStatus').textContent = `Altar Terisi: ${placedCount} / 2`;

  const eq1El = $('bqEq1Text');
  const eq2El = $('bqEq2Text');
  eq1El.textContent = lvl.eq1.text;
  eq2El.textContent = lvl.eq2.text;

  eq1El.className = 'bqEqTag eq1' + (blueState.roomIdx === 0 && !blueState.intersectionBtn ? ' active' : ' done');
  eq2El.className = 'bqEqTag eq2' + (blueState.roomIdx === 1 && !blueState.intersectionBtn ? ' active' : (blueState.intersectionBtn ? ' done' : ''));

  if (blueState.intersectionBtn) {
    $('blueMissionText').textContent = '🎯 Kedua garis telah berpotongan! Lompat & tekan tombol pada titik potong kedua garis!';
  } else if (blueState.roomDoor && blueState.roomDoor.open) {
    $('blueMissionText').textContent = '🚪 Garis (i) selesai! Masuk ke Pintu Ruangan Kedua untuk menggambar Garis (ii)!';
  } else {
    const carrying = blueState.crystals.find(c => c.carried);
    if (carrying) {
      const targetAltar = blueState.altars.find(a => !a.hasCrystal);
      if (targetAltar) {
        $('blueMissionText').textContent = `🔮 Bawa Bola Kristal ${carrying.id} menuju Altar di titik (${targetAltar.cx}, ${targetAltar.cy})!`;
      }
    } else {
      const activeEq = blueState.roomIdx === 0 ? lvl.eq1.text : lvl.eq2.text;
      $('blueMissionText').textContent = `Cari Bola Kristal A & B melewati rintangan untuk menggambar garis ${activeEq}`;
    }
  }
}

/* Spawn Partikel Visual */
function spawnBlueBurst(x, y, color, count = 18) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.3;
    const sp = 80 + Math.random() * 210;
    blueState.particles.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 60,
      color,
      size: 4 + Math.random() * 4,
      life: 0.55 + Math.random() * 0.25
    });
  }
}

/* Lompat & Double Jump */
function triggerBlueJump() {
  if (!isBlueActive || $('coordPickerModal').classList.contains('show') || $('blueModal').classList.contains('show')) return;
  const p = blueState.player;
  if (p.jumpsLeft > 0) {
    const isSecond = p.jumpsLeft === 1;
    p.vy = isSecond ? -495 : -545;
    p.onGround = false;
    p.jumpsLeft--;
    playBlueSfx(isSecond ? 'doublejump' : 'jump');
    if (isSecond) {
      blueState.jumpRings.push({ x: p.x + p.w / 2, y: p.y + p.h, r: 8, alpha: 0.95 });
      spawnBlueBurst(p.x + p.w / 2, p.y + p.h, '#66d9e8', 10);
    }
  }
}

/* Buka Dialog Pilih Koordinat Altar */
function openCoordPicker(crystalIdx) {
  const lvl = SPLDV_LEVELS[blueState.levelIdx];
  const activeEq = blueState.roomIdx === 0 ? lvl.eq1 : lvl.eq2;
  const cr = blueState.crystals[crystalIdx];
  blueState.pickerCrystalIdx = crystalIdx;

  /* Default awal ke (0, 0) atau sumbu yang belum dipilih */
  blueState.pickX = 0;
  blueState.pickY = 0;
  $('coordPickerTitle').textContent = `🔮 Bola Kristal ${cr.id} Didapatkan!`;
  $('coordPickerDesc').textContent = `Pilih titik pada sumbu-x, sumbu-y, atau koordinat lain untuk persamaan ${activeEq.text} (atau klik langsung di grafik):`;
  refreshCoordPickerPreview();
  $('coordPickerModal').classList.add('show');
}

function refreshCoordPickerPreview() {
  $('pickXVal').textContent = blueState.pickX;
  $('pickYVal').textContent = blueState.pickY;
  $('coordPreviewText').textContent = `Titik Altar: (${blueState.pickX}, ${blueState.pickY})`;
}

function confirmAltarCoordinate() {
  const idx = blueState.pickerCrystalIdx;
  if (idx < 0) return;

  /* Pastikan tidak menumpuk di koordinat altar pertama */
  const duplicate = blueState.altars.some(a => a.cx === blueState.pickX && a.cy === blueState.pickY);
  if (duplicate) {
    toast('⚠️ Titik ini sudah dipakai Altar pertama! Pilih titik kedua yang berbeda.');
    return;
  }

  const cr = blueState.crystals[idx];
  const sx = toScreenX(blueState.pickX);
  const sy = toScreenY(blueState.pickY);

  blueState.altars.push({
    crystalId: cr.id,
    cx: blueState.pickX,
    cy: blueState.pickY,
    sx,
    sy,
    hasCrystal: false
  });

  $('coordPickerModal').classList.remove('show');
  blueState.pickerCrystalIdx = -1;
  playBlueSfx('altar_place');
  spawnBlueBurst(sx, sy, '#3bc9db', 16);
  updateBlueHud();
  toast(`✨ Altar muncul di (${blueState.pickX}, ${blueState.pickY})! Bawa Bola Kristal ${cr.id} ke sana!`);
}

/* Evaluasi Garis Setelah 2 Altar Terisi Bola Kristal */
function evaluateTwoAltars() {
  const lvl = SPLDV_LEVELS[blueState.levelIdx];
  const eq = blueState.roomIdx === 0 ? lvl.eq1 : lvl.eq2;
  const a1 = blueState.altars[0];
  const a2 = blueState.altars[1];

  const ok1 = (eq.a * a1.cx + eq.b * a1.cy) === eq.c;
  const ok2 = (eq.a * a2.cx + eq.b * a2.cy) === eq.c;
  const distinct = (a1.cx !== a2.cx) || (a1.cy !== a2.cy);
  const isCorrect = ok1 && ok2 && distinct;

  blueState.tempLine = {
    p1: { x: a1.cx, y: a1.cy },
    p2: { x: a2.cx, y: a2.cy },
    valid: isCorrect,
    timer: isCorrect ? 0.65 : 1.05
  };

  if (isCorrect) {
    playBlueSfx('line_ok');
    spawnBlueBurst(a1.sx, a1.sy, '#51cf66', 20);
    spawnBlueBurst(a2.sx, a2.sy, '#51cf66', 20);

    setTimeout(() => {
      if (!isBlueActive) return;
      blueState.tempLine = null;
      blueState.completedLines.push({
        p1: { x: a1.cx, y: a1.cy },
        p2: { x: a2.cx, y: a2.cy },
        color: blueState.roomIdx === 0 ? '#1864ab' : '#e8590c',
        label: eq.text
      });

      if (blueState.roomIdx === 0) {
        /* Ruangan 1 selesai -> Munculkan Pintu Ruangan Kedua */
        blueState.roomDoor = {
          x: 935,
          y: B_FLOOR_Y - 82,
          w: 54,
          h: 82,
          open: true
        };
        spawnBlueBurst(962, B_FLOOR_Y - 40, '#ffd43b', 24);
        updateBlueHud();
        toast('✅ Persamaan (i) benar! Masuk ke Pintu Ruangan Kedua!');
      } else {
        /* Ruangan 2 selesai -> Munculkan Tombol pada Titik Potong Kedua Persamaan */
        const inter = lvl.intersection;
        blueState.intersectionBtn = {
          cx: inter.x,
          cy: inter.y,
          sx: toScreenX(inter.x),
          sy: toScreenY(inter.y),
          pressed: false
        };
        spawnBlueBurst(toScreenX(inter.x), toScreenY(inter.y), '#ffd43b', 28);
        updateBlueHud();
        toast('🎯 Kedua garis selesai! Tekan tombol merah-emas di titik potong kedua garis!');
      }
    }, 650);
  } else {
    playBlueSfx('shatter');
    toast(`❌ Garis belum sesuai persamaan ${eq.text}! Altar hancur & bola kristal kembali.`);
    setTimeout(() => {
      if (!isBlueActive) return;
      /* Altar hancur & bola kristal kembali ke tempat semula */
      for (const al of blueState.altars) {
        spawnBlueBurst(al.sx, al.sy, '#ff6b6b', 22);
      }
      blueState.altars = [];
      blueState.tempLine = null;
      for (const cr of blueState.crystals) {
        cr.x = cr.homeX;
        cr.y = cr.homeY;
        cr.carried = false;
        cr.placed = false;
      }
      updateBlueHud();
    }, 1000);
  }
}

/* Saat Tombol di Titik Potong Ditekan */
function pressIntersectionButton() {
  const btn = blueState.intersectionBtn;
  if (!btn || btn.pressed) return;
  btn.pressed = true;
  blueState.levelCompleted = true;
  playBlueSfx('victory');
  spawnBlueBurst(btn.sx, btn.sy, '#ffd43b', 36);

  /* Konfeti perayaan */
  const cols = ['#1864ab', '#e8590c', '#ffd43b', '#3bc9db', '#51cf66'];
  for (let i = 0; i < 65; i++) {
    blueState.confetti.push({
      x: 100 + Math.random() * (BW - 200),
      y: 80 + Math.random() * 140,
      vx: (Math.random() - 0.5) * 180,
      vy: -80 - Math.random() * 140,
      color: cols[i % cols.length],
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 8,
      life: 3.2 + Math.random()
    });
  }

  const lvl = SPLDV_LEVELS[blueState.levelIdx];
  toast(`🏆 Titik Potong Ditemukan: (${lvl.intersection.x}, ${lvl.intersection.y})!`);

  setTimeout(() => {
    if (isBlueActive) showBlueLevelModal(false);
  }, 2200);
}

function showBlueLevelModal(isManual = false) {
  const modal = $('blueModal');
  const lvl = SPLDV_LEVELS[blueState.levelIdx];
  const levelNum = lvl.level;
  const grid = $('blueModalLevelGrid');
  const nextBtn = $('blueModalNextBtn');

  if (!isManual) {
    if (levelNum < SPLDV_LEVELS.length) {
      blueState.unlockedLevel = Math.max(blueState.unlockedLevel, levelNum + 1);
      $('blueModalTitle').textContent = `🎉 Level ${levelNum} Selesai!`;
      $('blueModalDesc').textContent = `Himpunan Penyelesaian dari ${lvl.eq1.text} dan ${lvl.eq2.text} adalah Titik Potong (${lvl.intersection.x}, ${lvl.intersection.y}).`;
      nextBtn.style.display = 'block';
      nextBtn.textContent = `Lanjut ke Level ${levelNum + 1} ➔`;
      nextBtn.onclick = () => {
        modal.classList.remove('show');
        loadBlueLevel(blueState.levelIdx + 1);
      };
    } else {
      $('blueModalTitle').textContent = `🏆 Semua 5 Level SPLDV Tamat!`;
      $('blueModalDesc').textContent = `Luar biasa! Kamu berhasil menyelesaikan seluruh 5 soal SPLDV metode grafik hingga titik potong (${lvl.intersection.x}, ${lvl.intersection.y})!`;
      nextBtn.style.display = 'block';
      nextBtn.textContent = `Main Ulang dari Level 1 ↻`;
      nextBtn.onclick = () => {
        modal.classList.remove('show');
        loadBlueLevel(0);
      };
    }
  } else {
    $('blueModalTitle').textContent = `Pilih Level Grafik SPLDV`;
    $('blueModalDesc').textContent = `Selesaikan setiap level (2 ruangan persamaan garis + titik potong) untuk membuka level berikutnya.`;
    nextBtn.style.display = 'none';
  }

  grid.innerHTML = '';
  SPLDV_LEVELS.forEach((item, idx) => {
    const btn = document.createElement('button');
    const unlocked = (idx + 1) <= blueState.unlockedLevel;
    btn.className = 'blueLvlChip' + (unlocked ? ' unlocked' : '') + (idx === blueState.levelIdx ? ' current' : '');
    btn.textContent = `Lvl ${item.level}`;
    btn.disabled = !unlocked;
    btn.onclick = () => {
      modal.classList.remove('show');
      loadBlueLevel(idx);
    };
    grid.appendChild(btn);
  });

  modal.classList.add('show');
}

function openBlueMiniGame() {
  isBlueActive = true;
  blueState.player.shirtColor = hex(hero.torso.m.material.color.getHex());
  if (document.pointerLockElement) document.exitPointerLock();
  $('blueOverlay').classList.add('active');
  $('blueModal').classList.remove('show');
  $('coordPickerModal').classList.remove('show');
  resizeBlueCanvas();
  loadBlueLevel(blueState.levelIdx);
  startBlueBgm();
}

function closeBlueMiniGame() {
  isBlueActive = false;
  stopBlueBgm();
  for (const k in blueKeys) blueKeys[k] = false;
  $('blueOverlay').classList.remove('active');
  $('blueModal').classList.remove('show');
  $('coordPickerModal').classList.remove('show');
  if (blueState.levelCompleted) {
    emote = 'dance';
    emoteT = 3.5;
    blueState.levelCompleted = false;
  }
}

/* Event Listener Kontrol & UI Markas Biru */
$('blueExitBtn').addEventListener('click', closeBlueMiniGame);
$('blueLevelSelectBtn').addEventListener('click', () => showBlueLevelModal(true));
$('blueModalCloseBtn').addEventListener('click', () => $('blueModal').classList.remove('show'));
$('blueHintBtn').addEventListener('click', () => {
  const lvl = SPLDV_LEVELS[blueState.levelIdx];
  const eq = blueState.roomIdx === 0 ? lvl.eq1 : lvl.eq2;
  toast(`💡 Petunjuk ${eq.text}: ${eq.hint}`);
});
$('blueMusicBtn').addEventListener('click', () => {
  blueState.musicOn = !blueState.musicOn;
  $('blueMusicBtn').textContent = blueState.musicOn ? '🎵' : '🔇';
  $('blueMusicBtn').classList.toggle('muted', !blueState.musicOn);
  if (blueState.musicOn && blueState.soundOn) startBlueBgm();
  else stopBlueBgm();
});
$('blueSoundBtn').addEventListener('click', () => {
  blueState.soundOn = !blueState.soundOn;
  $('blueSoundBtn').textContent = blueState.soundOn ? '🔊' : '🔇';
  $('blueSoundBtn').classList.toggle('muted', !blueState.soundOn);
  if (blueState.soundOn && blueState.musicOn) startBlueBgm();
  else stopBlueBgm();
});

/* Tombol Stepper & Sumbu pada Dialog Pilih Koordinat */
$('xMinusBtn').addEventListener('click', () => {
  blueState.pickX = Math.max(CART_X_MIN, blueState.pickX - 1);
  refreshCoordPickerPreview();
});
$('xPlusBtn').addEventListener('click', () => {
  blueState.pickX = Math.min(CART_X_MAX, blueState.pickX + 1);
  refreshCoordPickerPreview();
});
$('yMinusBtn').addEventListener('click', () => {
  blueState.pickY = Math.max(CART_Y_MIN, blueState.pickY - 1);
  refreshCoordPickerPreview();
});
$('yPlusBtn').addEventListener('click', () => {
  blueState.pickY = Math.min(CART_Y_MAX, blueState.pickY + 1);
  refreshCoordPickerPreview();
});
$('snapXAxisBtn').addEventListener('click', () => {
  blueState.pickY = 0;
  refreshCoordPickerPreview();
});
$('snapYAxisBtn').addEventListener('click', () => {
  blueState.pickX = 0;
  refreshCoordPickerPreview();
});
$('confirmAltarBtn').addEventListener('click', confirmAltarCoordinate);

/* Klik langsung pada kanvas Kartesius (untuk pilih titik altar atau tekan tombol titik potong) */
blueCanvas.addEventListener('pointerdown', e => {
  if (!isBlueActive) return;
  const rect = blueCanvas.getBoundingClientRect();
  const lx = ((e.clientX - rect.left) / rect.width) * BW;
  const ly = ((e.clientY - rect.top) / rect.height) * BH;

  if ($('coordPickerModal').classList.contains('show')) {
    blueState.pickX = toCartX(lx);
    blueState.pickY = toCartY(ly);
    refreshCoordPickerPreview();
    return;
  }

  if (blueState.intersectionBtn && !blueState.intersectionBtn.pressed) {
    const d = Math.hypot(lx - blueState.intersectionBtn.sx, ly - blueState.intersectionBtn.sy);
    if (d < 42) pressIntersectionButton();
  }
});

/* Kontrol Sentuh Walk Kiri / Kanan / Double Jump */
function bindHoldBtn(el, code) {
  const down = e => { e.preventDefault(); blueKeys[code] = true; };
  const up = e => { e.preventDefault(); blueKeys[code] = false; };
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('pointerleave', up);
}
bindHoldBtn($('bLeftBtn'), 'ArrowLeft');
bindHoldBtn($('bRightBtn'), 'ArrowRight');
$('bJumpBtn').addEventListener('pointerdown', e => {
  e.preventDefault();
  triggerBlueJump();
});

/* Kecepatan jalan karakter di Arena Biru (piksel/detik). Ubah angka ini untuk lebih lambat/cepat. */
const BLUE_WALK_SPEED = 140;      /* sebelumnya 275 */
const BLUE_WALK_ANIM_RATE = 6.5;  /* kecepatan ayunan kaki, sebelumnya 12 */

/* Update Fisika & Logika Platformer 2D Markas Biru */
function updateBlueMiniGame(dt, elapsed) {
  const modalOpen = $('coordPickerModal').classList.contains('show') || $('blueModal').classList.contains('show');
  const p = blueState.player;

  if (!modalOpen) {
    /* Gerak berjalan kiri / kanan saja (tanpa lari) */
    const moveDir = ((blueKeys.KeyD || blueKeys.ArrowRight) ? 1 : 0) - ((blueKeys.KeyA || blueKeys.ArrowLeft) ? 1 : 0);
    p.vx = moveDir * BLUE_WALK_SPEED;
    if (moveDir !== 0) {
      p.facing = moveDir;
      p.walkAnim += dt * BLUE_WALK_ANIM_RATE;
    } else {
      p.walkAnim = 0;
    }

    const prevBottom = p.y + p.h;
    p.x += p.vx * dt;
    p.vy += 1280 * dt; /* Gravitasi */
    p.y += p.vy * dt;

    /* Batas dinding bingkai kiri & kanan */
    p.x = Math.max(B_PAD + 4, Math.min(BW - B_PAD - p.w - 4, p.x));
    p.onGround = false;

    /* Lantai utama */
    if (p.y + p.h >= B_FLOOR_Y) {
      p.y = B_FLOOR_Y - p.h;
      p.vy = 0;
      p.onGround = true;
      p.jumpsLeft = 2;
    }

    /* Pijakan pipa hijau */
    for (const pipe of blueState.pipes) {
      if (p.vy >= 0 && prevBottom <= pipe.y + 8 && p.y + p.h >= pipe.y &&
          p.x + p.w > pipe.x + 4 && p.x < pipe.x + pipe.w - 4) {
        p.y = pipe.y - p.h;
        p.vy = 0;
        p.onGround = true;
        p.jumpsLeft = 2;
      }
    }

    /* Pijakan platform kayu, blok L kuning, pijakan altar, & pijakan tombol titik potong */
    const allLedges = [...blueState.platforms];
    for (const al of blueState.altars) {
      allLedges.push({ x: al.sx - 38, y: al.sy + 18, w: 76, h: 14 });
    }
    if (blueState.intersectionBtn) {
      allLedges.push({ x: blueState.intersectionBtn.sx - 44, y: blueState.intersectionBtn.sy + 20, w: 88, h: 14 });
    }

    for (const plat of allLedges) {
      if (p.vy >= 0 && prevBottom <= plat.y + 10 && p.y + p.h >= plat.y &&
          p.x + p.w > plat.x + 4 && p.x < plat.x + plat.w - 4) {
        p.y = plat.y - p.h;
        p.vy = 0;
        p.onGround = true;
        p.jumpsLeft = 2;
      }
    }

    /* Update Rintangan Bergerak & Deteksi Tabrakan */
    const pCx = p.x + p.w / 2;
    const pCy = p.y + p.h / 2;
    for (const hz of blueState.hazards) {
      if (hz.type === 'walker') {
        hz.x += hz.speed * hz.dir * dt;
        if (hz.x <= hz.minX) { hz.x = hz.minX; hz.dir = 1; }
        if (hz.x >= hz.maxX) { hz.x = hz.maxX; hz.dir = -1; }
      } else if (hz.type === 'flyer') {
        hz.y = hz.baseY + Math.sin(elapsed * hz.speed + hz.phase) * hz.amp;
      }

      if (Math.hypot(pCx - hz.x, pCy - hz.y) < 28 && !blueState.levelCompleted) {
        playBlueSfx('hurt');
        spawnBlueBurst(pCx, pCy, '#ff6b6b', 16);
        p.x = blueState.spawnPos.x;
        p.y = blueState.spawnPos.y;
        p.vx = 0;
        p.vy = 0;
        p.jumpsLeft = 2;
        toast('💥 Terkena rintangan! Kembali ke titik awal ruangan.');
        break;
      }
    }

    /* Pengambilan Bola Kristal A / B */
    const currentlyCarrying = blueState.crystals.some(c => c.carried);
    for (let i = 0; i < blueState.crystals.length; i++) {
      const cr = blueState.crystals[i];
      if (cr.placed) continue;
      if (cr.carried) {
        cr.x = pCx;
        cr.y = p.y - 18;
      } else if (!currentlyCarrying && Math.hypot(pCx - cr.x, pCy - cr.y) < 34) {
        cr.carried = true;
        playBlueSfx('crystal');
        spawnBlueBurst(cr.x, cr.y, '#66d9e8', 16);
        updateBlueHud();
        openCoordPicker(i);
        break;
      }
    }

    /* Mengantarkan Bola Kristal ke Altar yang Muncul di Titik Pilihan */
    const carriedCrystal = blueState.crystals.find(c => c.carried);
    if (carriedCrystal) {
      const targetAltar = blueState.altars.find(a => a.crystalId === carriedCrystal.id && !a.hasCrystal);
      if (targetAltar && Math.hypot(pCx - targetAltar.sx, pCy - targetAltar.sy) < 38) {
        targetAltar.hasCrystal = true;
        carriedCrystal.carried = false;
        carriedCrystal.placed = true;
        carriedCrystal.x = targetAltar.sx;
        carriedCrystal.y = targetAltar.sy - 14;
        playBlueSfx('altar_place');
        spawnBlueBurst(targetAltar.sx, targetAltar.sy, '#ffd43b', 20);
        updateBlueHud();

        if (blueState.altars.length === 2 && blueState.altars.every(a => a.hasCrystal)) {
          evaluateTwoAltars();
        } else {
          toast(`💎 Kristal ${carriedCrystal.id} terpasang di Altar (${targetAltar.cx}, ${targetAltar.cy})! Cari bola kristal berikutnya!`);
        }
      }
    }

    /* Masuk Pintu Ruangan Kedua */
    if (blueState.roomDoor && blueState.roomDoor.open) {
      const d = blueState.roomDoor;
      if (p.x + p.w > d.x + 8 && p.x < d.x + d.w - 8 && p.y + p.h > d.y + 8) {
        playBlueSfx('crystal');
        blueState.roomIdx = 1;
        buildRoomLayout(blueState.levelIdx, 1);
        toast('🚪 Memasuki Ruangan 2! Gambar persamaan garis kedua.');
      }
    }

    /* Menekan Tombol pada Titik Potong Kedua Persamaan */
    if (blueState.intersectionBtn && !blueState.intersectionBtn.pressed) {
      const ib = blueState.intersectionBtn;
      if (Math.hypot(pCx - ib.sx, pCy - ib.sy) < 38) {
        pressIntersectionButton();
      }
    }
  }

  /* Update Partikel, Cincin Double Jump & Konfeti */
  for (let i = blueState.particles.length - 1; i >= 0; i--) {
    const pt = blueState.particles[i];
    pt.life -= dt;
    pt.vy += 420 * dt;
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    if (pt.life <= 0) blueState.particles.splice(i, 1);
  }
  for (let i = blueState.jumpRings.length - 1; i >= 0; i--) {
    const jr = blueState.jumpRings[i];
    jr.r += 110 * dt;
    jr.alpha -= 2.4 * dt;
    if (jr.alpha <= 0) blueState.jumpRings.splice(i, 1);
  }
  for (let i = blueState.confetti.length - 1; i >= 0; i--) {
    const cf = blueState.confetti[i];
    cf.life -= dt;
    cf.vy += 260 * dt;
    cf.x += cf.vx * dt;
    cf.y += cf.vy * dt;
    cf.rot += cf.vrot * dt;
    if (cf.life <= 0 || cf.y > BH) blueState.confetti.splice(i, 1);
  }

  renderBluePlatformer(elapsed);
}

/* Menggambar Garis Lurus Melintasi Bidang Kartesius dari 2 Titik */
function drawInfiniteCartesianLine(p1, p2, strokeColor, lineWidth, dashed = false) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  if (dx === 0 && dy === 0) return;

  bCtx.save();
  bCtx.beginPath();
  bCtx.rect(B_PAD, B_PAD, BW - B_PAD * 2, BH - B_PAD * 2);
  bCtx.clip();

  bCtx.strokeStyle = strokeColor;
  bCtx.lineWidth = lineWidth;
  bCtx.setLineDash(dashed ? [10, 8] : []);
  bCtx.beginPath();
  bCtx.moveTo(toScreenX(p1.x - dx * 20), toScreenY(p1.y - dy * 20));
  bCtx.lineTo(toScreenX(p1.x + dx * 20), toScreenY(p1.y + dy * 20));
  bCtx.stroke();
  bCtx.restore();
}

/* Render Visual Lengkap Arena Platformer 2D Koordinat Kartesius */
function renderBluePlatformer(elapsed) {
  bCtx.clearRect(0, 0, BW, BH);

  /* 1. Latar Belakang Koordinat Kartesius */
  const bgGrad = bCtx.createLinearGradient(0, B_PAD, 0, BH - B_PAD);
  bgGrad.addColorStop(0, '#eef4ff');
  bgGrad.addColorStop(0.65, '#f7f4ff');
  bgGrad.addColorStop(1, '#e6effc');
  bCtx.fillStyle = bgGrad;
  bCtx.fillRect(B_PAD, B_PAD, BW - B_PAD * 2, BH - B_PAD * 2);

  /* Siluet bukit & pilar dekoratif lembut di bagian bawah seperti gambar referensi */
  bCtx.fillStyle = 'rgba(180, 196, 226, 0.24)';
  for (let px = 80; px < BW - 80; px += 145) {
    bCtx.fillRect(px, 470, 22, B_FLOOR_Y - 470);
    bCtx.beginPath();
    bCtx.arc(px + 11, 470, 28, Math.PI, 0);
    bCtx.fill();
  }

  /* Garis Grid Kartesius & Angka Sumbu X / Y */
  bCtx.save();
  bCtx.beginPath();
  bCtx.rect(B_PAD, B_PAD, BW - B_PAD * 2, BH - B_PAD * 2);
  bCtx.clip();

  bCtx.lineWidth = 1;
  bCtx.font = '700 12px system-ui, sans-serif';
  bCtx.textAlign = 'center';
  bCtx.textBaseline = 'top';

  for (let cx = CART_X_MIN; cx <= CART_X_MAX; cx++) {
    const sx = toScreenX(cx);
    bCtx.strokeStyle = cx === 0 ? '#1e293b' : 'rgba(100, 116, 139, 0.25)';
    bCtx.lineWidth = cx === 0 ? 2.5 : 1;
    bCtx.beginPath();
    bCtx.moveTo(sx, B_PAD);
    bCtx.lineTo(sx, BH - B_PAD);
    bCtx.stroke();

    if (cx !== 0) {
      bCtx.fillStyle = '#334155';
      bCtx.fillText(String(cx), sx, CART_ORIGIN_Y + 6);
    }
  }

  bCtx.textAlign = 'right';
  bCtx.textBaseline = 'middle';
  for (let cy = CART_Y_MIN; cy <= CART_Y_MAX; cy++) {
    const sy = toScreenY(cy);
    bCtx.strokeStyle = cy === 0 ? '#1e293b' : 'rgba(100, 116, 139, 0.25)';
    bCtx.lineWidth = cy === 0 ? 2.5 : 1;
    bCtx.beginPath();
    bCtx.moveTo(B_PAD, sy);
    bCtx.lineTo(BW - B_PAD, sy);
    bCtx.stroke();

    if (cy !== 0 && sy > B_PAD + 55 && sy < BH - B_PAD - 12) {
      bCtx.fillStyle = '#334155';
      bCtx.fillText(String(cy), CART_ORIGIN_X - 8, sy);
    }
  }

  /* Label Sumbu X, Sumbu Y, dan Titik Asal (0,0) */
  bCtx.fillStyle = '#0f172a';
  bCtx.font = '900 14px system-ui, sans-serif';
  bCtx.fillText('0', CART_ORIGIN_X - 8, CART_ORIGIN_Y + 12);
  bCtx.fillText('x', BW - B_PAD - 14, CART_ORIGIN_Y - 14);
  bCtx.fillText('y', CART_ORIGIN_X + 16, B_PAD + 88);
  bCtx.restore();

  /* 2. Gambar Garis Persamaan yang Sudah Selesai & Garis Sementara */
  for (const ln of blueState.completedLines) {
    drawInfiniteCartesianLine(ln.p1, ln.p2, ln.color, 4.5, false);
  }
  if (blueState.tempLine) {
    drawInfiniteCartesianLine(
      blueState.tempLine.p1,
      blueState.tempLine.p2,
      blueState.tempLine.valid ? '#2b8a3e' : '#e03131',
      4.5,
      !blueState.tempLine.valid
    );
  }

  /* 3. Pipa Hijau & Platform Kayu / Blok L Kuning (Gaya Retro Referensi) */
  for (const pipe of blueState.pipes) {
    bCtx.fillStyle = '#2b8a3e';
    bCtx.fillRect(pipe.x + 4, pipe.y + 14, pipe.w - 8, pipe.h - 14);
    bCtx.fillStyle = '#40c057';
    bCtx.fillRect(pipe.x + 10, pipe.y + 14, 10, pipe.h - 14);
    bCtx.fillStyle = '#2f9e44';
    bCtx.fillRect(pipe.x, pipe.y, pipe.w, 16);
    bCtx.strokeStyle = '#14361d';
    bCtx.lineWidth = 2.5;
    bCtx.strokeRect(pipe.x, pipe.y, pipe.w, 16);
    bCtx.strokeRect(pipe.x + 4, pipe.y + 16, pipe.w - 8, pipe.h - 16);
  }

  for (const plat of blueState.platforms) {
    if (plat.kind === 'yellowL') {
      bCtx.fillStyle = '#fcc419';
      bCtx.fillRect(plat.x, plat.y, plat.w, plat.h);
      bCtx.fillRect(plat.x + plat.w - 26, plat.y - 46, 26, 46);
      bCtx.strokeStyle = '#5c3c00';
      bCtx.lineWidth = 2.5;
      bCtx.strokeRect(plat.x, plat.y, plat.w, plat.h);
      bCtx.strokeRect(plat.x + plat.w - 26, plat.y - 46, 26, 46);
    } else {
      bCtx.fillStyle = '#b0723c';
      bCtx.fillRect(plat.x, plat.y, plat.w, plat.h);
      bCtx.fillStyle = '#e6b88a';
      bCtx.fillRect(plat.x, plat.y, plat.w, 6);
      bCtx.strokeStyle = '#3d220c';
      bCtx.lineWidth = 2.5;
      bCtx.strokeRect(plat.x, plat.y, plat.w, plat.h);
    }
  }

  /* 4. Pintu Ruangan Kedua (Jika Ruangan 1 Selesai) */
  if (blueState.roomDoor && blueState.roomDoor.open) {
    const d = blueState.roomDoor;
    const pulse = 0.85 + Math.sin(elapsed * 6) * 0.15;
    bCtx.save();
    bCtx.fillStyle = '#1864ab';
    bCtx.strokeStyle = '#ffd43b';
    bCtx.lineWidth = 4;
    bCtx.beginPath();
    bCtx.roundRect(d.x, d.y, d.w, d.h, [24, 24, 0, 0]);
    bCtx.fill();
    bCtx.stroke();

    bCtx.fillStyle = `rgba(102, 217, 232, ${pulse})`;
    bCtx.beginPath();
    bCtx.roundRect(d.x + 8, d.y + 10, d.w - 16, d.h - 10, [18, 18, 0, 0]);
    bCtx.fill();

    bCtx.fillStyle = '#ffd43b';
    bCtx.font = '900 12px system-ui, sans-serif';
    bCtx.textAlign = 'center';
    bCtx.fillText('RUANG 2 ➔', d.x + d.w / 2, d.y - 10);
    bCtx.restore();
  }

  /* 5. Altar Koordinat & Pijakan Kecilnya */
  for (const al of blueState.altars) {
    /* Pijakan kristal di bawah altar agar mudah dijangkau lompatan */
    bCtx.fillStyle = '#1864ab';
    bCtx.strokeStyle = '#66d9e8';
    bCtx.lineWidth = 2;
    bCtx.fillRect(al.sx - 38, al.sy + 18, 76, 12);
    bCtx.strokeRect(al.sx - 38, al.sy + 18, 76, 12);

    /* Pedestal Altar */
    bCtx.fillStyle = al.hasCrystal ? '#2b8a3e' : '#364fc7';
    bCtx.beginPath();
    bCtx.moveTo(al.sx - 18, al.sy + 18);
    bCtx.lineTo(al.sx + 18, al.sy + 18);
    bCtx.lineTo(al.sx + 12, al.sy - 2);
    bCtx.lineTo(al.sx - 12, al.sy - 2);
    bCtx.closePath();
    bCtx.fill();
    bCtx.strokeStyle = '#ffffff';
    bCtx.stroke();

    /* Label Koordinat Altar */
    bCtx.fillStyle = '#0f172a';
    bCtx.font = '900 12px system-ui, sans-serif';
    bCtx.textAlign = 'center';
    bCtx.fillText(`(${al.cx}, ${al.cy})`, al.sx, al.sy + 42);
  }

  /* 6. Tombol di Titik Potong Kedua Persamaan */
  if (blueState.intersectionBtn) {
    const ib = blueState.intersectionBtn;
    /* Pijakan di bawah tombol titik potong */
    bCtx.fillStyle = '#f59f00';
    bCtx.strokeStyle = '#1e293b';
    bCtx.lineWidth = 2.5;
    bCtx.fillRect(ib.sx - 44, ib.sy + 20, 88, 13);
    bCtx.strokeRect(ib.sx - 44, ib.sy + 20, 88, 13);

    /* Dudukan & Kepala Tombol */
    bCtx.fillStyle = '#343a40';
    bCtx.fillRect(ib.sx - 22, ib.sy + 8, 44, 12);
    const btnTopY = ib.pressed ? ib.sy + 4 : ib.sy - 4 + Math.sin(elapsed * 7) * 2;
    bCtx.fillStyle = ib.pressed ? '#37b24d' : '#ff2d55';
    bCtx.beginPath();
    bCtx.roundRect(ib.sx - 18, btnTopY, 36, 14, 6);
    bCtx.fill();
    bCtx.strokeStyle = '#ffffff';
    bCtx.lineWidth = 2;
    bCtx.stroke();

    if (ib.pressed) {
      /* Munculkan koordinat titik potong setelah ditekan! */
      const badgeText = `Titik Potong: (${ib.cx}, ${ib.cy})`;
      bCtx.fillStyle = '#141821';
      bCtx.beginPath();
      bCtx.roundRect(ib.sx - 86, ib.sy - 46, 172, 30, 15);
      bCtx.fill();
      bCtx.strokeStyle = '#ffd43b';
      bCtx.lineWidth = 2.5;
      bCtx.stroke();

      bCtx.fillStyle = '#ffd43b';
      bCtx.font = '900 14px system-ui, sans-serif';
      bCtx.textAlign = 'center';
      bCtx.fillText(badgeText, ib.sx, ib.sy - 26);
    } else {
      bCtx.fillStyle = '#d9480f';
      bCtx.font = '900 12px system-ui, sans-serif';
      bCtx.textAlign = 'center';
      bCtx.fillText('TEKAN!', ib.sx, ib.sy - 14);
    }
  }

  /* 7. Bola Kristal A & B */
  for (const cr of blueState.crystals) {
    const drawY = cr.placed ? cr.y : cr.y + Math.sin(elapsed * 4 + cr.bob) * 4;
    const grad = bCtx.createRadialGradient(cr.x - 5, drawY - 5, 2, cr.x, drawY, 18);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.45, '#66d9e8');
    grad.addColorStop(1, '#1864ab');

    bCtx.beginPath();
    bCtx.arc(cr.x, drawY, 16, 0, Math.PI * 2);
    bCtx.fillStyle = grad;
    bCtx.fill();
    bCtx.strokeStyle = '#ffffff';
    bCtx.lineWidth = 2.5;
    bCtx.stroke();

    bCtx.fillStyle = '#0b1c34';
    bCtx.font = '900 13px system-ui, sans-serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText(cr.id, cr.x, drawY + 1);
  }

  /* 8. Rintangan (Bot Patroli & Monster Terbang Bersayap seperti di gambar) */
  for (const hz of blueState.hazards) {
    if (hz.type === 'walker') {
      bCtx.fillStyle = '#1c7ed6';
      bCtx.beginPath();
      bCtx.arc(hz.x, hz.y, 16, Math.PI, 0);
      bCtx.fillRect(hz.x - 16, hz.y, 32, 16);
      bCtx.fill();
      bCtx.strokeStyle = '#0b1c34';
      bCtx.lineWidth = 2;
      bCtx.stroke();

      /* Topeng putih karakter rintangan */
      bCtx.fillStyle = '#ffffff';
      bCtx.beginPath();
      bCtx.ellipse(hz.x + hz.dir * 5, hz.y + 3, 8, 10, 0, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.fillStyle = '#111111';
      bCtx.fillRect(hz.x + hz.dir * 5 - 3, hz.y, 2, 5);
      bCtx.fillRect(hz.x + hz.dir * 5 + 2, hz.y, 2, 5);
    } else {
      /* Makhluk bersayap merah seperti pada sisi kanan gambar referensi */
      const flap = Math.sin(elapsed * 14) * 6;
      bCtx.fillStyle = '#ffffff';
      bCtx.beginPath();
      bCtx.ellipse(hz.x - 18, hz.y - 6 + flap, 10, 5, -0.4, 0, Math.PI * 2);
      bCtx.ellipse(hz.x + 18, hz.y - 6 + flap, 10, 5, 0.4, 0, Math.PI * 2);
      bCtx.fill();

      bCtx.fillStyle = '#fa5252';
      bCtx.beginPath();
      bCtx.arc(hz.x, hz.y, 16, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.strokeStyle = '#5c0011';
      bCtx.lineWidth = 2;
      bCtx.stroke();

      bCtx.fillStyle = '#111111';
      bCtx.fillRect(hz.x - 6, hz.y - 4, 3, 5);
      bCtx.fillRect(hz.x + 3, hz.y - 4, 3, 5);
    }
  }

  /* 9. Karakter Pemain (Berjalan + Double Jump) */
  const p = blueState.player;
  const stepOffset = p.onGround ? Math.sin(p.walkAnim) * 4 : 3;
  /* Kaki */
  bCtx.fillStyle = '#1e293b';
  bCtx.fillRect(p.x + 5, p.y + 30 - stepOffset, 8, 14);
  bCtx.fillRect(p.x + 17, p.y + 30 + stepOffset, 8, 14);
  /* Badan / Baju */
  bCtx.fillStyle = p.shirtColor;
  bCtx.fillRect(p.x + 4, p.y + 15, 22, 17);
  bCtx.strokeStyle = '#0f172a';
  bCtx.lineWidth = 2;
  bCtx.strokeRect(p.x + 4, p.y + 15, 22, 17);
  /* Kepala & Topi Biru */
  bCtx.fillStyle = '#ffd43b';
  bCtx.fillRect(p.x + 6, p.y + 2, 18, 14);
  bCtx.strokeRect(p.x + 6, p.y + 2, 18, 14);
  bCtx.fillStyle = '#1864ab';
  bCtx.fillRect(p.x + 4, p.y, 22, 5);
  /* Mata */
  bCtx.fillStyle = '#111111';
  const eyeX = p.facing > 0 ? p.x + 18 : p.x + 9;
  bCtx.fillRect(eyeX, p.y + 7, 3, 4);

  /* 10. Cincin Double Jump, Partikel & Konfeti */
  for (const jr of blueState.jumpRings) {
    bCtx.strokeStyle = `rgba(0, 229, 255, ${jr.alpha})`;
    bCtx.lineWidth = 3;
    bCtx.beginPath();
    bCtx.ellipse(jr.x, jr.y, jr.r * 1.4, jr.r * 0.45, 0, 0, Math.PI * 2);
    bCtx.stroke();
  }
  for (const pt of blueState.particles) {
    bCtx.fillStyle = pt.color;
    bCtx.beginPath();
    bCtx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
    bCtx.fill();
  }
  for (const cf of blueState.confetti) {
    bCtx.save();
    bCtx.translate(cf.x, cf.y);
    bCtx.rotate(cf.rot);
    bCtx.fillStyle = cf.color;
    bCtx.fillRect(-6, -4, 12, 8);
    bCtx.restore();
  }

  /* 11. Bingkai Mosaik Kristal / Batu di Keempat Sisi Arena (Gaya Gambar Referensi) */
  const tileSz = B_PAD;
  const borderColors = ['#2b4c7e', '#4f7cac', '#89b0ae', '#364fc7'];
  for (let tx = 0; tx < BW; tx += tileSz) {
    [0, BH - tileSz].forEach((ty, rowIdx) => {
      const cIdx = (Math.floor(tx / tileSz) + rowIdx) % borderColors.length;
      bCtx.fillStyle = borderColors[cIdx];
      bCtx.fillRect(tx, ty, tileSz, tileSz);
      bCtx.strokeStyle = '#0b132b';
      bCtx.lineWidth = 2.5;
      bCtx.strokeRect(tx, ty, tileSz, tileSz);
      bCtx.fillStyle = 'rgba(255,255,255,0.22)';
      bCtx.fillRect(tx + 5, ty + 5, tileSz - 16, 7);
    });
  }
  for (let ty = tileSz; ty < BH - tileSz; ty += tileSz) {
    [0, BW - tileSz].forEach((tx, colIdx) => {
      const cIdx = (Math.floor(ty / tileSz) + colIdx + 1) % borderColors.length;
      bCtx.fillStyle = borderColors[cIdx];
      bCtx.fillRect(tx, ty, tileSz, tileSz);
      bCtx.strokeStyle = '#0b132b';
      bCtx.lineWidth = 2.5;
      bCtx.strokeRect(tx, ty, tileSz, tileSz);
      bCtx.fillStyle = 'rgba(255,255,255,0.22)';
      bCtx.fillRect(tx + 5, ty + 5, tileSz - 16, 7);
    });
  }
}
