-- Midroc news + admin schema.
-- Run via: psql "$DATABASE_URL" -f server/schema.sql
-- or via the seed script, which applies this file before inserting seed rows.

CREATE TABLE IF NOT EXISTS admin (
  id            SERIAL PRIMARY KEY,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id         SERIAL PRIMARY KEY,
  category   TEXT NOT NULL DEFAULT 'Group',
  title      TEXT NOT NULL,
  excerpt    TEXT NOT NULL,
  date       TEXT NOT NULL,
  read_mins  INT  NOT NULL DEFAULT 3,
  emoji      TEXT NOT NULL DEFAULT '✨',
  c1         TEXT NOT NULL DEFAULT '#1d1d28',
  c2         TEXT NOT NULL DEFAULT '#0d0d12',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Image gallery for a news article. Multiple rows per article are allowed;
-- exactly one row per article may have is_cover = TRUE.
CREATE TABLE IF NOT EXISTS news_images (
  id         SERIAL PRIMARY KEY,
  news_id    INT NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  mime       TEXT NOT NULL,
  filename   TEXT NOT NULL,
  data       BYTEA NOT NULL,
  size_bytes INT  NOT NULL,
  is_cover   BOOLEAN NOT NULL DEFAULT FALSE,
  position   INT  NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migration safety net for an already-deployed DB whose `news_images` table
-- was created before is_cover / position existed. CREATE TABLE IF NOT EXISTS
-- will not re-create a table that's already present, so we add the columns
-- separately. ADD COLUMN IF NOT EXISTS keeps this idempotent.
ALTER TABLE news_images ADD COLUMN IF NOT EXISTS is_cover BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE news_images ADD COLUMN IF NOT EXISTS position INT  NOT NULL DEFAULT 0;

-- Migration: the original schema had UNIQUE (news_id) — drop it so an article
-- can hold many images. Safe to run on fresh installs (IF EXISTS).
ALTER TABLE news_images DROP CONSTRAINT IF EXISTS news_images_news_id_key;

-- Helpful ordering index for per-article listings.
CREATE INDEX IF NOT EXISTS news_images_news_id_idx ON news_images (news_id, position);

-- Only one cover image per article. Partial unique index = NULLs are not compared.
CREATE UNIQUE INDEX IF NOT EXISTS news_images_one_cover_idx
  ON news_images (news_id) WHERE is_cover;

-- Backfill: any existing rows where is_cover defaulted to FALSE need a cover
-- selected, otherwise every image renders as a gallery item. Promote the
-- earliest inserted row to cover for each article that already has images.
UPDATE news_images
SET is_cover = TRUE
WHERE id IN (
  SELECT MIN(id) FROM news_images GROUP BY news_id
);

CREATE INDEX IF NOT EXISTS news_created_at_idx ON news (created_at DESC);