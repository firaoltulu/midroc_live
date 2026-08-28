import { Link } from 'react-router-dom';
import { Compass, Award, Shield, Sparkles, ArrowUpRight } from 'lucide-react';
import { TIMELINE, VALUES, LEADERSHIP, SECTORS } from '../data';
import Reveal from '../components/Reveal';

const VALUE_ICONS = { Compass, Award, Shield, Sparkles };

export default function About() {
  return (
    <>
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__grid">
            <Reveal>
              <div className="about-hero__text">
                <span className="eyebrow">About Midroc</span>
                <h1 style={{ marginTop: 16 }}>
                  A group built on<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    patience and conviction.
                  </em>
                </h1>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="about-hero__lede">
                For three decades, Midroc has been investing in the businesses
                that build nations — <em>from the soil up</em>. We operate
                where capital is patient, regulation is respected and
                long-term value is non-negotiable.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Reveal>
        <div className="stats">
          <div className="stats__item">
            <span className="stats__num">1991</span>
            <span className="stats__label">Founded</span>
          </div>
          <div className="stats__item">
            <span className="stats__num">6</span>
            <span className="stats__label">Sectors</span>
          </div>
          <div className="stats__item">
            <span className="stats__num">43</span>
            <span className="stats__label">Companies</span>
          </div>
          <div className="stats__item">
            <span className="stats__num">70k+</span>
            <span className="stats__label">Employees</span>
          </div>
        </div>
      </Reveal>

      <section className="section">
        <div className="container">
          <div className="sectors__header">
            <Reveal>
              <div className="sectors__header-row">
                <span className="eyebrow">What we stand for</span>
                <h2>
                  Four principles,<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    every decision.
                  </em>
                </h2>
              </div>
            </Reveal>
          </div>

          <div className="values">
            {VALUES.map((v, i) => {
              const Icon = VALUE_ICONS[v.icon] || Sparkles;
              return (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="value-card">
                    <div className="value-card__icon"><Icon size={22} /></div>
                    <h3 className="value-card__title">{v.title}</h3>
                    <p className="text-muted">{v.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectors__header">
            <Reveal>
              <div className="sectors__header-row">
                <span className="eyebrow">Our journey</span>
                <h2>
                  Three decades of<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    building, sector by sector.
                  </em>
                </h2>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="timeline">
              {TIMELINE.map((t) => (
                <div key={t.year} className="timeline__item">
                  <span className="timeline__year">{t.year}</span>
                  <h3 className="timeline__title">{t.title}</h3>
                  <p className="timeline__desc">{t.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectors__header">
            <Reveal>
              <div className="sectors__header-row">
                <span className="eyebrow">Leadership</span>
                <h2>
                  The team behind<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    the group.
                  </em>
                </h2>
              </div>
            </Reveal>
          </div>

          <div className="team">
            {LEADERSHIP.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className="team-card">
                  <div className="team-card__avatar">{p.initials}</div>
                  <div className="team-card__name">{p.name}</div>
                  <div className="team-card__role">{p.role}</div>
                </div>
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
                <span className="eyebrow">Explore</span>
                <h2 style={{ marginTop: 8 }}>
                  Six sectors, one<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    shared standard.
                  </em>
                </h2>
              </div>
              <Link to="/" className="btn btn--primary">
                See the sectors <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
