/* Muniz Studio X — SW básico (network-first para HTML; stale-while-revalidate para assets) */
const CACHE = 'msx-v2';
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
    caches.keys().then(keys => Promise.all(keys.map(k => k === CACHE ? null : caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // Nunca cachear navegação/HTML (sempre pegar rede; fallback cache/home)
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(r => r)
        .catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  // Assets: stale-while-revalidate
  if (/\.(css|js|png|webp|svg|jpg|jpeg|gif|ico)$/i.test(url.pathname)) {
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

// Forçar clientes a usar a nova versão assim que instalada
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
