import { eq, and, gt, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, customers, tickets, proposals, payments, Customer, Ticket, Proposal, Payment } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Müşteri sorguları
export async function getCustomers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(customers).orderBy(desc(customers.createdAt));
}

export async function getCustomerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customers).values(data as any);
  return result;
}

export async function updateCustomer(id: number, data: Partial<Customer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(customers).set(data).where(eq(customers.id, id));
}

// Ticket sorguları
export async function getTickets() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
}

export async function getTicketsByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tickets).where(eq(tickets.customerId, customerId)).orderBy(desc(tickets.createdAt));
}

export async function getTicketById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTicket(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(tickets).values(data as any);
}

export async function updateTicket(id: number, data: Partial<Ticket>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(tickets).set(data).where(eq(tickets.id, id));
}

// Teklif sorguları
export async function getProposals() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(proposals).orderBy(desc(proposals.createdAt));
}

export async function getProposalsByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(proposals).where(eq(proposals.customerId, customerId)).orderBy(desc(proposals.createdAt));
}

export async function getProposalById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProposal(data: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(proposals).values(data as any);
}

export async function updateProposal(id: number, data: Partial<Proposal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(proposals).set(data).where(eq(proposals.id, id));
}

// Ödeme sorguları
export async function getPayments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(payments).orderBy(desc(payments.createdAt));
}

export async function getPaymentsByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(payments).where(eq(payments.customerId, customerId)).orderBy(desc(payments.createdAt));
}

export async function createPayment(data: Omit<Payment, 'id' | 'createdAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(payments).values(data as any);
}

// Finansal takip sorguları
export async function getOverdueCustomers() {
  const db = await getDb();
  if (!db) return [];
  const today = new Date();
  const dayOfMonth = today.getDate();
  
  // Ayın 5'inden sonra ve borç varsa
  const overdueCustomers = await db
    .select()
    .from(customers)
    .where(eq(customers.isAbonelik, "true"));
  
  return overdueCustomers.filter(c => {
    const borc = parseFloat(c.kalanBorc as any) || 0;
    return dayOfMonth > (c.odemeGunu || 5) && borc > 0;
  });
}
