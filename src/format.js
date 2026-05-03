import { occupiedCount } from './board.js';

export function formatStatus(game) {
  if (game.phase === 'placed') {
    return 'Placement is complete.';
  }
  const left = game.toPlace[game.turn];
  const who = game.turn === 'dark' ? 'Dark' : 'Light';
  return `${who} to place (${left} left)`;
}

export function formatBoard(game) {
  const dark = occupiedCount(game.points, 'dark');
  const light = occupiedCount(game.points, 'light');
  return [
    formatStatus(game),
    `dark: ${dark} on the board, ${game.toPlace.dark} in hand`,
    `light: ${light} on the board, ${game.toPlace.light} in hand`,
  ].join('\n');
}
