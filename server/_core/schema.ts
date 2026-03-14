import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Şirket Profili Sanal Kasası - Lisans Yönetimi
 */
export const companyLicenses = mysqlTable("company_licenses", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  licenseType: varchar("license_type", { length: 100 }).notNull(), // Windows, Office, Server, Antivirüs vb.
  licenseKey: text("license_key").notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  version: varchar("version", { length: 50 }),
  expiryDate: timestamp("expiry_date"),
  assignedTo: varchar("assigned_to", { length: 255 }),
  notlar: text("notlar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompanyLicense = typeof companyLicenses.$inferSelect;
export type InsertCompanyLicense = typeof companyLicenses.$inferInsert;

/**
 * Şirket Profili Sanal Kasası - Mail Hesapları
 */
export const companyMailAccounts = mysqlTable("company_mail_accounts", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  emailAddress: varchar("email_address", { length: 255 }).notNull(),
  password: text("password").notNull(),
  mailServer: varchar("mail_server", { length: 255 }),
  imapPort: int("imap_port"),
  smtpPort: int("smtp_port"),
  assignedTo: varchar("assigned_to", { length: 255 }),
  notlar: text("notlar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompanyMailAccount = typeof companyMailAccounts.$inferSelect;
export type InsertCompanyMailAccount = typeof companyMailAccounts.$inferInsert;

/**
 * Şirket Profili Sanal Kasası - Güvenlik Duvarı IP Adresleri
 */
export const companyFirewallIPs = mysqlTable("company_firewall_ips", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  description: varchar("description", { length: 255 }),
  purpose: varchar("purpose", { length: 100 }), // VPN, Remote Access, Backup vb.
  isActive: int("is_active").default(1),
  notlar: text("notlar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompanyFirewallIP = typeof companyFirewallIPs.$inferSelect;
export type InsertCompanyFirewallIP = typeof companyFirewallIPs.$inferInsert;

/**
 * Şirket Profili Sanal Kasası - Kullanıcı Hesapları
 */
export const companyUserAccounts = mysqlTable("company_user_accounts", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: text("password").notNull(),
  systemName: varchar("system_name", { length: 255 }), // Windows, Linux, Server vb.
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 100 }), // Admin, User, Guest vb.
  isActive: int("is_active").default(1),
  lastLogin: timestamp("last_login"),
  notlar: text("notlar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompanyUserAccount = typeof companyUserAccounts.$inferSelect;
export type InsertCompanyUserAccount = typeof companyUserAccounts.$inferInsert;

/**
 * Şirket Profili Sanal Kasası - Önemli Notlar ve Dökümanlar
 */
export const companyVaultNotes = mysqlTable("company_vault_notes", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }), // Teknik, Yönetim, Güvenlik vb.
  priority: mysqlEnum("priority", ["Düşük", "Orta", "Yüksek", "KRİTİK"]).default("Orta"),
  isConfidential: int("is_confidential").default(1),
  createdBy: int("created_by"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompanyVaultNote = typeof companyVaultNotes.$inferSelect;
export type InsertCompanyVaultNote = typeof companyVaultNotes.$inferInsert;

/**
 * Şirket Profili Sanal Kasası - Erişim Logları
 */
export const companyVaultAccessLogs = mysqlTable("company_vault_access_logs", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  userId: int("user_id").notNull(),
  vaultItemType: varchar("vault_item_type", { length: 100 }), // License, Mail, Firewall, User, Note
  vaultItemId: int("vault_item_id"),
  action: varchar("action", { length: 50 }), // view, edit, delete, export
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CompanyVaultAccessLog = typeof companyVaultAccessLogs.$inferSelect;
export type InsertCompanyVaultAccessLog = typeof companyVaultAccessLogs.$inferInsert;

/**
 * D Bilişim müşteri ve abonelik bilgileri
 */
export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  firmAdi: varchar("firm_adi", { length: 255 }).notNull(),
  isAbonelik: mysqlEnum("is_abonelik", ["true", "false"]).default("false").notNull(),
  aylikUcret: decimal("aylik_ucret", { precision: 10, scale: 2 }).default("0"),
  odemeGunu: int("odeme_gunu").default(5).notNull(),
  kalanBorc: decimal("kalan_borc", { precision: 10, scale: 2 }).default("0"),
  iletisimKisi: varchar("iletisim_kisi", { length: 255 }),
  telefon: varchar("telefon", { length: 20 }),
  email: varchar("email", { length: 320 }),
  notlar: text("notlar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

/**
 * IT Ticket tablosu - Arıza ve teknik servis kayıtları
 */
export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  ticketNo: varchar("ticket_no", { length: 50 }).notNull().unique(),
  customerId: int("customer_id").notNull(),
  baslik: varchar("baslik", { length: 255 }).notNull(),
  aciklama: text("aciklama"),
  oncelik: mysqlEnum("oncelik", ["Düşük", "Orta", "Yüksek", "KRİTİK"]).default("Orta").notNull(),
  durum: mysqlEnum("durum", ["Açık", "Devam Ediyor", "Tamamlandı"]).default("Açık").notNull(),
  teknikNotlar: text("teknik_notlar"),
  sifreler: text("sifreler"),
  cozumNotlari: text("cozum_notlari"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  tamamlandigiTarih: timestamp("tamamlandigi_tarih"),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

/**
 * Teklif tablosu - PDF teklif şablonları ve kayıtları
 */
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  proposalNo: varchar("proposal_no", { length: 50 }).notNull().unique(),
  customerId: int("customer_id").notNull(),
  baslik: varchar("baslik", { length: 255 }).notNull(),
  aciklama: text("aciklama"),
  tutarKdvHaric: decimal("tutar_kdv_haric", { precision: 12, scale: 2 }).notNull(),
  kdvOrani: decimal("kdv_orani", { precision: 5, scale: 2 }).default("18"),
  tutarKdvDahil: decimal("tutar_kdv_dahil", { precision: 12, scale: 2 }).notNull(),
  gecerlilikGunu: int("gecerlilik_gunu").default(3).notNull(),
  durum: mysqlEnum("durum", ["Taslak", "Gönderildi", "Kabul Edildi", "Reddedildi"]).default("Taslak").notNull(),
  pdfUrl: varchar("pdf_url", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  gecerlilikBitisiTarihi: timestamp("gecerlilik_bitisi_tarihi"),
});

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;

/**
 * Ödeme Takibi tablosu - Müşteri ödemelerinin kaydı
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  tutarı: decimal("tutarı", { precision: 10, scale: 2 }).notNull(),
  odemeTarihi: timestamp("odeme_tarihi").defaultNow().notNull(),
  odemeYontemi: varchar("odeme_yontemi", { length: 50 }),
  notlar: text("notlar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * İş Emri Sistemi
 */
export const workOrders = mysqlTable("work_orders", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticket_id").notNull(),
  customerId: int("customer_id").notNull(),
  workOrderNo: varchar("work_order_no", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  estimatedHours: decimal("estimated_hours", { precision: 5, scale: 2 }),
  actualHours: decimal("actual_hours", { precision: 5, scale: 2 }),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  status: mysqlEnum("status", ["Planlandı", "Devam Ediyor", "Tamamlandı", "İptal Edildi"]).default("Planlandı"),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WorkOrder = typeof workOrders.$inferSelect;
export type InsertWorkOrder = typeof workOrders.$inferInsert;

/**
 * Aylık Raporlar
 */
export const monthlyReports = mysqlTable("monthly_reports", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  year: int("year").notNull(),
  month: int("month").notNull(),
  totalTickets: int("total_tickets").default(0),
  completedTickets: int("completed_tickets").default(0),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0"),
  serviceRevenue: decimal("service_revenue", { precision: 12, scale: 2 }).default("0"),
  softwareRevenue: decimal("software_revenue", { precision: 12, scale: 2 }).default("0"),
  totalExpenses: decimal("total_expenses", { precision: 12, scale: 2 }).default("0"),
  netProfit: decimal("net_profit", { precision: 12, scale: 2 }).default("0"),
  reportUrl: varchar("report_url", { length: 500 }),
  generatedAt: timestamp("generated_at").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MonthlyReport = typeof monthlyReports.$inferSelect;
export type InsertMonthlyReport = typeof monthlyReports.$inferInsert;

/**
 * Yıllık Raporlar
 */
export const yearlyReports = mysqlTable("yearly_reports", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  year: int("year").notNull(),
  totalTickets: int("total_tickets").default(0),
  completedTickets: int("completed_tickets").default(0),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0"),
  serviceRevenue: decimal("service_revenue", { precision: 12, scale: 2 }).default("0"),
  softwareRevenue: decimal("software_revenue", { precision: 12, scale: 2 }).default("0"),
  totalExpenses: decimal("total_expenses", { precision: 12, scale: 2 }).default("0"),
  netProfit: decimal("net_profit", { precision: 12, scale: 2 }).default("0"),
  reportUrl: varchar("report_url", { length: 500 }),
  generatedAt: timestamp("generated_at").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type YearlyReport = typeof yearlyReports.$inferSelect;
export type InsertYearlyReport = typeof yearlyReports.$inferInsert;

/**
 * Müşteri Bakım Takvimi
 */
export const maintenanceSchedules = mysqlTable("maintenance_schedules", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  scheduledDate: timestamp("scheduled_date").notNull(),
  reminderDate: timestamp("reminder_date"),
  status: mysqlEnum("status", ["Planlandı", "Hatırlatıldı", "Tamamlandı", "İptal Edildi"]).default("Planlandı"),
  notificationSent: int("notification_sent").default(0),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MaintenanceSchedule = typeof maintenanceSchedules.$inferSelect;
export type InsertMaintenanceSchedule = typeof maintenanceSchedules.$inferInsert;
