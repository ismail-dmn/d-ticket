import { OAuth2Client } from "google-auth-library";
import { ENV } from "./env";

// Her request için yeni client oluşturmak yerine cache'le
// ama redirect URI dinamik olduğu için factory fonksiyon kullan
function createGoogleClient(redirectUri: string): OAuth2Client {
  if (!ENV.googleClientId || !ENV.googleClientSecret) {
    throw new Error(
      "Google OAuth credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables."
    );
  }

  return new OAuth2Client(
    ENV.googleClientId,
    ENV.googleClientSecret,
    redirectUri
  );
}

// Token doğrulama için singleton (redirect URI gerekmez)
let verifyClient: OAuth2Client | null = null;

function getVerifyClient(): OAuth2Client {
  if (!verifyClient) {
    if (!ENV.googleClientId || !ENV.googleClientSecret) {
      throw new Error(
        "Google OAuth credentials not configured."
      );
    }
    verifyClient = new OAuth2Client(ENV.googleClientId);
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

/**
 * Verify Google ID Token and extract user information
 */
export async function verifyGoogleToken(token: string): Promise<GoogleUserInfo> {
  try {
    const client = getVerifyClient();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: ENV.googleClientId,
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

/**
 * Get base URL - Vercel, production ve local ortamları destekler
 */
function getBaseUrl(req?: any): string {
  // Vercel otomatik VERCEL_URL sağlar
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Manuel olarak tanımlanmış production URL (önerilen)
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }

  // Request'ten URL çıkar (fallback)
  if (req) {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}

/**
 * Get Google OAuth authorization URL
 */
export function getGoogleAuthUrl(req?: any): string {
  const baseUrl = getBaseUrl(req);
  const redirectUri = `${baseUrl}/api/oauth/google/callback`;

  const client = createGoogleClient(redirectUri);
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  return client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    redirect_uri: redirectUri,
    prompt: "consent",
  });
}

/**
 * Exchange authorization code for tokens
 */
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
