import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { NAV_LINKS } from '../data';
import { useTheme } from '../theme';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [theme, , toggleTheme] = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav__inner">
          <Link to="/" className="nav__brand" aria-label="Midroc home">
            {/* <span className="nav__brand-mark">M</span> */}
            {/* <span>Midroc</span> */}
            <img
              src="/midroc.png"
              alt="Midroc logo"
              style={{ width: 160, height: 60, objectFit: 'contain' }}
            />
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `nav__link ${isActive ? 'is-active' : ''}`
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
