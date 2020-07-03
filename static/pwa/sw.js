'use strict';

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v1';
var peer;
var dataconnection;
var customer_call;

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
    '/static/pwa/offline.html',
  ];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
  // CODELAB: Precache static resources here.
    evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
evt.waitUntil(
  caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key !== CACHE_NAME) {
        console.log('[ServiceWorker] Removing old cache', key);
        return caches.delete(key);
      }
    }));
  })
);
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  // CODELAB: Add fetch event handler here.
  if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    console.log("not a page navigation")
    return;
  }
  evt.respondWith(
      fetch(evt.request)
          .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                  return cache.match('/static/pwa/offline.html');
                });
          })
  );
  
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://tengeneza.kipya-africa.com/fundi_n/')
  );
});