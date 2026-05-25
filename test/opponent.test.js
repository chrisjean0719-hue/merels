import test from 'node:test';
import assert from 'node:assert/strict';
import { fromPosition, playPoint } from '../src/game.js';
import { choosePoint, playOpponent, undoHuman } from '../src/opponent.js';

test('the opponent closes a mill when it can', () => {
  const game = fromPosition({
    phase: 'place',
    turn: 'light',
    toPlace: { dark: 8, light: 7 },
    points: { a7: 'light', d7: 'light', a1: 'dark' },
  });
  assert.equal(choosePoint(game), 'g7');
});

test('the opponent blocks a mill when it cannot close one', () => {
  const game = fromPosition({
    phase: 'place',
    turn: 'light',
    toPlace: { dark: 7, light: 8 },
    points: { a7: 'dark', d7: 'dark', a1: 'light' },
  });
  assert.equal(choosePoint(game), 'g7');
});

test('after dark places, light answers', () => {
  const game = playOpponent(playPoint(fromPosition({ phase: 'place' }), 'a1'));
  assert.equal(game.points.a1, 'dark');
  assert.equal(game.turn, 'dark');
  assert.equal(game.toPlace.light, 8);
  assert.ok(Object.values(game.points).includes('light'));
});

test('undo takes back dark and the opponent reply', () => {
  const played = playOpponent(playPoint(fromPosition({ phase: 'place' }), 'a1'));
  const back = undoHuman(played);
  assert.equal(back.points.a1, null);
  assert.equal(back.turn, 'dark');
  assert.equal(back.toPlace.dark, 9);
});
