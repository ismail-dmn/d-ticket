const CACHE_NAME = "d-bilisim-v1";
const OFFLINE_PAGE = "/offline.html";

// Service Worker kurulumu
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Kurulum başladı");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Cache oluşturuldu");
      return cache.addAll([
        "/",
        "/offline.html",
        "/manifest.json",
      ]);
    })
  );
  self.skipWaiting();
});

// Service Worker aktivasyonu
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Aktivasyon başladı");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Eski cache siliniyor:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch intercept - Network First Strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // API istekleri için Network First
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Başarılı yanıtları cache'e kaydet
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline durumunda cache'den döndür
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log("[Service Worker] Cache'den sunuluyor:", request.url);
              return cachedResponse;
            }
            // Cache'de yoksa offline sayfası göster
            return caches.match(OFFLINE_PAGE);
          });
        })
    );
    return;
  }

  // Statik varlıklar için Cache First
  if (
    request.url.includes(".js") ||
    request.url.includes(".css") ||
    request.url.includes(".png") ||
    request.url.includes(".jpg") ||
    request.url.includes(".svg") ||
    request.url.includes(".woff")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML sayfaları için Network First
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match(OFFLINE_PAGE);
          });
        })
    );
    return;
  }

  // Diğer istekler için varsayılan davranış
  event.respondWith(fetch(request));
});

// Background Sync - Offline veri senkronizasyonu
self.addEventListener("sync", (event) => {
  console.log("[Service Worker] Sync event:", event.tag);

  if (event.tag === "sync-tickets") {
    event.waitUntil(syncTickets());
  } else if (event.tag === "sync-customers") {
    event.waitUntil(syncCustomers());
  } else if (event.tag === "sync-proposals") {
    event.waitUntil(syncProposals());
  }
});

async function syncTickets() {
  try {
    console.log("[Service Worker] Ticketlar senkronize ediliyor");
    // Senkronizasyon mantığı
    const response = await fetch("/api/trpc/tickets.list");
    if (response.ok) {
      const data = await response.json();
      // IndexedDB'ye kaydet
      await saveToIndexedDB("tickets", data);
    }
  } catch (error) {
    console.error("[Service Worker] Senkronizasyon hatası:", error);
    throw error;
  }
}

async function syncCustomers() {
  try {
    console.log("[Service Worker] Müşteriler senkronize ediliyor");
    const response = await fetch("/api/trpc/customers.list");
    if (response.ok) {
      const data = await response.json();
      await saveToIndexedDB("customers", data);
    }
  } catch (error) {
    console.error("[Service Worker] Senkronizasyon hatası:", error);
    throw error;
  }
}

async function syncProposals() {
  try {
    console.log("[Service Worker] Teklifler senkronize ediliyor");
    const response = await fetch("/api/trpc/proposals.list");
    if (response.ok) {
      const data = await response.json();
      await saveToIndexedDB("proposals", data);
    }
  } catch (error) {
    console.error("[Service Worker] Senkronizasyon hatası:", error);
    throw error;
  }
}

async function saveToIndexedDB(storeName, data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("DBilisimDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      store.clear();
      store.add({ id: 1, data, timestamp: Date.now() });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };
  });
}

// Push Notifications
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push bildirimi alındı");
  const data = event.data?.json() ?? {};
  const title = data.title || "D Bilişim Çözümleri";
  const options = {
    body: data.body || "Yeni bildirim",
    icon: "/icon-192x192.png",
    badge: "/icon-96x96.png",
    tag: data.tag || "notification",
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Bildirim tıklandı");
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
