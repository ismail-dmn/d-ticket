import "dotenv/config";

let appInstance: any = null;

async function getApp() {
  if (!appInstance) {
    // Dynamic import - Vercel bu dosyayı bundle eder
    const mod = await import("../server/_core/app.js");
    appInstance = await mod.createApp();
  }
  return appInstance;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error: any) {
    console.error("[Handler Error]", error);
    res.status(500).end(JSON.stringify({ error: error.message }));
  }
}
