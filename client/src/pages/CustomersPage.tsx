import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, Phone, Mail } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function CustomersPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const customersQuery = trpc.customers.list.useQuery(undefined, { enabled: isAuthenticated });
  const customers = customersQuery.data || [];

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

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
                onClick={() => navigate("/")}
                className="text-white hover:bg-primary-dark"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Müşteriler</h1>
                <p className="text-primary-foreground/80">Kayıtlı firmalar ve abonelikler</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/customers/new")}
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Müşteri
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {customersQuery.isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Müşteriler yükleniyor...</p>
          </div>
        ) : customers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Henüz müşteri kaydı yok.</p>
              <Button
                onClick={() => navigate("/customers/new")}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                İlk Müşteri Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {customers.map((customer) => (
              <Card
                key={customer.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{customer.firmAdi}</h3>
                      <div className="mt-3 space-y-2">
                        {customer.iletisimKisi && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">İletişim Kişi:</span> {customer.iletisimKisi}
                          </p>
                        )}
                        <div className="flex gap-4">
                          {customer.telefon && (
                            <a
                              href={`tel:${customer.telefon}`}
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-4 w-4" />
                              {customer.telefon}
                            </a>
                          )}
                          {customer.email && (
                            <a
                              href={`mailto:${customer.email}`}
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail className="h-4 w-4" />
                              {customer.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {customer.isAbonelik === "true" && (
                        <div className="mb-2">
                          <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                            Abone
                          </span>
                        </div>
                      )}
                      <div className="text-sm">
                        <p className="text-muted-foreground">Aylık Ücret</p>
                        <p className="text-lg font-semibold text-foreground">
                          {parseFloat(customer.aylikUcret as any) || 0} TL
                        </p>
                      </div>
                      {parseFloat(customer.kalanBorc as any) > 0 && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded">
                          <p className="text-xs text-muted-foreground">Borç</p>
                          <p className="text-sm font-semibold text-destructive">
                            {parseFloat(customer.kalanBorc as any)} TL
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
