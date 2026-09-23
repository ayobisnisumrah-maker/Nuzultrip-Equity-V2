import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  MessageSquare,
  Inbox,
  PieChart,
  Landmark,
  ArrowLeftRight,
  GitFork,
  TrendingUp,
  Receipt,
  Calendar,
  FileSpreadsheet,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  Radio,
  Sun,
  Moon,
  Monitor,
  ArrowRight,
  Plus,
  Trash2,
  Printer,
  Download,
  Search,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  DollarSign,
  Send,
  Sliders,
  Sparkles,
  Menu,
  X,
  Files,
  Lock,
  Globe,
  AppWindow,
  Building2,
  UserCog,
  ScrollText,
  FileCheck,
  Server,
} from 'lucide-react';
import {
  realtimeStore,
  CashierTransaction,
  PortalSettings,
  ShareTransferRequest,
  AuditLogItem,
  InquiryMessage,
} from '../../services/realtimeStore';
import { InvestorReport } from '../../data/investorData';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import { CashierInvoiceView } from './CashierInvoiceView';
import { PortalInvestorCmsView } from './PortalInvestorCmsView';
import { OwnershipManagementView } from './OwnershipManagementView';
import { AuditLogView } from './AuditLogView';
import { MessagesInquiriesView } from './MessagesInquiriesView';
import { FinancialManagementView } from './FinancialManagementView';
import { SystemIntegrationsView } from './SystemIntegrationsView';
import { isSupabaseConfigured } from '../../lib/supabase';
import { AdminAccess, loadAdminAccess } from '../../services/adminAccessService';\nimport { PublicDocumentManager } from './PublicDocumentManager';\nimport { PortalSectionEditor } from './PortalSectionEditor';
import { provisioningService } from '../../services/provisioningService';

interface SuperAdminDashboardProps {
  onBackToHome: () => void;
  onOpenInvestorPortal: () => void;
  onLogout: () => void;
}

