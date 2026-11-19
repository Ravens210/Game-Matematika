/* =====================================================================
   MINI-GAME MARKAS MERAH: TEMBAK BALON EKSPONEN (FPS 3D)
   Memuat: data soal, audio (getAudioContext, efek, musik), scene 3D, meriam cat,
   balon, ledakan cat, kembang api, modal level, dan update per frame.
   ===================================================================== */
/* =====================================================================
   BAGIAN 2: DATA SOAL EKSPONEN (5 LEVEL) & STATUS MINI-GAME FPS
   ===================================================================== */
const EXPONENT_LEVELS = [
  {
    level: 1,
    title: 'Level 1 · Pangkat Positif',
    questions: [
      { html: 'Hitunglah 2<sup>3</sup>', answer: '8', distractors: ['6', '9', '5', '12', '4', '16', '23'], explain: '2³ = 2 × 2 × 2 = 8' },
      { html: 'Hitunglah 3<sup>2</sup>', answer: '9', distractors: ['6', '8', '5', '12', '27', '3', '32'], explain: '3² = 3 × 3 = 9' },
      { html: 'Hitunglah 4<sup>2</sup>', answer: '16', distractors: ['8', '6', '12', '20', '64', '14', '42'], explain: '4² = 4 × 4 = 16' },
      { html: 'Hitunglah 5<sup>2</sup>', answer: '25', distractors: ['10', '7', '15', '35', '125', '50', '52'], explain: '5² = 5 × 5 = 25' },
      { html: 'Hitunglah 10<sup>2</sup>', answer: '100', distractors: ['20', '12', '1000', '50', '200', '102', '10'], explain: '10² = 10 × 10 = 100' }
    ]
  },
  {
    level: 2,
    title: 'Level 2 · Kali & Bagi Pangkat',
    questions: [
      { html: 'Sederhanakan 2<sup>3</sup> × 2<sup>2</sup>', answer: '32', distractors: ['16', '64', '12', '10', '25', '8', '24'], explain: '2³ × 2² = 2⁵ = 32' },
      { html: 'Sederhanakan 3<sup>4</sup> × 3<sup>1</sup>', answer: '243', distractors: ['81', '27', '15', '12', '34', '729', '9'], explain: '3⁴ × 3¹ = 3⁵ = 243' },
      { html: 'Sederhanakan 4<sup>5</sup> / 4<sup>2</sup>', answer: '64', distractors: ['16', '12', '256', '32', '8', '43', '20'], explain: '4⁵ / 4² = 4³ = 64' },
      { html: 'Sederhanakan 6<sup>3</sup> / 6<sup>1</sup>', answer: '36', distractors: ['12', '18', '216', '6', '24', '62', '3'], explain: '6³ / 6¹ = 6² = 36' },
      { html: 'Sederhanakan (2<sup>2</sup>)<sup>3</sup>', answer: '64', distractors: ['32', '12', '16', '128', '25', '8', '26'], explain: '(2²)³ = 2⁶ = 64' }
    ]
  },
  {
    level: 3,
    title: 'Level 3 · Pangkat Nol & Satu',
    questions: [
      { html: 'Hitunglah 5<sup>0</sup>', answer: '1', distractors: ['0', '5', '10', '25', '50', '2', '4'], explain: 'Bilangan ≠ 0 dipangkatkan 0 hasilnya 1' },
      { html: 'Hitunglah 8<sup>1</sup>', answer: '8', distractors: ['1', '0', '16', '64', '81', '9', '4'], explain: '8¹ = 8' },
      { html: 'Hitunglah 2<sup>0</sup> + 3<sup>1</sup>', answer: '4', distractors: ['3', '5', '6', '1', '2', '0', '7'], explain: '2⁰ + 3¹ = 1 + 3 = 4' },
      { html: 'Hitunglah 7<sup>0</sup> + 9<sup>0</sup>', answer: '2', distractors: ['16', '0', '1', '7', '9', '17', '63'], explain: '7⁰ + 9⁰ = 1 + 1 = 2' },
      { html: 'Hitunglah 4<sup>1</sup> + 6<sup>0</sup>', answer: '5', distractors: ['4', '10', '6', '1', '11', '24', '0'], explain: '4¹ + 6⁰ = 4 + 1 = 5' }
    ]
  },
  {
    level: 4,
    title: 'Level 4 · Pangkat Negatif',
    questions: [
      { html: 'Hitunglah 2<sup>-1</sup>', answer: '1/2', distractors: ['-2', '2', '1/4', '-1', '0', '1/3', '2/1'], explain: '2⁻¹ = 1 / 2¹ = 1/2' },
      { html: 'Hitunglah 3<sup>-1</sup>', answer: '1/3', distractors: ['-3', '3', '1/9', '-1', '1/2', '1/6', '0'], explain: '3⁻¹ = 1 / 3¹ = 1/3' },
      { html: 'Hitunglah 5<sup>-1</sup>', answer: '1/5', distractors: ['-5', '5', '1/25', '-1', '1/2', '1/10', '0'], explain: '5⁻¹ = 1 / 5¹ = 1/5' },
      { html: 'Hitunglah 2<sup>-2</sup>', answer: '1/4', distractors: ['-4', '4', '1/2', '-2', '1/8', '2/2', '0'], explain: '2⁻² = 1 / 2² = 1/4' },
      { html: 'Hitunglah 10<sup>-1</sup>', answer: '1/10', distractors: ['-10', '10', '1/100', '-1', '1/5', '1/2', '0'], explain: '10⁻¹ = 1 / 10¹ = 1/10' }
    ]
  },
  {
    level: 5,
    title: 'Level 5 · Campuran Sederhana',
    questions: [
      { html: 'Hitunglah 2<sup>3</sup> + 2<sup>2</sup>', answer: '12', distractors: ['32', '10', '64', '16', '8', '14', '25'], explain: '2³ + 2² = 8 + 4 = 12' },
      { html: 'Hitunglah 3<sup>2</sup> × 3<sup>0</sup>', answer: '9', distractors: ['0', '27', '3', '1', '6', '12', '18'], explain: '3² × 3⁰ = 9 × 1 = 9' },
      { html: 'Hitunglah 2<sup>4</sup> / 2<sup>2</sup>', answer: '4', distractors: ['8', '2', '16', '6', '12', '32', '1'], explain: '2⁴ / 2² = 2² = 4' },
      { html: 'Hitunglah 5<sup>1</sup> + 5<sup>0</sup>', answer: '6', distractors: ['5', '10', '25', '1', '0', '7', '15'], explain: '5¹ + 5⁰ = 5 + 1 = 6' },
      { html: 'Hitunglah (3<sup>1</sup>)<sup>2</sup>', answer: '9', distractors: ['6', '3', '27', '5', '12', '1', '81'], explain: '(3¹)² = 3² = 9' }
    ]
  }
];

const PAINT_COLORS = [
  { name: 'Merah Neon', hex: 0xff2d55, css: '#ff2d55' },
  { name: 'Biru Elektrik', hex: 0x00b4ff, css: '#00b4ff' },
  { name: 'Kuning Emas', hex: 0xffc400, css: '#ffc400' },
  { name: 'Hijau Limau', hex: 0x38d948, css: '#38d948' },
  { name: 'Ungu Violet', hex: 0x9b5de5, css: '#9b5de5' },
  { name: 'Oranye Cerah', hex: 0xff7b00, css: '#ff7b00' }
];

const BALLOON_PALETTE = [
  { main: '#ff3b30', light: '#ff9e99', dark: '#a61c14' },
  { main: '#ff9500', light: '#ffd18c', dark: '#a35e00' },
  { main: '#ffcc00', light: '#fff099', dark: '#9e7d00' },
  { main: '#34c759', light: '#9ef0b3', dark: '#1c7d34' },
  { main: '#007aff', light: '#8cc4ff', dark: '#004999' },
  { main: '#af52de', light: '#dfaef7', dark: '#6a268f' }
];

