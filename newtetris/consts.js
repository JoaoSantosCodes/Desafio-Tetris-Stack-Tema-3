export const COLS = 10;
export const ROWS = 20;
export const BLOCK = 30; // base do canvas 300x600
export const DROP_START_MS = 1000;
export const CLEAR_ANIM_MS = 250; // duração da animação de limpeza

export const TETROMINOS = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]],
  J: [[1,0,0],[1,1,1]],
  L: [[0,0,1],[1,1,1]],
};

export const COLORS = {
  I: '#00d4ff', O: '#ffd400', T: '#a78bfa', S: '#34d399', Z: '#f87171', J: '#60a5fa', L: '#fbbf24'
};