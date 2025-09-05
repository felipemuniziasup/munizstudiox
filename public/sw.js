/* Muniz Studio X — Service Worker focado em atualização imediata + assets rápidos  */

/**
 * Estratégia:
 * - HTML/Navegação: network-first SEM cache (sempre pega versão nova do deploy)
 * - Assets (CSS/JS/IMG/SVG/WEBP/…): stale-while-revalidate (rápido e atualiza por trás)
 * - SW toma controle imediatamente (skipWaiting + clients.claim)
 */

const CACHE_NAME = 'msx-assets-v' + Date.now(); // força nova versão a cada deploy
const ASSET_REGEX = /\.(?:css|js|png|webp|svg|jpg|jpeg|gif|ico|woff2?)$/i;

// Liste aqui APENAS assets “estáticos” úteis offline (NÃO inclua HTML)
const PRECACHE = [
  '/assets/css/theme-munizx.css',
  '/assets/logos/logo-flat-512.png',
  '/assets/logos/logo-reflex.png',
  '/assets/icons/whatsapp.svg'
];

// Instala e assume imediatamente
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(PRECACHE);
      } catch (_) {
        // ignora falhas de precache (sem quebrar a instalação)
      } finally {
        self.skipWaiting();
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Remove caches antigos
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
      // Assume controle imediato das abas
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Interessa só GET
  if (req.method !== 'GET') return;

  // 1) NAVEGAÇÃO (HTML): SEM CACHE — sempre rede; fallback simples se offline
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Evita cache do navegador/CDN para HTML
          return await fetch(req, { cache: 'no-store' });
        } catch {
          // Fallback básico se totalmente offline (pode customizar uma /offline.html depois)
          // tenta devolver o último index.html do próprio navegador (não do SW)
          return new Response(
            '<!doctype html><meta charset="utf-8"><title>Offline</title><style>body{background:#0b1220;color:#cbd5e1;font:16px/1.5 system-ui,Segoe UI,Roboto,Arial;margin:0;display:grid;place-items:center;height:100vh;padding:32px;text-align:center}</style><h1>Você está offline</h1><p>Volte quando a conexão retornar.</p>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
      })()
    );
    return;
  }

  // 2) ASSETS MESMA ORIGEM: stale-while-revalidate (rápido + atualiza por trás)
  if (url.origin === self.location.origin && ASSET_REGEX.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);
        const networkPromise = fetch(req)
          .then((res) => {
            // só cacheia respostas 200 e do tipo básico
            if (res && res.status === 200 && res.type === 'basic') {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(() => null);

        // Entrega do cache se existir, atualizando por trás; senão, rede
        return cached || networkPromise || fetch(req);
      })()
    );
    return;
  }

  // 3) Demais requests: deixa seguir normalmente
});
