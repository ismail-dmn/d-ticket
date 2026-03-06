/**
 * D Bilişim Çözümleri - Kurumsal Tema Tanımları
 * Kurumsal Lacivert (#0D47A1) ana renk teması
 */

export const dbTheme = {
  colors: {
    primary: "#0D47A1", // Kurumsal lacivert
    primaryLight: "#1565C0",
    primaryDark: "#0A3A7F",
    secondary: "#1976D2",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
    overdue: "#D32F2F", // Kırmızı - Ödeme gecikmiş
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    md: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
    lg: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
  },
  typography: {
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

// Ticket Öncelik Renkleri
export const priorityColors = {
  "Düşük": "#4CAF50", // Yeşil
  "Orta": "#FF9800", // Turuncu
  "Yüksek": "#F44336", // Kırmızı
  "KRİTİK": "#C62828", // Koyu Kırmızı
};

// Ticket Durum Renkleri
export const statusColors = {
  "Açık": "#2196F3", // Mavi
  "Devam Ediyor": "#FF9800", // Turuncu
  "Tamamlandı": "#4CAF50", // Yeşil
};
