/* Muniz Studio X — SW básico */
const CACHE = 'msx-v1';
const PRECACHE = [
  '/', '/index.html',
  '/assets/css/theme-munizx.css',
  '/assets/logos/logo-flat-512.png',
  '/assets/logos/logo-reflex.png',
  '/assets/icons/whatsapp.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;

  // Navegação (HTML): network-first com fallback cache
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put('/', clone));
        return r;
      }).catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  // Assets (CSS/IMG/JS): stale-while-revalidate
  if (/\.(css|js|png|webp|svg|jpg|jpeg|gif|ico)$/i.test(new URL(req.url).pathname)) {
    e.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req).then(r => {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
          return r;
        }).catch(() => cached || Promise.reject());
        return cached || fetchPromise;
      })
    );
  }
});
