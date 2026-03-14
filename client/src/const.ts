/**
 * @file const.ts
 * D Bilişim Çözümleri - IT Operasyon Sistemi Sabitleri
 */

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * getLoginUrl - Giriş ekranına yönlendirme
 * Manus Portal (OAuth) tamamen iptal edilmiştir.
 * Uygulama artık Google Identity Services (GIS) kullanmaktadır.
 * Yetkisiz erişimlerde kullanıcıyı ana sayfadaki Google Login ekranına gönderir.
 */
export const getLoginUrl = () => {
  return "/";
};