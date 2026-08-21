/**
 * Delta Stars Service Worker v4 - Offline Support & Auto-Update
 * Network-first for API calls, Cache-first for static assets.
 */

const CACHE_NAME = 'delta-stars-v4-auto-update-2026';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/official_logo.png',
  '/apple-touch-icon.png',
  '/manifest.json',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker v4 installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.warn('⚠️ Some assets failed to cache:', error);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches + notify clients of update
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker v4 activated');
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        )
      ),
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SW_UPDATED', version: CACHE_NAME });
        });
      }),
    ])
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Network-first strategy for API calls
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              new Response(
                JSON.stringify({ error: 'Offline - cached data unavailable' }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: new Headers({ 'Content-Type': 'application/json' }),
                }
              )
          )
        )
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.match('/index.html'))
        .then((response) => response || new Response('Offline', { status: 503 }));
    })
  );
});

// Handle messages from client (auto-update trigger)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
