// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Service Worker v1.0
// Estrategia: Cache First para assets, Network First para datos
// ═══════════════════════════════════════════════════════════════

const SW_VERSION = 'siso-sw-v1.0.0';
const CACHE_ASSETS = `${SW_VERSION}-assets`;
const CACHE_PAGES  = `${SW_VERSION}-pages`;

const CRITICAL_ASSETS = ['/', '/index.html'];

const DATA_HOSTS = [
  'supabase.co', 'cloudinary.com', 'api.qrserver.com',
  'emailjs.com', 'generativelanguage.googleapis.com',
  'api.groq.com', 'api.together.xyz', 'openrouter.ai', 'aiplatform.googleapis.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_ASSETS).then(cache => cache.addAll(CRITICAL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_ASSETS && k !== CACHE_PAGES).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (DATA_HOSTS.some(host => url.hostname.includes(host))) {
    event.respondWith(networkOnlyWithOfflineFallback(req));
    return;
  }
  if (/\.(js|css|png|jpg|jpeg|svg|ico|woff2?|ttf)$/.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(req));
    return;
  }
  event.respondWith(networkFirstStrategy(req));
});

async function cacheFirstStrategy(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const response = await fetch(req);
    if (response.ok) {
      const cache = await caches.open(CACHE_ASSETS);
      cache.put(req, response.clone());
    }
    return response;
  } catch { return new Response('Asset no disponible offline', { status: 503 }); }
}

async function networkFirstStrategy(req) {
  try {
    const response = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);
    if (response.ok) {
      const cache = await caches.open(CACHE_PAGES);
      cache.put(req, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    const indexCached = await caches.match('/index.html');
    if (indexCached) return indexCached;
    return new Response(offlinePage(), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}

async function networkOnlyWithOfflineFallback(req) {
  try { return await fetch(req); } catch {
    return new Response(JSON.stringify({ error: 'Sin conexión', offline: true }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'siso-sync-queue') event.waitUntil(flushSyncQueue());
  if (event.tag === 'siso-audit-queue') event.waitUntil(flushAuditQueue());
});

async function flushSyncQueue() {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach(client => client.postMessage({ type: 'SISO_SYNC_NOW', queue: 'data' }));
}

async function flushAuditQueue() {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach(client => client.postMessage({ type: 'SISO_SYNC_NOW', queue: 'audit' }));
}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SISO_SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'SISO_GET_VERSION') event.source?.postMessage({ type: 'SISO_VERSION', version: SW_VERSION });
});

function offlinePage() {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>SISO - Sin Conexión</title><style>body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:2rem}.card{background:#1e293b;border-radius:1rem;padding:2.5rem;max-width:400px}h1{color:#0891b2}p{color:#94a3b8;line-height:1.6}button{background:#0891b2;color:white;border:none;padding:.75rem 2rem;border-radius:.5rem;cursor:pointer;font-size:1rem}</style></head><body><div class="card"><div style="font-size:4rem;margin-bottom:1rem">📡</div><h1>Sin Conexión</h1><p>SISO está en modo offline. Los datos se sincronizarán cuando vuelva la conexión.</p><button onclick="window.location.reload()">Reintentar</button></div></body></html>`;
}