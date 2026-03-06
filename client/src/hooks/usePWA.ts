import { useEffect, useState } from "react";

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Service Worker kaydı
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker kaydedildi:", registration);
        })
        .catch((error) => {
          console.error("[PWA] Service Worker kaydı başarısız:", error);
        });
    }

    // Install prompt dinle
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setIsInstallable(true);
      setInstallPrompt(e as PWAInstallPrompt);
      console.log("[PWA] Kurulum istemi alındı");
    };

    // Kurulum başarılı
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      console.log("[PWA] Uygulama kuruldu");
    };

    // Çevrimiçi/çevrimdışı durumu dinle
    const handleOnline = () => {
      setIsOnline(true);
      console.log("[PWA] Çevrimiçi");
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("[PWA] Çevrimdışı");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Manifest meta tag ekle
    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement("link");
      link.rel = "manifest";
      link.href = "/manifest.json";
      document.head.appendChild(link);
    }

    // Theme color meta tag
    if (!document.querySelector('meta[name="theme-color"]')) {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = "#0D47A1";
      document.head.appendChild(meta);
    }

    // Apple status bar
    if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
      const meta = document.createElement("meta");
      meta.name = "apple-mobile-web-app-status-bar-style";
      meta.content = "black-translucent";
      document.head.appendChild(meta);
    }

    // Apple app capable
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      const meta = document.createElement("meta");
      meta.name = "apple-mobile-web-app-capable";
      meta.content = "yes";
      document.head.appendChild(meta);
    }

    // Apple app title
    if (!document.querySelector('meta[name="apple-mobile-web-app-title"]')) {
      const meta = document.createElement("meta");
      meta.name = "apple-mobile-web-app-title";
      meta.content = "D Bilişim";
      document.head.appendChild(meta);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) {
      console.warn("[PWA] Kurulum istemi mevcut değil");
      return;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`[PWA] Kullanıcı seçimi: ${outcome}`);
      setInstallPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error("[PWA] Kurulum hatası:", error);
    }
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("[PWA] Bildirimler desteklenmiyor");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ("serviceWorker" in navigator && "Notification" in window) {
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            icon: "/icon-192x192.png",
            badge: "/icon-96x96.png",
            ...options,
          });
        });
      }
    }
  };

  const registerBackgroundSync = async (tag: string) => {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register(tag);
        console.log(`[PWA] Background sync kaydedildi: ${tag}`);
      } catch (error) {
        console.error("[PWA] Background sync kaydı başarısız:", error);
      }
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    requestNotificationPermission,
    sendNotification,
    registerBackgroundSync,
  };
}
