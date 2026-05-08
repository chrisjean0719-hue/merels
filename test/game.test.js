import test from 'node:test';
import assert from 'node:assert/strict';
import { GameError } from '../src/error.js';
import { createGame, placePiece } from '../src/game.js';
import { occupiedCount } from '../src/board.js';
import { POINTS } from '../src/points.js';
import { midPlaceGame, sampleGame } from '../src/sample.js';

test('dark places first on an empty board', () => {
  const game = sampleGame();
  assert.equal(game.turn, 'dark');
  assert.equal(game.phase, 'place');
  assert.equal(game.toPlace.dark, 9);
  assert.equal(game.toPlace.light, 9);
});

test('a place puts a piece and hands the turn over', () => {
  const game = placePiece(createGame(), 'a7');
  assert.equal(game.points.a7, 'dark');
  assert.equal(game.turn, 'light');
  assert.equal(game.toPlace.dark, 8);
  assert.equal(occupiedCount(game.points, 'dark'), 1);
});

test('the sample opening leaves light to place', () => {
  const game = midPlaceGame();
  assert.equal(game.points.a7, 'dark');
  assert.equal(game.points.g7, 'light');
  assert.equal(game.points.d7, 'dark');
  assert.equal(game.turn, 'light');
  assert.equal(game.toPlace.dark, 6);
  assert.equal(game.toPlace.light, 7);
});

test('an occupied point rejects a second piece', () => {
  const game = placePiece(createGame(), 'a7');
  assert.throws(() => placePiece(game, 'a7'), GameError);
  try {
    placePiece(game, 'a7');
  } catch (err) {
    assert.deepEqual(err.errors, ['point: that point is taken']);
  }
});

test('an unknown point is rejected', () => {
  try {
    placePiece(createGame(), 'd4');
  } catch (err) {
    assert.ok(err instanceof GameError);
    assert.deepEqual(err.errors, ['point: point must be a board point']);
  }
});

test('eighteen places complete the placing phase', () => {
  let game = createGame();
  for (const id of POINTS.slice(0, 18)) {
    game = placePiece(game, id);
  }
  assert.equal(game.phase, 'slide');
  assert.equal(game.toPlace.dark, 0);
  assert.equal(game.toPlace.light, 0);
  assert.equal(occupiedCount(game.points, 'dark'), 9);
  assert.equal(occupiedCount(game.points, 'light'), 9);
  assert.throws(() => placePiece(game, POINTS[18]), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'phase: placement is complete');
    return true;
  });
});
