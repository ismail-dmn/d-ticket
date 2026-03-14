import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import express, { type Express, type Request, type Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { verifyGoogleToken } from "./googleAuth";

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
}
