import { TETROMINOS, COLORS } from './consts.js';

export function randomPiece() {
  const keys = Object.keys(TETROMINOS);
  const type = keys[Math.floor(Math.random() * keys.length)];
  return { type, shape: TETROMINOS[type].map(r => [...r]), x: 3, y: 0, color: COLORS[type] };
}

export function rotate(shape) {
  const N = shape.length;
  const M = shape[0].length;
  const res = Array.from({ length: M }, () => Array(N).fill(0));
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < M; c++) {
      res[c][N - 1 - r] = shape[r][c];
    }
  }
  return res;
}

export function collide(board, piece, rows, cols) {
  const { shape, x, y } = piece;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = x + c;
      const ny = y + r;
      if (ny < 0 || ny >= rows || nx < 0 || nx >= cols || board[ny][nx]) return true;
    }
  }
  return false;
}

export function cloneBase(piece) {
  return { type: piece.type, shape: piece.shape.map(r => [...r]), color: piece.color };
}