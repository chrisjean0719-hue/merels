import { mayFly, occupiedCount } from './board.js';

export function formatStatus(game) {
  if (game.winner) {
    const who = game.winner === 'dark' ? 'Dark' : 'Light';
    return `${who} wins.`;
  }
  const who = game.turn === 'dark' ? 'Dark' : 'Light';
  if (game.phase === 'remove') {
    return `${who} to take a piece`;
  }
  if (game.phase === 'slide') {
    const verb = mayFly(game.points, game.turn) ? 'fly' : 'slide';
    if (game.selected) {
      return `${who} to ${verb} from ${game.selected}`;
    }
    return `${who} to ${verb}`;
  }
  const left = game.toPlace[game.turn];
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
