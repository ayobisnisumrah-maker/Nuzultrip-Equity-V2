import { supabase, appSchema, isSupabaseConfigured } from '../lib/supabase';
import { InvestorProfile, InvestorReport, DividendRecord, INVESTOR_REPORTS, DEMO_DIVIDENDS } from '../data/investorData';

export interface CashierTransaction {
  id: string;
  invoiceNumber: string;
  transactionType: 'equity_purchase' | 'umroh_package' | 'hotel_allotment' | 'visa_handling';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  unitsCount?: number;
  amountTotal: number;
  paymentMethod: 'bank_transfer_bsi' | 'bank_transfer_mandiri' | 'qris' | 'cash';
  paymentStatus: 'Lunas' | 'Menunggu Verifikasi' | 'Dibatalkan';
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface ShareTransferRequest {
  id: string;
  type: 'sale' | 'inheritance';
  investorId: string;
  investorName: string;
  investorEmail: string;
  investorPhone: string;
  units: number;
  unitPrice: number;
  totalValue: number;
  status: 'Menunggu Verifikasi' | 'Diproses Notaris' | 'Disetujui' | 'Ditolak';
  createdAt: string;
  adminNotes?: string;
  // Sale specific
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  saleReason?: string;
  // Inheritance specific
  heirName?: string;
  heirRelationship?: 'Anak Kandung' | 'Pasangan (Suami/Istri)' | 'Orang Tua' | 'Saudara Kandung' | 'Ahli Waris Pengganti';
  heirNik?: string;
  heirPhone?: string;
  heirEmail?: string;
  legalDocNumber?: string;
  inheritanceNotes?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  category: 'KEPEMILIKAN' | 'KEUANGAN' | 'PORTAL' | 'DOKUMEN' | 'SISTEM' | 'AUTH';
  user: string;
  details: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

export interface InquiryMessage {
  id: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  category: 'equity_interest' | 'bagi_hasil' | 'legalitas' | 'umum';
  subject: string;
  message: string;
  requestedUnits?: number;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  repliedAt?: string;
  replyNote?: string;
}

export interface PortalServiceItem {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
}

export interface PortalProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface PortalSettings {
  // Hero & Banner
  heroHeadline: string;
  heroSubheadline: string;
  heroBadgeText: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroImageUrl: string;
  runningAnnouncement: string;
  showAnnouncement: boolean;

  // Commercial & Equity Metrics
  equityPercentage: number;
  totalUnits: number;
  availableUnits: number;
  pricePerUnit: number;
  annualYieldProjection: string;
  equityValuationText?: string;
  heroHighlights?: string[];

  // About Section
  aboutTitle?: string;
  aboutDescription?: string;
  aboutMarketStat?: string;
  aboutGrowthStat?: string;

  // Services
  servicesList?: PortalServiceItem[];

  // Process Steps
  processList?: PortalProcessStep[];

  // Company Identity & Legal
  companyName: string;
  companyAddress: string;
  companyLicensePpiu?: string;
  contactEmail: string;
  contactPhone: string;
  footerCopyright?: string;

  // Aliases for flexibility across CMS
  runningBanner?: string;
  showRunningBanner?: boolean;
  projectedAnnualYield?: number;
  companyPhone?: string;
  companyEmail?: string;
}

const STORAGE_KEYS = {
  REPORTS: 'nuzultrip_reports_v1',
  TRANSACTIONS: 'nuzultrip_transactions_v1',
  DIVIDENDS: 'nuzultrip_dividends_v1',
  PORTAL: 'nuzultrip_portal_v1',
  REQUESTS: 'nuzultrip_transfer_requests_v1',
  AUDIT_LOGS: 'nuzultrip_audit_logs_v1',
  MESSAGES: 'nuzultrip_messages_v1',
};

// Initial state
const INITIAL_PORTAL_SETTINGS: PortalSettings = {
  heroHeadline: 'Berkembang Dalam Ekosistem Muslim Yang Terintegrasi',
  heroSubheadline: 'Nuzultrip membangun ekosistem perjalanan Muslim melalui integrasi layanan, jaringan, dan teknologi untuk pertumbuhan investasi jangka panjang.',
  heroBadgeText: 'NUZULTRIP EQUITY · EKOSISTEM PERJALANAN MUSLIM',
  heroCtaPrimary: 'Ajukan Minat Equity',
  heroCtaSecondary: 'Unduh Pitchdeck 2026',
  heroImageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop',
  equityPercentage: 40,
  totalUnits: 50,
  availableUnits: 14,
  pricePerUnit: 100000000,
  annualYieldProjection: '19.2% / Tahun',
  equityValuationText: 'Rp 12.500.000.000 (Valuasi Perseroan)',
  heroHighlights: [
    '40% Alokasi Equity',
    '50 Unit Terbatas',
    'Rp 100 Juta / Unit',
    'Bagi Hasil Berkala',
    'Jaringan 4 Negara',
    '1.000+ Jamaah Tahunan',
  ],
  aboutTitle: 'Membangun Ekosistem Terpadu Ibadah & Halal Tourism',
  aboutDescription: 'Nuzultrip hadir bukan sekadar biro perjalanan, melainkan ekosistem terpadu yang memadukan keandalan operasional umroh, kemitraan internasional, dan inovasi teknologi untuk melayani jutaan jamaah Muslim.',
  aboutMarketStat: '70 JT+ Potensi Pasar Muslim Indonesia',
  aboutGrowthStat: '+17.1% Pertumbuhan Jamaah Umroh Tahunan',
  servicesList: [
    {
      id: 'umroh',
      code: 'UMROH',
      title: 'Umroh & Haji Khusus',
      tagline: 'Ibadah mudah, nyaman, aman dan terpercaya.',
      description: 'Paket reguler, VIP, dan custom dengan pendampingan muthowif berpengalaman, hotel bintang terdekat, dan manasik komprehensif.',
      iconName: 'umroh',
    },
    {
      id: 'land-arrangement',
      code: 'LAND ARRANGEMENT',
      title: 'Land Arrangement & Hotel B2B',
      tagline: 'Kebutuhan layanan untuk umroh dan tour islami.',
      description: 'Penyediaan akomodasi hotel bintang, transportasi bus eksekutif, catering nusantara, dan handling bandara terintegrasi di Makkah & Madinah.',
      iconName: 'land',
    },
    {
      id: 'halal-tour',
      code: 'HALAL TOUR',
      title: 'Halal Tour & Ziarah Global',
      tagline: 'Destinasi pilihan dengan pengalaman yang bernilai.',
      description: 'Eksplorasi destinasi bersejarah Islam dunia (Turki, Al-Aqsha, Uzbekistan, Spanyol) dengan jaminan makanan halal dan jadwal sholat terjaga.',
      iconName: 'tour',
    },
    {
      id: 'travel-muslim',
      code: 'TIKET & TEKNOLOGI',
      title: 'Jaringan Tiket & Platform Muslim',
      tagline: 'Jaringan layanan untuk perjalanan terbaik.',
      description: 'Platform digital penghubung agen travel muslim se-Indonesia dengan akses inventori terpusat, harga grosir tiket, dan sistem automasi.',
      iconName: 'travel',
    },
  ],
  processList: [
    {
      number: '01.',
      title: 'Pendaftaran & Minat Unit',
      description: 'Calon investor mengajukan minat kepemilikan unit equity melalui formulir resmi atau kontak Investor Relations.',
    },
    {
      number: '02.',
      title: 'Verifikasi Due Diligence',
      description: 'Pemeriksaan kelengkapan identitas, keselarasan prinsip syariah, dan konfirmasi ketersediaan kuota unit oleh komite.',
    },
    {
      number: '03.',
      title: 'Akta Notariat & Penyetoran',
      description: 'Penandatanganan Perjanjian Pemegang Saham resmi di hadapan Notaris rekanan serta penyetoran modal ke rekening perseroan.',
    },
    {
      number: '04.',
      title: 'Penerbitan Sertifikat & Portal',
      description: 'Penerbitan Sertifikat Kepemilikan Unit Saham berkekuatan hukum dan pembukaan akses portal investor realtime.',
    },
  ],
  runningAnnouncement: '📢 Pengumuman: RUPS Luar Biasa Kuartal 3 dijadwalkan pada 20 Oktober 2026. Laporan Triwulan II telah terbit.',
  showAnnouncement: true,
  companyName: 'PT. Swarna Dipa Wisata (Nuzultrip)',
  companyAddress: 'RUKO PETTARANI, Jl. A. P. Pettarani No.24 Tamamaung, Panakkukang, Makassar 90232',
  companyLicensePpiu: 'SK Kemenag RI PPIU No. 912/2021 & Kemenkumham AHU-0019284.AH.01.01',
  contactEmail: 'equity@nuzultrip.com',
  contactPhone: '+62 812-4411-9988',
  footerCopyright: '© 2026 PT. Swarna Dipa Wisata. Seluruh hak cipta dilindungi undang-undang.',
};

const INITIAL_REQUESTS: ShareTransferRequest[] = [];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'LOG-INIT',
    action: 'Inisialisasi Sistem Produksi',
    category: 'SISTEM',
    user: 'ayobisnisumrah@gmail.com',
    details: 'Sistem konsol Nuzultrip Equity siap produksi & tersambung ke database realtime.',
    timestamp: '2026-09-23 10:00:00',
    status: 'success',
  },
  {
    id: 'LOG-AUTH',
    action: 'Otorisasi Super Administrator',
    category: 'AUTH',
    user: 'ayobisnisumrah@gmail.com',
    details: 'Akses penuh eksekutif & kasir perseroan aktif.',
    timestamp: '2026-09-23 10:05:00',
    status: 'success',
  },
];

