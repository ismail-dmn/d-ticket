import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus, FileText, Users, Ticket, TrendingDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  // Google'dan gelen başarılı yanıt
  const handleGoogleResponse = (response: any) => {
    console.log("Google Token:", response.credential);
    // TODO: Burada backend tarafındaki Google login mutasyonunu çağırın
    // Örn: googleLoginMutation.mutate({ token: response.credential });
  };

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      const initGoogle = () => {
        // @ts-ignore
        if (window.google) {
          // @ts-ignore
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
          });

          const btnDiv = document.getElementById("googleBtnDiv");
          if (btnDiv) {
            // @ts-ignore
            window.google.accounts.id.renderButton(btnDiv, {
              theme: "outline",
              size: "large",
              width: "350", // Kart genişliğiyle uyumlu
            });
          }
        }
      };
      
      const timer = setTimeout(initGoogle, 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading]);

  if (loading) return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30 p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20">
          <CardHeader className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">D Bilişim</div>
            <CardTitle>IT Operasyon Sistemi</CardTitle>
            <CardDescription>Google hesabınızla güvenli giriş yapın</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 pb-8">
            {/* Google Butonu - Manus'u baypas eder */}
            <div id="googleBtnDiv" className="min-h-[50px]"></div>

            <div className="relative w-full text-center">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <span className="relative bg-card px-2 text-xs text-muted-foreground uppercase">Alternatif</span>
            </div>

            <Button variant="ghost" className="w-full text-xs opacity-50 cursor-not-allowed">
              Kurumsal Kimlik (Devre Dışı)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ... (Giriş sonrası Dashboard kodları - Mevcut kodunuzu buraya ekleyebilirsiniz)
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Hoş geldin, {user?.name}</h1>
      <Button onClick={() => logout()}>Çıkış Yap</Button>
    </div>
  );
}