const fpsState = {
  levelIdx: 0,
  questionIdx: 0,
  score: 0,
  unlockedLevel: 1,
  soundOn: true,
  musicOn: true,
  gridSlots: [],
  balloons: [],
  projectiles: [],
  particles: [],
  shockwaves: [],
  splatDecals: [],
  confetti: [],
  clouds: [],
  paintColorIdx: 0,
  cannonRecoil: 0,
  aimPoint: new THREE.Vector3(0, 4, -14),
  mascotMood: 'idle',
  mascotMoodTimer: 0,
  victoryActive: false,
  victoryTimer: 0,
  levelJustCompleted: false
};

function createPaintSplatTexture(cssColor) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = cssColor;

  g.beginPath();
  g.arc(128, 128, 56, 0, Math.PI * 2);
  g.fill();

  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + Math.random() * 0.25;
    const dist = 48 + Math.random() * 54;
    const rad = 10 + Math.random() * 20;
    g.beginPath();
    g.arc(128 + Math.cos(a) * dist, 128 + Math.sin(a) * dist, rad, 0, Math.PI * 2);
    g.fill();
  }
  return new THREE.CanvasTexture(c);
}

/* Efek Suara Prosedural Web Audio (Permainan, Ledakan, & Kemenangan) */
let audioCtx = null;
let noiseBuffer = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (!noiseBuffer) {
    const sampleRate = audioCtx.sampleRate;
    const length = sampleRate * 1.2;
    noiseBuffer = audioCtx.createBuffer(1, length, sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return audioCtx;
}

function playTone(type, pitchBoost = 0) {
  if (!fpsState.soundOn) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'shoot') {
      /* Sound effect tembakan meriam cat: dentuman udara + gelembung cat */
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.16);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);

      /* Desis tekanan udara */
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.12, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.1);

    } else if (type === 'explosion' || type === 'explosion_big' || type === 'explosion_small') {
      /* Sound effect ledakan balon & cipratan cat */
      const isBig = type === 'explosion_big';
      const isSmall = type === 'explosion_small';
      const dur = isBig ? 0.52 : (isSmall ? 0.22 : 0.36);
      const vol = isBig ? 0.36 : (isSmall ? 0.14 : 0.26);

      /* 1. Dentuman sub-bass ledakan */
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(isBig ? 175 : 145, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + dur);
      subGain.gain.setValueAtTime(vol, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + dur);

      /* 2. Gelombang ledakan white-noise berfilter */
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isBig ? 1800 : 1200, now);
      filter.frequency.exponentialRampToValueAtTime(110, now + dur);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(vol * 0.95, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + dur);

      /* 3. Letusan karet balon pecah */
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'sawtooth';
      popOsc.frequency.setValueAtTime(520, now);
      popOsc.frequency.exponentialRampToValueAtTime(75, now + 0.09);
      popGain.gain.setValueAtTime(vol * 0.65, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.09);

    } else if (type === 'correct') {
      /* Sound effect jawaban benar: melodi naik ceria + kilau skor */
      const base = 523.25 * Math.pow(1.06, pitchBoost);
      const notes = [base, base * 1.25, base * 1.5, base * 2];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.065);
        gain.gain.setValueAtTime(0.22, now + i * 0.065);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.065 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.065);
        osc.stop(now + i * 0.065 + 0.28);
      });

    } else if (type === 'wrong') {
      /* Sound effect jawaban salah: buzzer ganda + boing balon baru */
      [185, 145].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        osc.frequency.linearRampToValueAtTime(freq - 25, now + i * 0.12 + 0.14);
        gain.gain.setValueAtTime(0.16, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.15);
      });

    } else if (type === 'spawn') {
      /* Sound effect gelembung balon bermunculan */
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);

    } else if (type === 'start') {
      /* Sound effect mulai permainan arena */
      [392.0, 523.25, 659.25, 783.99].forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + idx * 0.07);
        g.gain.setValueAtTime(0.18, now + idx * 0.07);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.24);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + idx * 0.07);
        o.stop(now + idx * 0.07 + 0.24);
      });

    } else if (type === 'victory' || type === 'levelup') {
      /* Sound effect kemenangan: Fanfare trompet & lonceng selebrasi */
      const fanfare = [
        { f: 523.25, t: 0.00, d: 0.16 },
        { f: 659.25, t: 0.13, d: 0.16 },
        { f: 783.99, t: 0.26, d: 0.16 },
        { f: 1046.50, t: 0.40, d: 0.34 },
        { f: 783.99, t: 0.72, d: 0.18 },
        { f: 1046.50, t: 0.90, d: 0.65 }
      ];
      fanfare.forEach(n => {
        /* Suara utama fanfare */
        const o1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        o1.type = 'triangle';
        o1.frequency.setValueAtTime(n.f, now + n.t);
        g1.gain.setValueAtTime(0.24, now + n.t);
        g1.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        o1.connect(g1);
        g1.connect(ctx.destination);
        o1.start(now + n.t);
        o1.stop(now + n.t + n.d);

        /* Harmoni oktaf & kuint agar terdengar megah */
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = 'sine';
        o2.frequency.setValueAtTime(n.f * 0.5, now + n.t);
        g2.gain.setValueAtTime(0.16, now + n.t);
        g2.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        o2.connect(g2);
        g2.connect(ctx.destination);
        o2.start(now + n.t);
        o2.stop(now + n.t + n.d);
      });
    }
  } catch (err) {
    /* Abaikan jika browser membatasi audio otomatis */
  }
}

/* =====================================================================
   MUSIK LATAR MINI-GAME (PROCEDURAL ARCADE CARNIVAL BGM)
   ===================================================================== */
const bgmState = {
  timerId: null,
  step: 0,
  isPlaying: false
};

// Frekuensi nada (Hz) untuk melodi ceria, bass, dan akor pengiring
const BGM_NOTES = {
  G2: 98.00, A2: 110.00, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25
};

// 32 langkah (4 birama 4/4) melodi marimba karnaval yang ramah & bersemangat
const BGM_MELODY = [
  'C4', 'E4', 'G4', 'E4', 'A4', 'G4', 'E4', 'D4',
  'F4', 'A4', 'C5', 'A4', 'G4', 'F4', 'E4', 'D4',
  'E4', 'G4', 'A4', 'C5', 'B4', 'A4', 'G4', 'E4',
  'D4', 'F4', 'G4', 'B4', 'A4', 'G4', 'E4', 'C4'
];

// Pola bass memantul di setiap ketukan
const BGM_BASS = [
  'C3', null, 'G2', null, 'C3', null, 'E3', null,
  'F3', null, 'C3', null, 'F3', null, 'G3', null,
  'A2', null, 'E3', null, 'A2', null, 'G2', null,
  'G2', null, 'D3', null, 'G3', null, 'B3', null
];

// Pola akor pengiring pada ketukan off-beat (&)
const BGM_CHORDS = [
  null, ['E4', 'G4'], null, ['E4', 'G4'], null, ['E4', 'G4'], null, ['E4', 'G4'],
  null, ['F4', 'A4'], null, ['F4', 'A4'], null, ['F4', 'A4'], null, ['F4', 'A4'],
  null, ['E4', 'A4'], null, ['E4', 'A4'], null, ['E4', 'A4'], null, ['E4', 'A4'],
  null, ['D4', 'G4'], null, ['D4', 'G4'], null, ['F4', 'B4'], null, ['F4', 'B4']
];

function triggerBgmVoice(ctx, freq, startTime, duration, waveType, peakGain) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = waveType;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

