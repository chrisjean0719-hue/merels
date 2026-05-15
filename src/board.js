import { POINTS, neighbours } from './points.js';
import { FLY_COUNT, MIN_PIECES } from './sizes.js';

export function emptyPoints() {
  return Object.fromEntries(POINTS.map((id) => [id, null]));
}

export function occupant(points, id) {
  return points[id] ?? null;
}

export function occupiedCount(points, colour) {
  return POINTS.filter((id) => points[id] === colour).length;
}

export function emptyCount(points) {
  return POINTS.filter((id) => points[id] === null).length;
}

export function mayFly(points, colour) {
  return occupiedCount(points, colour) === FLY_COUNT;
}

export function beatenColour(points, toPlace) {
  for (const colour of ['dark', 'light']) {
    if ((toPlace?.[colour] ?? 0) === 0 && occupiedCount(points, colour) < MIN_PIECES) {
      return colour;
    }
  }
  return null;
}

export function hasLegalMove(points, colour) {
  const ids = POINTS.filter((id) => points[id] === colour);
  if (ids.length === 0) return false;
  if (mayFly(points, colour)) {
    return emptyCount(points) > 0;
  }
  return ids.some((from) => neighbours(from).some((to) => points[to] === null));
}
