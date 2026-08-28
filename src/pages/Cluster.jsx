import { useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Users, Building2, Calendar } from 'lucide-react';
import { findCluster, COMPANIES, SECTORS } from '../data';
import Reveal from '../components/Reveal';

export default function Cluster() {
  const { key } = useParams();
  const navigate = useNavigate();
  const cluster = findCluster(key);
  const companies = COMPANIES[key] || [];

  useEffect(() => {
    if (!cluster) navigate('/', { replace: true });
  }, [cluster, navigate]);

  if (!cluster) return null;

  const Icon = cluster.icon;
  const num = String(SECTORS.findIndex((s) => s.key === key) + 1).padStart(2, '0');

  return (
    <>
      <ClusterHero cluster={cluster} num={num} Icon={Icon} />

      <Reveal>
        <div className="stats">
          <div className="stats__item">
            <span className="stats__num">{companies.length}</span>
            <span className="stats__label">Operating companies</span>
          </div>
          <div className="stats__item">
            <span className="stats__num">
              {companies.reduce((s, c) => s + c.employees, 0).toLocaleString()}
            </span>
            <span className="stats__label">Employees in cluster</span>
          </div>
          <div className="stats__item">
            <span className="stats__num">{cluster.stats[0].value}</span>
            <span className="stats__label">{cluster.stats[0].label}</span>
          </div>
          <div className="stats__item">
            <span className="stats__num">{cluster.stats[1].value}</span>
            <span className="stats__label">{cluster.stats[1].label}</span>
          </div>
        </div>
      </Reveal>

      <section className="section">
        <div className="container">
          <div className="sectors__header">
            <Reveal>
              <div className="sectors__header-row">
                <span className="eyebrow">Operating companies</span>
                <h2>
                  Inside the<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    {cluster.name.toLowerCase()} cluster.
                  </em>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">
                Each company in the cluster operates with its own management,
                brand and P&amp;L — and shares the group’s standards for
                governance, ESG and operational excellence.
              </p>
            </Reveal>
          </div>

          <div className="company-grid">
            {companies.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06}>
                <CompanyCard company={c} clusterKey={key} accent={cluster.accent} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <Reveal>
            <div className="sectors__header" style={{ marginBottom: 32 }}/>
              <span className="eyebrow">Other clusters</span>
          </Reveal>
        <div className="cluster-rail">
          {SECTORS.filter((s) => s.key !== key).map((s) => {
            const I = s.icon;
            return (
              <Reveal key={s.key}>
                <Link to={`/clusters/${s.key}`} className="cluster-pill">
                  <I size={16} />
                  <span>{s.name}</span>
                  <ArrowUpRight size={14} />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section >
    </>
  );
}

function ClusterHero({ cluster, num, Icon }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -4]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], reduce ? [1, 1] : [1, 0.3]);

  return (
    <section
      ref={ref}
      className="cluster-hero"
      style={{ '--cluster-accent': cluster.accent }}
    >
      <div className="cluster-hero__bg" aria-hidden="true" />

      <div className="container cluster-hero__inner">
        <Reveal>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'var(--ink-2)', fontSize: '0.9rem', marginBottom: 32,
            }}
          >
            <ArrowLeft size={16} /> Back to group
          </Link>
        </Reveal>

        <motion.div
          style={{ y, rotate, scale, opacity }}
          className="cluster-hero__card"
        >
          <div className="sector-card__head">
            <div className="sector-card__icon">
              <Icon size={32} />
            </div>
            <span className="sector-card__num">{num} / 06</span>
          </div>
          <h1 className="cluster-hero__title">
            {cluster.name}
          </h1>
          <p className="lede">{cluster.description}</p>
        </motion.div>
      </div>
    </section>
  );
}

function CompanyCard({ company, clusterKey, accent }) {
  return (
    <Link
      to={`/clusters/${clusterKey}/companies/${company.id}`}
      className="company-card"
      style={{ '--company-accent': accent }}
    >
      <div
        className="company-card__media"
        style={{
          background: `linear-gradient(135deg, ${accent}, var(--bg-3))`,
        }}
      >
        <span className="company-card__emoji" aria-hidden="true">{company.emoji}</span>
      </div>
      <div className="company-card__body">
        <h3 className="company-card__name">{company.name}</h3>
        <p className="company-card__short">{company.short}</p>
        <div className="company-card__meta">
          <span><MapPin size={12} /> {company.location}</span>
          <span><Calendar size={12} /> Est. {company.founded}</span>
        </div>
        <div className="company-card__foot">
          <span className="company-card__stat">
            <strong>{company.employees.toLocaleString()}</strong>
            Employees
          </span>
          <span className="company-card__arrow" aria-hidden="true">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
