import { occupant, occupiedCount } from './board.js';
import { MILLS, POINTS } from './points.js';

export function inMill(points, id) {
  const colour = occupant(points, id);
  if (!colour) return false;
  return MILLS.some(
    (mill) => mill.includes(id) && mill.every((point) => points[point] === colour),
  );
}

export function formedMill(points, id) {
  return inMill(points, id);
}

export function allInMills(points, colour) {
  const ids = POINTS.filter((id) => points[id] === colour);
  return ids.length > 0 && ids.every((id) => inMill(points, id));
}

export function canTake(points, colour, id) {
  if (occupant(points, id) !== colour) return false;
  if (!inMill(points, id)) return true;
  return allInMills(points, colour);
}

export function takeTargets(points, colour) {
  return POINTS.filter((id) => canTake(points, colour, id));
}

export function hasTake(points, colour) {
  return takeTargets(points, colour).length > 0 && occupiedCount(points, colour) > 0;
}