function playBgmStep() {
  if (!isFpsActive || !fpsState.musicOn || !fpsState.soundOn || fpsState.victoryActive) {
    return;
  }
  try {
    const ctx = getAudioContext();
    if (ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const idx = bgmState.step % BGM_MELODY.length;

    // 1. Melodi utama (karakter marimba lembut)
    const melNote = BGM_MELODY[idx];
    if (melNote && BGM_NOTES[melNote]) {
      triggerBgmVoice(ctx, BGM_NOTES[melNote], now, 0.21, 'triangle', 0.055);
      triggerBgmVoice(ctx, BGM_NOTES[melNote] * 2, now, 0.09, 'sine', 0.016);
    }

    // 2. Bass hangat
    const bassNote = BGM_BASS[idx];
    if (bassNote && BGM_NOTES[bassNote]) {
      triggerBgmVoice(ctx, BGM_NOTES[bassNote], now, 0.24, 'sine', 0.075);
    }

    // 3. Petikan akor ritmis ringan
    const chordNotes = BGM_CHORDS[idx];
    if (chordNotes) {
      chordNotes.forEach(n => {
        if (BGM_NOTES[n]) {
          triggerBgmVoice(ctx, BGM_NOTES[n], now, 0.12, 'triangle', 0.018);
        }
      });
    }

    bgmState.step = (bgmState.step + 1) % BGM_MELODY.length;
  } catch (err) {
    /* Abaikan jika audio context belum diizinkan */
  }
}

function startBgm() {
  stopBgm();
  if (!isFpsActive || !fpsState.musicOn || !fpsState.soundOn) return;
  bgmState.isPlaying = true;
  // Tempo meningkat sedikit pada level yang lebih tinggi
  const bpm = 124 + fpsState.levelIdx * 4;
  const stepMs = Math.round((60 / bpm / 2) * 1000);
  playBgmStep();
  bgmState.timerId = setInterval(playBgmStep, stepMs);
}

function stopBgm() {
  if (bgmState.timerId) {
    clearInterval(bgmState.timerId);
    bgmState.timerId = null;
  }
  bgmState.isPlaying = false;
}

/* Setup Scene 3D Khusus Arena FPS */
const fpsScene = new THREE.Scene();
fpsScene.fog = new THREE.FogExp2(0x9be2ff, 0.011);

const fpsCamera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 160);
const FPS_CAM_DEFAULT_POS = new THREE.Vector3(0, 2.75, 6.4);
const FPS_CAM_DEFAULT_LOOK = new THREE.Vector3(0, 3.8, -14);
const FPS_CAM_VICTORY_POS = new THREE.Vector3(1.55, 2.15, 4.55);
const FPS_CAM_VICTORY_LOOK = new THREE.Vector3(1.55, 1.65, 1.65);
const currentCamLook = FPS_CAM_DEFAULT_LOOK.clone();
fpsCamera.position.copy(FPS_CAM_DEFAULT_POS);
fpsCamera.lookAt(FPS_CAM_DEFAULT_LOOK);

const fpsRenderer = new THREE.WebGLRenderer({ canvas: $('fpsCanvas'), antialias: true });
fpsRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
fpsRenderer.setSize(innerWidth, innerHeight);

/* Pencahayaan Arena FPS */
fpsScene.add(new THREE.HemisphereLight(0xffffff, 0x3b8ea5, 1.1));
const fpsDirLight = new THREE.DirectionalLight(0xfff5d6, 0.9);
fpsDirLight.position.set(10, 22, 12);
fpsScene.add(fpsDirLight);

/* Kubah Langit Gradasi + Matahari + Awan 3D */
const skyCanvas = document.createElement('canvas');
skyCanvas.width = 64; skyCanvas.height = 256;
const skyCtx = skyCanvas.getContext('2d');
const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 256);
skyGrad.addColorStop(0, '#3a9bdc');
skyGrad.addColorStop(0.55, '#8ad4f8');
skyGrad.addColorStop(1, '#e0f6ff');
skyCtx.fillStyle = skyGrad;
skyCtx.fillRect(0, 0, 64, 256);
const skyDome = new THREE.Mesh(
  new THREE.SphereGeometry(95, 24, 16),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(skyCanvas), side: THREE.BackSide })
);
fpsScene.add(skyDome);

const sunSphere = new THREE.Mesh(
  new THREE.SphereGeometry(3.2, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xfff3a1 })
);
sunSphere.position.set(-22, 22, -55);
fpsScene.add(sunSphere);

const sunHalo = new THREE.Mesh(
  new THREE.RingGeometry(3.4, 5.4, 32),
  new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
);
sunHalo.position.copy(sunSphere.position);
fpsScene.add(sunHalo);

function makeCloud(x, y, z, scale) {
  const cg = new THREE.Group();
  const puffMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  [
    [0, 0, 0, 1.3], [-1.2, -0.2, 0.2, 1.0], [1.25, -0.15, -0.1, 1.05],
    [-0.55, 0.55, -0.15, 0.95], [0.6, 0.5, 0.1, 0.9]
  ].forEach(([px, py, pz, r]) => {
    const p = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), puffMat);
    p.position.set(px, py, pz);
    cg.add(p);
  });
  cg.position.set(x, y, z);
  cg.scale.setScalar(scale);
  fpsScene.add(cg);
  fpsState.clouds.push({ mesh: cg, speed: 0.35 + Math.random() * 0.35 });
}
makeCloud(-24, 15, -42, 1.5);
makeCloud(-6, 17, -48, 1.2);
makeCloud(16, 15.5, -44, 1.6);
makeCloud(30, 13.5, -38, 1.15);

/* Latar Belakang Laut Laguna, Pulau Tropis & Mercusuar Karnaval */
const seaMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(180, 110),
  new THREE.MeshLambertMaterial({ color: 0x1fc3cf })
);
seaMesh.rotation.x = -Math.PI / 2;
seaMesh.position.set(0, -1.5, -48);
fpsScene.add(seaMesh);

/* Pulau tropis berlapis */
[
  [-22, 0.2, -46, 15, 5.5, 0x58b847],
  [-11, -0.2, -44, 11, 4.0, 0x6fd158],
  [15, 0.0, -45, 13, 4.8, 0x58b847],
  [26, 0.4, -47, 16, 6.2, 0x45a336]
].forEach(([ix, iy, iz, ir, ih, ic]) => {
  const hill = new THREE.Mesh(new THREE.ConeGeometry(ir, ih, 18), new THREE.MeshLambertMaterial({ color: ic }));
  hill.position.set(ix, iy, iz);
  fpsScene.add(hill);
});

/* Pohon palem hias */
function makePalmTree(x, y, z) {
  const pg = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, 3.4, 8), new THREE.MeshLambertMaterial({ color: 0x8d5524 }));
  trunk.position.y = 1.7;
  pg.add(trunk);
  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.45), new THREE.MeshLambertMaterial({ color: 0x2fa84f }));
    leaf.position.set(Math.cos(i * Math.PI / 3) * 0.85, 3.35, Math.sin(i * Math.PI / 3) * 0.85);
    leaf.rotation.y = -i * Math.PI / 3;
    leaf.rotation.z = -0.35;
    pg.add(leaf);
  }
  pg.position.set(x, y, z);
  fpsScene.add(pg);
}
makePalmTree(-17, 0.5, -36);
makePalmTree(18.5, 0.5, -37);

/* Mercusuar Merah-Putih di Pulau Kanan */
const lighthouse = new THREE.Group();
for (let s = 0; s < 5; s++) {
  const seg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65 - s * 0.06, 0.72 - s * 0.06, 1.1, 14),
    new THREE.MeshLambertMaterial({ color: s % 2 === 0 ? 0xd8362f : 0xffffff })
  );
  seg.position.y = 0.55 + s * 1.1;
  lighthouse.add(seg);
}
const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.7, 12), new THREE.MeshBasicMaterial({ color: 0xfff3a1 }));
lantern.position.y = 5.95;
const cap = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.7, 12), new THREE.MeshLambertMaterial({ color: 0xd8362f }));
cap.position.y = 6.65;
lighthouse.add(lantern, cap);
lighthouse.position.set(13.5, 0.4, -38);
fpsScene.add(lighthouse);

/* Dek Kayu Panggung Penembak + Pagar Langkan */
const deckMesh = new THREE.Mesh(
  new THREE.BoxGeometry(18, 0.6, 7),
  new THREE.MeshLambertMaterial({ color: 0xc88d55 })
);
deckMesh.position.set(0, -0.3, 1.5);
fpsScene.add(deckMesh);

const railBar = new THREE.Mesh(
  new THREE.BoxGeometry(16, 0.24, 0.32),
  new THREE.MeshLambertMaterial({ color: 0xe2ab70 })
);
railBar.position.set(0, 0.9, -1.7);
fpsScene.add(railBar);

for (let rx = -7.2; rx <= 7.2; rx += 0.9) {
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.14, 1.0, 10),
    new THREE.MeshLambertMaterial({ color: 0xd69a5e })
  );
  post.position.set(rx, 0.42, -1.7);
  fpsScene.add(post);
}

