import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus, FileText, Users, Ticket, TrendingDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Home() {
  const { user, loading, isAuthenticated, logout, refresh } = useAuth();
  const [, navigate] = useLocation();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Handle Google Sign-In response
  const handleGoogleResponse = async (response: any) => {
    if (!response.credential) {
      toast.error("Google authentication failed");
      return;
    }

    setIsAuthenticating(true);
    try {
      const res = await fetch("/api/oauth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Authentication failed");
      }

      const data = await res.json();
      toast.success(`Welcome, ${data.user.name}!`);

      // Refresh auth state
      await refresh();
    } catch (error) {
      console.error("Google authentication error:", error);
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
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
              width: "350",
            });
          }
        }
      };

      const timer = setTimeout(initGoogle, 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, refresh]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

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
            {/* Google Sign-In Button */}
            <div id="googleBtnDiv" className="min-h-[50px]"></div>

            {isAuthenticating && (
              <div className="text-center text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary inline-block mr-2"></div>
                Authenticating...
              </div>
            )}

            <div className="relative w-full text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <span className="relative bg-card px-2 text-xs text-muted-foreground uppercase">
                Alternatif
              </span>
            </div>

            <Button variant="ghost" className="w-full text-xs opacity-50 cursor-not-allowed">
              Kurumsal Kimlik (Devre Dışı)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hoş geldin, {user?.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            {user?.email}
          </p>
        </div>
        <Button variant="outline" onClick={() => logout()}>
          Çıkış Yap
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Müşteri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Yönetilen müşteriler</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Açık Ticketlar</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Çözüm bekleyen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teklifler</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Gönderilen teklifler</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ödenmemiş</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺0</div>
            <p className="text-xs text-muted-foreground">Toplam borç</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button onClick={() => navigate("/customers/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          Yeni Müşteri
        </Button>
        <Button onClick={() => navigate("/tickets/new")} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Yeni Ticket
        </Button>
        <Button onClick={() => navigate("/proposals/new")} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Yeni Teklif
        </Button>
      </div>
    </div>
  );
}
