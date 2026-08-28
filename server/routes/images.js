import { Router } from 'express';
import { query, withTransaction } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

function isValidArticleId(id) {
  const n = Number(id);
  return Number.isInteger(n) && n > 0;
}

function imageMetaRow(row) {
  return {
    id: Number(row.id),
    newsId: Number(row.news_id),
    mime: row.mime,
    filename: row.filename,
    sizeBytes: Number(row.size_bytes),
    isCover: row.is_cover,
    position: Number(row.position),
    createdAt: row.created_at,
  };
}

router.post('/:id/images', requireAuth, upload.array('files', 10), async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidArticleId(id)) return res.status(400).json({ error: 'Invalid id' });
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'files are required (multipart field "files")' });
  }

  const inserted = await withTransaction(async (client) => {
    const article = await client.query('SELECT id FROM news WHERE id = $1', [id]);
    if (article.rowCount === 0) {
      const err = new Error('Article not found');
      err.status = 404;
      throw err;
    }

    const { rows: existingCover } = await client.query(
      'SELECT 1 FROM news_images WHERE news_id = $1 AND is_cover',
      [id],
    );
    const needsCover = existingCover.length === 0;

    const { rows: maxPos } = await client.query(
      'SELECT COALESCE(MAX(position), -1) AS max_pos FROM news_images WHERE news_id = $1',
      [id],
    );
    let nextPos = Number(maxPos[0].max_pos) + 1;

    const out = [];
    for (let i = 0; i < req.files.length; i++) {
      const f = req.files[i];
      const isCover = needsCover && i === 0;
      const { rows } = await client.query(
        `INSERT INTO news_images (news_id, mime, filename, data, size_bytes, is_cover, position)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, news_id, mime, filename, size_bytes, is_cover, position, created_at`,
        [id, f.mimetype, f.originalname, f.buffer, f.size, isCover, nextPos],
      );
      out.push(imageMetaRow(rows[0]));
      nextPos += 1;
    }
    return out;
  }).catch((err) => {
    if (err.status) return null;
    throw err;
  });

  if (inserted === null) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.status(201).json({ images: inserted });
});


router.get('/:id/images', async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidArticleId(id)) return res.status(400).json({ error: 'Invalid id' });
  const { rows } = await query(
    `SELECT id, news_id, mime, filename, size_bytes, is_cover, position, created_at
     FROM news_images
     WHERE news_id = $1
     ORDER BY is_cover DESC, position ASC, id ASC`,
    [id],
  );
  res.json({ images: rows.map(imageMetaRow) });
});

router.get('/:id/images/:imageId', async (req, res) => {
  const id = Number(req.params.id);
  const imageId = Number(req.params.imageId);
  if (!isValidArticleId(id) || !Number.isInteger(imageId)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const { rows } = await query(
    'SELECT mime, data FROM news_images WHERE id = $1 AND news_id = $2',
    [imageId, id],
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Image not found' });
  res.setHeader('Content-Type', rows[0].mime);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(rows[0].data);
});


router.patch('/:id/images/:imageId/cover', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const imageId = Number(req.params.imageId);
  if (!isValidArticleId(id) || !Number.isInteger(imageId)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const result = await withTransaction(async (client) => {
    const exists = await client.query('SELECT 1 FROM news WHERE id = $1', [id]);
    if (exists.rowCount === 0) {
      const err = new Error('Article not found');
      err.status = 404;
      throw err;
    }
    const target = await client.query(
      'SELECT 1 FROM news_images WHERE id = $1 AND news_id = $2',
      [imageId, id],
    );
    if (target.rowCount === 0) {
      const err = new Error('Image not found');
      err.status = 404;
      throw err;
    }
    await client.query(
      'UPDATE news_images SET is_cover = FALSE WHERE news_id = $1 AND is_cover',
      [id],
    );
    await client.query(
      'UPDATE news_images SET is_cover = TRUE WHERE id = $1',
      [imageId],
    );
    return true;
  }).catch((err) => {
    if (err.status) return { errorStatus: err.status, error: err.message };
    throw err;
  });

  if (result && result.errorStatus) {
    return res.status(result.errorStatus).json({ error: result.error });
  }
  res.json({ ok: true, coverImageId: imageId });
});


router.delete('/:id/images/:imageId', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const imageId = Number(req.params.imageId);
  if (!isValidArticleId(id) || !Number.isInteger(imageId)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const remaining = await withTransaction(async (client) => {
    const { rows } = await client.query(
      'SELECT is_cover FROM news_images WHERE id = $1 AND news_id = $2',
      [imageId, id],
    );
    if (rows.length === 0) return -1; // already gone

    const wasCover = rows[0].is_cover;
    await client.query('DELETE FROM news_images WHERE id = $1', [imageId]);

    if (wasCover) {
      const { rows: next } = await client.query(
        `SELECT id FROM news_images
         WHERE news_id = $1
         ORDER BY is_cover DESC, position ASC, id ASC
         LIMIT 1`,
        [id],
      );
      if (next.length > 0) {
        await client.query(
          'UPDATE news_images SET is_cover = TRUE WHERE id = $1',
          [next[0].id],
        );
      }
    }

    const { rows: after } = await client.query(
      'SELECT COUNT(*)::int AS n FROM news_images WHERE news_id = $1',
      [id],
    );
    return after[0].n;
  });

  res.json({ ok: true, remainingImages: remaining });
});

export default router;