/* Bingkai Arena Target Balon (Tiang Bambu & Hiasan Bendera Segitiga) */
const bambooMat = new THREE.MeshLambertMaterial({ color: 0xb99254 });
const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 9.2, 12), bambooMat);
leftPost.position.set(-6.4, 4.1, -14);
const rightPost = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 9.2, 12), bambooMat);
rightPost.position.set(6.4, 4.1, -14);
const topBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 13.4, 12), bambooMat);
topBeam.rotation.z = Math.PI / 2;
topBeam.position.set(0, 8.2, -14);
fpsScene.add(leftPost, rightPost, topBeam);

/* Bendera segitiga warna-warni di bawah palang atas */
const flagColors = [0xff2d55, 0xffc400, 0x00d4ff, 0x38d948, 0x9b5de5, 0xff7b00];
for (let f = 0; f < 16; f++) {
  const fx = -5.7 + f * 0.76;
  const flag = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 0.55, 3),
    new THREE.MeshLambertMaterial({ color: flagColors[f % flagColors.length] })
  );
  flag.rotation.x = Math.PI;
  flag.position.set(fx, 7.75, -13.95);
  fpsScene.add(flag);
}

/* Papan Belakang Arena Target (Tempat Cipratan Cat Menempel) */
const backBoard = new THREE.Mesh(
  new THREE.PlaneGeometry(12.6, 8.2),
  new THREE.MeshLambertMaterial({ color: 0xf8fbff, transparent: true, opacity: 0.42 })
);
backBoard.position.set(0, 4.1, -14.65);
fpsScene.add(backBoard);

/* =====================================================================
   KARAKTER PEMAIN + SENJATA PELONTAR CAT + MASKOT PELUKIS DI KANAN
   ===================================================================== */
const SHOOTER_X = 2.05;

/* Podium Kayu Kecil untuk Karakter Pemain & Meriam Cat */
const charPlatform = new THREE.Mesh(
  new THREE.BoxGeometry(1.15, 0.36, 1.15),
  new THREE.MeshLambertMaterial({ color: 0xa66e38 })
);
charPlatform.position.set(0.90, 0.18, 1.55);
fpsScene.add(charPlatform);

/* Karakter Pemain (Menyesuaikan Warna Baju dari Toko Kota) */
const fpsPlayerChar = makeChar(0x2f6fe0, 0x2b2b35);
fpsPlayerChar.torso.m.material = hero.torso.m.material.clone();
fpsPlayerChar.g.scale.setScalar(0.38);
fpsPlayerChar.g.position.set(0.90, 0.36, 1.55);
fpsPlayerChar.g.rotation.y = Math.PI - 0.38;
fpsScene.add(fpsPlayerChar.g);

const cannonPedestal = new THREE.Mesh(
  new THREE.CylinderGeometry(0.75, 0.85, 0.42, 20),
  new THREE.MeshLambertMaterial({ color: 0x8c5828 })
);
cannonPedestal.position.set(SHOOTER_X, 0.21, 2.05);
fpsScene.add(cannonPedestal);

const cannonBase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.64, 0.86, 0.32, 20),
  new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.35, metalness: 0.4 })
);
cannonBase.position.set(SHOOTER_X, 0.56, 2.05);
fpsScene.add(cannonBase);

const cannonPivot = new THREE.Group();
cannonPivot.position.set(SHOOTER_X, 1.04, 2.05);
fpsScene.add(cannonPivot);

const cannonBody = new THREE.Group();
cannonBody.position.z = -0.35;
cannonPivot.add(cannonBody);

const barrel = new THREE.Mesh(
  new THREE.CylinderGeometry(0.38, 0.54, 1.55, 22),
  new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.3, metalness: 0.5 })
);
barrel.rotation.x = Math.PI / 2;
cannonBody.add(barrel);

const muzzleRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.38, 0.08, 12, 24),
  new THREE.MeshStandardMaterial({ color: 0xffc400, roughness: 0.25, metalness: 0.5 })
);
muzzleRing.position.z = -0.76;
cannonBody.add(muzzleRing);

/* Tabung Tangki Cat Berwarna di Atas Laras Meriam */
const paintTankMat = new THREE.MeshStandardMaterial({
  color: PAINT_COLORS[0].hex,
  emissive: PAINT_COLORS[0].hex,
  emissiveIntensity: 0.28,
  roughness: 0.25
});
const paintTankMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(0.24, 0.24, 0.62, 16),
  paintTankMat
);
paintTankMesh.position.set(0, 0.46, 0.08);
cannonBody.add(paintTankMesh);

const tankCap = new THREE.Mesh(
  new THREE.CylinderGeometry(0.26, 0.26, 0.1, 16),
  new THREE.MeshStandardMaterial({ color: 0x263238 })
);
tankCap.position.set(0, 0.79, 0.08);
cannonBody.add(tankCap);

/* Roda samping meriam */
[-0.55, 0.55].forEach(wx => {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.34, 0.14, 16),
    new THREE.MeshLambertMaterial({ color: 0x5d4037 })
  );
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(wx, -0.28, 0.15);
  cannonBody.add(wheel);
});

/* Maskot Kucing Pelukis di Sebelah Kanan Meriam */
const mascotPlatform = new THREE.Mesh(
  new THREE.CylinderGeometry(0.62, 0.72, 0.38, 16),
  new THREE.MeshLambertMaterial({ color: 0xa66e38 })
);
mascotPlatform.position.set(3.05, 0.19, 1.75);
fpsScene.add(mascotPlatform);

const mascotGroup = new THREE.Group();
mascotGroup.position.set(3.05, 0.38, 1.75);
mascotGroup.rotation.y = -0.35;
fpsScene.add(mascotGroup);

const catGray = new THREE.MeshLambertMaterial({ color: 0x7c8089 });
const catBelly = new THREE.MeshLambertMaterial({ color: 0xd9dde6 });
const catPink = new THREE.MeshLambertMaterial({ color: 0xff8fa3 });
const catDark = new THREE.MeshBasicMaterial({ color: 0x1b1d24 });

const catBody = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.85, 16), catGray);
catBody.position.y = 0.42;
mascotGroup.add(catBody);

const bellyPatch = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 12), catBelly);
bellyPatch.position.set(0, 0.38, 0.24);
bellyPatch.scale.set(0.85, 1.1, 0.5);
mascotGroup.add(bellyPatch);

const catHead = new THREE.Mesh(new THREE.SphereGeometry(0.48, 18, 16), catGray);
catHead.position.set(0, 1.12, 0.04);
catHead.scale.set(1.12, 0.96, 0.98);
mascotGroup.add(catHead);

/* Topi baret pelukis merah di kepala maskot */
const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.28, 0.14, 16), new THREE.MeshLambertMaterial({ color: 0xd8362f }));
beret.position.set(-0.08, 1.56, 0.04);
beret.rotation.z = 0.22;
mascotGroup.add(beret);

[-0.3, 0.3].forEach((ex, idx) => {
  const ear = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.36, 4), catGray);
  ear.position.set(ex, 1.54, 0.02);
  ear.rotation.z = idx === 0 ? 0.28 : -0.28;
  mascotGroup.add(ear);

  const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 4), catPink);
  innerEar.position.set(ex, 1.51, 0.08);
  innerEar.rotation.z = idx === 0 ? 0.28 : -0.28;
  mascotGroup.add(innerEar);

  const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  eyeWhite.position.set(ex * 0.65, 1.16, 0.44);
  mascotGroup.add(eyeWhite);

  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), catDark);
  pupil.position.set(ex * 0.65, 1.16, 0.52);
  mascotGroup.add(pupil);
});

const nose = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), catPink);
nose.position.set(0, 1.04, 0.51);
mascotGroup.add(nose);

/* =====================================================================
   GRID BALON BESAR & PADAT (7 KOLOM x 5 BARIS) & TEKSTUR ANGKA BESAR
   ===================================================================== */
const BALLOON_BASE_SCALE = 1.48;

