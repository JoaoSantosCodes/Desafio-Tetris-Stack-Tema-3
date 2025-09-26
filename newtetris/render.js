import { ROWS, COLS } from './consts.js';
import { collide } from './pieces.js';

function getBlock(ctx) {
  // Derive block size from current canvas size (keeps squares and scales with resolution)
  // Prefer width to ensure COLS*block matches canvas.width
  return Math.floor(ctx.canvas.width / COLS);
}

export function drawCell(ctx, x, y, color) {
  const BLOCK = getBlock(ctx);
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
  ctx.strokeStyle = 'rgba(255,255,255,.08)';
  ctx.strokeRect(x * BLOCK + .5, y * BLOCK + .5, BLOCK - 1, BLOCK - 1);
}

export function drawPiece(ctx, piece) {
  const { shape, x, y, color } = piece;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) drawCell(ctx, x + c, y + r, color);
    }
  }
}

export function computeGhostY(board, piece) {
  let gy = piece.y;
  while (!collide(board, { ...piece, y: gy + 1 }, ROWS, COLS)) gy++;
  return gy;
}

export function drawGhost(ctx, board, piece) {
  const gy = computeGhostY(board, piece);
  const { shape, x, color } = piece;
  ctx.save();
  ctx.globalAlpha = 0.25;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) drawCell(ctx, x + c, gy + r, color);
    }
  }
  ctx.restore();
}

export function drawBoard(ctx, board, current, isClearing, rowsToClear) {
  const BLOCK = getBlock(ctx);
  ctx.clearRect(0, 0, COLS * BLOCK, ROWS * BLOCK);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) drawCell(ctx, x, y, board[y][x]);
    }
  }
  if (current) drawGhost(ctx, board, current);
  if (current) drawPiece(ctx, current);
  if (isClearing && rowsToClear && rowsToClear.length) drawClearingOverlay(ctx, rowsToClear);
}

export function drawClearingOverlay(ctx, rowsToClear) {
  const BLOCK = getBlock(ctx);
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#ffffff';
  rowsToClear.forEach(y => ctx.fillRect(0, y * BLOCK, COLS * BLOCK, BLOCK));
  ctx.restore();
}

export function drawMiniPiece(ctx, canvas, piece) {
  if (!ctx || !canvas) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (!piece) return;
  const shape = piece.shape;
  const rows = shape.length; const cols = shape[0].length;
  const size = Math.floor(Math.min(canvas.width / (cols + 1), canvas.height / (rows + 1)));
  const offsetX = Math.floor((canvas.width - cols * size) / 2);
  const offsetY = Math.floor((canvas.height - rows * size) / 2);
  ctx.fillStyle = piece.color;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!shape[r][c]) continue;
      ctx.fillRect(offsetX + c * size, offsetY + r * size, size, size);
    }
  }
}