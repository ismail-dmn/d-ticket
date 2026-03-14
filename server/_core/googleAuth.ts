import { OAuth2Client } from "google-auth-library";
import { ENV } from "./env";

let googleClient: OAuth2Client | null = null;

export function getGoogleClient(): OAuth2Client {
  if (!googleClient) {
    if (!ENV.googleClientId || !ENV.googleClientSecret) {
      throw new Error(
        "Google OAuth credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables."
      );
    }

    googleClient = new OAuth2Client(
      ENV.googleClientId,
      ENV.googleClientSecret,
      `${process.env.NODE_ENV === "production" ? "https" : "http"}://${
        process.env.VERCEL_URL || "localhost:3000"
      }/api/oauth/google/callback`
    );
  }

  return googleClient;
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
    const client = getGoogleClient();
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
 * Get Google OAuth authorization URL
 */
export function getGoogleAuthUrl(redirectUri: string): string {
  const client = getGoogleClient();
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    redirect_uri: redirectUri,
    prompt: "consent",
  });

  return url;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  try {
    const client = getGoogleClient();
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      throw new Error("No ID token received");
    }

    return tokens.id_token;
  } catch (error) {
    console.error("[Google Auth] Code exchange failed:", error);
    throw new Error("Failed to exchange authorization code");
  }
}
