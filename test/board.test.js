import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyCount, emptyPoints, occupant, occupiedCount } from '../src/board.js';
import { POINT_COUNT } from '../src/sizes.js';

test('an empty board has 24 free points', () => {
  const points = emptyPoints();
  assert.equal(emptyCount(points), POINT_COUNT);
  assert.equal(occupant(points, 'a7'), null);
  assert.equal(occupiedCount(points, 'dark'), 0);
});
