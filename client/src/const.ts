export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * getLoginUrl - Giriş sayfasına yönlendirme
 * Google Auth entegrasyonu ile sadece ana sayfaya yönlendir
 */
export const getLoginUrl = () => {
  return "/";
};