function initGridSlots() {
  fpsState.gridSlots = [];
  const rows = 5;
  const cols = 7;
  const spacingX = 1.72;
  const spacingY = 1.24;
  const startY = 6.72;

  for (let r = 0; r < rows; r++) {
    const offsetX = (r % 2 === 1) ? spacingX * 0.36 : -spacingX * 0.36;
    for (let c = 0; c < cols; c++) {
      const x = (c - (cols - 1) / 2) * spacingX + offsetX * 0.5;
      const y = startY - r * spacingY;
      fpsState.gridSlots.push({ x, y, z: -14.0, occupied: false });
    }
  }
}
initGridSlots();

function createBalloonTexture(text, palette) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  /* Badan balon bulat besar mengilap */
  const grad = ctx.createRadialGradient(184, 164, 34, 256, 244, 232);
  grad.addColorStop(0, palette.light);
  grad.addColorStop(0.45, palette.main);
  grad.addColorStop(1, palette.dark);

  ctx.beginPath();
  ctx.arc(256, 240, 224, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.stroke();

  /* Kilau pantulan cahaya */
  ctx.beginPath();
  ctx.ellipse(168, 146, 48, 24, -0.55, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.fill();

  /* Simpul tali balon bawah */
  ctx.beginPath();
  ctx.moveTo(232, 460);
  ctx.lineTo(280, 460);
  ctx.lineTo(256, 498);
  ctx.closePath();
  ctx.fillStyle = palette.dark;
  ctx.fill();

  /* Lingkaran label putih besar di tengah agar angka eksponen sangat jelas */
  ctx.beginPath();
  ctx.arc(256, 246, 152, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = palette.dark;
  ctx.stroke();

  /* Teks angka jawaban berukuran besar & tegas */
  const fontSize = text.length >= 4 ? 104 : (text.length === 3 ? 124 : 150);
  ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#11141c';
  ctx.fillText(text, 256, 252);

  return new THREE.CanvasTexture(canvas);
}

/* Membersihkan Semua Balon (dan Opsional Cipratan Cat Papan) */
function clearBalloons(clearSplats = false) {
  for (const b of fpsState.balloons) {
    fpsScene.remove(b.mesh);
    b.mesh.material.map.dispose();
    b.mesh.material.dispose();
  }
  fpsState.balloons = [];
  for (const slot of fpsState.gridSlots) slot.occupied = false;

  if (clearSplats) {
    for (const d of fpsState.splatDecals) {
      fpsScene.remove(d.mesh);
      d.mesh.material.map.dispose();
      d.mesh.material.dispose();
    }
    fpsState.splatDecals = [];
  }
}

function spawnBalloonAtSlot(slotIdx, labelText, isCorrect, paletteIdx) {
  const slot = fpsState.gridSlots[slotIdx];
  if (!slot) return;
  slot.occupied = true;

  const palette = BALLOON_PALETTE[paletteIdx % BALLOON_PALETTE.length];
  const tex = createBalloonTexture(labelText, palette);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.position.set(slot.x, slot.y, slot.z);
  sprite.scale.set(0.01, 0.01, 1);
  fpsScene.add(sprite);

  fpsState.balloons.push({
    mesh: sprite,
    slotIdx,
    baseX: slot.x,
    baseY: slot.y,
    text: labelText,
    isCorrect,
    phase: Math.random() * Math.PI * 2,
    spawnScale: 0.01
  });
}

/* Memuat Pertanyaan Aktif & Mengisi Balon Besar Secara Padat */
function loadCurrentQuestion() {
  clearBalloons(false);
  const levelData = EXPONENT_LEVELS[fpsState.levelIdx];
  const qObj = levelData.questions[fpsState.questionIdx];

  $('fpsLevelLabel').textContent = `Level ${levelData.level} / ${EXPONENT_LEVELS.length}`;
  $('fpsQuestionCount').textContent = `Soal ${fpsState.questionIdx + 1} / ${levelData.questions.length}`;
  $('fpsScoreLabel').textContent = `Skor: ${fpsState.score}`;
  $('qLevelTopic').textContent = levelData.title;
  $('qBadge').textContent = `${fpsState.questionIdx + 1}/${levelData.questions.length}`;
  $('qTextDisplay').innerHTML = qObj.html;

  /* Acak seluruh indeks slot grid (35 slot) dan ambil 22 balon besar padat */
  const allIndices = fpsState.gridSlots.map((_, idx) => idx);
  for (let i = allIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
  }

  const totalBalloons = 22;
  const chosenSlots = allIndices.slice(0, totalBalloons);

  /* Slot pertama untuk jawaban benar, sisanya pengecoh */
  spawnBalloonAtSlot(chosenSlots[0], qObj.answer, true, Math.floor(Math.random() * BALLOON_PALETTE.length));
  for (let i = 1; i < chosenSlots.length; i++) {
    const wrongText = qObj.distractors[(i - 1) % qObj.distractors.length];
    spawnBalloonAtSlot(chosenSlots[i], wrongText, false, i + fpsState.questionIdx);
  }
  playTone('spawn');
}

/* Jika Salah Menembak -> Munculkan 3 Balon Pengecoh Tambahan */
function spawnPenaltyBalloons(count = 3) {
  const levelData = EXPONENT_LEVELS[fpsState.levelIdx];
  const qObj = levelData.questions[fpsState.questionIdx];
  const emptySlots = fpsState.gridSlots
    .map((s, idx) => (!s.occupied ? idx : -1))
    .filter(idx => idx !== -1);

  for (let k = 0; k < count && emptySlots.length > 0; k++) {
    const pick = Math.floor(Math.random() * emptySlots.length);
    const slotIdx = emptySlots.splice(pick, 1)[0];
    const wrongText = qObj.distractors[Math.floor(Math.random() * qObj.distractors.length)];
    spawnBalloonAtSlot(slotIdx, wrongText, false, Math.floor(Math.random() * BALLOON_PALETTE.length));
  }
}

/* Efek Ledakan Cat Saat Mengenai Balon */
function spawnPaintExplosion(position, paintObj, isCorrect) {
  /* 1. Tetesan cat 3D beterbangan ke segala arah */
  const dropCount = isCorrect ? 26 : 18;
  for (let i = 0; i < dropCount; i++) {
    const drop = new THREE.Mesh(
      new THREE.SphereGeometry(0.09 + Math.random() * 0.08, 8, 8),
      new THREE.MeshBasicMaterial({ color: isCorrect && i % 3 === 0 ? 0xffd60a : paintObj.hex })
    );
    drop.position.copy(position);
    const ang = Math.random() * Math.PI * 2;
    const spd = 2.4 + Math.random() * 4.5;
    fpsScene.add(drop);
    fpsState.particles.push({
      mesh: drop,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd + 1.5,
      vz: (Math.random() - 0.5) * 3.2,
      life: 0.65 + Math.random() * 0.25
    });
  }

  /* 2. Cincin gelombang kejut cat */
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.25, 0.55, 24),
    new THREE.MeshBasicMaterial({ color: paintObj.hex, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
  );
  ring.position.set(position.x, position.y, position.z + 0.15);
  fpsScene.add(ring);
  fpsState.shockwaves.push({ mesh: ring, life: 0.38, maxLife: 0.38 });

  /* 3. Noda cipratan cat menempel di papan belakang & menghilang perlahan setelah 3 detik */
  const splatMat = new THREE.MeshBasicMaterial({
    map: createPaintSplatTexture(paintObj.css),
    transparent: true,
    opacity: 0.88,
    depthWrite: false
  });
  const splatMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), splatMat);
  splatMesh.position.set(position.x, position.y, -14.62 + (fpsState.splatDecals.length % 5) * 0.004);
  splatMesh.rotation.z = Math.random() * Math.PI * 2;
  fpsScene.add(splatMesh);
  fpsState.splatDecals.push({
    mesh: splatMesh,
    age: 0,
    holdDuration: 3.0,
    fadeDuration: 1.5,
    initialOpacity: 0.88
  });

  /* Batasi jumlah noda cat di papan agar tetap ringan */
  if (fpsState.splatDecals.length > 24) {
    const oldest = fpsState.splatDecals.shift();
    fpsScene.remove(oldest.mesh);
    oldest.mesh.material.map.dispose();
    oldest.mesh.material.dispose();
  }
}

