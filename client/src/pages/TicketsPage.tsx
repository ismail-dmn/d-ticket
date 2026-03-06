import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ArrowLeft, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const priorityColors: Record<string, string> = {
  "Düşük": "badge-priority-dusuk",
  "Orta": "badge-priority-orta",
  "Yüksek": "badge-priority-yuksek",
  "KRİTİK": "badge-priority-kritik",
};

const statusIcons: Record<string, React.ReactNode> = {
  "Açık": <AlertCircle className="h-4 w-4" />,
  "Devam Ediyor": <Clock className="h-4 w-4" />,
  "Tamamlandı": <CheckCircle className="h-4 w-4" />,
};

const statusColors2: Record<string, string> = {
  "Açık": "badge-status-acik",
  "Devam Ediyor": "badge-status-devam",
  "Tamamlandı": "badge-status-tamamlandi",
};

export default function TicketsPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const ticketsQuery = trpc.tickets.list.useQuery(undefined, { enabled: isAuthenticated });
  const tickets = ticketsQuery.data || [];

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const openTickets = tickets.filter((t) => t.durum === "Açık");
  const inProgressTickets = tickets.filter((t) => t.durum === "Devam Ediyor");
  const completedTickets = tickets.filter((t) => t.durum === "Tamamlandı");

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
                <h1 className="text-3xl font-bold">Tickets</h1>
                <p className="text-primary-foreground/80">IT Arıza ve Servis Kayıtları</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/tickets/new")}
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Açık Tickets</p>
                  <p className="text-3xl font-bold text-foreground">{openTickets.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Devam Eden</p>
                  <p className="text-3xl font-bold text-foreground">{inProgressTickets.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tamamlanan</p>
                  <p className="text-3xl font-bold text-foreground">{completedTickets.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets List */}
        {ticketsQuery.isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Tickets yükleniyor...</p>
          </div>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Henüz ticket kaydı yok.</p>
              <Button
                onClick={() => navigate("/tickets/new")}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                İlk Ticket Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{ticket.baslik}</h3>
                        <span className="text-xs text-muted-foreground">#{ticket.ticketNo}</span>
                      </div>
                      {ticket.aciklama && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {ticket.aciklama}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`${priorityColors[ticket.oncelik]}`}>
                          {ticket.oncelik}
                        </span>
                        <span className={`${statusColors2[ticket.durum]} flex items-center gap-1`}>
                          {statusIcons[ticket.durum]}
                          {ticket.durum}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>
                        {new Date(ticket.createdAt).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
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
