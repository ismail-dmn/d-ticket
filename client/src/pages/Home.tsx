import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus, FileText, Users, Ticket, TrendingDown } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  // Verileri çek
  const customersQuery = trpc.customers.list.useQuery(undefined, { enabled: isAuthenticated });
  const ticketsQuery = trpc.tickets.list.useQuery(undefined, { enabled: isAuthenticated });
  const overdueQuery = trpc.customers.getOverdue.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">D Bilişim</div>
            <CardTitle>IT Operasyon Sistemi</CardTitle>
            <CardDescription>Müşteri ve Ticket Yönetimi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Güvenli giriş yaparak sistemi kullanmaya başlayın.
            </p>
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="w-full bg-primary hover:bg-primary-dark text-white"
              size="lg"
            >
              Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ödeme gecikmiş müşteriler
  const overdueCustomers = overdueQuery.data || [];
  const totalCustomers = customersQuery.data?.length || 0;
  const totalTickets = ticketsQuery.data?.length || 0;
  const openTickets = ticketsQuery.data?.filter((t) => t.durum === "Açık").length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">D Bilişim Çözümleri</h1>
              <p className="text-primary-foreground/80">IT Operasyon ve Finans Sistemi</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">{user?.name || "Kullanıcı"}</span>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-white border-white hover:bg-primary-dark"
              >
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Ödeme Gecikmiş Uyarısı */}
        {overdueCustomers.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border-l-4 border-destructive rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive">Ödeme Gecikmiş Müşteriler</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {overdueCustomers.length} müşterinin ödemesi gecikmiştir. Lütfen ödeme hatırlatması gönderin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Özet Kartları */}
        <div className="dashboard-grid mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Müşteri</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Kayıtlı firmalar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Ticket</CardTitle>
              <Ticket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTickets}</div>
              <p className="text-xs text-muted-foreground">{openTickets} açık ticket</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gecikmiş Ödemeler</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{overdueCustomers.length}</div>
              <p className="text-xs text-muted-foreground">Ödeme hatırlatması gerekli</p>
            </CardContent>
          </Card>
        </div>

        {/* Hızlı İşlemler */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate("/customers/new")}
              className="h-auto py-6 flex flex-col items-center gap-2 bg-primary hover:bg-primary-dark"
            >
              <Plus className="h-6 w-6" />
              <span>Yeni Müşteri</span>
            </Button>
            <Button
              onClick={() => navigate("/tickets/new")}
              className="h-auto py-6 flex flex-col items-center gap-2 bg-primary hover:bg-primary-dark"
            >
              <Ticket className="h-6 w-6" />
              <span>Yeni Ticket</span>
            </Button>
            <Button
              onClick={() => navigate("/proposals/new")}
              className="h-auto py-6 flex flex-col items-center gap-2 bg-primary hover:bg-primary-dark"
            >
              <FileText className="h-6 w-6" />
              <span>Teklif Oluştur</span>
            </Button>
            <Button
              onClick={() => navigate("/customers")}
              className="h-auto py-6 flex flex-col items-center gap-2 bg-secondary hover:bg-secondary-dark"
            >
              <Users className="h-6 w-6" />
              <span>Müşterileri Gör</span>
            </Button>
          </div>
        </div>

        {/* Ödeme Gecikmiş Müşteriler Listesi */}
        {overdueCustomers.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">Ödeme Gecikmiş Müşteriler</h2>
            <div className="space-y-3">
              {overdueCustomers.map((customer) => (
                <div key={customer.id} className="card-overdue p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{customer.firmAdi}</h3>
                      <p className="text-sm text-muted-foreground">
                        Borç: {parseFloat(customer.kalanBorc as any) || 0} TL
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate(`/customers/${customer.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      Detayları Gör
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
