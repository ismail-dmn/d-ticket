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

  // Google Giriş Yanıtını İşleme
  const handleGoogleResponse = (response: any) => {
    console.log("Google JWT ID Token:", response.credential);
    /**
     * TODO: Burada backend tarafındaki tRPC mutasyonunu çağıracağız.
     * Örn: loginWithGoogle.mutate({ token: response.credential });
     */
  };

  useEffect(() => {
    // Sadece kullanıcı giriş yapmamışsa ve yükleme bitmişse Google butonunu hazırla
    if (!isAuthenticated && !loading) {
      /* global google */
      const initializeGoogle = () => {
        // @ts-ignore
        if (typeof google !== 'undefined') {
          // @ts-ignore
          google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // @ts-ignore
          google.accounts.id.renderButton(
            document.getElementById("googleSignInDiv"),
            { 
              theme: "outline", 
              size: "large", 
              width: "350", // Kart genişliğine uygun
              text: "signin_with",
              shape: "rectangular" 
            }
          );
        }
      };

      // Script'in yüklendiğinden emin olmak için küçük bir gecikme veya kontrol
      const timer = setTimeout(initializeGoogle, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading]);

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

  // GİRİŞ YAPILMAMIŞ EKRANI (Güncellendi)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">D Bilişim</div>
            <CardTitle>IT Operasyon Sistemi</CardTitle>
            <CardDescription>Müşteri ve Ticket Yönetimi</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 pb-8">
            <p className="text-sm text-muted-foreground text-center">
              Sisteme erişmek için Google hesabınızla veya kurumsal bilgilerinizle giriş yapın.
            </p>
            
            {/* Google Buton Konteynırı */}
            <div id="googleSignInDiv" className="min-h-[50px] flex items-center justify-center"></div>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
              <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
                <span className="bg-card px-2">Veya</span>
              </div>
            </div>

            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              variant="secondary"
              className="w-full hover:bg-secondary-dark"
              size="lg"
            >
              Klasik Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ödeme gecikmiş müşteriler ve özet veriler
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
              <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
                {user?.name || "Kullanıcı"}
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-white border-white hover:bg-white hover:text-primary transition-colors"
              >
                Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container py-8">
        {/* Ödeme Gecikmiş Uyarısı */}
        {overdueCustomers.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border-l-4 border-destructive rounded-r-lg shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive">Ödeme Gecikmiş Müşteriler</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {overdueCustomers.length} müşterinin ödemesi gecikmiştir. Lütfen finans panelinden kontrol edin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Özet Kartları */}
        <div className="dashboard-grid mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider">Toplam Müşteri</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Aktif portföy</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider">Toplam Ticket</CardTitle>
              <Ticket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalTickets}</div>
              <p className="text-xs text-muted-foreground">{openTickets} adet bekleyen talep</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-destructive">Risk Durumu</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{overdueCustomers.length}</div>
              <p className="text-xs text-muted-foreground">Ödeme bekleyen firma</p>
            </CardContent>
          </Card>
        </div>

        {/* Hızlı İşlemler Bölümü */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
             <Plus className="h-5 w-5" /> Hızlı İşlemler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate("/customers/new")}
              className="h-auto py-8 flex flex-col items-center gap-3 bg-primary hover:bg-primary-dark shadow-lg transition-transform hover:-translate-y-1"
            >
              <Plus className="h-8 w-8" />
              <span className="font-semibold">Yeni Müşteri</span>
            </Button>
            <Button
              onClick={() => navigate("/tickets/new")}
              className="h-auto py-8 flex flex-col items-center gap-3 bg-primary hover:bg-primary-dark shadow-lg transition-transform hover:-translate-y-1"
            >
              <Ticket className="h-8 w-8" />
              <span className="font-semibold">Yeni Ticket</span>
            </Button>
            <Button
              onClick={() => navigate("/proposals/new")}
              className="h-auto py-8 flex flex-col items-center gap-3 bg-primary hover:bg-primary-dark shadow-lg transition-transform hover:-translate-y-1"
            >
              <FileText className="h-8 w-8" />
              <span className="font-semibold">Teklif Oluştur</span>
            </Button>
            <Button
              onClick={() => navigate("/customers")}
              className="h-auto py-8 flex flex-col items-center gap-3 bg-secondary hover:bg-secondary-dark shadow-lg transition-transform hover:-translate-y-1"
            >
              <Users className="h-8 w-8" />
              <span className="font-semibold">Müşteri Listesi</span>
            </Button>
          </div>
        </div>

        {/* Alt Liste: Gecikmiş Ödemeler */}
        {overdueCustomers.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-destructive mb-4">Ödeme Hatırlatması Gerekenler</h2>
            <div className="grid gap-3">
              {overdueCustomers.map((customer) => (
                <div key={customer.id} className="card-overdue p-4 rounded-xl flex items-center justify-between group hover:scale-[1.01] transition-all">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{customer.firmAdi}</h3>
                    <div className="flex gap-4 mt-1">
                      <span className="text-sm font-medium text-destructive">
                        Bakiye: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(parseFloat(customer.kalanBorc as any) || 0)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    variant="ghost"
                    className="bg-white/50 hover:bg-white text-destructive font-bold"
                  >
                    Müşteri Kartını Aç
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}