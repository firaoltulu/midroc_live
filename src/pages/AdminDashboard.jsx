import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Plus,
  Trash2,
  LogOut,
  ShieldCheck,
  Check,
  Newspaper,
  ImagePlus,
  Star,
  X as XIcon,
} from 'lucide-react';
import Reveal from '../components/Reveal';
import {
  getAllNews,
  addNews,
  deleteNews,
  adminLogout,
  uploadImages,
  deleteImage,
  setCoverImage,
  imageUrl,
} from '../store';
import { SECTORS } from '../data';

const CATEGORY_CHOICES = ['Group', ...SECTORS.map((s) => s.name)];
const EMOJI_CHOICES = ['✨', '📈', '🏗️', '⛏️', '🌾', '🏨', '⚙️', '🛒', '🌱', '☕', '🏭', '🚚', '💧', '🥇', '📊', '🌍'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const rows = await getAllNews();
      setAllNews(rows);
    } catch (err) {
      setError(err.message || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  function logout() {
    adminLogout();
    navigate('/admin');
  }

  const total = allNews.length;
  const imageCount = allNews.reduce((sum, n) => sum + (n.images?.length || 0), 0);

  return (
    <section className="page-hero" style={{ paddingBottom: 0 }}>
      <div className="page-hero__bg" aria-hidden="true" />

      <div className="container">
        <Reveal>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: 16, flexWrap: 'wrap',
            marginBottom: 32,
          }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: 'var(--ink-2)', fontSize: '0.9rem',
              }}
            >
              <ArrowLeft size={16} /> Back to site
            </Link>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 'var(--r-pill)',
                background: 'rgba(110, 166, 107, 0.12)',
                border: '1px solid rgba(110, 166, 107, 0.4)',
                color: 'var(--leaf)', fontSize: '0.8rem',
              }}>
                <ShieldCheck size={12} /> Authenticated
              </span>
              <button onClick={logout} className="btn btn--ghost" style={{ padding: '8px 14px' }}>
                <LogOut size={14} /> Log out
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <span className="eyebrow">Administrator portal</span>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 style={{ marginTop: 16, maxWidth: '18ch' }}>
            Newsroom<br />
            <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
              dashboard.
            </em>
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="admin-stats">
            <div className="admin-stat">
              <span className="admin-stat__num">{total}</span>
              <span className="admin-stat__label">Total articles</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__num">{imageCount}</span>
              <span className="admin-stat__label">Images uploaded</span>
            </div>
            <div className="admin-stat admin-stat--accent">
              <span className="admin-stat__num">{allNews.filter((n) => n.hasImage).length}</span>
              <span className="admin-stat__label">Articles with media</span>
            </div>
          </div>
        </Reveal>

        {error && (
          <p role="alert" style={{
            marginTop: 24, padding: '12px 14px', borderRadius: 'var(--r-md)',
            background: 'rgba(184, 90, 58, 0.12)',
            border: '1px solid rgba(184, 90, 58, 0.4)',
            color: '#e8a995', fontSize: '0.9rem',
          }}>{error}</p>
        )}

        {/* Add form */}
        <div style={{ marginTop: 64 }}>
          <Reveal>
            <div className="sectors__header" style={{ marginBottom: 24 }}>
              <div className="sectors__header-row">
                <span className="eyebrow"><Plus size={12} style={{ verticalAlign: 'middle' }} /> New article</span>
                <h2>
                  Publish a<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    story.
                  </em>
                </h2>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <AddForm onAdded={refresh} />
          </Reveal>
        </div>

        {/* List */}
        <div style={{ marginTop: 80 }}>
          <Reveal>
            <div className="sectors__header" style={{ marginBottom: 24 }}>
              <div className="sectors__header-row">
                <span className="eyebrow"><Newspaper size={12} style={{ verticalAlign: 'middle' }} /> Manage</span>
                <h2>
                  All<br />
                  <em style={{ color: 'var(--gold-300)', fontStyle: 'italic', fontWeight: 300 }}>
                    articles.
                  </em>
                </h2>
              </div>
            </div>
          </Reveal>

          {loading ? (
            <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>
          ) : (
            <motion.div className="admin-list" layout>
              <AnimatePresence initial={false}>
                {allNews.map((n) => (
                  <AdminRow key={n.id} news={n} onChanged={refresh} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function AddForm({ onAdded }) {
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    category: 'Group',
    emoji: '✨',
    readMins: 3,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const inputRef = useRef(null);

  function update(k) {
    return (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  function pickFiles(e) {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;
    const newFiles = [...imageFiles, ...picked];
    setImageFiles(newFiles);
    setCoverIndex(0); // reset cover to first when adding more

    let pending = picked.length;
    const newPreviews = [...imagePreviews];
    picked.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result);
        pending -= 1;
        if (pending === 0) setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    });

    if (inputRef.current) inputRef.current.value = '';
  }

  function removeImage(index) {
    setImageFiles((files) => files.filter((_, i) => i !== index));
    setImagePreviews((prevs) => prevs.filter((_, i) => i !== index));
    if (coverIndex === index) setCoverIndex(0);
    else if (coverIndex > index) setCoverIndex((c) => Math.max(0, c - 1));
  }

  function resetImages() {
    setImageFiles([]);
    setImagePreviews([]);
    setCoverIndex(0);
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const news = await addNews({
        ...form,
        readMins: Number(form.readMins) || 3,
      });
      if (imageFiles.length > 0) {
        const uploaded = await uploadImages(news.id, imageFiles);
        // The server makes the first uploaded image the cover by default. If
        // the admin picked a different cover in the picker, swap it now.
        if (coverIndex > 0 && uploaded.coverImageId) {
          const wanted = uploaded.images[coverIndex];
          if (wanted && wanted.id !== uploaded.coverImageId) {
            await setCoverImage(news.id, wanted.id);
          }
        }
      }
      setSuccess(news);
      setForm({ title: '', excerpt: '', category: 'Group', emoji: '✨', readMins: 3 });
      resetImages();
      onAdded();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      alert(`Failed to publish: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form__row">
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="title">Headline</label>
          <input id="title" required value={form.title} onChange={update('title')}
            placeholder="Midroc to begin lithium pilot at the Afar concession in Q3" />
        </div>
      </div>

      <div className="field" style={{ marginTop: 16 }}>
        <label htmlFor="excerpt">Excerpt</label>
        <textarea id="excerpt" required value={form.excerpt} onChange={update('excerpt')}
          placeholder="A one-paragraph summary that appears on the listing page and at the top of the article." />
      </div>

      <div className="admin-form__row" style={{ marginTop: 16 }}>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={update('category')}>
            {CATEGORY_CHOICES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="readMins">Read time (min)</label>
          <input id="readMins" type="number" min="1" max="30"
            value={form.readMins} onChange={update('readMins')} />
        </div>
      </div>

      <div className="field" style={{ marginTop: 16 }}>
        <label>Cover emoji</label>
        <div className="emoji-picker">
          {EMOJI_CHOICES.map((e) => (
            <button
              type="button"
              key={e}
              className={`emoji-pick ${form.emoji === e ? 'is-active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, emoji: e }))}
              aria-label={`Cover emoji ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="field" style={{ marginTop: 16 }}>
        <label>Images (optional — add multiple; one will be the cover)</label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <label className="btn btn--ghost" style={{ padding: '8px 14px', cursor: 'pointer' }}>
            <ImagePlus size={14} /> Add images
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={pickFiles}
              style={{ display: 'none' }}
            />
          </label>
          {imageFiles.length > 0 && (
            <button
              type="button"
              className="admin-delete"
              onClick={resetImages}
              style={{ padding: '6px 10px' }}
            >
              Clear all
            </button>
          )}
        </div>

        {imagePreviews.length > 0 && (
          <div className="admin-thumb-row" style={{ marginTop: 12 }}>
            {imagePreviews.map((src, i) => (
              <div
                key={i}
                className={`admin-thumb ${i === coverIndex ? 'admin-thumb--cover' : ''}`}
              >
                <img src={src} alt={`Image ${i + 1} preview`} />
                <button
                  type="button"
                  className="admin-thumb__star"
                  onClick={() => setCoverIndex(i)}
                  aria-label={i === coverIndex ? 'This is the cover' : 'Set as cover'}
                  title={i === coverIndex ? 'Cover' : 'Set as cover'}
                >
                  <Star size={12} fill={i === coverIndex ? 'currentColor' : 'none'} />
                </button>
                {i === coverIndex && (
                  <span className="admin-thumb__cover-badge">Cover</span>
                )}
                <button
                  type="button"
                  className="admin-thumb__x"
                  onClick={() => removeImage(i)}
                  aria-label={`Remove image ${i + 1}`}
                >
                  <XIcon size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn--primary" disabled={submitting} style={{ marginTop: 24 }}>
        {submitting ? 'Publishing…' : <>Publish article <ArrowUpRight size={16} /></>}
      </button>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: 20, padding: '14px 18px', borderRadius: 'var(--r-md)',
              background: 'rgba(110, 166, 107, 0.12)',
              border: '1px solid rgba(110, 166, 107, 0.4)',
              color: 'var(--leaf)', display: 'flex', gap: 12, alignItems: 'center',
              fontSize: '0.95rem',
            }}
          >
            <Check size={16} />
            <span>
              Published. <Link to={`/news/${success.id}`} style={{ color: 'var(--gold-300)', textDecoration: 'underline' }}>
                View article →
              </Link>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function AdminRow({ news, onChanged }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingImageId, setConfirmingImageId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function handleDelete() {
    try {
      await deleteNews(news.id);
      onChanged();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  }

  async function pickImages(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      await uploadImages(news.id, files);
      onChanged();
    } catch (err) {
      alert(`Failed to upload: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function makeCover(imageId) {
    try {
      await setCoverImage(news.id, imageId);
      onChanged();
    } catch (err) {
      alert(`Failed to set cover: ${err.message}`);
    }
  }

  async function handleDeleteImage(imageId) {
    if (confirmingImageId !== imageId) {
      setConfirmingImageId(imageId);
      // auto-cancel after 3s
      setTimeout(() => {
        setConfirmingImageId((cur) => (cur === imageId ? null : cur));
      }, 3000);
      return;
    }
    try {
      await deleteImage(news.id, imageId);
      setConfirmingImageId(null);
      onChanged();
    } catch (err) {
      alert(`Failed to delete image: ${err.message}`);
    }
  }

  const cover = imageUrl(news);
  const imageCount = news.images?.length || 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
      transition={{ duration: 0.3 }}
      className="admin-row is-user"
    >
      <div
        className="admin-row__media"
        style={{
          background: `linear-gradient(135deg, ${news.c1}, ${news.c2})`,
          position: 'relative', overflow: 'hidden',
        }}
      >
        {cover ? (
          <img src={cover} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          }} />
        ) : (
          <span aria-hidden="true">{news.emoji}</span>
        )}
      </div>

      <div className="admin-row__body">
        <div className="admin-row__meta">
          <span className="news-card__category">{news.category}</span>
          <span>{news.date}</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: 'var(--gold-300)', fontSize: '0.7rem',
            padding: '2px 8px', borderRadius: 'var(--r-pill)',
            border: '1px solid rgba(201,161,74,0.3)',
            background: 'rgba(201,161,74,0.08)',
          }}>
            <ShieldCheck size={10} /> In database
          </span>
          {imageCount > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              color: 'var(--leaf)', fontSize: '0.7rem',
              padding: '2px 8px', borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(110,166,107,0.4)',
              background: 'rgba(110,166,107,0.08)',
            }}>
              <ImagePlus size={10} /> {imageCount} image{imageCount === 1 ? '' : 's'}
            </span>
          )}
        </div>
        <h3 className="admin-row__title">{news.title}</h3>
        <p className="admin-row__excerpt">{news.excerpt}</p>

        {imageCount > 0 && (
          <div className="admin-thumb-row" style={{ marginTop: 12 }}>
            {news.images.map((img) => {
              const isConfirming = confirmingImageId === img.id;
              return (
                <div
                  key={img.id}
                  className={`admin-thumb ${img.isCover ? 'admin-thumb--cover' : ''}`}
                >
                  <img src={imageUrl(news, img.id)} alt="" />
                  <button
                    type="button"
                    className="admin-thumb__star"
                    onClick={() => makeCover(img.id)}
                    aria-label={img.isCover ? 'Cover image' : 'Make cover'}
                    title={img.isCover ? 'Cover' : 'Make cover'}
                    disabled={img.isCover}
                    style={{ opacity: img.isCover ? 1 : 0.75, cursor: img.isCover ? 'default' : 'pointer' }}
                  >
                    <Star size={12} fill={img.isCover ? 'currentColor' : 'none'} />
                  </button>
                  {img.isCover && (
                    <span className="admin-thumb__cover-badge">Cover</span>
                  )}
                  <button
                    type="button"
                    className={`admin-thumb__x ${isConfirming ? 'is-confirming' : ''}`}
                    onClick={() => handleDeleteImage(img.id)}
                    aria-label={isConfirming ? 'Confirm delete' : `Delete image`}
                    title={isConfirming ? 'Tap again to confirm' : 'Delete'}
                  >
                    {isConfirming ? <Check size={12} /> : <XIcon size={12} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="admin-row__actions">
        <label className="btn btn--ghost" style={{ padding: '8px 14px', cursor: uploading ? 'wait' : 'pointer' }}>
          <ImagePlus size={14} /> {uploading ? 'Uploading…' : 'Add images'}
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={pickImages}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>

        <Link to={`/news/${news.id}`} className="btn btn--ghost" style={{ padding: '8px 14px' }}>
          View <ArrowUpRight size={14} />
        </Link>

        {confirmingDelete ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setConfirmingDelete(false)} className="btn btn--ghost" style={{ padding: '8px 14px' }}>
              Cancel
            </button>
            <button onClick={handleDelete} className="admin-delete-confirm" style={{ padding: '8px 14px' }}>
              Confirm
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="admin-delete"
            aria-label="Delete article"
          >
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>
    </motion.article>
  );
}
