import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getAllNews, imageUrl } from '../store';
import Reveal from '../components/Reveal';
// import { getNewsById, getRelatedNews, imageUrl, galleryImages } from '../store';


const CATEGORIES = ['All', 'Group', 'Agriculture', 'Mining', 'Construction', 'Manufacturing', 'E-Commerce', 'Hospitality'];

export default function News() {
  const [active, setActive] = useState('All');
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAllNews()
      .then((rows) => { if (!cancelled) setAllNews(rows); })
      .catch((err) => { if (!cancelled) console.error('[news] load failed', err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (active === 'All') return allNews;
    if (active === 'Group') return allNews.filter((n) => n.category === 'Group');
    return allNews.filter((n) => n.category === active);
  }, [active, allNews]);

  const featured = allNews[0];

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg" aria-hidden="true" />
        <div className="container">
          <Reveal>
            <span className="eyebrow">Newsroom</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 style={{ marginTop: 16, maxWidth: '14ch' }}>
              The latest from<br />
              <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                across the group.
              </em>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede" style={{ marginTop: 24 }}>
              Updates, milestones and insights from Midroc and our six operating sectors.
            </p>
          </Reveal>
        </div>
      </section>

      {!loading && featured && (
        <section className="section--tight" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              <article className="featured-news">
                <NewsMedia news={featured} large />
                <div className="featured-news__body">
                  <div className="news-card__meta">
                    <span className="news-card__category">{featured.category}</span>
                    <span>Featured · {featured.date}</span>
                  </div>
                  <h2 className="featured-news__title">{featured.title}</h2>
                  <p className="lede" style={{ fontSize: '1.05rem' }}>{featured.excerpt}</p>
                  <Link className="btn btn--primary" style={{ width: 'max-content', marginTop: 8 }} to={`/news/${featured.id}`}>
                    Read full story <ArrowUpRight size={16} />
                  </Link>
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="filters" role="tablist" aria-label="Filter by category">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active === c}
                  className={`chip ${active === c ? 'is-active' : ''}`}
                  onClick={() => setActive(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <motion.div className="news-grid" layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((n, i) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
                  className="news-card-wrap"
                >
                  <Link to={`/news/${n.id}`} className="news-card">
                    <NewsMedia news={n} />
                    <div className="news-card__meta">
                      <span className="news-card__category">{n.category}</span>
                      <span>{n.date} · {n.readMins} min</span>
                    </div>
                    <h3 className="news-card__title">{n.title}</h3>
                    {/* <p className="news-card__excerpt">{n.excerpt}</p> */}
                    <span className="news-card__cta">
                      Read story <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {!loading && filtered.length === 0 && (
            <p className="text-muted text-center" style={{ padding: '64px 0' }}>
              No stories in this category yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function NewsMedia({ news, large = false }) {
  const gradient = `linear-gradient(135deg, ${news.c1}, ${news.c2})`;
  const className = large ? 'featured-news__media' : 'news-card__media';

  const cover = imageUrl(news);

  return (
    <div
      className={className}
      style={{ background: gradient, position: 'relative', overflow: 'hidden' }}
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

      {/* <span
        className={large ? undefined : 'news-card__media-emoji'}
        aria-hidden="true"
        style={large ? {
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
          fontSize: '6rem', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))',
        } : undefined}
      >
        {news.emoji}
      </span> */}
    </div>
  );
}