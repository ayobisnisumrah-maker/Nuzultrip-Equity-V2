import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  Percent,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info,
  Copy,
  Check,
  PieChart,
  BarChart3,
  Clock,
  Banknote
} from 'lucide-react';

interface EquityRoiCalculatorProps {
  onOpenInterest: (units: number) => void;
}

type ScenarioType = 'konservatif' | 'moderat' | 'optimis' | 'kustom';

interface ScenarioConfig {
  id: ScenarioType;
  label: string;
  tag: string;
  rate: number; // in percent per year
  description: string;
}

const SCENARIOS: Record<'konservatif' | 'moderat' | 'optimis', ScenarioConfig> = {
  konservatif: {
    id: 'konservatif',
    label: 'Konservatif',
    tag: 'Dasar',
    rate: 14,
    description: 'Berdasarkan margin aman penerbangan grup & paket Land Arrangement dasar yang terikat kontrak.',
  },
  moderat: {
    id: 'moderat',
    label: 'Moderat',
    tag: 'Rekomendasi',
    rate: 19,
    description: 'Pertumbuhan target didukung efisiensi automasi pemesanan, kuota hotel bintang, dan volume jamaah.',
  },
  optimis: {
    id: 'optimis',
    label: 'Optimis',
    tag: 'Skala Penuh',
    rate: 25,
    description: 'Optimalisasi penuh ekosistem 4 negara (KSA, UAE, Turki, RI) dan penetrasi korporasi.',
  },
};

const UNIT_PRICE = 100_000_000; // Rp 100 Juta
const OWNERSHIP_PER_UNIT = 0.8; // 0.8%
const MAX_UNITS = 25; // Sesuai ketersediaan alokasi penawaran

const formatCompactIdr = (value: number) => {
  if (Math.abs(value) >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(billions)} Miliar`;
  }
  if (Math.abs(value) >= 1_000_000) {
    const millions = value / 1_000_000;
    return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(millions)} Juta`;
  }
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
};

