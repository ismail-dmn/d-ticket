import { type Request, type Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { sdk } from "./sdk";
import { getSessionCookieOptions } from "./cookies";

const LOCAL_USER = {
  openId: "local_admin",
  name: "Admin",
  email: "admin@local.dev",
};

export function registerOAuthRoutes(app: any) {
  // Local login — şifre gerekmez
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const sessionToken = await sdk.createSessionToken(LOCAL_USER.openId, {
        name: LOCAL_USER.name,
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: LOCAL_USER });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  });
}
