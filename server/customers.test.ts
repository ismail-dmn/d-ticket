import { describe, expect, it, beforeEach } from "vitest";
import * as db from "./db";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Customers Router", () => {
  describe("customers.list", () => {
    it("should return list of customers", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.customers.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("customers.create", () => {
    it("should create a new customer", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.customers.create({
        firmAdi: "Test Firma",
        isAbonelik: "false",
        aylikUcret: "0",
        odemeGunu: 5,
        kalanBorc: "0",
      });

      expect(result).toBeDefined();
    });

    it("should create a subscription customer", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.customers.create({
        firmAdi: "Abone Firma",
        isAbonelik: "true",
        aylikUcret: "5000",
        odemeGunu: 5,
        kalanBorc: "0",
        iletisimKisi: "Ahmet Yılmaz",
        telefon: "+90 555 123 4567",
        email: "ahmet@firma.com",
      });

      expect(result).toBeDefined();
    });
  });

  describe("customers.getOverdue", () => {
    it("should return overdue customers", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.customers.getOverdue();

      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe("Tickets Router", () => {
  describe("tickets.list", () => {
    it("should return list of tickets", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tickets.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("tickets.create", () => {
    it("should create a new ticket with valid priority", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tickets.create({
        ticketNo: `TKT-001-${Date.now()}`,
        customerId: 1,
        baslik: "Test Ticket",
        aciklama: "Test Description",
        oncelik: "Yüksek",
        durum: "Açık",
        teknikNotlar: "Test notes",
      });

      expect(result).toBeDefined();
    });

    it("should create tickets with all priority levels", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const priorities = ["Düşük", "Orta", "Yüksek", "KRİTİK"] as const;
      const timestamp = Date.now();

      for (let i = 0; i < priorities.length; i++) {
        const result = await caller.tickets.create({
          ticketNo: `TKT-${i + 100}-${timestamp}`,
          customerId: 1,
          baslik: `Test Ticket ${priorities[i]}`,
          oncelik: priorities[i],
          durum: "Açık",
        });

        expect(result).toBeDefined();
      }
    });

    it("should create tickets with all status values", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const statuses = ["Açık", "Devam Ediyor", "Tamamlandı"] as const;
      const timestamp = Date.now();

      for (let i = 0; i < statuses.length; i++) {
        const result = await caller.tickets.create({
          ticketNo: `TKT-${i + 200}-${timestamp}`,
          customerId: 1,
          baslik: `Test Ticket ${statuses[i]}`,
          oncelik: "Orta",
          durum: statuses[i],
        });

        expect(result).toBeDefined();
      }
    });
  });
});

describe("Proposals Router", () => {
  describe("proposals.list", () => {
    it("should return list of proposals", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.proposals.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("proposals.create", () => {
    it("should create a new proposal with #151 format", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.proposals.create({
        proposalNo: `#151-${Date.now()}`,
        customerId: 1,
        baslik: "Test Proposal",
        tutarKdvHaric: "10000",
        kdvOrani: "18",
        tutarKdvDahil: "11800",
        gecerlilikGunu: 3,
        durum: "Taslak",
      });

      expect(result).toBeDefined();
    });

    it("should create proposal with all status values", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const statuses = ["Taslak", "Gönderildi", "Kabul Edildi", "Reddedildi"] as const;
      const timestamp = Date.now();

      for (let i = 0; i < statuses.length; i++) {
        const result = await caller.proposals.create({
          proposalNo: `#${151 + i}-${timestamp}-${i}`,
          customerId: 1,
          baslik: `Test Proposal ${statuses[i]}`,
          tutarKdvHaric: "5000",
          tutarKdvDahil: "5900",
          durum: statuses[i],
        });

        expect(result).toBeDefined();
      }
    });
  });
});


describe("Payments Router", () => {
  describe("payments.list", () => {
    it("should return list of payments", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("payments.create", () => {
    it("should create a new payment", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.create({
        customerId: 1,
        tutarı: "5000",
        odemeYontemi: "Banka Transferi",
        notlar: "Aylık ödeme",
      });

      expect(result).toBeDefined();
    });
  });
});
