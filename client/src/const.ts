export const getLoginUrl = ( ) => {
  // Varsayılan adresi https://manus.im olarak güncelleyin
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || "https://manus.im";
  const appId = import.meta.env.VITE_APP_ID || "sk-pI6B0UX-I32SDxbtfYIuXoGfMpW2asPXUiIC9eCqn_GscfPavQO1ynBppWVwPsLSriqV43-GBGnDcad0tCTe5XUN5PU1";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri );
  
  try {
    // Bu satır artık https://manus.im/app-auth sonucunu üretecektir
    const url = new URL(`${oauthPortalUrl}/app-auth` );
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");
    return url.toString();
  } catch (e) {
    console.error("Geçersiz OAuth URL yapılandırması:", e);
    return "/";
  }
};
