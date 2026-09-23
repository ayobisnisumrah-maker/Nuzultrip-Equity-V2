import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { InvestorReport, DividendRecord, INVESTOR_REPORTS, DEMO_DIVIDENDS } from '../data/investorData';

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
      // 1. Fetch remote reports
      const { data: remoteReports, error: repError } = await supabase
        .from('investor_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (!repError && remoteReports && remoteReports.length > 0) {
        this.reports = remoteReports.map((r: any) => ({
          id: r.id,
          title: r.title,
          period: r.period,
          date: r.date,
          category: r.category,
          summary: r.summary,
          fileSize: r.file_size || '2.5 MB',
          fileType: r.file_type || 'PDF',
          isNew: r.is_new,
          auditor: r.auditor,
          highlights: r.highlights || [],
          contentDetails: r.content_details,
          downloadUrl: r.download_url,
        }));
        this.saveToStorage();
        this.notify();
      }

      // 2. Fetch remote transactions
      const { data: remoteTx, error: txError } = await supabase
        .from('cashier_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!txError && remoteTx && remoteTx.length > 0) {
        this.transactions = remoteTx.map((t: any) => ({
          id: t.id,
          invoiceNumber: t.invoice_number,
          transactionType: t.transaction_type,
          customerName: t.customer_name,
          customerPhone: t.customer_phone,
          customerEmail: t.customer_email,
          unitsCount: t.units_count,
          amountTotal: Number(t.amount_total),
          paymentMethod: t.payment_method,
          paymentStatus: t.payment_status,
          notes: t.notes,
          createdBy: t.created_by,
          createdAt: t.created_at,
        }));
        this.saveToStorage();
        this.notify();
      }

      // 3. Setup realtime channel
      this.channel = supabase
        .channel('nuzultrip_realtime_channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'investor_reports' },
          (payload) => {
            console.log('Realtime Supabase Event (Reports):', payload);
            this.initSupabaseSync();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cashier_transactions' },
          (payload) => {
            console.log('Realtime Supabase Event (Transactions):', payload);
            this.initSupabaseSync();
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Realtime Supabase connection error:', err);
    }
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
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
    const newId = `REP-${Date.now().toString(36).toUpperCase()}`;
    const newReport: InvestorReport = {
      ...report,
      id: newId,
    };

    this.reports = [newReport, ...this.reports];
    this.saveToStorage();
    this.notify();

    // Supabase persist
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('investor_reports').insert([
          {
            id: newReport.id,
            title: newReport.title,
            period: newReport.period,
            date: newReport.date,
            category: newReport.category,
            summary: newReport.summary,
            content_details: newReport.contentDetails,
            file_size: newReport.fileSize,
            file_type: newReport.fileType,
            is_new: newReport.isNew,
            auditor: newReport.auditor,
            highlights: newReport.highlights,
            download_url: newReport.downloadUrl,
          },
        ]);
      } catch (err) {
        console.warn('Supabase addReport sync error:', err);
      }
    }

    return newReport;
  }

  public async deleteReport(id: string): Promise<boolean> {
    this.reports = this.reports.filter((r) => r.id !== id);
    this.saveToStorage();
    this.notify();

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('investor_reports').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteReport sync error:', err);
      }
    }

    return true;
  }

  // --- CASHIER & TRANSACTIONS API ---
  public getTransactions(): CashierTransaction[] {
    return [...this.transactions];
  }

  public async createTransaction(
    tx: Omit<CashierTransaction, 'id' | 'invoiceNumber' | 'createdAt'>
  ): Promise<CashierTransaction> {
    const now = new Date();
    const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV/NZ/${dateCode}/${randomSuffix}`;
    const newId = `TRX-${Date.now()}`;

    const newTx: CashierTransaction = {
      ...tx,
      id: newId,
      invoiceNumber,
      createdAt: now.toLocaleString('id-ID'),
    };

    this.transactions = [newTx, ...this.transactions];

    // If transaction is equity purchase, automatically reduce available units
    if (newTx.transactionType === 'equity_purchase' && newTx.unitsCount) {
      this.portalSettings.availableUnits = Math.max(
        0,
        this.portalSettings.availableUnits - newTx.unitsCount
      );
    }

    this.saveToStorage();
    this.notify();

    // Supabase persist
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('cashier_transactions').insert([
          {
            id: newTx.id,
            invoice_number: newTx.invoiceNumber,
            transaction_type: newTx.transactionType,
            customer_name: newTx.customerName,
            customer_phone: newTx.customerPhone,
            customer_email: newTx.customerEmail,
            units_count: newTx.unitsCount || 0,
            amount_total: newTx.amountTotal,
            payment_method: newTx.paymentMethod,
            payment_status: newTx.paymentStatus,
            notes: newTx.notes,
            created_by: newTx.createdBy,
          },
        ]);
      } catch (err) {
        console.warn('Supabase createTransaction sync error:', err);
      }
    }

    return newTx;
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
    const now = new Date();
    const newId = `REQ-${Date.now().toString(36).toUpperCase()}`;
    const newReq: ShareTransferRequest = {
      ...req,
      id: newId,
      status: 'Menunggu Verifikasi',
      createdAt: now.toLocaleString('id-ID'),
    };

    this.requests = [newReq, ...this.requests];
    this.saveToStorage();
    this.notify();

    // Log to audit
    this.addAuditLog({
      action: newReq.type === 'sale' ? 'Permohonan Jual Saham' : 'Permohonan Pewarisan Saham',
      category: 'KEPEMILIKAN',
      user: newReq.investorName,
      details:
        newReq.type === 'sale'
          ? `Pengajuan penjualan kembali ${newReq.units} unit saham senilai Rp ${newReq.totalValue.toLocaleString('id-ID')}`
          : `Pengajuan pewarisan ${newReq.units} unit saham kepada ${newReq.heirName} (${newReq.heirRelationship})`,
      status: 'warning',
    });

    return newReq;
  }

  public async updateTransferRequestStatus(
    id: string,
    status: ShareTransferRequest['status'],
    adminNotes?: string
  ): Promise<boolean> {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) return false;

    this.requests[idx] = {
      ...this.requests[idx],
      status,
      adminNotes: adminNotes || this.requests[idx].adminNotes,
    };

    const targetReq = this.requests[idx];

    // If sale approved, return units to available units
    if (status === 'Disetujui' && targetReq.type === 'sale') {
      this.portalSettings.availableUnits = Math.min(
        this.portalSettings.totalUnits,
        this.portalSettings.availableUnits + targetReq.units
      );
    }

    this.saveToStorage();
    this.notify();

    this.addAuditLog({
      action: `Status Pengajuan #${targetReq.id} diubah ke ${status}`,
      category: 'KEPEMILIKAN',
      user: 'ayobisnisumrah@gmail.com',
      details: `Persetujuan transaksi kepemilikan investor ${targetReq.investorName}. Catatan: ${adminNotes || '-'}`,
      status: status === 'Disetujui' ? 'success' : 'info',
    });

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
