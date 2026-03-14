<<<<<<< HEAD
export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || "https://manus.im/auth";
  const appId = import.meta.env.VITE_APP_ID || "";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
=======
export const getLoginUrl = ( ) => {
  // Varsayılan adresi https://manus.im olarak güncelleyin
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || "https://manus.im";
  const appId = import.meta.env.VITE_APP_ID || "sk-pI6B0UX-I32SDxbtfYIuXoGfMpW2asPXUiIC9eCqn_GscfPavQO1ynBppWVwPsLSriqV43-GBGnDcad0tCTe5XUN5PU1";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri );
  
  try {
    // Bu satır artık https://manus.im/app-auth sonucunu üretecektir
    const url = new URL(`${oauthPortalUrl}/app-auth` );
>>>>>>> 98ef1746999af5796e6e62bc9305d114f294bae5
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");
<<<<<<< HEAD

    return url.toString();
  } catch (e) {
    console.error("Invalid OAuth URL configuration:", e);
=======
    return url.toString();
  } catch (e) {
    console.error("Geçersiz OAuth URL yapılandırması:", e);
>>>>>>> 98ef1746999af5796e6e62bc9305d114f294bae5
    return "/";
  }
};
