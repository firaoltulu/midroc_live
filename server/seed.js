import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcrypt';
import { pool, query } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SEED_NEWS = [
];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set — copy .env.example to .env first.');
  }
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is not set — copy .env.example to .env first.');
  }

  console.log('[seed] applying schema.sql...');
  const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8');
  await query(schema);

  // Admin row: keep exactly one. Truncate then insert so a re-seed always reflects
  // the current ADMIN_PASSWORD from .env.
  console.log('[seed] upserting admin row...');
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await query('DELETE FROM admin');
  await query('INSERT INTO admin (password_hash) VALUES ($1)', [hash]);

  // News rows: only seed if the table is empty so re-runs don't duplicate.
  const { rows: countRows } = await query('SELECT COUNT(*)::int AS n FROM news');
  if (countRows[0].n === 0) {
    console.log(`[seed] inserting ${SEED_NEWS.length} sample articles...`);
    for (const n of SEED_NEWS) {
      await query(
        `INSERT INTO news (category, title, excerpt, date, read_mins, emoji, c1, c2)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [n.category, n.title, n.excerpt, n.date, n.read_mins, n.emoji, n.c1, n.c2],
      );
    }
  } else {
    console.log(`[seed] news table already has ${countRows[0].n} rows — skipping sample insert.`);
  }

  console.log('[seed] done.');
}

main()
  .catch((err) => {
    console.error('[seed] failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());