/**
 * Maharashtra: Unity in Diversity 2026
 * Offline Cache-First Service Worker
 * Department of Artificial Intelligence & Data Science
 */

const CACHE_NAME = 'maharashtra-2026-v13';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './js/map.js',
  './js/i18n.js',
  './js/quiz.js',
  './js/chatbot.js',
  './js/charts.js',
  './data/en.json',
  './data/mr.json',
  './data/quiz.json',
  './data/faq.json',
  './images/shivaji-maharaj.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.url.includes('fonts.googleapis.com') ||
           event.request.url.includes('fonts.gstatic.com') ||
           event.request.url.includes('cdn.jsdelivr.net') ||
           event.request.url.includes('unpkg.com'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
