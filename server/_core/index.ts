import "dotenv/config";
import { type Request, type Response } from "express"; // Tip güvenliği için ekle
import { createApp } from "./app";

// ─── Vercel Serverless Export ────────────────────────────────────────────────
let appInstance: any = null;

async function getApp() {
  if (!appInstance) {
    // createApp() fonksiyonunun içinde route kayıtlarının (OAuth vb.) 
    // doğru yapıldığından emin olun.
    appInstance = await createApp();
  }
  return appInstance;
}

// Vercel serverless handler
export default async function handler(req: Request, res: Response) {
  try {
    const app = await getApp();
    // Vercel'de Express instance'ı doğrudan çağrılabilir
    return app(req, res);
  } catch (error) {
    console.error("[Vercel Handler Error]:", error);
    res.status(500).json({ error: "Internal Server Error during initialization" });
  }
}

// ─── Local Development Server ─────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production" || process.env.LOCAL_SERVER === "true") {
  // Dinamik importlar local build hızını artırır ve Vercel paket boyutunu küçültür
  Promise.all([
    import("http"),
    import("net"),
    import("./vite")
  ]).then(async ([{ createServer }, net, { setupVite }]) => {
    
    function isPortAvailable(port: number): Promise<boolean> {
      return new Promise(resolve => {
        const server = net.createServer();
        server.listen(port, () => { server.close(() => resolve(true)); });
        server.on("error", () => resolve(false));
      });
    }

    const app = await getApp();
    const server = createServer(app);

    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    }

    const preferredPort = parseInt(process.env.PORT || "3000");
    // Port bulma mantığı local'de çakışmaları önler
    const port = await isPortAvailable(preferredPort) ? preferredPort : preferredPort + 1;

    server.listen(port, () => {
      console.log(`🚀 Local Server running on http://localhost:${port}/`);
    });
  });
}
