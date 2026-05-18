import test from 'node:test';
import assert from 'node:assert/strict';
import { legalPoints } from '../src/hints.js';
import { playPoint, createGame } from '../src/game.js';
import { blockedGame, flyGame, millGame, slideGame } from '../src/sample.js';
import { POINTS } from '../src/points.js';

test('an empty board hints every point for a place', () => {
  assert.deepEqual(legalPoints(createGame()).sort(), [...POINTS].sort());
});

test('a mill hints the opponent pieces that can be taken', () => {
  const hints = legalPoints(millGame());
  assert.deepEqual(hints.sort(), ['b6', 'd6']);
});

test('a sliding board hints pieces that have an empty neighbour', () => {
  const hints = legalPoints(slideGame());
  assert.equal(hints.includes('b4'), true);
  assert.equal(hints.includes('a7'), false);
});

test('a selected slide hints empty neighbours only', () => {
  const hints = legalPoints(playPoint(slideGame(), 'b4'));
  assert.deepEqual(hints.sort(), ['b2']);
});

test('a flying board hints every empty point after a select', () => {
  const hints = legalPoints(playPoint(flyGame(), 'a1'));
  assert.equal(hints.includes('e5'), true);
  assert.equal(hints.includes('g7'), false);
  assert.equal(hints.includes('a1'), false);
});

test('a finished board has no hints', () => {
  assert.deepEqual(legalPoints(blockedGame()), []);
});
