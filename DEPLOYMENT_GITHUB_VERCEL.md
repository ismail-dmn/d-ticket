# GitHub ve Vercel Dağıtım Rehberi

Bu rehber, IT Operasyon Sistemi projesini GitHub'a yükleyip Vercel üzerinden yayınlamak için adım adım talimatlar içerir.

## 1. GitHub Repository Kurulumu

### 1.1 GitHub'da Yeni Repository Oluşturma
1. [GitHub](https://github.com) adresine gidin
2. Sağ üst köşede "+" → "New repository" tıklayın
3. Repository adı girin (örn: `d-bilisim-it-ops`)
4. Açıklama girin (opsiyonel)
5. "Public" veya "Private" seçin
6. "Create repository" tıklayın

### 1.2 Lokal Repository'i GitHub'a Bağlama
Proje dizininde terminal açın ve aşağıdaki komutları çalıştırın:

```bash
# Git repository'sini başlatın (eğer zaten başlatılmamışsa)
git init

# Tüm dosyaları staging area'ya ekleyin
git add .

# İlk commit'i yapın
git commit -m "Initial commit: Add Google OAuth integration"

# Remote repository'yi ekleyin (GITHUB_USERNAME ve REPO_NAME'i değiştirin)
git remote add origin https://github.com/GITHUB_USERNAME/REPO_NAME.git

# Main branch'ine push edin
git branch -M main
git push -u origin main
```

### 1.3 Sensitive Bilgileri Koruma
`.gitignore` dosyasında aşağıdakilerin olduğundan emin olun:

```
.env
.env.local
.env.*.local
node_modules/
dist/
.DS_Store
```

## 2. Vercel'de Dağıtım

### 2.1 Vercel Hesabı Oluşturma
1. [Vercel](https://vercel.com) adresine gidin
2. "Sign Up" tıklayın
3. GitHub hesabınızla oturum açın (önerilir)
4. Gerekli izinleri verin

### 2.2 Proje İçe Aktarma
1. Vercel Dashboard'da "Add New..." → "Project" tıklayın
2. "Import Git Repository" bölümünde GitHub repository'nizi arayın
3. Repository'yi seçin
4. "Import" tıklayın

### 2.3 Build ve Environment Ayarları
Vercel otomatik olarak `vercel.json` dosyasını okuyacak, ancak manuel olarak kontrol edin:

1. "Configure Project" sayfasında:
   - **Framework Preset**: Vite (otomatik algılanmalı)
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist/public`

2. "Environment Variables" bölümüne gidin
3. Aşağıdaki değişkenleri ekleyin:

| Key | Value | Scope |
|-----|-------|-------|
| `DATABASE_URL` | MySQL bağlantı URL'si | Production |
| `JWT_SECRET` | Güvenli random string | Production |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Production |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Production |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Production |

### 2.4 Dağıtım
1. "Deploy" tıklayın
2. Dağıtım tamamlanana kadar bekleyin
3. Dağıtım URL'sini kopyalayın (örn: `https://my-project.vercel.app`)

## 3. Vercel Özel Ayarları

### 3.1 Custom Domain Ekleme (Opsiyonel)
1. Vercel proje ayarlarında "Domains" tıklayın
2. Custom domain adınızı girin
3. DNS kayıtlarını güncelleyin (Vercel tarafından sağlanan talimatları izleyin)

### 3.2 Analytics ve Monitoring
1. "Analytics" sekmesinde proje performansını izleyin
2. "Deployments" sekmesinde dağıtım geçmişini görebilirsiniz

### 3.3 Automatic Deployments
- GitHub main branch'ine her push yapıldığında Vercel otomatik olarak yeniden dağıtacak
- "Settings" → "Git" bölümünde bu davranışı özelleştirebilirsiniz

## 4. Vercel'de Environment Variables Güvenliği

### 4.1 Sensitive Bilgileri Yönetme
- **Asla** `.env` dosyasını GitHub'a commit etmeyin
- Vercel'in built-in secrets yönetimini kullanın
- Production ve Preview ortamları için farklı secrets kullanabilirsiniz

### 4.2 Preview Deployments
- Pull Request açtığınızda Vercel otomatik olarak preview deployment oluşturur
- Preview ortamında da environment variables gerekirse ekleyin

## 5. Continuous Deployment Workflow

### 5.1 Geliştirme Akışı
```bash
# 1. Yeni feature branch oluşturun
git checkout -b feature/new-feature

# 2. Değişiklikleri yapın
# ... code changes ...

# 3. Değişiklikleri commit edin
git add .
git commit -m "Add new feature"

# 4. GitHub'a push edin
git push origin feature/new-feature

# 5. GitHub'da Pull Request oluşturun
# Vercel otomatik olarak preview deployment oluşturacak

# 6. PR onaylandıktan sonra merge edin
# Vercel otomatik olarak production'a dağıtacak
```

### 5.2 Rollback (Geri Alma)
Vercel'de hızlıca önceki versiyona dönebilirsiniz:

1. Vercel Dashboard → "Deployments"
2. Önceki deployment'ı bulun
3. "Redeploy" tıklayın

## 6. Monitoring ve Logging

### 6.1 Vercel Logs
1. Vercel Dashboard → "Functions"
2. Fonksiyon seçin
3. "Logs" sekmesinde gerçek zamanlı logları görebilirsiniz

### 6.2 Error Tracking
- Vercel otomatik olarak deployment hataları yakalar
- "Deployments" sekmesinde başarısız dağıtımları görebilirsiniz

## 7. Vercel'de Database Bağlantısı

### 7.1 MySQL Bağlantısı
- `DATABASE_URL` ortam değişkeni production'da ayarlandığından emin olun
- Vercel sunucularından MySQL'e erişim sağlandığından emin olun (firewall ayarları)

### 7.2 Connection Pooling
Vercel'de bağlantı pooling'i etkinleştirmek için:

```env
DATABASE_URL=mysql://user:password@host:3306/db?waitForConnections=true&connectionLimit=10&queueLimit=0
```

## 8. Sorun Giderme

### "Build failed" Hatası
1. Vercel logs'ları kontrol edin
2. `.env.example` dosyasındaki tüm ortam değişkenlerini Vercel'de ayarladığınızı kontrol edin
3. `pnpm install` ve `pnpm build` komutlarını lokal olarak çalıştırın

### "Deployment stuck" Hatası
- Vercel Dashboard'da "Deployments" → "Redeploy" tıklayın
- Veya GitHub'da yeni bir commit push edin

### "Database connection timeout"
- MySQL sunucusunun Vercel'in IP adreslerine erişim izni verdiğini kontrol edin
- `DATABASE_URL` bağlantı string'ini kontrol edin

## 9. Best Practices

### 9.1 Environment Variables
- Production ve development ortamları için farklı secrets kullanın
- Sensitive bilgileri asla code'a hardcode etmeyin
- Vercel'in "Sensitive" seçeneğini kullanın

### 9.2 Performance
- `pnpm` kullanarak daha hızlı build süresi elde edin
- Vercel Analytics'i kullanarak performance'ı izleyin
- Unnecessary dependencies'i kaldırın

### 9.3 Security
- HTTPS otomatik olarak etkinleştirilir
- CORS ayarlarını kontrol edin
- Regular security updates yapın

## 10. Ek Kaynaklar

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Deployments](https://vercel.com/docs/concepts/deployments/overview)
- [GitHub Actions with Vercel](https://vercel.com/docs/concepts/git/vercel-for-github)
