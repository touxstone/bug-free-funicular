const CACHE_NAME = "manual-b-v2";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles/main.css",
  "./src/main.js",
  "./src/data.js",
  "./src/progress.js",
  "./src/review.js",
  "./src/router.js",
  "./src/search.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "../data/json/manual.json"
];
const APP_BASE = new URL("./", self.location.href).pathname;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const cacheFirst = url.pathname.includes("/assets/img/") || url.pathname.endsWith("/manual.json");
  const networkFirst = url.pathname.startsWith(APP_BASE);

  if (cacheFirst) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        });
      })
    );
    return;
  }

  if (networkFirst) {
    event.respondWith(
        fetch(event.request)
        .then((response) => {
          if (!response.ok) return response;
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