/* Konfeti & Kembang Api Cat untuk Animasi Kemenangan Level */
function spawnVictoryFireworks() {
  const confettiColors = [0xff2d55, 0xffc400, 0x00e5ff, 0x76ff03, 0xd500f9, 0xff9100];
  for (let i = 0; i < 65; i++) {
    const col = confettiColors[i % confettiColors.length];
    const conf = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.1),
      new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })
    );
    conf.position.set(
      (Math.random() - 0.5) * 7.5,
      3.8 + Math.random() * 3.8,
      -1.5 + Math.random() * 4.5
    );
    fpsScene.add(conf);
    fpsState.confetti.push({
      mesh: conf,
      vx: (Math.random() - 0.5) * 2.2,
      vy: 1.5 + Math.random() * 2.8,
      vz: (Math.random() - 0.5) * 1.8,
      rx: (Math.random() - 0.5) * 10,
      ry: (Math.random() - 0.5) * 10,
      rz: (Math.random() - 0.5) * 10,
      life: 3.4 + Math.random() * 1.2
    });
  }

  /* Ledakan cat perayaan di udara sekitar panggung */
  [
    new THREE.Vector3(-1.2, 3.6, -2.5),
    new THREE.Vector3(1.8, 4.1, -2.0),
    new THREE.Vector3(3.4, 3.5, -2.5)
  ].forEach((posBurst, idx) => {
    const pCol = PAINT_COLORS[(fpsState.paintColorIdx + idx) % PAINT_COLORS.length];
    for (let j = 0; j < 18; j++) {
      const drop = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 8, 8),
        new THREE.MeshBasicMaterial({ color: pCol.hex })
      );
      drop.position.copy(posBurst);
      const ang = (j / 18) * Math.PI * 2;
      const spd = 2.5 + Math.random() * 3.5;
      fpsScene.add(drop);
      fpsState.particles.push({
        mesh: drop,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd + 1.8,
        vz: (Math.random() - 0.5) * 2.5,
        life: 0.95
      });
    }
  });
}

/* Memulai Sekuens Animasi & Tarian Emote Kemenangan */
let victoryModalTimer = null;
function triggerVictoryCelebration(duration = 2.6, openModalAfter = true) {
  clearTimeout(victoryModalTimer);
  const levelNum = fpsState.levelIdx + 1;
  fpsState.victoryActive = true;
  fpsState.victoryTimer = duration;
  fpsState.mascotMood = 'victory';
  fpsState.mascotMoodTimer = duration + 10;
  stopBgm();
  playTone('victory');
  playTone('explosion_big');
  spawnVictoryFireworks();
  toast(`🎉 Level ${levelNum} Selesai! Tarian Emote Kemenangan!`);

  if (openModalAfter) {
    victoryModalTimer = setTimeout(() => {
      if (isFpsActive) showLevelCompleteModal(false);
    }, duration * 1000);
  }
}

/* Logika Saat Peluru Cat Mengenai Balon */
function handleBalloonHit(balloon, paintObj) {
  const idx = fpsState.balloons.indexOf(balloon);
  if (idx === -1) return;

  const levelData = EXPONENT_LEVELS[fpsState.levelIdx];
  const qObj = levelData.questions[fpsState.questionIdx];

  /* Hapus balon yang tertembak */
  const hitPos = balloon.mesh.position.clone();
  fpsState.gridSlots[balloon.slotIdx].occupied = false;
  fpsScene.remove(balloon.mesh);
  balloon.mesh.material.map.dispose();
  balloon.mesh.material.dispose();
  fpsState.balloons.splice(idx, 1);

  /* Ledakan cat saat peluru menghantam balon */
  playTone(balloon.isCorrect ? 'explosion_big' : 'explosion');
  spawnPaintExplosion(hitPos, paintObj, balloon.isCorrect);

  if (balloon.isCorrect) {
    /* JAWABAN BENAR: Tambah skor, ganti pertanyaan selanjutnya / selesaikan level */
    playTone('correct', fpsState.questionIdx);
    fpsState.score += 100;
    $('fpsScoreLabel').textContent = `Skor: ${fpsState.score}`;
    fpsState.mascotMood = 'happy';
    fpsState.mascotMoodTimer = 1.2;

    toast(`✅ Benar! ${qObj.explain}`);

    if (fpsState.questionIdx + 1 < levelData.questions.length) {
      fpsState.questionIdx++;
      setTimeout(() => {
        if (isFpsActive) loadCurrentQuestion();
      }, 460);
    } else {
      /* Semua 5 soal pada level ini selesai -> Jalankan Animasi & Tarian Kemenangan! */
      fpsState.levelJustCompleted = true;
      setTimeout(() => {
        if (isFpsActive) triggerVictoryCelebration(2.6, true);
      }, 350);
    }
  } else {
    /* JAWABAN SALAH: Munculkan 3 balon baru di grid */
    playTone('wrong');
    fpsState.mascotMood = 'sad';
    fpsState.mascotMoodTimer = 0.9;
    spawnPenaltyBalloons(3);
    toast(`❌ Kurang tepat (${balloon.text}). Muncul balon baru!`);
  }
}

/* Bidikan Raycaster & Arah Meriam Cat di Sebelah Kanan */
const raycaster = new THREE.Raycaster();
const aimPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 14.0);

function updateAimFromClientXY(clientX, clientY) {
  const ch = $('crosshair');
  ch.style.left = clientX + 'px';
  ch.style.top = clientY + 'px';

  const ndc = new THREE.Vector2(
    (clientX / innerWidth) * 2 - 1,
    -(clientY / innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(ndc, fpsCamera);
  const hit = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(aimPlane, hit)) {
    hit.x = Math.max(-7.2, Math.min(7.2, hit.x));
    hit.y = Math.max(1.0, Math.min(8.2, hit.y));
    fpsState.aimPoint.copy(hit);
    cannonPivot.lookAt(fpsState.aimPoint);
  }
}

/* Menembakkan Peluru Cat */
function firePaintCannon() {
  if (!isFpsActive || $('fpsModal').classList.contains('show') || fpsState.victoryActive) return;

  const activePaint = PAINT_COLORS[fpsState.paintColorIdx % PAINT_COLORS.length];
  fpsState.paintColorIdx++;
  const nextPaint = PAINT_COLORS[fpsState.paintColorIdx % PAINT_COLORS.length];
  paintTankMat.color.setHex(nextPaint.hex);
  paintTankMat.emissive.setHex(nextPaint.hex);

  playTone('shoot');
  fpsState.cannonRecoil = 0.24;

  const ch = $('crosshair');
  ch.classList.add('shoot');
  setTimeout(() => ch.classList.remove('shoot'), 110);

  /* Posisi moncong meriam cat di sebelah kanan */
  const muzzlePos = new THREE.Vector3(SHOOTER_X, 1.12, 1.02);
  const projMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 14, 14),
    new THREE.MeshBasicMaterial({ color: activePaint.hex })
  );
  projMesh.position.copy(muzzlePos);
  fpsScene.add(projMesh);

  const dir = fpsState.aimPoint.clone().sub(muzzlePos).normalize();
  fpsState.projectiles.push({
    mesh: projMesh,
    vel: dir.multiplyScalar(44),
    paint: activePaint,
    trailTimer: 0,
    life: 1.4
  });
}

