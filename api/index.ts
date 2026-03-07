import "dotenv/config";
import { createApp } from "../server/_core/app";

let app: any = null;

async function getApp() {
  if (!app) {
    app = await createApp();
  }
  return app;
}

export default async (req: any, res: any) => {
  const app = await getApp();
  return app(req, res);
};
