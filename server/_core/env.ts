export const ENV = {
  appId: process.env.VITE_APP_ID ?? "google-auth",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
};

// Validate required environment variables
if (!ENV.cookieSecret && ENV.isProduction) {
  console.warn("[ENV] JWT_SECRET is not configured in production");
}
if (!ENV.googleClientId) {
  console.warn("[ENV] GOOGLE_CLIENT_ID is not configured");
}
if (!ENV.googleClientSecret && ENV.isProduction) {
  console.warn("[ENV] GOOGLE_CLIENT_SECRET is not configured in production");
}
