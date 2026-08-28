import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool, query } from './db.js';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import imageRoutes from './routes/images.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use((req, res, next) => {
  if (req.method === 'POST' && /\/images(\?|$|\/)/.test(req.path)) return next();
  return express.json({ limit: '256kb' })(req, res, next);
});

app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ ok: true, db: 'up' });
  } catch (err) {
    res.status(503).json({ ok: false, db: 'down', error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/news', imageRoutes);

app.use((err, _req, res, _next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Image exceeds 10 MB limit' });
  }
  if (err && (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE')) {
    return res.status(413).json({ error: 'Up to 10 images per request' });
  }
  if (err && /Unsupported image type/.test(err.message)) {
    return res.status(415).json({ error: err.message });
  }
  console.error('[api] unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});

function shutdown() {
  console.log('[api] shutting down');
  server.close(() => pool.end().then(() => process.exit(0)));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);