import { createApp } from '../src/server.js';
import { PORT } from '../src/sizes.js';

const server = createApp();
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Merels listening on http://127.0.0.1:${PORT}`);
});
