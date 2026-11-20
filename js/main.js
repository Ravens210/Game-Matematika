/* =====================================================================
   LOOP UTAMA GAME & RESIZE
   ===================================================================== */
let last = performance.now();
let totalElapsed = 0;

function frame(now) {
  const dt = Math.min((now - last) / 1000, .05);
  last = now;
  totalElapsed += dt;

  if (isFpsActive) {
    updateFpsMiniGame(dt, totalElapsed);
    fpsRenderer.render(fpsScene, fpsCamera);
  } else if (isBlueActive) {
    updateBlueMiniGame(dt, totalElapsed);
  } else {
    if (panel.hidden) update(dt, totalElapsed);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}

function update(dt, elapsed) {
  /* Animasi portal Markas Merah */
  redPortalRing.rotation.z = elapsed * 1.5;
  portalBanner.position.y = 6.2 + Math.sin(elapsed * 2.5) * 0.18;

  /* Animasi portal Markas Biru */
  bluePortalRing.rotation.z = -elapsed * 1.5;
  bluePortalBanner.position.y = 6.2 + Math.sin(elapsed * 2.5 + 1.5) * 0.18;

  let kx = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
  let kz = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
  let mag = (kx || kz) ? 1 : 0;
  if (!mag && Math.hypot(jx, jy) > .15) {
    kx = jx; kz = -jy; mag = Math.min(1, Math.hypot(jx, jy));
  }
  const moving = mag > 0;

  if (moving) {
    const ang = Math.atan2(kx, kz);
    const fx = -Math.sin(yaw), fz = -Math.cos(yaw);
    const rx = Math.cos(yaw), rz = -Math.sin(yaw);
    const mx = fx * Math.cos(ang) + rx * Math.sin(ang);
    const mz = fz * Math.cos(ang) + rz * Math.sin(ang);

    const run = rightHeld || keys.ShiftLeft || keys.ShiftRight;
    const sp = (run ? RUN : WALK) * mag * dt;
    pos.x += mx * sp; pos.z += mz * sp; walked += sp;

    let d = Math.atan2(mx, mz) - hero.g.rotation.y;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    hero.g.rotation.y += d * Math.min(1, dt * 14);
    emote = null;
  }

  for (const c of colliders) {
    const dx = pos.x - c.x, dz = pos.z - c.z;
    const ox = c.hw + R - Math.abs(dx), oz = c.hd + R - Math.abs(dz);
    if (ox > 0 && oz > 0) {
      if (ox < oz) pos.x += (dx < 0 ? -1 : 1) * ox;
      else pos.z += (dz < 0 ? -1 : 1) * oz;
    }
  }
  pos.x = Math.max(-WORLD, Math.min(WORLD, pos.x));
  pos.z = Math.max(-WORLD, Math.min(WORLD, pos.z));

  if (jumpReq && pos.y <= 0.001) vy = 24;
  jumpReq = false;
  vy -= 70 * dt; pos.y += vy * dt;
  if (pos.y < 0) { pos.y = 0; vy = 0; }

  const running = moving && (rightHeld || keys.ShiftLeft || keys.ShiftRight);
  anim += dt * (running ? 15 : 10);
  /* Suara langkah: tiap kaki melewati posisi tegak (kelipatan PI pada ayunan kaki) */
  const stepIdx = Math.floor(anim / Math.PI);
  if (moving && pos.y <= 0.001 && stepIdx !== worldSfx.lastStep) playStepSfx(running);
  worldSfx.lastStep = stepIdx;
  const sw = moving ? Math.sin(anim) * (running ? 1.1 : .9) : 0;
  hero.legL.p.rotation.x = sw; hero.legR.p.rotation.x = -sw;
  hero.armL.p.rotation.x = -sw; hero.armR.p.rotation.x = sw;
  hero.armL.p.rotation.z = hero.armR.p.rotation.z = 0;
  if (emote) {
    emoteT -= dt; if (emoteT <= 0) emote = null;
    else if (emote === 'wave') hero.armR.p.rotation.z = 2.7 + Math.sin(anim * 1.4) * .35;
    else { hero.armL.p.rotation.z = -2.7; hero.armR.p.rotation.z = 2.7; hero.g.rotation.y += dt * 8; }
  }

  updateNPCs(dt);

  for (let i = coins.length - 1; i >= 0; i--) {
    const c = coins[i]; c.userData.disc.rotation.z += dt * 3;
    if (Math.hypot(c.position.x - pos.x, c.position.z - pos.z) < 3 && pos.y < 4) {
      scene.remove(c); coins.splice(i, 1); found++;
      playCoinSfx();
      $('coinText').textContent = `${found} / ${TOTAL_COINS}`;
      toast(found === TOTAL_COINS ? 'Semua koin ditemukan! 🎉' : `Koin ditemukan (${found}/${TOTAL_COINS})`);
    }
  }

  const tx = pos.x, ty = pos.y + 3.5, tz = pos.z;
  camera.position.set(
    tx + Math.sin(yaw) * Math.cos(pitch) * dist,
    ty + Math.sin(pitch) * dist,
    tz + Math.cos(yaw) * Math.cos(pitch) * dist
  );
  camera.lookAt(tx, ty, tz);
  sun.position.set(tx + 40, 80, tz + 20);
  sun.target.position.set(tx, 0, tz);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);

  fpsCamera.aspect = innerWidth / innerHeight;
  fpsCamera.updateProjectionMatrix();
  fpsRenderer.setSize(innerWidth, innerHeight);

  resizeBlueCanvas();
});

requestAnimationFrame(frame);