/* Tampilan Modal Selesai Level & Navigasi ke Level Selanjutnya */
function showLevelCompleteModal(isManualSelector = false) {
  const modal = $('fpsModal');
  const levelNum = fpsState.levelIdx + 1;
  const grid = $('modalLevelGrid');
  const nextBtn = $('modalNextBtn');
  const danceBtn = $('modalDanceBtn');

  if (!isManualSelector) {
    danceBtn.style.display = 'block';
    danceBtn.onclick = () => {
      modal.classList.remove('show');
      triggerVictoryCelebration(2.8, true);
    };

    if (levelNum < EXPONENT_LEVELS.length) {
      fpsState.unlockedLevel = Math.max(fpsState.unlockedLevel, levelNum + 1);
      $('modalTitle').textContent = `🎉 Level ${levelNum} Selesai!`;
      $('modalDesc').textContent = `Luar biasa! Kamu menyelesaikan semua soal ${EXPONENT_LEVELS[fpsState.levelIdx].title}. Skor saat ini: ${fpsState.score}.`;
      nextBtn.style.display = 'block';
      nextBtn.textContent = `Lanjut ke Level ${levelNum + 1} ➔`;
      nextBtn.onclick = () => {
        modal.classList.remove('show');
        fpsState.victoryActive = false;
        fpsState.levelIdx++;
        fpsState.questionIdx = 0;
        clearBalloons(true);
        loadCurrentQuestion();
        startBgm();
      };
    } else {
      $('modalTitle').textContent = `🏆 Selamat! Semua 5 Level Tamat!`;
      $('modalDesc').textContent = `Kamu telah menaklukkan seluruh materi eksponen dari Level 1 sampai Level 5 dengan skor akhir ${fpsState.score}!`;
      nextBtn.style.display = 'block';
      nextBtn.textContent = `Main Ulang dari Level 1 ↻`;
      nextBtn.onclick = () => {
        modal.classList.remove('show');
        fpsState.victoryActive = false;
        fpsState.levelIdx = 0;
        fpsState.questionIdx = 0;
        fpsState.score = 0;
        clearBalloons(true);
        loadCurrentQuestion();
        startBgm();
      };
    }
  } else {
    danceBtn.style.display = 'none';
    $('modalTitle').textContent = `Pilih Level Eksponen`;
    $('modalDesc').textContent = `Selesaikan tiap level untuk membuka tantangan eksponen berikutnya.`;
    nextBtn.style.display = 'none';
  }

  /* Render Tombol Level 1 - 5 */
  grid.innerHTML = '';
  EXPONENT_LEVELS.forEach((lvl, idx) => {
    const btn = document.createElement('button');
    const unlocked = (idx + 1) <= fpsState.unlockedLevel;
    btn.className = 'lvlChip' + (unlocked ? ' unlocked' : '') + (idx === fpsState.levelIdx ? ' current' : '');
    btn.textContent = `Lvl ${lvl.level}`;
    btn.disabled = !unlocked;
    btn.onclick = () => {
      fpsState.levelIdx = idx;
      fpsState.questionIdx = 0;
      fpsState.victoryActive = false;
      modal.classList.remove('show');
      clearBalloons(true);
      loadCurrentQuestion();
      startBgm();
    };
    grid.appendChild(btn);
  });

  modal.classList.add('show');
}

/* Membuka & Menutup Mini-Game */
function openExponentMiniGame() {
  isFpsActive = true;
  fpsState.victoryActive = false;
  fpsState.levelJustCompleted = false;
  fpsPlayerChar.torso.m.material.color.copy(hero.torso.m.material.color);
  if (document.pointerLockElement) document.exitPointerLock();
  $('fpsOverlay').classList.add('active');
  $('crosshair').style.display = 'block';
  $('fpsModal').classList.remove('show');
  fpsRenderer.setSize(innerWidth, innerHeight);
  fpsCamera.aspect = innerWidth / innerHeight;
  fpsCamera.updateProjectionMatrix();
  fpsCamera.position.copy(FPS_CAM_DEFAULT_POS);
  currentCamLook.copy(FPS_CAM_DEFAULT_LOOK);
  fpsCamera.lookAt(currentCamLook);
  updateAimFromClientXY(innerWidth * 0.5, innerHeight * 0.42);
  bgmState.step = 0;
  playTone('start');
  startBgm();
  clearBalloons(true);
  loadCurrentQuestion();
}

function closeExponentMiniGame() {
  clearTimeout(victoryModalTimer);
  isFpsActive = false;
  fpsState.victoryActive = false;
  stopBgm();
  $('fpsOverlay').classList.remove('active');
  $('crosshair').style.display = 'none';
  $('fpsModal').classList.remove('show');
  if (fpsState.levelJustCompleted) {
    emote = 'dance';
    emoteT = 3.5;
    fpsState.levelJustCompleted = false;
  }
}

/* Event Listener Input di dalam Mini-Game FPS */
const fpsOverlay = $('fpsOverlay');
fpsOverlay.addEventListener('pointermove', e => {
  if (!isFpsActive) return;
  updateAimFromClientXY(e.clientX, e.clientY);
});
fpsOverlay.addEventListener('pointerdown', e => {
  if (!isFpsActive) return;
  if (e.target.closest('#fpsTopBar') || e.target.closest('#fpsModal')) return;
  if (fpsState.musicOn && fpsState.soundOn && !bgmState.isPlaying && !fpsState.victoryActive) {
    startBgm();
  }
  updateAimFromClientXY(e.clientX, e.clientY);
  firePaintCannon();
});

$('fpsExitBtn').addEventListener('click', closeExponentMiniGame);
$('fpsLevelSelectBtn').addEventListener('click', () => showLevelCompleteModal(true));
$('modalCloseBtn').addEventListener('click', () => {
  $('fpsModal').classList.remove('show');
  if (!fpsState.victoryActive) startBgm();
});
$('fpsMusicBtn').addEventListener('click', () => {
  fpsState.musicOn = !fpsState.musicOn;
  $('fpsMusicBtn').textContent = fpsState.musicOn ? '🎵' : '🔇';
  $('fpsMusicBtn').classList.toggle('muted', !fpsState.musicOn);
  if (fpsState.musicOn && fpsState.soundOn && !fpsState.victoryActive) {
    startBgm();
  } else {
    stopBgm();
  }
});
$('fpsSoundBtn').addEventListener('click', () => {
  fpsState.soundOn = !fpsState.soundOn;
  $('fpsSoundBtn').textContent = fpsState.soundOn ? '🔊' : '🔇';
  $('fpsSoundBtn').classList.toggle('muted', !fpsState.soundOn);
  if (fpsState.soundOn && fpsState.musicOn && !fpsState.victoryActive) {
    startBgm();
  } else {
    stopBgm();
  }
});

