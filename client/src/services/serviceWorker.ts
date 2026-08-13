/**
 * Service Worker - دعم العمل بدون إنترنت
 * يوفر تخزيناً مؤقتاً للموارد والبيانات دون تعطيل الإقلاع.
 */

const CACHE_NAME = 'delta-stars-v3-brand-2026';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/official_logo.png',
  '/apple-touch-icon.png',
  '/manifest.json',
];

type WaitUntilEvent = {
  waitUntil(promise: PromiseLike<unknown>): void;
};

type FetchEventLike = {
  request: Request;
  respondWith(response: Response | PromiseLike<Response>): void;
};

type ServiceWorkerHost = {
  addEventListener(type: 'install' | 'activate', listener: (event: WaitUntilEvent) => void): void;
  addEventListener(type: 'fetch', listener: (event: FetchEventLike) => void): void;
  addEventListener(type: 'message', listener: (event: MessageEvent<{ type?: string }>) => void): void;
  skipWaiting(): Promise<void>;
  clients: { claim(): Promise<void> };
};

const serviceWorker = self as unknown as ServiceWorkerHost;

// تثبيت Service Worker
serviceWorker.addEventListener('install', (event: WaitUntilEvent) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((error: unknown) => {
        console.warn('⚠️ Some assets failed to cache:', error);
      });
    })
  );
  void serviceWorker.skipWaiting();
});

// تفعيل Service Worker
serviceWorker.addEventListener('activate', (event: WaitUntilEvent) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return undefined;
        })
      )
    )
  );
  void serviceWorker.clients.claim();
});

// معالجة الطلبات
serviceWorker.addEventListener('fetch', (event: FetchEventLike) => {
  const { request } = event;

  // تجاهل الطلبات غير GET
  if (request.method !== 'GET') {
    return;
  }

  // استراتيجية Network First للـ API
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            void caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
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

  // استراتيجية Cache First للموارد الثابتة
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          void caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.match('/index.html'))
        .then((response) => response ?? new Response('Offline', { status: 503 }));
    })
  );
});

// معالجة الرسائل من العميل
serviceWorker.addEventListener('message', (event: MessageEvent<{ type?: string }>) => {
  if (event.data?.type === 'SKIP_WAITING') {
    void serviceWorker.skipWaiting();
  }
});

export {};
