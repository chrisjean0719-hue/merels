import { beatenColour, emptyPoints, hasLegalMove, occupant } from './board.js';
import { GameError } from './error.js';
import { formedMill, hasTake } from './mill.js';
import { copyPlies, copyPosition, plyNotation } from './moves.js';
import { PIECES } from './sizes.js';
import { validatePlace, validateRemove, validateSelect, validateSlide } from './validate.js';

export const DARK = 'dark';
export const LIGHT = 'light';

export function createGame() {
  const game = {
    turn: DARK,
    phase: 'place',
    toPlace: { dark: PIECES, light: PIECES },
    points: emptyPoints(),
    selected: null,
    winner: null,
    past: [],
    plies: [],
    plyClicks: [],
    plyKind: null,
    origin: null,
  };
  game.origin = originOf(game);
  return game;
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
    plies: copyPlies(partial.plies ?? []),
    plyClicks: [...(partial.plyClicks ?? [])],
    plyKind: partial.plyKind ?? null,
    origin: partial.origin ? copyPosition(partial.origin) : null,
  };
  const settled = settle(game);
  settled.origin = partial.origin ? copyPosition(partial.origin) : originOf(settled);
  return settled;
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
  const withPly = pushPly(next, 'place', [pointId]);
  const foe = other(game.turn);
  if (formedMill(withPly.points, pointId) && hasTake(withPly.points, foe)) {
    withPly.phase = 'remove';
    return remember(game, stampAfter(withPly));
  }
  return remember(game, finishTurn(withPly));
}

export function removePiece(game, pointId) {
  const errors = validateRemove(game, pointId);
  if (errors.length > 0) {
    throw new GameError(errors);
  }
  const next = cloneGame(game);
  next.points[pointId] = null;
  return remember(game, finishTurn(amendTake(next, pointId)));
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
  next.plyKind = 'slide';
  next.plyClicks = [pointId];
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
  const withPly = pushPly(next, 'slide', [fromId, toId]);
  const foe = other(game.turn);
  if (formedMill(withPly.points, toId) && hasTake(withPly.points, foe)) {
    withPly.phase = 'remove';
    return remember(game, stampAfter(withPly));
  }
  return remember(game, finishTurn(withPly));
}

function playSlide(game, pointId) {
  const occ = occupant(game.points, pointId);
  if (game.selected === null || occ === game.turn) {
    if (game.selected === pointId) {
      const next = cloneGame(game);
      next.selected = null;
      next.plyKind = null;
      next.plyClicks = [];
      return remember(game, next);
    }
    return selectPiece(game, pointId);
  }
  return slidePiece(game, game.selected, pointId);
}

function finishTurn(game) {
  const next = cloneGame(game);
  next.selected = null;
  next.plyKind = null;
  next.plyClicks = [];
  const beaten = beatenColour(next.points, next.toPlace);
  if (beaten) {
    next.winner = other(beaten);
    next.phase = 'over';
    return stampAfter(next);
  }
  next.turn = other(game.turn);
  if (next.toPlace.dark === 0 && next.toPlace.light === 0) {
    next.phase = 'slide';
  } else {
    next.phase = 'place';
  }
  return stampAfter(settle(next));
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
    origin: copyPosition(game.origin),
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
    plies: copyPlies(game.plies),
    plyClicks: [...(game.plyClicks ?? [])],
    plyKind: game.plyKind ?? null,
  };
}

function originOf(game) {
  return copyPosition({
    turn: game.turn,
    phase: game.phase,
    toPlace: game.toPlace,
    points: game.points,
    selected: game.selected ?? null,
    winner: game.winner ?? null,
  });
}

function pushPly(game, kind, clicks) {
  const next = cloneGame(game);
  next.plyKind = kind;
  next.plyClicks = [...clicks];
  next.plies = [
    ...(game.plies ?? []),
    {
      colour: game.turn,
      kind,
      clicks: [...clicks],
      notation: plyNotation(kind, clicks),
      after: null,
    },
  ];
  return next;
}

function amendTake(game, pointId) {
  const plies = game.plies ?? [];
  const last = plies[plies.length - 1];
  if (!last) return game;
  const clicks = [...last.clicks, pointId];
  const next = cloneGame(game);
  next.plyClicks = clicks;
  next.plies = [
    ...plies.slice(0, -1),
    {
      ...last,
      clicks,
      notation: plyNotation(last.kind, clicks),
    },
  ];
  return next;
}

function stampAfter(game) {
  const plies = game.plies ?? [];
  if (plies.length === 0) return game;
  const next = cloneGame(game);
  const last = next.plies[next.plies.length - 1];
  next.plies = [...next.plies.slice(0, -1), { ...last, after: originOf(next) }];
  return next;
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
    plies: copyPlies(game.plies),
    plyClicks: [...(game.plyClicks ?? [])],
    plyKind: game.plyKind ?? null,
    origin: copyPosition(game.origin),
  };
}