/* Update Animasi Arena FPS */
function updateFpsMiniGame(dt, elapsed) {
  /* Transisi kamera mulus antara mode menembak & selebrasi kemenangan */
  const targetCamPos = fpsState.victoryActive ? FPS_CAM_VICTORY_POS : FPS_CAM_DEFAULT_POS;
  const targetCamLook = fpsState.victoryActive ? FPS_CAM_VICTORY_LOOK : FPS_CAM_DEFAULT_LOOK;
  fpsCamera.position.lerp(targetCamPos, Math.min(1, dt * 4.5));
  currentCamLook.lerp(targetCamLook, Math.min(1, dt * 4.5));
  fpsCamera.lookAt(currentCamLook);

  /* Animasi awan melayang pelan */
  for (const cl of fpsState.clouds) {
    cl.mesh.position.x += cl.speed * dt;
    if (cl.mesh.position.x > 36) cl.mesh.position.x = -36;
  }

  /* Bekas cipratan cat bertahan 3 detik lalu menghilang secara perlahan */
  for (let i = fpsState.splatDecals.length - 1; i >= 0; i--) {
    const d = fpsState.splatDecals[i];
    d.age += dt;
    if (d.age > d.holdDuration) {
      const fadeProgress = (d.age - d.holdDuration) / d.fadeDuration;
      d.mesh.material.opacity = Math.max(0, d.initialOpacity * (1 - fadeProgress));
      d.mesh.position.y -= dt * 0.05;
      if (fadeProgress >= 1) {
        fpsScene.remove(d.mesh);
        d.mesh.material.map.dispose();
        d.mesh.material.dispose();
        fpsState.splatDecals.splice(i, 1);
      }
    }
  }

  /* Animasi hentakan (recoil) meriam cat saat menembak */
  if (fpsState.cannonRecoil > 0) {
    fpsState.cannonRecoil = Math.max(0, fpsState.cannonRecoil - dt * 1.8);
    cannonBody.position.z = -0.35 + fpsState.cannonRecoil;
  }

  /* Animasi mengambang & munculnya balon berukuran besar */
  for (const b of fpsState.balloons) {
    if (b.spawnScale < BALLOON_BASE_SCALE) {
      b.spawnScale = Math.min(BALLOON_BASE_SCALE, b.spawnScale + dt * 7.5);
      b.mesh.scale.setScalar(b.spawnScale);
    }
    b.mesh.position.y = b.baseY + Math.sin(elapsed * 2.6 + b.phase) * 0.07;
  }

  /* Animasi Karakter Pemain & Maskot (Termasuk Tarian Emote Kemenangan) */
  if (fpsState.victoryActive) {
    const beat = elapsed * 10;
    const hop = Math.abs(Math.sin(beat)) * 0.28;

    /* Tarian Emote Kemenangan Karakter Pemain menghadap kamera */
    fpsPlayerChar.g.position.y = 0.36 + hop;
    fpsPlayerChar.g.rotation.y = Math.sin(elapsed * 3.2) * 0.55 + (Math.floor(elapsed * 1.2) % 3 === 0 ? (elapsed * 6) % (Math.PI * 2) : 0);
    fpsPlayerChar.torso.p.rotation.z = Math.sin(beat * 0.5) * 0.16;
    fpsPlayerChar.armL.p.rotation.z = -2.55 + Math.sin(beat) * 0.45;
    fpsPlayerChar.armR.p.rotation.z = 2.55 + Math.cos(beat) * 0.45;
    fpsPlayerChar.armL.p.rotation.x = Math.cos(beat * 0.5) * 0.35;
    fpsPlayerChar.armR.p.rotation.x = -Math.cos(beat * 0.5) * 0.35;
    fpsPlayerChar.legL.p.rotation.x = Math.sin(beat) * 0.45;
    fpsPlayerChar.legR.p.rotation.x = -Math.sin(beat) * 0.45;

    /* Tarian Selebrasi Maskot Kucing Pelukis */
    mascotGroup.position.y = 0.38 + Math.abs(Math.cos(beat)) * 0.32;
    mascotGroup.rotation.y = -0.2 + Math.sin(elapsed * 5) * 0.45;
    mascotGroup.rotation.z = Math.sin(beat * 0.5) * 0.14;
  } else {
    /* Reset pose normal saat membidik & menembak */
    fpsPlayerChar.torso.p.rotation.z = 0;
    fpsPlayerChar.legL.p.rotation.x = 0;
    fpsPlayerChar.legR.p.rotation.x = 0;
    fpsPlayerChar.armL.p.rotation.x = -0.35;
    fpsPlayerChar.armR.p.rotation.x = -0.45 - fpsState.cannonRecoil * 1.4;
    fpsPlayerChar.armL.p.rotation.z = -0.15;
    fpsPlayerChar.armR.p.rotation.z = 0.15;

    const aimTurn = (fpsState.aimPoint.x / 7) * 0.28;
    fpsPlayerChar.g.rotation.y = Math.PI - 0.38 - aimTurn;

    if (fpsState.mascotMoodTimer > 0) {
      fpsState.mascotMoodTimer -= dt;
      if (fpsState.mascotMood === 'happy') {
        const cheerHop = Math.abs(Math.sin(elapsed * 14)) * 0.26;
        mascotGroup.position.y = 0.38 + cheerHop;
        fpsPlayerChar.g.position.y = 0.36 + cheerHop * 0.85;
        fpsPlayerChar.armR.p.rotation.z = 2.6 + Math.sin(elapsed * 16) * 0.3;
      } else {
        mascotGroup.rotation.z = Math.sin(elapsed * 24) * 0.14;
        fpsPlayerChar.g.rotation.y = Math.PI - 0.38 + Math.sin(elapsed * 22) * 0.18;
        fpsPlayerChar.armL.p.rotation.x = -2.2;
      }
    } else {
      fpsState.mascotMood = 'idle';
      mascotGroup.position.y = 0.38 + Math.sin(elapsed * 3) * 0.04;
      mascotGroup.rotation.y = -0.35;
      mascotGroup.rotation.z = 0;
      fpsPlayerChar.g.position.y = 0.36 + Math.sin(elapsed * 2.8) * 0.03;
    }
  }

  /* Animasi konfeti kemenangan */
  for (let i = fpsState.confetti.length - 1; i >= 0; i--) {
    const cf = fpsState.confetti[i];
    cf.life -= dt;
    cf.vy -= 3.2 * dt;
    cf.mesh.position.x += (cf.vx + Math.sin(elapsed * 4 + i) * 0.5) * dt;
    cf.mesh.position.y += cf.vy * dt;
    cf.mesh.position.z += cf.vz * dt;
    cf.mesh.rotation.x += cf.rx * dt;
    cf.mesh.rotation.y += cf.ry * dt;
    cf.mesh.rotation.z += cf.rz * dt;
    if (cf.life <= 0 || cf.mesh.position.y < -0.5) {
      fpsScene.remove(cf.mesh);
      cf.mesh.geometry.dispose();
      cf.mesh.material.dispose();
      fpsState.confetti.splice(i, 1);
    }
  }

  /* Pergerakan peluru cat & jejak percikan di udara */
  for (let i = fpsState.projectiles.length - 1; i >= 0; i--) {
    const p = fpsState.projectiles[i];
    p.life -= dt;
    p.trailTimer += dt;
    p.mesh.position.addScaledVector(p.vel, dt);

    if (p.trailTimer >= 0.025) {
      p.trailTimer = 0;
      const trailDrop = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 6, 6),
        new THREE.MeshBasicMaterial({ color: p.paint.hex })
      );
      trailDrop.position.copy(p.mesh.position);
      fpsScene.add(trailDrop);
      fpsState.particles.push({
        mesh: trailDrop,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.6 - Math.random() * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
        life: 0.28
      });
    }

    /* Cek tabrakan peluru cat dengan balon terdekat */
    let hitBalloon = null;
    let bestDist = 0.96;
    for (const b of fpsState.balloons) {
      const d = Math.hypot(
        p.mesh.position.x - b.mesh.position.x,
        p.mesh.position.y - b.mesh.position.y
      );
      if (Math.abs(p.mesh.position.z - b.mesh.position.z) < 1.35 && d < bestDist) {
        bestDist = d;
        hitBalloon = b;
      }
    }

    if (hitBalloon) {
      fpsScene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      fpsState.projectiles.splice(i, 1);
      handleBalloonHit(hitBalloon, p.paint);
      continue;
    }

    /* Jika mengenai papan belakang tanpa menyentuh balon, tetap muncul cipratan cat */
    if (p.mesh.position.z <= -14.3 || p.life <= 0) {
      if (p.mesh.position.z <= -14.3) {
        playTone('explosion_small');
        spawnPaintExplosion(
          new THREE.Vector3(p.mesh.position.x, p.mesh.position.y, -14.2),
          p.paint,
          false
        );
      }
      fpsScene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      fpsState.projectiles.splice(i, 1);
    }
  }

  /* Partikel tetesan cat terbang */
  for (let i = fpsState.particles.length - 1; i >= 0; i--) {
    const pt = fpsState.particles[i];
    pt.life -= dt;
    pt.vy -= 9.5 * dt;
    pt.mesh.position.x += pt.vx * dt;
    pt.mesh.position.y += pt.vy * dt;
    pt.mesh.position.z += pt.vz * dt;
    pt.mesh.scale.setScalar(Math.max(0.01, pt.life * 1.4));
    if (pt.life <= 0) {
      fpsScene.remove(pt.mesh);
      pt.mesh.geometry.dispose();
      pt.mesh.material.dispose();
      fpsState.particles.splice(i, 1);
    }
  }

  /* Cincin gelombang cat */
  for (let i = fpsState.shockwaves.length - 1; i >= 0; i--) {
    const sw = fpsState.shockwaves[i];
    sw.life -= dt;
    const progress = 1 - sw.life / sw.maxLife;
    sw.mesh.scale.setScalar(1 + progress * 3.2);
    sw.mesh.material.opacity = Math.max(0, 0.85 * (1 - progress));
    if (sw.life <= 0) {
      fpsScene.remove(sw.mesh);
      sw.mesh.geometry.dispose();
      sw.mesh.material.dispose();
      fpsState.shockwaves.splice(i, 1);
    }
  }
}
