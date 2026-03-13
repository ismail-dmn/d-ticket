
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";

export default function CustomerDetailPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams();
  const customerId = params.id ? parseInt(params.id) : undefined;

  const customerQuery = trpc.customers.getById.useQuery(customerId, { 
    enabled: isAuthenticated && !!customerId 
  });

  const customer = customerQuery.data;

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  if (customerQuery.isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (!customer) {
    return <div>Müşteri bulunamadı.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
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
              <h1 className="text-3xl font-bold">{customer.firmAdi}</h1>
              <p className="text-primary-foreground/80">Müşteri Detayları</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Firma Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Firma Adı:</strong> {customer.firmAdi}</p>
            <p><strong>İletişim Kişisi:</strong> {customer.iletisimKisi || "-"}</p>
            <p><strong>Telefon:</strong> {customer.telefon || "-"}</p>
            <p><strong>Email:</strong> {customer.email || "-"}</p>
            <p><strong>Abonelik:</strong> {customer.isAbonelik === "true" ? "Aylık Abone" : "Tek Seferlik"}</p>
            {customer.isAbonelik === "true" && (
              <>
                <p><strong>Aylık Ücret:</strong> {customer.aylikUcret} TL</p>
                <p><strong>Ödeme Günü:</strong> Ayın {customer.odemeGunu}. günü</p>
                <p><strong>Kalan Borç:</strong> {customer.kalanBorc} TL</p>
              </>
            )}
            <p><strong>Notlar:</strong> {customer.notlar || "-"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
