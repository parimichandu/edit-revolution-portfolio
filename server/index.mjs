import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApiRequest } from './api.mjs';
import { initDatabase } from './db.mjs';
import { ensureDefaultUser } from './auth.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const PORT = process.env.PORT || 5173;

// Ensure database and initial user exist
initDatabase();
ensureDefaultUser();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Route API requests
  if (parsedUrl.pathname.startsWith('/api')) {
    return handleApiRequest(req, res);
  }

  // Serve static files from dist in production
  let filePath = path.join(distDir, parsedUrl.pathname);

  // If root or path without extension, check file or fallback to index.html for SPA
  if (parsedUrl.pathname === '/' || !path.extname(parsedUrl.pathname)) {
    filePath = path.join(distDir, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA client routing
      filePath = path.join(distDir, 'index.html');
      fs.readFile(filePath, (fallbackErr, content) => {
        if (fallbackErr) {
          res.statusCode = 404;
          return res.end('404 Not Found: Run "npm run build" first to generate the production bundle.');
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    // Cache static hashed assets for 1 year, index.html must not be cached
    if (parsedUrl.pathname.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🎬 Edit Revolution Production Server running at http://localhost:${PORT}`);
  console.log(`🔒 Financial Dashboard API protected with SQLite at http://localhost:${PORT}/api`);
});
