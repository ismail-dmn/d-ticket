import { OAuth2Client } from "google-auth-library";

// ENV dosyasından veya doğrudan process.env'den güvenli okuma yapalım
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

function createGoogleClient(redirectUri: string): OAuth2Client {
  // KRİTİK: Eğer ID veya Secret yoksa sessizce hata vermek yerine terminale bas
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("❌ ERROR: Google OAuth Credentials are NOT SET in Environment Variables!");
    throw new Error("Google OAuth credentials not configured.");
  }

  return new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

let verifyClient: OAuth2Client | null = null;

function getVerifyClient(): OAuth2Client {
  if (!verifyClient) {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error("Google OAuth client ID not configured.");
    }
    verifyClient = new OAuth2Client(GOOGLE_CLIENT_ID);
  }
  return verifyClient;
}

export interface GoogleUserInfo {
  openId: string;
  email: string;
  name: string;
  picture?: string;
  platform: "google";
}

export async function verifyGoogleToken(token: string): Promise<GoogleUserInfo> {
  try {
    const client = getVerifyClient();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
      throw new Error("Invalid token payload");
    }

    return {
      openId: `google_${payload.sub}`,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      picture: payload.picture,
      platform: "google",
    };
  } catch (error) {
    console.error("[Google Auth] Token verification failed:", error);
    throw new Error("Failed to verify Google token");
  }
}

function getBaseUrl(req?: any): string {
  // Vercel'de protokol her zaman https olmalıdır
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }

  if (req) {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}

export function getGoogleAuthUrl(req?: any): string {
  const baseUrl = getBaseUrl(req);
  const redirectUri = `${baseUrl}/api/oauth/google/callback`;

  const client = createGoogleClient(redirectUri);
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  // Parametreleri açıkça kontrol ederek gönderiyoruz
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    redirect_uri: redirectUri,
    prompt: "consent",
  });

  console.log("🔗 Generated Auth URL:", url); // Debug için URL'yi logla (client_id içeriyor mu bak)
  return url;
}

export async function exchangeCodeForToken(code: string, req?: any): Promise<string> {
  try {
    const baseUrl = getBaseUrl(req);
    const redirectUri = `${baseUrl}/api/oauth/google/callback`;
    const client = createGoogleClient(redirectUri);

    const { tokens } = await client.getToken({
      code,
      redirect_uri: redirectUri,
    });

    if (!tokens.id_token) {
      throw new Error("No ID token received");
    }

    return tokens.id_token;
  } catch (error) {
    console.error("[Google Auth] Code exchange failed:", error);
    throw new Error("Failed to exchange authorization code");
  }
}
