import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Users, Ticket, TrendingDown } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Home() {
  const { user, loading, isAuthenticated, logout, refresh } = useAuth();
  const [, navigate] = useLocation();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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
            <CardDescription>Giriş yapmak için tıklayın</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-8">
            <Button
              className="w-full"
              disabled={isAuthenticating}
              onClick={async () => {
  setIsAuthenticating(true);
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    toast.success(`Hoş geldin, ${data.user.name}!`);
    await refresh();  // Bu zaten sayfayı authenticated state'e geçirir
  } catch {
    toast.error("Giriş başarısız");
  } finally {
    setIsAuthenticating(false);
  }
}}
            >
              {isAuthenticating ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
