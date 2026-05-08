import test from 'node:test';
import assert from 'node:assert/strict';
import { GameError } from '../src/error.js';
import { fromPosition, placePiece, playPoint } from '../src/game.js';
import { slideGame } from '../src/sample.js';

test('eighteen places start the sliding phase', () => {
  const game = slideGame();
  assert.equal(game.phase, 'slide');
  assert.equal(game.turn, 'dark');
  assert.equal(game.selected, null);
  assert.equal(game.toPlace.dark, 0);
  assert.equal(game.toPlace.light, 0);
});

test('a slide moves a piece to an empty neighbour', () => {
  const selected = playPoint(slideGame(), 'b4');
  assert.equal(selected.selected, 'b4');
  const moved = playPoint(selected, 'b2');
  assert.equal(moved.points.b4, null);
  assert.equal(moved.points.b2, 'dark');
  assert.equal(moved.turn, 'light');
  assert.equal(moved.phase, 'slide');
  assert.equal(moved.selected, null);
});

test('a slide rejects a point that is not a neighbour', () => {
  const selected = playPoint(slideGame(), 'b4');
  assert.throws(() => playPoint(selected, 'g1'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'point: that point is not a neighbour');
    return true;
  });
});

test('a slide that makes a mill asks for a take', () => {
  const game = fromPosition({
    phase: 'slide',
    turn: 'dark',
    toPlace: { dark: 0, light: 0 },
    points: {
      a7: 'dark',
      d7: 'dark',
      g4: 'dark',
      b6: 'light',
      a1: 'light',
    },
  });
  const selected = playPoint(game, 'g4');
  const moved = playPoint(selected, 'g7');
  assert.equal(moved.points.g7, 'dark');
  assert.equal(moved.points.g4, null);
  assert.equal(moved.phase, 'remove');
  assert.equal(moved.turn, 'dark');
});

test('placing is done once the board is sliding', () => {
  assert.throws(() => placePiece(slideGame(), 'b2'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'phase: placement is complete');
    return true;
  });
});
