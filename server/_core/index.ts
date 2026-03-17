import "dotenv/config";
import { createApp } from "./app";

// ─── Vercel Serverless Export ────────────────────────────────────────────────
// Vercel bu export'u kullanır. Port dinlemez, her request için handler çağrılır.
let appInstance: Awaited<ReturnType<typeof createApp>> | null = null;

async function getApp() {
  if (!appInstance) {
    appInstance = await createApp();
  }
  return appInstance;
}

// Vercel serverless handler - default export zorunlu
export default async function handler(req: any, res: any) {
  const app = await getApp();
  return app(req, res);
}

// ─── Local Development Server ─────────────────────────────────────────────────
// Sadece local'de çalışır (NODE_ENV=development veya doğrudan node ile başlatılırsa)
if (process.env.NODE_ENV !== "production" || process.env.LOCAL_SERVER === "true") {
  import("http").then(async ({ createServer }) => {
    import("net").then(async (net) => {
      const { setupVite } = await import("./vite");

      function isPortAvailable(port: number): Promise<boolean> {
        return new Promise(resolve => {
          const server = net.createServer();
          server.listen(port, () => { server.close(() => resolve(true)); });
          server.on("error", () => resolve(false));
        });
      }

      async function findAvailablePort(startPort = 3000): Promise<number> {
        for (let port = startPort; port < startPort + 20; port++) {
          if (await isPortAvailable(port)) return port;
        }
        throw new Error(`No available port found starting from ${startPort}`);
      }

      const app = await getApp();
      const server = createServer(app);

      if (process.env.NODE_ENV === "development") {
        await setupVite(app, server);
      }

      const preferredPort = parseInt(process.env.PORT || "3000");
      const port = await findAvailablePort(preferredPort);

      if (port !== preferredPort) {
        console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
      }

      server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}/`);
      });
    });
  });
}
