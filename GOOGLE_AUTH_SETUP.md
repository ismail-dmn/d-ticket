# Google OAuth Kurulum Rehberi

Bu rehber, IT Operasyon Sistemi projesinde Google ile giriş özelliğini ayarlamak için adım adım talimatlar içerir.

## 1. Google Cloud Console'da Proje Oluşturma

### 1.1 Google Cloud Console'a Erişim
- [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
- Google hesabınızla oturum açın

### 1.2 Yeni Proje Oluşturma
1. Üst kısımda "Select a project" → "NEW PROJECT" tıklayın
2. Proje adı girin (örn: "D Bilişim IT Ops")
3. "CREATE" tıklayın

### 1.3 OAuth Consent Screen Yapılandırması
1. Sol menüde "APIs & Services" → "OAuth consent screen" tıklayın
2. User Type olarak "External" seçin
3. "CREATE" tıklayın
4. Aşağıdaki bilgileri doldurun:
   - **App name**: "D Bilişim IT Operasyon Sistemi"
   - **User support email**: Şirket e-posta adresiniz
   - **Developer contact information**: İletişim e-postanız
5. "SAVE AND CONTINUE" tıklayın
6. Scopes sayfasında "ADD OR REMOVE SCOPES" tıklayın
7. Aşağıdaki scopes'ları seçin:
   - `userinfo.email`
   - `userinfo.profile`
8. "UPDATE" → "SAVE AND CONTINUE" tıklayın
9. Test users sayfasında (opsiyonel) test kullanıcıları ekleyebilirsiniz
10. "SAVE AND CONTINUE" tıklayın

## 2. OAuth 2.0 Credentials Oluşturma

### 2.1 Credentials Oluşturma
1. Sol menüde "APIs & Services" → "Credentials" tıklayın
2. "CREATE CREDENTIALS" → "OAuth client ID" tıklayın
3. Application type olarak "Web application" seçin
4. Name girin (örn: "IT Ops Web App")

### 2.2 Authorized Redirect URIs Ekleme
"Authorized redirect URIs" bölümüne aşağıdaki URL'leri ekleyin:

**Geliştirme ortamı:**
```
http://localhost:3000/api/oauth/google
http://localhost:3000
```

**Vercel Production:**
```
https://your-domain.vercel.app/api/oauth/google
https://your-domain.vercel.app
```

(Vercel URL'sini daha sonra güncelleyebilirsiniz)

5. "CREATE" tıklayın

### 2.3 Client ID ve Secret'ı Kopyalama
1. Oluşturulan OAuth 2.0 Client ID'ye tıklayın
2. **Client ID** ve **Client Secret** değerlerini kopyalayın
3. Bunları güvenli bir yerde saklayın

## 3. Lokal Geliştirme Ortamı Kurulumu

### 3.1 Environment Variables Ayarlama
Proje kök dizininde `.env.local` dosyası oluşturun:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Database (mevcut setup'ınız)
DATABASE_URL=mysql://user:password@localhost:3306/database_name
JWT_SECRET=your-secret-key-min-32-characters-long

# Frontend
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 3.2 Bağımlılıkları Yükleme
```bash
pnpm install
```

### 3.3 Geliştirme Sunucusunu Başlatma
```bash
pnpm dev
```

Tarayıcıda `http://localhost:3000` adresine gidin ve Google butonu görünmelidir.

## 4. Vercel'de Dağıtım

### 4.1 GitHub'a Push Etme
```bash
git add .
git commit -m "Add Google OAuth integration"
git push origin main
```

### 4.2 Vercel'de Proje Bağlama
1. [Vercel Dashboard](https://vercel.com/dashboard) adresine gidin
2. "Add New..." → "Project" tıklayın
3. GitHub repository'nizi seçin
4. "Import" tıklayın

### 4.3 Environment Variables Ayarlama
Vercel proje ayarlarında:

1. "Settings" → "Environment Variables" tıklayın
2. Aşağıdaki değişkenleri ekleyin:

| Variable | Value |
|----------|-------|
| `GOOGLE_CLIENT_ID` | Google Cloud Console'dan Client ID |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console'dan Client Secret |
| `VITE_GOOGLE_CLIENT_ID` | Aynı Client ID |
| `DATABASE_URL` | Mevcut MySQL bağlantı URL'si |
| `JWT_SECRET` | Güvenli bir random string (min 32 karakter) |

3. "Save" tıklayın

### 4.4 Vercel Domain'ini Google Console'a Ekleme
1. Vercel'de dağıtım tamamlandıktan sonra domain'i kopyalayın (örn: `my-project.vercel.app`)
2. Google Cloud Console'a gidin
3. OAuth 2.0 Client ID'yi düzenleyin
4. "Authorized redirect URIs" bölümüne ekleyin:
   ```
   https://my-project.vercel.app/api/oauth/google
   https://my-project.vercel.app
   ```
5. "SAVE" tıklayın

## 5. Güvenlik En İyi Uygulamaları

### 5.1 Client Secret Yönetimi
- **Asla** Client Secret'ı frontend'e göstermeyin
- **Asla** Client Secret'ı version control'e commit etmeyin
- Vercel'in built-in secrets yönetimini kullanın

### 5.2 CORS ve Cookie Ayarları
- Proje zaten `SameSite=None` ve `Secure` cookie ayarlarını kullanıyor
- Production'da HTTPS zorunludur

### 5.3 Token Doğrulama
- Backend, Google ID token'ını `google-auth-library` kullanarak doğruluyor
- Token'ın geçerliliği ve imzası otomatik olarak kontrol ediliyor

## 6. Sorun Giderme

### "Invalid Client ID" Hatası
- Client ID'nin doğru olduğunu kontrol edin
- Frontend'de `VITE_GOOGLE_CLIENT_ID` ortam değişkenini kontrol edin

### "Redirect URI mismatch" Hatası
- Google Console'da kayıtlı olan redirect URI'lerin tam olarak eşleştiğini kontrol edin
- Protokol (http/https) ve port numarasını kontrol edin

### "Failed to verify Google token" Hatası
- Backend'in `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` ortam değişkenlerini aldığını kontrol edin
- Token'ın geçerli olduğunu kontrol edin (ID token'ı kullanıldığından emin olun)

### Database Bağlantı Hatası
- `DATABASE_URL` ortam değişkeninin doğru olduğunu kontrol edin
- MySQL sunucusunun çalıştığını kontrol edin

## 7. Kullanıcı Akışı

1. Kullanıcı "Google ile Giriş" butonuna tıklar
2. Google Sign-In popup açılır
3. Kullanıcı Google hesabıyla oturum açar
4. Frontend, Google ID token'ını `/api/oauth/google` endpoint'ine gönderir
5. Backend, token'ı doğrular ve user bilgisini database'e kaydeder
6. Session cookie oluşturulur ve kullanıcı authenticate edilir
7. Dashboard'a yönlendirilir

## 8. Ek Kaynaklar

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In for Web](https://developers.google.com/identity/sign-in/web)
- [google-auth-library-nodejs](https://github.com/googleapis/google-auth-library-nodejs)
