import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, playPoint } from '../src/game.js';
import { formatMoveList } from '../src/moves.js';
import { playOpponent } from '../src/opponent.js';
import { replayTo } from '../src/replay.js';
import { millGame, slideGame, winGame } from '../src/sample.js';

test('a place is listed in notation', () => {
  const game = playPoint(createGame(), 'a7');
  assert.equal(game.plies.length, 1);
  assert.equal(game.plies[0].notation, 'a7');
  assert.equal(game.plies[0].colour, 'dark');
  assert.equal(formatMoveList(game.plies), '1. a7');
});

test('a mill and take is one ply', () => {
  const taken = playPoint(millGame(), 'b6');
  const last = taken.plies[taken.plies.length - 1];
  assert.equal(last.notation, 'g7xb6');
  assert.equal(last.colour, 'dark');
  assert.equal(last.clicks.join(','), 'g7,b6');
});

test('a slide is listed from-to', () => {
  const moved = playPoint(playPoint(slideGame(), 'b4'), 'b2');
  const last = moved.plies[moved.plies.length - 1];
  assert.equal(last.notation, 'b4-b2');
  assert.equal(last.kind, 'slide');
});

test('a fly that takes is listed from-to-take', () => {
  const over = playPoint(playPoint(playPoint(winGame(), 'a1'), 'g7'), 'b6');
  const last = over.plies[over.plies.length - 1];
  assert.equal(last.notation, 'a1-g7xb6');
  assert.equal(over.winner, 'dark');
});

test('after dark places, light is listed too', () => {
  const game = playOpponent(playPoint(createGame(), 'a7'));
  assert.equal(game.plies.length, 2);
  assert.equal(game.plies[0].notation, 'a7');
  assert.equal(game.plies[1].colour, 'light');
  assert.match(formatMoveList(game.plies), /^1\. a7 /);
});

test('replay from the start is an empty board', () => {
  const played = playOpponent(playPoint(createGame(), 'a7'));
  const start = replayTo(played.origin, played.plies, 0);
  assert.equal(start.points.a7, null);
  assert.equal(start.turn, 'dark');
  assert.equal(start.plies.length, 0);
});

test('replay one ply restores that place', () => {
  const played = playOpponent(playPoint(createGame(), 'a7'));
  const first = replayTo(played.origin, played.plies, 1);
  assert.equal(first.points.a7, 'dark');
  assert.equal(first.turn, 'light');
  assert.equal(first.plies.length, 1);
  const both = replayTo(played.origin, played.plies, 2);
  assert.equal(both.turn, 'dark');
  assert.ok(Object.values(both.points).includes('light'));
});

test('replay of a mill fixture starts at the mill', () => {
  const mill = millGame();
  const start = replayTo(mill.origin, mill.plies, 0);
  assert.equal(start.phase, 'place');
  assert.equal(start.points.a7, null);
  const end = replayTo(mill.origin, mill.plies, mill.plies.length);
  assert.equal(end.phase, 'remove');
  assert.equal(end.points.g7, 'dark');
});
