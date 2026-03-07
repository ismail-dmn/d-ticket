# Vercel Deployment Fixes for d-ticket

## Tespit Edilen Sorunlar

### 1. **Vercel Serverless Function Uyumsuzluğu**
**Sorun:** Proje, geleneksel bir Node.js sunucusu olarak tasarlanmış ancak Vercel'in serverless ortamında çalıştırılmaya çalışılmıştır.

**Detay:** `server/_core/index.ts` dosyası, `createServer()` ile bir HTTP sunucusu başlatır ve belirli bir porta dinler. Vercel'in serverless ortamında:
- Sabit port dinlemesi desteklenmez
- Sunucu otomatik olarak kapatılır
- Uzun süren işlemler timeout'a uğrar

**Çözüm:** Yeni `api/index.ts` dosyası oluşturularak Express uygulaması Vercel'in serverless fonksiyonu olarak dışa aktarılmıştır.

---

### 2. **Yanlış vercel.json Konfigürasyonu**
**Sorun:** Orijinal `vercel.json` dosyası çok basit ve eksiktir:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ]
}
```

**Detay:**
- Build komutu belirtilmemiş
- Output dizini tanımlanmamış
- Serverless fonksiyon yapılandırması yok
- SPA (Single Page Application) için fallback yok
- API cache ayarları yok

**Çözüm:** Kapsamlı bir `vercel.json` yapılandırması oluşturulmuştur:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "api/index.ts": {
      "runtime": "nodejs20.x",
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

---

### 3. **Monolitik App Yapısı**
**Sorun:** `server/_core/index.ts` dosyası hem sunucu başlatma hem de uygulama kurulumunu içerir.

**Detay:** Vercel'de serverless fonksiyon olarak çalışması için:
- Uygulama kurulumu ayrı bir dosyada olmalı
- Sunucu başlatma kodu sadece lokal geliştirmede çalışmalı
- Vercel'de Express uygulaması doğrudan export edilmeli

**Çözüm:** 
1. **`server/_core/app.ts`** oluşturuldu: Express uygulamasını kuran ve döndüren fonksiyon
2. **`server/_core/index.ts`** güncellendi: Sadece lokal sunucu başlatma için
3. **`api/index.ts`** oluşturuldu: Vercel'in serverless fonksiyonu olarak

---

### 4. **Üretim Ortamında Static Dosyalar Sorunu**
**Sorun:** `server/_core/vite.ts` dosyasında `serveStatic()` fonksiyonu yanlış yolda static dosyaları arıyor.

**Detay:** 
```typescript
const distPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(import.meta.dirname, "../..", "dist", "public")
    : path.resolve(import.meta.dirname, "public");  // ← Bu yol yanlış!
```

Vercel'de `dist/public` dizini oluşturulur ama kod `server/_core/public` dizini arıyor.

**Çözüm:** `server/_core/app.ts` dosyasında production ortamında static dosyalar doğru şekilde sunuluyor.

---

## Yapılan Değişiklikler

### 1. Yeni Dosya: `api/index.ts`
```typescript
import "dotenv/config";
import { createApp } from "../server/_core/app";

let app: any = null;

async function getApp() {
  if (!app) {
    app = await createApp();
  }
  return app;
}

export default async (req: any, res: any) => {
  const app = await getApp();
  return app(req, res);
};
```

**Amaç:** Vercel'in serverless fonksiyonu olarak çalışan entry point.

---

### 2. Yeni Dosya: `server/_core/app.ts`
```typescript
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic } from "./vite";

export async function createApp() {
  const app = express();

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // In production (Vercel), we serve static files
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  }

  return app;
}
```

**Amaç:** Express uygulamasının kurulumunu ayrı bir fonksiyonda tutmak.

---

### 3. Güncellenmiş Dosya: `server/_core/index.ts`
```typescript
import "dotenv/config";
import { createServer } from "http";
import net from "net";
import { createApp } from "./app";
import { setupVite } from "./vite";

// ... port bulma fonksiyonları ...

async function startServer() {
  const app = await createApp();
  const server = createServer(app);

  // development mode uses Vite
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
```

**Amaç:** Sadece lokal geliştirme sunucusu başlatma.

---

### 4. Güncellenmiş Dosya: `vercel.json`
Kapsamlı Vercel konfigürasyonu eklendi (yukarıda detaylı olarak gösterilmiştir).

---

## Dağıtım Süreci

### Lokal Geliştirme
```bash
npm run dev
```
- `server/_core/index.ts` çalışır
- Vite middleware'i etkinleştirilir
- Port 3000'de dinler

### Vercel'e Dağıtım
1. `npm run build` komutu çalışır
   - Vite, `dist/public` dizinine React uygulamasını derler
   - esbuild, `dist/index.js` dosyasına sunucu kodunu derler

2. Vercel, `api/index.ts` dosyasını serverless fonksiyona dönüştürür

3. Statik dosyalar `dist/public` dizininden sunulur

4. API istekleri `/api` rota üzerinden serverless fonksiyona yönlendirilir

5. SPA fallback, tüm bilinmeyen rotaları `index.html` dosyasına yönlendirir

---

## Ek Iyileştirmeler

### Cache Kontrol
API endpoints için cache devre dışı bırakılmıştır:
```json
"headers": [
  {
    "source": "/api/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "no-cache, no-store, must-revalidate"
      }
    ]
  }
]
```

### Timeout Ayarı
Serverless fonksiyon için 60 saniye timeout ayarlanmıştır (Vercel Pro gerekli).

### Memory Ayarı
1024 MB memory ayrılmıştır (varsayılan 512 MB'den fazla).

---

## Test Etme

Dağıtımdan sonra aşağıdaki noktaları kontrol edin:

1. **Statik Dosyalar:** https://d-ticket.vercel.app/ yüklenebiliyor mu?
2. **API:** https://d-ticket.vercel.app/api/trpc/... çalışıyor mu?
3. **OAuth:** OAuth callback'leri düzgün çalışıyor mu?
4. **SPA Routing:** Tüm rotalar `index.html` üzerinden yükleniyor mu?

---

## Olası Kalan Sorunlar

Eğer hala sorunlar yaşanıyorsa:

1. **Vercel Logs:** Vercel dashboard'da deployment logs'u kontrol edin
2. **Build Output:** `dist` ve `dist/public` dizinlerinin doğru oluşturulduğunu doğrulayın
3. **Environment Variables:** Tüm gerekli environment variables'ların Vercel'de ayarlandığını kontrol edin
4. **Node Version:** Vercel'de Node.js 20.x kullanıldığını doğrulayın
