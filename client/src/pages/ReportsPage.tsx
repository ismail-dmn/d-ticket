import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, BarChart3, TrendingUp, DollarSign, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

interface MonthlyData {
  month: string;
  tickets: number;
  revenue: number;
  expenses: number;
  profit: number;
}

interface YearlyData {
  year: number;
  tickets: number;
  revenue: number;
  expenses: number;
  profit: number;
}

export default function ReportsPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  // Örnek veriler
  const monthlyData: MonthlyData[] = [
    { month: "Ocak", tickets: 15, revenue: 45000, expenses: 12000, profit: 33000 },
    { month: "Şubat", tickets: 18, revenue: 52000, expenses: 14000, profit: 38000 },
    { month: "Mart", tickets: 22, revenue: 61000, expenses: 16000, profit: 45000 },
  ];

  const yearlyData: YearlyData[] = [
    { year: 2023, tickets: 180, revenue: 520000, expenses: 150000, profit: 370000 },
    { year: 2024, tickets: 245, revenue: 720000, expenses: 195000, profit: 525000 },
    { year: 2025, tickets: 85, revenue: 250000, expenses: 68000, profit: 182000 },
  ];

  const currentMonthStats = {
    totalTickets: 22,
    completedTickets: 18,
    totalRevenue: 61000,
    serviceRevenue: 38000,
    softwareRevenue: 23000,
    totalExpenses: 16000,
    netProfit: 45000,
  };

  const handleGenerateReport = async (type: "monthly" | "yearly") => {
    setIsGenerating(true);
    try {
      // PDF üretim API çağrısı yapılacak
      toast.success(`${type === "monthly" ? "Aylık" : "Yıllık"} rapor oluşturuldu!`);
    } catch (error) {
      toast.error("Rapor oluşturulamadı!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = (format: "pdf" | "excel") => {
    toast.success(`Rapor ${format.toUpperCase()} formatında indirildi!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="container py-6">
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
              <h1 className="text-3xl font-bold">Raporlar ve Analitics</h1>
              <p className="text-primary-foreground/80">Aylık ve yıllık firma raporları</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly">Aylık Rapor</TabsTrigger>
            <TabsTrigger value="yearly">Yıllık Rapor</TabsTrigger>
            <TabsTrigger value="analytics">Analitics</TabsTrigger>
          </TabsList>

          {/* Aylık Rapor */}
          <TabsContent value="monthly" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Toplam Ticket</p>
                      <p className="text-3xl font-bold">{currentMonthStats.totalTickets}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tamamlanan</p>
                      <p className="text-3xl font-bold">{currentMonthStats.completedTickets}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Toplam Gelir</p>
                      <p className="text-3xl font-bold">
                        {(currentMonthStats.totalRevenue / 1000).toFixed(0)}K TL
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Net Kar</p>
                      <p className="text-3xl font-bold text-green-600">
                        {(currentMonthStats.netProfit / 1000).toFixed(0)}K TL
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gelir Detayları */}
            <Card>
              <CardHeader>
                <CardTitle>Gelir Detayları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-muted-foreground">Hizmet Geliri</span>
                    <span className="font-semibold">
                      {currentMonthStats.serviceRevenue.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-muted-foreground">Yazılım/Lisans Geliri</span>
                    <span className="font-semibold">
                      {currentMonthStats.softwareRevenue.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded border border-primary">
                    <span className="font-semibold">Toplam Gelir</span>
                    <span className="font-bold text-primary">
                      {currentMonthStats.totalRevenue.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-muted-foreground">Giderler</span>
                    <span className="font-semibold text-red-600">
                      -{currentMonthStats.totalExpenses.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                    <span className="font-semibold">Net Kar</span>
                    <span className="font-bold text-green-600">
                      {currentMonthStats.netProfit.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aylık Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Son 3 Ay Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 font-semibold">Ay</th>
                        <th className="text-right py-2 px-2 font-semibold">Ticket</th>
                        <th className="text-right py-2 px-2 font-semibold">Gelir</th>
                        <th className="text-right py-2 px-2 font-semibold">Gider</th>
                        <th className="text-right py-2 px-2 font-semibold">Kar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((data, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted">
                          <td className="py-2 px-2">{data.month}</td>
                          <td className="text-right py-2 px-2">{data.tickets}</td>
                          <td className="text-right py-2 px-2">
                            {(data.revenue / 1000).toFixed(0)}K TL
                          </td>
                          <td className="text-right py-2 px-2 text-red-600">
                            {(data.expenses / 1000).toFixed(0)}K TL
                          </td>
                          <td className="text-right py-2 px-2 font-semibold text-green-600">
                            {(data.profit / 1000).toFixed(0)}K TL
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* İndirme Butonları */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleGenerateReport("monthly")}
                disabled={isGenerating}
                className="flex-1 bg-primary hover:bg-primary-dark text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGenerating ? "Oluşturuluyor..." : "Rapor Oluştur"}
              </Button>
              <Button
                onClick={() => handleDownloadReport("pdf")}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF İndir
              </Button>
              <Button
                onClick={() => handleDownloadReport("excel")}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Excel İndir
              </Button>
            </div>
          </TabsContent>

          {/* Yıllık Rapor */}
          <TabsContent value="yearly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Yıllık Gelir Karşılaştırması</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 font-semibold">Yıl</th>
                        <th className="text-right py-2 px-2 font-semibold">Ticket</th>
                        <th className="text-right py-2 px-2 font-semibold">Gelir</th>
                        <th className="text-right py-2 px-2 font-semibold">Gider</th>
                        <th className="text-right py-2 px-2 font-semibold">Kar</th>
                        <th className="text-right py-2 px-2 font-semibold">Kar Marjı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyData.map((data, index) => {
                        const margin = ((data.profit / data.revenue) * 100).toFixed(1);
                        return (
                          <tr key={index} className="border-b border-border hover:bg-muted">
                            <td className="py-2 px-2 font-semibold">{data.year}</td>
                            <td className="text-right py-2 px-2">{data.tickets}</td>
                            <td className="text-right py-2 px-2">
                              {(data.revenue / 1000).toFixed(0)}K TL
                            </td>
                            <td className="text-right py-2 px-2 text-red-600">
                              {(data.expenses / 1000).toFixed(0)}K TL
                            </td>
                            <td className="text-right py-2 px-2 font-semibold text-green-600">
                              {(data.profit / 1000).toFixed(0)}K TL
                            </td>
                            <td className="text-right py-2 px-2 font-semibold">%{margin}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Yıllık Özet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2024 Yıl Sonu Özet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toplam Gelir:</span>
                    <span className="font-semibold">720.000 TL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toplam Gider:</span>
                    <span className="font-semibold text-red-600">195.000 TL</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="font-semibold">Net Kar:</span>
                    <span className="font-bold text-green-600">525.000 TL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kar Marjı:</span>
                    <span className="font-semibold">72.9%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2025 Yıl Başı (Kısmi)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toplam Gelir:</span>
                    <span className="font-semibold">250.000 TL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toplam Gider:</span>
                    <span className="font-semibold text-red-600">68.000 TL</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="font-semibold">Net Kar:</span>
                    <span className="font-bold text-green-600">182.000 TL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kar Marjı:</span>
                    <span className="font-semibold">72.8%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* İndirme Butonları */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleGenerateReport("yearly")}
                disabled={isGenerating}
                className="flex-1 bg-primary hover:bg-primary-dark text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGenerating ? "Oluşturuluyor..." : "Rapor Oluştur"}
              </Button>
              <Button
                onClick={() => handleDownloadReport("pdf")}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF İndir
              </Button>
              <Button
                onClick={() => handleDownloadReport("excel")}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Excel İndir
              </Button>
            </div>
          </TabsContent>

          {/* Analitics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Bazlı Gelir Analizi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "ABC Şirketi", revenue: 45000, percentage: 18 },
                    { name: "XYZ Ltd.", revenue: 38000, percentage: 15 },
                    { name: "DEF Teknoloji", revenue: 35000, percentage: 14 },
                    { name: "GHI İşletme", revenue: 32000, percentage: 13 },
                    { name: "Diğer Müşteriler", revenue: 100000, percentage: 40 },
                  ].map((customer, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{customer.name}</span>
                        <span className="text-sm font-semibold">
                          {customer.revenue.toLocaleString("tr-TR")} TL ({customer.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${customer.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hizmet Kategorisi Bazlı Gelir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Yazılım Geliştirme", revenue: 95000, percentage: 38 },
                    { name: "Sistem Yönetimi", revenue: 72000, percentage: 29 },
                    { name: "Ağ Yönetimi", revenue: 48000, percentage: 19 },
                    { name: "Güvenlik Hizmetleri", revenue: 35000, percentage: 14 },
                  ].map((category, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm font-semibold">
                          {category.revenue.toLocaleString("tr-TR")} TL ({category.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