type NavSection =
  // Main
  | 'dasbor'
  // HUBUNGAN INVESTOR
  | 'investor'
  | 'pengajuan_investor'
  | 'dokumen_investor'
  | 'pesan'
  | 'permintaan_masuk'
  // KEPEMILIKAN
  | 'penawaran_kepemilikan'
  | 'kepemilikan_investor'
  | 'transfer_kepemilikan'
  | 'pewarisan_kepemilikan'
  // LAPORAN & KEUANGAN
  | 'ringkasan_keuangan'
  | 'kasir_invoice'
  | 'periode_keuangan'
  | 'laporan_keuangan'
  | 'kpi_keuangan'
  | 'distribusi_bagi_hasil'
  // DOKUMEN
  | 'pustaka_dokumen'
  | 'verifikasi_dokumen'
  | 'data_room'
  // PORTAL INVESTOR
  | 'ringkasan_portal'
  | 'portal'
  | 'dokumen_portal'
  | 'pengaturan_portal'
  // PERUSAHAAN
  | 'profil_perusahaan'
  // SISTEM
  | 'administrator'
  | 'role_permission'
  | 'pengaturan'
  // KEAMANAN
  | 'audit_log';

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  onBackToHome,
  onOpenInvestorPortal,
  onLogout,
}) => {
  const [activeNav, setActiveNav] = useState<NavSection>('dasbor');
  const [adminAccess, setAdminAccess] = useState<AdminAccess | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reports, setReports] = useState<InvestorReport[]>(realtimeStore.getReports());
  const [transactions, setTransactions] = useState<CashierTransaction[]>(
    realtimeStore.getTransactions()
  );
  const [portalSettings, setPortalSettings] = useState<PortalSettings>(
    realtimeStore.getPortalSettings()
  );
  const [transferRequests, setTransferRequests] = useState<ShareTransferRequest[]>(
    realtimeStore.getTransferRequests()
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(
    realtimeStore.getAuditLogs()
  );
  const [selectedReceipt, setSelectedReceipt] = useState<CashierTransaction | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Modal Kasir State
  const [showKasirModal, setShowKasirModal] = useState(false);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('admin_finance_reporting');
  const [newInvestorName, setNewInvestorName] = useState('');
  const [newInvestorEmail, setNewInvestorEmail] = useState('');
  const [newInvestorWhatsapp, setNewInvestorWhatsapp] = useState('');

  // Kasir form inputs
  const [txType, setTxType] = useState<
    'equity_purchase' | 'umroh_package' | 'hotel_allotment' | 'visa_handling'
  >('equity_purchase');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [equityUnits, setEquityUnits] = useState(1);
  const [customAmount, setCustomAmount] = useState(100000000);
  const [paymentMethod, setPaymentMethod] = useState<
    'bank_transfer_bsi' | 'bank_transfer_mandiri' | 'qris' | 'cash'
  >('bank_transfer_bsi');
  const [txNotes, setTxNotes] = useState('');

  // Report form inputs
  const [repTitle, setRepTitle] = useState('');
  const [repPeriod, setRepPeriod] = useState('Periode keuangan aktif');
  const [repCategory, setRepCategory] = useState<
    'keuangan' | 'operasional' | 'bagi_hasil' | 'legalitas'
  >('keuangan');
  const [repAuditor, setRepAuditor] = useState('');
  const [repSummary, setRepSummary] = useState('');
  const [repHl1Label, setRepHl1Label] = useState('');
  const [repHl1Val, setRepHl1Val] = useState('');
  const [repHl2Label, setRepHl2Label] = useState('');
  const [repHl2Val, setRepHl2Val] = useState('');

  // CMS inputs
  const [cmsHeadline, setCmsHeadline] = useState(portalSettings.heroHeadline);
  const [cmsSubheadline, setCmsSubheadline] = useState(portalSettings.heroSubheadline);
  const [cmsAvailableUnits, setCmsAvailableUnits] = useState(portalSettings.availableUnits);
  const [cmsBanner, setCmsBanner] = useState(portalSettings.runningAnnouncement);
  const [messages, setMessages] = useState<InquiryMessage[]>(() => realtimeStore.getMessages());

  useEffect(() => {
    let mounted = true;
    loadAdminAccess()
      .then((access) => {
        if (mounted) setAdminAccess(access);
      })
      .catch(() => {
        if (mounted) setAdminAccess(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const update = () => {
      setReports(realtimeStore.getReports());
      setTransactions(realtimeStore.getTransactions());
      setPortalSettings(realtimeStore.getPortalSettings());
      setTransferRequests(realtimeStore.getTransferRequests());
      setAuditLogs(realtimeStore.getAuditLogs());
      setMessages(realtimeStore.getMessages());
    };
    const unsubscribe = realtimeStore.subscribe(update);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!adminAccess) return;
    const allowed: Partial<Record<NavSection, boolean>> = {
      dasbor: true,
      investor: adminAccess.canViewInvestors,
      pengajuan_investor: adminAccess.canViewInvestors,
      dokumen_investor: adminAccess.canViewInvestors || adminAccess.canViewDocuments,
      pesan: adminAccess.canViewMessages,
      permintaan_masuk: adminAccess.canViewMessages || adminAccess.canViewInvestors,
      penawaran_kepemilikan: adminAccess.canViewOwnership,
      kepemilikan_investor: adminAccess.canViewOwnership,
      transfer_kepemilikan: adminAccess.canViewOwnership,
      pewarisan_kepemilikan: adminAccess.canViewOwnership,
      ringkasan_keuangan: adminAccess.canViewFinance,
      kasir_invoice: adminAccess.canViewFinance,
      periode_keuangan: adminAccess.canViewFinance,
      laporan_keuangan: adminAccess.canViewFinance,
      kpi_keuangan: adminAccess.canViewFinance,
      distribusi_bagi_hasil: adminAccess.canViewFinance,
      pustaka_dokumen: adminAccess.canViewDocuments,
      verifikasi_dokumen: adminAccess.canViewDocuments,
      data_room: adminAccess.canViewDocuments,
      ringkasan_portal: adminAccess.canViewPortal,
      portal: adminAccess.canViewPortal,
      dokumen_portal: adminAccess.canViewPortal || adminAccess.canViewDocuments,
      pengaturan_portal: adminAccess.canManagePortal,
      profil_perusahaan: adminAccess.canViewPortal,
      administrator: adminAccess.isSuperAdmin,
      role_permission: adminAccess.isSuperAdmin,
      pengaturan: adminAccess.isSuperAdmin,
      audit_log: adminAccess.canViewAudit,
    };
    if (!allowed[activeNav]) setActiveNav('dasbor');
  }, [adminAccess, activeNav]);

  const pendingRequestsCount = transferRequests.filter(
    (r) => r.status === 'Menunggu Verifikasi'
  ).length;

  const unreadMessagesCount = messages.filter(
    (m) => m.status === 'unread'
  ).length;

  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await provisioningService.createAdmin({
        fullName: newAdminName,
        email: newAdminEmail,
        roleKey: newAdminRole,
      });
      setShowAddAdminModal(false);
      setNewAdminName('');
      setNewAdminEmail('');
      await realtimeStore.refreshFromProduction();
      triggerAlert('Admin baru berhasil dibuat dan disinkronkan.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Admin gagal dibuat.');
    }
  };

  const handleCreateInvestor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await provisioningService.createInvestor({
        legalName: newInvestorName,
        email: newInvestorEmail,
        whatsappNumber: newInvestorWhatsapp,
      });
      setShowAddInvestorModal(false);
      setNewInvestorName('');
      setNewInvestorEmail('');
      setNewInvestorWhatsapp('');
      await realtimeStore.refreshFromProduction();
      triggerAlert('Investor baru berhasil didaftarkan untuk proses verifikasi.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Investor gagal didaftarkan.');
    }
  };

  // Submit Kasir Transaction
  const handleProcessTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Mohon isi nama dan nomor kontak');
      return;
    }

    const total = txType === 'equity_purchase' ? equityUnits * 100000000 : customAmount;

    try {
      const newTx = await realtimeStore.createTransaction({
        transactionType: txType,
        customerName,
        customerPhone,
        customerEmail: customerEmail || '',
        unitsCount: txType === 'equity_purchase' ? equityUnits : undefined,
        amountTotal: total,
        paymentMethod,
        paymentStatus: 'Lunas',
        notes: txNotes || 'Pembayaran resmi kasir Nuzultrip',
        createdBy: 'Super Admin',
      });

      setShowKasirModal(false);
      setSelectedReceipt(newTx);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setTxNotes('');
      triggerAlert('Transaksi berhasil dicatat ke finance production.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Transaksi gagal diproses.');
    }
  };

  // Submit New Report
  const handlePublishReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repTitle.trim() || !repSummary.trim()) {
      alert('Mohon lengkapi judul dan ringkasan');
      return;
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    try {
      await realtimeStore.addReport({
        title: repTitle,
        period: repPeriod,
        date: dateFormatted,
        category: repCategory,
        summary: repSummary,
        contentDetails: repSummary,
        auditor: repAuditor || undefined,
        fileSize: '-',
        fileType: 'DIGITAL',
        isNew: true,
        highlights: [
          ...(repHl1Label && repHl1Val ? [{ label: repHl1Label, value: repHl1Val }] : []),
          ...(repHl2Label && repHl2Val ? [{ label: repHl2Label, value: repHl2Val }] : []),
        ],
      });

      setShowAddReportModal(false);
      setRepTitle('');
      setRepSummary('');
      triggerAlert('Draft laporan resmi berhasil dibuat di financial reporting production.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Laporan gagal dibuat.');
    }
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    realtimeStore.updatePortalSettings({
      heroHeadline: cmsHeadline,
      heroSubheadline: cmsSubheadline,
      availableUnits: Number(cmsAvailableUnits),
      runningAnnouncement: cmsBanner,
    });
    triggerAlert('✅ Pengaturan konten portal berhasil diperbarui.');
  };

  // Calculate monthly cash flows
  const totalInflow = transactions.reduce((acc, curr) => acc + curr.amountTotal, 0);

  const monthlyData = [
    {
      month: 'September 2026',
      inflow: totalInflow > 0 ? totalInflow : 0,
      outflow: 0,
      net: totalInflow > 0 ? totalInflow : 0,
      pax: transactions.length > 0 ? transactions.length + 1 : 0,
    },
    { month: 'Agustus 2026', inflow: 0, outflow: 0, net: 0, pax: 0 },
    { month: 'Juli 2026', inflow: 0, outflow: 0, net: 0, pax: 0 },
    { month: 'Juni 2026', inflow: 0, outflow: 0, net: 0, pax: 0 },
    { month: 'Mei 2026', inflow: 0, outflow: 0, net: 0, pax: 0 },
    { month: 'April 2026', inflow: 0, outflow: 0, net: 0, pax: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased">
      {/* Toast Notification */}
      {alertMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold px-4 py-3 rounded-2xl shadow-xl border border-emerald-500 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={18} />
          <span className="text-xs sm:text-sm">{alertMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Matching Screenshot Exactly) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header in Sidebar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              N
            </div>
            <div>
              <div className="font-extrabold text-[15px] tracking-tight text-slate-900 leading-none">
                Nuzultrip
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mt-0.5">
                ADMIN CONSOLE
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-semibold">
          {/* Main: Dasbor */}
          <div>
            <button
              type="button"
              onClick={() => {
                setActiveNav('dasbor');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'dasbor'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={16} className={activeNav === 'dasbor' ? 'text-[#166534]' : 'text-slate-500'} />
              <span>Dasbor</span>
            </button>
          </div>

          {/* Section: HUBUNGAN INVESTOR */}
          {adminAccess?.canViewInvestors && <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              HUBUNGAN INVESTOR
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveNav('investor');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'investor'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={15} className="text-slate-500" />
                <span>Investor</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">2</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('pengajuan_investor');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'pengajuan_investor'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <UserCheck size={15} className="text-slate-500" />
              <span>Pengajuan Investor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('dokumen_investor');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'dokumen_investor'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={15} className="text-slate-500" />
                <span>Dokumen Investor</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{reports.length}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('pesan');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'pesan'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={15} className="text-slate-500" />
                <span>Pesan</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('permintaan_masuk');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'permintaan_masuk'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox size={15} className="text-slate-500" />
                <span>Permintaan Masuk</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingRequestsCount}
              </span>
            </button>
          </div>}

          {/* Section: KEPEMILIKAN */}
          {adminAccess?.canViewOwnership && <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              KEPEMILIKAN
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveNav('penawaran_kepemilikan');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'penawaran_kepemilikan'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <PieChart size={15} className="text-slate-500" />
              <span className="truncate">Penawaran Kepemili...</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('kepemilikan_investor');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'kepemilikan_investor'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Landmark size={15} className="text-slate-500" />
              <span>Kepemilikan Investor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('transfer_kepemilikan');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'transfer_kepemilikan'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowLeftRight size={15} className="text-slate-500" />
              <span>Transfer Kepemilikan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('pewarisan_kepemilikan');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'pewarisan_kepemilikan'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <GitFork size={15} className="text-slate-500" />
              <span className="truncate">Pewarisan Kepemilik...</span>
            </button>
          </div>}

          {/* Section: LAPORAN & KEUANGAN */}
          {adminAccess?.canViewFinance && <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              LAPORAN & KEUANGAN
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveNav('ringkasan_keuangan');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'ringkasan_keuangan'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp size={15} className="text-slate-500" />
              <span>Ringkasan Keuangan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('kasir_invoice');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'kasir_invoice'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Receipt size={15} className="text-slate-500" />
                <span>Kasir & Invoice</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold font-mono">
                {transactions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('periode_keuangan');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'periode_keuangan'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar size={15} className="text-slate-500" />
              <span>Periode Keuangan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('laporan_keuangan');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'laporan_keuangan'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet size={15} className="text-slate-500" />
              <span>Laporan Keuangan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('kpi_keuangan');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'kpi_keuangan'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 size={15} className="text-slate-500" />
              <span>KPI Keuangan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('distribusi_bagi_hasil');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'distribusi_bagi_hasil'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <DollarSign size={15} className="text-slate-500" />
              <span>Distribusi Bagi Hasil</span>
            </button>
          </div>}

          {/* Section: DOKUMEN */}
          {adminAccess?.canViewDocuments && <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              DOKUMEN
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveNav('pustaka_dokumen');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'pustaka_dokumen'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Files size={15} className="text-slate-500" />
              <span>Pustaka Dokumen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('verifikasi_dokumen');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'verifikasi_dokumen'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileCheck size={15} className="text-slate-500" />
              <span>Verifikasi Dokumen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('data_room');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'data_room'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Lock size={15} className="text-slate-500" />
              <span>Data Room</span>
            </button>
          </div>}

          {/* Section: PORTAL INVESTOR (Requested by User) */}
          {adminAccess?.canViewPortal && <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              PORTAL INVESTOR
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveNav('ringkasan_portal');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'ringkasan_portal'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe size={15} className="text-slate-500" />
              <span>Ringkasan Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('portal');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'portal'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <AppWindow size={15} className="text-slate-500" />
                <span>Portal</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-emerald-100 text-emerald-800">
                CMS
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('dokumen_portal');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'dokumen_portal'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText size={15} className="text-slate-500" />
              <span>Dokumen Portal</span>
            </button>
          </div>}

          {/* Section: PERUSAHAAN */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              PERUSAHAAN
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveNav('profil_perusahaan');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'profil_perusahaan'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 size={15} className="text-slate-500" />
              <span>Profil Perusahaan</span>
            </button>
          </div>

          {/* Section: SISTEM */}
          {adminAccess?.isSuperAdmin && <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              SISTEM
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveNav('administrator');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'administrator'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <UserCog size={15} className="text-slate-500" />
              <span>Administrator</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('role_permission');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'role_permission'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck size={15} className="text-slate-500" />
              <span>Role & Permission</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('pengaturan');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'pengaturan'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings size={15} className="text-slate-500" />
                <span>Pengaturan & Cloud</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-100 text-blue-700">
                DevOps
              </span>
            </button>
          </div>}

          {/* Section: KEAMANAN */}
          {adminAccess?.canViewAudit && <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              KEAMANAN
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveNav('audit_log');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'audit_log'
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ScrollText size={15} className="text-slate-500" />
                <span>Audit Log</span>
              </div>
              <span className="text-[10.5px] font-mono text-slate-400">
                {auditLogs.length}
              </span>
            </button>
          </div>}
        </div>

        {/* Sidebar Footer with Quick Return */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-1">
          <button
            type="button"
            onClick={onOpenInvestorPortal}
            className="w-full py-2 px-3 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>Lihat Portal Investor</span>
          </button>
          <button
            type="button"
            onClick={onBackToHome}
            className="w-full py-1.5 px-3 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 text-[11.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Kembali ke Website</span>
          </button>
        </div>
      </aside>

      {/* MAIN RIGHT CONTAINER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* TOP BAR (Exact Header from Screenshot) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block text-xs font-semibold text-slate-400">
              Admin Console &gt; <span className="text-slate-800 capitalize">{activeNav.replace(/_/g, ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Status Aktif Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-700 font-semibold">Sistem aktif</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center shadow-xs">
                AB
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-bold text-slate-900">ayobisnisumrah@gmail.com</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Super Administrator (Owner)</div>
              </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut size={16} />
            </button>

            {/* Theme switcher dummy icons */}
            <div className="hidden md:flex items-center gap-1 text-slate-400 pl-2 border-l border-slate-200">
              <button type="button" className="p-1 hover:text-slate-700"><Sun size={15} /></button>
              <button type="button" className="p-1 hover:text-slate-700"><Moon size={15} /></button>
              <button type="button" className="p-1 hover:text-slate-700"><Monitor size={15} /></button>
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* VIEW: PORTAL CMS — editor konten saja; layout publik V2 tetap dipertahankan */}
          {activeNav === 'portal' && adminAccess?.canViewPortal && <PortalSectionEditor />}

          {/* VIEW: KASIR & INVOICE */}
          {activeNav === 'kasir_invoice' && <CashierInvoiceView />}

          {/* VIEW: DASBOR OVERVIEW */}
          {activeNav === 'dasbor' && (
            <>
              {/* Top Title Banner */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-0.5">
                    NUZULTRIP EQUITY
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Admin Console
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Kelola investor, komunikasi, dokumen, laporan, dan portal hubungan investor dari satu tempat.
                  </p>
                </div>

                {/* Authorized Badge on Right */}
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-left leading-tight">
                    <div className="text-xs font-extrabold text-slate-900">Super Admin</div>
                    <div className="text-[10.5px] text-slate-400">Akses terotorisasi</div>
                  </div>
                </div>
              </div>

          {/* Sub Welcome Message */}
          <div className="pt-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              HUBUNGAN INVESTOR
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Selamat datang, Super
            </h2>
            <p className="text-xs text-slate-500">
              Pusat kendali operasional hubungan investor Nuzultrip.
            </p>
          </div>

          {/* ROW 1: 5 KPI CARDS (Matching Screenshot Exactly) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* 1. Total Investor */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  TOTAL INVESTOR
                </span>
                <Users size={15} className="text-slate-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">2</div>
              <div className="text-[11px] text-slate-400 mt-1">seluruh investor terdaftar</div>
            </div>

            {/* 2. Investor Aktif */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  INVESTOR AKTIF
                </span>
                <UserCheck size={15} className="text-slate-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">2</div>
              <div className="text-[11px] text-slate-400 mt-1">status aktif saat ini</div>
            </div>

            {/* 3. Menunggu Peninjauan */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  MENUNGGU PENINJAUAN
                </span>
                <UserCheck size={15} className="text-slate-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">0</div>
              <div className="text-[11px] text-slate-400 mt-1">diajukan dan sedang ditinjau</div>
            </div>

            {/* 4. Permintaan Baru */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  PERMINTAAN BARU
                </span>
                <Inbox size={15} className="text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">1</div>
              <div className="text-[11px] text-slate-400 mt-1">dari portal publik</div>
            </div>

            {/* 5. Dokumen Terbit */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative col-span-2 sm:col-span-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  DOKUMEN TERBIT
                </span>
                <FileText size={15} className="text-slate-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {reports.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">tersedia untuk investor</div>
            </div>
          </div>

          {/* ROW 2: ARUS TRANSAKSI SECTION (Exact Layout from Screenshot) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  ARUS TRANSAKSI
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Arus masuk & keluar
                </h3>
                <p className="text-xs text-slate-500">
                  Ringkasan kas transaksi dan jumlah pax enam bulan terakhir. Admin dapat melihat rincian transaksi di bawah.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowKasirModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Buat Transaksi Kasir</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNav('kasir_invoice')}
                  className="text-xs font-bold text-slate-800 hover:text-emerald-700 flex items-center gap-1 transition-colors py-2 px-1 cursor-pointer"
                >
                  <span>Buka Kasir & Invoice →</span>
                </button>
              </div>
            </div>

            {/* 4 Cards: Arus masuk bulan ini, keluar, bersih, pax */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                  Arus masuk bulan ini
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {formatRupiah(totalInflow)}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">September 2026</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                  Arus keluar bulan ini
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900">Rp 0</div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  refund + pengeluaran tercatat
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                  Arus bersih bulan ini
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {formatRupiah(totalInflow)}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">masuk dikurangi keluar</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                  Pax bulan ini
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {transactions.length > 0 ? transactions.length + 1 : 0}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  invoice terbit berunit pax/jamaah/orang
                </span>
              </div>
            </div>

            {/* Monthly Breakdown Table (Exact match) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">Ringkasan transaksi bulanan</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">Bulan</th>
                      <th className="py-2.5 px-4 font-medium text-right">Arus masuk</th>
                      <th className="py-2.5 px-4 font-medium text-right">Arus keluar</th>
                      <th className="py-2.5 px-4 font-medium text-right">Arus bersih</th>
                      <th className="py-2.5 px-4 font-medium text-right">Pax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {monthlyData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-medium text-slate-900">{row.month}</td>
                        <td className="py-3 px-4 text-right font-mono">
                          {formatRupiah(row.inflow)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          {formatRupiah(row.outflow)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {formatRupiah(row.net)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono">{row.pax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail transaksi terbaru box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Detail transaksi terbaru</h4>
                  <p className="text-xs text-slate-400">
                    Rincian ini hanya tampil untuk Admin yang memiliki izin melihat laporan keuangan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowKasirModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Catat Transaksi Baru</span>
                </button>
              </div>

              {transactions.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Receipt size={18} />
                  </div>
                  <div className="text-sm font-bold text-slate-800">Belum ada detail transaksi</div>
                  <div className="text-xs text-slate-400 max-w-sm mx-auto">
                    Transaksi masuk dan keluar akan muncul di sini setelah dicatat pada modul keuangan.
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {tx.invoiceNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {tx.paymentStatus}
                          </span>
                          <span className="text-[11px] text-slate-400">{tx.createdAt}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          {tx.customerName}{' '}
                          <span className="font-normal text-slate-400">({tx.customerPhone})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {tx.notes || tx.transactionType.replace(/_/g, ' ')}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:text-right">
                        <div>
                          <div className="text-sm font-black text-slate-900">
                            {formatRupiah(tx.amountTotal)}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase">
                            {tx.paymentMethod.replace(/_/g, ' ')}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(tx)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Printer size={13} />
                          <span>Kwitansi</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ROW 3: SEBARAN STATUS INVESTOR & RINGKASAN OPERASIONAL (Exact match) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sebaran status investor */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Sebaran status investor</h4>
                  <p className="text-xs text-slate-400">Kondisi investor berdasarkan status terkini.</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                  Data realtime
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Aktif</span>
                  </div>
                  <div className="font-mono font-bold text-slate-700">2 100%</div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-full h-full bg-amber-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Ringkasan operasional */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Ringkasan operasional</h4>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Inbox size={15} className="text-amber-500" />
                    <div>
                      <div className="font-bold text-slate-900">Permintaan portal</div>
                      <div className="text-[10px] text-slate-400">Perlu diperiksa</div>
                    </div>
                  </div>
                  <span className="font-bold font-mono text-slate-800">1</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText size={15} className="text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900">Dokumen investor</div>
                      <div className="text-[10px] text-slate-400">Telah diterbitkan</div>
                    </div>
                  </div>
                  <span className="font-bold font-mono text-slate-800">{reports.length}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <UserCheck size={15} className="text-slate-400" />
                    <div>
                      <div className="font-bold text-slate-900">Peninjauan investor</div>
                      <div className="text-[10px] text-slate-400">Menunggu tindakan</div>
                    </div>
                  </div>
                  <span className="font-bold font-mono text-slate-800">0</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

          {activeNav === 'pustaka_dokumen' && adminAccess?.canViewDocuments && (
            <PublicDocumentManager />
          )}

          {/* DOKUMEN & LAPORAN MANAGEMENT SECTION */}
          {(activeNav === 'dokumen_investor' || activeNav === 'laporan_keuangan') && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Manajemen Dokumen & Laporan Investor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Setiap dokumen yang ditambahkan di sini akan langsung terbit secara realtime di Portal Investor.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus size={14} />
                  <span>Terbitkan Laporan Baru</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <div key={r.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {r.category}
                        </span>
                        <span className="text-[11px] text-slate-400">{r.date}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">{r.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{r.summary}</div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm(`Hapus laporan ${r.title}?`)) {
                          await realtimeStore.deleteReport(r.id);
                          triggerAlert('Laporan telah dihapus.');
                        }
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CMS & PORTAL INVESTOR VIEW */}
          {(activeNav === 'portal' ||
            activeNav === 'ringkasan_portal' ||
            activeNav === 'pengaturan_portal') && (
            <PortalInvestorCmsView onOpenPublicPortal={onOpenInvestorPortal} />
          )}

          {/* TRANSFER KEPEMILIKAN (JUAL SAHAM / BUYBACK) */}
          {activeNav === 'transfer_kepemilikan' && (
            <OwnershipManagementView
              initialType="sale"
              title="Transfer & Penjualan Saham (Buyback)"
              subtitle="Verifikasi dan proses permohonan investor untuk menjual kembali saham ke perseroan atau pasar sekunder."
            />
          )}

          {/* PEWARISAN KEPEMILIKAN (AHLI WARIS) */}
          {activeNav === 'pewarisan_kepemilikan' && (
            <OwnershipManagementView
              initialType="inheritance"
              title="Pewarisan & Pelimpahan Unit ke Ahli Waris"
              subtitle="Verifikasi keabsahan dokumen notariat dan legalitas pelimpahan kepemilikan saham kepada ahli waris."
            />
          )}

          {/* PERMINTAAN MASUK (QUEUE) */}
          {activeNav === 'permintaan_masuk' && (
            <OwnershipManagementView
              initialType="all"
              title="Antrean Permintaan Masuk (Pending Queue)"
              subtitle="Pusat verifikasi seluruh permohonan masuk: penjualan kembali saham, penetapan ahli waris, dan permohonan unit baru."
            />
          )}

          {/* AUDIT LOG VIEW */}
          {activeNav === 'audit_log' && <AuditLogView />}

          {/* PESAN & INQUIRIES VIEW */}
          {activeNav === 'pesan' && <MessagesInquiriesView />}

          {/* FINANCIAL MANAGEMENT VIEWS */}
          {activeNav === 'ringkasan_keuangan' && (
            <FinancialManagementView initialSubTab="ringkasan" />
          )}
          {activeNav === 'periode_keuangan' && (
            <FinancialManagementView initialSubTab="periode" />
          )}
          {activeNav === 'kpi_keuangan' && (
            <FinancialManagementView initialSubTab="kpi" />
          )}

          {/* INVESTOR & KEPEMILIKAN INVESTOR VIEW */}
          {(activeNav === 'investor' || activeNav === 'kepemilikan_investor') && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Buku Daftar Pemegang Saham (Cap Table)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daftar seluruh investor aktif dengan kepemilikan unit dan sertifikat terdaftar di PT. Swarna Dipa Wisata.
                  </p>
                </div>
                <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Total Saham Terbit: 50 Unit (100%)
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Nama Investor</th>
                      <th className="py-3 px-4">No. Sertifikat</th>
                      <th className="py-3 px-4">Jumlah Unit</th>
                      <th className="py-3 px-4">Porsi Saham (%)</th>
                      <th className="py-3 px-4">Nilai Investasi</th>
                      <th className="py-3 px-4">Kontak / Bank</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Pemegang Unit Equity dari Transaksi Kasir Riil */}
                    {transactions
                      .filter((t) => t.transactionType === 'equity_purchase' && t.paymentStatus === 'Lunas')
                      .map((trx, idx) => (
                        <tr key={trx.id} className="hover:bg-slate-50/60">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {trx.customerName}
                            <div className="text-[11px] font-normal text-slate-500">
                              {trx.customerEmail || trx.id}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                            {trx.invoiceNumber || `NZ-EQ-${idx + 1}`}
                          </td>
                          <td className="py-3.5 px-4 font-black text-emerald-700">
                            {trx.unitsCount || 1} Unit
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {(((trx.unitsCount || 1) / 50) * 40).toFixed(1)}%
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            Rp {trx.amountTotal.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div>{trx.customerPhone || '-'}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {trx.paymentMethod}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Aktif
                            </span>
                          </td>
                        </tr>
                      ))}

                    {/* Alokasi Pendiri & Manajemen Inti */}
                    <tr className="bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-600">
                        Pendiri & Manajemen Inti (PT. Swarna Dipa Wisata)
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        FOUNDERS-ALLOC
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-700">
                        30 Unit
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        60.0%
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        Rp 3.000.000.000
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        Direksi & Dewan Komisaris
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                          Locked
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PENAWARAN KEPEMILIKAN */}
          {activeNav === 'penawaran_kepemilikan' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Struktur Penawaran Kepemilikan (Equity Offering)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ringkasan alokasi saham publik vs manajemen dan valuasi pra-penawaran.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    Sisa Kuota: {portalSettings.availableUnits} dari {portalSettings.totalUnits} Unit
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Valuasi Total Entitas</div>
                  <div className="text-xl font-black text-slate-900 mt-1">Rp 5.000.000.000</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">50 Unit Saham @ Rp 100 Jt</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase">Alokasi Saham Publik</div>
                  <div className="text-xl font-black text-emerald-900 mt-1">20 Unit (40.0%)</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Maksimal penawaran tahap 1</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <div className="text-[11px] font-bold text-amber-800 uppercase">Proyeksi Yield Tahunan</div>
                  <div className="text-xl font-black text-amber-900 mt-1">
                    {portalSettings.annualYieldProjection || '19.2% / Tahun'}
                  </div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Dibagikan berkala tiap bulan</div>
                </div>
              </div>
            </div>
          )}

          {/* DISTRIBUSI BAGI HASIL */}
          {activeNav === 'distribusi_bagi_hasil' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Distribusi Bagi Hasil (Dividen Payout)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kalkulasi dan eksekusi pembayaran bagi hasil bulanan kepada seluruh investor pemegang unit via BSI.
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  BSI Cash Management Connected
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Formulir Eksekusi Bagi Hasil</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Periode Keuangan</label>
                      <input
                        type="text"
                        defaultValue="Periode Juni 2026"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Total Pool Dividen (IDR)</label>
                      <input
                        type="text"
                        defaultValue="Rp 115.200.000"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nominal per Unit Saham</label>
                      <input
                        type="text"
                        defaultValue="Rp 3.200.000 / Unit"
                        disabled
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-mono font-bold text-emerald-700"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        triggerAlert('Eksekusi transfer bagi hasil periode Juni 2026 berhasil disalurkan ke rekening seluruh investor via BSI.');
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                    >
                      Eksekusi Pembayaran Bagi Hasil
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Riwayat Pembagian Terakhir</h4>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">Bagi Hasil Mei 2026</div>
                        <div className="text-[10.5px] text-slate-400">Ditransfer 31 Mei 2026</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-mono text-emerald-700">Rp 108.000.000</div>
                        <div className="text-[10px] text-slate-500">Lunas 100%</div>
                      </div>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">Bagi Hasil April 2026</div>
                        <div className="text-[10.5px] text-slate-400">Ditransfer 30 Apr 2026</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-mono text-emerald-700">Rp 96.000.000</div>
                        <div className="text-[10px] text-slate-500">Lunas 100%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFIL PERUSAHAAN */}
          {activeNav === 'profil_perusahaan' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Profil Legalitas & Struktur Perseroan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Informasi badan hukum resmi PT. Swarna Dipa Wisata (Nuzultrip).
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  Terdaftar Kemenkumham RI
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Data Legalitas Utama</div>
                  <div><strong>Nama Perseroan:</strong> PT. Swarna Dipa Wisata</div>
                  <div><strong>Merek Dagang:</strong> Nuzultrip</div>
                  <div><strong>Nomor Induk Berusaha (NIB):</strong> 1902230048129</div>
                  <div><strong>SK Kemenkumham:</strong> AHU-0019284.AH.01.01.TAHUN 2021</div>
                  <div><strong>Izin PPIU Kemenag:</strong> No. 129/2022 (Penyelenggara Perjalanan Ibadah Umrah)</div>
                  <div><strong>NPWP Perusahaan:</strong> 82.391.029.4-412.000</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Dewan Pengurus & Notaris</div>
                  <div><strong>Direktur Utama:</strong> H. Muhammad Raihan, S.E.</div>
                  <div><strong>Direktur Operasional:</strong> Hj. Siti Rahmawati, M.M.</div>
                  <div><strong>Komisaris Utama:</strong> Prof. Dr. Ir. H. Achmad Zaki</div>
                  <div><strong>Notaris Rekanan:</strong> Kantor Notaris & PPAT Faisal Lubis, S.H., M.Kn.</div>
                  <div><strong>Bank Operasional:</strong> Bank Syariah Indonesia (BSI) KCP Sudirman</div>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN VAULT & DATA ROOM */}
          {(activeNav === 'pustaka_dokumen' ||
            activeNav === 'verifikasi_dokumen' ||
            activeNav === 'data_room' ||
            activeNav === 'dokumen_portal') && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Pustaka Dokumen & Virtual Data Room
                  </h3>
                  <p className="text-xs text-slate-500">
                    Koleksi dokumen legalitas, prospektus, dan laporan keuangan terenkripsi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus size={14} />
                  <span>Unggah Dokumen Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <FileText size={16} className="text-emerald-600" />
                    <span>Akta Notaris & AD/ART</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Dokumen pendirian resmi PT. Swarna Dipa Wisata</div>
                  <div className="pt-2 text-emerald-700 font-bold font-mono text-[10.5px]">Tersedia • PDF</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <FileSpreadsheet size={16} className="text-emerald-600" />
                    <span>Laporan Audit Keuangan 2025</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Hasil audit kantor akuntan publik independen</div>
                  <div className="pt-2 text-emerald-700 font-bold font-mono text-[10.5px]">Tersedia • PDF</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Lock size={16} className="text-amber-500" />
                    <span>Prospektus Equity 2026</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Pitchdeck resmi dan proyeksi arus kas 5 tahun</div>
                  <div className="pt-2 text-amber-700 font-bold font-mono text-[10.5px]">Publik • PDF</div>
                </div>
              </div>
            </div>
          )}

          {/* PENGATURAN INTEGRASI (VERCEL, SUPABASE, GITHUB) */}
          {activeNav === 'pengaturan' && (
            <SystemIntegrationsView />
          )}

          {activeNav === 'pengajuan_investor' && adminAccess?.canManageInvestors && (
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={() => setShowAddInvestorModal(true)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2">
                <Plus size={14}/><span>Daftarkan Investor Baru</span>
              </button>
            </div>
          )}

          {/* ADMINISTRATOR & ROLE PERMISSION */}
          {(activeNav === 'administrator' || activeNav === 'role_permission') && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Konfigurasi Administrator & Hak Akses (RBAC)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manajemen pengguna administrator, level akses RBAC, dan audit operasional perseroan.
                  </p>
                </div>
                {activeNav === 'administrator' && adminAccess?.isSuperAdmin && (
                  <button type="button" onClick={() => setShowAddAdminModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                    <Plus size={13} /><span>Tambah Admin</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveNav('pengaturan')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Server size={13} className="text-slate-500" />
                  <span>Cek Integrasi Cloud (Vercel, Supabase, GitHub)</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900">Status Koneksi Database & Server</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-slate-700 font-medium">
                      Realtime Data Service: <strong>Supabase Production sebagai sumber data utama</strong>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isSupabaseConfigured
                      ? 'Supabase production terhubung; dashboard memantau perubahan data secara realtime.'
                      : 'Menggunakan real-time client-side synchronization engine.'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900">Daftar Administrator Sistem</div>
                  <div className="divide-y divide-slate-200">
                    <div className="py-2 flex items-center justify-between">
                      <div>
                        <strong>Super Administrator</strong>
                        <div className="text-slate-500 text-[11px]">ayobisnisumrah@gmail.com</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                        Akses Penuh
                      </span>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <div>
                        <strong>Finance & Kasir Admin</strong>
                        <div className="text-slate-500 text-[11px]">finance@nuzultrip.com</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        Kasir & Dividen
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddAdminModal && adminAccess?.isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowAddAdminModal(false)}>
          <form onSubmit={handleCreateAdmin} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4">
            <h3 className="font-black text-lg">Tambah Administrator</h3>
            <input required value={newAdminName} onChange={(e)=>setNewAdminName(e.target.value)} placeholder="Nama lengkap" className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <input required type="email" value={newAdminEmail} onChange={(e)=>setNewAdminEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <select value={newAdminRole} onChange={(e)=>setNewAdminRole(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm">
              <option value="admin_finance_reporting">Admin Keuangan & Laporan</option>
              <option value="admin_document_verification">Admin Dokumen & Verifikasi</option>
              <option value="admin_investor_relations">Admin Investor Relations</option>
              <option value="admin_portal_communications">Admin Portal & Komunikasi</option>
              <option value="admin_internal">Admin Internal</option>
            </select>
            <div className="flex justify-end gap-2"><button type="button" onClick={()=>setShowAddAdminModal(false)} className="px-4 py-2 rounded-xl bg-slate-100">Batal</button><button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">Buat Admin</button></div>
          </form>
        </div>
      )}

      {showAddInvestorModal && adminAccess?.canManageInvestors && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowAddInvestorModal(false)}>
          <form onSubmit={handleCreateInvestor} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4">
            <h3 className="font-black text-lg">Daftarkan Investor Baru</h3>
            <input required value={newInvestorName} onChange={(e)=>setNewInvestorName(e.target.value)} placeholder="Nama legal investor" className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <input required type="email" value={newInvestorEmail} onChange={(e)=>setNewInvestorEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <input value={newInvestorWhatsapp} onChange={(e)=>setNewInvestorWhatsapp(e.target.value)} placeholder="WhatsApp" className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <div className="flex justify-end gap-2"><button type="button" onClick={()=>setShowAddInvestorModal(false)} className="px-4 py-2 rounded-xl bg-slate-100">Batal</button><button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">Daftarkan</button></div>
          </form>
        </div>
      )}

      {/* MODAL KASIR (Point of Sale) */}
      {showKasirModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowKasirModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="text-emerald-600" size={20} />
                <h3 className="font-extrabold text-base text-slate-900">
                  Mesin Kasir & Buat Transaksi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKasirModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProcessTransaction} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenis Transaksi</label>
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                >
                  <option value="equity_purchase">
                    Pembelian Unit Equity Nuzultrip (Rp 100.000.000 / unit)
                  </option>
                  <option value="umroh_package">Pembayaran Paket Jamaah Umroh</option>
                  <option value="hotel_allotment">Pemesanan Hotel Makkah/Madinah (B2B)</option>
                  <option value="visa_handling">Layanan Visa & Muassasah Saudi</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Pelanggan / Calon Investor
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Nama Lengkap Investor"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              {txType === 'equity_purchase' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jumlah Unit Equity (Sisa: {portalSettings.availableUnits} Unit)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={portalSettings.availableUnits || 10}
                      value={equityUnits}
                      onChange={(e) => setEquityUnits(Number(e.target.value))}
                      className="w-24 px-3 py-2 rounded-xl border border-slate-200 outline-none"
                    />
                    <span className="font-bold text-emerald-700">
                      Total: {formatRupiah(equityUnits * 100000000)}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nominal Transaksi (Rp)</label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Metode Pembayaran</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                >
                  <option value="bank_transfer_bsi">Transfer Bank Syariah Indonesia (BSI)</option>
                  <option value="bank_transfer_mandiri">Transfer Mandiri Syariah</option>
                  <option value="qris">QRIS Dinamis</option>
                  <option value="cash">Setoran Tunai Front Office</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan</label>
                <input
                  type="text"
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  placeholder="Keterangan setoran atau nomor referensi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Receipt size={14} />
                  <span>Proses Transaksi & Kwitansi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowKasirModal(false)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TERBITKAN LAPORAN */}
      {showAddReportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowAddReportModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="text-emerald-600" size={20} />
                <h3 className="font-extrabold text-base text-slate-900">
                  Terbitkan Dokumen / Laporan Resmi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddReportModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePublishReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Laporan</label>
                <input
                  type="text"
                  required
                  value={repTitle}
                  onChange={(e) => setRepTitle(e.target.value)}
                  placeholder="Contoh: Laporan Keuangan Audited Q3 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Periode</label>
                  <input
                    type="text"
                    required
                    value={repPeriod}
                    onChange={(e) => setRepPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={repCategory}
                    onChange={(e) => setRepCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  >
                    <option value="keuangan">Keuangan</option>
                    <option value="bagi_hasil">Bagi Hasil</option>
                    <option value="operasional">Operasional</option>
                    <option value="legalitas">Legalitas / RUPS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Auditor / Pengesah</label>
                <input
                  type="text"
                  value={repAuditor}
                  onChange={(e) => setRepAuditor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ringkasan Eksekutif</label>
                <textarea
                  rows={3}
                  required
                  value={repSummary}
                  onChange={(e) => setRepSummary(e.target.value)}
                  placeholder="Ulasan kinerja laba, jamaah, dividen..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send size={14} />
                  <span>Kirim ke Portal Investor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(false)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kwitansi Modal */}
      <InvoiceReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
