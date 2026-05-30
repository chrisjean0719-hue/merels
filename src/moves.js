export function plyNotation(kind, clicks) {
  if (kind === 'place') {
    return clicks.length > 1 ? `${clicks[0]}x${clicks[1]}` : clicks[0];
  }
  const [from, to, take] = clicks;
  const slide = `${from}-${to}`;
  return take ? `${slide}x${take}` : slide;
}

export function copyPlies(plies) {
  return (plies ?? []).map((ply) => ({
    colour: ply.colour,
    kind: ply.kind,
    notation: ply.notation,
    clicks: [...(ply.clicks ?? [])],
    after: ply.after ? copyPosition(ply.after) : null,
  }));
}

export function copyPosition(position) {
  if (!position) return null;
  return {
    turn: position.turn,
    phase: position.phase,
    toPlace: { dark: position.toPlace.dark, light: position.toPlace.light },
    points: { ...position.points },
    selected: position.selected ?? null,
    winner: position.winner ?? null,
  };
}

export function formatMoveList(plies) {
  const rows = [];
  for (let i = 0; i < plies.length; i += 2) {
    const n = i / 2 + 1;
    const dark = plies[i].notation;
    const light = plies[i + 1]?.notation;
    rows.push(light ? `${n}. ${dark} ${light}` : `${n}. ${dark}`);
  }
  return rows.join('\n');
}

export function renderMoveList(plies, cursor) {
  if (!plies.length) {
    return '<ol class="moves"></ol>';
  }
  const items = [];
  for (let i = 0; i < plies.length; i += 2) {
    const n = i / 2 + 1;
    const dark = plyButton(plies[i], i + 1, `${n}. ${plies[i].notation}`, cursor);
    const light = plies[i + 1]
      ? plyButton(plies[i + 1], i + 2, plies[i + 1].notation, cursor)
      : '';
    items.push(`<li>${dark}${light}</li>`);
  }
  return `<ol class="moves">${items.join('')}</ol>`;
}

function plyButton(ply, index, label, cursor) {
  const current = index === cursor ? ' aria-current="step"' : '';
  return `<button type="button" data-ply="${index}" aria-label="${ply.colour} ${ply.notation}"${current}>${label}</button>`;
}
