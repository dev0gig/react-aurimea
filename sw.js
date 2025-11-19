
// sw.js

// Define a unique name and version for the cache.
// Incrementing the version will trigger the 'activate' event and clear old caches.
const CACHE_NAME = 'aurimea-cache-v1';

// List of essential assets to be cached during the service worker installation.
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  'https://cdn-icons-png.flaticon.com/512/10106/10106199.png'
];

/**
 * 'install' event listener
 * This event is fired when the service worker is first installed.
 * It's used to cache the core assets of the application shell.
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching application shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache app shell:', error);
      })
  );
});

/**
 * 'activate' event listener
 * This event is fired when the service worker is activated.
 * It's the perfect place to clean up old, unused caches.
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If a cache's name is different from the current one, delete it.
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages under its scope immediately.
  return self.clients.claim();
});

/**
 * 'fetch' event listener
 * This event intercepts every network request made by the page.
 * It allows us to implement custom caching strategies.
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Strategy: Network-first, then Cache for navigation requests (HTML pages).
  // This ensures the user always gets the latest page if online, but can still access it offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If the network request is successful, cache a clone of the response and return it.
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // If the network fails (offline), serve the page from the cache as a fallback.
          return caches.match('/index.html');
        })
    );
    return;
  }

  // Strategy: Cache-first, then Network for all other assets (JS, CSS, images, fonts).
  // This is ideal for static assets as it provides the fastest response time.
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // If the resource is found in the cache, return it immediately.
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch it from the network.
        return fetch(request)
          .then((networkResponse) => {
            // Check if we received a valid response.
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
              return networkResponse;
            }
            
            // Clone the response, cache it for future requests, and return it.
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            return networkResponse;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch failed:', error);
            // Optionally, you could return a fallback asset (e.g., an offline image).
          });
      })
  );
});
