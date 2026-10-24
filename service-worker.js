/* ============================================================
   அறிவுக் களம் 6 — Service Worker v2
   Offline-first caching strategy
   ============================================================ */

const CACHE_NAME = 'arivu-kalam-v2';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/data/tamil.json',
  '/data/english.json',
  '/data/mathematics.json',
  '/data/science.json',
  '/data/social-science.json'
];

const ICON_ASSETS = [
  '/assets/icons/icon.svg',
  '/assets/icons/icon-72x72.svg',
  '/assets/icons/icon-96x96.svg',
  '/assets/icons/icon-128x128.svg',
  '/assets/icons/icon-144x144.svg',
  '/assets/icons/icon-152x152.svg',
  '/assets/icons/icon-192x192.svg',
  '/assets/icons/icon-384x384.svg',
  '/assets/icons/icon-512x512.svg'
];

const ALL_ASSETS = [...CORE_ASSETS, ...ICON_ASSETS];

/* ── Install: cache everything ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ALL_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => {
        // Even if some assets fail, still activate
        console.warn('SW install partial error:', err);
        return self.skipWaiting();
      })
  );
});

/* ── Activate: remove old caches ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first for assets, network-first for data ── */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;
  
  // For JSON data: try network first (fresh data), fall back to cache
  if (url.pathname.startsWith('/data/')) {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return resp;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  
  // For everything else: cache-first (fast offline load)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
