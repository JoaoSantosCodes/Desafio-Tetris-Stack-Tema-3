import { ROWS, COLS, DROP_START_MS, CLEAR_ANIM_MS } from './consts.js';
import { createBoard, merge, getFullRows, applyClearRows } from './board.js';
import { randomPiece, rotate, collide, cloneBase } from './pieces.js';
import { drawBoard, drawMiniPiece } from './render.js';
import { setStatus, updateHUD, updateButtons } from './hud.js';

export class Game {
  constructor(refs) {
    this.refs = refs; // ctx, canvas, hud, buttons, miniCtxs
    this.resetState('ready');
  }

  resetState(state) {
    this.board = createBoard();
    this.current = null;
    this.next = randomPiece();
    this.hold = null;
    this.holdUsed = false;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.dropInterval = DROP_START_MS;
    this.timer = 0;
    this.running = false;
    this.paused = false;
    this.clearAnim = null; // { rows:[], until:number }
    setStatus(this.refs.statusEl, state);
    updateHUD(this.refs.hud, this);
    updateButtons(this.refs.buttons, state);
    drawMiniPiece(this.refs.nextCtx, this.refs.nextCanvas, this.next);
    drawMiniPiece(this.refs.holdCtx, this.refs.holdCanvas, this.hold);
    this.draw();
  }

  draw() {
    drawBoard(this.refs.ctx, this.board, this.current, !!this.clearAnim, this.clearAnim?.rows);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.paused = false;
    setStatus(this.refs.statusEl, 'playing');
    updateButtons(this.refs.buttons, 'playing');
    if (!this.current) this.spawnNext();
    this.timer = performance.now();
    this.loop();
  }

  pauseToggle() {
    if (!this.running) return;
    this.paused = !this.paused;
    setStatus(this.refs.statusEl, this.paused ? 'paused' : 'playing');
    updateButtons(this.refs.buttons, this.paused ? 'paused' : 'playing');
  }

  gameOver() {
    this.running = false;
    this.paused = false;
    setStatus(this.refs.statusEl, 'over');
    updateButtons(this.refs.buttons, 'over');
  }

  spawnNext() {
    this.current = { ...cloneBase(this.next), x: 3, y: 0 };
    this.next = randomPiece();
    drawMiniPiece(this.refs.nextCtx, this.refs.nextCanvas, this.next);
    this.holdUsed = false;
  }

  holdPiece() {
    if (!this.current || this.holdUsed) return;
    const tmp = cloneBase(this.current);
    if (!this.hold) {
      this.hold = tmp;
      this.spawnNext();
    } else {
      const swapped = cloneBase(this.hold);
      this.hold = tmp;
      this.current = { ...swapped, x: 3, y: 0 };
    }
    this.holdUsed = true;
    drawMiniPiece(this.refs.holdCtx, this.refs.holdCanvas, this.hold);
    this.draw();
  }

  move(dx, dy) {
    if (!this.running || this.paused || !this.current) return;
    const cand = { ...this.current, x: this.current.x + dx, y: this.current.y + dy };
    if (!collide(this.board, cand, ROWS, COLS)) {
      this.current = cand;
      this.draw();
    }
  }

  rotateCurrent() {
    if (!this.running || this.paused || !this.current) return;
    const rotated = rotate(this.current.shape);
    const cand = { ...this.current, shape: rotated };
    if (!collide(this.board, cand, ROWS, COLS)) {
      this.current = cand;
      this.draw();
    }
  }

  hardDrop() {
    if (!this.running || this.paused || !this.current) return;
    while (!collide(this.board, { ...this.current, y: this.current.y + 1 }, ROWS, COLS)) {
      this.current.y++;
    }
    this.lockPiece();
  }

  softDrop() { this.move(0, 1); }
  left() { this.move(-1, 0); }
  right() { this.move(1, 0); }

  lockPiece() {
    merge(this.board, this.current);
    const full = getFullRows(this.board);
    if (full.length) {
      this.clearAnim = { rows: full, until: performance.now() + CLEAR_ANIM_MS };
    } else {
      this.spawnNext();
    }
    this.draw();
    // game over check: if new current collides immediately
    if (collide(this.board, { ...cloneBase(this.next), x: 3, y: 0 }, ROWS, COLS)) {
      this.gameOver();
    }
  }

  handleClearIfNeeded(now) {
    if (!this.clearAnim) return false;
    if (now >= this.clearAnim.until) {
      const cleared = applyClearRows(this.board, this.clearAnim.rows);
      this.lines += cleared;
      this.score += [0, 100, 300, 500, 800][cleared] || 0;
      if (this.lines && this.lines % 10 === 0) {
        this.level++;
        this.dropInterval = Math.max(100, DROP_START_MS - (this.level - 1) * 100);
      }
      updateHUD(this.refs.hud, this);
      this.clearAnim = null;
      this.spawnNext();
      this.draw();
    }
    return true;
  }

  loop() {
    if (!this.running) return;
    const now = performance.now();
    if (this.paused) { requestAnimationFrame(() => this.loop()); return; }
    if (this.handleClearIfNeeded(now)) { requestAnimationFrame(() => this.loop()); return; }

    if (now - this.timer >= this.dropInterval) {
      this.timer = now;
      if (!collide(this.board, { ...this.current, y: this.current.y + 1 }, ROWS, COLS)) {
        this.current.y++;
      } else {
        this.lockPiece();
      }
      this.draw();
    }
    requestAnimationFrame(() => this.loop());
  }
}