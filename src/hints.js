import { mayFly } from './board.js';
import { takeTargets } from './mill.js';
import { POINTS, neighbours } from './points.js';

export function destinations(game, fromId) {
  if (game.points[fromId] !== game.turn) return [];
  if (mayFly(game.points, game.turn)) {
    return POINTS.filter((id) => game.points[id] === null);
  }
  return neighbours(fromId).filter((id) => game.points[id] === null);
}

export function legalPoints(game) {
  if (game.winner || game.phase === 'over') return [];
  if (game.phase === 'place') {
    return POINTS.filter((id) => game.points[id] === null);
  }
  if (game.phase === 'remove') {
    const foe = game.turn === 'dark' ? 'light' : 'dark';
    return takeTargets(game.points, foe);
  }
  if (game.phase === 'slide') {
    if (game.selected) {
      return destinations(game, game.selected);
    }
    return POINTS.filter(
      (id) => game.points[id] === game.turn && destinations(game, id).length > 0,
    );
  }
  return [];
}
