import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Send, Printer } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

interface ProposalItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Proposal {
  id: number;
  proposalNo: string;
  baslik: string;
  aciklama?: string;
  items: ProposalItem[];
  tutarKdvHaric: number;
  kdvOrani: number;
  tutarKdvDahil: number;
  gecerlilikGunu: number;
  durum: "Taslak" | "Gönderildi" | "Kabul Edildi" | "Reddedildi";
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  "Taslak": "bg-gray-100 text-gray-800",
  "Gönderildi": "bg-blue-100 text-blue-800",
  "Kabul Edildi": "bg-green-100 text-green-800",
  "Reddedildi": "bg-red-100 text-red-800",
};

export default function ProposalDetailPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Örnek teklif verisi
  const proposal: Proposal = {
    id: 1,
    proposalNo: "#151-001",
    baslik: "Yazılım Geliştirme Hizmetleri",
    aciklama: "Kurumsal web uygulaması geliştirme",
    items: [
      {
        description: "Gereksinim Analizi ve Tasarım",
        quantity: 1,
        unitPrice: 5000,
        total: 5000,
      },
      {
        description: "Frontend Geliştirme (React)",
        quantity: 1,
        unitPrice: 8000,
        total: 8000,
      },
      {
        description: "Backend Geliştirme (Node.js)",
        quantity: 1,
        unitPrice: 10000,
        total: 10000,
      },
      {
        description: "Veritabanı Tasarımı ve Implementasyonu",
        quantity: 1,
        unitPrice: 3000,
        total: 3000,
      },
    ],
    tutarKdvHaric: 26000,
    kdvOrani: 20,
    tutarKdvDahil: 31200,
    gecerlilikGunu: 3,
    durum: "Gönderildi",
    pdfUrl: "https://example.com/proposal-151-001.pdf",
    createdAt: "2026-03-05T10:00:00",
    updatedAt: "2026-03-06T14:30:00",
  };

  if (!isAuthenticated) {
    navigate("/proposals");
    return null;
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // PDF üretim API çağrısı yapılacak
      toast.success("PDF oluşturuldu!");
    } catch (error) {
      toast.error("PDF oluşturulamadı!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendWhatsApp = async () => {
    setIsSending(true);
    try {
      // WhatsApp API çağrısı yapılacak
      toast.success("WhatsApp mesajı gönderildi!");
    } catch (error) {
      toast.error("WhatsApp mesajı gönderilemedi!");
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = () => {
    if (proposal.pdfUrl) {
      window.open(proposal.pdfUrl, "_blank");
    } else {
      toast.error("PDF henüz oluşturulmadı!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/proposals")}
                className="text-white hover:bg-primary-dark"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{proposal.baslik}</h1>
                <p className="text-primary-foreground/80">Teklif {proposal.proposalNo}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadPDF}
                disabled={!proposal.pdfUrl}
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Download className="h-4 w-4 mr-2" />
                İndir
              </Button>
              <Button
                onClick={handleSendWhatsApp}
                disabled={isSending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? "Gönderiliyor..." : "Gönder"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Teklif Detayları */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Teklif Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Başlık</label>
                <p className="text-lg font-medium mt-1">{proposal.baslik}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Açıklama</label>
                <p className="text-sm mt-1">{proposal.aciklama}</p>
              </div>

              {/* Teklif Kalemleri */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-3 block">
                  Teklif Kalemleri
                </label>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 font-semibold">Açıklama</th>
                        <th className="text-right py-2 px-2 font-semibold">Miktar</th>
                        <th className="text-right py-2 px-2 font-semibold">Birim Fiyat</th>
                        <th className="text-right py-2 px-2 font-semibold">Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposal.items.map((item, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-2 px-2">{item.description}</td>
                          <td className="text-right py-2 px-2">{item.quantity}</td>
                          <td className="text-right py-2 px-2">
                            {item.unitPrice.toLocaleString("tr-TR")} TL
                          </td>
                          <td className="text-right py-2 px-2 font-semibold">
                            {item.total.toLocaleString("tr-TR")} TL
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Teklif Şartları */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm mb-2">Teklif Şartları</h3>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Fiyatlara KDV dahil değildir</li>
                  <li>• Teklif {proposal.gecerlilikGunu} iş günü geçerlidir</li>
                  <li>• Yazılım ve lisans ürünlerinde iade kabul edilmez</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Özet Paneli */}
          <Card>
            <CardHeader>
              <CardTitle>Özet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">KDV Hariç:</span>
                  <span className="font-semibold">
                    {proposal.tutarKdvHaric.toLocaleString("tr-TR")} TL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">KDV (%{proposal.kdvOrani}):</span>
                  <span className="font-semibold">
                    {(
                      (proposal.tutarKdvHaric * proposal.kdvOrani) /
                      100
                    ).toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    TL
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Toplam:</span>
                <span className="text-primary">
                  {proposal.tutarKdvDahil.toLocaleString("tr-TR")} TL
                </span>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Durum</label>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[proposal.durum]}`}>
                    {proposal.durum}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Oluşturulma: {new Date(proposal.createdAt).toLocaleString("tr-TR")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Son Güncelleme: {new Date(proposal.updatedAt).toLocaleString("tr-TR")}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating}
                  className="w-full bg-primary hover:bg-primary-dark text-white"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {isGenerating ? "Oluşturuluyor..." : "PDF Oluştur"}
                </Button>
                {proposal.pdfUrl && (
                  <Button
                    onClick={handleDownloadPDF}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF İndir
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aktivite Geçmişi */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivite Geçmişi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 pb-4 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Teklif Oluşturuldu</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(proposal.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pb-4 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">PDF Oluşturuldu</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(proposal.updatedAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Müşteriye Gönderildi</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(proposal.updatedAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
