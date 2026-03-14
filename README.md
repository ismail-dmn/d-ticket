# D Bilişim IT Operasyon Sistemi

Müşteri ve Ticket Yönetimi, Teklif Oluşturma, Ödeme Takibi ve Şirket Sanal Kasası özelliklerini içeren kapsamlı bir IT operasyon yönetim sistemi.

## ✨ Özellikler

### 🔐 Kimlik Doğrulama
- **Google OAuth 2.0** ile güvenli giriş
- JWT tabanlı session yönetimi
- HttpOnly ve Secure cookies

### 👥 Müşteri Yönetimi
- Müşteri profili oluşturma ve düzenleme
- Abonelik yönetimi
- Ödeme takibi ve borç yönetimi

### 🎫 Ticket Sistemi
- Arıza ve teknik servis ticketleri
- Öncelik ve durum yönetimi
- Teknik notlar ve çözüm dokümantasyonu

### 📋 Teklif Yönetimi
- PDF teklif oluşturma
- Teklif durumu takibi
- KDV hesaplaması

### 💳 Ödeme Takibi
- Müşteri ödemeleri kaydı
- Borç hesaplaması
- Ödeme hatırlatmaları

### 🔐 Şirket Sanal Kasası
- Lisans yönetimi
- Mail hesapları
- Firewall IP adresleri
- Sistem kullanıcı hesapları
- Erişim logları

### 📊 Raporlama
- Aylık finansal raporlar
- Ticket istatistikleri
- Gelir analizi

## 🛠️ Teknoloji Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component library

### Backend
- **Express** - HTTP server
- **Node.js 20+** - Runtime
- **tRPC** - RPC framework
- **Drizzle ORM** - Database
- **MySQL** - Database
- **Google Auth Library** - OAuth

### Deployment
- **Vercel** - Hosting
- **GitHub** - Version control

## 📦 Kurulum

### Gereksinimler
- Node.js v20+
- pnpm v10+
- MySQL v8+
- Google OAuth credentials

### Hızlı Başlangıç

```bash
# 1. Bağımlılıkları yükleyin
pnpm install

# 2. Ortam değişkenlerini ayarlayın
cp .env.example .env.local
# .env.local'ı düzenleyin

# 3. Veritabanını hazırlayın
pnpm db:push

# 4. Geliştirme sunucusunu başlatın
pnpm dev
```

Tarayıcıda `http://localhost:3000` açın.

## 🚀 Production Dağıtımı

### GitHub'a Push Edin
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### Vercel'de Dağıtın
1. [Vercel Dashboard](https://vercel.com/dashboard) açın
2. GitHub repository'nizi seçin
3. Environment variables'ları ayarlayın
4. Deploy edin

Detaylı talimatlar için **DEPLOYMENT_GITHUB_VERCEL.md** dosyasını okuyun.

## 📚 Dokümantasyon

- **QUICK_START.md** - 5 dakikada başlangıç
- **GOOGLE_AUTH_SETUP.md** - Google OAuth kurulum rehberi
- **DEPLOYMENT_GITHUB_VERCEL.md** - GitHub ve Vercel dağıtımı
- **CHANGES_SUMMARY.md** - Yapılan tüm değişiklikler

## 🔧 Komutlar

```bash
# Geliştirme
pnpm dev              # Sunucuyu başlat (hot-reload)
pnpm build            # Production build oluştur
pnpm start            # Production sunucuyu çalıştır

# Veritabanı
pnpm db:push          # Migrations'ı çalıştır
pnpm db:generate      # Yeni migration oluştur

# Kod Kalitesi
pnpm check            # TypeScript type checking
pnpm format           # Kodu Prettier ile format et
pnpm test             # Testleri çalıştır
```

## 📁 Proje Yapısı

```
d-ticket/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── pages/              # Sayfa bileşenleri
│   │   ├── components/         # Yeniden kullanılabilir bileşenler
│   │   ├── _core/              # Core hooks
│   │   ├── lib/                # Utilities
│   │   ├── contexts/           # React contexts
│   │   └── App.tsx             # Ana uygulama
│   ├── index.html              # HTML template
│   └── public/                 # Static assets
├── server/                      # Express Backend
│   ├── _core/
│   │   ├── oauth.ts            # Google OAuth endpoint
│   │   ├── googleAuth.ts       # Google token doğrulama
│   │   ├── context.ts          # tRPC context
│   │   ├── app.ts              # Express app setup
│   │   ├── index.ts            # Server entry point
│   │   └── ...                 # Diğer core modules
│   ├── routers.ts              # tRPC routers
│   ├── db.ts                   # Database operations
│   └── ...                     # Diğer server modules
├── drizzle/                     # Database schema
│   └── schema.ts               # Tüm tablolar
├── shared/                      # Shared code
│   ├── const.ts                # Constants
│   ├── types.ts                # Shared types
│   └── _core/                  # Shared utilities
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
├── vercel.json                 # Vercel config
└── .env.example                # Environment template
```

## 🔐 Güvenlik

- **OAuth 2.0**: Google ile güvenli giriş
- **JWT**: Session token'ları imzalanır
- **HttpOnly Cookies**: XSS koruması
- **Secure Flag**: HTTPS-only cookies
- **SameSite**: CSRF koruması
- **Type Safety**: TypeScript ile compile-time güvenliği

## 🌍 Ortam Değişkenleri

### Gerekli
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `DATABASE_URL` - MySQL bağlantı URL'si
- `JWT_SECRET` - Session token secret (min 32 char)

### Opsiyonel
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `VERCEL_URL` - Vercel domain (auto-set)

## 🐛 Sorun Giderme

### "Invalid Client ID"
- `VITE_GOOGLE_CLIENT_ID` ortam değişkenini kontrol edin
- Google Cloud Console'da Client ID'yi doğrulayın

### "Redirect URI mismatch"
- Google Console'da kayıtlı URI'leri kontrol edin
- Protokol ve port numarasını doğrulayın

### "Database connection failed"
- `DATABASE_URL` doğru mu kontrol edin
- MySQL sunucusu çalışıyor mu kontrol edin

### "Build failed"
- `pnpm install` yeniden çalıştırın
- `pnpm check` ile TypeScript hatalarını kontrol edin

## 📞 Destek

Sorunlar veya sorular için:
1. Dokümantasyon dosyalarını kontrol edin
2. Browser console ve server logs'larını inceleyin
3. GitHub issues'ı kontrol edin

## 📄 Lisans

MIT License

---

**Son Güncelleme**: 2026-03-14  
**Versiyon**: 1.0.0  
**Google Auth**: Entegre ✅
