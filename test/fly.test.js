import test from 'node:test';
import assert from 'node:assert/strict';
import { GameError } from '../src/error.js';
import { fromPosition, playPoint } from '../src/game.js';
import { flyGame } from '../src/sample.js';
import { slideGame } from '../src/sample.js';

test('three pieces on the board may fly to any empty point', () => {
  const selected = playPoint(flyGame(), 'a1');
  assert.equal(selected.selected, 'a1');
  const moved = playPoint(selected, 'e5');
  assert.equal(moved.points.a1, null);
  assert.equal(moved.points.e5, 'dark');
  assert.equal(moved.turn, 'light');
  assert.equal(moved.phase, 'slide');
});

test('more than three pieces still need a neighbour', () => {
  const selected = playPoint(slideGame(), 'b4');
  assert.throws(() => playPoint(selected, 'g1'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'point: that point is not a neighbour');
    return true;
  });
});

test('a fly that makes a mill asks for a take', () => {
  const game = fromPosition({
    phase: 'slide',
    turn: 'dark',
    toPlace: { dark: 0, light: 0 },
    points: {
      a7: 'dark',
      d7: 'dark',
      a1: 'dark',
      b6: 'light',
      g1: 'light',
      f2: 'light',
    },
  });
  const moved = playPoint(playPoint(game, 'a1'), 'g7');
  assert.equal(moved.points.g7, 'dark');
  assert.equal(moved.points.a1, null);
  assert.equal(moved.phase, 'remove');
  assert.equal(moved.turn, 'dark');
});
