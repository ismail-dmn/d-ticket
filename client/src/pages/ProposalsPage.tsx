import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ArrowLeft, FileText, Download } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const statusColors: Record<string, string> = {
  "Taslak": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  "Gönderildi": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Kabul Edildi": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Reddedildi": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function ProposalsPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const proposalsQuery = trpc.proposals.list.useQuery(undefined, { enabled: isAuthenticated });
  const proposals = proposalsQuery.data || [];

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const draftProposals = proposals.filter((p) => p.durum === "Taslak");
  const sentProposals = proposals.filter((p) => p.durum === "Gönderildi");
  const acceptedProposals = proposals.filter((p) => p.durum === "Kabul Edildi");

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
                <h1 className="text-3xl font-bold">Teklifler</h1>
                <p className="text-primary-foreground/80">D Bilişim Profesyonel Teklifler</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/proposals/new")}
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Teklif
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-gray-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taslak</p>
                  <p className="text-3xl font-bold text-foreground">{draftProposals.length}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gönderildi</p>
                  <p className="text-3xl font-bold text-foreground">{sentProposals.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kabul Edildi</p>
                  <p className="text-3xl font-bold text-foreground">{acceptedProposals.length}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proposals List */}
        {proposalsQuery.isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Teklifler yükleniyor...</p>
          </div>
        ) : proposals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Henüz teklif kaydı yok.</p>
              <Button
                onClick={() => navigate("/proposals/new")}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                İlk Teklifi Oluştur
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {proposals.map((proposal) => (
              <Card
                key={proposal.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/proposals/${proposal.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{proposal.baslik}</h3>
                        <span className="text-xs text-muted-foreground">{proposal.proposalNo}</span>
                      </div>
                      {proposal.aciklama && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {proposal.aciklama}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[proposal.durum]}`}>
                          {proposal.durum}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {proposal.gecerlilikBitisiTarihi
                            ? `Geçerlilik: ${new Date(proposal.gecerlilikBitisiTarihi).toLocaleDateString("tr-TR")}`
                            : `Geçerlilik: ${proposal.gecerlilikGunu} gün`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-2">
                        <p className="text-sm text-muted-foreground">Toplam Tutar</p>
                        <p className="text-2xl font-bold text-primary">
                          {parseFloat(proposal.tutarKdvDahil as any).toFixed(2)} TL
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          // PDF indirme işlemi
                        }}
                        className="mt-2"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
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
