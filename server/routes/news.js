import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const NEWS_BASE_SELECT = `
  SELECT
    n.*,
    COALESCE(
      (SELECT json_agg(json_build_object(
        'id', i.id,
        'newsId', i.news_id,
        'mime', i.mime,
        'filename', i.filename,
        'sizeBytes', i.size_bytes,
        'isCover', i.is_cover,
        'position', i.position
      ) ORDER BY i.is_cover DESC, i.position ASC, i.id ASC)
      FROM news_images i WHERE i.news_id = n.id),
      '[]'::json
    ) AS image_rows
`;

function rowToNews(row) {
  if (!row) return null;
  const images = Array.isArray(row.image_rows) ? row.image_rows : [];
  const cover = images.find((i) => i.isCover);
  return {
    id: String(row.id),
    category: row.category,
    title: row.title,
    excerpt: row.excerpt,
    date: row.date,
    readMins: row.read_mins,
    emoji: row.emoji,
    c1: row.c1,
    c2: row.c2,
    hasImage: images.length > 0,
    coverImageId: cover ? cover.id : null,
    images,
    userAdded: true,
  };
}

function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

router.get('/', async (_req, res) => {
  const { rows } = await query(`${NEWS_BASE_SELECT} FROM news n ORDER BY n.created_at DESC, n.id DESC`);
  res.json(rows.map(rowToNews));
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  const { rows } = await query(`${NEWS_BASE_SELECT} FROM news n WHERE n.id = $1`, [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rowToNews(rows[0]));
});

router.post('/', requireAuth, async (req, res) => {
  const {
    title, excerpt, category = 'Group',
    readMins = 3, emoji = '✨',
    c1 = '#1d1d28', c2 = '#0d0d12',
  } = req.body || {};

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (typeof excerpt !== 'string' || !excerpt.trim()) {
    return res.status(400).json({ error: 'excerpt is required' });
  }

  const date = formatDate();
  const insertResult = await query(
    `INSERT INTO news (category, title, excerpt, date, read_mins, emoji, c1, c2)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [category, title.trim(), excerpt.trim(), date, Number(readMins) || 3, emoji, c1, c2],
  );
  const newId = insertResult.rows[0].id;
  const { rows } = await query(`${NEWS_BASE_SELECT} FROM news n WHERE n.id = $1`, [newId]);
  res.status(201).json(rowToNews(rows[0]));
});

router.delete('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  const result = await query('DELETE FROM news WHERE id = $1 RETURNING id', [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

export default router;
