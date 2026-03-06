import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  companyLicenses,
  companyMailAccounts,
  companyFirewallIPs,
  companyUserAccounts,
  companyVaultNotes,
  companyVaultAccessLogs,
  InsertCompanyLicense,
  InsertCompanyMailAccount,
  InsertCompanyFirewallIP,
  InsertCompanyUserAccount,
  InsertCompanyVaultNote,
  InsertCompanyVaultAccessLog,
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Lisans Yönetimi
 */
export async function getLicensesByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companyLicenses).where(eq(companyLicenses.customerId, customerId));
}

export async function createLicense(data: InsertCompanyLicense) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(companyLicenses).values(data);
}

export async function updateLicense(id: number, data: Partial<InsertCompanyLicense>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(companyLicenses).set(data).where(eq(companyLicenses.id, id));
}

export async function deleteLicense(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(companyLicenses).where(eq(companyLicenses.id, id));
}

/**
 * Mail Hesapları
 */
export async function getMailAccountsByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companyMailAccounts).where(eq(companyMailAccounts.customerId, customerId));
}

export async function createMailAccount(data: InsertCompanyMailAccount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(companyMailAccounts).values(data);
}

export async function updateMailAccount(id: number, data: Partial<InsertCompanyMailAccount>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(companyMailAccounts).set(data).where(eq(companyMailAccounts.id, id));
}

export async function deleteMailAccount(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(companyMailAccounts).where(eq(companyMailAccounts.id, id));
}

/**
 * Güvenlik Duvarı IP Adresleri
 */
export async function getFirewallIPsByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companyFirewallIPs).where(eq(companyFirewallIPs.customerId, customerId));
}

export async function createFirewallIP(data: InsertCompanyFirewallIP) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(companyFirewallIPs).values(data);
}

export async function updateFirewallIP(id: number, data: Partial<InsertCompanyFirewallIP>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(companyFirewallIPs).set(data).where(eq(companyFirewallIPs.id, id));
}

export async function deleteFirewallIP(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(companyFirewallIPs).where(eq(companyFirewallIPs.id, id));
}

/**
 * Kullanıcı Hesapları
 */
export async function getUserAccountsByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companyUserAccounts).where(eq(companyUserAccounts.customerId, customerId));
}

export async function createUserAccount(data: InsertCompanyUserAccount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(companyUserAccounts).values(data);
}

export async function updateUserAccount(id: number, data: Partial<InsertCompanyUserAccount>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(companyUserAccounts).set(data).where(eq(companyUserAccounts.id, id));
}

export async function deleteUserAccount(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(companyUserAccounts).where(eq(companyUserAccounts.id, id));
}

/**
 * Önemli Notlar
 */
export async function getNotesByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companyVaultNotes).where(eq(companyVaultNotes.customerId, customerId));
}

export async function createNote(data: InsertCompanyVaultNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(companyVaultNotes).values(data);
}

export async function updateNote(id: number, data: Partial<InsertCompanyVaultNote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(companyVaultNotes).set(data).where(eq(companyVaultNotes.id, id));
}

export async function deleteNote(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(companyVaultNotes).where(eq(companyVaultNotes.id, id));
}

/**
 * Erişim Logları
 */
export async function getAccessLogsByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companyVaultAccessLogs).where(eq(companyVaultAccessLogs.customerId, customerId));
}

export async function logVaultAccess(data: InsertCompanyVaultAccessLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(companyVaultAccessLogs).values(data);
}
