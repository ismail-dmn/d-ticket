import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function NewTicketPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const createTicketMutation = trpc.tickets.create.useMutation();
  const customersQuery = trpc.customers.list.useQuery(undefined, { enabled: isAuthenticated });

  const [formData, setFormData] = useState({
    ticketNo: "",
    customerId: "",
    baslik: "",
    aciklama: "",
    oncelik: "Orta" as "Düşük" | "Orta" | "Yüksek" | "KRİTİK",
    durum: "Açık" as "Açık" | "Devam Ediyor" | "Tamamlandı",
    teknikNotlar: "",
    sifreler: "",
  });

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createTicketMutation.mutateAsync({
        ticketNo: formData.ticketNo,
        customerId: parseInt(formData.customerId),
        baslik: formData.baslik,
        aciklama: formData.aciklama || undefined,
        oncelik: formData.oncelik,
        durum: formData.durum,
        teknikNotlar: formData.teknikNotlar || undefined,
        sifreler: formData.sifreler || undefined,
      });

      toast.success("Ticket başarıyla oluşturuldu!");
      navigate("/tickets");
    } catch (error) {
      toast.error("Ticket oluşturulurken hata oluştu!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const customers = customersQuery.data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="container py-6">
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
              <h1 className="text-3xl font-bold">Yeni Ticket</h1>
              <p className="text-primary-foreground/80">Arıza veya servis talebini kaydet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ticket No */}
              <div>
                <Label htmlFor="ticketNo">Ticket No *</Label>
                <Input
                  id="ticketNo"
                  value={formData.ticketNo}
                  onChange={(e) => setFormData({ ...formData, ticketNo: e.target.value })}
                  placeholder="TKT-001"
                  required
                  className="mt-1"
                />
              </div>

              {/* Müşteri */}
              <div>
                <Label htmlFor="customerId">Müşteri *</Label>
                <select
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  required
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="">Müşteri seçin...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firmAdi}
                    </option>
                  ))}
                </select>
              </div>

              {/* Başlık */}
              <div>
                <Label htmlFor="baslik">Başlık *</Label>
                <Input
                  id="baslik"
                  value={formData.baslik}
                  onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                  placeholder="Arızanın kısa açıklaması"
                  required
                  className="mt-1"
                />
              </div>

              {/* Açıklama */}
              <div>
                <Label htmlFor="aciklama">Açıklama</Label>
                <Textarea
                  id="aciklama"
                  value={formData.aciklama}
                  onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                  placeholder="Detaylı açıklama..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              {/* Öncelik ve Durum */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="oncelik">Öncelik *</Label>
                  <select
                    id="oncelik"
                    value={formData.oncelik}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        oncelik: e.target.value as "Düşük" | "Orta" | "Yüksek" | "KRİTİK",
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="Düşük">Düşük</option>
                    <option value="Orta">Orta</option>
                    <option value="Yüksek">Yüksek</option>
                    <option value="KRİTİK">KRİTİK</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="durum">Durum *</Label>
                  <select
                    id="durum"
                    value={formData.durum}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durum: e.target.value as "Açık" | "Devam Ediyor" | "Tamamlandı",
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="Açık">Açık</option>
                    <option value="Devam Ediyor">Devam Ediyor</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                  </select>
                </div>
              </div>

              {/* Teknik Notlar */}
              <div>
                <Label htmlFor="teknikNotlar">Teknik Notlar</Label>
                <Textarea
                  id="teknikNotlar"
                  value={formData.teknikNotlar}
                  onChange={(e) => setFormData({ ...formData, teknikNotlar: e.target.value })}
                  placeholder="Teknik detaylar, hata mesajları vb."
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Şifreler */}
              <div>
                <Label htmlFor="sifreler">Sistem Şifreleri (Şifreli Tutulur)</Label>
                <Textarea
                  id="sifreler"
                  value={formData.sifreler}
                  onChange={(e) => setFormData({ ...formData, sifreler: e.target.value })}
                  placeholder="Erişim şifreleri, admin bilgileri vb. (Güvenli tutulur)"
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Butonlar */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/tickets")}
                  disabled={isLoading}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white"
                  disabled={isLoading || !formData.ticketNo || !formData.customerId || !formData.baslik}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
