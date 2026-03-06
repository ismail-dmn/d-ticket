import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Eye, EyeOff, Copy, Trash2, Edit2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

interface License {
  id: number;
  licenseType: string;
  productName: string;
  licenseKey: string;
  version?: string;
  expiryDate?: string;
  assignedTo?: string;
  notlar?: string;
}

interface MailAccount {
  id: number;
  emailAddress: string;
  password: string;
  mailServer?: string;
  imapPort?: number;
  smtpPort?: number;
  assignedTo?: string;
  notlar?: string;
}

interface FirewallIP {
  id: number;
  ipAddress: string;
  description?: string;
  purpose?: string;
  isActive: number;
  notlar?: string;
}

interface UserAccount {
  id: number;
  username: string;
  password: string;
  systemName?: string;
  email?: string;
  role?: string;
  isActive: number;
  lastLogin?: string;
  notlar?: string;
}

interface VaultNote {
  id: number;
  title: string;
  content: string;
  category?: string;
  priority: string;
  isConfidential: number;
  createdAt: string;
}

export default function CompanyVaultPage() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  // Örnek veriler
  const licenses: License[] = [
    {
      id: 1,
      licenseType: "Windows",
      productName: "Windows Server 2022",
      licenseKey: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      version: "2022",
      expiryDate: "2025-12-31",
      assignedTo: "Sunucu-01",
      notlar: "Veri merkezi sunucusu",
    },
    {
      id: 2,
      licenseType: "Office",
      productName: "Microsoft Office 365 Enterprise",
      licenseKey: "OFFICE-KEY-12345",
      version: "365",
      expiryDate: "2026-06-30",
      assignedTo: "Tüm Kullanıcılar",
      notlar: "Kurumsal lisans",
    },
  ];

  const mailAccounts: MailAccount[] = [
    {
      id: 1,
      emailAddress: "admin@company.com",
      password: "P@ssw0rd123!",
      mailServer: "mail.company.com",
      imapPort: 993,
      smtpPort: 587,
      assignedTo: "Sistem Yöneticisi",
      notlar: "Ana yönetici hesabı",
    },
  ];

  const firewallIPs: FirewallIP[] = [
    {
      id: 1,
      ipAddress: "192.168.1.100",
      description: "VPN Gateway",
      purpose: "VPN",
      isActive: 1,
      notlar: "Uzaktan erişim için",
    },
    {
      id: 2,
      ipAddress: "10.0.0.50",
      description: "Backup Server",
      purpose: "Backup",
      isActive: 1,
      notlar: "Günlük yedekleme",
    },
  ];

  const userAccounts: UserAccount[] = [
    {
      id: 1,
      username: "admin",
      password: "AdminP@ss123!",
      systemName: "Windows Server",
      email: "admin@company.com",
      role: "Administrator",
      isActive: 1,
      lastLogin: "2026-03-06T15:30:00",
      notlar: "Sistem yöneticisi",
    },
  ];

  const vaultNotes: VaultNote[] = [
    {
      id: 1,
      title: "Acil Durum İletişim",
      content: "Veri merkezi sorunu durumunda: IT Müdürü +90 555 1234567",
      category: "Teknik",
      priority: "KRİTİK",
      isConfidential: 1,
      createdAt: "2026-03-01T10:00:00",
    },
  ];

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopyalandı!`);
  };

  const renderPassword = (password: string, id: number) => {
    return showPasswords[id] ? password : "•".repeat(password.length);
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
              <h1 className="text-3xl font-bold">Şirket Profili Sanal Kasası</h1>
              <p className="text-primary-foreground/80">Lisans, hesap ve güvenlik bilgileri yönetimi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <Tabs defaultValue="licenses" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="licenses">Lisanslar</TabsTrigger>
            <TabsTrigger value="mail">Mail Hesapları</TabsTrigger>
            <TabsTrigger value="firewall">Güvenlik Duvarı</TabsTrigger>
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="notes">Notlar</TabsTrigger>
          </TabsList>

          {/* Lisanslar */}
          <TabsContent value="licenses" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Lisans Yönetimi</h2>
              <Button className="bg-primary hover:bg-primary-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Lisans
              </Button>
            </div>
            <div className="grid gap-4">
              {licenses.map((license) => (
                <Card key={license.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{license.productName}</h3>
                        <p className="text-sm text-muted-foreground">{license.licenseType}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-muted-foreground">Lisans Anahtarı:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{license.licenseKey}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(license.licenseKey, "Lisans anahtarı")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {license.expiryDate && (
                        <p>
                          <span className="text-muted-foreground">Sona Erme Tarihi:</span>{" "}
                          {new Date(license.expiryDate).toLocaleDateString("tr-TR")}
                        </p>
                      )}
                      {license.assignedTo && (
                        <p>
                          <span className="text-muted-foreground">Atanan:</span> {license.assignedTo}
                        </p>
                      )}
                      {license.notlar && (
                        <p>
                          <span className="text-muted-foreground">Notlar:</span> {license.notlar}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mail Hesapları */}
          <TabsContent value="mail" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Mail Hesapları</h2>
              <Button className="bg-primary hover:bg-primary-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Hesap
              </Button>
            </div>
            <div className="grid gap-4">
              {mailAccounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{account.emailAddress}</h3>
                        <p className="text-sm text-muted-foreground">{account.assignedTo}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-muted-foreground">Şifre:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {renderPassword(account.password, account.id)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => togglePasswordVisibility(account.id)}
                          >
                            {showPasswords[account.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(account.password, "Şifre")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {account.mailServer && (
                        <p>
                          <span className="text-muted-foreground">Mail Sunucusu:</span> {account.mailServer}
                        </p>
                      )}
                      {account.imapPort && (
                        <p>
                          <span className="text-muted-foreground">IMAP Port:</span> {account.imapPort}
                        </p>
                      )}
                      {account.notlar && (
                        <p>
                          <span className="text-muted-foreground">Notlar:</span> {account.notlar}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Güvenlik Duvarı */}
          <TabsContent value="firewall" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Güvenlik Duvarı IP Adresleri</h2>
              <Button className="bg-primary hover:bg-primary-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni IP
              </Button>
            </div>
            <div className="grid gap-4">
              {firewallIPs.map((ip) => (
                <Card key={ip.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold font-mono">{ip.ipAddress}</h3>
                        <p className="text-sm text-muted-foreground">{ip.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            ip.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {ip.isActive ? "Aktif" : "İnaktif"}
                        </span>
                        <Button size="sm" variant="outline">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {ip.purpose && (
                        <p>
                          <span className="text-muted-foreground">Amaç:</span> {ip.purpose}
                        </p>
                      )}
                      {ip.notlar && (
                        <p>
                          <span className="text-muted-foreground">Notlar:</span> {ip.notlar}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Kullanıcı Hesapları */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Sistem Kullanıcıları</h2>
              <Button className="bg-primary hover:bg-primary-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Kullanıcı
              </Button>
            </div>
            <div className="grid gap-4">
              {userAccounts.map((user) => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{user.username}</h3>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-muted-foreground">Şifre:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {renderPassword(user.password, user.id)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => togglePasswordVisibility(user.id)}
                          >
                            {showPasswords[user.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(user.password, "Şifre")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {user.systemName && (
                        <p>
                          <span className="text-muted-foreground">Sistem:</span> {user.systemName}
                        </p>
                      )}
                      {user.email && (
                        <p>
                          <span className="text-muted-foreground">Email:</span> {user.email}
                        </p>
                      )}
                      {user.lastLogin && (
                        <p>
                          <span className="text-muted-foreground">Son Giriş:</span>{" "}
                          {new Date(user.lastLogin).toLocaleString("tr-TR")}
                        </p>
                      )}
                      {user.notlar && (
                        <p>
                          <span className="text-muted-foreground">Notlar:</span> {user.notlar}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Notlar */}
          <TabsContent value="notes" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Önemli Notlar</h2>
              <Button className="bg-primary hover:bg-primary-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Not
              </Button>
            </div>
            <div className="grid gap-4">
              {vaultNotes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{note.title}</h3>
                        <p className="text-sm text-muted-foreground">{note.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            note.priority === "KRİTİK"
                              ? "bg-red-100 text-red-800"
                              : note.priority === "Yüksek"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {note.priority}
                        </span>
                        <Button size="sm" variant="outline">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
