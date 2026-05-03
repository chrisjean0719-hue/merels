import { occupant } from './board.js';
import { isPoint } from './points.js';

export function validatePlace(game, pointId) {
  const errors = [];
  if (game === null || typeof game !== 'object' || Array.isArray(game)) {
    return ['game: Game must be an object'];
  }
  if (game.phase !== 'place') {
    errors.push('phase: placement is complete');
  }
  if (!isPoint(pointId)) {
    errors.push('point: point must be a board point');
    return errors;
  }
  if (occupant(game.points, pointId) !== null) {
    errors.push('point: that point is taken');
  }
  const left = game.toPlace?.[game.turn];
  if (typeof left !== 'number' || left < 1) {
    errors.push('toPlace: that colour has no pieces left to place');
  }
  return errors;
}
