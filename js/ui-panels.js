/* =====================================================================
   UI: Toast & Panel HUD Kota (Toko, Profil, Emote, Item)
   ===================================================================== */
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2100);
}

/* Panel HUD Kota */
const panel = $('panel'), pBody = $('pBody');
const shirts = [0x2f6fe0, 0xd8362f, 0x2fa84f, 0x8a3fd0, 0xf0f0f0, 0x222222];
const panels = {
  shop: { title: 'Toko', render() {
    pBody.innerHTML = '<p>Pilih warna baju:</p>' + shirts.map(c => `<div class="sw" role="button" tabindex="0" data-c="${c}" style="background:${hex(c)}"></div>`).join('');
    pBody.querySelectorAll('.sw').forEach(s => s.onclick = () => hero.torso.m.material.color.set(+s.dataset.c));
  } },
  profile: { title: 'Profil', render() {
    pBody.innerHTML = `<p>Nama: Penjelajah</p><p>Koin ditemukan: ${found} / ${TOTAL_COINS}</p><p>Jarak ditempuh: ${Math.round(walked)} m</p><p>Level Arena Eksponen Terbuka: Level ${fpsState.unlockedLevel} / 5</p><p>Level Arena SPLDV Terbuka: Level ${blueState.unlockedLevel} / 5</p>`;
  } },
  emotes: { title: 'Emote', render() {
    pBody.innerHTML = '<button class="opt" data-e="wave">Melambai</button><button class="opt" data-e="dance">Menari</button>';
    pBody.querySelectorAll('.opt').forEach(b => b.onclick = () => { emote = b.dataset.e; emoteT = 3; panel.hidden = true; });
  } },
  items: { title: 'Item', render() {
    pBody.innerHTML = found ? `<p>🪙 Koin emas × ${found}</p>` : '<p>Belum ada item. Cari tiang cahaya kuning di peta untuk menemukan koin.</p>';
  } }
};
document.querySelectorAll('[data-panel]').forEach(b => b.onclick = () => {
  const p = panels[b.dataset.panel]; $('pTitle').textContent = p.title; p.render(); panel.hidden = false;
});
$('pClose').onclick = () => panel.hidden = true;
addEventListener('keydown', e => { if (e.code === 'Escape' && !isFpsActive && !isBlueActive) panel.hidden = true; });
