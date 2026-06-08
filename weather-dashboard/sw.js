const CACHE_NAME = "weather-cache-v7";
const ASSETS = [
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://unpkg.com/lucide@latest"
];

// Install Service Worker and cache essential static assets
self.addEventListener("install", (e) => {
  self.skipWaiting(); // Force active status immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate event - clear out old caches if cache version updates
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Take control of open pages immediately
    })
  );
});

// Fetch events interceptor - Network First Strategy
self.addEventListener("fetch", (e) => {
  // Ignore Open-Meteo API requests which must be live
  if (e.request.method !== "GET" || e.request.url.includes("api.open-meteo.com") || e.request.url.includes("geocoding-api")) {
    return;
  }
  
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // If successful, clone response and cache it
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, cacheCopy);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(e.request);
      })
  );
});
