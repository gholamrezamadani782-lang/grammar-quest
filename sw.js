/* Grammar Quest offline cache. The version changes whenever any file changes. */
const VERSION = "gq-7d6252d405";
const FILES = [
 "chapters/ch01.json",
 "chapters/ch02.json",
 "chapters/ch03.json",
 "chapters/ch04.json",
 "chapters/ch05.json",
 "chapters/ch06.json",
 "chapters/ch07.json",
 "chapters/ch08.json",
 "chapters/ch09.json",
 "chapters/ch10.json",
 "chapters/ch11.json",
 "chapters/ch12.json",
 "chapters/ch13.json",
 "chapters/ch14.json",
 "chapters/ch15.json",
 "chapters/ch16.json",
 "chapters/ch17.json",
 "chapters/ch18.json",
 "chapters/ch19.json",
 "chapters/ch20.json",
 "chapters/index.json",
 "fonts/atkinson-400-italic.woff2",
 "fonts/atkinson-400.woff2",
 "fonts/atkinson-700.woff2",
 "fonts/lilita-one-400.woff2",
 "icons/icon-180.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "index.html",
 "manifest.webmanifest"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(["./", ...FILES].map(u => new Request(u, {cache: "reload"})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => req.mode === "navigate" ? caches.match("./index.html") : Response.error())));
});
