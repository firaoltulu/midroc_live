import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ChevronDown, Pause, Play } from 'lucide-react';
import { useScroll } from 'framer-motion';
import { SECTORS } from '../data';
import { getAllNews, imageUrl } from '../store';
import Reveal from '../components/Reveal';
import EthiopiaMap from '../components/EthiopiaMap';
import addisSheratonImage from '../assets/hero/Addis-Sheraton.png';
import coffeeCherriesImage from '../assets/hero/Coffee-Cherry.png';
import midrocOperationsVideo from '../assets/hero/midroc_for_country.mp4';
import midrocmanufacturingVideo from '../assets/hero/midroc_ice_cream.mp4';
// import midrocAllImage from '../assets/hero/midroc_image.jpg';
import midrocConstructionVideo from '../assets/hero/midroc_construction.mp4';

// Drop real media files into public/hero/.
const HERO_SLIDES = [
  { type: 'image', src: coffeeCherriesImage, alt: 'Coffee cherries' },
  { type: 'video', src: midrocOperationsVideo, poster: '/hero/slide-2.jpg', alt: 'Midroc for Country event video' },
  { type: 'image', src: addisSheratonImage, alt: 'Sheraton Addis Collection Hotel' },
  { type: 'video', src: midrocConstructionVideo, poster: '/hero/slide-6.jpg', alt: 'Midroc construction video' },

  { type: 'video', src: midrocmanufacturingVideo, poster: '/hero/slide-4.jpg', alt: 'Midroc manufacturing video' },
  // { type: 'image', src: midrocAllImage, alt: 'all companies' },
];
const TITLE_REGIONS = ['Africa', 'Ethiopia'];

