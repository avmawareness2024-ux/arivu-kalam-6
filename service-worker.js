/* ============================================================
   அறிவுக் களம் 6 — Service Worker v3
   Offline-first caching strategy (Works on root & subpaths/GitHub Pages)
   ============================================================ */

const CACHE_NAME = 'arivu-kalam-v3';

// Relative assets resolved against the Service Worker location
const RELATIVE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './data/tamil.json',
  './data/english.json',
  './data/mathematics.json',
  './data/science.json',
  './data/social-science.json',
  './assets/icons/icon.svg',
  './assets/icons/icon-72x72.svg',
  './assets/icons/icon-96x96.svg',
  './assets/icons/icon-128x128.svg',
  './assets/icons/icon-144x144.svg',
  './assets/icons/icon-152x152.svg',
  './assets/icons/icon-192x192.svg',
  './assets/icons/icon-384x384.svg',
  './assets/icons/icon-512x512.svg'
];

/* ── Install: cache everything ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Map relative paths to absolute URLs based on sw scope
        const urlsToCache = RELATIVE_ASSETS.map(rel => new URL(rel, self.location.href).href);
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
      .catch(err => {
        console.warn('SW install partial warning:', err);
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
  
  // For JSON data: try network first, fallback to cache
  if (url.pathname.includes('/data/')) {
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
  
  // For other assets: cache first, then network fallback
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match(new URL('./index.html', self.location.href).href));
    })
  );
});
