import React, { useState, useEffect } from 'react';
import {
  FileText,
  DollarSign,
  PieChart,
  ShieldCheck,
  Download,
  Calendar,
  Eye,
  Search,
  Bell,
  CheckCircle2,
  TrendingUp,
  Building2,
  Users,
  CreditCard,
  MessageSquare,
  ArrowLeft,
  LogOut,
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  ShieldAlert,
  ArrowLeftRight,
  GitFork,
  Clock,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import {
  InvestorProfile,
  InvestorReport,
  DividendRecord,
} from '../../data/investorData';
import { realtimeStore, ShareTransferRequest } from '../../services/realtimeStore';
import { ReportDetailModal } from './ReportDetailModal';
import { SaleRequestModal, InheritanceModal } from './LiquidityModals';

interface InvestorDashboardProps {
  onBackToHome: () => void;
  onLogout: () => void;
  onOpenSuperAdmin?: () => void;
}

type TabType =
  | 'laporan'
  | 'riwayat_dividen'
  | 'likuiditas_waris'
  | 'portofolio'
  | 'legalitas'
  | 'bantuan';

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  onBackToHome,
  onLogout,
  onOpenSuperAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('laporan');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<InvestorReport | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Realtime reports, dividends, and transfer requests
  const [reports, setReports] = useState<InvestorReport[]>(realtimeStore.getReports());
  const [dividends, setDividends] = useState<DividendRecord[]>(realtimeStore.getDividends());
  const [transferRequests, setTransferRequests] = useState<ShareTransferRequest[]>(
    realtimeStore.getTransferRequests()
  );
  const [investor, setInvestor] = useState<InvestorProfile | null>(
    realtimeStore.getInvestorProfile()
  );

  // Liquidity modals
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showInheritanceModal, setShowInheritanceModal] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setReports(realtimeStore.getReports());
      setDividends(realtimeStore.getDividends());
      setTransferRequests(realtimeStore.getTransferRequests());
      setInvestor(realtimeStore.getInvestorProfile());
    };
    const unsubscribe = realtimeStore.subscribe(sync);
    return () => unsubscribe();
  }, []);

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesCategory =
      selectedCategory === 'semua' || report.category === selectedCategory;
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.period.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0f172a] font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand & Portal Badge */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Kembali ke Beranda"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Website Utama</span>
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-baseline">
              <span className="text-[19px] sm:text-[21px] font-extrabold tracking-tight text-[#0f172a]">
                Nuzultrip
              </span>
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Portal Investor
              </span>
            </div>
          </div>

          {/* Right: Notification & User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotification(!showNotification)}
                className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Pemberitahuan"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </button>

              {/* Notification Popover */}
              {showNotification && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Pemberitahuan Laporan
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      2 Baru
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div
                      onClick={() => {
                        if (reports.length > 0) setSelectedReport(reports[0]);
                        setShowNotification(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Laporan Keuangan Q2 2026 Teraudit Telah Rilis
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Pertumbuhan omzet 28.4% YoY. Klik untuk membaca.
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            15 Juli 2026
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        if (reports.length > 1) setSelectedReport(reports[1]);
                        else if (reports.length > 0) setSelectedReport(reports[0]);
                        setShowNotification(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Bagi Hasil Periode Mei-Juni Berhasil Ditransfer
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Dana Rp 6.400.000 telah masuk rekening BSI Anda.
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            30 Juni 2026
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Investor Card Pill */}
            <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {investor?.name.slice(0, 2)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {investor?.name}
                </div>
                <div className="text-[10.5px] text-emerald-600 font-medium">
                  {investor?.id} · {investor?.unitsOwned} Unit
                </div>
              </div>
            </div>

            {/* Super Admin Switch button */}
            {onOpenSuperAdmin && (
              <button
                type="button"
                onClick={onOpenSuperAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs font-semibold cursor-pointer transition-all shadow-xs"
              >
                <ShieldAlert size={14} className="text-amber-400" />
                <span>Panel Super Admin</span>
              </button>
            )}

            {/* Logout button */}
            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Keluar dari Portal"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Welcome Banner & Summary KPIs */}
        <div className="bg-gradient-to-br from-[#111822] via-[#162230] to-[#0f172a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Sertifikat Kepemilikan Unit Equity Aktif
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Selamat Datang, {investor?.name}
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Pantau laporan keuangan berkala, notulen RUPS, performa operasional ekosistem, dan riwayat penerimaan bagi hasil Nuzultrip secara transparan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {reports.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedReport(reports[0])}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0d151d] font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <FileText size={15} />
                  <span>Baca Laporan Terbaru</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTab('riwayat_dividen')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <DollarSign size={15} className="text-emerald-400" />
                <span>Cek Riwayat Bagi Hasil</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 relative z-10">
            {/* KPI 1 */}
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span>Unit Dimiliki</span>
                <PieChart size={15} className="text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {investor?.unitsOwned} Unit
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">
                {investor?.equityPercentage}% Porsi Kepemilikan
              </div>
            </div>

            {/* KPI 2 */}
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span>Nilai Investasi Awal</span>
                <ShieldCheck size={15} className="text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {formatRupiah(investor?.totalInvestment ?? 0)}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                Terdaftar di Kemenkumham RI
              </div>
            </div>

            {/* KPI 3 */}
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span>Total Bagi Hasil Diterima</span>
                <TrendingUp size={15} className="text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {formatRupiah(investor?.totalDividendsReceived ?? 0)}
              </div>
              <div className="text-[11px] text-slate-300 font-medium mt-1">
                Akumulasi sejak {investor?.joinDate}
              </div>
            </div>

            {/* KPI 4 */}
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span>Bagi Hasil Berikutnya</span>
                <Calendar size={15} className="text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {formatRupiah(investor?.pendingDividend ?? 0)}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">
                Est. Cair: {investor?.nextDividendDate}
              </div>
            </div>

            {/* ACTION ROW: JUAL SAHAM / BERIKAN KE AHLI WARIS (Requested by User) */}
            <div className="col-span-2 lg:col-span-4 mt-2 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-emerald-950/40 border border-emerald-500/20 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <ArrowLeftRight size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                    <span>Likuiditas & Pengalihan Saham</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Hak Resmi Pemilik Saham
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Investor dapat menjual kembali saham (*secondary sale / buyback*) atau melimpahkan kepemilikan ke ahli waris sah.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <DollarSign size={15} />
                  <span>Jual Saham (Buyback)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowInheritanceModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer border border-emerald-400/30"
                >
                  <GitFork size={15} />
                  <span>Berikan ke Ahli Waris</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {alertSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5 font-bold">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{alertSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setAlertSuccess(null)}
              className="text-emerald-700 hover:text-emerald-950 font-extrabold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation Menu */}
        <div className="border-b border-slate-200 flex items-center gap-1 sm:gap-3 overflow-x-auto pb-px">
          <button
            type="button"
            onClick={() => setActiveTab('laporan')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'laporan'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={16} />
            <span>Dokumen & Laporan Resmi ({reports.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('riwayat_dividen')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'riwayat_dividen'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign size={16} />
            <span>Riwayat Bagi Hasil ({dividends.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('likuiditas_waris')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'likuiditas_waris'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowLeftRight size={16} />
            <span>Likuiditas & Pewarisan Saham</span>
            {transferRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {transferRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('portofolio')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'portofolio'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PieChart size={16} />
            <span>Performa Ekosistem</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('legalitas')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'legalitas'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck size={16} />
            <span>Sertifikat & Legalitas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bantuan')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bantuan'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare size={16} />
            <span>Kontak Investor Relations</span>
          </button>
        </div>

        {/* TAB 1: LAPORAN RESMI INVESTOR */}
        {activeTab === 'laporan' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'semua', label: 'Semua Laporan' },
                  { id: 'keuangan', label: 'Keuangan & Audit' },
                  { id: 'bagi_hasil', label: 'Bagi Hasil' },
                  { id: 'operasional', label: 'Operasional' },
                  { id: 'legalitas', label: 'RUPS & Legal' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <div className="relative min-w-[240px]">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, kuartal, atau kata kunci..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* List of Reports */}
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">
                  Tidak ditemukan laporan yang sesuai kriteria
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Coba ubah filter kategori atau kata kunci pencarian Anda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              report.category === 'keuangan'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : report.category === 'bagi_hasil'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : report.category === 'operasional'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {report.category.replace('_', ' ')}
                          </span>
                          {report.isNew && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                              Laporan Baru
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {report.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => setSelectedReport(report)}
                        className="text-[15px] sm:text-[16px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug cursor-pointer mb-2"
                      >
                        {report.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                        {report.summary}
                      </p>

                      {/* Mini Highlights */}
                      <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {report.highlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="text-[10.5px] text-slate-500 font-medium">
                              {h.label}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {h.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">
                        {report.fileSize} · {report.fileType}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedReport(report)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>Pratinjau</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedReport(report)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Download size={13} />
                          <span>Unduh</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RIWAYAT BAGI HASIL */}
        {activeTab === 'riwayat_dividen' && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Rekening Penerima Bagi Hasil
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dana dividen/bagi hasil ditransfer otomatis setiap akhir bulan ke rekening terdaftar.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                  <CreditCard size={15} className="text-emerald-600" />
                  <span>
                    <strong>{investor?.bankAccount.bankName}</strong> ·{' '}
                    {investor?.bankAccount.accountNumber} a/n{' '}
                    {investor?.bankAccount.accountHolder}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 font-medium block">
                  Total Terakumulasi
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600">
                  {formatRupiah(investor?.totalDividendsReceived ?? 0)}
                </span>
              </div>
            </div>

            {/* Dividend Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10.5px]">
                    <tr>
                      <th className="py-3.5 px-4">Periode</th>
                      <th className="py-3.5 px-4">Tanggal Pembayaran</th>
                      <th className="py-3.5 px-4">Yield / Unit</th>
                      <th className="py-3.5 px-4">Unit Dimiliki</th>
                      <th className="py-3.5 px-4">Total Diterima (Net)</th>
                      <th className="py-3.5 px-4">Status & Referensi</th>
                      <th className="py-3.5 px-4 text-right">Bukti Transfer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {dividends.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-500 text-xs">
                          Belum ada riwayat pembagian bagi hasil tercatat. Laporan bagi hasil akan diterbitkan secara otomatis setelah keputusan pembukuan buku kuartal & RUPS perseroan.
                        </td>
                      </tr>
                    ) : (
                      dividends.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {record.period}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {record.paymentDate}
                          </td>
                          <td className="py-3.5 px-4 text-slate-800">
                            {formatRupiah(record.amountPerUnit)}
                          </td>
                          <td className="py-3.5 px-4">{record.units} Unit</td>
                          <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                            {formatRupiah(record.totalNet)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={11} className="text-emerald-600" />
                              {record.status}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">
                              {record.referenceNumber}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                alert(
                                  `Bukti Transfer Resmi #${record.referenceNumber} senilai ${formatRupiah(
                                    record.totalNet
                                  )} telah diverifikasi melalui sistem kliring Bank Syariah Indonesia.`
                                );
                              }}
                              className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Download size={11} />
                              <span>Slip PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: LIKUIDITAS & PEWARISAN SAHAM (Requested by User) */}
        {activeTab === 'likuiditas_waris' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Info Banner */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-1 border border-emerald-200">
                    Opsi Likuiditas & Perlindungan Waris
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Pengalihan Kepemilikan & Pewarisan Unit Saham
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Sebagai pemegang unit saham equity PT. Swarna Dipa Wisata, Anda memiliki hak penuh untuk menjual kembali saham atau mewariskannya kepada keluarga sah.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowSaleModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <DollarSign size={15} />
                    <span>Jual Saham (Buyback)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowInheritanceModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <GitFork size={15} />
                    <span>Berikan ke Ahli Waris</span>
                  </button>
                </div>
              </div>

              {/* 2 Feature Explanatory Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <DollarSign size={16} className="text-amber-600" />
                    <span>Mekanisme Penjualan Kembali (Buyback)</span>
                  </div>
                  <p className="text-[11.5px] text-amber-950/80 leading-relaxed">
                    Pengajuan penjualan saham akan diproses oleh divisi Investor Relations & Finance perseroan dengan opsi pembelian kembali (*buyback*) oleh manajemen atau penawaran ke pemegang saham internal sebelum dilepas ke pasar sekunder.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>Mekanisme Pewarisan & Hibah Saham</span>
                  </div>
                  <p className="text-[11.5px] text-emerald-950/80 leading-relaxed">
                    Saham equity dan hak dividen bulanan dapat diwariskan kepada anak kandung, pasangan, orang tua, atau pihak penerima waris yang sah secara hukum melalui akta notaris resmi perseroan.
                  </p>
                </div>
              </div>
            </div>

            {/* List of Submitted Requests */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Riwayat & Status Pengajuan Pengalihan Saham
                  </h4>
                  <p className="text-xs text-slate-500">
                    Dipantau langsung dan diverifikasi oleh Super Admin & Notaris Perseroan
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Total: {transferRequests.length} Pengajuan
                </span>
              </div>

              {transferRequests.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  Belum ada pengajuan penjualan atau pewarisan saham yang dibuat.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {transferRequests.map((req) => (
                    <div key={req.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                req.type === 'sale'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {req.type === 'sale' ? 'Penjualan Saham / Buyback' : 'Pewarisan / Hibah Saham'}
                            </span>

                            <span className="text-xs font-mono font-bold text-slate-600">
                              #{req.id}
                            </span>

                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock size={12} />
                              {req.createdAt}
                            </span>
                          </div>

                          <div className="text-sm font-extrabold text-slate-900">
                            {req.units} Unit Saham · Nilai: Rp {req.totalValue.toLocaleString('id-ID')}
                          </div>

                          {req.type === 'sale' ? (
                            <div className="text-xs text-slate-600 space-y-0.5">
                              <div>
                                Rekening Tujuan: <strong>{req.bankName}</strong> · No. <strong>{req.bankAccount}</strong> (a.n {req.bankAccountName})
                              </div>
                              {req.saleReason && (
                                <div className="text-slate-500 italic">
                                  Alasan: &ldquo;{req.saleReason}&rdquo;
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-600 space-y-0.5">
                              <div>
                                Ahli Waris: <strong>{req.heirName}</strong> ({req.heirRelationship}) · NIK: <strong className="font-mono">{req.heirNik}</strong>
                              </div>
                              <div>
                                Kontak: {req.heirPhone} {req.heirEmail ? `· ${req.heirEmail}` : ''}
                              </div>
                              {req.legalDocNumber && (
                                <div className="text-slate-500">
                                  Dokumen: <strong>{req.legalDocNumber}</strong>
                                </div>
                              )}
                              {req.inheritanceNotes && (
                                <div className="text-slate-500 italic">
                                  Amanah: &ldquo;{req.inheritanceNotes}&rdquo;
                                </div>
                              )}
                            </div>
                          )}

                          {req.adminNotes && (
                            <div className="mt-2 p-2.5 rounded-xl bg-slate-100 text-xs text-slate-700 border border-slate-200">
                              <strong>Tanggapan Super Admin:</strong> {req.adminNotes}
                            </div>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 sm:text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              req.status === 'Disetujui'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : req.status === 'Ditolak'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                req.status === 'Disetujui'
                                  ? 'bg-emerald-500'
                                  : req.status === 'Ditolak'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500 animate-pulse'
                              }`}
                            />
                            {req.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PORTOFOLIO & EKOSISTEM */}
        {activeTab === 'portofolio' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Realisasi Jamaah</span>
                    <h4 className="text-lg font-extrabold text-slate-900">1.042 / 1.200 Target</h4>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  Target tahunan 2026 tercapai 86.8% per Triwulan II didorong permintaan umroh Syawal dan paket liburan sekolah.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Mitra Hotel Langsung</span>
                    <h4 className="text-lg font-extrabold text-slate-900">6 Hotel Bintang 4 & 5</h4>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  Kontrak langsung (*direct allotment*) di Makkah & Madinah menekan harga pokok penjualan kamar hingga 14%.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Proyeksi Yield Tahunan</span>
                    <h4 className="text-lg font-extrabold text-slate-900">19.2% / Tahun</h4>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  Berdasarkan rata-rata pembagian bagi hasil bulanan Januari-Juni 2026 sebesar Rp 3,2 Jt/unit.
                </p>
              </div>
            </div>

            {/* Growth Breakdown Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
                Pilar Pertumbuhan Ekosistem Nuzultrip 2026
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">1. Umroh Retail & VIP Keluarga (B2C)</span>
                    <span className="text-emerald-600">Rp 6.8 M (Kontribusi 58%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">2. B2B Land Arrangement & Visa Provider (Jeddah/Makkah)</span>
                    <span className="text-emerald-600">Rp 3.4 M (Kontribusi 29%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '29%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">3. Wisata Muslim Mancanegara (Turki, Uzbekistan, Al-Aqsa)</span>
                    <span className="text-emerald-600">Rp 1.5 M (Kontribusi 13%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '13%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEGALITAS & SERTIFIKAT */}
        {activeTab === 'legalitas' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Sertifikat Kepemilikan Digital Sah
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                    e-Sertifikat Unit Saham Equity Nuzultrip
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Nomor Registrasi Saham: <strong>NZ-SHR-2024-0018-0019</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const certReport = reports.find((r) => r.category === 'legalitas') || reports[0];
                    setSelectedReport(certReport);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download size={15} />
                  <span>Unduh e-Sertifikat Resmi</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 font-medium block">Badan Hukum</span>
                  <strong className="text-slate-800 text-sm mt-0.5 block">
                    PT Nuzul Berkah Wisata
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 font-medium block">SK Kemenkumham RI</span>
                  <strong className="text-slate-800 text-sm mt-0.5 block">
                    AHU-0019281.AH.01.01
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 font-medium block">Izin Umroh Kemenag (PPIU)</span>
                  <strong className="text-slate-800 text-sm mt-0.5 block">
                    No. 9120108920192
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 font-medium block">Akta Notaris Pendirian</span>
                  <strong className="text-slate-800 text-sm mt-0.5 block">
                    Akta No. 18 / H. Sudirman, SH
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BANTUAN & KONTAK IR */}
        {activeTab === 'bantuan' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 max-w-3xl mx-auto space-y-6">
            <div className="text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Layanan Khusus Investor Relations
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tim Investor Relations Nuzultrip siap membantu pertanyaan terkait laporan keuangan, jadwal RUPS, serta perubahan nomor rekening bagi hasil.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a
                href="https://wa.me/6281289218890?text=Halo%20Tim%20Investor%20Relations%20Nuzultrip,%20saya%20pemegang%20unit%20equity%20ingin%20berkonsultasi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-all flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  WA
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Hotline WhatsApp Prioritas
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Respon langsung dalam 15 menit
                  </p>
                </div>
              </a>

              <a
                href="mailto:ptalhananberkahwisata@gmail.com?subject=Konfirmasi%20Investor%20Nuzultrip"
                className="p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  @
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Email Resmi IR Perseroan
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ir@nuzultrip.com / ptalhananberkahwisata@gmail.com
                  </p>
                </div>
              </a>
            </div>

            {/* Kantor Representatif */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-900">Kantor Pusat Nuzultrip:</div>
              <div>Gedung Nuzultrip Tower, Lantai 12, Jl. TB Simatupang No. 88, Jakarta Selatan</div>
              <div>Hotline Kantor: (021) 789-2018 (Hari Kerja 08:30 - 17:00 WIB)</div>
            </div>
          </div>
        )}
      </main>

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      {/* Liquidity & Shareholder Rights Modals */}
      <SaleRequestModal
        isOpen={showSaleModal}
        investor={investor}
        onClose={() => setShowSaleModal(false)}
        onSuccess={(msg) => setAlertSuccess(msg)}
      />

      <InheritanceModal
        isOpen={showInheritanceModal}
        investor={investor}
        onClose={() => setShowInheritanceModal(false)}
        onSuccess={(msg) => setAlertSuccess(msg)}
      />
    </div>
  );
};
