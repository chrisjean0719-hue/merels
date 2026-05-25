# Merels

A browser game for nine men's morris. Two players place nine pieces each on the 24-point board. Dark starts. You play Dark. Light is a rules-based opponent that closes a mill if it can, else blocks yours, else takes a legal point. Click an empty point to place a piece. Three of one colour on a mill line is a mill, and that player then takes an opponent piece. After both colours have placed nine, click a piece and then an empty neighbour to slide it. A colour down to three pieces may fly to any empty point. A colour with two pieces, or with no legal move, loses. Legal points for the current ply are marked with a warm ring. Undo takes back your last ply and Light's reply. The board uses the usual point names, a1 to g7.

It is for someone learning placing, mills, sliding, flying, a win, legal points, undo, and an opponent at home. The sample opening is made up. The page does not store names, scores under a person, or accounts.

Written in JavaScript for Node 22.18 or newer. It has no dependencies. Tests use `node --test`.

## Run

```bash
npm test
node bin/serve.js
```

The game is at http://127.0.0.1:8028.

Dark places first. Each colour has 9 pieces. Occupied points reject a second piece. Three of one colour on a mill line is a mill. That player then takes one opponent piece. A piece in a mill is safe unless every opponent piece is in a mill. After both have placed nine, Dark slides first. Click your piece, then an empty neighbour. A colour with exactly three pieces on the board may fly to any empty point. A move that makes a mill still takes a piece. After placing is done, a colour with fewer than three pieces on the board loses. A colour that cannot slide or fly also loses. Empty points, movable pieces, and takes that are legal for this ply get a warm ring. You play Dark. After each Dark ply, Light answers: it closes a mill if it can, else blocks yours, else takes the first legal point. Undo takes back Light's reply and your last ply. New game clears the board. The sample opening a7, g7, a1, g1, d7 leaves Dark with 6 in hand and Light with 7, and it is Light to place. The sample mill a7, b6, d7, d6, g7 leaves Dark to take Light from b6 or d6. The sample slide fills the first 18 points; Dark then slides b4 to b2. The sample fly is at http://127.0.0.1:8028/?fixture=fly : Dark on a7, d7, and a1 flies a1 to e5. The sample win is at http://127.0.0.1:8028/?fixture=win : Dark flies a1 to g7, takes b6, and wins.

## Layout

```
src/            the board graph, placing, mills, sliding, flying, a win, hints, undo, the opponent, the SVG, the static server
examples/       a fictional opening
test/           unit tests
```

## Next

About 35 hours of later work stay in [ROADMAP.md](ROADMAP.md).

## License

MIT
