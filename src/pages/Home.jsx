import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ChevronDown } from 'lucide-react';
import { SECTORS } from '../data';
import { getAllNews, imageUrl } from '../store';
import Reveal from '../components/Reveal';
import EthiopiaMap from '../components/EthiopiaMap';

export default function Home() {
  const [homeNews, setHomeNews] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getAllNews()
      .then((rows) => { if (!cancelled) setHomeNews(rows.slice(0, 3)); })
      .catch((err) => { if (!cancelled) console.error('[home] load failed', err); });
    return () => { cancelled = true; };
  }, []);
  const heroRef = useRef(null);
  const sectorsRef = useRef(null);
  const rootRef = useRef(null);
  const reduce = useReducedMotion();


  const { scrollYProgress: pageScroll } = useScroll();

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroTitleY = useTransform(heroScroll, [0, 1], reduce ? [0, 0] : [0, 160]);
  const heroSubY = useTransform(heroScroll, [0, 1], reduce ? [0, 0] : [0, 80]);
  const heroScale = useTransform(heroScroll, [0, 1], reduce ? [1, 1] : [1, 0.96]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], reduce ? [1, 1] : [1, 0]);
  const orbRotate = useTransform(heroScroll, [0, 1], reduce ? [0, 0] : [0, 30]);
  const gridY = useTransform(heroScroll, [0, 1], reduce ? [0, 0] : [0, -120]);

  const { scrollYProgress: sectorsScroll } = useScroll({
    target: sectorsRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={rootRef} className="home-root">

      <EthiopiaMap scrollProgress={pageScroll} />

      <section ref={heroRef} className="hero">
        <div className="hero__bg" aria-hidden="true">
          <motion.div className="hero__grid" style={{ y: gridY }} />
          <motion.div
            className="hero__bg-orb hero__bg-orb--gold"
            style={{ rotate: orbRotate }}
          />
          <motion.div
            className="hero__bg-orb hero__bg-orb--green"
            style={{ rotate: useTransform(orbRotate, (v) => -v) }}
          />
        </div>

        <div className="container hero__content">
          <motion.div
            style={{ y: heroTitleY, scale: heroScale, opacity: heroOpacity }}
          >
            <span className="hero__badge">
              <span className="hero__badge-dot" />
              v1 2026 · Group results published
            </span>
          </motion.div>

          <motion.h1
            className="hero__title"
            style={{ y: heroTitleY, opacity: heroOpacity }}
          >
            Building Africa,<br />
            <em>sector by sector.</em>
          </motion.h1>

          <motion.p
            className="hero__sub lede"
            style={{ y: heroSubY, opacity: heroOpacity }}
          >
            Midroc is a privately-held investment group operating across six
            critical sectors of the African economy — from the farm to the
            factory floor, from the mine to the marketplace.
          </motion.p>

          <motion.div
            className="hero__ctas"
            style={{ opacity: heroOpacity }}
          >
            <Link to="/about" className="btn btn--primary">
              Explore the group <ArrowUpRight size={16} />
            </Link>
            <Link to="/news" className="btn btn--ghost">
              Latest news <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            className="hero__meta"
            style={{ opacity: heroOpacity }}
          >
            <div className="hero__meta-stat">
              <strong>6</strong>
              <span>Sectors</span>
            </div>
            <div className="hero__meta-stat">
              <strong>43</strong>
              <span>Companies</span>
            </div>
            <div className="hero__meta-stat">
              <strong>70k+</strong>
              <span>Employees</span>
            </div>
            <div className="hero__meta-stat">
              <strong>$1.4B</strong>
              <span>Annual revenue</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: heroOpacity }}
          initial={false}
        >
          <ChevronDown
            size={20}
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'var(--ink-2)',
              opacity: 0.6,
            }}
          />
        </motion.div>
      </section>

      <Reveal as="div">
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...Array(2)].flatMap((_, i) =>
              ['Agriculture', 'Mining', 'Construction', 'Manufacturing', 'E-Commerce', 'Hospitality']
                .map((s) => (
                  <span className="marquee__item" key={`${i}-${s}`}>{s}</span>
                ))
            )}
          </div>
        </div>
      </Reveal>

      <section ref={sectorsRef} className="section">
        <div className="container">
          <div className="sectors__header">
            <Reveal>
              <div className="sectors__header-row">
                <span className="eyebrow">Our sectors</span>
                <h2>
                  Six verticals.<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    One continent.
                  </em>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">
                We back the operators, the engineers and the entrepreneurs
                building Africa’s industrial future. Each sector runs as its
                own business — together they form the Midroc group.
              </p>
            </Reveal>
          </div>

          <div className="sectors__stack">
            {SECTORS.map((sector, i) => (
              <SectorCard
                key={sector.key}
                sector={sector}
                index={i}
                total={SECTORS.length}
                scrollProgress={sectorsScroll}
              />
            ))}
          </div>
        </div>
      </section>

      <Reveal>
        <div className="stats">
          <div className="stats__item">
            <span className="stats__num">$1.4B</span>
            <span className="stats__label">Annual revenue</span>
          </div>
          <div className="stats__item">
            <span className="stats__num">70k+</span>
            <span className="stats__label">Employees</span>
          </div>
          <div className="stats__item">
            <span className="stats__num">43</span>
            <span className="stats__label">Companies</span>
          </div>
          <div className="stats__item">
            <span className="stats__num">6</span>
            <span className="stats__label">Sectors</span>
          </div>
        </div>
      </Reveal>

      <section className="section">
        <div className="container">
          <div className="sectors__header" style={{ marginBottom: 48 }}>
            <Reveal>
              <div className="sectors__header-row">
                <span className="eyebrow">In the news</span>
                <h2>
                  Stories from<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    across the group.
                  </em>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/news" className="btn btn--ghost">
                View all news <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>

          <div className="news-grid">
            {homeNews.map((n, i) => (
              <Reveal key={n.id} delay={i * 0.08}>
                <Link to={`/news/${n.id}`} style={{ display: 'block', height: '100%' }}>
                  <NewsCard n={n} />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <Reveal>
            <div className="cta-band">
              <div className="cta-band__bg" aria-hidden="true" />
              <div>
                <span className="eyebrow" style={{ marginBottom: 16 }}>Partner with us</span>
                <h2 style={{ marginTop: 8 }}>
                  We invest where<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    conviction meets impact.
                  </em>
                </h2>
              </div>
              <Link to="/contact" className="btn btn--primary">
                Start a conversation <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );

}

function SectorCard({ sector, index, total, scrollProgress }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [80, 0, -60]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [4, 0, -3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.96, 1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], reduce ? [1, 1, 1, 1] : [0, 1, 1, 0.6]);

  const Icon = sector.icon;
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      style={{
        '--sector-accent': sector.accent,
        y,
        rotate,
        scale,
        opacity,
      }}
    >
      <Link to={`/clusters/${sector.key}`} className="sector-card">
        <div className="sector-card__head">
          <div className="sector-card__icon">
            <Icon size={28} />
          </div>
          <span className="sector-card__num">{num} / {String(total).padStart(2, '0')}</span>
        </div>
        <h3 className="sector-card__title">{sector.name}</h3>
        <p className="sector-card__desc">{sector.description}</p>
        <div className="sector-card__foot">
          <div className="sector-card__stats">
            {sector.stats.map((s) => (
              <div key={s.label} className="sector-card__stat">
                <strong>{s.value}</strong>
                {s.label}
              </div>
            ))}
          </div>
          <span className="sector-card__arrow" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
// 
function NewsCard({ n }) {

  const cover = imageUrl(n);

  return (
    <article className="news-card">
      <div
        className="news-card__media"
        style={{
          '--card-c1': n.c1,
          '--card-c2': n.c2,
          background: `linear-gradient(135deg, ${n.c1}, ${n.c2})`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* <span className="news-card__media-emoji" aria-hidden="true">{n.emoji}</span> */}

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
            {n.emoji}
          </span>
        )}

      </div>
      <div className="news-card__meta">
        <span className="news-card__category">{n.category}</span>
        <span>{n.date} · {n.readMins} min read</span>
      </div>
      <h3 className="news-card__title">{n.title}</h3>
      <span className="news-card__cta">
        Read story <ArrowRight size={14} />
      </span>
    </article>
  );
}
