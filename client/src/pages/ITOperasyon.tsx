import { useState, useEffect } from "react";
import {
  Users, Ticket, FileText, CreditCard, Lock, BarChart2,
  Plus, Trash2, Edit2, Save, X, CheckCircle, Clock, AlertCircle,
  ChevronDown, ChevronUp, Building2, Phone, Mail, MapPin,
  Key, Wifi, Shield, Server, Tag, Calendar, TrendingUp,
  DollarSign, Bell, Eye, EyeOff, Printer, Download, ArrowRight,
  Activity, Package, LayoutDashboard
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Musteri = {
  id: string;
  firmaAdi: string;
  yetkili: string;
  telefon: string;
  email: string;
  adres: string;
  abonelikTuru: "Aylık" | "Yıllık" | "Tek Seferlik";
  abonelikUcreti: number;
  abonelikBaslangic: string;
  sonOdemeTarihi: string;
  toplamBakim: number;
  odemeDurumu: "Ödendi" | "Bekliyor" | "Gecikmiş";
};

type Ticket = {
  id: string;
  musteriId: string;
  baslik: string;
  aciklama: string;
  oncelik: "Düşük" | "Orta" | "Yüksek" | "Kritik";
  durum: "Açık" | "İşlemde" | "Çözüldü" | "Kapalı";
  olusturmaTarihi: string;
  cozumTarihi?: string;
  teknikNot: string;
  atananKisi: string;
};

type TeklifItem = { id: string; aciklama: string; miktar: number; birimFiyat: number };
type Teklif = {
  id: string;
  musteriId: string;
  teklifNo: number;
  tarih: string;
  kalemler: TeklifItem[];
  kdvOrani: number;
  durum: "Taslak" | "Gönderildi" | "Onaylandı" | "Reddedildi";
};

type Odeme = {
  id: string;
  musteriId: string;
  tutar: number;
  tarih: string;
  aciklama: string;
  tur: "Nakit" | "EFT/Havale" | "Kredi Kartı";
};

type KasaItem = {
  id: string;
  musteriId: string;
  tur: "Lisans" | "Mail" | "Firewall" | "Modem" | "Sunucu" | "Diğer";
  baslik: string;
  kullanici: string;
  sifre: string;
  notlar: string;
};

// ─── Demo Data ────────────────────────────────────────────────────────────────

const demoMusteriler: Musteri[] = [
  { id: "1", firmaAdi: "Alfa Tekstil A.Ş.", yetkili: "Mehmet Yılmaz", telefon: "0532 111 2233", email: "it@alfatekstil.com", adres: "İkitelli OSB, İstanbul", abonelikTuru: "Aylık", abonelikUcreti: 3500, abonelikBaslangic: "2024-01-01", sonOdemeTarihi: "2025-03-01", toplamBakim: 42000, odemeDurumu: "Ödendi" },
  { id: "2", firmaAdi: "Beta Lojistik Ltd.", yetkili: "Ayşe Kara", telefon: "0533 222 3344", email: "info@betaloj.com", adres: "Esenyurt, İstanbul", abonelikTuru: "Aylık", abonelikUcreti: 2800, abonelikBaslangic: "2024-03-15", sonOdemeTarihi: "2025-03-15", toplamBakim: 28000, odemeDurumu: "Bekliyor" },
  { id: "3", firmaAdi: "Gamma Gıda Paz.", yetkili: "Ali Demir", telefon: "0534 333 4455", email: "ali@gammagida.com", adres: "Bağcılar, İstanbul", abonelikTuru: "Yıllık", abonelikUcreti: 24000, abonelikBaslangic: "2023-06-01", sonOdemeTarihi: "2024-06-01", toplamBakim: 48000, odemeDurumu: "Gecikmiş" },
];

const demoTickets: Ticket[] = [
  { id: "T001", musteriId: "1", baslik: "Sunucu erişim sorunu", aciklama: "Çalışanlar sabahtan beri sunucuya bağlanamıyor.", oncelik: "Kritik", durum: "İşlemde", olusturmaTarihi: "2025-03-20", teknikNot: "DNS cache temizlendi, kontrol ediliyor.", atananKisi: "Dursun B." },
  { id: "T002", musteriId: "2", baslik: "Yazıcı paylaşım hatası", aciklama: "Muhasebe departmanı yazıcıyı göremüyor.", oncelik: "Orta", durum: "Açık", olusturmaTarihi: "2025-03-21", teknikNot: "", atananKisi: "" },
  { id: "T003", musteriId: "1", baslik: "Mail kurulumu", aciklama: "2 yeni çalışanın mail kurulumu yapılacak.", oncelik: "Düşük", durum: "Çözüldü", olusturmaTarihi: "2025-03-18", cozumTarihi: "2025-03-19", teknikNot: "Outlook ve mobil kurulumu tamamlandı.", atananKisi: "Dursun B." },
  { id: "T004", musteriId: "3", baslik: "Firewall erişim izni", aciklama: "Yeni ofis için VPN açılacak.", oncelik: "Yüksek", durum: "Açık", olusturmaTarihi: "2025-03-22", teknikNot: "", atananKisi: "" },
];

const demoOdemeler: Odeme[] = [
  { id: "O1", musteriId: "1", tutar: 3500, tarih: "2025-03-01", aciklama: "Mart bakım ücreti", tur: "EFT/Havale" },
  { id: "O2", musteriId: "2", tutar: 2800, tarih: "2025-02-15", aciklama: "Şubat bakım ücreti", tur: "Nakit" },
  { id: "O3", musteriId: "1", tutar: 1200, tarih: "2025-03-10", aciklama: "Ekstra destek", tur: "Kredi Kartı" },
];

const demoKasa: KasaItem[] = [
  { id: "K1", musteriId: "1", tur: "Lisans", baslik: "Microsoft 365 Business", kullanici: "admin@alfatekstil.com", sifre: "Alfa2024!", notlar: "25 kullanıcı lisansı, yıllık yenileme Ocak" },
  { id: "K2", musteriId: "1", tur: "Firewall", baslik: "Fortigate 60F", kullanici: "admin", sifre: "Fort!gate#60", notlar: "IP: 192.168.1.1 | Firmware: 7.2.3" },
  { id: "K3", musteriId: "2", tur: "Mail", baslik: "cPanel Mail Sunucu", kullanici: "info@betaloj.com", sifre: "Beta@Mail22", notlar: "Sunucu: mail.betaloj.com | Port: 587" },
  { id: "K4", musteriId: "3", tur: "Modem", baslik: "Turkcell Superbox", kullanici: "admin", sifre: "Gamma2023", notlar: "MAC: AA:BB:CC:DD:EE:FF" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPara = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2 }) + " ₺";
const oncelikRenk: Record<string, string> = { Düşük: "#22c55e", Orta: "#f59e0b", Yüksek: "#ef4444", Kritik: "#7c3aed" };
const durumRenk: Record<string, string> = { Açık: "#ef4444", İşlemde: "#f59e0b", Çözüldü: "#22c55e", Kapalı: "#6b7280" };
const odemeDurumRenk: Record<string, string> = { Ödendi: "#22c55e", Bekliyor: "#f59e0b", Gecikmiş: "#ef4444" };
const kasaTurIcon: Record<string, any> = { Lisans: Tag, Mail: Mail, Firewall: Shield, Modem: Wifi, Sunucu: Server, Diğer: Key };

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function ITOperasyon() {
  const [aktifSayfa, setAktifSayfa] = useState<"dashboard" | "musteriler" | "tickets" | "teklifler" | "odemeler" | "kasa" | "raporlar">("dashboard");
  const [musteriler, setMusteriler] = useState<Musteri[]>(demoMusteriler);
  const [tickets, setTickets] = useState<Ticket[]>(demoTickets);
  const [odemeler, setOdemeler] = useState<Odeme[]>(demoOdemeler);
  const [kasaItems, setKasaItems] = useState<KasaItem[]>(demoKasa);
  const [teklifler, setTeklifler] = useState<Teklif[]>([]);
  const [secilenMusteri, setSecilenMusteri] = useState<Musteri | null>(null);
  const [secilenTicket, setSecilenTicket] = useState<Ticket | null>(null);
  const [sifreGorunenler, setSifreGorunenler] = useState<Set<string>>(new Set());
  const [sidebarAcik, setSidebarAcik] = useState(true);

  // Ticket form
  const [yeniTicket, setYeniTicket] = useState<Partial<Ticket>>({});
  const [ticketFormAcik, setTicketFormAcik] = useState(false);

  // Musteri form
  const [musteriForm, setMusteriForm] = useState<Partial<Musteri>>({});
  const [musteriFormAcik, setMusteriFormAcik] = useState(false);

  // Odeme form
  const [odemeForm, setOdemeForm] = useState<Partial<Odeme>>({});
  const [odemeFormAcik, setOdemeFormAcik] = useState(false);

  // Kasa form
  const [kasaForm, setKasaForm] = useState<Partial<KasaItem>>({});
  const [kasaFormAcik, setKasaFormAcik] = useState(false);

  // Teklif form
  const [teklifForm, setTeklifForm] = useState<Partial<Teklif>>({ kalemler: [{ id: "1", aciklama: "", miktar: 1, birimFiyat: 0 }], kdvOrani: 20 });
  const [teklifFormAcik, setTeklifFormAcik] = useState(false);

  const getMusteriAdi = (id: string) => musteriler.find(m => m.id === id)?.firmaAdi || "Bilinmiyor";

  const toggleSifre = (id: string) => {
    setSifreGorunenler(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Stats
  const toplamGelir = odemeler.reduce((s, o) => s + o.tutar, 0);
  const toplamBorc = musteriler.filter(m => m.odemeDurumu !== "Ödendi").reduce((s, m) => s + m.abonelikUcreti, 0);
  const acikTicket = tickets.filter(t => t.durum === "Açık" || t.durum === "İşlemde").length;
  const gecikmisMusteriler = musteriler.filter(m => m.odemeDurumu === "Gecikmiş").length;

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "musteriler", label: "Müşteriler", icon: Users },
    { key: "tickets", label: "Ticket Sistemi", icon: Ticket },
    { key: "teklifler", label: "Teklifler", icon: FileText },
    { key: "odemeler", label: "Ödeme Takibi", icon: CreditCard },
    { key: "kasa", label: "Şirket Kasası", icon: Lock },
    { key: "raporlar", label: "Raporlar", icon: BarChart2 },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: sidebarAcik ? 240 : 64, background: "#0B1E33", transition: "width 0.3s", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          {sidebarAcik && (
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>D BİLİŞİM</div>
              <div style={{ color: "#64a0c8", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>IT Operasyon</div>
            </div>
          )}
          <button onClick={() => setSidebarAcik(!sidebarAcik)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#64a0c8", cursor: "pointer", padding: 4 }}>
            {sidebarAcik ? <ChevronDown size={16} style={{ transform: "rotate(90deg)" }} /> : <ChevronDown size={16} style={{ transform: "rotate(-90deg)" }} />}
          </button>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const aktif = aktifSayfa === item.key;
            return (
              <button key={item.key} onClick={() => setAktifSayfa(item.key as any)}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, background: aktif ? "rgba(100,160,200,0.18)" : "none", color: aktif ? "#64a0c8" : "rgba(255,255,255,0.6)", fontWeight: aktif ? 700 : 400, fontSize: 13, textAlign: "left", transition: "all 0.15s" }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarAcik && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
          {sidebarAcik && "v1.0 © 2025 D Bilişim"}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#0B1E33" }}>{navItems.find(n => n.key === aktifSayfa)?.label}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>D Bilişim Çözümleri — IT Operasyon Yönetim Sistemi</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {gecikmisMusteriler > 0 && (
              <div style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                <Bell size={13} /> {gecikmisMusteriler} gecikmiş ödeme
              </div>
            )}
            <div style={{ background: "#0B1E33", color: "#fff", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 700 }}>
              Dursun B.
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>

          {/* ── DASHBOARD ── */}
          {aktifSayfa === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Toplam Müşteri", val: musteriler.length, icon: Users, color: "#0B1E33", sub: `${musteriler.filter(m => m.odemeDurumu === "Gecikmiş").length} gecikmiş` },
                  { label: "Açık Ticketlar", val: acikTicket, icon: Ticket, color: "#7c3aed", sub: `${tickets.filter(t => t.oncelik === "Kritik" && t.durum !== "Çözüldü").length} kritik` },
                  { label: "Aylık Gelir", val: formatPara(toplamGelir), icon: TrendingUp, color: "#059669", sub: "Bu ay tahsilat" },
                  { label: "Bekleyen Borç", val: formatPara(toplamBorc), icon: AlertCircle, color: "#dc2626", sub: "Tahsil edilmedi" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, marginBottom: 4 }}>{s.label}</div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{s.val}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{s.sub}</div>
                        </div>
                        <div style={{ background: s.color, borderRadius: 10, padding: 10 }}>
                          <Icon size={20} color="#fff" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Son Ticketlar */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Son Ticketlar</div>
                    <button onClick={() => setAktifSayfa("tickets")} style={{ fontSize: 12, color: "#0B1E33", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>Tümü <ArrowRight size={13} /></button>
                  </div>
                  {tickets.slice(0, 4).map(t => (
                    <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: oncelikRenk[t.oncelik], flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{t.baslik}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{getMusteriAdi(t.musteriId)}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: durumRenk[t.durum] + "20", color: durumRenk[t.durum] }}>{t.durum}</span>
                    </div>
                  ))}
                </div>

                {/* Müşteri Ödeme Durumu */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 16 }}>Ödeme Durumu</div>
                  {musteriler.map(m => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <Building2 size={16} color="#94a3b8" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{m.firmaAdi}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{formatPara(m.abonelikUcreti)} / {m.abonelikTuru}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: odemeDurumRenk[m.odemeDurumu] + "20", color: odemeDurumRenk[m.odemeDurumu] }}>{m.odemeDurumu}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── MÜŞTERİLER ── */}
          {aktifSayfa === "musteriler" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#64748b" }}>{musteriler.length} müşteri kayıtlı</div>
                <button onClick={() => { setMusteriForm({ abonelikTuru: "Aylık", odemeDurumu: "Bekliyor" }); setMusteriFormAcik(true); setSecilenMusteri(null); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#0B1E33", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  <Plus size={15} /> Yeni Müşteri
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                {musteriler.map(m => (
                  <div key={m.id} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderTop: `3px solid ${odemeDurumRenk[m.odemeDurumu]}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{m.firmaAdi}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{m.yetkili}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: odemeDurumRenk[m.odemeDurumu] + "20", color: odemeDurumRenk[m.odemeDurumu] }}>{m.odemeDurumu}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", fontSize: 12, marginBottom: 14 }}>
                      <div style={{ color: "#94a3b8" }}>📞 {m.telefon}</div>
                      <div style={{ color: "#94a3b8" }}>✉️ {m.email}</div>
                      <div style={{ color: "#94a3b8" }}>💼 {m.abonelikTuru}</div>
                      <div style={{ color: "#0f172a", fontWeight: 700 }}>{formatPara(m.abonelikUcreti)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { setMusteriForm(m); setSecilenMusteri(m); setMusteriFormAcik(true); }}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#f1f5f9", color: "#0B1E33", border: "none", borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        <Edit2 size={13} /> Düzenle
                      </button>
                      <button onClick={() => { setAktifSayfa("tickets"); }}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#0B1E33", color: "#fff", border: "none", borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        <Ticket size={13} /> Ticketları
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Musteri Form Modal */}
              {musteriFormAcik && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                  <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 560, maxHeight: "90vh", overflowY: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{secilenMusteri ? "Müşteri Düzenle" : "Yeni Müşteri"}</div>
                      <button onClick={() => setMusteriFormAcik(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[
                        { label: "Firma Adı *", field: "firmaAdi", full: true },
                        { label: "Yetkili Kişi", field: "yetkili" },
                        { label: "Telefon", field: "telefon" },
                        { label: "E-posta", field: "email" },
                        { label: "Adres", field: "adres", full: true },
                        { label: "Abonelik Ücreti (₺)", field: "abonelikUcreti", type: "number" },
                        { label: "Abonelik Başlangıç", field: "abonelikBaslangic", type: "date" },
                        { label: "Son Ödeme Tarihi", field: "sonOdemeTarihi", type: "date" },
                      ].map((f: any) => (
                        <div key={f.field} style={{ gridColumn: f.full ? "1 / -1" : undefined }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>{f.label}</label>
                          <input type={f.type || "text"} value={(musteriForm as any)[f.field] || ""} onChange={e => setMusteriForm({ ...musteriForm, [f.field]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                            style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                        </div>
                      ))}
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Abonelik Türü</label>
                        <select value={musteriForm.abonelikTuru || "Aylık"} onChange={e => setMusteriForm({ ...musteriForm, abonelikTuru: e.target.value as any })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
                          {["Aylık", "Yıllık", "Tek Seferlik"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Ödeme Durumu</label>
                        <select value={musteriForm.odemeDurumu || "Bekliyor"} onChange={e => setMusteriForm({ ...musteriForm, odemeDurumu: e.target.value as any })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
                          {["Ödendi", "Bekliyor", "Gecikmiş"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                      <button onClick={() => setMusteriFormAcik(false)} style={{ flex: 1, padding: "10px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13 }}>İptal</button>
                      <button onClick={() => {
                        if (secilenMusteri) {
                          setMusteriler(musteriler.map(m => m.id === secilenMusteri.id ? { ...m, ...musteriForm } as Musteri : m));
                        } else {
                          const yeni: Musteri = { ...musteriForm, id: Date.now().toString(), toplamBakim: 0 } as Musteri;
                          setMusteriler([...musteriler, yeni]);
                        }
                        setMusteriFormAcik(false);
                      }} style={{ flex: 2, padding: "10px", background: "#0B1E33", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                        <Save size={14} style={{ marginRight: 6, verticalAlign: "middle" }} /> Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TİCKETLAR ── */}
          {aktifSayfa === "tickets" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Tümü", "Açık", "İşlemde", "Çözüldü"].map(d => (
                    <span key={d} style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: "#f1f5f9", color: "#475569", cursor: "pointer" }}>{d} {d === "Tümü" ? `(${tickets.length})` : `(${tickets.filter(t => t.durum === d).length})`}</span>
                  ))}
                </div>
                <button onClick={() => { setYeniTicket({ oncelik: "Orta", durum: "Açık", olusturmaTarihi: new Date().toISOString().split("T")[0], teknikNot: "" }); setTicketFormAcik(true); setSecilenTicket(null); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#0B1E33", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  <Plus size={15} /> Yeni Ticket
                </button>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0B1E33", color: "#fff" }}>
                      {["#", "Başlık", "Müşteri", "Öncelik", "Durum", "Tarih", "Atanan", ""].map(h => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t, i) => (
                      <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>{t.id}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{t.baslik}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{t.aciklama.slice(0, 45)}{t.aciklama.length > 45 ? "..." : ""}</div>
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569" }}>{getMusteriAdi(t.musteriId)}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: oncelikRenk[t.oncelik] + "20", color: oncelikRenk[t.oncelik] }}>{t.oncelik}</span>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: durumRenk[t.durum] + "20", color: durumRenk[t.durum] }}>{t.durum}</span>
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569" }}>{t.olusturmaTarihi}</td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569" }}>{t.atananKisi || "—"}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <button onClick={() => { setYeniTicket(t); setSecilenTicket(t); setTicketFormAcik(true); }}
                            style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: "#0B1E33" }}>
                            <Edit2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Ticket Form Modal */}
              {ticketFormAcik && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                  <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 580, maxHeight: "90vh", overflowY: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{secilenTicket ? "Ticket Düzenle" : "Yeni Ticket"}</div>
                      <button onClick={() => setTicketFormAcik(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Müşteri *</label>
                        <select value={yeniTicket.musteriId || ""} onChange={e => setYeniTicket({ ...yeniTicket, musteriId: e.target.value })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
                          <option value="">Seçiniz...</option>
                          {musteriler.map(m => <option key={m.id} value={m.id}>{m.firmaAdi}</option>)}
                        </select>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Başlık *</label>
                        <input value={yeniTicket.baslik || ""} onChange={e => setYeniTicket({ ...yeniTicket, baslik: e.target.value })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, boxSizing: "border-box" }} />
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Açıklama</label>
                        <textarea value={yeniTicket.aciklama || ""} onChange={e => setYeniTicket({ ...yeniTicket, aciklama: e.target.value })} rows={3}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Öncelik</label>
                        <select value={yeniTicket.oncelik || "Orta"} onChange={e => setYeniTicket({ ...yeniTicket, oncelik: e.target.value as any })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
                          {["Düşük", "Orta", "Yüksek", "Kritik"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Durum</label>
                        <select value={yeniTicket.durum || "Açık"} onChange={e => setYeniTicket({ ...yeniTicket, durum: e.target.value as any })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
                          {["Açık", "İşlemde", "Çözüldü", "Kapalı"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Atanan Kişi</label>
                        <input value={yeniTicket.atananKisi || ""} onChange={e => setYeniTicket({ ...yeniTicket, atananKisi: e.target.value })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Tarih</label>
                        <input type="date" value={yeniTicket.olusturmaTarihi || ""} onChange={e => setYeniTicket({ ...yeniTicket, olusturmaTarihi: e.target.value })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, boxSizing: "border-box" }} />
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Teknik Notlar / Çözüm</label>
                        <textarea value={yeniTicket.teknikNot || ""} onChange={e => setYeniTicket({ ...yeniTicket, teknikNot: e.target.value })} rows={3}
                          placeholder="Yapılan işlemler, çözüm adımları..."
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "monospace" }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                      <button onClick={() => setTicketFormAcik(false)} style={{ flex: 1, padding: "10px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13 }}>İptal</button>
                      {secilenTicket && (
                        <button onClick={() => { setTickets(tickets.filter(t => t.id !== secilenTicket.id)); setTicketFormAcik(false); }}
                          style={{ padding: "10px 16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                          <Trash2 size={13} style={{ verticalAlign: "middle" }} />
                        </button>
                      )}
                      <button onClick={() => {
                        if (secilenTicket) {
                          setTickets(tickets.map(t => t.id === secilenTicket.id ? { ...t, ...yeniTicket } as Ticket : t));
                        } else {
                          const id = `T${String(tickets.length + 1).padStart(3, "0")}`;
                          setTickets([...tickets, { ...yeniTicket, id } as Ticket]);
                        }
                        setTicketFormAcik(false);
                      }} style={{ flex: 2, padding: "10px", background: "#0B1E33", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                        <Save size={14} style={{ marginRight: 6, verticalAlign: "middle" }} /> Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TEKLİFLER ── */}
          {aktifSayfa === "teklifler" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#64748b" }}>{teklifler.length} teklif oluşturuldu</div>
                <button onClick={() => { setTeklifForm({ kalemler: [{ id: "1", aciklama: "", miktar: 1, birimFiyat: 0 }], kdvOrani: 20, tarih: new Date().toISOString().split("T")[0], durum: "Taslak", teklifNo: teklifler.length + 100 }); setTeklifFormAcik(true); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#0B1E33", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  <Plus size={15} /> Yeni Teklif
                </button>
              </div>

              {teklifler.length === 0 && (
                <div style={{ background: "#fff", borderRadius: 12, padding: 60, textAlign: "center", color: "#94a3b8", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <FileText size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Henüz teklif yok</div>
                  <div style={{ fontSize: 13 }}>Yeni teklif oluşturmak için butona tıklayın.</div>
                </div>
              )}

              <div style={{ display: "grid", gap: 12 }}>
                {teklifler.map(tk => {
                  const ara = tk.kalemler.reduce((s, k) => s + k.miktar * k.birimFiyat, 0);
                  const kdv = ara * (tk.kdvOrani / 100);
                  return (
                    <div key={tk.id} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ background: "#0B1E33", color: "#fff", borderRadius: 8, padding: "10px 14px", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>#{tk.teklifNo}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "#1e293b" }}>{getMusteriAdi(tk.musteriId)}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{tk.tarih} · {tk.kalemler.length} kalem</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{formatPara(ara + kdv)}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>KDV dahil</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: { Taslak: "#f1f5f9", Gönderildi: "#dbeafe", Onaylandı: "#dcfce7", Reddedildi: "#fee2e2" }[tk.durum], color: { Taslak: "#475569", Gönderildi: "#1d4ed8", Onaylandı: "#15803d", Reddedildi: "#dc2626" }[tk.durum] }}>{tk.durum}</span>
                    </div>
                  );
                })}
              </div>

              {/* Teklif Form Modal */}
              {teklifFormAcik && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                  <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 640, maxHeight: "90vh", overflowY: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>Yeni Teklif #{teklifForm.teklifNo}</div>
                      <button onClick={() => setTeklifFormAcik(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Müşteri *</label>
                        <select value={teklifForm.musteriId || ""} onChange={e => setTeklifForm({ ...teklifForm, musteriId: e.target.value })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
                          <option value="">Seçiniz...</option>
                          {musteriler.map(m => <option key={m.id} value={m.id}>{m.firmaAdi}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Tarih</label>
                        <input type="date" value={teklifForm.tarih || ""} onChange={e => setTeklifForm({ ...teklifForm, tarih: e.target.value })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>KDV Oranı (%)</label>
                        <input type="number" value={teklifForm.kdvOrani || 20} onChange={e => setTeklifForm({ ...teklifForm, kdvOrani: Number(e.target.value) })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, boxSizing: "border-box" }} />
                      </div>
                    </div>

                    {/* Kalemler */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 10 }}>Teklif Kalemleri</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 30px", gap: 6, marginBottom: 6 }}>
                        {["Açıklama", "Miktar", "Birim Fiyat", ""].map(h => (
                          <div key={h} style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>{h}</div>
                        ))}
                      </div>
                      {(teklifForm.kalemler || []).map((k, i) => (
                        <div key={k.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 30px", gap: 6, marginBottom: 6 }}>
                          <input value={k.aciklama} onChange={e => { const ks = [...(teklifForm.kalemler || [])]; ks[i] = { ...k, aciklama: e.target.value }; setTeklifForm({ ...teklifForm, kalemler: ks }); }}
                            placeholder="Açıklama" style={{ border: "1.5px solid #e2e8f0", borderRadius: 7, padding: "7px 10px", fontSize: 13 }} />
                          <input type="number" value={k.miktar} onChange={e => { const ks = [...(teklifForm.kalemler || [])]; ks[i] = { ...k, miktar: Number(e.target.value) }; setTeklifForm({ ...teklifForm, kalemler: ks }); }}
                            style={{ border: "1.5px solid #e2e8f0", borderRadius: 7, padding: "7px 10px", fontSize: 13, textAlign: "center" }} />
                          <input type="number" value={k.birimFiyat} onChange={e => { const ks = [...(teklifForm.kalemler || [])]; ks[i] = { ...k, birimFiyat: Number(e.target.value) }; setTeklifForm({ ...teklifForm, kalemler: ks }); }}
                            style={{ border: "1.5px solid #e2e8f0", borderRadius: 7, padding: "7px 10px", fontSize: 13, textAlign: "right" }} />
                          <button onClick={() => setTeklifForm({ ...teklifForm, kalemler: (teklifForm.kalemler || []).filter((_, ii) => ii !== i) })}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><Trash2 size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setTeklifForm({ ...teklifForm, kalemler: [...(teklifForm.kalemler || []), { id: Date.now().toString(), aciklama: "", miktar: 1, birimFiyat: 0 }] })}
                        style={{ background: "#f1f5f9", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#0B1E33" }}>
                        <Plus size={13} /> Satır Ekle
                      </button>
                    </div>

                    {/* Toplam */}
                    {(() => {
                      const ara = (teklifForm.kalemler || []).reduce((s, k) => s + k.miktar * k.birimFiyat, 0);
                      const kdv = ara * ((teklifForm.kdvOrani || 20) / 100);
                      return (
                        <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14, marginBottom: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 4 }}>
                            <span>Ara Toplam</span><span>{formatPara(ara)}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 8 }}>
                            <span>KDV (%{teklifForm.kdvOrani})</span><span>{formatPara(kdv)}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#0f172a", borderTop: "1.5px solid #e2e8f0", paddingTop: 8 }}>
                            <span>TOPLAM</span><span>{formatPara(ara + kdv)}</span>
                          </div>
                        </div>
                      );
                    })()}

                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => setTeklifFormAcik(false)} style={{ flex: 1, padding: "10px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13 }}>İptal</button>
                      <button onClick={() => {
                        const yeni: Teklif = { ...teklifForm, id: Date.now().toString() } as Teklif;
                        setTeklifler([...teklifler, yeni]);
                        setTeklifFormAcik(false);
                      }} style={{ flex: 2, padding: "10px", background: "#0B1E33", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                        <Save size={14} style={{ marginRight: 6, verticalAlign: "middle" }} /> Teklifi Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ÖDEMELER ── */}
          {aktifSayfa === "odemeler" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "Toplam Tahsilat", val: formatPara(odemeler.reduce((s, o) => s + o.tutar, 0)), color: "#059669" },
                  { label: "Bekleyen Borç", val: formatPara(musteriler.filter(m => m.odemeDurumu === "Bekliyor").reduce((s, m) => s + m.abonelikUcreti, 0)), color: "#f59e0b" },
                  { label: "Gecikmiş", val: formatPara(musteriler.filter(m => m.odemeDurumu === "Gecikmiş").reduce((s, m) => s + m.abonelikUcreti, 0)), color: "#dc2626" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderLeft: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button onClick={() => { setOdemeForm({ tur: "EFT/Havale", tarih: new Date().toISOString().split("T")[0] }); setOdemeFormAcik(true); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#0B1E33", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  <Plus size={15} /> Ödeme Kaydet
                </button>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0B1E33", color: "#fff" }}>
                      {["Müşteri", "Açıklama", "Tutar", "Ödeme Türü", "Tarih", ""].map(h => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {odemeler.map((o, i) => (
                      <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 600, fontSize: 13 }}>{getMusteriAdi(o.musteriId)}</td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569" }}>{o.aciklama}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 800, fontSize: 14, color: "#059669" }}>{formatPara(o.tutar)}</td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569" }}>{o.tur}</td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569" }}>{o.tarih}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <button onClick={() => setOdemeler(odemeler.filter(od => od.id !== o.id))}
                            style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: "#dc2626" }}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {odemeFormAcik && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                  <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 460 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>Ödeme Kaydı</div>
                      <button onClick={() => setOdemeFormAcik(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                    </div>
                    <div style={{ display: "grid", gap: 12 }}>
                      {[
                        { label: "Müşteri *", type: "select" },
                        { label: "Açıklama", field: "aciklama" },
                        { label: "Tutar (₺)", field: "tutar", type: "number" },
                        { label: "Tarih", field: "tarih", type: "date" },
                      ].map((f: any, i) => (
                        <div key={i}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>{f.label}</label>
                          {f.type === "select" ? (
                            <select value={odemeForm.musteriId || ""} onChange={e => setOdemeForm({ ...odemeForm, musteriId: e.target.value })}
                              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
                              <option value="">Seçiniz...</option>
                              {musteriler.map(m => <option key={m.id} value={m.id}>{m.firmaAdi}</option>)}
                            </select>
                          ) : (
                            <input type={f.type || "text"} value={(odemeForm as any)[f.field] || ""} onChange={e => setOdemeForm({ ...odemeForm, [f.field]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, boxSizing: "border-box" }} />
                          )}
                        </div>
                      ))}
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Ödeme Türü</label>
                        <select value={odemeForm.tur || "EFT/Havale"} onChange={e => setOdemeForm({ ...odemeForm, tur: e.target.value as any })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
                          {["Nakit", "EFT/Havale", "Kredi Kartı"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                      <button onClick={() => setOdemeFormAcik(false)} style={{ flex: 1, padding: "10px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13 }}>İptal</button>
                      <button onClick={() => {
                        const yeni: Odeme = { ...odemeForm, id: Date.now().toString() } as Odeme;
                        setOdemeler([...odemeler, yeni]);
                        setOdemeFormAcik(false);
                      }} style={{ flex: 2, padding: "10px", background: "#0B1E33", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                        <Save size={14} style={{ marginRight: 6, verticalAlign: "middle" }} /> Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── KASA ── */}
          {aktifSayfa === "kasa" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#92400e", display: "flex", alignItems: "center", gap: 6 }}>
                  <Lock size={13} /> Bu bilgiler şifreli tutulmalı ve yetkisiz kişilerle paylaşılmamalıdır.
                </div>
                <button onClick={() => { setKasaForm({ tur: "Lisans" }); setKasaFormAcik(true); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#0B1E33", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  <Plus size={15} /> Yeni Kayıt
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
                {kasaItems.map(k => {
                  const Icon = kasaTurIcon[k.tur] || Key;
                  const gorunen = sifreGorunenler.has(k.id);
                  return (
                    <div key={k.id} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                        <div style={{ background: "#0B1E33", borderRadius: 9, padding: 10 }}>
                          <Icon size={17} color="#64a0c8" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{k.baslik}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{getMusteriAdi(k.musteriId)} · {k.tur}</div>
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button onClick={() => { setKasaForm(k); setKasaFormAcik(true); }}
                            style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}><Edit2 size={12} /></button>
                          <button onClick={() => setKasaItems(kasaItems.filter(ki => ki.id !== k.id))}
                            style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#ef4444" }}><Trash2 size={12} /></button>
                        </div>
                      </div>
                      <div style={{ display: "grid", gap: 8, fontSize: 12 }}>
                        <div style={{ display: "flex", gap: 10 }}>
                          <span style={{ color: "#94a3b8", width: 80, flexShrink: 0 }}>Kullanıcı</span>
                          <span style={{ color: "#1e293b", fontFamily: "monospace", fontWeight: 600 }}>{k.kullanici}</span>
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ color: "#94a3b8", width: 80, flexShrink: 0 }}>Şifre</span>
                          <span style={{ color: "#1e293b", fontFamily: "monospace", fontWeight: 600, flex: 1 }}>
                            {gorunen ? k.sifre : "••••••••••"}
                          </span>
                          <button onClick={() => toggleSifre(k.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                            {gorunen ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        {k.notlar && (
                          <div style={{ display: "flex", gap: 10 }}>
                            <span style={{ color: "#94a3b8", width: 80, flexShrink: 0 }}>Not</span>
                            <span style={{ color: "#475569", fontSize: 11 }}>{k.notlar}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {kasaFormAcik && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                  <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 480 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>Kasa Kaydı</div>
                      <button onClick={() => setKasaFormAcik(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                    </div>
                    <div style={{ display: "grid", gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Müşteri</label>
                        <select value={kasaForm.musteriId || ""} onChange={e => setKasaForm({ ...kasaForm, musteriId: e.target.value })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
                          <option value="">Seçiniz...</option>
                          {musteriler.map(m => <option key={m.id} value={m.id}>{m.firmaAdi}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Tür</label>
                        <select value={kasaForm.tur || "Lisans"} onChange={e => setKasaForm({ ...kasaForm, tur: e.target.value as any })}
                          style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
                          {["Lisans", "Mail", "Firewall", "Modem", "Sunucu", "Diğer"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      {[
                        { label: "Başlık / Ürün Adı *", field: "baslik" },
                        { label: "Kullanıcı Adı", field: "kullanici" },
                        { label: "Şifre", field: "sifre" },
                        { label: "Notlar (IP, port, açıklama...)", field: "notlar" },
                      ].map(f => (
                        <div key={f.field}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>{f.label}</label>
                          <input value={(kasaForm as any)[f.field] || ""} onChange={e => setKasaForm({ ...kasaForm, [f.field]: e.target.value })}
                            style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, boxSizing: "border-box", fontFamily: f.field === "sifre" ? "monospace" : undefined }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                      <button onClick={() => setKasaFormAcik(false)} style={{ flex: 1, padding: "10px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13 }}>İptal</button>
                      <button onClick={() => {
                        if (kasaForm.id) {
                          setKasaItems(kasaItems.map(k => k.id === kasaForm.id ? { ...kasaForm } as KasaItem : k));
                        } else {
                          setKasaItems([...kasaItems, { ...kasaForm, id: Date.now().toString() } as KasaItem]);
                        }
                        setKasaFormAcik(false);
                      }} style={{ flex: 2, padding: "10px", background: "#0B1E33", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                        <Save size={14} style={{ marginRight: 6, verticalAlign: "middle" }} /> Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── RAPORLAR ── */}
          {aktifSayfa === "raporlar" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Finansal Özet */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <DollarSign size={18} color="#059669" /> Finansal Özet
                  </div>
                  {[
                    { label: "Toplam Tahsilat", val: odemeler.reduce((s, o) => s + o.tutar, 0), color: "#059669" },
                    { label: "Aylık Abonelik Geliri", val: musteriler.reduce((s, m) => s + m.abonelikUcreti, 0), color: "#0B1E33" },
                    { label: "Yıllık Projeksiyon", val: musteriler.reduce((s, m) => s + m.abonelikUcreti, 0) * 12, color: "#7c3aed" },
                    { label: "Gecikmiş Tahsilat", val: musteriler.filter(m => m.odemeDurumu === "Gecikmiş").reduce((s, m) => s + m.abonelikUcreti, 0), color: "#dc2626" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: 13, color: "#64748b" }}>{item.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: item.color }}>{formatPara(item.val)}</span>
                    </div>
                  ))}
                </div>

                {/* Ticket İstatistikleri */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <Activity size={18} color="#7c3aed" /> Ticket İstatistikleri
                  </div>
                  {[
                    { label: "Toplam Ticket", val: tickets.length, color: "#0B1E33" },
                    { label: "Açık / İşlemde", val: tickets.filter(t => ["Açık", "İşlemde"].includes(t.durum)).length, color: "#f59e0b" },
                    { label: "Çözülen", val: tickets.filter(t => t.durum === "Çözüldü").length, color: "#059669" },
                    { label: "Kritik", val: tickets.filter(t => t.oncelik === "Kritik").length, color: "#dc2626" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: 13, color: "#64748b" }}>{item.label}</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.val}</span>
                    </div>
                  ))}
                </div>

                {/* Müşteri Abonelik Dağılımı */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <Package size={18} color="#0B1E33" /> Müşteri Bazlı Gelir
                  </div>
                  {musteriler.map(m => {
                    const max = Math.max(...musteriler.map(x => x.abonelikUcreti));
                    return (
                      <div key={m.id} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, color: "#1e293b" }}>{m.firmaAdi}</span>
                          <span style={{ color: "#64748b" }}>{formatPara(m.abonelikUcreti)}</span>
                        </div>
                        <div style={{ background: "#f1f5f9", borderRadius: 4, height: 8, overflow: "hidden" }}>
                          <div style={{ width: `${(m.abonelikUcreti / max) * 100}%`, height: "100%", background: odemeDurumRenk[m.odemeDurumu], borderRadius: 4 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ödeme Geçmişi */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <Calendar size={18} color="#f59e0b" /> Son Ödemeler
                  </div>
                  {odemeler.slice(-5).reverse().map(o => (
                    <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{getMusteriAdi(o.musteriId)}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{o.tarih} · {o.tur}</div>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#059669" }}>+{formatPara(o.tutar)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
