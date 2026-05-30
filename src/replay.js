import { fromPosition } from './game.js';
import { copyPlies } from './moves.js';

export function replayTo(origin, plies, n) {
  const count = Math.max(0, Math.min(n, plies.length));
  if (count === 0) {
    return fromPosition({
      ...origin,
      plies: [],
      plyClicks: [],
      plyKind: null,
      origin,
      past: [],
    });
  }
  const ply = plies[count - 1];
  return fromPosition({
    ...ply.after,
    plies: copyPlies(plies.slice(0, count)),
    origin,
    past: [],
  });
}
