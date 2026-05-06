import test from 'node:test';
import assert from 'node:assert/strict';
import { GameError } from '../src/error.js';
import { createGame, placePiece, removePiece } from '../src/game.js';
import { inMill } from '../src/mill.js';
import { millGame } from '../src/sample.js';

test('three in a line is a mill and asks for a take', () => {
  const game = millGame();
  assert.equal(game.phase, 'remove');
  assert.equal(game.turn, 'dark');
  assert.equal(inMill(game.points, 'g7'), true);
  assert.equal(game.points.b6, 'light');
  assert.equal(game.points.d6, 'light');
});

test('a take clears an opponent piece and hands the turn over', () => {
  const game = removePiece(millGame(), 'b6');
  assert.equal(game.points.b6, null);
  assert.equal(game.phase, 'place');
  assert.equal(game.turn, 'light');
  assert.equal(game.toPlace.dark, 6);
  assert.equal(game.toPlace.light, 7);
});

test('a mill cannot be taken while a free piece is on the board', () => {
  let game = createGame();
  for (const id of ['a7', 'a1', 'd7', 'd1', 'b2', 'g1']) {
    game = placePiece(game, id);
  }
  game = removePiece(game, 'b2');
  game = placePiece(game, 'f2');
  game = placePiece(game, 'b6');
  game = placePiece(game, 'g7');
  assert.equal(game.phase, 'remove');
  assert.equal(inMill(game.points, 'a1'), true);
  assert.throws(() => removePiece(game, 'a1'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'point: that piece is in a mill');
    return true;
  });
  const next = removePiece(game, 'b6');
  assert.equal(next.points.b6, null);
  assert.equal(next.points.a1, 'light');
});

test('a mill can be taken when every opponent piece is in a mill', () => {
  let game = createGame();
  for (const id of ['a7', 'a1', 'd7', 'd1', 'b2', 'g1']) {
    game = placePiece(game, id);
  }
  game = removePiece(game, 'b2');
  game = placePiece(game, 'g7');
  assert.equal(game.phase, 'remove');
  const next = removePiece(game, 'a1');
  assert.equal(next.points.a1, null);
  assert.equal(next.turn, 'light');
});

test('placing is blocked until the mill is taken', () => {
  try {
    placePiece(millGame(), 'a4');
  } catch (err) {
    assert.ok(err instanceof GameError);
    assert.deepEqual(err.errors, ['phase: take a piece first']);
  }
});
