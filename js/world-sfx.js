/* =====================================================================
   SFX DUNIA KOTA: langkah kaki & ambil koin
   Memakai getAudioContext() dari fps-game.js (dipanggil saat runtime).
   ===================================================================== */
const worldSfx = { on: true, lastStep: 0, noise: null };

/* Tombol Suara (HUD): hidup/mati untuk SFX langkah & koin. Pilihan diingat di browser. */
try { if (localStorage.getItem('worldSfxOn') === '0') worldSfx.on = false; } catch (err) {}

function refreshSoundToggle() {
  const btn = $('soundToggle');
  btn.querySelector('span').textContent = worldSfx.on ? '🔊' : '🔇';
  btn.setAttribute('aria-pressed', String(worldSfx.on));
  btn.style.opacity = worldSfx.on ? '' : '.6';
}
$('soundToggle').addEventListener('click', e => {
  worldSfx.on = !worldSfx.on;
  try { localStorage.setItem('worldSfxOn', worldSfx.on ? '1' : '0'); } catch (err) {}
  refreshSoundToggle();
  if (worldSfx.on) playCoinSfx();   /* bunyi contoh saat dinyalakan */
  e.currentTarget.blur();           /* agar Spasi tidak menekan tombol ini lagi */
});
refreshSoundToggle();

function getNoiseBuffer(ctx) {
  if (!worldSfx.noise) {
    const len = Math.floor(ctx.sampleRate * 0.1);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    worldSfx.noise = buf;
  }
  return worldSfx.noise;
}

/* Langkah kaki: ketukan lembut. running = true -> sedikit lebih keras & tajam */
function playStepSfx(running) {
  if (!worldSfx.on) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = getNoiseBuffer(ctx);
    src.playbackRate.value = 0.85 + Math.random() * 0.3;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = (running ? 900 : 650) + Math.random() * 150;
    const g = ctx.createGain();
    g.gain.setValueAtTime(running ? 0.22 : 0.16, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    src.connect(lp); lp.connect(g); g.connect(ctx.destination);
    src.start(now); src.stop(now + 0.1);
  } catch (err) {}
}

/* Ambil koin: "ting-ting" naik */
function playCoinSfx() {
  if (!worldSfx.on) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state !== 'running') return;
    const now = ctx.currentTime;
    [[987.77, 0], [1318.51, 0.09]].forEach(([f, delay]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(f, now + delay);
      g.gain.setValueAtTime(0.0001, now + delay);
      g.gain.exponentialRampToValueAtTime(0.11, now + delay + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + delay + (delay ? 0.32 : 0.12));
      o.connect(g); g.connect(ctx.destination);
      o.start(now + delay); o.stop(now + delay + 0.35);
    });
  } catch (err) {}
}
