const CACHE_NAME = "skyflow-cache-v2";
const ASSETS = [
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://unpkg.com/lucide@latest"
];

// Install Service Worker and cache essential static assets
self.addEventListener("install", (e) => {
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
    })
  );
});

// Fetch events interceptor - serves cached files if offline, otherwise fetches from network
self.addEventListener("fetch", (e) => {
  // Only handle GET requests and local/CDN assets (ignore Open-Meteo API requests which must be live)
  if (e.request.method !== "GET" || e.request.url.includes("api.open-meteo.com") || e.request.url.includes("geocoding-api")) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
