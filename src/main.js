import { formatStatus } from './format.js';
import { createGame, playPoint } from './game.js';
import { GameError } from './error.js';
import { renderBoard } from './render.js';
import { flyGame, millGame, slideGame } from './sample.js';

const boardEl = document.querySelector('#board');
const statusEl = document.querySelector('#status');
const newGameEl = document.querySelector('#new-game');

let game = startGame();

function startGame() {
  const fixture = new URLSearchParams(window.location.search).get('fixture');
  if (fixture === 'fly') return flyGame();
  if (fixture === 'slide') return slideGame();
  if (fixture === 'mill') return millGame();
  return createGame();
}

function paint() {
  boardEl.innerHTML = renderBoard(game);
  statusEl.textContent = formatStatus(game);
}

boardEl.addEventListener('click', (event) => {
  const hit = event.target.closest('[data-point]');
  if (!hit) return;
  try {
    game = playPoint(game, hit.getAttribute('data-point'));
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
  game = startGame();
  paint();
});

paint();
