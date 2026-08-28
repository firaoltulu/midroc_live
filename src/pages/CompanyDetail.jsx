import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Calendar, Users, Building2 } from 'lucide-react';
import { findCompany, findCluster, COMPANIES } from '../data';
import Reveal from '../components/Reveal';

export default function CompanyDetail() {
  const { key, companyId } = useParams();
  const navigate = useNavigate();
  const company = findCompany(companyId);
  const cluster = findCluster(key);

  useEffect(() => {
    if (!company || !cluster) navigate(`/clusters/${key}`, { replace: true });
  }, [company, cluster, key, navigate]);

  if (!company || !cluster) return null;

  const siblings = (COMPANIES[key] || []).filter((c) => c.id !== companyId);

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 0 }}>
        <div className="page-hero__bg" aria-hidden="true" />
        <div className="container">
          <Reveal>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
              <Link to={`/clusters/${key}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: 'var(--ink-2)', fontSize: '0.9rem',
              }}>
                <ArrowLeft size={16} /> {cluster.name}
              </Link>
              <span style={{ color: 'var(--ink-3)' }}>/</span>
              <span style={{ color: 'var(--ink-1)', fontSize: '0.9rem' }}>{company.name}</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <span
                    style={{
                      fontSize: '4rem', lineHeight: 1,
                      filter: `drop-shadow(0 8px 24px ${cluster.accent})`,
                    }}
                    aria-hidden="true"
                  >
                    {company.emoji}
                  </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 style={{ maxWidth: '20ch' }}>{company.name}</h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="lede" style={{ marginTop: 20, maxWidth: '60ch' }}>
              {company.short}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="company-meta">
              <div className="company-meta__item">
                <span className="company-meta__icon"><MapPin size={16} /></span>
                <div>
                  <span className="company-meta__label">Location</span>
                  <span className="company-meta__value">{company.location}</span>
                </div>
              </div>
              <div className="company-meta__item">
                <span className="company-meta__icon"><Calendar size={16} /></span>
                <div>
                  <span className="company-meta__label">Founded</span>
                  <span className="company-meta__value">{company.founded}</span>
                </div>
              </div>
              <div className="company-meta__item">
                <span className="company-meta__icon"><Users size={16} /></span>
                <div>
                  <span className="company-meta__label">Employees</span>
                  <span className="company-meta__value">{company.employees.toLocaleString()}</span>
                </div>
              </div>
              <div className="company-meta__item">
                <span className="company-meta__icon"><Building2 size={16} /></span>
                <div>
                  <span className="company-meta__label">Cluster</span>
                  <span className="company-meta__value">{cluster.name}</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="stats" style={{ marginTop: 32 }}>
              {company.stats.map((s) => (
                <div key={s.label} className="stats__item">
                  <span className="stats__num">{s.value}</span>
                  <span className="stats__label">{s.label}</span>
                </div>
              ))}
              <div className="stats__item">
                <span className="stats__num">{company.employees.toLocaleString()}</span>
                <span className="stats__label">Employees</span>
              </div>
              <div className="stats__item">
                <span className="stats__num">{company.founded}</span>
                <span className="stats__label">Established</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article
            className="stack-6"
            style={{
              maxWidth: '70ch', margin: '0 auto',
              fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink-1)',
            }}
          >
            <Reveal>
              <h2 style={{ marginBottom: 8 }}>About {company.name}</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                {company.short} The company operates with its own management
                team and brand identity, while drawing on the group’s shared
                capabilities in finance, procurement and ESG.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Like every operating company in the group, it reports against
                the Midroc ESG framework and is on the path to aligning with
                the group’s 2030 sustainability targets.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{
                display: 'flex', gap: 12, flexWrap: 'wrap',
                paddingTop: 24, borderTop: '1px solid var(--line)',
              }}>
                <Link to={`/clusters/${key}`} className="btn btn--ghost">
                  <ArrowLeft size={14} /> All {cluster.name} companies
                </Link>
                <Link to="/contact" className="btn btn--primary">
                  Partner with us <ArrowUpRight size={14} />
                </Link>
              </div>
            </Reveal>
          </article>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="section--tight">
          <div className="container">
            <div className="sectors__header" style={{ marginBottom: 32 }}>
              <Reveal>
                <span className="eyebrow">Also in {cluster.name}</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 style={{ marginTop: 12 }}>
                  Other<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    companies.
                  </em>
                </h2>
              </Reveal>
            </div>

            <div className="company-grid">
              {siblings.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.06}>
                  <Link
                    to={`/clusters/${key}/companies/${c.id}`}
                    className="company-card"
                    style={{ '--company-accent': cluster.accent }}
                  >
                    <div
                      className="company-card__media"
                      style={{ background: `linear-gradient(135deg, ${cluster.accent}, var(--bg-3))` }}
                    >
                      <span className="company-card__emoji" aria-hidden="true">{c.emoji}</span>
                    </div>
                    <div className="company-card__body">
                      <h3 className="company-card__name">{c.name}</h3>
                      <p className="company-card__short">{c.short}</p>
                      <div className="company-card__meta">
                        <span><MapPin size={12} /> {c.location}</span>
                        <span><Calendar size={12} /> Est. {c.founded}</span>
                      </div>
                      <div className="company-card__foot">
                        <span className="company-card__stat">
                          <strong>{c.employees.toLocaleString()}</strong>
                          Employees
                        </span>
                        <span className="company-card__arrow" aria-hidden="true">
                          <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
