let ctx = null;
let enabled = false;
let initialized = false;

function ensureCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  initialized = true;
}

function beep({ freq = 440, duration = 0.06, type = 'sine', gain = 0.05 }) {
  if (!ctx) ensureCtx();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = 0;
  osc.connect(g).connect(ctx.destination);
  const now = ctx.currentTime;
  g.gain.setTargetAtTime(gain, now, 0.005);
  g.gain.setTargetAtTime(0.0001, now + duration, 0.02);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

function createBeep(ctx, { freq = 440, duration = 0.06, type = 'square', volume = 0.02 } = {}) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = volume;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + duration);
}

const SFX = {
  start: (ctx) => createBeep(ctx, { freq: 660, duration: 0.08, type: 'square', volume: 0.03 }),
  move: (ctx) => createBeep(ctx, { freq: 320, duration: 0.03 }),
  rotate: (ctx) => createBeep(ctx, { freq: 520, duration: 0.05 }),
  softDrop: (ctx) => createBeep(ctx, { freq: 240, duration: 0.02 }),
  hardDrop: (ctx) => createBeep(ctx, { freq: 160, duration: 0.06, type: 'sawtooth', volume: 0.03 }),
  lock: (ctx) => createBeep(ctx, { freq: 200, duration: 0.05 }),
  clear: (ctx) => createBeep(ctx, { freq: 880, duration: 0.08, type: 'triangle' }),
  levelup: (ctx) => { createBeep(ctx, { freq: 700, duration: 0.06 }); setTimeout(() => createBeep(ctx, { freq: 900, duration: 0.06 }), 70); },
  gameover: (ctx) => { createBeep(ctx, { freq: 200, duration: 0.2, type: 'sine', volume: 0.04 }); setTimeout(() => createBeep(ctx, { freq: 120, duration: 0.3, type: 'sine', volume: 0.03 }), 120); },
};

class AudioMgr {
  constructor() { this.enabled = true; this.ctx = null; }
  init() {
    if (!this.enabled) return;
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  setEnabled(v) { this.enabled = !!v; if (!v && this.ctx) { try { this.ctx.close(); } catch {} this.ctx = null; } }
  isEnabled() { return this.enabled; }
  play(type) { if (!this.enabled) return; if (!this.ctx) this.init(); const fn = SFX[type]; if (fn) fn(this.ctx); }
}

export const audio = new AudioMgr();
export { SFX };
export const gameover = {
  init() { ensureCtx(); },
  setEnabled(v) { enabled = !!v; },
  isEnabled() { return !!enabled; },
  play(type) {
    try {
      if (!enabled) return;
      if (!initialized) ensureCtx();
      (SFX[type] || SFX.move)();
    } catch (e) { /* noop */ }
  }
};