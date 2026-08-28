import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Building2, ArrowUpRight, Check } from 'lucide-react';
import { OFFICES, SECTORS } from '../data';
import Reveal from '../components/Reveal';

const DEPARTMENTS = [
  { label: 'General enquiries', email: 'migpr@midrocinvestmentgroup.com' },
  { label: 'Investor relations', email: 'migpr@midrocinvestmentgroup.com' },
  { label: 'Press & media', email: 'migpr@midrocinvestmentgroup.com' },
  { label: 'Careers', email: 'migpr@midrocinvestmentgroup.com' },
  { label: 'Partnerships', email: 'migpr@midrocinvestmentgroup.com' },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', company: '', sector: '', message: '',
  });

  function update(k) {
    return (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg" aria-hidden="true" />
        <div className="container">
          <Reveal>
            <span className="eyebrow">Get in touch</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 style={{ marginTop: 16, maxWidth: '14ch' }}>
              Let’s start a<br />
              <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                conversation.
              </em>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede" style={{ marginTop: 24 }}>
              Whether you’re an operator looking for feedback, an investor
              exploring opportunities, or a journalist covering the group —
              we’d love to hear from you.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-grid">
            {/* Form */}
            <Reveal>
              <form className="contact-form" onSubmit={submit}>
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', padding: '32px 0', display: 'grid', gap: 16 }}
                  >
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%', margin: '0 auto',
                      background: 'linear-gradient(135deg, var(--gold-500), var(--gold-300))',
                      display: 'grid', placeItems: 'center', color: '#1a1407'
                    }}>
                      <Check size={28} />
                    </div>
                    <h3>Message received</h3>
                    <p className="text-muted">
                      Thanks, {form.name || 'friend'}. A member of our team
                      will get back to you within two business days.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h2 style={{ marginBottom: 8 }}>Send us a message</h2>
                    <p className="text-muted" style={{ marginBottom: 24 }}>
                      We typically respond within two business days.
                    </p>

                    <div className="contact-form__row">
                      <div className="field">
                        <label htmlFor="name">Your name</label>
                        <input id="name" type="text" required value={form.name} onChange={update('name')} placeholder="Firaol Tulu" />
                      </div>
                      <div className="field">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" required value={form.email} onChange={update('email')} placeholder="jane@company.com" />
                      </div>
                    </div>

                    <div className="contact-form__row" style={{ marginTop: 16 }}>
                      <div className="field">
                        <label htmlFor="company">Company / organisation</label>
                        <input id="company" type="text" value={form.company} onChange={update('company')} placeholder="Ethiopia AirLines" />
                      </div>
                      <div className="field">
                        <label htmlFor="sector">Sector of interest</label>
                        <select id="sector" value={form.sector} onChange={update('sector')}>
                          <option value="">Select a sector</option>
                          {SECTORS.map((s) => (
                            <option key={s.key} value={s.key}>{s.name}</option>
                          ))}
                          <option value="group">Group / other</option>
                        </select>
                      </div>
                    </div>

                    <div className="field" style={{ marginTop: 16 }}>
                      <label htmlFor="message">How can we help?</label>
                      <textarea id="message" required value={form.message} onChange={update('message')} placeholder="Tell us a little about what you’d like to discuss…" />
                    </div>

                    <button type="submit" className="btn btn--primary" style={{ marginTop: 24, width: 'max-content' }}>
                      Send message <ArrowUpRight size={16} />
                    </button>
                  </>
                )}
              </form>
            </Reveal>

            <div style={{ display: 'grid', gap: 32, alignContent: 'start' }}>
              <Reveal>
                <div className="contact-info">
                  <div className="contact-info__item">
                    <div className="contact-info__icon"><Mail size={20} /></div>
                    <div>
                      <div className="contact-info__label">Email</div>
                      <div className="contact-info__value">migpr@midrocinvestmentgroup.com</div>
                    </div>
                  </div>
                  <div className="contact-info__item">
                    <div className="contact-info__icon"><Phone size={20} /></div>
                    <div>
                      <div className="contact-info__label">Phone</div>
                      <div className="contact-info__value">(+251) 115549791/95</div>
                    </div>
                  </div>
                  <div className="contact-info__item">
                    <div className="contact-info__icon"><Building2 size={20} /></div>
                    <div>
                      <div className="contact-info__label">Headquarters</div>
                      <div className="contact-info__value">Nani Tower, Stadium Road<br />Addis Ababa, Ethiopia</div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div>
                  <h3 style={{ marginBottom: 16 }}>Departments</h3>
                  <ul style={{ listStyle: 'none', display: 'grid', gap: 12 }}>
                    {DEPARTMENTS.map((d) => (
                      <li key={d.label} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '12px 0', borderBottom: '1px solid var(--line)', gap: 12, flexWrap: 'wrap',
                      }}>
                        <span style={{ color: 'var(--ink-1)' }}>{d.label}</span>
                        <a href={`mailto:${d.email}`} style={{ color: 'var(--gold-300)', fontSize: '0.9rem' }}>
                          {d.email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectors__header">
            <Reveal>
              <div className="sectors__header-row">
                <span className="eyebrow">Our offices</span>
                <h2>
                  One city,<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    one group.
                  </em>
                </h2>
              </div>
            </Reveal>
          </div>

          <div className="values">
            {OFFICES.map((o, i) => (
              <Reveal key={o.city} delay={i * 0.08}>
                <div className="value-card">
                  <div className="value-card__icon"><MapPin size={22} /></div>
                  <span className="text-gold" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {o.tag}
                  </span>
                  <h3 className="value-card__title">{o.city}</h3>
                  <p className="text-muted">{o.address}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-1)' }}>{o.phone}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
