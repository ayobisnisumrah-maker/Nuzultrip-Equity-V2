import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  BarChart3,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  DollarSign,
  Building,
  Plane,
  Receipt,
  ShieldCheck,
  Printer,
  ChevronRight,
} from 'lucide-react';

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

interface FinancialManagementViewProps {
  initialSubTab?: 'ringkasan' | 'periode' | 'kpi';
}

export const FinancialManagementView: React.FC<FinancialManagementViewProps> = ({
  initialSubTab = 'ringkasan',
}) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'periode' | 'kpi'>(initialSubTab);
  const [closingSuccess, setClosingSuccess] = useState<string | null>(null);

  // Financial Summary Data (PT. Swarna Dipa Wisata - Nuzultrip)
  const currentYear = 2026;
  const totalRevenue = 48500000000; // Rp 48.5 Miliar (YTD Sept 2026)
  const cogsHpp = 37400000000; // Rp 37.4 Miliar
  const grossProfit = totalRevenue - cogsHpp; // Rp 11.1 Miliar (22.88%)
  const opex = 4300000000; // Rp 4.3 Miliar (Gaji, Sewa Kantor, Marketing)
  const netProfit = grossProfit - opex; // Rp 6.8 Miliar (14.02%)
  const investorDividendPool = netProfit * 0.4; // 40% alokasi equity publik = Rp 2.72 Miliar
  const dividendPerUnit = investorDividendPool / 20; // 20 unit publik = Rp 136 Juta / unit YTD

  const revenueStreams = [
    {
      name: 'Paket Umrah Reguler & VIP',
      amount: 28600000000,
      share: '59.0%',
      paxCount: '920 Jamaah',
      icon: Plane,
      growth: '+18.4%',
    },
    {
      name: 'Land Arrangement (LA) & Hotel B2B',
      amount: 11800000000,
      share: '24.3%',
      paxCount: '2.400 Room Nights',
      icon: Building,
      growth: '+24.1%',
    },
    {
      name: 'Tiket Penerbangan Grup (Charter/Block Seats)',
      amount: 6200000000,
      share: '12.8%',
      paxCount: '1.850 Tiket',
      icon: Receipt,
      growth: '+12.5%',
    },
    {
      name: 'Visa Umrah & Handling Bandara',
      amount: 1900000000,
      share: '3.9%',
      paxCount: '1.200 Visa',
      icon: ShieldCheck,
      growth: '+8.2%',
    },
  ];

  const financialPeriods = [
    {
      id: 'Q3-2026',
      periodName: 'Kuartal III 2026 (Juli - September)',
      status: 'Sedang Berjalan',
      omset: 'Rp 16.800.000.000',
      labaBersih: 'Rp 2.450.000.000',
      dividenPool: 'Rp 980.000.000',
      dividenPerUnit: 'Rp 49.000.000 / Unit',
      auditStatus: 'Internal Review',
      isClosed: false,
    },
    {
      id: 'Q2-2026',
      periodName: 'Kuartal II 2026 (April - Juni)',
      status: 'Tutup Buku & Selesai Audit',
      omset: 'Rp 17.500.000.000',
      labaBersih: 'Rp 2.620.000.000',
      dividenPool: 'Rp 1.048.000.000',
      dividenPerUnit: 'Rp 52.400.000 / Unit',
      auditStatus: 'KAP Achmad & Rekan (WTP)',
      isClosed: true,
    },
    {
      id: 'Q1-2026',
      periodName: 'Kuartal I 2026 (Januari - Maret)',
      status: 'Tutup Buku & Selesai Audit',
      omset: 'Rp 14.200.000.000',
      labaBersih: 'Rp 1.730.000.000',
      dividenPool: 'Rp 692.000.000',
      dividenPerUnit: 'Rp 34.600.000 / Unit',
      auditStatus: 'KAP Achmad & Rekan (WTP)',
      isClosed: true,
    },
    {
      id: 'FY-2025',
      periodName: 'Tahun Buku 2025 (Audited Full Year)',
      status: 'Selesai & Disahkan RUPS',
      omset: 'Rp 52.400.000.000',
      labaBersih: 'Rp 7.820.000.000',
      dividenPool: 'Rp 3.128.000.000',
      dividenPerUnit: 'Rp 156.400.000 / Unit',
      auditStatus: 'Opini Wajar Tanpa Pengecualian (WTP)',
      isClosed: true,
    },
  ];

  const handleCloseBook = (periodId: string) => {
    setClosingSuccess(`Buku periode ${periodId} berhasil ditutup dan laporan neraca dikunci untuk audit.`);
    setTimeout(() => setClosingSuccess(null), 5000);
  };

  const handleDownloadReport = (title: string) => {
    alert(`Laporan ${title} format resmi PDF & Excel sedang diunduh.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Alert toast */}
      {closingSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs">
          <span>✓ {closingSuccess}</span>
          <button onClick={() => setClosingSuccess(null)} className="p-1 hover:text-emerald-950 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* HEADER WITH SUB TABS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Laporan & Manajemen Keuangan Perseroan
            </h3>
            <p className="text-xs text-slate-500">
              Ringkasan performa finansial, pembukuan periode kuartalan, dan KPI bagi hasil investor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadReport('Neraca Laba Rugi Konsolidasi 2026')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download size={14} />
              <span>Unduh Laporan (PDF)</span>
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 pt-1 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('ringkasan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ringkasan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TrendingUp size={14} />
            <span>Ringkasan Keuangan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('periode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'periode'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar size={14} />
            <span>Periode Keuangan & Closing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kpi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'kpi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart3 size={14} />
            <span>KPI & Rasio Investasi</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RINGKASAN KEUANGAN */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6">
          {/* TOP 4 FINANCIAL METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                Total Pendapatan (YTD 2026)
              </div>
              <div className="text-2xl font-black text-slate-900">
                {formatRupiah(totalRevenue)}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <ArrowUpRight size={13} />
                <span>+21.4% dibanding periode sama 2025</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                Laba Kotor (Gross Margin)
              </div>
              <div className="text-2xl font-black text-slate-900">
                {formatRupiah(grossProfit)}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">
                Margin Kotor: <strong>22.88%</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                Laba Bersih Operasional
              </div>
              <div className="text-2xl font-black text-emerald-700">
                {formatRupiah(netProfit)}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">
                Net Profit Margin: <strong>14.02%</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-300 shadow-2xs bg-emerald-50/20 space-y-1">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-800">
                Pool Dividen Investor (40%)
              </div>
              <div className="text-2xl font-black text-emerald-900">
                {formatRupiah(investorDividendPool)}
              </div>
              <div className="text-[11px] text-emerald-700 font-bold">
                Rp 136.000.000 / Unit (YTD)
              </div>
            </div>
          </div>

          {/* BREAKDOWN REVENUE STREAMS & EXPENSES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Struktur Pendapatan per Lini Bisnis
                  </h4>
                  <p className="text-xs text-slate-400">
                    Diversifikasi pendapatan ekosistem perjalanan umrah & haji.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500">4 Lini Bisnis Aktif</span>
              </div>

              <div className="space-y-3 pt-1">
                {revenueStreams.map((stream, idx) => {
                  const Icon = stream.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{stream.name}</div>
                          <div className="text-[11px] text-slate-400">
                            Volume: {stream.paxCount} • Porsi {stream.share}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-black text-slate-900 text-sm">
                          {formatRupiah(stream.amount)}
                        </div>
                        <div className="text-[10.5px] font-bold text-emerald-600">
                          {stream.growth} YoY
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">
                  Rincian Biaya Operasional (OPEX)
                </h4>
                <p className="text-xs text-slate-400">Alokasi beban usaha tahun berjalan.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-800">Gaji Staf & Tim Muthowif</div>
                    <div className="text-[10.5px] text-slate-400">32 Staf Tetap & 18 Pembimbing</div>
                  </div>
                  <div className="font-mono font-bold text-slate-900">Rp 1.950.000.000</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-800">Sewa Kantor & Utilitas</div>
                    <div className="text-[10.5px] text-slate-400">Kantor Pusat Makassar & Jakarta</div>
                  </div>
                  <div className="font-mono font-bold text-slate-900">Rp 680.000.000</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-800">Pemasaran Digital & Manasik</div>
                    <div className="text-[10.5px] text-slate-400">Edukasi jamaah, seminar & iklan</div>
                  </div>
                  <div className="font-mono font-bold text-slate-900">Rp 920.000.000</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-800">Teknologi & Legal Notariat</div>
                    <div className="text-[10.5px] text-slate-400">Server, portal investor & audit KAP</div>
                  </div>
                  <div className="font-mono font-bold text-slate-900">Rp 750.000.000</div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-xs">
                  <span className="text-slate-600">Total Biaya Operasional:</span>
                  <span className="font-mono text-slate-900">{formatRupiah(opex)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERIODE KEUANGAN & CLOSING */}
      {activeTab === 'periode' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h4 className="text-base font-black text-slate-900">
                Daftar Periode Buku & Status Closing
              </h4>
              <p className="text-xs text-slate-500">
                Pengendalian tutup buku keuangan per kuartal dan pencatatan opini audit akuntan independen.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              Audit KAP Rekanan: Kantor Akuntan Publik Achmad & Rekan
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Nama Periode</th>
                  <th className="py-3 px-4">Omset Perjalanan</th>
                  <th className="py-3 px-4">Laba Bersih</th>
                  <th className="py-3 px-4">Dividen Pool (40%)</th>
                  <th className="py-3 px-4">Dividen / Unit</th>
                  <th className="py-3 px-4">Status Audit</th>
                  <th className="py-3 px-4 text-center">Aksi / Closing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {financialPeriods.map((period) => (
                  <tr key={period.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{period.periodName}</div>
                      <div className="text-[10.5px] text-slate-400 font-mono">{period.id}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {period.omset}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-700">
                      {period.labaBersih}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                      {period.dividenPool}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {period.dividenPerUnit}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-slate-100 text-slate-700">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>{period.auditStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {period.isClosed ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[10.5px] border border-emerald-200">
                          Terkunci & Sah
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCloseBook(period.id)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10.5px] cursor-pointer shadow-xs"
                        >
                          Tutup Buku
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KPI & RASIO INVESTASI */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  EBITDA Margin
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                  Target: &gt;18%
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900">20.8%</div>
              <p className="text-xs text-slate-500">
                Kinerja laba operasional sebelum bunga, pajak, dan depresiasi sangat sehat.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Proyeksi Dividen Yield
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                  Aktif
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-700">19.2%</div>
              <p className="text-xs text-slate-500">
                Tingkat pengembalian tahunan yang didistribusikan kepada pemegang saham unit.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Solvabilitas & Likuiditas
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                  Zero Debt
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900">3.4x</div>
              <p className="text-xs text-slate-500">
                Rasio lancar kas terhadap kewajiban jangka pendek tanpa utang perbankan berbunga.
              </p>
            </div>
          </div>

          {/* TARGET OPERASIONAL & REALISASI */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              Pencapaian Target Finansial & Operasional 2026
            </h4>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">Volume Jamaah Umrah (Target 1.500 Jamaah)</span>
                  <span className="text-emerald-700">920 Jamaah (61.3%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-[61.3%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">Omset Konsolidasi (Target Rp 65 Miliar)</span>
                  <span className="text-emerald-700">Rp 48.5 Miliar (74.6%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-[74.6%] h-full bg-emerald-600 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">Penyerapan Kuota Saham Publik (20 Unit)</span>
                  <span className="text-amber-700">6 Unit Terjual (30.0%) • Sisa 14 Unit</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-[30%] h-full bg-amber-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
