import { mayFly } from './board.js';
import { legalPoints } from './hints.js';
import { MILLS, POINTS, fileIndex, rankIndex } from './points.js';
import {
  BOARD_FILL,
  BOARD_SIZE,
  DARK_FILL,
  HINT_FILL,
  HINT_STROKE,
  HIT_R,
  LABEL_FILL,
  LIGHT_FILL,
  LIGHT_STROKE,
  LINE_STROKE,
  PAD,
  PIECE_R,
  POINT_FILL,
  POINT_R,
  SELECT_STROKE,
  STEP,
} from './sizes.js';

export function pointXY(id) {
  return {
    x: PAD + fileIndex(id) * STEP,
    y: PAD + (7 - rankIndex(id)) * STEP,
  };
}

export function renderBoard(game) {
  const lines = MILLS.map((mill) => {
    const d = mill
      .map((id, index) => {
        const { x, y } = pointXY(id);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
    return `<path d="${d}" fill="none" stroke="${LINE_STROKE}" stroke-width="4" />`;
  }).join('');

  const labels = fileLabels() + rankLabels();
  const hints = new Set(legalPoints(game));

  const points = POINTS.map((id) => {
    const { x, y } = pointXY(id);
    const colour = game.points[id];
    const hinted = hints.has(id);
    const piece = colour ? pieceMarkup(x, y, colour, game.selected === id, hinted) : '';
    const fill = hinted && !colour ? HINT_FILL : POINT_FILL;
    const stroke = hinted ? HINT_STROKE : LINE_STROKE;
    const hintAttr = hinted ? ' data-hint="true"' : '';
    return `<g data-point="${id}"${hintAttr} role="button" tabindex="0" aria-label="${pointLabel(id, colour, game, hints)}">
      <circle class="hit" cx="${x}" cy="${y}" r="${HIT_R}" fill="transparent" />
      <circle class="spot${hinted ? ' hint' : ''}" cx="${x}" cy="${y}" r="${POINT_R}" fill="${fill}" stroke="${stroke}" stroke-width="${hinted ? 3 : 2}" />
      ${piece}
    </g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOARD_SIZE} ${BOARD_SIZE}" width="${BOARD_SIZE}" height="${BOARD_SIZE}" role="img" aria-label="Merels board">
    <rect width="${BOARD_SIZE}" height="${BOARD_SIZE}" fill="${BOARD_FILL}" />
    ${lines}
    ${labels}
    ${points}
  </svg>`;
}

function pointLabel(id, colour, game, hints) {
  if (game.winner || game.phase === 'over') {
    if (colour === 'dark') return `Dark on ${id}`;
    if (colour === 'light') return `Light on ${id}`;
    return `Empty ${id}`;
  }
  if (game.phase === 'remove' && hints.has(id)) {
    const who = colour === 'dark' ? 'Dark' : 'Light';
    return `Take ${who} on ${id}`;
  }
  if (game.phase === 'slide') {
    const verb = mayFly(game.points, game.turn) ? 'Fly' : 'Slide';
    if (colour === game.turn && (hints.has(id) || game.selected === id)) {
      return `${verb} from ${id}`;
    }
    if (!colour && hints.has(id)) return `${verb} to ${id}`;
  }
  if (colour === 'dark') return `Dark on ${id}`;
  if (colour === 'light') return `Light on ${id}`;
  return `Place on ${id}`;
}

function pieceMarkup(x, y, colour, selected, hinted) {
  const stroke = selected ? SELECT_STROKE : hinted ? HINT_STROKE : colour === 'light' ? LIGHT_STROKE : null;
  const width = selected ? 4 : hinted ? 3 : 2;
  const klass = `piece${selected ? ' selected' : ''}${hinted ? ' hint' : ''}`;
  if (colour === 'dark') {
    const extra = stroke ? ` stroke="${stroke}" stroke-width="${width}"` : '';
    return `<circle class="${klass}" cx="${x}" cy="${y}" r="${PIECE_R}" fill="${DARK_FILL}"${extra} />`;
  }
  return `<circle class="${klass}" cx="${x}" cy="${y}" r="${PIECE_R}" fill="${LIGHT_FILL}" stroke="${stroke}" stroke-width="${width}" />`;
}

function fileLabels() {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    .map((file, index) => {
      const x = PAD + index * STEP;
      const y = BOARD_SIZE - 16;
      return `<text x="${x}" y="${y}" text-anchor="middle" fill="${LABEL_FILL}" font-size="14">${file}</text>`;
    })
    .join('');
}

function rankLabels() {
  return [7, 6, 5, 4, 3, 2, 1]
    .map((rank, index) => {
      const x = 16;
      const y = PAD + index * STEP + 4;
      return `<text x="${x}" y="${y}" text-anchor="middle" fill="${LABEL_FILL}" font-size="14">${rank}</text>`;
    })
    .join('');
}
