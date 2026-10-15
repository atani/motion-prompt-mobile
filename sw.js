/* Motion Prompt Mobile — Service Worker. 同梱ファイルをプリキャッシュしてオフラインで動かす。 */
'use strict';

const APP_VERSION = '1';
const UPSTREAM = '770eefb';
const CACHE = 'mpm-v' + APP_VERSION + '-' + UPSTREAM;
const VENDOR = 'vendor/motion-prompt/';

// 1 つでも欠けたら install を失敗させる中核ファイル
const SHELL = [
  './',
  'index.html',
  'app.css',
  'app.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'icons/icon.svg',
  'LICENSE',
  VENDOR + 'THIRD-PARTY-NOTICES.md',
  VENDOR + 'assets/runtime.js',
  VENDOR + 'api/v1/catalog.json',
  VENDOR + 'UPSTREAM-LICENSE',
  VENDOR + 'UPSTREAM_SHA',
];

// catalog.json から各要素のテキストとパックのコードの URL を組み立てる
function catalogUrls(cat) {
  const urls = [];
  cat.packs.forEach((p) => {
    urls.push(VENDOR + 'packs/' + p.pack + '/pack.js');
    urls.push(VENDOR + 'api/v1/kit/' + p.pack + '.js');
    (p.fonts || []).forEach((f) => urls.push(VENDOR + 'packs/' + p.pack + '/' + f.url));
  });
  ['ja', 'en'].forEach((lang) => {
    urls.push(VENDOR + 'api/v1/' + lang + '/catalog.tsv');
    cat.elements.forEach((el) => {
      urls.push(VENDOR + 'api/v1/' + lang + '/p/' + el.id + '.txt');
      urls.push(VENDOR + 'api/v1/' + lang + '/e/' + el.id + '.txt');
    });
  });
  return urls;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    const res = await cache.match(VENDOR + 'api/v1/catalog.json');
    const cat = await res.json();
    const urls = catalogUrls(cat);
    // パックのコードは必須。テキストは 1 件の失敗で全体を止めない
    const packs = urls.filter((u) => /\/pack\.js$/.test(u));
    await cache.addAll(packs);
    const rest = urls.filter((u) => packs.indexOf(u) < 0);
    const results = await Promise.allSettled(rest.map((u) => cache.add(u)));
    const failed = results.filter((r) => r.status === 'rejected').length;
    if (failed) console.warn('[sw] ' + failed + ' 件をキャッシュできませんでした');
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('mpm-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'status') {
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE);
      const keys = await cache.keys();
      if (event.source) event.source.postMessage({ type: 'status', cache: CACHE, count: keys.length });
    })());
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req);
        if (res.ok) cache.put('./', res.clone());
        return res;
      } catch (e) {
        return (await cache.match('./')) || (await cache.match('index.html')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok && url.pathname.indexOf('/' + VENDOR) >= 0) cache.put(req, res.clone());
    return res;
  })());
});
