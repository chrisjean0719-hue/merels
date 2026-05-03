# Merels

A browser game for nine men's morris. Two players place nine pieces each on the 24-point board. Dark starts. Click an empty point to place a piece. The board uses the usual point names, a1 to g7.

It is for someone learning the placing phase at home. The sample opening is made up. The page does not store names, scores under a person, or accounts.

Written in JavaScript for Node 22.18 or newer. It has no dependencies. Tests use `node --test`.

## Run

```bash
npm test
node bin/serve.js
```

The game is at http://127.0.0.1:8028.

Dark places first. Each colour has 9 pieces. Occupied points reject a second piece. After 18 placements the status is "Placement is complete." A new game clears the board. The sample opening a7, g7, a1, g1, d7 leaves Dark with 6 in hand and Light with 7, and it is Light to place.

## Layout

```
src/            the board graph, placing, the SVG, the static server
examples/       a fictional opening
test/           unit tests
```

## Next

About 35 hours of later work stay in [ROADMAP.md](ROADMAP.md).

## License

MIT
