export function setStatus(el, state) {
  const map = {
    ready: 'Pronto',
    playing: 'Jogando',
    paused: 'Pausado',
    over: 'Fim de jogo',
  };
  el.textContent = map[state] || state;
}

export function updateHUD(hud, state) {
  const { scoreEl, levelEl, linesEl, highscoreEl } = hud;
  scoreEl.textContent = String(state.score ?? 0);
  levelEl.textContent = String(state.level ?? 1);
  linesEl.textContent = String(state.lines ?? 0);
  if (highscoreEl) highscoreEl.textContent = String(state.highscore ?? 0);
}

export function updateButtons(btns, state) {
  const { startBtn, pauseBtn, resetBtn } = btns;
  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';
  const isOver = state === 'over';
  const isReady = state === 'ready';

  startBtn.disabled = isPlaying || isPaused; // só inicia quando não está jogando

  pauseBtn.disabled = !isPlaying && !isPaused; // só disponível quando jogando ou pausado
  pauseBtn.textContent = isPaused ? 'Retomar (P)' : 'Pausar (P)';

  // Reset habilitado quando jogando, pausado ou over. Em ready, só se já foi tocado antes.
  const touched = resetBtn.dataset.touched === '1';
  resetBtn.disabled = isReady && !touched ? true : false;
  resetBtn.textContent = 'Reiniciar (R)';
}