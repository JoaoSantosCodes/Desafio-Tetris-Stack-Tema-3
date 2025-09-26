const STORAGE_KEY = 'tetris.settings.v1';

const DEFAULTS = {
  audio: true,
  theme: 'dark',
  mode: 'marathon', // 'marathon' | 'relax'
  speed: 'normal', // 'slow' | 'normal' | 'fast'
  resolution: 'compact', // 'compact' | 'small' | 'medium' | 'large'
  keymap: {
    left: ['ArrowLeft','a'],
    right: ['ArrowRight','d'],
    rotate: ['ArrowUp','w'],
    softDrop: ['ArrowDown','s'],
    hardDrop: [' '],
    pause: ['p'],
    hold: ['c'],
    reset: ['r'],
    start: ['Enter'],
  },
  highscores: { marathon: 0, relax: 0 },
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed, keymap: { ...DEFAULTS.keymap, ...(parsed.keymap||{}) }, highscores: { ...DEFAULTS.highscores, ...(parsed.highscores||{}) } };
  } catch { return { ...DEFAULTS }; }
}

function save(state) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }

export function createSettings() {
  let state = load();

  function persist() { save(state); }

  return {
    getConfig() { return { mode: state.mode }; },
    getDropStartMs() { return state.speed === 'slow' ? 900 : state.speed === 'fast' ? 400 : 600; },

    // audio
    isAudioEnabled() { return !!state.audio; },
    setAudioEnabled(v) { state.audio = !!v; persist(); },

    // theme
    getTheme() { return state.theme; },
    toggleTheme() { state.theme = state.theme === 'dark' ? 'light' : 'dark'; this.applyTheme(document.documentElement); persist(); },
    applyTheme(rootEl) {
      if (!rootEl) return;
      rootEl.setAttribute('data-theme', state.theme);
    },

    // mode & speed
    getMode() { return state.mode; },
    setMode(m) { state.mode = m; persist(); },
    getSpeed() { return state.speed; },
    setSpeed(s) { state.speed = s; persist(); },

    // resolution (state-based persistence)
    getResolution() { return state.resolution; },
    setResolution(r) {
      const allowed = ['compact','small','medium','large'];
      state.resolution = allowed.includes(r) ? r : 'compact';
      persist();
    },

    // keymap
    getKeymap() { return { ...state.keymap, }; },
    setKeymap(km) { state.keymap = { ...state.keymap, ...km }; persist(); },

    // highscores por modo
    getHighScore(mode) { return state.highscores?.[mode] || 0; },
    setHighScore(mode, score) { if (score > (state.highscores?.[mode] || 0)) { state.highscores[mode] = score; persist(); } },
  };
}