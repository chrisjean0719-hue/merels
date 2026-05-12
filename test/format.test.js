import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBoard, formatStatus } from '../src/format.js';
import { createGame, placePiece } from '../src/game.js';
import { POINTS } from '../src/points.js';
import { flyGame, millGame, midPlaceGame } from '../src/sample.js';

test('an empty game asks dark to place nine', () => {
  assert.equal(formatStatus(createGame()), 'Dark to place (9 left)');
});

test('the sample opening asks light to place seven', () => {
  assert.equal(formatStatus(midPlaceGame()), 'Light to place (7 left)');
  assert.match(formatBoard(midPlaceGame()), /dark: 3 on the board, 6 in hand/);
});

test('a mill asks dark to take a piece', () => {
  assert.equal(formatStatus(millGame()), 'Dark to take a piece');
});

test('three pieces on the board ask dark to fly', () => {
  assert.equal(formatStatus(flyGame()), 'Dark to fly');
});

test('eighteen places ask dark to slide', () => {
  let game = createGame();
  for (const id of POINTS.slice(0, 18)) {
    game = placePiece(game, id);
  }
  assert.equal(formatStatus(game), 'Dark to slide');
});
