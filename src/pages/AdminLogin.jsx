import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import Reveal from '../components/Reveal';
import { adminLogin, isAdmin } from '../store';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAdmin()) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const res = await adminLogin(pwd);
    if (res.ok) {
      navigate('/admin/dashboard');
    } else {
      setErr(res.error);
      setBusy(false);
    }
  }

  return (
    <section className="page-hero" style={{ minHeight: '100svh', display: 'grid', alignItems: 'center' }}>
      <div className="page-hero__bg" aria-hidden="true" />

      <div className="container" style={{ display: 'grid', placeItems: 'center', width: '100%' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <Reveal>
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: 'var(--ink-2)', fontSize: '0.9rem', marginBottom: 32,
              }}
            >
              <ArrowLeft size={16} /> Back to site
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 16,
            }}>
              <span style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, var(--gold-500), var(--gold-700))',
                display: 'grid', placeItems: 'center', color: '#1a1407',
                boxShadow: 'var(--glow-gold)',
              }}>
                <ShieldCheck size={22} />
              </span>
              <span className="eyebrow" style={{ margin: 0 }}>Administrator portal</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 style={{ marginBottom: 16 }}>Sign in to manage news</h1>
          </Reveal>

          <Reveal delay={0.15}>
            <form
              className="contact-form"
              onSubmit={submit}
              style={{ marginTop: 24 }}
            >
              <div className="field">
                <label htmlFor="pwd">
                  <Lock size={12} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Administrator password
                </label>
                <input
                  id="pwd"
                  type="password"
                  autoFocus
                  required
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="Enter the admin password"
                />
              </div>

              {err && (
                <div
                  role="alert"
                  style={{
                    marginTop: 16, padding: '12px 14px', borderRadius: 'var(--r-md)',
                    background: 'rgba(184, 90, 58, 0.12)',
                    border: '1px solid rgba(184, 90, 58, 0.4)',
                    color: '#e8a995', fontSize: '0.9rem',
                  }}
                >
                  {err}
                </div>
              )}

              <button
                type="submit"
                className="btn btn--primary"
                disabled={busy}
                style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}
              >
                {busy ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}
              </button>

              <p
                className="text-muted"
                style={{
                  fontSize: '0.8rem', marginTop: 20, paddingTop: 16,
                  borderTop: '1px solid var(--line)', textAlign: 'center',
                }}
              >
                Password is configured via the{' '}
                <code style={{
                  color: 'var(--gold-300)', background: 'rgba(201,161,74,0.08)',
                  padding: '2px 8px', borderRadius: 4, fontSize: '0.85rem',
                }}>ADMIN_PASSWORD</code> env var.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}