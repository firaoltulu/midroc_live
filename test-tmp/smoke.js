// One-shot smoke test for the multi-image API. Boots nothing — assumes the
// API is already running on localhost:3001 and uses the admin password from
// .env. Run via: node test-tmp/smoke.js
import 'dotenv/config';
import fs from 'node:fs';

const BASE = 'http://localhost:3001';

async function api(path, opts = {}) {
  const res = await fetch(BASE + path, opts);
  const body = res.headers.get('content-type')?.includes('application/json')
    ? await res.json()
    : await res.text();
  if (!res.ok) throw new Error(`${path}: ${res.status} ${typeof body === 'string' ? body : body.error}`);
  return body;
}

async function main() {
  console.log('1. health...');
  await api('/api/health');
  console.log('   ok');

  console.log('2. login...');
  const { token } = await api('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
  });
  console.log('   got token (', token.slice(0, 24), '...)');

  console.log('3. create article...');
  const article = await api('/api/news', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      title: 'Smoke test multi-image',
      excerpt: 'Verifies the upload-many + cover + delete flow.',
      category: 'Group',
    }),
  });
  console.log('   created id', article.id, 'images:', article.images.length);

  console.log('4. upload 2 images...');
  const fd = new FormData();
  fd.append('files', new Blob([fs.readFileSync('test-tmp/tiny.png')], { type: 'image/png' }), 'a.png');
  fd.append('files', new Blob([fs.readFileSync('test-tmp/tiny2.png')], { type: 'image/png' }), 'b.png');
  const upload = await api(`/api/news/${article.id}/images`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: fd,
  });
  console.log('   uploaded', upload.images.length, 'images');
  if (upload.images.length !== 2) throw new Error('expected 2 images');
  const [first, second] = upload.images;
  if (!first.isCover) throw new Error('first uploaded image should be cover');
  if (second.isCover) throw new Error('second uploaded image should NOT be cover');
  console.log('   cover auto-assigned to image', first.id);

  console.log('5. swap cover to second...');
  const swapped = await api(`/api/news/${article.id}/images/${second.id}/cover`, {
    method: 'PATCH',
    headers: { authorization: `Bearer ${token}` },
  });
  if (swapped.coverImageId !== second.id) throw new Error(`cover swap expected ${second.id}, got ${swapped.coverImageId}`);
  console.log('   cover is now image', second.id);

  console.log('6. GET one image bytes...');
  const imgRes = await fetch(`${BASE}/api/news/${article.id}/images/${first.id}`);
  if (!imgRes.ok) throw new Error('image fetch failed');
  const buf = Buffer.from(await imgRes.arrayBuffer());
  console.log('   fetched', buf.length, 'bytes');
  if (buf.length < 50) throw new Error('image body too small');

  console.log('7. delete first image (auto-promotes second to cover)...');
  const deleteRes = await api(`/api/news/${article.id}/images/${first.id}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
  if (deleteRes.remainingImages !== 1) throw new Error(`expected 1 remaining image, got ${deleteRes.remainingImages}`);
  // Fetch the article to confirm cover was auto-promoted.
  const afterDelete = await api(`/api/news/${article.id}`);
  if (afterDelete.coverImageId !== second.id) throw new Error(`expected cover to be ${second.id}, got ${afterDelete.coverImageId}`);
  console.log('   remaining:', afterDelete.images.length, 'cover:', afterDelete.coverImageId);

  console.log('8. cleanup: delete the test article...');
  await api(`/api/news/${article.id}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
  console.log('   done');

  console.log('\n✅ ALL CHECKS PASSED');
}

main().catch((e) => {
  console.error('\n❌', e.message);
  process.exit(1);
});
