import { formatStatus } from './format.js';
import { createGame, placePiece } from './game.js';
import { GameError } from './error.js';
import { renderBoard } from './render.js';

const boardEl = document.querySelector('#board');
const statusEl = document.querySelector('#status');
const newGameEl = document.querySelector('#new-game');

let game = createGame();

function paint() {
  boardEl.innerHTML = renderBoard(game);
  statusEl.textContent = formatStatus(game);
}

boardEl.addEventListener('click', (event) => {
  const hit = event.target.closest('[data-point]');
  if (!hit) return;
  try {
    game = placePiece(game, hit.getAttribute('data-point'));
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