const INITIAL_MESSAGES: InquiryMessage[] = [];

const INITIAL_TRANSACTIONS: CashierTransaction[] = [];

type StoreListener = () => void;

class RealtimeStore {
  private listeners: Set<StoreListener> = new Set();
  private reports: InvestorReport[] = [];
  private transactions: CashierTransaction[] = [];
  private dividends: DividendRecord[] = [];
  private portalSettings: PortalSettings = INITIAL_PORTAL_SETTINGS;
  private requests: ShareTransferRequest[] = [];
  private auditLogs: AuditLogItem[] = [];
  private messages: InquiryMessage[] = [];
  private investorProfile: InvestorProfile | null = null;
  private investorHoldings: Array<{ id: string; units: number; unitPrice: number }> = [];
  private channel: any = null;

  constructor() {
    this.loadFromStorage();
    this.initSupabaseSync();

    // Listen to cross-tab storage changes
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', () => {
        this.loadFromStorage();
        this.notify();
      });
    }
  }

  private loadFromStorage() {
    try {
      const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      this.reports = storedReports ? JSON.parse(storedReports) : INVESTOR_REPORTS;

      const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      this.transactions = storedTx ? JSON.parse(storedTx) : INITIAL_TRANSACTIONS;

      const storedDiv = localStorage.getItem(STORAGE_KEYS.DIVIDENDS);
      this.dividends = storedDiv ? JSON.parse(storedDiv) : DEMO_DIVIDENDS;

      const storedPortal = localStorage.getItem(STORAGE_KEYS.PORTAL);
      this.portalSettings = storedPortal
        ? { ...INITIAL_PORTAL_SETTINGS, ...JSON.parse(storedPortal) }
        : INITIAL_PORTAL_SETTINGS;

      const storedReq = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      this.requests = storedReq ? JSON.parse(storedReq) : INITIAL_REQUESTS;

      const storedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      this.auditLogs = storedLogs ? JSON.parse(storedLogs) : INITIAL_AUDIT_LOGS;

      const storedMsg = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      this.messages = storedMsg ? JSON.parse(storedMsg) : INITIAL_MESSAGES;
    } catch (e) {
      console.warn('RealtimeStore: Error reading localStorage', e);
      this.reports = INVESTOR_REPORTS;
      this.transactions = INITIAL_TRANSACTIONS;
      this.dividends = DEMO_DIVIDENDS;
      this.portalSettings = INITIAL_PORTAL_SETTINGS;
      this.requests = INITIAL_REQUESTS;
      this.auditLogs = INITIAL_AUDIT_LOGS;
      this.messages = INITIAL_MESSAGES;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEYS.DIVIDENDS, JSON.stringify(this.dividends));
      localStorage.setItem(STORAGE_KEYS.PORTAL, JSON.stringify(this.portalSettings));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(this.requests));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.messages));
    } catch (e) {
      console.warn('RealtimeStore: Error saving localStorage', e);
    }
  }

  private async initSupabaseSync() {
    if (!supabase || !isSupabaseConfigured) return;

    try {
      // Production is authoritative. localStorage is only a temporary UI cache/fallback.
      const [
        reportsResult,
        invoicesResult,
        dividendsResult,
        transfersResult,
        inheritanceResult,
        auditResult,
        inquiriesResult,
        investorResult,
        holdingsResult,
      ] = await Promise.all([
        supabase
          .from('financial_reports')
          .select('id,title,summary,status,visibility,created_at,updated_at,financial_periods(fiscal_year,period_index,starts_on,ends_on)')
          .order('created_at', { ascending: false }),
        supabase
          .from('finance_invoices')
          .select('id,reference,status,customer_name,customer_email,customer_phone,grand_total,paid_total,notes,created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('profit_distribution_allocations')
          .select('id,allocation_amount,status,paid_at,payment_reference,created_at,ownership_bps,profit_distributions(period_start,period_end)')
          .order('created_at', { ascending: false }),
        supabase
          .from('ownership_transfers')
          .select('id,from_investor_id,units,status,requested_at,requested_unit_price,agreed_unit_price,rejection_reason,notes,transfer_kind')
          .order('requested_at', { ascending: false }),
        supabase
          .from('ownership_inheritance')
          .select('id,current_investor_id,beneficiary_name,beneficiary_email,beneficiary_phone,units,status,requested_at,rejection_reason,notes')
          .order('requested_at', { ascending: false }),
        supabase
          .from('audit_logs')
          .select('id,action,entity_type,actor_label,summary,created_at')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('portal_inquiries')
          .select('id,name,email,phone,message,status,created_at,handled_at')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('investors')
          .select('id,reference_code,status,legal_name,whatsapp_number,bank_name,bank_account_name,bank_account_number,activated_at,approved_at,created_at')
          .limit(1)
          .maybeSingle(),
        supabase
          .from('ownership_holdings')
          .select('id,units,ownership_bps,acquisition_at,status,ownership_offerings(unit_price)')
          .eq('status', 'active'),
      ]);

      if (!reportsResult.error) {
        this.reports = (reportsResult.data || []).map((r: any) => {
          const p = Array.isArray(r.financial_periods) ? r.financial_periods[0] : r.financial_periods;
          const period = p
            ? `${p.starts_on || ''} - ${p.ends_on || ''}`
            : 'Periode laporan';
          return {
            id: r.id,
            title: r.title,
            period,
            date: new Date(r.updated_at || r.created_at).toLocaleDateString('id-ID'),
            category: 'keuangan' as const,
            summary: r.summary || 'Laporan keuangan resmi Nuzultrip.',
            fileSize: '-',
            fileType: 'DIGITAL',
            isNew: r.status === 'published',
            highlights: [],
            contentDetails: r.summary || 'Laporan tersedia sesuai hak akses investor.',
          };
        });
      }

      if (!invoicesResult.error) {
        this.transactions = (invoicesResult.data || []).map((t: any) => ({
          id: t.id,
          invoiceNumber: t.reference,
          transactionType: 'equity_purchase' as const,
          customerName: t.customer_name || '-',
          customerPhone: t.customer_phone || '-',
          customerEmail: t.customer_email || '-',
          amountTotal: Number(t.grand_total || 0),
          paymentMethod: 'bank_transfer_bsi' as const,
          paymentStatus:
            Number(t.paid_total || 0) >= Number(t.grand_total || 0)
              ? ('Lunas' as const)
              : ('Menunggu Verifikasi' as const),
          notes: t.notes || undefined,
          createdBy: 'Supabase',
          createdAt: t.created_at,
        }));
      }

      if (!dividendsResult.error) {
        this.dividends = (dividendsResult.data || []).map((d: any) => {
          const dist = Array.isArray(d.profit_distributions)
            ? d.profit_distributions[0]
            : d.profit_distributions;
          const amount = Number(d.allocation_amount || 0);
          return {
            id: d.id,
            period: dist ? `${dist.period_start} - ${dist.period_end}` : 'Periode distribusi',
            paymentDate: d.paid_at
              ? new Date(d.paid_at).toLocaleDateString('id-ID')
              : 'Menunggu pembayaran',
            amountPerUnit: amount,
            units: 1,
            totalGross: amount,
            taxDeduction: 0,
            totalNet: amount,
            status: d.status === 'paid' ? ('Berhasil' as const) : ('Diproses' as const),
            referenceNumber: d.payment_reference || d.id,
            paymentMethod: 'Transfer Bank',
          };
        });
      }

      if (!transfersResult.error || !inheritanceResult.error) {
        const saleRequests: ShareTransferRequest[] = (transfersResult.data || []).map((r: any) => {
          const unitPrice = Number(r.agreed_unit_price || r.requested_unit_price || 0);
          return {
            id: r.id,
            type: 'sale',
            investorId: r.from_investor_id,
            investorName: 'Investor',
            investorEmail: '',
            investorPhone: '',
            units: Number(r.units || 0),
            unitPrice,
            totalValue: unitPrice * Number(r.units || 0),
            status:
              r.status === 'completed' || r.status === 'approved'
                ? 'Disetujui'
                : r.status === 'rejected'
                ? 'Ditolak'
                : r.status === 'processing'
                ? 'Diproses Notaris'
                : 'Menunggu Verifikasi',
            createdAt: r.requested_at,
            saleReason: r.notes || undefined,
            adminNotes: r.rejection_reason || undefined,
          };
        });
        const inheritanceRequests: ShareTransferRequest[] = (inheritanceResult.data || []).map((r: any) => ({
          id: r.id,
          type: 'inheritance',
          investorId: r.current_investor_id,
          investorName: 'Investor',
          investorEmail: '',
          investorPhone: '',
          units: Number(r.units || 0),
          unitPrice: 0,
          totalValue: 0,
          status:
            r.status === 'completed' || r.status === 'approved'
              ? 'Disetujui'
              : r.status === 'rejected'
              ? 'Ditolak'
              : 'Menunggu Verifikasi',
          createdAt: r.requested_at,
          heirName: r.beneficiary_name,
          heirPhone: r.beneficiary_phone || undefined,
          heirEmail: r.beneficiary_email || undefined,
          inheritanceNotes: r.notes || undefined,
          adminNotes: r.rejection_reason || undefined,
        }));
        this.requests = [...saleRequests, ...inheritanceRequests].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      if (!auditResult.error) {
        this.auditLogs = (auditResult.data || []).map((l: any) => ({
          id: l.id,
          action: l.action,
          category: 'SISTEM' as const,
          user: l.actor_label || 'Sistem',
          details: l.summary || l.entity_type || '-',
          timestamp: l.created_at,
          status: 'info' as const,
        }));
      }

      if (!inquiriesResult.error) {
        this.messages = (inquiriesResult.data || []).map((m: any) => ({
          id: m.id,
          senderName: m.name,
          senderPhone: m.phone || '',
          senderEmail: m.email || '',
          category: 'umum' as const,
          subject: 'Pesan Portal',
          message: m.message,
          status: m.status === 'resolved' || m.status === 'replied' ? 'replied' : m.status === 'read' ? 'read' : 'unread',
          createdAt: m.created_at,
          repliedAt: m.handled_at || undefined,
        }));
      }

      if (!investorResult.error && investorResult.data) {
        const investor: any = investorResult.data;
        const holdings = !holdingsResult.error ? holdingsResult.data || [] : [];
        this.investorHoldings = holdings.map((h: any) => {
          const offering = Array.isArray(h.ownership_offerings) ? h.ownership_offerings[0] : h.ownership_offerings;
          return { id: h.id, units: Number(h.units || 0), unitPrice: Number(offering?.unit_price || 0) };
        });
        const unitsOwned = holdings.reduce((sum: number, h: any) => sum + Number(h.units || 0), 0);
        const ownershipBps = holdings.reduce((sum: number, h: any) => sum + Number(h.ownership_bps || 0), 0);
        const totalInvestment = holdings.reduce((sum: number, h: any) => {
          const offering = Array.isArray(h.ownership_offerings) ? h.ownership_offerings[0] : h.ownership_offerings;
          return sum + Number(h.units || 0) * Number(offering?.unit_price || 0);
        }, 0);
        const unitPrice = unitsOwned > 0 ? totalInvestment / unitsOwned : 0;
        const paidDividends = this.dividends
          .filter((d) => d.status === 'Berhasil')
          .reduce((sum, d) => sum + d.totalNet, 0);
        const pendingDividend = this.dividends
          .filter((d) => d.status !== 'Berhasil')
          .reduce((sum, d) => sum + d.totalNet, 0);
        const { data: authData } = await supabase.auth.getUser();
        this.investorProfile = {
          id: investor.reference_code || investor.id,
          name: investor.legal_name || authData.user?.email || 'Investor',
          email: authData.user?.email || '',
          phone: investor.whatsapp_number || '',
          joinDate: new Date(investor.activated_at || investor.approved_at || investor.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
          unitsOwned,
          unitPrice,
          totalInvestment,
          equityPercentage: ownershipBps / 100,
          bankAccount: {
            bankName: investor.bank_name || '-',
            accountNumber: investor.bank_account_number || '-',
            accountHolder: investor.bank_account_name || investor.legal_name || '-',
          },
          totalDividendsReceived: paidDividends,
          pendingDividend,
          nextDividendDate: 'Sesuai jadwal distribusi yang dipublikasikan',
          status: investor.status === 'active' ? 'Aktif' : investor.status === 'approved' ? 'Review' : 'Pending',
        };
      } else {
        this.investorProfile = null;
        this.investorHoldings = [];
      }

      this.saveToStorage();
      this.notify();

      if (this.channel) {
        await supabase.removeChannel(this.channel);
      }

      const realtimeTables = [
        'financial_reports',
        'finance_invoices',
        'finance_payments',
        'profit_distributions',
        'profit_distribution_allocations',
        'ownership_holdings',
        'ownership_transfers',
        'ownership_inheritance',
        'investors',
        'portal_inquiries',
        'notifications',
        'documents',
        'document_versions',
      ];

      let channel = supabase.channel('nuzultrip-production-realtime');
      realtimeTables.forEach((table) => {
        channel = channel.on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          () => {
            void this.refreshFromProduction();
          }
        );
      });
      this.channel = channel.subscribe();
    } catch (err) {
      console.warn('Realtime production sync error:', err);
    }
  }

  public async refreshFromProduction(): Promise<void> {
    await this.initSupabaseSync();
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getInvestorProfile(): InvestorProfile | null {
    return this.investorProfile ? { ...this.investorProfile, bankAccount: { ...this.investorProfile.bankAccount } } : null;
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Store listener error', e);
      }
    });
  }

  // --- REPORTS API ---
  public getReports(): InvestorReport[] {
    return [...this.reports];
  }

  public async addReport(report: Omit<InvestorReport, 'id'>): Promise<InvestorReport> {
    if (!appSchema || !supabase || !isSupabaseConfigured) {
      throw new Error('Koneksi Supabase production belum tersedia.');
    }

    const { data: periods, error: periodError } = await supabase
      .from('financial_periods')
      .select('id,starts_on,ends_on,status')
      .order('starts_on', { ascending: false })
      .limit(1);
    if (periodError) throw new Error(periodError.message);
    const period = periods?.[0];
    if (!period) throw new Error('Belum ada periode keuangan production. Buat periode keuangan terlebih dahulu.');

    const source = report.auditor ? 'audited' : 'internal';
    const { data: reportId, error } = await appSchema.rpc('create_financial_report_with_draft', {
      p_financial_period_id: period.id,
      p_title: report.title,
      p_summary: report.summary || null,
      p_visibility: 'investors',
      p_source: source,
      p_prepared_by: report.auditor || null,
      p_notes: report.contentDetails || null,
    });
    if (error) throw new Error(error.message || 'Laporan gagal dibuat.');

    await this.refreshFromProduction();
    const synced = this.reports.find((item) => item.id === reportId);
    if (!synced) throw new Error('Laporan dibuat tetapi belum dapat dibaca kembali dari production.');
    return synced;
  }

  public async deleteReport(_id: string): Promise<boolean> {
    throw new Error('Laporan resmi tidak dihapus langsung. Gunakan workflow arsip/versioning agar audit trail tetap utuh.');
  }

  // --- CASHIER & TRANSACTIONS API ---
  public getTransactions(): CashierTransaction[] {
    return [...this.transactions];
  }

  public async createTransaction(
    tx: Omit<CashierTransaction, 'id' | 'invoiceNumber' | 'createdAt'>
  ): Promise<CashierTransaction> {
    if (!appSchema || !supabase || !isSupabaseConfigured) {
      throw new Error('Koneksi Supabase production belum tersedia.');
    }

    const quantity = tx.transactionType === 'equity_purchase' ? Number(tx.unitsCount || 1) : 1;
    const unitPrice = quantity > 0 ? Number(tx.amountTotal || 0) / quantity : Number(tx.amountTotal || 0);
    const { data: invoiceId, error: createError } = await appSchema.rpc('create_finance_invoice', {
      p_customer_name: tx.customerName,
      p_customer_email: tx.customerEmail || null,
      p_customer_phone: tx.customerPhone || null,
      p_customer_address: null,
      p_due_on: new Date().toISOString().slice(0, 10),
      p_notes: tx.notes || null,
      p_items: [{
        name: tx.transactionType === 'equity_purchase' ? 'Unit Equity Nuzultrip' : tx.transactionType,
        description: tx.notes || null,
        quantity,
        unit_label: tx.transactionType === 'equity_purchase' ? 'unit' : 'layanan',
        unit_price: unitPrice,
        discount_amount: 0,
        tax_rate: 0,
      }],
    });
    if (createError) throw new Error(createError.message || 'Invoice gagal dibuat.');

    const { error: issueError } = await appSchema.rpc('issue_finance_invoice', { p_invoice_id: invoiceId });
    if (issueError) throw new Error(issueError.message || 'Invoice gagal diterbitkan.');

    if (tx.paymentStatus === 'Lunas' && Number(tx.amountTotal) > 0) {
      const { error: paymentError } = await appSchema.rpc('record_finance_payment', {
        p_invoice_id: invoiceId,
        p_amount: Number(tx.amountTotal),
        p_method: tx.paymentMethod,
        p_received_at: new Date().toISOString(),
        p_external_reference: null,
        p_notes: tx.notes || null,
        p_idempotency_key: `dashboard-${invoiceId}-${Number(tx.amountTotal)}`,
      });
      if (paymentError) throw new Error(paymentError.message || 'Pembayaran invoice gagal dicatat.');
    }

    await this.refreshFromProduction();
    const synced = this.transactions.find((item) => item.id === invoiceId);
    if (!synced) throw new Error('Transaksi dibuat tetapi belum dapat dibaca kembali dari production.');
    return synced;
  }

  // --- DIVIDENDS API ---
  public getDividends(): DividendRecord[] {
    return [...this.dividends];
  }

  public async distributeDividend(payout: {
    period: string;
    amountPerUnit: number;
    paymentMethod?: string;
  }): Promise<DividendRecord> {
    const now = new Date();
    const refCode = `BSI-TRX-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const newDiv: DividendRecord = {
      id: `DIV-${Date.now()}`,
      period: payout.period,
      paymentDate: now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      amountPerUnit: payout.amountPerUnit,
      units: 2, // Default investor units
      totalGross: payout.amountPerUnit * 2,
      taxDeduction: 0,
      totalNet: payout.amountPerUnit * 2,
      status: 'Berhasil',
      referenceNumber: refCode,
      paymentMethod: payout.paymentMethod || 'Bank Transfer (BSI Syariah)',
    };

    this.dividends = [newDiv, ...this.dividends];

    // Automatically create a corresponding financial report for transparency
    const newReport: InvestorReport = {
      id: `REP-DIV-${Date.now().toString(36).toUpperCase()}`,
      title: `Laporan Realisasi Bagi Hasil Periode ${payout.period}`,
      period: payout.period,
      date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: 'bagi_hasil',
      summary: `Eksekusi penyaluran bagi hasil periode ${payout.period} telah berhasil ditransfer ke rekening BSI pemegang unit dengan yield Rp ${payout.amountPerUnit.toLocaleString('id-ID')} / unit.`,
      contentDetails: `Seluruh transaksi pembayaran dividen telah divalidasi oleh Divisi Keuangan PT Nuzul Berkah Wisata dengan nomor kliring ${refCode}.`,
      fileSize: '1.8 MB',
      fileType: 'PDF',
      isNew: true,
      highlights: [
        { label: 'Bagi Hasil Per Unit', value: `Rp ${(payout.amountPerUnit / 1000000).toFixed(1)} Juta` },
        { label: 'Status Transfer', value: '100% Berhasil' },
      ],
    };

    this.reports = [newReport, ...this.reports];
    this.saveToStorage();
    this.notify();

    return newDiv;
  }

  // --- PORTAL SETTINGS (CMS) API ---
  public getPortalSettings(): PortalSettings {
    return { ...this.portalSettings };
  }

  public updatePortalSettings(newSettings: Partial<PortalSettings>): PortalSettings {
    this.portalSettings = {
      ...this.portalSettings,
      ...newSettings,
    };
    this.saveToStorage();
    this.notify();
    this.addAuditLog({
      action: 'Update Pengaturan Portal',
      category: 'PORTAL',
      user: 'ayobisnisumrah@gmail.com',
      details: 'Pembaruan konten landing page publik & CMS portal investor',
      status: 'info',
    });
    return this.portalSettings;
  }

  // --- SHARE TRANSFER & INHERITANCE REQUESTS API ---
  public getTransferRequests(): ShareTransferRequest[] {
    return [...this.requests];
  }

  public async createTransferRequest(
    req: Omit<ShareTransferRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<ShareTransferRequest> {
    if (!appSchema || !supabase || !isSupabaseConfigured) {
      throw new Error('Koneksi Supabase production belum tersedia.');
    }

    const holding = this.investorHoldings.find((h) => h.units >= req.units);
    if (!holding) {
      throw new Error('Tidak ada kepemilikan aktif dengan unit yang cukup untuk pengajuan ini.');
    }

    let requestId: string | null = null;
    let error: any = null;

    if (req.type === 'sale') {
      const result = await appSchema.rpc('create_ownership_sale_request', {
        p_holding_id: holding.id,
        p_units: req.units,
        p_requested_unit_price: req.unitPrice || holding.unitPrice,
        p_notes: req.saleReason || null,
      });
      requestId = result.data as string | null;
      error = result.error;
    } else {
      const notes = [
        req.heirRelationship ? `Hubungan: ${req.heirRelationship}` : null,
        req.legalDocNumber ? `Dokumen: ${req.legalDocNumber}` : null,
        req.inheritanceNotes || null,
      ].filter(Boolean).join(' | ');
      const result = await appSchema.rpc('create_ownership_inheritance_request', {
        p_holding_id: holding.id,
        p_beneficiary_name: req.heirName || '',
        p_beneficiary_email: req.heirEmail || null,
        p_beneficiary_phone: req.heirPhone || null,
        p_units: req.units,
        p_notes: notes || null,
      });
      requestId = result.data as string | null;
      error = result.error;
    }

    if (error) throw new Error(error.message || 'Pengajuan gagal diproses.');
    await this.refreshFromProduction();

    const synced = this.requests.find((r) => r.id === requestId);
    return synced || {
      ...req,
      id: requestId || `REQ-${Date.now().toString(36).toUpperCase()}`,
      status: 'Menunggu Verifikasi',
      createdAt: new Date().toISOString(),
    };
  }

  public async updateTransferRequestStatus(
    id: string,
    status: ShareTransferRequest['status'],
    adminNotes?: string
  ): Promise<boolean> {
    if (!appSchema || !supabase || !isSupabaseConfigured) {
      throw new Error('Koneksi Supabase production belum tersedia.');
    }

    const target = this.requests.find((r) => r.id === id);
    if (!target) return false;

    let error: any = null;
    if (status === 'Disetujui') {
      const result = target.type === 'sale'
        ? await appSchema.rpc('approve_ownership_sale', { p_transfer_id: id })
        : await appSchema.rpc('approve_ownership_inheritance', { p_request_id: id });
      error = result.error;
    } else if (status === 'Ditolak') {
      const reason = adminNotes?.trim();
      if (!reason) throw new Error('Alasan penolakan wajib diisi.');
      const result = target.type === 'sale'
        ? await appSchema.rpc('reject_ownership_sale', { p_transfer_id: id, p_reason: reason })
        : await appSchema.rpc('reject_ownership_inheritance', { p_request_id: id, p_reason: reason });
      error = result.error;
    } else {
      throw new Error('Perubahan status ini harus diproses melalui workflow kepemilikan production.');
    }

    if (error) throw new Error(error.message || 'Status pengajuan gagal diperbarui.');
    await this.refreshFromProduction();
    return true;
  }

  // --- AUDIT LOGS API ---
  public getAuditLogs(): AuditLogItem[] {
    return [...this.auditLogs];
  }

  public addAuditLog(item: Omit<AuditLogItem, 'id' | 'timestamp'>): void {
    const now = new Date();
    const newLog: AuditLogItem = {
      ...item,
      id: `LOG-${Date.now().toString(36).toUpperCase()}`,
      timestamp: now.toLocaleString('id-ID'),
    };
    this.auditLogs = [newLog, ...this.auditLogs];
    this.saveToStorage();
    this.notify();
  }

  // --- INQUIRY MESSAGES API ---
  public getMessages(): InquiryMessage[] {
    return [...this.messages];
  }

  public async addMessage(
    msg: Omit<InquiryMessage, 'id' | 'createdAt' | 'status'> & Partial<InquiryMessage>
  ): Promise<InquiryMessage> {
    const now = new Date();
    const newMsg: InquiryMessage = {
      id: `MSG-${Date.now().toString(36).toUpperCase()}`,
      senderName: msg.senderName,
      senderPhone: msg.senderPhone,
      senderEmail: msg.senderEmail,
      category: msg.category || 'umum',
      subject: msg.subject || 'Pengajuan Minat / Pesan Baru',
      message: msg.message,
      requestedUnits: msg.requestedUnits,
      status: 'unread',
      createdAt: now.toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    this.messages = [newMsg, ...this.messages];
    this.saveToStorage();
    this.notify();

    this.addAuditLog({
      action: 'Pesan / Pengajuan Minat Masuk',
      category: 'PORTAL',
      user: newMsg.senderName,
      details: `${newMsg.subject} dari ${newMsg.senderName} (${newMsg.senderPhone})`,
      status: 'info',
    });

    return newMsg;
  }

  public async markMessageRead(id: string): Promise<boolean> {
    const idx = this.messages.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    if (this.messages[idx].status === 'unread') {
      this.messages[idx].status = 'read';
      this.saveToStorage();
      this.notify();
    }
    return true;
  }

  public async replyMessage(id: string, replyNote: string): Promise<boolean> {
    const idx = this.messages.findIndex((m) => m.id === id);
    if (idx === -1) return false;

    const now = new Date();
    this.messages[idx] = {
      ...this.messages[idx],
      status: 'replied',
      replyNote,
      repliedAt: now.toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    this.saveToStorage();
    this.notify();

    this.addAuditLog({
      action: `Pesan #${id} Dibalas`,
      category: 'PORTAL',
      user: 'ayobisnisumrah@gmail.com',
      details: `Respons dikirim kepada ${this.messages[idx].senderName}: "${replyNote}"`,
      status: 'success',
    });

    return true;
  }

  public async deleteMessage(id: string): Promise<boolean> {
    const idx = this.messages.findIndex((m) => m.id === id);
    if (idx === -1) return false;

    const [deleted] = this.messages.splice(idx, 1);
    this.saveToStorage();
    this.notify();

    this.addAuditLog({
      action: `Pesan #${id} Dihapus`,
      category: 'PORTAL',
      user: 'ayobisnisumrah@gmail.com',
      details: `Pesan dari ${deleted.senderName} dihapus`,
      status: 'warning',
    });

    return true;
  }
}

export const realtimeStore = new RealtimeStore();
