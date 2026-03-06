/**
 * WhatsApp Entegrasyonu - D Bilişim Çözümleri
 * Müşteri iletişimi ve ödeme hatırlatması için WhatsApp API
 */

import { ENV } from "./_core/env";

export interface WhatsAppMessage {
  to: string;
  message: string;
  type: "payment_reminder" | "ticket_update" | "proposal_sent" | "custom";
}

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Ödeme hatırlatması mesajı oluştur
 */
export function createPaymentReminderMessage(
  firmAdi: string,
  tutarı: number,
  odemeGunu: number
): string {
  const today = new Date();
  const daysOverdue = today.getDate() - odemeGunu;

  return `
🔔 *D Bilişim Çözümleri - Ödeme Hatırlatması*

Merhaba ${firmAdi},

Aylık abonelik ödemeniz ${daysOverdue} gün gecikmiştir.

*Ödeme Tutarı:* ${tutarı.toFixed(2)} TL
*Ödeme Tarihi:* Ayın ${odemeGunu}'ü

Lütfen en kısa zamanda ödemenizi gerçekleştiriniz.

Sorularınız için bizimle iletişime geçebilirsiniz.

Teşekkür ederiz.
  `.trim();
}

/**
 * Ticket güncellemesi mesajı oluştur
 */
export function createTicketUpdateMessage(
  ticketNo: string,
  baslik: string,
  durum: string,
  notlar?: string
): string {
  return `
📋 *D Bilişim Çözümleri - Ticket Güncellemesi*

Ticket No: #${ticketNo}
Başlık: ${baslik}
Durum: ${durum}

${notlar ? `Notlar: ${notlar}` : ""}

Ticket detaylarını sistemden takip edebilirsiniz.
  `.trim();
}

/**
 * Teklif gönderimi mesajı oluştur
 */
export function createProposalSentMessage(
  proposalNo: string,
  baslik: string,
  tutarı: number
): string {
  return `
📄 *D Bilişim Çözümleri - Teklif Gönderimi*

Teklif No: ${proposalNo}
Başlık: ${baslik}
Tutar: ${tutarı.toFixed(2)} TL

Teklif detaylarını ekteki PDF dosyasından görebilirsiniz.

Teklif 3 iş günü geçerlidir.

Sorularınız için bizimle iletişime geçebilirsiniz.
  `.trim();
}

/**
 * WhatsApp API'ye mesaj gönder (Simülasyon)
 * Gerçek entegrasyon için WhatsApp Business API veya Twilio kullanılabilir
 */
export async function sendWhatsAppMessage(
  message: WhatsAppMessage
): Promise<WhatsAppResponse> {
  try {
    // Gerçek implementasyon için:
    // 1. Twilio WhatsApp API
    // 2. WhatsApp Business API
    // 3. Diğer WhatsApp entegrasyon servisleri

    // Şu an simülasyon olarak başarılı yanıt dönüyoruz
    console.log(`[WhatsApp] Mesaj gönderiliyor: ${message.to}`);
    console.log(`[WhatsApp] Tür: ${message.type}`);
    console.log(`[WhatsApp] Mesaj: ${message.message.substring(0, 50)}...`);

    // Gerçek API çağrısı yapılacak
    // const response = await fetch('https://api.whatsapp.com/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${ENV.whatsappToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     phone: message.to,
    //     message: message.message,
    //   }),
    // });

    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } catch (error) {
    console.error("[WhatsApp] Hata:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
}

/**
 * Ödeme hatırlatması gönder
 */
export async function sendPaymentReminder(
  telefon: string,
  firmAdi: string,
  tutarı: number,
  odemeGunu: number
): Promise<WhatsAppResponse> {
  const message = createPaymentReminderMessage(firmAdi, tutarı, odemeGunu);

  return sendWhatsAppMessage({
    to: telefon,
    message,
    type: "payment_reminder",
  });
}

/**
 * Ticket güncellemesi gönder
 */
export async function sendTicketUpdate(
  telefon: string,
  ticketNo: string,
  baslik: string,
  durum: string,
  notlar?: string
): Promise<WhatsAppResponse> {
  const message = createTicketUpdateMessage(ticketNo, baslik, durum, notlar);

  return sendWhatsAppMessage({
    to: telefon,
    message,
    type: "ticket_update",
  });
}

/**
 * Teklif gönderimi mesajı gönder
 */
export async function sendProposalNotification(
  telefon: string,
  proposalNo: string,
  baslik: string,
  tutarı: number
): Promise<WhatsAppResponse> {
  const message = createProposalSentMessage(proposalNo, baslik, tutarı);

  return sendWhatsAppMessage({
    to: telefon,
    message,
    type: "proposal_sent",
  });
}
