import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import express, { type Express, type Request, type Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { verifyGoogleToken } from "./googleAuth";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // Google OAuth endpoint - handles ID token from frontend
  app.post("/api/oauth/google", async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
      (res as any).status(400).json({ error: "token is required" });
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
      (res as any).cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      (res as any).json({
        success: true,
        user: {
          openId: userInfo.openId,
          name: userInfo.name,
          email: userInfo.email,
        },
      });
    } catch (error) {
      console.error("[Google OAuth] Authentication failed", error);
      (res as any).status(500).json({ error: "Google OAuth authentication failed" });
    }
  });

  // Legacy Manus OAuth callback (kept for backward compatibility)
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      (res as any).status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        (res as any).status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      (res as any).cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      (res as any).redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      (res as any).status(500).json({ error: "OAuth callback failed" });
    }
  });
}
