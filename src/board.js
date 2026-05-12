import { POINTS } from './points.js';
import { FLY_COUNT } from './sizes.js';

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
