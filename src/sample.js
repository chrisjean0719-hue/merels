import { createGame, fromPosition, placePiece } from './game.js';
import { POINTS } from './points.js';

export const SAMPLE_OPENING = [
  'a7',
  'g7',
  'a1',
  'g1',
  'd7',
];

export const SAMPLE_MILL = ['a7', 'b6', 'd7', 'd6', 'g7'];

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

export function millGame() {
  let game = createGame();
  for (const point of SAMPLE_MILL) {
    game = placePiece(game, point);
  }
  return game;
}

export function slideGame() {
  let game = createGame();
  for (const id of POINTS.slice(0, 18)) {
    game = placePiece(game, id);
  }
  return game;
}

export function flyGame() {
  return fromPosition({
    phase: 'slide',
    turn: 'dark',
    toPlace: { dark: 0, light: 0 },
    points: {
      a7: 'dark',
      d7: 'dark',
      a1: 'dark',
      g7: 'light',
      g4: 'light',
      g1: 'light',
      b6: 'light',
      d6: 'light',
    },
  });
}

export function winGame() {
  return fromPosition({
    phase: 'slide',
    turn: 'dark',
    toPlace: { dark: 0, light: 0 },
    points: {
      a7: 'dark',
      d7: 'dark',
      a1: 'dark',
      b6: 'light',
      d6: 'light',
      f6: 'light',
    },
  });
}

export function blockedGame() {
  return fromPosition({
    phase: 'slide',
    turn: 'dark',
    toPlace: { dark: 0, light: 0 },
    points: {
      a7: 'dark',
      g7: 'dark',
      a1: 'dark',
      g1: 'dark',
      d7: 'light',
      a4: 'light',
      g4: 'light',
      d1: 'light',
    },
  });
}
