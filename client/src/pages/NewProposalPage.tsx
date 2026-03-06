import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Download } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const PROPOSAL_TERMS = [
  "Fiyatlara KDV dahil değildir.",
  "Teklif 3 iş günü geçerlidir.",
  "Yazılım ve lisans ürünlerinde iade kabul edilmez.",
];

export default function NewProposalPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const createProposalMutation = trpc.proposals.create.useMutation();
  const customersQuery = trpc.customers.list.useQuery(undefined, { enabled: isAuthenticated });

  const [formData, setFormData] = useState({
    proposalNo: `#151-${Date.now()}`,
    customerId: "",
    baslik: "",
    aciklama: "",
    tutarKdvHaric: "",
    kdvOrani: "18",
    tutarKdvDahil: "",
    gecerlilikGunu: "3",
    durum: "Taslak" as "Taslak" | "Gönderildi" | "Kabul Edildi" | "Reddedildi",
  });

  // KDV hesaplama
  useEffect(() => {
    const tutarKdvHaric = parseFloat(formData.tutarKdvHaric) || 0;
    const kdvOrani = parseFloat(formData.kdvOrani) || 0;
    const kdvTutari = tutarKdvHaric * (kdvOrani / 100);
    const tutarKdvDahil = tutarKdvHaric + kdvTutari;

    setFormData((prev) => ({
      ...prev,
      tutarKdvDahil: tutarKdvDahil.toFixed(2),
    }));
  }, [formData.tutarKdvHaric, formData.kdvOrani]);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createProposalMutation.mutateAsync({
        proposalNo: formData.proposalNo,
        customerId: parseInt(formData.customerId),
        baslik: formData.baslik,
        aciklama: formData.aciklama || undefined,
        tutarKdvHaric: formData.tutarKdvHaric,
        kdvOrani: formData.kdvOrani,
        tutarKdvDahil: formData.tutarKdvDahil,
        gecerlilikGunu: parseInt(formData.gecerlilikGunu),
        durum: formData.durum,
      });

      toast.success("Teklif başarıyla oluşturuldu!");
      
      // PDF indirme simülasyonu
      setTimeout(() => {
        toast.info("PDF teklif oluşturuluyor...");
      }, 500);
      
      navigate("/proposals");
    } catch (error) {
      toast.error("Teklif oluşturulurken hata oluştu!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const customers = customersQuery.data || [];
  const tutarKdvHaric = parseFloat(formData.tutarKdvHaric) || 0;
  const kdvTutari = tutarKdvHaric * (parseFloat(formData.kdvOrani) / 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="container py-6">
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
              <h1 className="text-3xl font-bold">Yeni Teklif</h1>
              <p className="text-primary-foreground/80">D Bilişim Profesyonel Teklif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Teklif Başlığı */}
          <Card>
            <CardHeader>
              <CardTitle>Teklif Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Teklif No */}
              <div>
                <Label htmlFor="proposalNo">Teklif No *</Label>
                <Input
                  id="proposalNo"
                  value={formData.proposalNo}
                  onChange={(e) => setFormData({ ...formData, proposalNo: e.target.value })}
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
                <Label htmlFor="baslik">Teklif Başlığı *</Label>
                <Input
                  id="baslik"
                  value={formData.baslik}
                  onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                  placeholder="Hizmet veya ürün açıklaması"
                  required
                  className="mt-1"
                />
              </div>

              {/* Açıklama */}
              <div>
                <Label htmlFor="aciklama">Detaylı Açıklama</Label>
                <Textarea
                  id="aciklama"
                  value={formData.aciklama}
                  onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                  placeholder="Hizmet detayları, kapsamı vb."
                  className="mt-1"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Fiyatlandırma */}
          <Card>
            <CardHeader>
              <CardTitle>Fiyatlandırma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tutarKdvHaric">Tutar (KDV Hariç) *</Label>
                  <Input
                    id="tutarKdvHaric"
                    type="number"
                    step="0.01"
                    value={formData.tutarKdvHaric}
                    onChange={(e) => setFormData({ ...formData, tutarKdvHaric: e.target.value })}
                    placeholder="0.00"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="kdvOrani">KDV Oranı (%)</Label>
                  <Input
                    id="kdvOrani"
                    type="number"
                    step="0.01"
                    value={formData.kdvOrani}
                    onChange={(e) => setFormData({ ...formData, kdvOrani: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* KDV Hesaplaması */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tutar (KDV Hariç):</span>
                  <span className="font-medium">{tutarKdvHaric.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    KDV ({parseFloat(formData.kdvOrani)}%):
                  </span>
                  <span className="font-medium">{kdvTutari.toFixed(2)} TL</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-semibold">Toplam (KDV Dahil):</span>
                  <span className="font-bold text-primary text-lg">
                    {parseFloat(formData.tutarKdvDahil).toFixed(2)} TL
                  </span>
                </div>
              </div>

              {/* Geçerlilik Günü */}
              <div>
                <Label htmlFor="gecerlilikGunu">Teklif Geçerlilik Süresi (Gün)</Label>
                <Input
                  id="gecerlilikGunu"
                  type="number"
                  min="1"
                  value={formData.gecerlilikGunu}
                  onChange={(e) => setFormData({ ...formData, gecerlilikGunu: e.target.value })}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Teklif Şartları */}
          <Card>
            <CardHeader>
              <CardTitle>Teklif Şartları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 bg-muted p-4 rounded-lg">
                {PROPOSAL_TERMS.map((term, index) => (
                  <div key={index} className="flex gap-2 text-sm">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-foreground">{term}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Durum */}
          <Card>
            <CardHeader>
              <CardTitle>Teklif Durumu</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={formData.durum}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durum: e.target.value as "Taslak" | "Gönderildi" | "Kabul Edildi" | "Reddedildi",
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="Taslak">Taslak</option>
                <option value="Gönderildi">Gönderildi</option>
                <option value="Kabul Edildi">Kabul Edildi</option>
                <option value="Reddedildi">Reddedildi</option>
              </select>
            </CardContent>
          </Card>

          {/* Butonlar */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/proposals")}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white flex-1"
              disabled={isLoading || !formData.customerId || !formData.baslik || !formData.tutarKdvHaric}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Kaydediliyor..." : "Teklifi Kaydet"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading || !formData.customerId || !formData.baslik}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PDF İndir
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
