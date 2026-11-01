import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { NAV_LINKS } from '../data';
import { useTheme } from '../theme';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [logoTransform, setLogoTransform] = useState('translate3d(0, 0, 0) scale(1)');
  const location = useLocation();
  const [theme, , toggleTheme] = useTheme();
  const isLight = theme === 'light';
  const isHome = location.pathname === '/';
  const navLogoSlotRef = useRef(null);
  const flyingLogoRef = useRef(null);
  const dockedRef = useRef(false);
  const transformsRef = useRef({ start: null, end: null });
  const frameRef = useRef(null);
  const transitioningRef = useRef(false);

  const applyLogoTarget = useCallback((nextDocked) => {
    const transforms = transformsRef.current;
    if (!transforms.start || !transforms.end) return;
    const target = nextDocked ? transforms.end : transforms.start;
    setLogoTransform(
      `translate3d(${target.x}px, ${target.y}px, 0) scale(${target.scale})`
    );
  }, []);

  const remeasure = useCallback((preserveVisual = false) => {
    if (!isHome) return;

    const heroSlot = document.querySelector('[data-hero-logo-slot]');
    const navSlot = navLogoSlotRef.current;
    const logo = flyingLogoRef.current;
    if (!heroSlot || !navSlot || !logo) return;

    const heroRect = heroSlot.getBoundingClientRect();
    const navRect = navSlot.getBoundingClientRect();
    const heroWidth = heroRect.width;
    const navWidth = navRect.width;
    if (!heroWidth || !navWidth) return;

    transformsRef.current = {
      start: {
        x: heroRect.left,
        y: heroRect.top,
        scale: 1,
      },
      end: {
        x: navRect.left,
        y: navRect.top,
        scale: navWidth / heroWidth,
      },
    };

    if (preserveVisual && transitioningRef.current) {
      const computed = window.getComputedStyle(logo).transform;
      logo.style.transition = 'none';
      setLogoTransform(computed === 'none' ? 'translate3d(0, 0, 0) scale(1)' : computed);
      window.requestAnimationFrame(() => {
        logo.style.transition = '';
        applyLogoTarget(dockedRef.current);
      });
    } else {
      applyLogoTarget(dockedRef.current);
    }
  }, [applyLogoTarget, isHome]);

  useLayoutEffect(() => {
    if (!isHome) {
      dockedRef.current = true;
      setScrolled(true);
      setMeasured(false);
      return undefined;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const initialDocked = reduced || window.scrollY > 8;
    dockedRef.current = initialDocked;
    setScrolled(initialDocked);
    transitioningRef.current = false;

    const measureFrame = window.requestAnimationFrame(() => {
      remeasure(false);
      setMeasured(true);
      window.requestAnimationFrame(() => {
        transitioningRef.current = true;
      });
    });

    return () => window.cancelAnimationFrame(measureFrame);
  }, [isHome, location.key, remeasure]);

  useEffect(() => {
    if (!isHome) return undefined;

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyScrollState = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        if (reducedQuery.matches) {
          if (!dockedRef.current) dockedRef.current = true;
          setScrolled(true);
          applyLogoTarget(true);
          return;
        }
        const y = window.scrollY;
        let nextDocked = dockedRef.current;
        if (!nextDocked && y > 8) nextDocked = true;
        if (nextDocked && y < 4) nextDocked = false;
        if (nextDocked !== dockedRef.current) {
          dockedRef.current = nextDocked;
          setScrolled(nextDocked);
          applyLogoTarget(nextDocked);
        }
      });
    };

    const onMotionChange = () => applyScrollState();
    applyScrollState();
    window.addEventListener('scroll', applyScrollState, { passive: true });
    reducedQuery.addEventListener('change', onMotionChange);
    return () => {
      window.removeEventListener('scroll', applyScrollState);
      reducedQuery.removeEventListener('change', onMotionChange);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [applyLogoTarget, isHome]);

  useEffect(() => {
    if (!isHome) return undefined;
    const heroSlot = document.querySelector('[data-hero-logo-slot]');
    const navSlot = navLogoSlotRef.current;
    const observer = new ResizeObserver(() => remeasure(true));
    if (heroSlot) observer.observe(heroSlot);
    if (navSlot) observer.observe(navSlot);
    const logoImage = flyingLogoRef.current?.querySelector('img');
    const onResize = () => remeasure(true);
    const onLogoLoad = () => remeasure(true);
    logoImage?.addEventListener('load', onLogoLoad);
    document.fonts?.ready.then(onResize);
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize);
    return () => {
      observer.disconnect();
      logoImage?.removeEventListener('load', onLogoLoad);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [isHome, remeasure]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {isHome && (
        <Link
          ref={flyingLogoRef}
          to="/"
          aria-label="Midroc home"
          className={`nav__flying-logo ${measured ? 'is-measured' : ''} ${scrolled ? 'is-docked' : ''}`}
          style={{ transform: logoTransform }}
        >
          <img src="/midroc.png" alt="Midroc Investment Group" draggable="false" />
        </Link>
      )}
      <header className={`nav ${scrolled || !isHome ? 'is-scrolled is-solid' : ''}`}>
        <div className="container nav__inner">
          <div ref={navLogoSlotRef} className="nav__logo-slot" aria-hidden="true">
            {!isHome && (
              <Link to="/" className="nav__brand nav__brand--static" aria-label="Midroc home">
                <img src="/midroc.png" alt="" draggable="false" />
              </Link>
            )}
          </div>

          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `nav__link ${l.label === 'Contact' ? 'nav__link--contact' : ''} ${isActive ? 'is-active' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button
              type="button"
              // className="nav__burger"
              onClick={toggleTheme}
              aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
              aria-pressed={isLight}
              title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </button>

          </nav>

          <Link to="/contact" className="btn btn--primary nav__cta">
            Partner with us <ArrowUpRight size={16} />
          </Link>

          <button
            type="button"
            className="nav__burger"
            onClick={toggleTheme}
            aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
            aria-pressed={isLight}
            title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            type="button"
            className="nav__burger hide-desktop"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer__top">
            <Link to="/" className="nav__brand" onClick={() => setOpen(false)}>
              <span className="nav__brand-mark">M</span>
              <span>Midroc</span>
            </Link>
            <button
              type="button"
              className="nav__burger"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="drawer__links">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `drawer__link ${isActive ? 'is-active' : ''}`
                }
              >
                <span>{l.label}</span>
                <ArrowUpRight size={20} />
              </NavLink>
            ))}
          </div>

          <div className="drawer__footer">
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Building Africa’s future across six sectors.
            </p>

            <button
              type="button"
              className="drawer__theme-row"
              onClick={toggleTheme}
              aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
              aria-pressed={isLight}
            >
              <span className="drawer__theme-label">
                {isLight ? <Moon size={18} /> : <Sun size={18} />}
                {isLight ? 'Dark mode' : 'Light mode'}
              </span>
              <span className="drawer__theme-state" aria-hidden="true">
                {isLight ? 'On' : 'Off'}
              </span>
            </button>

            <Link to="/contact" className="btn btn--primary" style={{ justifyContent: 'center' }}>
              Partner with us <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
