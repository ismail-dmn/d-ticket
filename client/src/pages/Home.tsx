import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus, FileText, Users, Ticket, TrendingDown } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleGoogleResponse = (response: any) => {
    console.log("Google Token Alındı:", response.credential);
    // Backend mutasyonu buraya bağlanacak
  };

  useEffect(() => {
    // Sadece giriş yapılmamışsa ve sayfa hazırsa Google'ı başlat
    if (!isAuthenticated && !loading) {
      const initGoogle = () => {
        // @ts-ignore
        if (window.google && window.google.accounts) {
          // @ts-ignore
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
          });

          const parent = document.getElementById("googleSignInDiv");
          if (parent) {
            // @ts-ignore
            window.google.accounts.id.renderButton(parent, {
              theme: "outline",
              size: "large",
              width: 350,
              text: "signin_with",
              shape: "rectangular",
            });
          }
        }
      };

      // Scriptin yüklendiğinden emin olmak için kısa bir bekleme
      const timeout = setTimeout(initGoogle, 300);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, loading]);

  const customersQuery = trpc.customers.list.useQuery(undefined, { enabled: isAuthenticated });
  const ticketsQuery = trpc.tickets.list.useQuery(undefined, { enabled: isAuthenticated });
  const overdueQuery = trpc.customers.getOverdue.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-foreground font-medium">Sistem Hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary-dark/40 p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/10">
          <CardHeader className="text-center">
            <div className="text-4xl font-bold text-primary mb-2 tracking-tight">D Bilişim</div>
            <CardTitle>IT Operasyon Sistemi</CardTitle>
            <CardDescription>Kurumsal hesabınızla devam edin</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 pb-8">
            {/* Google Render Alanı */}
            <div id="googleSignInDiv" className="min-h-[44px]"></div>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
                <span className="bg-card px-2">Veya</span>
              </div>
            </div>

            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              variant="outline"
              className="w-full hover:bg-primary/5"
              size="lg"
            >
              Klasik Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overdueCustomers = overdueQuery.data || [];
  const totalCustomers = customersQuery.data?.length || 0;
  const totalTickets = ticketsQuery.data?.length || 0;
  const openTickets = ticketsQuery.data?.filter((t) => t.durum === "Açık").length || 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">D Bilişim Çözümleri</h1>
            <p className="text-xs text-primary-foreground/70">IT & Finans Yönetimi</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline-block bg-white/10 px-3 py-1 rounded-full">
              {user?.name}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { logout(); navigate("/"); }}
              className="font-bold"
            >
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {overdueCustomers.length > 0 && (
          <div className="mb-8 p-4 bg-destructive/10 border-l-4 border-destructive rounded-r-lg flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <div>
              <h3 className="font-bold text-destructive">Ödeme Gecikmesi Mevcut</h3>
              <p className="text-sm opacity-90">{overdueCustomers.length} müşteri için aksiyon bekleniyor.</p>
            </div>
          </div>
        )}

        <div className="dashboard-grid mb-10">
          <StatCard title="Toplam Müşteri" value={totalCustomers} icon={<Users className="h-5 w-5" />} desc="Kayıtlı Firmalar" />
          <StatCard title="Aktif Ticket" value={totalTickets} icon={<Ticket className="h-5 w-5" />} desc={`${openTickets} Açık Durumda`} />
          <StatCard title="Riskli Bakiyeler" value={overdueCustomers.length} icon={<TrendingDown className="h-5 w-5" />} desc="Ödeme Bekleyenler" isAlert />
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-primary mb-6">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton onClick={() => navigate("/customers/new")} icon={<Plus />} label="Yeni Müşteri" color="bg-primary" />
            <QuickActionButton onClick={() => navigate("/tickets/new")} icon={<Ticket />} label="Yeni Ticket" color="bg-primary" />
            <QuickActionButton onClick={() => navigate("/proposals/new")} icon={<FileText />} label="Teklif Yaz" color="bg-primary" />
            <QuickActionButton onClick={() => navigate("/customers")} icon={<Users />} label="Müşteri Portföyü" color="bg-secondary" />
          </div>
        </section>

        {overdueCustomers.length > 0 && (
          <section className="animate-in fade-in duration-700">
            <h2 className="text-xl font-bold text-destructive mb-4">Gecikmiş Ödemeler Listesi</h2>
            <div className="grid gap-3">
              {overdueCustomers.map((customer) => (
                <div key={customer.id} className="card-overdue p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{customer.firmAdi}</h3>
                    <p className="text-sm font-semibold text-destructive">
                      Bakiye: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(customer.kalanBorc))}
                    </p>
                  </div>
                  <Button onClick={() => navigate(`/customers/${customer.id}`)} variant="outline" size="sm">İncele</Button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// Yardımcı Alt Bileşenler
function StatCard({ title, value, icon, desc, isAlert = false }: any) {
  return (
    <Card className={`transition-all hover:shadow-md ${isAlert ? 'border-destructive/50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold uppercase text-muted-foreground">{title}</CardTitle>
        <div className={isAlert ? 'text-destructive' : 'text-primary'}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${isAlert ? 'text-destructive' : 'text-primary'}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({ onClick, icon, label, color }: any) {
  return (
    <Button
      onClick={onClick}
      className={`h-auto py-6 flex flex-col gap-2 shadow-md hover:scale-[1.02] transition-transform ${color}`}
    >
      <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
      <span className="font-semibold text-xs sm:text-sm">{label}</span>
    </Button>
  );
}