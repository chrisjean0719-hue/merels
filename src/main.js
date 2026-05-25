import { formatStatus } from './format.js';
import { canUndo, createGame, playPoint } from './game.js';
import { GameError } from './error.js';
import { playOpponent, undoHuman } from './opponent.js';
import { renderBoard } from './render.js';
import { flyGame, millGame, slideGame, winGame } from './sample.js';

const boardEl = document.querySelector('#board');
const statusEl = document.querySelector('#status');
const undoEl = document.querySelector('#undo');
const newGameEl = document.querySelector('#new-game');

let game = startGame();

function startGame() {
  const fixture = new URLSearchParams(window.location.search).get('fixture');
  if (fixture === 'fly') return flyGame();
  if (fixture === 'slide') return slideGame();
  if (fixture === 'mill') return millGame();
  if (fixture === 'win') return winGame();
  return createGame();
}

function paint() {
  boardEl.innerHTML = renderBoard(game);
  statusEl.textContent = formatStatus(game);
  undoEl.disabled = !canUndo(game);
}

boardEl.addEventListener('click', (event) => {
  const hit = event.target.closest('[data-point]');
  if (!hit) return;
  try {
    game = playPoint(game, hit.getAttribute('data-point'));
    game = playOpponent(game);
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
  try {
    game = undoHuman(game);
    paint();
  } catch (err) {
    if (err instanceof GameError) {
      statusEl.textContent = err.errors[0].replace(/^[a-z]+: /, '');
      return;
    }
    throw err;
  }
});

newGameEl.addEventListener('click', () => {
  game = createGame();
  paint();
});

paint();
