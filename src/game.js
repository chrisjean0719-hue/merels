import { emptyPoints } from './board.js';
import { GameError } from './error.js';
import { formedMill, hasTake } from './mill.js';
import { PIECES } from './sizes.js';
import { validatePlace, validateRemove } from './validate.js';

export const DARK = 'dark';
export const LIGHT = 'light';

export function createGame() {
  return {
    turn: DARK,
    phase: 'place',
    toPlace: { dark: PIECES, light: PIECES },
    points: emptyPoints(),
  };
}

export function other(colour) {
  return colour === DARK ? LIGHT : DARK;
}

export function placePiece(game, pointId) {
  const errors = validatePlace(game, pointId);
  if (errors.length > 0) {
    throw new GameError(errors);
  }
  const next = cloneGame(game);
  next.points[pointId] = game.turn;
  next.toPlace[game.turn] -= 1;
  const foe = other(game.turn);
  if (formedMill(next.points, pointId) && hasTake(next.points, foe)) {
    next.phase = 'remove';
    return next;
  }
  return finishTurn(next);
}

export function removePiece(game, pointId) {
  const errors = validateRemove(game, pointId);
  if (errors.length > 0) {
    throw new GameError(errors);
  }
  const next = cloneGame(game);
  next.points[pointId] = null;
  return finishTurn(next);
}

export function playPoint(game, pointId) {
  if (game.phase === 'remove') {
    return removePiece(game, pointId);
  }
  return placePiece(game, pointId);
}

function finishTurn(game) {
  const next = cloneGame(game);
  next.turn = other(game.turn);
  if (next.toPlace.dark === 0 && next.toPlace.light === 0) {
    next.phase = 'placed';
  } else {
    next.phase = 'place';
  }
  return next;
}

export function cloneGame(game) {
  return {
    turn: game.turn,
    phase: game.phase,
    toPlace: { dark: game.toPlace.dark, light: game.toPlace.light },
    points: { ...game.points },
  };
}
