// @shared/const üzerinden gelen sabitleri koruyun
export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * NOT: Manus portalı (OAuth) devre dışı bırakılmıştır.
 * Artık Google Identity Services üzerinden giriş yapılmaktadır.
 * Bu fonksiyon sadece ana sayfaya güvenli dönüş için korunmuştur.
 */
export const getLoginUrl = () => {
  return "/"; 
};