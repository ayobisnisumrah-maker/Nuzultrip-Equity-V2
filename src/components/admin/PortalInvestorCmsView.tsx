import React, { useState, useEffect } from 'react';
import {
  Globe,
  Eye,
  Save,
  Sparkles,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  Building,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Layers,
  FileText,
  ShieldCheck,
  Check,
  Building2,
  Luggage,
  Compass,
  Briefcase,
  Sliders,
  Bell,
} from 'lucide-react';
import { realtimeStore, PortalSettings, PortalServiceItem, PortalProcessStep } from '../../services/realtimeStore';

interface PortalInvestorCmsViewProps {
  onOpenPublicPortal: () => void;
}

const PRESET_IMAGES = [
  {
    label: "Ka'bah & Pintu Emas (Klasik)",
    url: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=1600&auto=format&fit=crop',
  },
  {
    label: 'Masjid Nabawi Madinah (Senja)',
    url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Kota Mekkah & Menara Jam',
    url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Pertemuan Bisnis & Kemitraan',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
  },
];

type CmsTab = 'hero' | 'metrics' | 'about' | 'services' | 'process' | 'company';

export const PortalInvestorCmsView: React.FC<PortalInvestorCmsViewProps> = ({
  onOpenPublicPortal,
}) => {
  const [activeTab, setActiveTab] = useState<CmsTab>('hero');
  const [settings, setSettings] = useState<PortalSettings>(() =>
    realtimeStore.getPortalSettings()
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewTab, setPreviewTab] = useState<'desktop' | 'mobile'>('desktop');
  const [previewSection, setPreviewSection] = useState<'hero' | 'services' | 'process' | 'company'>('hero');

  // Local helper for highlight chips editing
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    const sync = () => {
      setSettings(realtimeStore.getPortalSettings());
    };
    const unsub = realtimeStore.subscribe(sync);
    return () => unsub();
  }, []);

  const handleChange = (key: keyof PortalSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleServiceChange = (index: number, field: keyof PortalServiceItem, val: string) => {
    const currentList = settings.servicesList ? [...settings.servicesList] : [];
    if (currentList[index]) {
      currentList[index] = { ...currentList[index], [field]: val };
      setSettings((prev) => ({ ...prev, servicesList: currentList }));
    }
  };

  const handleProcessChange = (index: number, field: keyof PortalProcessStep, val: string) => {
    const currentList = settings.processList ? [...settings.processList] : [];
    if (currentList[index]) {
      currentList[index] = { ...currentList[index], [field]: val };
      setSettings((prev) => ({ ...prev, processList: currentList }));
    }
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim()) return;
    const current = settings.heroHighlights ? [...settings.heroHighlights] : [];
    current.push(highlightInput.trim());
    setSettings((prev) => ({ ...prev, heroHighlights: current }));
    setHighlightInput('');
  };

  const handleRemoveHighlight = (index: number) => {
    const current = settings.heroHighlights ? [...settings.heroHighlights] : [];
    current.splice(index, 1);
    setSettings((prev) => ({ ...prev, heroHighlights: current }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    realtimeStore.updatePortalSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan seluruh konten dan parameter portal ke konfigurasi default perseroan?')) {
      const defaultData: Partial<PortalSettings> = {
        heroBadgeText: 'NUZULTRIP EQUITY · EKOSISTEM PERJALANAN MUSLIM',
        heroHeadline: 'Berkembang Dalam Ekosistem Muslim Yang Terintegrasi',
        heroSubheadline:
          'Nuzultrip membangun ekosistem perjalanan Muslim melalui integrasi layanan, jaringan, dan teknologi untuk pertumbuhan investasi jangka panjang.',
        heroCtaPrimary: 'Ajukan Minat Equity',
        heroCtaSecondary: 'Unduh Pitchdeck 2026',
        heroImageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop',
        runningAnnouncement:
          '📢 Pengumuman: RUPS Luar Biasa Kuartal 3 dijadwalkan pada 20 Oktober 2026. Laporan Triwulan II telah terbit.',
        showAnnouncement: true,
        availableUnits: 14,
        totalUnits: 50,
        pricePerUnit: 100000000,
        equityPercentage: 40,
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
        aboutDescription:
          'Nuzultrip hadir bukan sekadar biro perjalanan, melainkan ekosistem terpadu yang memadukan keandalan operasional umroh, kemitraan internasional, dan inovasi teknologi untuk melayani jutaan jamaah Muslim.',
        companyName: 'PT. Swarna Dipa Wisata (Nuzultrip)',
        companyAddress: 'RUKO PETTARANI, Jl. A. P. Pettarani No.24 Tamamaung, Panakkukang, Makassar 90232',
        companyLicensePpiu: 'SK Kemenag RI PPIU No. 912/2021 & Kemenkumham AHU-0019284.AH.01.01',
        contactEmail: 'equity@nuzultrip.com',
        contactPhone: '+62 812-4411-9988',
        footerCopyright: '© 2026 PT. Swarna Dipa Wisata. Seluruh hak cipta dilindungi undang-undang.',
      };
      realtimeStore.updatePortalSettings(defaultData);
      setSettings((prev) => ({ ...prev, ...defaultData }));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const tabsConfig = [
    { id: 'hero', label: 'Hero & Banner', icon: Sparkles, badge: 'Utama' },
    { id: 'metrics', label: 'Saham & Kuota', icon: DollarSign, badge: `${settings.availableUnits} Unit` },
    { id: 'about', label: 'Tentang & Visi', icon: Layers },
    { id: 'services', label: 'Katalog Layanan', icon: Briefcase, badge: '4 Layanan' },
    { id: 'process', label: 'Alur Investasi', icon: FileText, badge: '4 Tahap' },
    { id: 'company', label: 'Identitas & Legal', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <Globe size={13} />
            <span>PORTAL INVESTOR CMS & KONTROL KONTEN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pusat Kontrol Konten & Publikasi Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Edit seluruh teks, headline, kuota unit, katalog layanan, alur investasi, dan kontak legalitas portal publik. Perubahan langsung tersinkronisasi secara realtime.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenPublicPortal}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Eye size={14} />
            <span>Lihat Portal Publik</span>
            <ExternalLink size={12} className="text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-98"
          >
            <Save size={14} />
            <span>Simpan & Publikasikan</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Perubahan konten portal berhasil disimpan dan langsung aktif di portal publik!</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-mono">Status: LIVE 🟢</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs scrollbar-none">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as CmsTab);
                if (tab.id === 'hero') setPreviewSection('hero');
                if (tab.id === 'services') setPreviewSection('services');
                if (tab.id === 'process') setPreviewSection('process');
                if (tab.id === 'company') setPreviewSection('company');
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9.5px] px-1.5 py-0.5 rounded-md font-semibold ${
                    isActive
                      ? 'bg-emerald-500/25 text-emerald-300'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main CMS Editor Layout: Left Form + Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: EDIT FORM (7 COLS) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* TAB 1: HERO & BANNER */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>Headline & Konten Banner Hero</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">BAGIAN ATAS</span>
                </div>

                {/* Hero Badge */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Badge Overline Teks
                  </label>
                  <input
                    type="text"
                    value={settings.heroBadgeText}
                    onChange={(e) => handleChange('heroBadgeText', e.target.value)}
                    placeholder="Contoh: NUZULTRIP EQUITY · EKOSISTEM PERJALANAN MUSLIM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Headline */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Headline / Judul Utama
                  </label>
                  <textarea
                    rows={2}
                    value={settings.heroHeadline}
                    onChange={(e) => handleChange('heroHeadline', e.target.value)}
                    placeholder="Judul besar penawaran saham..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                {/* Subheadline */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Subheadline / Deskripsi Pengantar
                  </label>
                  <textarea
                    rows={3}
                    value={settings.heroSubheadline}
                    onChange={(e) => handleChange('heroSubheadline', e.target.value)}
                    placeholder="Deskripsi singkat yang meyakinkan calon pemodal..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Teks Tombol CTA Utama
                    </label>
                    <input
                      type="text"
                      value={settings.heroCtaPrimary}
                      onChange={(e) => handleChange('heroCtaPrimary', e.target.value)}
                      placeholder="Ajukan Minat Equity"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Teks Tombol CTA Sekunder
                    </label>
                    <input
                      type="text"
                      value={settings.heroCtaSecondary}
                      onChange={(e) => handleChange('heroCtaSecondary', e.target.value)}
                      placeholder="Unduh Pitchdeck 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Background & Presets */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <ImageIcon size={16} className="text-blue-500" />
                    <span>Gambar & Atmosfer Hero</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">VISUAL</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    URL Gambar Latar Belakang
                  </label>
                  <input
                    type="url"
                    value={settings.heroImageUrl}
                    onChange={(e) => handleChange('heroImageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none font-mono text-[11px]"
                  />
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-700 mb-2">
                    Pilih Gambar Preset Religius & Korporat:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => handleChange('heroImageUrl', img.url)}
                        className={`relative rounded-xl overflow-hidden border-2 text-left transition-all group cursor-pointer ${
                          settings.heroImageUrl === img.url
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.label}
                          className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="p-1.5 bg-white text-[10px] font-bold text-slate-800 truncate">
                          {img.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Running Ticker Banner */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Bell size={16} className="text-amber-500" />
                    <span>Running Ticker Banner (Pita Pengumuman Bergerak)</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={settings.showAnnouncement}
                      onChange={(e) => handleChange('showAnnouncement', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Tampilkan di Portal</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Teks Berita / Pengumuman Terkini
                  </label>
                  <textarea
                    rows={2}
                    value={settings.runningAnnouncement}
                    onChange={(e) => handleChange('runningAnnouncement', e.target.value)}
                    placeholder="Tuliskan berita terkini bagi hasil atau pencapaian kuota..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAHAM & METRICS */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <DollarSign size={16} className="text-emerald-600" />
                    <span>Parameter Kuota Saham & Finansial</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">FINANCIAL METRICS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Sisa Unit Tersedia (Untuk Publik)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={settings.totalUnits}
                        value={settings.availableUnits}
                        onChange={(e) => handleChange('availableUnits', Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">
                        / {settings.totalUnits} Unit
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      Tersisa {settings.availableUnits} unit saham dari total {settings.totalUnits} unit penawaran.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Harga Per Unit Saham (IDR)
                    </label>
                    <input
                      type="number"
                      step={1000000}
                      value={settings.pricePerUnit}
                      onChange={(e) => handleChange('pricePerUnit', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
                    />
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      Rp {settings.pricePerUnit.toLocaleString('id-ID')} / Unit
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Persentase Total Saham Ditawarkan (%)
                    </label>
                    <input
                      type="number"
                      value={settings.equityPercentage}
                      onChange={(e) => handleChange('equityPercentage', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
                    />
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      Porsi per unit: {(settings.equityPercentage / (settings.totalUnits || 1)).toFixed(2)}% kepemilikan
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Total Unit Saham Diterbitkan
                    </label>
                    <input
                      type="number"
                      value={settings.totalUnits}
                      onChange={(e) => handleChange('totalUnits', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Proyeksi Bagi Hasil Tahunan
                    </label>
                    <input
                      type="text"
                      value={settings.annualYieldProjection}
                      onChange={(e) => handleChange('annualYieldProjection', e.target.value)}
                      placeholder="Contoh: 19.2% / Tahun"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Valuasi Ekosistem Perseroan
                    </label>
                    <input
                      type="text"
                      value={settings.equityValuationText || 'Rp 12.500.000.000 (Valuasi Perseroan)'}
                      onChange={(e) => handleChange('equityValuationText', e.target.value)}
                      placeholder="Rp 12.500.000.000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sorotan Ekosistem Investasi Chips */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Sliders size={16} className="text-emerald-600" />
                    <span>Daftar Chip Sorotan Ekosistem (Hero Chips)</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">CHIP BADGES</span>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      placeholder="Tambah poin sorotan baru..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(settings.heroHighlights || []).map((chip, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800"
                      >
                        <span>{chip}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="w-4 h-4 rounded-full bg-slate-200 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-[10px] cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TENTANG KAMI */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Layers size={16} className="text-emerald-600" />
                    <span>Konten Bagian Tentang Kami & Visi Korporasi</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">ABOUT STORY</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Judul Bagian Tentang Kami
                  </label>
                  <input
                    type="text"
                    value={settings.aboutTitle || ''}
                    onChange={(e) => handleChange('aboutTitle', e.target.value)}
                    placeholder="Membangun Ekosistem Terpadu Ibadah & Halal Tourism"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Deskripsi Visi & Misi Perjalanan Ekosistem
                  </label>
                  <textarea
                    rows={4}
                    value={settings.aboutDescription || ''}
                    onChange={(e) => handleChange('aboutDescription', e.target.value)}
                    placeholder="Tuliskan cerita komprehensif visi pertumbuhan perusahaan..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Statistik Potensi Pasar
                    </label>
                    <input
                      type="text"
                      value={settings.aboutMarketStat || '70 JT+ Potensi Pasar Muslim Indonesia'}
                      onChange={(e) => handleChange('aboutMarketStat', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Statistik Pertumbuhan Jamaah
                    </label>
                    <input
                      type="text"
                      value={settings.aboutGrowthStat || '+17.1% Pertumbuhan Jamaah Umroh Tahunan'}
                      onChange={(e) => handleChange('aboutGrowthStat', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYANAN */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Briefcase size={16} className="text-blue-600" />
                    <span>Daftar 4 Lini Ekosistem Bisnis</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">LAYANAN UNGGULAN</span>
                </div>

                <div className="space-y-5">
                  {(settings.servicesList || []).map((service, idx) => (
                    <div
                      key={service.id || idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          Layanan #{idx + 1} ({service.code})
                        </span>
                        <span className="text-[10.5px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-bold">
                          Aktif di Portal
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Nama Layanan
                          </label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 font-bold focus:border-emerald-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Tagline Singkat
                          </label>
                          <input
                            type="text"
                            value={service.tagline}
                            onChange={(e) => handleServiceChange(idx, 'tagline', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:border-emerald-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Deskripsi Lengkap Layanan
                        </label>
                        <textarea
                          rows={2}
                          value={service.description}
                          onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:border-emerald-500 outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ALUR INVESTASI */}
          {activeTab === 'process' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <FileText size={16} className="text-emerald-600" />
                    <span>Alur & 4 Tahapan Kepemilikan Saham</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">STEP-BY-STEP</span>
                </div>

                <div className="space-y-4">
                  {(settings.processList || []).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          Tahap {step.number}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Judul Tahapan
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleProcessChange(idx, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 font-bold focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Penjelasan Prosedur
                        </label>
                        <textarea
                          rows={2}
                          value={step.description}
                          onChange={(e) => handleProcessChange(idx, 'description', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:border-emerald-500 outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: IDENTITAS & LEGALITAS */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Building size={16} className="text-slate-700" />
                    <span>Identitas Perusahaan, Izin PPIU & Legalitas</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">FOOTER & LEGAL</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nama Resmi Badan Hukum Perseroan
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nomor Izin PPIU Kemenag & SK Kemenkumham
                  </label>
                  <input
                    type="text"
                    value={settings.companyLicensePpiu || ''}
                    onChange={(e) => handleChange('companyLicensePpiu', e.target.value)}
                    placeholder="SK Kemenag RI PPIU No. 912/2021 & Kemenkumham AHU-0019284.AH.01.01"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Alamat Kantor Pusat / Representatif
                  </label>
                  <textarea
                    rows={2}
                    value={settings.companyAddress}
                    onChange={(e) => handleChange('companyAddress', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Hotline / WhatsApp Resmi
                    </label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => handleChange('contactPhone', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Email Investor Relations
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleChange('contactEmail', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Teks Hak Cipta & Disclaimer Footer
                  </label>
                  <input
                    type="text"
                    value={settings.footerCopyright || ''}
                    onChange={(e) => handleChange('footerCopyright', e.target.value)}
                    placeholder="© 2026 PT. Swarna Dipa Wisata. Seluruh hak cipta dilindungi undang-undang."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>Reset ke Pengaturan Awal</span>
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
            >
              <Save size={15} />
              <span>Simpan Perubahan Portal</span>
            </button>
          </div>
        </form>

        {/* RIGHT COLUMN: LIVE PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black tracking-wide uppercase text-slate-200">
                  Pratinjau Langsung (Live Preview)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreviewTab('desktop')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                    previewTab === 'desktop' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('mobile')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                    previewTab === 'mobile' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Section selector buttons for preview */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {[
                { id: 'hero', label: 'Hero' },
                { id: 'services', label: 'Layanan' },
                { id: 'process', label: 'Tahapan' },
                { id: 'company', label: 'Footer' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPreviewSection(s.id as any)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                    previewSection === s.id
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Simulating the Landing Page */}
            <div
              className={`rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner transition-all mx-auto ${
                previewTab === 'mobile' ? 'max-w-[320px]' : 'w-full'
              }`}
            >
              {/* Fake Browser Top Bar */}
              <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-[9.5px] font-mono text-slate-400 truncate">
                  https://nuzultrip.com/equity
                </span>
              </div>

              {/* Ticker in preview */}
              {settings.showAnnouncement && (
                <div className="bg-amber-400/95 text-slate-950 px-3 py-1 text-[9.5px] font-bold truncate">
                  ⚡ {settings.runningAnnouncement}
                </div>
              )}

              {/* Preview Content based on previewSection */}
              {previewSection === 'hero' && (
                <div className="relative p-4 sm:p-5 bg-gradient-to-b from-slate-950 via-[#0d151d] to-slate-950 min-h-[340px] flex flex-col justify-between">
                  {settings.heroImageUrl && (
                    <div
                      className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
                      style={{ backgroundImage: `url(${settings.heroImageUrl})` }}
                    />
                  )}

                  <div className="relative z-10 space-y-2.5">
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {settings.heroBadgeText}
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-white leading-snug line-clamp-3">
                      {settings.heroHeadline}
                    </h3>

                    <p className="text-[10.5px] text-slate-300 line-clamp-3 leading-relaxed">
                      {settings.heroSubheadline}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1.5">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px]"
                      >
                        {settings.heroCtaPrimary}
                      </button>
                      <button
                        type="button"
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white font-medium text-[10px] border border-white/20"
                      >
                        {settings.heroCtaSecondary}
                      </button>
                    </div>
                  </div>

                  {/* Highlights preview */}
                  <div className="relative z-10 mt-3 flex flex-wrap gap-1">
                    {(settings.heroHighlights || []).slice(0, 4).map((h, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full"
                      >
                        • {h}
                      </span>
                    ))}
                  </div>

                  {/* KPI strip inside preview */}
                  <div className="relative z-10 mt-3 grid grid-cols-3 gap-1.5 pt-2.5 border-t border-white/10 text-[9.5px]">
                    <div className="p-1.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-slate-400 text-[9px]">Sisa Kuota</div>
                      <div className="font-black text-white text-xs mt-0.5">
                        {settings.availableUnits} Unit
                      </div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-slate-400 text-[9px]">Harga / Unit</div>
                      <div className="font-black text-emerald-400 text-xs mt-0.5">
                        Rp {(settings.pricePerUnit / 1000000).toFixed(0)} Jt
                      </div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-slate-400 text-[9px]">Est. Yield</div>
                      <div className="font-black text-amber-400 text-xs mt-0.5">
                        {settings.annualYieldProjection}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewSection === 'services' && (
                <div className="p-4 bg-slate-950 space-y-2.5 text-slate-300 min-h-[320px]">
                  <div className="text-xs font-bold text-white mb-2">Katalog Layanan (Preview):</div>
                  {(settings.servicesList || []).map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-400">{s.title}</span>
                        <span className="text-[9px] text-slate-500 uppercase">{s.code}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">"{s.tagline}"</p>
                    </div>
                  ))}
                </div>
              )}

              {previewSection === 'process' && (
                <div className="p-4 bg-slate-950 space-y-2 text-slate-300 min-h-[320px]">
                  <div className="text-xs font-bold text-white mb-2">Tahapan Investasi (Preview):</div>
                  {(settings.processList || []).map((step, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {step.number}
                      </span>
                      <div>
                        <div className="text-[10.5px] font-bold text-white">{step.title}</div>
                        <div className="text-[9.5px] text-slate-400 line-clamp-2">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {previewSection === 'company' && (
                <div className="p-4 bg-black space-y-3 text-slate-300 min-h-[320px] text-[10.5px]">
                  <div className="text-sm font-black text-white">{settings.companyName}</div>
                  <div className="text-slate-400 leading-relaxed text-[10px]">{settings.companyAddress}</div>
                  {settings.companyLicensePpiu && (
                    <div className="text-emerald-400 text-[9.5px] font-mono">{settings.companyLicensePpiu}</div>
                  )}
                  <div className="pt-2 border-t border-slate-800 text-[9.5px] text-slate-400 space-y-1">
                    <div>WA: {settings.contactPhone}</div>
                    <div>Email: {settings.contactEmail}</div>
                    <div className="text-slate-600 mt-2">{settings.footerCopyright}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Status Server: Realtime Sync 🟢</span>
              <button
                type="button"
                onClick={onOpenPublicPortal}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Buka Landing Page</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
