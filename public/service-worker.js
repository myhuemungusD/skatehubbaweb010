const CACHE_NAME = 'skatehubba-v1';
const RUNTIME_CACHE = 'skatehubba-runtime';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker caching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('Service Worker installed, skipping waiting');
        return self.skipWaiting();
      })
      .catch(err => console.error('Service Worker install failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('Service Worker claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API calls for real-time data
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});
