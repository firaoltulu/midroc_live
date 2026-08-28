import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

const router = Router();

const TOKEN_TTL_SECONDS = 8 * 60 * 60;

router.post('/login', async (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const { rows } = await query('SELECT id, password_hash FROM admin ORDER BY id ASC LIMIT 1');
  if (rows.length === 0) {
    return res.status(500).json({ error: 'Admin account not initialized — run npm run db:seed' });
  }

  const ok = await bcrypt.compare(password, rows[0].password_hash);
  if (!ok) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const expSeconds = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const token = jwt.sign(
    { sub: String(rows[0].id) },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_TTL_SECONDS },
  );

  return res.json({ token, exp: expSeconds * 1000 });
});

export default router;