export const EquityRoiCalculator: React.FC<EquityRoiCalculatorProps> = ({ onOpenInterest }) => {
  const [units, setUnits] = useState<number>(1);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('moderat');
  const [customRoi, setCustomRoi] = useState<number>(20);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'ringkasan' | 'proyeksi5thn'>('ringkasan');

  // Determine active annual ROI rate
  const annualRoiRate = activeScenario === 'kustom'
    ? customRoi
    : SCENARIOS[activeScenario].rate;

  // Computations
  const totalInvestment = units * UNIT_PRICE;
  const ownershipPercentage = Number((units * OWNERSHIP_PER_UNIT).toFixed(2));
  const annualDividend = (totalInvestment * annualRoiRate) / 100;
  const monthlyDividend = Math.round(annualDividend / 12);
  const threeYearCumulative = annualDividend * 3;
  const fiveYearCumulative = annualDividend * 5;
  const breakEvenYears = Number((100 / annualRoiRate).toFixed(1));

  // 5-year breakdown data
  const yearlyBreakdown = useMemo(() => {
    return [1, 2, 3, 4, 5].map((year) => {
      const cumulativeDiv = annualDividend * year;
      const totalEstimatedValue = totalInvestment + cumulativeDiv;
      return {
        year,
        dividendYear: annualDividend,
        cumulativeDividend: cumulativeDiv,
        totalAssetValue: totalEstimatedValue,
        roiPercent: Math.round((cumulativeDiv / totalInvestment) * 100),
      };
    });
  }, [annualDividend, totalInvestment]);

  const handleCopySummary = () => {
    const text = `Simulasi Nuzultrip Equity:
- Jumlah: ${units} Unit (${ownershipPercentage}% Saham)
- Total Investasi: Rp ${(totalInvestment / 1_000_000).toLocaleString('id-ID')} Juta
- Skenario ROI: ${annualRoiRate}% / tahun
- Estimasi Dividen Bulanan: Rp ${monthlyDividend.toLocaleString('id-ID')} / bulan
- Estimasi Dividen Tahunan: Rp ${annualDividend.toLocaleString('id-ID')} / tahun
- Akumulasi Dividen 5 Tahun: Rp ${fiveYearCumulative.toLocaleString('id-ID')}
Info resmi: nuzultrip.com/equity`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const quickUnitOptions = [1, 2, 5, 10];

  return (
    <div
      id="kalkulator-roi"
      className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300"
    >
      {/* Header Banner */}
      <div className="px-6 py-6 sm:px-8 sm:py-7 border-b border-black/[0.06] bg-[#FAFAF8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] sm:text-[12px] font-bold tracking-wide uppercase">
            <Calculator size={13} className="text-emerald-600" />
            <span>Simulasi Interaktif Bagi Hasil</span>
          </div>
          <h3 className="text-[20px] sm:text-[23px] font-bold text-[#111111] tracking-tight">
            Kalkulator Proyeksi ROI Nuzultrip Equity
          </h3>
          <p className="text-[13px] sm:text-[14px] text-[#666666]">
            Simulasikan estimasi dividen bulanan dan nilai akumulasi bagi hasil sesuai alokasi unit Anda.
          </p>
        </div>

        {/* Action button copy / share */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold text-[#444444] bg-white border border-black/10 hover:border-black/25 hover:text-black hover:bg-[#F5F5F3] active:scale-95 transition-all shadow-xs cursor-pointer"
            title="Salin rincian simulasi ke clipboard"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-700 font-bold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-[#666666]" />
                <span>Salin Ringkasan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Interactive Inputs & Controls (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-7">
          {/* 1. Unit Selector */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-bold text-[#111111] flex items-center gap-2">
                <span>1. Pilih Jumlah Unit Investasi</span>
                <span className="text-[12px] font-normal text-[#777777]">
                  (Maks. {MAX_UNITS} unit)
                </span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#777777]">Porsi:</span>
                <span className="text-[13px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                  {ownershipPercentage}% Saham
                </span>
              </div>
            </div>

            {/* Stepper + Slider Control */}
            <div className="bg-[#F8F8F6] p-4 rounded-2xl border border-black/[0.06] space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[12px] font-medium text-[#666666]">
                    Nilai Nominal Investasi
                  </div>
                  <div className="text-[20px] sm:text-[24px] font-extrabold text-[#111111] tracking-tight">
                    {formatCompactIdr(totalInvestment)}
                  </div>
                </div>

                {/* Counter Buttons */}
                <div className="flex items-center gap-2.5 bg-white p-1 rounded-xl border border-black/10 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setUnits((prev) => Math.max(1, prev - 1))}
                    disabled={units <= 1}
                    className="w-9 h-9 rounded-lg font-bold text-[18px] flex items-center justify-center text-[#222222] hover:bg-black/5 active:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Kurangi unit"
                  >
                    -
                  </button>
                  <div className="w-12 text-center">
                    <span className="text-[19px] font-black text-[#111111] block leading-none">
                      {units}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#888888] tracking-wider">
                      Unit
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUnits((prev) => Math.min(MAX_UNITS, prev + 1))}
                    disabled={units >= MAX_UNITS}
                    className="w-9 h-9 rounded-lg font-bold text-[18px] flex items-center justify-center text-[#222222] hover:bg-black/5 active:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Tambah unit"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Range Slider */}
              <div className="space-y-1.5 pt-1">
                <input
                  type="range"
                  min="1"
                  max={MAX_UNITS}
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#111111]"
                  aria-label="Slider jumlah unit investasi"
                />
                <div className="flex justify-between text-[11px] font-medium text-[#888888]">
                  <span>1 Unit (Rp 100 Jt)</span>
                  <span>10 Unit (Rp 1 M)</span>
                  <span>{MAX_UNITS} Unit (Rp 2.5 M)</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-2 border-t border-black/[0.05] flex flex-wrap items-center gap-2">
                <span className="text-[12px] text-[#666666] font-medium mr-1">
                  Pilihan Cepat:
                </span>
                {quickUnitOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setUnits(opt)}
                    className={`px-3 py-1 text-[12px] font-bold rounded-lg border transition-all cursor-pointer ${
                      units === opt
                        ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                        : 'bg-white text-[#555555] border-black/10 hover:border-black/30 hover:bg-[#F2F2F0]'
                    }`}
                  >
                    {opt} Unit
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Scenario / ROI Preset Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-bold text-[#111111] flex items-center gap-2">
                <span>2. Skenario Proyeksi Pertumbuhan</span>
                <span className="text-[12px] font-normal text-[#777777]">
                  (Estimasi Return / Thn)
                </span>
              </label>
              <div className="text-[13px] font-bold text-[#111111]">
                ROI: <span className="text-emerald-700 font-extrabold">{annualRoiRate}%</span> / tahun
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {(Object.keys(SCENARIOS) as Array<'konservatif' | 'moderat' | 'optimis'>).map((key) => {
                const scen = SCENARIOS[key];
                const isSelected = activeScenario === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveScenario(key)}
                    className={`p-3 sm:p-3.5 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111] shadow-sm ring-2 ring-black/10'
                        : 'bg-white text-[#444444] border-black/10 hover:border-black/25 hover:bg-[#FAF9F7]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className={`text-[12px] font-bold tracking-tight ${isSelected ? 'text-white' : 'text-[#111111]'}`}>
                        {scen.label}
                      </span>
                      <span
                        className={`text-[9.5px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-black/5 text-[#666666]'
                        }`}
                      >
                        {scen.tag}
                      </span>
                    </div>
                    <div className="text-[17px] sm:text-[19px] font-extrabold leading-none mt-1">
                      {scen.rate}%
                      <span className={`text-[11px] font-normal ml-1 ${isSelected ? 'text-white/70' : 'text-[#777777]'}`}>
                        / thn
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom ROI option toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  setActiveScenario(activeScenario === 'kustom' ? 'moderat' : 'kustom')
                }
                className="text-[12.5px] font-semibold text-[#555555] hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Percent size={13} className="text-[#888888]" />
                <span>
                  {activeScenario === 'kustom'
                    ? 'Kembali ke skenario standar'
                    : 'Ingin atur persentase ROI secara bebas? Klik di sini'}
                </span>
              </button>

              {activeScenario === 'kustom' && (
                <div className="mt-2.5 p-3.5 bg-[#F8F8F6] rounded-xl border border-black/[0.08] space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-[#333333]">Persentase ROI Kustom:</span>
                    <span className="font-extrabold text-emerald-700 text-[15px]">{customRoi}% / tahun</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="35"
                    step="1"
                    value={customRoi}
                    onChange={(e) => setCustomRoi(Number(e.target.value))}
                    className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#111111]"
                  />
                  <div className="flex justify-between text-[10.5px] text-[#888888]">
                    <span>10% (Minimal)</span>
                    <span>20% (Rata-rata Industri)</span>
                    <span>35% (Agresif)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Scenario explanation */}
            <p className="text-[12.5px] text-[#666666] leading-relaxed bg-[#F8F8F6] p-3 rounded-xl border border-black/[0.05] flex items-start gap-2">
              <Info size={15} className="shrink-0 text-[#888888] mt-0.5" />
              <span>
                {activeScenario === 'kustom'
                  ? `Simulasi kustom dengan asumsi return tahunan ${customRoi}%. Imbal hasil berasal dari keuntungan operasional ekosistem Nuzultrip.`
                  : SCENARIOS[activeScenario].description}
              </span>
            </p>
          </div>

          {/* 3. Distribution Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-black/[0.08]">
              <div className="p-2 rounded-lg bg-black/5 text-[#111111] shrink-0 mt-0.5">
                <Clock size={16} />
              </div>
              <div className="text-[12.5px]">
                <div className="font-bold text-[#111111]">Distribusi Bagi Hasil Bulanan</div>
                <div className="text-[#666666] leading-tight mt-0.5">
                  Bagi hasil ditransfer setiap bulan langsung ke rekening investor.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-black/[0.08]">
              <div className="p-2 rounded-lg bg-black/5 text-[#111111] shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div className="text-[12.5px]">
                <div className="font-bold text-[#111111]">Laporan Keuangan Berkala</div>
                <div className="text-[#666666] leading-tight mt-0.5">
                  Transparansi buku kas melalui Portal Investor dan audit akuntan resmi.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Results & Cumulative Projection (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col h-full space-y-4">
          {/* Main Card: Highlight Returns */}
          <div className="bg-[#090909] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col justify-between">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Header result */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                    Hasil Simulasi Investasi
                  </span>
                  <div className="text-[13px] text-white/70 mt-0.5">
                    {units} Unit • {ownershipPercentage}% Saham PT
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-white/60 block">
                    Modal Investasi
                  </span>
                  <span className="text-[15px] font-bold text-white">
                    {formatCompactIdr(totalInvestment)}
                  </span>
                </div>
              </div>

              {/* Primary Metric: Estimasi Dividen Bulanan (Passive Income) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 sm:p-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-semibold text-white/70 flex items-center gap-1.5">
                    <Banknote size={14} className="text-emerald-400" />
                    <span>Estimasi Bagi Hasil Bulanan</span>
                  </span>
                  <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Rutin / Bulan
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-1.5 font-extrabold text-white tracking-tight leading-tight">
                  <span className="text-[24px] sm:text-[32px]">
                    Rp {monthlyDividend.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[13px] sm:text-[14px] font-normal text-white/60">
                    / bulan
                  </span>
                </div>
                <p className="text-[11.5px] text-white/50 mt-2 leading-tight">
                  Diproyeksikan cair setiap bulan langsung dari operasional travel & land arrangement.
                </p>
              </div>

              {/* Secondary Metrics: Tahunan & Akumulasi */}
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div className="bg-white/[0.03] border border-white/[0.08] p-3 rounded-xl">
                  <span className="text-[11px] text-white/60 block mb-0.5">
                    Bagi Hasil Tahunan:
                  </span>
                  <span className="text-[16px] sm:text-[17px] font-bold text-emerald-400 block">
                    {formatCompactIdr(annualDividend)}
                  </span>
                  <span className="text-[10px] text-white/40">ROI {annualRoiRate}% / thn</span>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] p-3 rounded-xl">
                  <span className="text-[11px] text-white/60 block mb-0.5">
                    Balik Modal Dividen:
                  </span>
                  <span className="text-[16px] sm:text-[17px] font-bold text-white block">
                    ~{breakEvenYears} Tahun
                  </span>
                  <span className="text-[10px] text-white/40">Dari dividen kas</span>
                </div>
              </div>

              {/* 3 & 5 Years Cumulative Accordion/Preview */}
              <div className="pt-1 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-white/70">Akumulasi Dividen 3 Tahun:</span>
                  <span className="font-bold text-white">
                    {formatCompactIdr(threeYearCumulative)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-white/70">Akumulasi Dividen 5 Tahun:</span>
                  <span className="font-bold text-emerald-400 text-[13.5px]">
                    {formatCompactIdr(fiveYearCumulative)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12.5px] pt-1 border-t border-white/5 font-semibold">
                  <span className="text-white/90">Total Nilai (Modal + Dividen 5 Thn):</span>
                  <span className="font-extrabold text-white text-[14px]">
                    {formatCompactIdr(totalInvestment + fiveYearCumulative)}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Action CTA */}
            <div className="relative z-10 pt-6 mt-4">
              <button
                type="button"
                id="kalkulator-cta-ajukan"
                onClick={() => onOpenInterest(units)}
                className="w-full py-3.5 px-4 rounded-xl bg-white text-[#090909] font-bold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 hover:bg-[#EDEDEB] active:scale-98 transition-all duration-200 shadow-md cursor-pointer group"
              >
                <span>Ajukan Minat untuk {units} Unit Ini</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10.5px] text-center text-white/40 mt-2.5">
                Pendaftaran awal bebas komitmen • Alokasi terbatas 50 unit
              </p>
            </div>
          </div>

          {/* Toggle Table Proyeksi 5 Tahun */}
          <div className="bg-[#F8F8F6] p-4 rounded-2xl border border-black/[0.06] text-[13px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-[#222222]">
                <BarChart3 size={15} className="text-[#666666]" />
                <span>Rincian Proyeksi 5 Tahun</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setViewMode(viewMode === 'ringkasan' ? 'proyeksi5thn' : 'ringkasan')
                }
                className="text-[12px] font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                {viewMode === 'ringkasan' ? 'Buka Tabel +' : 'Tutup Tabel -'}
              </button>
            </div>

            {viewMode === 'proyeksi5thn' && (
              <div className="mt-3.5 space-y-2 animate-in fade-in duration-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11.5px]">
                    <thead>
                      <tr className="border-b border-black/10 text-[#666666] font-semibold">
                        <th className="pb-1.5 font-bold">Thn</th>
                        <th className="pb-1.5 font-bold text-right">Dividen/Thn</th>
                        <th className="pb-1.5 font-bold text-right">Kumulatif</th>
                        <th className="pb-1.5 font-bold text-right">ROI Kas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      {yearlyBreakdown.map((row) => (
                        <tr key={row.year} className="hover:bg-black/[0.02]">
                          <td className="py-1.5 font-bold text-[#111111]">Thn {row.year}</td>
                          <td className="py-1.5 text-right text-[#444444]">
                            Rp {(row.dividendYear / 1_000_000).toFixed(1)} Jt
                          </td>
                          <td className="py-1.5 text-right font-semibold text-[#111111]">
                            Rp {(row.cumulativeDividend / 1_000_000).toFixed(1)} Jt
                          </td>
                          <td className="py-1.5 text-right font-bold text-emerald-700">
                            {row.roiPercent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-[10px] text-[#777777] pt-1 italic">
                  *Asumsi konstan dividen per tahun, belum memperhitungkan potensi kenaikan valuasi pokok saham (capital gain).
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="px-6 py-4 sm:px-8 bg-[#F5F5F3] border-t border-black/[0.06] text-[11.5px] text-[#777777] leading-relaxed flex items-start gap-2">
        <Info size={14} className="shrink-0 text-[#888888] mt-0.5" />
        <p>
          <strong className="text-[#444444]">Pemberitahuan Kepatuhan & Risiko:</strong> Simulasi ini merupakan proyeksi estimasi berdasarkan model operasional dan rekam jejak Nuzultrip, bukan jaminan kepastian imbal hasil tetap. Distribusi bagi hasil dilakukan secara transparan setiap bulan sesuai dengan laba bersih operasional perseroan dan disahkan melalui mekanisme pertanggungjawaban pemegang saham.
        </p>
      </div>
    </div>
  );
};
