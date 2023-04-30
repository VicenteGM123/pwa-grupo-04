// https://www.freecodecamp.org/news/397b72168040/

const CACHE_NAME = 'rydeen-cache-v1';

const staticAssets = [
  "./",
  "./styles.css",
  "./src/app.js",
  "./assets/icon.png",
];

self.addEventListener("install", async (event) => {
  const cache = await caches.open(CACHE_NAME);
  cache.addAll(staticAssets);
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheData(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheData(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return await cache.match(request);
  }
}

console.log('SW script loaded');