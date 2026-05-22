import { beatenColour, emptyPoints, hasLegalMove, occupant } from './board.js';
import { GameError } from './error.js';
import { formedMill, hasTake } from './mill.js';
import { PIECES } from './sizes.js';
import { validatePlace, validateRemove, validateSelect, validateSlide } from './validate.js';

export const DARK = 'dark';
export const LIGHT = 'light';

export function createGame() {
  return {
    turn: DARK,
    phase: 'place',
    toPlace: { dark: PIECES, light: PIECES },
    points: emptyPoints(),
    selected: null,
    winner: null,
    past: [],
  };
}

export function fromPosition(partial) {
  const base = createGame();
  const game = {
    ...base,
    ...partial,
    toPlace: { ...base.toPlace, ...(partial.toPlace ?? {}) },
    points: { ...base.points, ...(partial.points ?? {}) },
    selected: partial.selected ?? null,
    winner: partial.winner ?? null,
    past: partial.past ?? [],
  };
  return settle(game);
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
    return remember(game, next);
  }
  return remember(game, finishTurn(next));
}

export function removePiece(game, pointId) {
  const errors = validateRemove(game, pointId);
  if (errors.length > 0) {
    throw new GameError(errors);
  }
  const next = cloneGame(game);
  next.points[pointId] = null;
  return remember(game, finishTurn(next));
}

export function playPoint(game, pointId) {
  if (game.winner || game.phase === 'over') {
    throw new GameError(['phase: the game is over']);
  }
  if (game.phase === 'remove') {
    return removePiece(game, pointId);
  }
  if (game.phase === 'slide') {
    return playSlide(game, pointId);
  }
  return placePiece(game, pointId);
}

export function selectPiece(game, pointId) {
  const errors = validateSelect(game, pointId);
  if (errors.length > 0) {
    throw new GameError(errors);
  }
  const next = cloneGame(game);
  next.selected = pointId;
  return remember(game, next);
}

export function slidePiece(game, fromId, toId) {
  const errors = validateSlide(game, fromId, toId);
  if (errors.length > 0) {
    throw new GameError(errors);
  }
  const next = cloneGame(game);
  next.points[fromId] = null;
  next.points[toId] = game.turn;
  next.selected = null;
  const foe = other(game.turn);
  if (formedMill(next.points, toId) && hasTake(next.points, foe)) {
    next.phase = 'remove';
    return remember(game, next);
  }
  return remember(game, finishTurn(next));
}

function playSlide(game, pointId) {
  const occ = occupant(game.points, pointId);
  if (game.selected === null || occ === game.turn) {
    if (game.selected === pointId) {
      const next = cloneGame(game);
      next.selected = null;
      return remember(game, next);
    }
    return selectPiece(game, pointId);
  }
  return slidePiece(game, game.selected, pointId);
}

function finishTurn(game) {
  const next = cloneGame(game);
  next.selected = null;
  const beaten = beatenColour(next.points, next.toPlace);
  if (beaten) {
    next.winner = other(beaten);
    next.phase = 'over';
    return next;
  }
  next.turn = other(game.turn);
  if (next.toPlace.dark === 0 && next.toPlace.light === 0) {
    next.phase = 'slide';
  } else {
    next.phase = 'place';
  }
  return settle(next);
}

function settle(game) {
  const next = cloneGame(game);
  const beaten = beatenColour(next.points, next.toPlace);
  if (beaten) {
    next.winner = other(beaten);
    next.phase = 'over';
    return next;
  }
  if (next.phase === 'slide' && !hasLegalMove(next.points, next.turn)) {
    next.winner = other(next.turn);
    next.phase = 'over';
  }
  return next;
}

export function canUndo(game) {
  return (game.past ?? []).length > 0;
}

export function undo(game) {
  const past = game.past ?? [];
  if (past.length === 0) {
    throw new GameError(['past: no ply to undo']);
  }
  const prev = past[past.length - 1];
  return {
    ...cloneGame(prev),
    past: past.slice(0, -1),
  };
}

function snapshot(game) {
  return {
    turn: game.turn,
    phase: game.phase,
    toPlace: { dark: game.toPlace.dark, light: game.toPlace.light },
    points: { ...game.points },
    selected: game.selected ?? null,
    winner: game.winner ?? null,
    past: [],
  };
}

function remember(previous, next) {
  const out = cloneGame(next);
  out.past = [...(previous.past ?? []), snapshot(previous)];
  return out;
}

export function cloneGame(game) {
  return {
    turn: game.turn,
    phase: game.phase,
    toPlace: { dark: game.toPlace.dark, light: game.toPlace.light },
    points: { ...game.points },
    selected: game.selected ?? null,
    winner: game.winner ?? null,
    past: game.past ?? [],
  };
}
