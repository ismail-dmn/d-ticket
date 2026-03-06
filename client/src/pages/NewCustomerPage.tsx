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

export default function NewCustomerPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const createCustomerMutation = trpc.customers.create.useMutation();

  const [formData, setFormData] = useState({
    firmAdi: "",
    isAbonelik: "false" as "true" | "false",
    aylikUcret: "",
    odemeGunu: "5",
    iletisimKisi: "",
    telefon: "",
    email: "",
    notlar: "",
  });

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createCustomerMutation.mutateAsync({
        firmAdi: formData.firmAdi,
        isAbonelik: formData.isAbonelik,
        aylikUcret: formData.aylikUcret || "0",
        odemeGunu: parseInt(formData.odemeGunu),
        kalanBorc: "0",
        iletisimKisi: formData.iletisimKisi || undefined,
        telefon: formData.telefon || undefined,
        email: formData.email || undefined,
        notlar: formData.notlar || undefined,
      });

      toast.success("Müşteri başarıyla oluşturuldu!");
      navigate("/customers");
    } catch (error) {
      toast.error("Müşteri oluşturulurken hata oluştu!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/customers")}
              className="text-white hover:bg-primary-dark"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Yeni Müşteri</h1>
              <p className="text-primary-foreground/80">Yeni firma kaydı oluştur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Müşteri Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Firma Adı */}
              <div>
                <Label htmlFor="firmAdi">Firma Adı *</Label>
                <Input
                  id="firmAdi"
                  value={formData.firmAdi}
                  onChange={(e) => setFormData({ ...formData, firmAdi: e.target.value })}
                  placeholder="Firma adını girin"
                  required
                  className="mt-1"
                />
              </div>

              {/* İletişim Kişi */}
              <div>
                <Label htmlFor="iletisimKisi">İletişim Kişi</Label>
                <Input
                  id="iletisimKisi"
                  value={formData.iletisimKisi}
                  onChange={(e) => setFormData({ ...formData, iletisimKisi: e.target.value })}
                  placeholder="İletişim kişisinin adı"
                  className="mt-1"
                />
              </div>

              {/* Telefon ve Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefon">Telefon</Label>
                  <Input
                    id="telefon"
                    value={formData.telefon}
                    onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                    placeholder="+90 XXX XXX XXXX"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Abonelik */}
              <div>
                <Label htmlFor="isAbonelik">Abonelik Türü</Label>
                <select
                  id="isAbonelik"
                  value={formData.isAbonelik}
                  onChange={(e) => setFormData({ ...formData, isAbonelik: e.target.value as "true" | "false" })}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="false">Tek Seferlik</option>
                  <option value="true">Aylık Abonelik</option>
                </select>
              </div>

              {/* Aylık Ücret ve Ödeme Günü */}
              {formData.isAbonelik === "true" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aylikUcret">Aylık Ücret (TL)</Label>
                    <Input
                      id="aylikUcret"
                      type="number"
                      step="0.01"
                      value={formData.aylikUcret}
                      onChange={(e) => setFormData({ ...formData, aylikUcret: e.target.value })}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="odemeGunu">Ödeme Günü</Label>
                    <Input
                      id="odemeGunu"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.odemeGunu}
                      onChange={(e) => setFormData({ ...formData, odemeGunu: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Notlar */}
              <div>
                <Label htmlFor="notlar">Notlar</Label>
                <Textarea
                  id="notlar"
                  value={formData.notlar}
                  onChange={(e) => setFormData({ ...formData, notlar: e.target.value })}
                  placeholder="İlave notlar..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              {/* Butonlar */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/customers")}
                  disabled={isLoading}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white"
                  disabled={isLoading || !formData.firmAdi}
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
