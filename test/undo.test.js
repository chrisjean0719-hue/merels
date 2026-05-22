import test from 'node:test';
import assert from 'node:assert/strict';
import { GameError } from '../src/error.js';
import { canUndo, createGame, playPoint, undo } from '../src/game.js';
import { millGame, slideGame, winGame } from '../src/sample.js';

test('undo takes back a place', () => {
  const placed = playPoint(createGame(), 'a7');
  assert.equal(placed.points.a7, 'dark');
  const back = undo(placed);
  assert.equal(back.points.a7, null);
  assert.equal(back.turn, 'dark');
  assert.equal(back.toPlace.dark, 9);
  assert.equal(canUndo(back), false);
});

test('undo takes back a take after a mill', () => {
  const taken = playPoint(millGame(), 'b6');
  assert.equal(taken.points.b6, null);
  const back = undo(taken);
  assert.equal(back.points.b6, 'light');
  assert.equal(back.phase, 'remove');
  assert.equal(back.turn, 'dark');
});

test('undo takes back a slide', () => {
  const moved = playPoint(playPoint(slideGame(), 'b4'), 'b2');
  assert.equal(moved.points.b2, 'dark');
  const unmoved = undo(moved);
  assert.equal(unmoved.points.b4, 'dark');
  assert.equal(unmoved.points.b2, null);
  assert.equal(unmoved.selected, 'b4');
  const unselected = undo(unmoved);
  assert.equal(unselected.selected, null);
  assert.equal(unselected.turn, 'dark');
});

test('undo takes back a winning take', () => {
  const mill = playPoint(playPoint(winGame(), 'a1'), 'g7');
  const over = playPoint(mill, 'b6');
  assert.equal(over.winner, 'dark');
  const back = undo(over);
  assert.equal(back.winner, null);
  assert.equal(back.phase, 'remove');
  assert.equal(back.points.b6, 'light');
});

test('an opening has no ply to undo', () => {
  assert.equal(canUndo(createGame()), false);
  assert.throws(() => undo(createGame()), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'past: no ply to undo');
    return true;
  });
});
