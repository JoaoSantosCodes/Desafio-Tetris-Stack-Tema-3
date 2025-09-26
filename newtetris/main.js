import { Game } from './game.js';
import { drawMiniPiece } from './render.js';
import { createSettings } from './settings.js';

const settings = createSettings();

const canvas = document.getElementById('tetris-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const linesEl = document.getElementById('lines');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const statusEl = document.querySelector('.status-pill');
const nextCanvas = document.getElementById('next-canvas');
const holdCanvas = document.getElementById('hold-canvas');
const nextCtx = nextCanvas.getContext('2d');
const holdCtx = holdCanvas.getContext('2d');
const resolutionSelect = document.getElementById('resolution-select');

function applyResolution(size) {
  const map = {
    compact: { w: 240, h: 480, mini: 96 },
    small: { w: 300, h: 600, mini: 120 },
    medium: { w: 450, h: 900, mini: 180 },
    large: { w: 600, h: 1200, mini: 240 },
  };
  const conf = map[size] || map.small;
  // Informar resolução ao documento para estilos adaptativos
  document.documentElement.setAttribute('data-resolution', size);
  document.documentElement.style.setProperty('--mini-size', conf.mini + 'px');
  // Ajustar resolução interna do canvas
  canvas.width = conf.w; canvas.height = conf.h;
  nextCanvas.width = conf.mini; nextCanvas.height = conf.mini;
  holdCanvas.width = conf.mini; holdCanvas.height = conf.mini;
  // Limitar tamanho visual para não ocupar toda a coluna
  canvas.style.maxWidth = conf.w + 'px';
  nextCanvas.style.maxWidth = conf.mini + 'px';
  holdCanvas.style.maxWidth = conf.mini + 'px';
  canvas.style.width = conf.w + 'px';
  nextCanvas.style.width = conf.mini + 'px';
  holdCanvas.style.width = conf.mini + 'px';
  // Redesenhar
  game.draw();
  drawMiniPiece(nextCtx, nextCanvas, game.next);
  drawMiniPiece(holdCtx, holdCanvas, game.hold);
}

const game = new Game({
  ctx, canvas,
  hud: { scoreEl, levelEl, linesEl },
  buttons: { startBtn, pauseBtn, resetBtn },
  statusEl,
  nextCanvas, nextCtx,
  holdCanvas, holdCtx,
});

import { bindButtons, bindKeyboard } from './controls.js';
import { setStatus, updateButtons } from './hud.js';

bindButtons({ startBtn, pauseBtn, resetBtn }, {
  onStart: () => game.start(),
  onPauseToggle: () => game.pauseToggle(),
  onReset: () => { resetBtn.dataset.touched = '1'; game.resetState('ready'); updateButtons({ startBtn, pauseBtn, resetBtn }, 'ready'); setStatus(statusEl, 'ready'); },
});

bindKeyboard({
  onLeft: () => game.left(),
  onRight: () => game.right(),
  onRotate: () => game.rotateCurrent(),
  onSoftDrop: () => game.softDrop(),
  onHardDrop: () => game.hardDrop(),
  onPauseToggle: () => game.pauseToggle(),
  onHold: () => game.holdPiece(),
  onReset: () => { resetBtn.dataset.touched = '1'; game.resetState('ready'); updateButtons({ startBtn, pauseBtn, resetBtn }, 'ready'); setStatus(statusEl, 'ready'); },
  onStart: () => game.start(),
});

// Resolution control with persistence
if (resolutionSelect) {
  const saved = settings.getResolution();
  if (saved) {
    resolutionSelect.value = saved;
  }
  resolutionSelect.addEventListener('change', () => {
    const val = resolutionSelect.value;
    settings.setResolution(val);
    applyResolution(val);
  });
  // Apply initial resolution from saved setting or current select value
  applyResolution(resolutionSelect.value);
}