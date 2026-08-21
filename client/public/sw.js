const CACHE_NAME = "podvodnik-pwa-v3";
const CACHE_PREFIX = "podvodnik-pwa-";
const scope = self.registration.scope;
const appUrl = (path) => new URL(path, scope).toString();
const APP_SHELL = [
  appUrl(""),
  appUrl("index.html"),
  appUrl("manifest.webmanifest"),
  appUrl("icons/icon-192x192.png"),
  appUrl("icons/icon-512x512.png"),
];
const OFFLINE_DOCUMENT = appUrl("index.html");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_DOCUMENT))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      });
    })
  );
});
