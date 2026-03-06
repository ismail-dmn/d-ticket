import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

interface Ticket {
  id: number;
  ticketNo: string;
  baslik: string;
  aciklama?: string;
  oncelik: "Düşük" | "Orta" | "Yüksek" | "KRİTİK";
  durum: "Açık" | "Devam Ediyor" | "Tamamlandı";
  teknikNotlar?: string;
  cozumNotlari?: string;
  createdAt: string;
  updatedAt: string;
}

const priorityColors: Record<string, string> = {
  "Düşük": "bg-blue-100 text-blue-800",
  "Orta": "bg-yellow-100 text-yellow-800",
  "Yüksek": "bg-orange-100 text-orange-800",
  "KRİTİK": "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  "Açık": "bg-red-100 text-red-800",
  "Devam Ediyor": "bg-yellow-100 text-yellow-800",
  "Tamamlandı": "bg-green-100 text-green-800",
};

export default function TicketDetailPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Örnek ticket verisi
  const ticket: Ticket = {
    id: 1,
    ticketNo: "TKT-001",
    baslik: "Yazıcı Ağ Bağlantısı Sorunu",
    aciklama: "3. Kattaki yazıcı ağa bağlanmıyor",
    oncelik: "Yüksek",
    durum: "Devam Ediyor",
    teknikNotlar: "Yazıcı IP: 192.168.1.50\nMAC: 00:1A:2B:3C:4D:5E\nModel: HP LaserJet Pro",
    cozumNotlari: "Yazıcı yeniden başlatıldı, ağ ayarları kontrol edildi",
    createdAt: "2026-03-06T10:00:00",
    updatedAt: "2026-03-06T14:30:00",
  };

  const [formData, setFormData] = useState({
    durum: ticket.durum,
    cozumNotlari: ticket.cozumNotlari || "",
  });

  if (!isAuthenticated) {
    navigate("/tickets");
    return null;
  }

  const handleSave = async () => {
    try {
      // API çağrısı yapılacak
      toast.success("Ticket güncellendi!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Ticket güncellenirken hata oluştu!");
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
                onClick={() => navigate("/tickets")}
                className="text-white hover:bg-primary-dark"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{ticket.baslik}</h1>
                <p className="text-primary-foreground/80">Ticket #{ticket.ticketNo}</p>
              </div>
            </div>
            <Button
              onClick={handleSendWhatsApp}
              disabled={isSending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {isSending ? "Gönderiliyor..." : "WhatsApp Gönder"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Ticket Bilgileri */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Ticket Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Başlık</label>
                <p className="text-lg font-medium mt-1">{ticket.baslik}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Açıklama</label>
                <p className="text-sm mt-1">{ticket.aciklama}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Teknik Notlar</label>
                <div className="bg-muted p-3 rounded mt-1 text-sm whitespace-pre-wrap font-mono">
                  {ticket.teknikNotlar}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Çözüm Notları</label>
                {isEditing ? (
                  <Textarea
                    value={formData.cozumNotlari}
                    onChange={(e) =>
                      setFormData({ ...formData, cozumNotlari: e.target.value })
                    }
                    placeholder="Çözüm notlarını girin..."
                    className="mt-1"
                    rows={4}
                  />
                ) : (
                  <div className="bg-muted p-3 rounded mt-1 text-sm whitespace-pre-wrap">
                    {formData.cozumNotlari || "Henüz çözüm notu eklenmedi"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Durum Paneli */}
          <Card>
            <CardHeader>
              <CardTitle>Durum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Öncelik</label>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[ticket.oncelik]}`}>
                    {ticket.oncelik}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Durum</label>
                {isEditing ? (
                  <select
                    value={formData.durum}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durum: e.target.value as "Açık" | "Devam Ediyor" | "Tamamlandı",
                      })
                    }
                    className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="Açık">Açık</option>
                    <option value="Devam Ediyor">Devam Ediyor</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                  </select>
                ) : (
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[formData.durum]}`}>
                      {formData.durum}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Oluşturulma: {new Date(ticket.createdAt).toLocaleString("tr-TR")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Son Güncelleme: {new Date(ticket.updatedAt).toLocaleString("tr-TR")}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-primary hover:bg-primary-dark text-white"
                  >
                    Düzenle
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Kaydet
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aktivite Logları */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivite Geçmişi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 pb-4 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Ticket Oluşturuldu</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pb-4 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Durum: Devam Ediyor</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ticket.updatedAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Çözüm Notu Eklendi</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ticket.updatedAt).toLocaleString("tr-TR")}
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
