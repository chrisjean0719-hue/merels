import test from 'node:test';
import assert from 'node:assert/strict';
import { pointXY, renderBoard } from '../src/render.js';
import { createGame } from '../src/game.js';
import { midPlaceGame } from '../src/sample.js';
import { POINTS } from '../src/points.js';
import { BOARD_SIZE } from '../src/sizes.js';

test('the empty board draws 24 points', () => {
  const svg = renderBoard(createGame());
  assert.match(svg, new RegExp(`viewBox="0 0 ${BOARD_SIZE} ${BOARD_SIZE}"`));
  for (const id of POINTS) {
    assert.match(svg, new RegExp(`data-point="${id}"`));
    assert.match(svg, new RegExp(`aria-label="Place on ${id}"`));
  }
  assert.equal((svg.match(/class="piece"/g) ?? []).length, 0);
});

test('the sample opening draws three dark pieces and two light pieces', () => {
  const svg = renderBoard(midPlaceGame());
  assert.equal((svg.match(/class="piece"/g) ?? []).length, 5);
  assert.match(svg, /aria-label="Dark on a7"/);
  assert.match(svg, /aria-label="Light on g7"/);
  const a7 = pointXY('a7');
  assert.equal(a7.x, 48);
  assert.equal(a7.y, 48);
});
