import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Clock, Tag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getNewsById, getRelatedNews, imageUrl, galleryImages } from '../store';
import Reveal from '../components/Reveal';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(undefined); // undefined = loading, null = not found
  const [related, setRelated] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setNews(undefined);
    setLightboxIndex(null);
    getNewsById(id)
      .then(async (row) => {
        if (cancelled) return;
        setNews(row);
        if (row) {
          const rel = await getRelatedNews(row, 3);
          if (!cancelled) setRelated(rel);
        }
      })
      .catch((err) => { if (!cancelled) console.error('[news] detail load failed', err); });
    return () => { cancelled = true; };
  }, [id]);

  // If the id is unknown, bounce back to /news
  useEffect(() => {
    if (news === null) navigate('/news', { replace: true });
  }, [news, navigate]);

  const gallery = useMemo(() => galleryImages(news || {}), [news]);

  if (news === undefined) {
    return (
      <section className="page-hero">
        <div className="page-hero__bg" aria-hidden="true" />
        <div className="container">
          <p className="lede" style={{ marginTop: 80 }}>Loading…</p>
        </div>
      </section>
    );
  }
  if (!news) return null;

  const cover = imageUrl(news);
  const coverStyle = {
    background: `linear-gradient(135deg, ${news.c1}, ${news.c2})`,
    aspectRatio: '21 / 9',
    borderRadius: 'var(--r-xl)',
    marginTop: 32,
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 0 }}>
        <div className="page-hero__bg" aria-hidden="true" />
        <div className="container">
          <Reveal>
            <Link
              to="/news"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: 'var(--ink-2)', fontSize: '0.9rem', marginBottom: 24,
              }}
            >
              <ArrowLeft size={16} /> Back to news
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="news-card__meta" style={{ marginBottom: 16 }}>
              <span className="news-card__category">{news.category}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={12} /> {news.date}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Clock size={12} /> {news.readMins} min read
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 style={{ maxWidth: '22ch' }}>
              {news.title}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <motion.div
              className="featured-news__media"
              style={coverStyle}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {cover ? (
                <img
                  src={cover}
                  alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{
                  position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                  fontSize: 'clamp(6rem, 14vw, 12rem)',
                  filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.4))',
                }} aria-hidden="true">
                  {news.emoji}
                </span>
              )}
            </motion.div>
          </Reveal>
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <article
            className="stack-6"
            style={{
              maxWidth: '70ch', margin: '0 auto',
              fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink-1)',
            }}
          >
            <Reveal>
              <p
                className="serif"
                style={{
                  fontSize: 'clamp(1.25rem, 2.4vw, 1.6rem)',
                  color: 'var(--ink-0)',
                  fontWeight: 300,
                  lineHeight: 1.4,
                }}
              >
                {news.excerpt}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <h2 style={{ marginTop: 16 }}>What this means for the group</h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p>
                The announcement is consistent with the group’s long-stated
                commitment to investing in the operational backbone of the
                African economy — the parts of the value chain that are
                hardest to replicate, but most rewarding when they compound
                over time.
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div style={{
                display: 'flex', gap: 12, flexWrap: 'wrap',
                paddingTop: 24, borderTop: '1px solid var(--line)',
              }}>
                <span className="chip">
                  <Tag size={12} /> {news.category}
                </span>
                <Link to="/news" className="btn btn--ghost">
                  More news <ArrowRight size={14} />
                </Link>
                <Link to="/contact" className="btn btn--primary">
                  Talk to investor relations <ArrowUpRight size={14} />
                </Link>
              </div>
            </Reveal>
          </article>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section--tight">
          <div className="container">
            <Reveal>
              <div className="sectors__header" style={{ marginBottom: 32 }}>
                <span className="eyebrow">More from this story</span>
                <h2 style={{ marginTop: 12 }}>
                  The<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    gallery.
                  </em>
                </h2>
              </div>
            </Reveal>

            <div className="news-gallery">
              {gallery.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  className="news-gallery__item"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Open image ${i + 1} of ${gallery.length}`}
                >
                  <img src={imageUrl(news, img.id)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sectors__header" style={{ marginBottom: 40 }}>
              <Reveal>
                <span className="eyebrow">More in {news.category}</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 style={{ marginTop: 12 }}>
                  Related<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    stories.
                  </em>
                </h2>
              </Reveal>
            </div>

            <div className="news-grid">
              {related.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.08}>
                  <Link to={`/news/${n.id}`} style={{ display: 'block', height: '100%' }}>
                    <RelatedCard n={n} />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            news={news}
            gallery={gallery}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function RelatedCard({ n }) {
  return (
    <article className="news-card">
      <div
        className="news-card__media"
        style={{
          background: `linear-gradient(135deg, ${n.c1}, ${n.c2})`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span className="news-card__media-emoji" aria-hidden="true">{n.emoji}</span>
      </div>
      <div className="news-card__meta">
        <span className="news-card__category">{n.category}</span>
        <span>{n.date} · {n.readMins} min</span>
      </div>
      <h3 className="news-card__title">{n.title}</h3>
      <span className="news-card__cta">
        Read story <ArrowRight size={14} />
      </span>
    </article>
  );
}

function Lightbox({ news, gallery, index, onClose, onIndexChange }) {
  const total = gallery.length;
  const image = gallery[index];

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onIndexChange((index + 1) % total);
      else if (e.key === 'ArrowLeft') onIndexChange((index - 1 + total) % total);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, total, onClose, onIndexChange]);

  if (!image) return null;

  return (
    <motion.div
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${total}`}
      onClick={onClose}
    >
      <button
        type="button"
        className="lightbox__close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => { e.stopPropagation(); onIndexChange((index - 1 + total) % total); }}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => { e.stopPropagation(); onIndexChange((index + 1) % total); }}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <motion.img
        key={image.id}
        className="lightbox__img"
        src={imageUrl(news, image.id)}
        alt=""
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      />

      <div className="lightbox__count" aria-live="polite">
        {index + 1} / {total}
      </div>
    </motion.div>
  );
}
