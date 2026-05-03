export const POINTS = [
  'a7',
  'd7',
  'g7',
  'b6',
  'd6',
  'f6',
  'c5',
  'd5',
  'e5',
  'a4',
  'b4',
  'c4',
  'e4',
  'f4',
  'g4',
  'c3',
  'd3',
  'e3',
  'b2',
  'd2',
  'f2',
  'a1',
  'd1',
  'g1',
];

export const MILLS = [
  ['a7', 'd7', 'g7'],
  ['b6', 'd6', 'f6'],
  ['c5', 'd5', 'e5'],
  ['a4', 'b4', 'c4'],
  ['e4', 'f4', 'g4'],
  ['c3', 'd3', 'e3'],
  ['b2', 'd2', 'f2'],
  ['a1', 'd1', 'g1'],
  ['a7', 'a4', 'a1'],
  ['b6', 'b4', 'b2'],
  ['c5', 'c4', 'c3'],
  ['d7', 'd6', 'd5'],
  ['d3', 'd2', 'd1'],
  ['e5', 'e4', 'e3'],
  ['f6', 'f4', 'f2'],
  ['g7', 'g4', 'g1'],
];

export const NEIGHBOURS = neighboursFromMills(MILLS);

export function isPoint(id) {
  return POINTS.includes(id);
}

export function fileIndex(id) {
  return id.charCodeAt(0) - 97;
}

export function rankIndex(id) {
  return Number(id.slice(1));
}

export function neighbours(id) {
  return NEIGHBOURS[id] ?? [];
}

function neighboursFromMills(mills) {
  const map = Object.fromEntries(POINTS.map((id) => [id, []]));
  for (const mill of mills) {
    for (let i = 0; i < mill.length - 1; i++) {
      const a = mill[i];
      const b = mill[i + 1];
      map[a].push(b);
      map[b].push(a);
    }
  }
  return map;
}
