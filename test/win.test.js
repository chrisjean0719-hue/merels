import test from 'node:test';
import assert from 'node:assert/strict';
import { GameError } from '../src/error.js';
import { playPoint, removePiece } from '../src/game.js';
import { blockedGame, winGame } from '../src/sample.js';

test('taking a colour down to two pieces wins', () => {
  const mill = playPoint(playPoint(winGame(), 'a1'), 'g7');
  assert.equal(mill.phase, 'remove');
  const over = removePiece(mill, 'b6');
  assert.equal(over.winner, 'dark');
  assert.equal(over.phase, 'over');
  assert.equal(over.points.b6, null);
});

test('a colour with no legal slide loses', () => {
  const game = blockedGame();
  assert.equal(game.winner, 'light');
  assert.equal(game.phase, 'over');
});

test('a finished game rejects a further place', () => {
  const over = blockedGame();
  assert.throws(() => playPoint(over, 'b2'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'phase: the game is over');
    return true;
  });
});
