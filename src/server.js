import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
};

export function createApp() {
  return http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const relative = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const file = safeFile(relative);
    if (!file) {
      res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('bad path');
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('not found');
        return;
      }
      const type = TYPES[path.extname(file)] ?? 'application/octet-stream';
      res.writeHead(200, { 'content-type': type });
      res.end(data);
    });
  });
}

export function safeFile(relative) {
  if (relative.split(/[\\/]/).includes('..')) {
    return null;
  }
  const resolved = path.resolve(root, relative);
  const fromRoot = path.relative(root, resolved);
  if (fromRoot.startsWith('..') || path.isAbsolute(fromRoot)) {
    return null;
  }
  return resolved;
}