export default function Home() {
  const [homeNews, setHomeNews] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  ));
  const [reduce, setReduce] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));
  const [titleRegionIndex, setTitleRegionIndex] = useState(0);
  const [typedRegion, setTypedRegion] = useState('');
  const videoRefs = useRef([]);
  const fadePauseTimer = useRef(null);
  const mapSectionRef = useRef(null);
  const { scrollYProgress: mapScrollProgress } = useScroll({
    target: mapSectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    let cancelled = false;
    getAllNews()
      .then((rows) => { if (!cancelled) setHomeNews(rows.slice(0, 3)); })
      .catch((err) => { if (!cancelled) console.error('[home] load failed', err); });
    return () => { cancelled = true; };
  }, []);
  const rootRef = useRef(null);

  const goToSlide = useCallback((nextIndex) => {
    setActiveSlide((current) => {
      if (nextIndex === current) return current;
      if (fadePauseTimer.current) window.clearTimeout(fadePauseTimer.current);
      fadePauseTimer.current = window.setTimeout(() => {
        videoRefs.current.forEach((video, index) => {
          if (video && index !== nextIndex) video.pause();
        });
      }, 1200);
      return nextIndex;
    });
  }, []);

  const goToNextSlide = useCallback(() => {
    setActiveSlide((current) => {
      const nextIndex = (current + 1) % HERO_SLIDES.length;
      if (fadePauseTimer.current) window.clearTimeout(fadePauseTimer.current);
      fadePauseTimer.current = window.setTimeout(() => {
        videoRefs.current.forEach((video, index) => {
          if (video && index !== nextIndex) video.pause();
        });
      }, 1200);
      return nextIndex;
    });
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMobileChange = (event) => setIsMobile(event.matches);
    const onMotionChange = (event) => {
      setReduce(event.matches);
      if (event.matches) setIsPaused(true);
    };
    mobileQuery.addEventListener('change', onMobileChange);
    motionQuery.addEventListener('change', onMotionChange);
    return () => {
      mobileQuery.removeEventListener('change', onMobileChange);
      motionQuery.removeEventListener('change', onMotionChange);
      if (fadePauseTimer.current) window.clearTimeout(fadePauseTimer.current);
    };
  }, []);

  useEffect(() => {
    const slide = HERO_SLIDES[activeSlide];
    if (slide.type !== 'video') return undefined;

    const video = videoRefs.current[activeSlide];
    if (!video || isMobile) return undefined;

    if (isPaused) {
      video.pause();
      return undefined;
    }

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise) playPromise.catch(() => { });

    const fallback = window.setTimeout(goToNextSlide, 30000);
    return () => window.clearTimeout(fallback);
  }, [activeSlide, isMobile, isPaused, goToNextSlide]);

  useEffect(() => {
    if (isPaused || HERO_SLIDES[activeSlide].type !== 'image') return undefined;
    const timer = window.setTimeout(goToNextSlide, 6000);
    return () => window.clearTimeout(timer);
  }, [activeSlide, isPaused, goToNextSlide]);

  useEffect(() => {
    if (reduce) {
      setTypedRegion(TITLE_REGIONS[titleRegionIndex]);
      return undefined;
    }

    const timers = [];
    const target = TITLE_REGIONS[titleRegionIndex];
    setTypedRegion('');

    target.split('').forEach((character, characterIndex) => {
      timers.push(window.setTimeout(() => {
        setTypedRegion(target.slice(0, characterIndex + 1));
      }, 110 * characterIndex));
    });

    const typeDuration = 110 * target.length;
    timers.push(window.setTimeout(() => {
      for (let characterIndex = target.length - 1; characterIndex >= 0; characterIndex -= 1) {
        timers.push(window.setTimeout(() => {
          setTypedRegion(target.slice(0, characterIndex));
        }, 70 * (target.length - characterIndex)));
      }
    }, typeDuration + 3000));

    timers.push(window.setTimeout(() => {
      setTitleRegionIndex((current) => (current + 1) % TITLE_REGIONS.length);
    }, typeDuration + 3000 + 70 * target.length + 250));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reduce, titleRegionIndex]);

  return (
    <div ref={rootRef} className="home-root">

      <section
        className={`hero hero-carousel ${reduce ? 'is-reduced-motion' : ''}`}
        aria-roledescription="carousel"
        aria-label="Featured Midroc stories"
      >
        <div className="hero-carousel__media" aria-live="off">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeSlide;
            return (
              <div
                className={`hero-carousel__slide ${isActive ? 'is-active' : ''}`}
                key={slide.src}
                aria-hidden={!isActive}
              >
                {slide.type === 'video' && !isMobile ? (
                  <video
                    ref={(element) => { videoRefs.current[index] = element; }}
                    className="hero-carousel__video"
                    src={slide.src}
                    poster={slide.poster}
                    muted
                    playsInline
                    preload={index < 2 ? 'auto' : 'metadata'}
                    onEnded={goToNextSlide}
                    onError={goToNextSlide}
                    aria-label={slide.alt}
                  />
                ) : (
                  <img
                    className="hero-carousel__image"
                    src={slide.type === 'video' ? slide.poster : slide.src}
                    alt={isActive ? slide.alt : ''}
                    aria-hidden={!isActive}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="hero-carousel__overlay" aria-hidden="true" />

        <div className="container hero-carousel__content">
          <div
            className="hero-logo-slot"
            data-hero-logo-slot
            aria-hidden="true"
          />
          <div className="hero-carousel__copy">
            <p className="hero-carousel__eyebrow">MIDROC Investment Group</p>
            <h1 className="hero-carousel__title">
              <span className="hero-carousel__headline-line">
                Building
                <span className="hero-carousel__region" aria-live="off">
                  <em>{typedRegion}</em><span className="hero-carousel__caret" aria-hidden="true" />,
                </span>
              </span>
              <br />
              {/* <em>sector by sector.</em> */}
            </h1>
            <p className="hero-carousel__lede">
              Building enduring enterprises across critical sectors, creating
              opportunity and lasting impact for communities throughout Africa.
            </p>
            <div className="hero-carousel__ctas">
              <Link to="/about" className="btn btn--primary">
                Explore the group <ArrowUpRight size={16} />
              </Link>
              <Link to="/news" className="btn btn--ghost">
                Latest news <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-carousel__controls" aria-label="Carousel controls">
          <div className="hero-carousel__dots">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                className={`hero-carousel__dot ${index === activeSlide ? 'is-active' : ''}`}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === activeSlide ? 'true' : undefined}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="hero-carousel__pause"
            aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
            onClick={() => setIsPaused((paused) => !paused)}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            <span>{isPaused ? 'Play' : 'Pause'}</span>
          </button>
        </div>

        <ChevronDown
          className="hero-carousel__down"
          size={20}
          aria-hidden="true"
        />
      </section>

      <Reveal as="div" id="sectors-marquee">
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

      <section className="section">
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
      {/* News */}
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

      <section ref={mapSectionRef} className="ethiopia-showcase section--tight" aria-labelledby="ethiopia-showcase-heading">
        <div className="ethiopia-showcase__sticky">
          <div className="ethiopia-showcase__intro">
            <span className="eyebrow">Across Ethiopia</span>
            <h2>
              A footprint
              {/* <em>that keeps growing.</em> */}
              <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                that keeps growing.
              </em>
            </h2>
          </div>
          <div className="ethiopia-showcase__map">
            <EthiopiaMap scrollProgress={mapScrollProgress} inSection />
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

function SectorCard({ sector, index, total }) {
  const Icon = sector.icon;
  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      style={{
        '--sector-accent': sector.accent,
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
    </div>
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
