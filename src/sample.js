import { createGame, placePiece } from './game.js';

export const SAMPLE_OPENING = [
  'a7',
  'g7',
  'a1',
  'g1',
  'd7',
];

export function sampleGame() {
  return createGame();
}

export function midPlaceGame() {
  let game = createGame();
  for (const point of SAMPLE_OPENING) {
    game = placePiece(game, point);
  }
  return game;
}
