import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as whatsapp from "./whatsapp";
import * as pdfService from "./pdf-service";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Müşteri yönetimi
  customers: router({
    list: protectedProcedure.query(() => db.getCustomers()),
    getById: protectedProcedure.input(z.number()).query(({ input }) => db.getCustomerById(input)),
    create: protectedProcedure
      .input(z.object({
        firmAdi: z.string(),
        isAbonelik: z.enum(["true", "false"]),
        aylikUcret: z.string().optional(),
        odemeGunu: z.number().optional(),
        kalanBorc: z.string().optional(),
        iletisimKisi: z.string().optional(),
        telefon: z.string().optional(),
        email: z.string().optional(),
        notlar: z.string().optional(),
      }))
      .mutation(({ input }) => db.createCustomer(input as any)),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.any(),
      }))
      .mutation(({ input }) => db.updateCustomer(input.id, input.data)),
    getOverdue: protectedProcedure.query(() => db.getOverdueCustomers()),
  }),

  // Ticket yönetimi
  tickets: router({
    list: protectedProcedure.query(() => db.getTickets()),
    getById: protectedProcedure.input(z.number()).query(({ input }) => db.getTicketById(input)),
    getByCustomer: protectedProcedure.input(z.number()).query(({ input }) => db.getTicketsByCustomer(input)),
    create: protectedProcedure
      .input(z.object({
        ticketNo: z.string(),
        customerId: z.number(),
        baslik: z.string(),
        aciklama: z.string().optional(),
        oncelik: z.enum(["Düşük", "Orta", "Yüksek", "KRİTİK"]),
        durum: z.enum(["Açık", "Devam Ediyor", "Tamamlandı"]),
        teknikNotlar: z.string().optional(),
        sifreler: z.string().optional(),
        cozumNotlari: z.string().optional(),
      }))
      .mutation(({ input }) => db.createTicket(input as any)),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.any(),
      }))
      .mutation(({ input }) => db.updateTicket(input.id, input.data)),
  }),

  // Teklif yönetimi
  proposals: router({
    list: protectedProcedure.query(() => db.getProposals()),
    getById: protectedProcedure.input(z.number()).query(({ input }) => db.getProposalById(input)),
    getByCustomer: protectedProcedure.input(z.number()).query(({ input }) => db.getProposalsByCustomer(input)),
    create: protectedProcedure
      .input(z.object({
        proposalNo: z.string(),
        customerId: z.number(),
        baslik: z.string(),
        aciklama: z.string().optional(),
        tutarKdvHaric: z.string(),
        kdvOrani: z.string().optional(),
        tutarKdvDahil: z.string(),
        gecerlilikGunu: z.number().optional(),
        durum: z.enum(["Taslak", "Gönderildi", "Kabul Edildi", "Reddedildi"]),
        pdfUrl: z.string().optional(),
      }))
      .mutation(({ input }) => db.createProposal(input as any)),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.any(),
      }))
      .mutation(({ input }) => db.updateProposal(input.id, input.data)),
  }),

  // Ödeme yönetimi
  payments: router({
    list: protectedProcedure.query(() => db.getPayments()),
    getByCustomer: protectedProcedure.input(z.number()).query(({ input }) => db.getPaymentsByCustomer(input)),
    create: protectedProcedure
      .input(z.object({
        customerId: z.number(),
        tutarı: z.string(),
        odemeTarihi: z.date().optional(),
        odemeYontemi: z.string().optional(),
        notlar: z.string().optional(),
      }))
      .mutation(({ input }) => db.createPayment(input as any)),
  }),

  // WhatsApp entegrasyonu
  whatsapp: router({
    sendPaymentReminder: protectedProcedure
      .input(z.object({
        customerId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const customer = await db.getCustomerById(input.customerId);
        if (!customer || !customer.telefon) {
          throw new Error("Müşteri telefon numarası bulunamadı");
        }

        return whatsapp.sendPaymentReminder(
          customer.telefon,
          customer.firmAdi,
          parseFloat(customer.aylikUcret as any) || 0,
          customer.odemeGunu || 5
        );
      }),
  }),

  // PDF teklif servisi
  pdf: router({
    generateProposal: protectedProcedure
      .input(z.object({
        proposalId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const proposal = await db.getProposalById(input.proposalId);
        if (!proposal) {
          throw new Error("Teklif bulunamadı");
        }

        const customer = await db.getCustomerById(proposal.customerId);
        if (!customer) {
          throw new Error("Müşteri bulunamadı");
        }

        try {
          const pdfUrl = await pdfService.generateAndSaveProposalPDF(
            { proposal, customer },
            "/tmp"
          );

          await db.updateProposal(input.proposalId, { pdfUrl });

          return {
            success: true,
            pdfUrl,
            proposalNo: proposal.proposalNo,
          };
        } catch (error) {
          throw new Error("PDF oluşturulamadı: " + (error instanceof Error ? error.message : ""));
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
