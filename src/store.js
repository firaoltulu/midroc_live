
const SESSION_KEY = 'midroc.admin.session';
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

async function request(path, { method = 'GET', body, isForm = false, auth = false } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const init = { method, headers };
  if (body !== undefined) {
    init.body = isForm ? body : JSON.stringify(body);
  }

  const res = await fetch(path, init);

  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (payload && payload.error) || res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload;
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.exp !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

function getToken() {
  const s = readSession();
  return s ? s.token : null;
}

export function isAdmin() {
  const s = readSession();
  return !!s && s.exp > Date.now();
}

export async function adminLogin(password) {
  try {
    const { token, exp } = await request('/api/auth/login', {
      method: 'POST',
      body: { password },
    });
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, exp }));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || 'Incorrect password' };
  }
}

export function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
}

function fromApi(row) {
  const images = Array.isArray(row.images) ? row.images : [];
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt,
    date: row.date,
    readMins: row.readMins,
    emoji: row.emoji,
    c1: row.c1,
    c2: row.c2,
    hasImage: !!row.hasImage || images.length > 0,
    coverImageId: row.coverImageId ?? (images.find((i) => i.isCover)?.id ?? null),
    images,
    userAdded: true,
  };
}

export async function getAllNews() {
  const rows = await request('/api/news');
  return rows.map(fromApi);
}

export async function getNewsById(id) {
  try {
    const row = await request(`/api/news/${id}`);
    return fromApi(row);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

export async function getRelatedNews(news, limit = 3) {
  if (!news) return [];
  const all = await getAllNews();
  return all
    .filter((n) => n.id !== news.id && n.category === news.category)
    .slice(0, limit);
}

export async function addNews(entry) {
  const row = await request('/api/news', {
    method: 'POST',
    body: {
      title: entry.title,
      excerpt: entry.excerpt,
      category: entry.category || 'Group',
      readMins: Number(entry.readMins) || 3,
      emoji: entry.emoji || '✨',
      c1: entry.c1 || '#1d1d28',
      c2: entry.c2 || '#0d0d12',
    },
    auth: true,
  });
  return fromApi(row);
}

export async function deleteNews(id) {
  await request(`/api/news/${id}`, { method: 'DELETE', auth: true });
}

export function imageUrl(news, imageId) {
  if (!news) return null;
  const id = imageId ?? news.coverImageId;
  if (!id) return null;
  return `/api/news/${news.id}/images/${id}`;
}

export function galleryImages(news) {
  if (!news || !Array.isArray(news.images)) return [];
  return news.images.filter((i) => !i.isCover);
}


export async function uploadImages(newsId, files) {
  if (!files || files.length === 0) return getNewsById(newsId);
  const fd = new FormData();
  for (const f of files) fd.append('files', f);
  await request(`/api/news/${newsId}/images`, {
    method: 'POST',
    body: fd,
    isForm: true,
    auth: true,
  });
  return getNewsById(newsId);
}

export async function setCoverImage(newsId, imageId) {
  await request(`/api/news/${newsId}/images/${imageId}/cover`, {
    method: 'PATCH',
    auth: true,
  });
  return getNewsById(newsId);
}


export async function deleteImage(newsId, imageId) {
  await request(`/api/news/${newsId}/images/${imageId}`, {
    method: 'DELETE',
    auth: true,
  });
  return getNewsById(newsId);
}
