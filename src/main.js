import { formatStatus } from './format.js';
import { canUndo, createGame, playPoint } from './game.js';
import { GameError } from './error.js';
import { copyPlies, renderMoveList } from './moves.js';
import { playOpponent, undoHuman } from './opponent.js';
import { replayTo } from './replay.js';
import { renderBoard } from './render.js';
import { flyGame, millGame, slideGame, winGame } from './sample.js';

const boardEl = document.querySelector('#board');
const statusEl = document.querySelector('#status');
const movesEl = document.querySelector('#moves');
const undoEl = document.querySelector('#undo');
const replayEl = document.querySelector('#replay');
const nextEl = document.querySelector('#next');
const newGameEl = document.querySelector('#new-game');

let liveGame = startGame();
let tape = copyPlies(liveGame.plies);
let cursor = tape.length;
let viewing = false;
let game = liveGame;

function startGame() {
  const fixture = new URLSearchParams(window.location.search).get('fixture');
  if (fixture === 'fly') return flyGame();
  if (fixture === 'slide') return slideGame();
  if (fixture === 'mill') return millGame();
  if (fixture === 'win') return winGame();
  return createGame();
}

function showLive() {
  liveGame = game;
  tape = copyPlies(game.plies);
  cursor = tape.length;
  viewing = false;
}

function showCursor() {
  if (cursor === tape.length) {
    game = liveGame;
    viewing = false;
    return;
  }
  viewing = true;
  game = replayTo(liveGame.origin, tape, cursor);
}

function paint() {
  boardEl.innerHTML = renderBoard(game);
  movesEl.innerHTML = renderMoveList(tape, cursor);
  undoEl.disabled = viewing || !canUndo(game);
  replayEl.disabled = tape.length === 0 || cursor === 0;
  nextEl.disabled = cursor >= tape.length;
  if (viewing && cursor === 0) {
    statusEl.textContent = 'Replay from the start.';
    return;
  }
  if (viewing) {
    statusEl.textContent = `${formatStatus(game)} (ply ${cursor} of ${tape.length})`;
    return;
  }
  statusEl.textContent = formatStatus(game);
}

boardEl.addEventListener('click', (event) => {
  if (viewing) return;
  const hit = event.target.closest('[data-point]');
  if (!hit) return;
  try {
    game = playPoint(game, hit.getAttribute('data-point'));
    game = playOpponent(game);
    showLive();
    paint();
  } catch (err) {
    if (err instanceof GameError) {
      statusEl.textContent = err.errors[0].replace(/^[a-z]+: /, '');
      return;
    }
    throw err;
  }
});

undoEl.addEventListener('click', () => {
  if (viewing) return;
  try {
    game = undoHuman(game);
    showLive();
    paint();
  } catch (err) {
    if (err instanceof GameError) {
      statusEl.textContent = err.errors[0].replace(/^[a-z]+: /, '');
      return;
    }
    throw err;
  }
});

replayEl.addEventListener('click', () => {
  if (tape.length === 0) return;
  cursor = 0;
  showCursor();
  paint();
});

nextEl.addEventListener('click', () => {
  if (cursor >= tape.length) return;
  cursor += 1;
  showCursor();
  paint();
});

movesEl.addEventListener('click', (event) => {
  const hit = event.target.closest('[data-ply]');
  if (!hit) return;
  cursor = Number(hit.getAttribute('data-ply'));
  showCursor();
  paint();
});

newGameEl.addEventListener('click', () => {
  game = createGame();
  showLive();
  paint();
});

paint();
