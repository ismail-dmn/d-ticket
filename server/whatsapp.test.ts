import { describe, expect, it } from "vitest";
import {
  createPaymentReminderMessage,
  createTicketUpdateMessage,
  createProposalSentMessage,
  sendWhatsAppMessage,
  sendPaymentReminder,
} from "./whatsapp";

describe("WhatsApp Service", () => {
  describe("Message Creation", () => {
    it("should create payment reminder message", () => {
      const message = createPaymentReminderMessage("Test Firma", 5000, 5);

      expect(message).toContain("Test Firma");
      expect(message).toContain("5000.00");
      expect(message).toContain("Ödeme Hatırlatması");
    });

    it("should create ticket update message", () => {
      const message = createTicketUpdateMessage("TKT-001", "Test Ticket", "Devam Ediyor", "Test notes");

      expect(message).toContain("TKT-001");
      expect(message).toContain("Test Ticket");
      expect(message).toContain("Devam Ediyor");
      expect(message).toContain("Test notes");
    });

    it("should create proposal sent message", () => {
      const message = createProposalSentMessage("#151", "Test Proposal", 10000);

      expect(message).toContain("#151");
      expect(message).toContain("Test Proposal");
      expect(message).toContain("10000.00");
      expect(message).toContain("Teklif Gönderimi");
    });
  });

  describe("WhatsApp Message Sending", () => {
    it("should send WhatsApp message successfully", async () => {
      const result = await sendWhatsAppMessage({
        to: "+90 555 123 4567",
        message: "Test message",
        type: "custom",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it("should send payment reminder", async () => {
      const result = await sendPaymentReminder("+90 555 123 4567", "Test Firma", 5000, 5);

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });

  describe("Message Format Validation", () => {
    it("should include all required information in payment reminder", () => {
      const message = createPaymentReminderMessage("Acme Corp", 15000, 10);

      expect(message).toContain("Acme Corp");
      expect(message).toContain("15000");
      expect(message).toContain("D Bilişim Çözümleri");
      expect(message).toMatch(/\d+ gün gecikmiştir/);
    });

    it("should format proposal message with currency", () => {
      const message = createProposalSentMessage("#151-001", "Yazılım Geliştirme", 25000);

      expect(message).toContain("25000.00 TL");
      expect(message).toContain("3 iş günü");
      expect(message).toContain("PDF");
    });
  });
});
