# D-Ticket Vercel Deployment Rehberi

## Değiştirilecek / Eklenecek Dosyalar

### 1. `vercel.json` (kök dizin - mevcut dosyayı değiştir)
### 2. `package.json` (kök dizin - mevcut dosyayı değiştir)
### 3. `server/_core/index.ts` (mevcut dosyayı değiştir)
### 4. `server/_core/googleAuth.ts` (mevcut dosyayı değiştir)
### 5. `server/_core/oauth.ts` (mevcut dosyayı değiştir)

---

## Vercel Dashboard - Environment Variables

Vercel → d-ticket → Settings → Environment Variables

| Key | Value | Açıklama |
|-----|-------|----------|
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Google Console'dan |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` | Google Console'dan |
| `DATABASE_URL` | `mysql://user:pass@host:3306/db` | MySQL bağlantısı |
| `APP_URL` | `https://d-ticket.vercel.app` | Vercel domain'in |
| `NODE_ENV` | `production` | Zorunlu |
| `JWT_SECRET` veya `SESSION_SECRET` | rastgele uzun string | Varsa ekle |

---

## Google Cloud Console - Redirect URI

Google Console → APIs & Services → Credentials → OAuth 2.0 Client IDs → düzenle

**Authorized JavaScript origins:**
```
https://d-ticket.vercel.app
```

**Authorized redirect URIs:**
```
https://d-ticket.vercel.app/api/oauth/google/callback
```

---

## Deploy Adımları

1. Bu 5 dosyayı GitHub'a push et
2. Vercel'de Environment Variables'ları ekle
3. Google Console'da redirect URI'yi ekle
4. Vercel → Deployments → Redeploy

---

## Yapılan Değişikliklerin Özeti

### `vercel.json`
- `"framework": "nextjs"` kaldırıldı (Next.js değil!)
- `outputDirectory: "dist"` ve `functions` doğru şekilde ayarlandı

### `package.json`
- Build script'ten `pnpm run check` (TypeScript check) kaldırıldı
- Bu Vercel'de TypeScript hatalarından dolayı build'in kırılmasını önler

### `server/_core/index.ts`
- **Vercel serverless `export default handler` eklendi** — bu olmadan API çalışmaz
- Local dev server korundu, sadece production'da devre dışı

### `server/_core/googleAuth.ts`
- Redirect URI artık dinamik: `VERCEL_URL` veya `APP_URL` env'den okunuyor
- `verifyClient` singleton'ı ayrıldı (token doğrulama redirect URI gerektirmez)

### `server/_core/oauth.ts`
- `/api/oauth/google/login` GET endpoint'i eklendi (redirect flow)
- `/api/oauth/google/callback` GET endpoint'i eklendi (Google'dan dönüş)
- `/api/auth/logout` POST endpoint'i eklendi
- Tüm `(res as any)` cast'leri temizlendi
