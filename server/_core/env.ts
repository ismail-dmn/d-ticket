export const ENV = {
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  databaseUrl: process.env.DATABASE_URL || "",
<<<<<<< HEAD
  appUrl: process.env.APP_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
};
=======
  appUrl: process.env.APP_URL || (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  cookieSecret: process.env.COOKIE_SECRET || "cookie-secret-change-in-production",
  appId: process.env.APP_ID || "d-ticket",
};
>>>>>>> a6d4cc0eafa6ba3f2ae3fdc96f4f2d1a06053991
