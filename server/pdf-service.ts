/**
 * PDF Teklif Üretim Servisi - D Bilişim Çözümleri
 * #151 şablonu ile profesyonel teklif PDF'i oluşturur
 */

import { Proposal, Customer } from "../drizzle/schema";

export interface ProposalPDFData {
  proposal: Proposal;
  customer: Customer;
}

/**
 * Teklif PDF'i oluştur
 * Not: Gerçek implementasyon için PDFKit, ReportLab veya benzeri kütüphaneler kullanılabilir
 */
export async function generateProposalPDF(data: ProposalPDFData): Promise<Buffer> {
  try {
    // Gerçek PDF üretim kodu
    // Bu örnek, PDF üretim yapısını göstermektedir

    const { proposal, customer } = data;

    // PDF içeriği oluştur
    const pdfContent = createPDFContent(proposal, customer);

    // Buffer'a dönüştür (gerçek implementasyonda PDFKit kullanılacak)
    const buffer = Buffer.from(pdfContent, "utf-8");

    console.log(`[PDF] Teklif PDF'i oluşturuldu: ${proposal.proposalNo}`);

    return buffer;
  } catch (error) {
    console.error("[PDF] Hata:", error);
    throw new Error("PDF oluşturulurken hata oluştu");
  }
}

/**
 * PDF içeriğini oluştur
 */
function createPDFContent(proposal: Proposal, customer: Customer): string {
  const today = new Date();
  const validityDate = new Date(today);
  validityDate.setDate(validityDate.getDate() + (proposal.gecerlilikGunu || 3));

  const kdvTutari =
    parseFloat(proposal.tutarKdvHaric as any) * (parseFloat(proposal.kdvOrani as any) / 100);

  return `
D BİLİŞİM ÇÖZÜMLERİ
IT Operasyon ve Finans Sistemi
═══════════════════════════════════════════════════════════════

PROFESYONEL TEKLİF

Teklif No: ${proposal.proposalNo}
Tarih: ${today.toLocaleDateString("tr-TR")}
Geçerlilik Tarihi: ${validityDate.toLocaleDateString("tr-TR")}

───────────────────────────────────────────────────────────────
MÜŞTERI BİLGİLERİ
───────────────────────────────────────────────────────────────

Firma Adı: ${customer.firmAdi}
İletişim Kişi: ${customer.iletisimKisi || "-"}
Telefon: ${customer.telefon || "-"}
Email: ${customer.email || "-"}

───────────────────────────────────────────────────────────────
TEKLİF DETAYLARı
───────────────────────────────────────────────────────────────

Başlık: ${proposal.baslik}

Açıklama:
${proposal.aciklama || "Detaylı açıklama bulunmamaktadır."}

───────────────────────────────────────────────────────────────
FİYATLANDIRMA
───────────────────────────────────────────────────────────────

Hizmet/Ürün Tutarı:        ${parseFloat(proposal.tutarKdvHaric as any).toFixed(2)} TL
KDV Oranı (%):             ${parseFloat(proposal.kdvOrani as any).toFixed(2)}%
KDV Tutarı:                ${kdvTutari.toFixed(2)} TL
─────────────────────────────────────────────────────────────
TOPLAM TUTAR (KDV DAHİL):  ${parseFloat(proposal.tutarKdvDahil as any).toFixed(2)} TL

───────────────────────────────────────────────────────────────
TEKLİF ŞARTLARI
───────────────────────────────────────────────────────────────

• Fiyatlara KDV dahil değildir.
• Teklif 3 iş günü geçerlidir.
• Yazılım ve lisans ürünlerinde iade kabul edilmez.

───────────────────────────────────────────────────────────────
ÖDEME KOŞULLARI
───────────────────────────────────────────────────────────────

Ödeme Yöntemi: Banka Transferi
Ödeme Tarihi: Hizmet başlangıcından önce

Banka Hesap Bilgileri:
Banka: [Banka Adı]
IBAN: [IBAN]
Hesap Sahibi: D Bilişim Çözümleri

───────────────────────────────────────────────────────────────
NOTLAR
───────────────────────────────────────────────────────────────

Bu teklif, yukarıda belirtilen şartlar altında geçerlidir.
Herhangi bir sorunuz olması durumunda bizimle iletişime geçiniz.

D Bilişim Çözümleri
IT Operasyon ve Finans Sistemi

═══════════════════════════════════════════════════════════════
Bu belge bilgisayar tarafından oluşturulmuştur ve imza taşımaz.
  `;
}

/**
 * PDF'i dosya olarak kaydet
 */
export async function savePDFToFile(
  buffer: Buffer,
  filename: string,
  filepath: string
): Promise<string> {
  try {
    // Gerçek implementasyonda dosya sistemi veya S3'e kaydedilecek
    console.log(`[PDF] Dosya kaydediliyor: ${filepath}/${filename}`);

    // S3 veya başka bir depolama servisi kullanılabilir
    // const result = await storagePut(`proposals/${filename}`, buffer, 'application/pdf');
    // return result.url;

    return `file://${filepath}/${filename}`;
  } catch (error) {
    console.error("[PDF] Dosya kaydedilirken hata:", error);
    throw new Error("PDF dosyası kaydedilirken hata oluştu");
  }
}

/**
 * Teklif PDF'i oluştur ve kaydet
 */
export async function generateAndSaveProposalPDF(
  data: ProposalPDFData,
  outputPath: string
): Promise<string> {
  try {
    const buffer = await generateProposalPDF(data);
    const filename = `${data.proposal.proposalNo}.pdf`;
    const filepath = await savePDFToFile(buffer, filename, outputPath);

    return filepath;
  } catch (error) {
    console.error("[PDF] Teklif PDF'i oluşturulamadı:", error);
    throw error;
  }
}
