# Vercel Environment Variables Kurulum Rehberi

## ⚠️ Önemli

Vercel'de deployment yapmadan önce **mutlaka** bu environment variables'ları tanımlamanız gerekir. Aksi takdirde deployment başarısız olacaktır.

## 🔧 Vercel Dashboard'da Environment Variables Ekleme

### Adım 1: Vercel Dashboard'a Gidin

1. [Vercel Dashboard](https://vercel.com/dashboard) açın
2. Projenizi seçin (`d-ticket`)
3. "Settings" sekmesine tıklayın
4. Sol menüden "Environment Variables" seçin

### Adım 2: Tüm Değişkenleri Ekleyin

Aşağıdaki tabloyu izleyerek her bir değişkeni ekleyin:

| Variable Name | Value | Açıklama |
|---------------|-------|---------|
| `DATABASE_URL` | `mysql://user:password@host:3306/database` | MySQL bağlantı URL'si |
| `JWT_SECRET` | Güvenli random string (min 32 char) | Session token'ları imzalamak için |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Google Console'dan alınan Client ID |
| `GOOGLE_CLIENT_SECRET` | `goog_xxxxx...` | Google Console'dan alınan Secret |
| `VITE_GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Frontend için (aynı Client ID) |

### Adım 3: Her Değişkeni Eklemek İçin

1. "Add New" butonuna tıklayın
2. "Name" alanına değişken adını yazın (örn: `DATABASE_URL`)
3. "Value" alanına değeri yapıştırın
4. "Environment" seçin:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (isteğe bağlı)
5. "Save" tıklayın

### Adım 4: Deployment Tetikleyin

Environment variables'ları ekledikten sonra:

1. Vercel dashboard'da "Deployments" sekmesine gidin
2. En son deployment'ı bulun
3. "Redeploy" butonuna tıklayın
4. Logs'ları izleyin

---

## 🔐 Güvenli Değişken Değerleri Oluşturma

### JWT_SECRET Oluşturma

Terminal'de çalıştırın:

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Random]::new().GetBytes(32))
```

Çıktıyı kopyalayıp Vercel'e yapıştırın.

### DATABASE_URL Formatı

MySQL bağlantı URL'si şu formatta olmalıdır:

```
mysql://username:password@host:3306/database_name
```

Örnek:
```
mysql://root:mypassword@db.example.com:3306/d_bilisim
```

---

## 🌐 Google OAuth Kurulumu

### Google Cloud Console'da

1. [Google Cloud Console](https://console.cloud.google.com/) açın
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" → "Credentials" gidin
4. "Create Credentials" → "OAuth client ID" seçin
5. "Web application" seçin
6. "Authorized redirect URIs" bölümüne ekleyin:

```
https://your-vercel-domain.vercel.app/api/oauth/google
https://your-vercel-domain.vercel.app
http://localhost:3000
http://localhost:3000/api/oauth/google
```

7. "Create" tıklayın
8. Client ID ve Secret'ı kopyalayın

### Vercel'de Ayarlama

1. `GOOGLE_CLIENT_ID` → Client ID'yi yapıştırın
2. `GOOGLE_CLIENT_SECRET` → Secret'ı yapıştırın
3. `VITE_GOOGLE_CLIENT_ID` → Aynı Client ID'yi yapıştırın

---

## ✅ Kontrol Listesi

Deployment öncesi kontrol edin:

- [ ] `DATABASE_URL` tanımlandı ve doğru format
- [ ] `JWT_SECRET` tanımlandı (min 32 karakter)
- [ ] `GOOGLE_CLIENT_ID` tanımlandı
- [ ] `GOOGLE_CLIENT_SECRET` tanımlandı
- [ ] `VITE_GOOGLE_CLIENT_ID` tanımlandı
- [ ] Tüm değişkenler Production ortamı için seçildi
- [ ] Google Console'da redirect URI'ler güncellendi
- [ ] Deployment tetiklendi (Redeploy)

---

## 🚀 Deployment Sonrası

### Logs'ları İzleyin

1. Vercel dashboard'da "Deployments" sekmesine gidin
2. En son deployment'ı tıklayın
3. "Logs" sekmesini açın
4. Build ve runtime logs'larını izleyin

### Hataları Kontrol Edin

Eğer hata alırsanız:

1. **"Cannot find module"** → `pnpm install` başarısız olmuş, logs'ı kontrol edin
2. **"Database connection failed"** → `DATABASE_URL` yanlış
3. **"Invalid Client ID"** → `GOOGLE_CLIENT_ID` veya `VITE_GOOGLE_CLIENT_ID` yanlış
4. **"Redirect URI mismatch"** → Google Console'da URI'leri kontrol edin

### Uygulamayı Test Edin

Deployment başarılı olduktan sonra:

1. Vercel domain'ini tarayıcıda açın
2. "Google ile Giriş Yap" butonuna tıklayın
3. Google hesabınızla giriş yapın
4. Dashboard'a yönlendirildiğinizi kontrol edin

---

## 🔄 Değişkenleri Güncelleme

Eğer bir değişkeni güncellemek gerekirse:

1. Vercel Settings → Environment Variables
2. Değişkeni bulun ve "Edit" tıklayın
3. Yeni değeri yapıştırın
4. "Save" tıklayın
5. Deployment'ı redeploy edin

---

## 📝 Notlar

- Environment variables'lar Vercel'de şifrelenmiş olarak depolanır
- Production, Preview ve Development ortamları ayrı ayrı ayarlanabilir
- Değişkenleri değiştirdikten sonra deployment'ı redeploy etmeyi unutmayın
- Secret değerleri asla GitHub'a commit etmeyin (`.env` dosyası `.gitignore`'da olmalı)

---

## 🆘 Sorun Giderme

### "Build failed: Cannot find DATABASE_URL"
- Environment Variables bölümünde `DATABASE_URL` tanımlandı mı kontrol edin
- Değer boş mu kontrol edin

### "Google OAuth failed"
- `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` doğru mu kontrol edin
- Google Console'da redirect URI'leri kontrol edin

### "Deployment stuck"
- Vercel logs'larını kontrol edin
- Build timeout olmuş olabilir (30 saniye)

---

**Güncelleme Tarihi**: 2026-03-14  
**Versiyon**: 1.0.0
