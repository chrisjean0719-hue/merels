import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp, safeFile } from '../src/server.js';

test('the server returns the board page', async (t) => {
  const server = createApp();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/`);
  const body = await res.text();
  assert.equal(res.status, 200);
  assert.match(body, /Merels/);
  assert.match(body, /src\/main.js/);
  assert.match(body, /Undo/);
  assert.match(body, /Replay/);
  assert.match(body, /Next/);
});

test('the server rejects a path outside the project', async (t) => {
  assert.equal(safeFile('../ledge/README.md'), null);
  const server = createApp();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/missing.html`);
  assert.equal(res.status, 404);
});
