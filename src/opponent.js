import { playPoint, undo, canUndo } from './game.js';
import { legalPoints } from './hints.js';
import { MILLS } from './points.js';

export const OPPONENT = 'light';
export const HUMAN = 'dark';

export function choosePoint(game) {
  const legal = legalPoints(game);
  if (legal.length === 0) return null;
  return (
    legal.find((id) => closesMill(game, id)) ??
    legal.find((id) => blocksMill(game, id)) ??
    legal[0]
  );
}

export function playOpponent(game) {
  let next = game;
  let guard = 0;
  while (next.turn === OPPONENT && !next.winner && next.phase !== 'over' && guard < 8) {
    const id = choosePoint(next);
    if (!id) break;
    next = playPoint(next, id);
    guard += 1;
  }
  return next;
}

export function undoHuman(game) {
  if (!canUndo(game)) {
    return undo(game);
  }
  let next = undo(game);
  while (canUndo(next) && (next.turn !== HUMAN || next.selected)) {
    next = undo(next);
  }
  return next;
}

function tryPlay(game, id) {
  try {
    return playPoint(game, id);
  } catch {
    return null;
  }
}

function closesMill(game, id) {
  const next = tryPlay(game, id);
  if (!next) return false;
  if (next.phase === 'remove' && next.turn === game.turn) return true;
  if (game.phase === 'slide' && !game.selected && next.selected === id) {
    return legalPoints(next).some((to) => closesMill(next, to));
  }
  return false;
}

function blocksMill(game, id) {
  if (game.phase === 'slide' && !game.selected) {
    const next = tryPlay(game, id);
    return next ? legalPoints(next).some((to) => blocksMill(next, to)) : false;
  }
  if (game.points[id] !== null) return false;
  const foe = game.turn === 'dark' ? 'light' : 'dark';
  return MILLS.some(
    (mill) => mill.includes(id) && mill.filter((point) => point !== id).every((point) => game.points[point] === foe),
  );
}
