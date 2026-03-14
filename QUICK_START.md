# D Bilişim IT Operasyon Sistemi - Hızlı Başlangıç Rehberi

## 📋 Sistem Gereksinimleri

- **Node.js**: v20 veya üzeri
- **pnpm**: v10 veya üzeri
- **MySQL**: v8 veya üzeri
- **Google Account**: Google OAuth credentials için

## 🚀 5 Dakikada Başlangıç

### 1. Google OAuth Credentials Alın

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni proje oluşturun
3. "APIs & Services" → "Credentials" tıklayın
4. "Create Credentials" → "OAuth client ID" → "Web application" seçin
5. Authorized redirect URIs'e ekleyin:
   ```
   http://localhost:3000/api/oauth/google
   http://localhost:3000
   ```
6. **Client ID** ve **Client Secret**'ı kopyalayın

### 2. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Database
DATABASE_URL=mysql://user:password@localhost:3306/d_bilisim

# JWT Secret (en az 32 karakter)
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Frontend
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 3. Bağımlılıkları Yükleyin

```bash
pnpm install
```

### 4. Veritabanını Hazırlayın

```bash
pnpm db:push
```

### 5. Geliştirme Sunucusunu Başlatın

```bash
pnpm dev
```

Tarayıcıda `http://localhost:3000` açın ve **"Google ile Giriş"** butonunu göreceksiniz.

## 📦 Production Dağıtımı (Vercel)

### 1. GitHub'a Push Edin

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel'de Proje Oluşturun

1. [Vercel Dashboard](https://vercel.com/dashboard) açın
2. "Add New..." → "Project"
3. GitHub repository'nizi seçin
4. "Import" tıklayın

### 3. Environment Variables Ayarlayın

Vercel Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `GOOGLE_CLIENT_ID` | Google Console'dan |
| `GOOGLE_CLIENT_SECRET` | Google Console'dan |
| `VITE_GOOGLE_CLIENT_ID` | Google Console'dan |
| `DATABASE_URL` | MySQL bağlantı URL'si |
| `JWT_SECRET` | Güvenli random string |

### 4. Google Console'u Güncelleyin

Vercel domain'ini (örn: `my-app.vercel.app`) Google Console'a ekleyin:

```
https://my-app.vercel.app/api/oauth/google
https://my-app.vercel.app
```

## 🔑 Komutlar Özeti

```bash
# Geliştirme
pnpm dev              # Sunucuyu başlat
pnpm build            # Production build
pnpm start            # Production sunucuyu çalıştır

# Veritabanı
pnpm db:push          # Migrations'ı çalıştır
pnpm db:generate      # Yeni migration oluştur

# Kod Kalitesi
pnpm check            # TypeScript kontrol
pnpm format           # Kodu format et
pnpm test             # Testleri çalıştır
```

## 🔐 Güvenlik Kontrol Listesi

- [ ] `.env.local` dosyası `.gitignore`'da var
- [ ] `GOOGLE_CLIENT_SECRET` asla code'a commit edilmedi
- [ ] `JWT_SECRET` minimum 32 karakter
- [ ] Production'da HTTPS kullanılıyor
- [ ] Database URL'si güvenli ve şifreli

## 📁 Proje Yapısı

```
d-ticket/
├── client/                 # React Frontend
│   └── src/
│       ├── pages/         # Sayfa bileşenleri
│       ├── components/    # Yeniden kullanılabilir bileşenler
│       └── _core/         # Core hooks ve utilities
├── server/                # Express Backend
│   ├── _core/            # Core server logic
│   │   ├── oauth.ts      # Google OAuth endpoint
│   │   ├── googleAuth.ts # Google token doğrulama
│   │   └── context.ts    # tRPC context
│   ├── routers.ts        # tRPC routers
│   └── db.ts             # Database operations
├── drizzle/              # Database schema
├── shared/               # Shared types ve constants
├── package.json          # Dependencies
└── .env.example          # Environment template
```

## 🐛 Sık Sorulan Sorunlar

### "Invalid Client ID" Hatası
- `VITE_GOOGLE_CLIENT_ID` ortam değişkenini kontrol edin
- Frontend'de Google script yüklü mü kontrol edin

### "Redirect URI mismatch"
- Google Console'da kayıtlı URI'leri kontrol edin
- Protokol (http/https) ve port numarasını kontrol edin

### "Database connection failed"
- `DATABASE_URL` doğru mu kontrol edin
- MySQL sunucusu çalışıyor mu kontrol edin

### "JWT_SECRET is empty"
- `.env.local` dosyasında `JWT_SECRET` ayarlandı mı kontrol edin
- En az 32 karakter olmalı

## 📚 Daha Fazla Bilgi

- **GOOGLE_AUTH_SETUP.md** - Detaylı Google OAuth kurulum
- **DEPLOYMENT_GITHUB_VERCEL.md** - Vercel dağıtım rehberi
- **CHANGES_SUMMARY.md** - Yapılan tüm değişiklikler

## 💡 İpuçları

1. **Development'ta hızlı test**: `pnpm dev` ile Vite hot-reload kullanın
2. **Database değişiklikleri**: `pnpm db:push` her zaman çalıştırın
3. **Production build test**: `pnpm build && pnpm start` ile test edin
4. **Logs kontrol**: Browser console (frontend) ve terminal (backend) loglarını izleyin

## 🎯 Sonraki Adımlar

1. Dashboard sayfalarını özelleştirin
2. Müşteri yönetimi özelliklerini tamamlayın
3. Ticket sistemi workflow'unu ayarlayın
4. Raporlama özelliklerini ekleyin
5. Email/SMS notifikasyonları entegre edin

---

**Sorular veya sorunlar?** Dokümantasyon dosyalarını kontrol edin veya logs'ları inceleyin.
