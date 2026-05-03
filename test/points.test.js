import test from 'node:test';
import assert from 'node:assert/strict';
import { MILLS, NEIGHBOURS, POINTS, isPoint, neighbours } from '../src/points.js';
import { POINT_COUNT } from '../src/sizes.js';

test('the board has 24 points', () => {
  assert.equal(POINTS.length, POINT_COUNT);
  assert.equal(new Set(POINTS).size, POINT_COUNT);
});

test('every mill has three distinct board points', () => {
  assert.equal(MILLS.length, 16);
  for (const mill of MILLS) {
    assert.equal(mill.length, 3);
    assert.equal(new Set(mill).size, 3);
    for (const id of mill) {
      assert.equal(isPoint(id), true);
    }
  }
});

test('neighbours follow the mill lines', () => {
  assert.deepEqual(neighbours('d7').sort(), ['a7', 'd6', 'g7']);
  assert.deepEqual(neighbours('d5').sort(), ['c5', 'd6', 'e5']);
  assert.equal(neighbours('d5').includes('d3'), false);
  assert.equal(isPoint('d4'), false);
});

test('every point has at least two neighbours', () => {
  for (const id of POINTS) {
    assert.ok(NEIGHBOURS[id].length >= 2);
  }
});
