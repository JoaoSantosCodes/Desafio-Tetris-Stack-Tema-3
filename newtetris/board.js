import { ROWS, COLS } from './consts.js';

export function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export function isBoardEmpty(board) {
  if (!board) return true;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) { if (board[y][x]) return false; }
  }
  return true;
}

export function merge(board, piece) {
  const { shape, x, y, color } = piece;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) board[y + r][x + c] = color;
    }
  }
}

export function getFullRows(board) {
  const res = [];
  for (let y = 0; y < ROWS; y++) {
    let full = true;
    for (let x = 0; x < COLS; x++) { if (!board[y][x]) { full = false; break; } }
    if (full) res.push(y);
  }
  return res;
}

export function applyClearRows(board, rows) {
  if (!rows || rows.length === 0) return 0;
  rows.sort((a,b) => a - b).forEach(y => {
    board.splice(y, 1);
    board.unshift(Array(COLS).fill(0));
  });
  return rows.length;
}