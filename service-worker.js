const CACHE_NAME = "kotecha-family-heritage-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./about.html",
  "./branches.html",
  "./contact.html",
  "./family-tree.html",
  "./history.html",
  "./login.html",
  "./register.html",
  "./member-history.html",
  "./manifest.json",
  "./banyan_tree_new.jpeg",
  "./anjali-kotecha-about.jpeg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(FILES_TO_CACHE)
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then(response =>
          response || caches.match("./index.html")
        )
      )
    );
  }
});
