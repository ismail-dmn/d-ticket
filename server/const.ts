export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Manus Portal yönlendirmesi tamamen kaldırıldı.
 * Sistem artık yerel Google Login üzerinden çalışmaktadır.
 */
export const getLoginUrl = () => {
  return "/"; 
};