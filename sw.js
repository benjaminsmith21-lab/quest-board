// Quest Board moved to /medo/. This worker clears the old offline copy and retires itself.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('questboard')).map((k) => caches.delete(k)));
    // the shared cache may still hold old /quest-board/ files: drop just those (Medo's own files stay)
    for (const k of keys.filter((k) => !k.startsWith('questboard'))) {
      const c = await caches.open(k);
      for (const r of await c.keys()) if (r.url.includes('/quest-board/')) await c.delete(r);
    }
    await self.registration.unregister();
    const list = await self.clients.matchAll({ type: 'window' });
    list.forEach((c) => c.navigate('https://benjaminsmith21-lab.github.io/medo/'));
  })());
});
