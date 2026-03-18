import { type Request, type Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import * as db from "../db";
import { sdk } from "./sdk";
import { getSessionCookieOptions } from "./cookies";
import {
  getGoogleAuthUrl,
  exchangeCodeForToken,
  verifyGoogleToken,
} from "./googleAuth";

export function registerOAuthRoutes(app: any) {
  // ─── 1. Google OAuth başlat ───────────────────────────────────────────────
  app.get("/api/oauth/google/login", (req: Request, res: Response) => {
    try {
      const authUrl = getGoogleAuthUrl(req);
      res.redirect(authUrl);
    } catch (error) {
      console.error("[Google OAuth] Failed to generate auth URL", error);
      res.status(500).json({ error: "Failed to initiate Google OAuth" });
    }
  });

  // ─── 2. Google callback ───────────────────────────────────────────────────
  app.get("/api/oauth/google/callback", async (req: Request, res: Response) => {
    const { code, error: oauthError } = req.query;

    if (oauthError) {
      console.error("[Google OAuth] OAuth error:", oauthError);
      return res.redirect("/?error=oauth_denied");
    }

    if (!code || typeof code !== "string") {
      return res.redirect("/?error=missing_code");
    }

    try {
      const idToken = await exchangeCodeForToken(code, req);
      const userInfo = await verifyGoogleToken(idToken);

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.platform,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.redirect("/dashboard");
    } catch (error) {
      console.error("[Google OAuth] Callback failed", error);
      res.redirect("/?error=auth_failed");
    }
  });

  // ─── 3. Frontend popup flow ───────────────────────────────────────────────
  app.post("/api/oauth/google", async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: "token is required" });
      return;
    }

    try {
      const userInfo = await verifyGoogleToken(token);

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.platform,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.json({
        success: true,
        user: {
          openId: userInfo.openId,
          name: userInfo.name,
          email: userInfo.email,
        },
      });
    } catch (error) {
      console.error("[Google OAuth] Authentication failed", error);
      res.status(500).json({ error: "Google OAuth authentication failed" });
    }
  });

  // ─── 4. Logout ────────────────────────────────────────────────────────────
  app.post("/api/auth/logout", (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  });
}
