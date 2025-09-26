import { setStatus, updateButtons } from './hud.js';

export function bindButtons(btns, handlers) {
  const { startBtn, pauseBtn, resetBtn } = btns;
  startBtn.addEventListener('click', () => handlers.onStart());
  pauseBtn.addEventListener('click', () => handlers.onPauseToggle());
  resetBtn.addEventListener('click', () => handlers.onReset());
}

export function bindKeyboard(actions, getKeymap) {
  function match(keys, e) {
    return keys.some(k => k.toLowerCase() === e.key.toLowerCase());
  }
  window.addEventListener('keydown', (e) => {
    const km = getKeymap ? getKeymap() : {
      left: ['ArrowLeft','a'], right: ['ArrowRight','d'], rotate: ['ArrowUp','w'],
      softDrop: ['ArrowDown','s'], hardDrop: [' '], pause: ['p'], hold: ['c'],
      reset: ['r'], start: ['Enter']
    };
    if (match(km.left, e)) { actions.onLeft(); e.preventDefault(); }
    else if (match(km.right, e)) { actions.onRight(); e.preventDefault(); }
    else if (match(km.rotate, e)) { actions.onRotate(); e.preventDefault(); }
    else if (match(km.softDrop, e)) { actions.onSoftDrop(); e.preventDefault(); }
    else if (match(km.hardDrop, e)) { actions.onHardDrop(); e.preventDefault(); }
    else if (match(km.pause, e)) { actions.onPauseToggle(); e.preventDefault(); }
    else if (match(km.hold, e)) { actions.onHold(); e.preventDefault(); }
    else if (match(km.reset, e)) { actions.onReset(); e.preventDefault(); }
    else if (match(km.start, e)) { actions.onStart(); e.preventDefault(); }
  });
}

export function bindSettingsControls(els, handlers) {
  const { audioBtn, themeBtn, modeSelect, speedSelect, keymapBtn, resolutionSelect } = els;
  audioBtn?.addEventListener('click', handlers.onToggleAudio);
  themeBtn?.addEventListener('click', handlers.onToggleTheme);
  modeSelect?.addEventListener('change', () => handlers.onChangeMode(modeSelect.value));
  speedSelect?.addEventListener('change', () => handlers.onChangeSpeed(speedSelect.value));
  resolutionSelect?.addEventListener('change', () => handlers.onChangeResolution(resolutionSelect.value));
  keymapBtn?.addEventListener('click', handlers.onConfigureKeys);
}