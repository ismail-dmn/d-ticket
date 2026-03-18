import "dotenv/config";

let app: any = null;

async function getApp() {
  if (!app) {
    // Dinamik import - build edilmiş server'ı yükle
    const { createApp } = await import("../server/_core/app.js");
    app = await createApp();
  }
  return app;
}

export default async function handler(req: any, res: any) {
  try {
    const application = await getApp();
    return application(req, res);
  } catch (error) {
    console.error("[Vercel Handler] Failed:", error);
    res.status(500).json({ error: "Server initialization failed" });
  }
}
