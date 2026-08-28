import { Link } from 'react-router-dom';
import { AtSign, Globe, Camera, Video, Mail, MapPin, Phone, Icon } from 'lucide-react';
import { SECTORS, NAV_LINKS } from '../data';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="nav__brand" aria-label="Midroc home">
              {/* <span className="nav__brand-mark">M</span> */}
              <img
                src="/midroc.png"
                alt="Midroc logo"
                style={{ width: 160, height: 100, objectFit: 'contain' }}
              />
            </Link>
            <p>
              An Ethiopia investment group operating across agriculture, mining,
              construction, manufacturing, e-commerce and hospitality.
            </p>
          </div>

          <div className="footer__col">
            <h4>Group</h4>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
              ))}
              <li><Link to="/admin" style={{ color: 'var(--gold-300)' }}>Admin portal</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Sectors</h4>
            <ul>
              {SECTORS.map((s) => (
                <li key={s.key}>
                  <Link to={`/clusters/${s.key}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <MapPin size={14} style={{ marginTop: 4, color: 'var(--gold-300)' }} />
                Nani Tower, Stadium Road, Addis Ababa
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Phone size={14} style={{ color: 'var(--gold-300)' }} />
                (+251) 115549791/95
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Mail size={14} style={{ color: 'var(--gold-300)' }} />
                migpr@midrocinvestmentgroup.com
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Mail size={14} style={{ color: 'var(--gold-300)' }} />
                +251115549764
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Midroc Investment Group. All rights reserved.</span>
          <div className="footer__socials" aria-label="Social media">
            <a href="#" aria-label="LinkedIn"><AtSign size={16} /></a>
            <a href="#" aria-label="X / Twitter"><Globe size={16} /></a>
            <a href="#" aria-label="Instagram"><Camera size={16} /></a>
            <a href="#" aria-label="YouTube"><Video size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
