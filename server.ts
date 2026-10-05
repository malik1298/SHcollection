import http from 'http';
import path from 'path';
import fs from 'fs';
import express from 'express';
import { app } from './server/app.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  const httpServer = http.createServer(app);

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled
          ? false
          : {
              server: httpServer,
            },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // In production Node environment (e.g. Docker, Cloud Run, VM)
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[SH Collection] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
