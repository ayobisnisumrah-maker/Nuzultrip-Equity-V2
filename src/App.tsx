import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { EquitySection } from './components/sections/EquitySection';
import { CompanySection } from './components/sections/CompanySection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { RoadmapSection } from './components/sections/RoadmapSection';
import { NetworkSection } from './components/sections/NetworkSection';
import { InvestorInformationSection } from './components/sections/InvestorInformationSection';
import { QuickActionSection } from './components/sections/QuickActionSection';
import { ArticlesSection } from './components/sections/ArticlesSection';

// Modals
import { EquityInterestModal } from './components/modals/EquityInterestModal';
import { PitchdeckModal } from './components/modals/PitchdeckModal';
import { LoginModal } from './components/modals/LoginModal';
import { DetailInfoModal } from './components/modals/DetailInfoModal';
import { InvestorDashboard } from './components/dashboard/InvestorDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { ServiceItem, InvestorInfoItem, ArticleItem } from './data/landingData';
import { resolveSessionAccess, secureLogout, type SessionAccess } from './services/sessionAccessService';
import { supabase } from './lib/supabase';

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    const forceTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    forceTop();
    requestAnimationFrame(forceTop);
    const t1 = window.setTimeout(forceTop, 50);
    const t2 = window.setTimeout(forceTop, 250);
    const onLoad = () => forceTop();
    window.addEventListener('load', onLoad, { once: true });
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'super_admin'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [access, setAccess] = useState<SessionAccess>({authenticated:false,isAdmin:false,isInvestor:false,investorStatus:null});
  const [accessReady, setAccessReady] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState<number>(1);
  const [isPitchdeckModalOpen, setIsPitchdeckModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenInterest = (units: number = 1) => {
    setSelectedUnits(units);
    setIsInterestModalOpen(true);
  };
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    title: string;
    category?: string;
    content: string;
    detailsList?: string[];
  }>({
    isOpen: false,
    title: '',
    category: '',
    content: '',
    detailsList: [],
  });

  useEffect(() => {
    let active=true;
    const sync=async()=>{const next=await resolveSessionAccess();if(!active)return;setAccess(next);setIsLoggedIn(next.authenticated);setAccessReady(true);setCurrentView((view)=>view==='super_admin'&&!next.isAdmin?'landing':view==='dashboard'&&!next.isInvestor?'landing':view)};
    void sync();
    const sub=supabase?.auth.onAuthStateChange(()=>{void sync()}).data.subscription;
    return()=>{active=false;sub?.unsubscribe()};
  }, []);

  const openAdmin=async()=>{const next=await resolveSessionAccess();setAccess(next);if(next.isAdmin)setCurrentView('super_admin');else setIsLoginModalOpen(true)};
  const openInvestor=async()=>{const next=await resolveSessionAccess();setAccess(next);if(next.isInvestor)setCurrentView('dashboard');else setIsLoginModalOpen(true)};
  const logout=async()=>{await secureLogout();setAccess({authenticated:false,isAdmin:false,isInvestor:false,investorStatus:null});setIsLoggedIn(false);setCurrentView('landing')};

  // Handle global Escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsInterestModalOpen(false);
        setIsPitchdeckModalOpen(false);
        setIsLoginModalOpen(false);
        setDetailModal((prev) => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for detailed info
  const handleOpenEquityDetail = () => {
    setDetailModal({
      isOpen: true,
      title: 'Detail Penawaran Equity Nuzultrip',
      category: 'Informasi Penawaran Resmi',
      content:
        'Penawaran Nuzultrip Equity memberikan kesempatan kepada investor dan mitra strategis untuk memiliki bagian dari ekosistem perjalanan ibadah yang telah beroperasi dengan rekam jejak terbukti. Struktur investasi dirancang secara proporsional, transparan, dan patuh terhadap regulasi perseroan terbatas di Indonesia.',
      detailsList: [
        'Total Alokasi Equity: 40% kepemilikan saham dari total valuasi perusahaan',
        'Jumlah Unit Terbatas: Tersedia 50 Unit kepemilikan (0,8% kepemilikan per unit)',
        'Harga Penawaran: Rp 100.000.000 (Seratus Juta Rupiah) per unit',
        'Distribusi Bagi Hasil: Pelaporan dan pembagian hasil operasional berkala',
        'Hak Pemegang Unit: Akses portal investor, laporan keuangan teraudit, dan hak suara proporsional',
      ],
    });
  };

  const handleOpenCompanyDetail = () => {
    setDetailModal({
      isOpen: true,
      title: 'Struktur dan Visi Perusahaan Nuzultrip',
      category: 'Profil Korporasi',
      content:
        'Nuzultrip adalah ekosistem perjalanan Muslim yang mengintegrasikan layanan haji, umroh, land arrangement, serta halal tourism. Didirikan oleh para praktisi berpengalaman lebih dari 10 tahun di industri travel ibadah, Nuzultrip memadukan keramahan layanan berbasis syariah dengan inovasi otomasi teknologi.',
      detailsList: [
        'Jaringan mitra terverifikasi di 4 negara utama (Arab Saudi, Turki, UAE, Indonesia)',
        'Kapasitas handling jamaah dengan kepuasan pelanggan di atas 98%',
        'Infrastruktur kontrak langsung dengan hotel bintang dan muassasah resmi di Makkah & Madinah',
        'Sistem digitalisasi pemesanan terpusat untuk efisiensi rantai pasok travel ibadah',
      ],
    });
  };

  const handleOpenProcessDetail = () => {
    setDetailModal({
      isOpen: true,
      title: 'Prosedur dan Alur Kepemilikan Equity',
      category: 'Tata Kelola & Kepatuhan',
      content:
        'Setiap calon investor melewati empat tahapan formal untuk memastikan transparansi, keabsahan hukum, dan keselarasan visi pertumbuhan jangka panjang bersama Nuzultrip.',
      detailsList: [
        'Tahap 1 (Pendaftaran): Pengisian formulir minat dan data identitas calon investor',
        'Tahap 2 (Verifikasi): Due diligence dan konfirmasi alokasi unit oleh komite investasi',
        'Tahap 3 (Perjanjian): Penandatanganan perjanjian pemegang saham dan setoran modal resmi',
        'Tahap 4 (Onboarding Portal): Penyerahan sertifikat kepemilikan dan aktivasi akun portal investor',
      ],
    });
  };

  const handleOpenNetworkDetail = () => {
    setDetailModal({
      isOpen: true,
      title: 'Jaringan Kemitraan Ekosistem Nuzultrip',
      category: 'Sinergi & Kemitraan',
      content:
        'Nuzultrip membangun kemitraan mutualistis bersama agen lokal, travel umroh berizin, dan vendor internasional demi menciptakan efisiensi harga tiket, ketersediaan kamar hotel di musim puncak, dan perlindungan jamaah.',
      detailsList: [
        'Dukungan sistem inventori tiket penerbangan grup dengan harga kompetitif',
        'Layanan Land Arrangement (LA) terstandar dengan tim muthowif tersertifikasi',
        'Pelatihan bisnis dan tools digital bagi agen perwakilan daerah',
        'Akses prioritas pada program-program promosi dan paket custom korporasi',
      ],
    });
  };

  const handleOpenServiceDetail = (service: ServiceItem) => {
    setDetailModal({
      isOpen: true,
      title: `Layanan: ${service.title}`,
      category: `Ekosistem Layanan • ${service.code}`,
      content: `${service.description} Nuzultrip menjamin standar kenyamanan optimal, kepastian jadwal penerbangan, serta bimbingan ibadah yang sesuai sunnah.`,
      detailsList: [
        'Standar hotel berbintang dengan akses dekat ke Masjidil Haram dan Masjid Nabawi',
        'Transportasi bus full-AC model terbaru dan muthowif berpengalaman',
        'Konsumsi masakan nusantara dengan menu higienis dan terstandar',
        'Handling kedatangan dan kepulangan bandara dengan staf profesional',
      ],
    });
  };

  const handleOpenInvestorInfo = (item: InvestorInfoItem) => {
    setDetailModal({
      isOpen: true,
      title: item.title,
      category: 'Informasi Investor Terstruktur',
      content: item.details,
      detailsList: [
        'Pembaruan berkala melalui portal investor online',
        'Transparansi pembukuan keuangan sesuai prinsip akuntansi yang berlaku',
        'Akses konsultasi langsung dengan tim manajemen dan Investor Relations',
      ],
    });
  };

  const handleOpenArticle = (article: ArticleItem) => {
    setDetailModal({
      isOpen: true,
      title: article.title,
      category: article.category,
      content: `${article.description}\n\nDi era modernisasi ekosistem haji dan umroh pasca-Visi Saudi 2030, transformasi digital menjadi kunci peningkatan efisiensi operasional. Dengan memadukan kontrak langsung, automasi reservasi hotel, dan transparansi bagi hasil, Nuzultrip membuktikan bahwa bisnis perjalanan ibadah dapat tumbuh berkelanjutan sekaligus memberikan nilai investasi yang solid bagi para pemegang sahamnya.`,
      detailsList: [
        `Waktu Baca: ${article.readTime}`,
        `Tanggal Publikasi: ${article.date}`,
        'Penulis: Tim Riset & Analisis Pasar Nuzultrip Equity',
      ],
    });
  };

  const handleOpenFooterDetail = (title?: string) => {
    setDetailModal({
      isOpen: true,
      title: title || 'Informasi Korporasi',
      category: 'Legal & Kepatuhan',
      content: `Informasi resmi terkait ${title || 'Nuzultrip Equity'}. Seluruh kegiatan operasional dan penawaran investasi dijalankan sesuai peraturan perundang-undangan Republik Indonesia dan prinsip syariah yang berkeadilan. Untuk dokumen legalitas lengkap, Anda dapat menghubungi tim Investor Relations kami.`,
      detailsList: [
        'SK Kemenkumham dan Akta Pendirian Perseroan Terdaftar',
        'Izin Penyelenggara Perjalanan Ibadah Umrah (PPIU) Resmi',
        'Kebijakan privasi data berstandar perlindungan data pribadi (PDP)',
      ],
    });
  };

  useEffect(() => {
    if (!accessReady || currentView !== 'landing') return;
    const forceTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    forceTop();
    requestAnimationFrame(forceTop);
    const timer = window.setTimeout(forceTop, 100);
    return () => window.clearTimeout(timer);
  }, [accessReady, currentView]);

  if (!accessReady) return <div className="min-h-screen bg-[#F5F5F3]" />;

  if (currentView === 'super_admin' && access.isAdmin) {
    return (
      <SuperAdminDashboard
        onBackToHome={() => setCurrentView('landing')}
        onOpenInvestorPortal={() => void openInvestor()}
        onLogout={() => void logout()}
      />
    );
  }

  if (currentView === 'dashboard' && access.isInvestor) {
    return (
      <InvestorDashboard
        onBackToHome={() => setCurrentView('landing')}
        onLogout={() => void logout()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col selection:bg-[#090909] selection:text-white">
      {/* Sticky Header */}
      <Header
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenInterest={() => handleOpenInterest(1)}
        isLoggedIn={isLoggedIn}
        onOpenDashboard={() => void openInvestor()}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 01. Hero Section */}
        <HeroSection
          onOpenInterest={() => handleOpenInterest(1)}
          onOpenPitchdeck={() => setIsPitchdeckModalOpen(true)}
        />

        {/* 02. Tentang Kami / Statistics Section */}
        <AboutSection />

        {/* 03. Peluang Equity Section */}
        <EquitySection
          onOpenInterest={(units) => handleOpenInterest(units || 1)}
          onOpenDetail={handleOpenEquityDetail}
        />

        {/* 04. Perusahaan Section */}
        <CompanySection onOpenDetail={handleOpenCompanyDetail} />

        {/* 05. Layanan Utama Section */}
        <ServicesSection onOpenServiceDetail={handleOpenServiceDetail} />

        {/* 06. Proses Section (Dark) */}
        <ProcessSection
          onOpenDetail={handleOpenProcessDetail}
          onOpenInterest={() => handleOpenInterest(1)}
        />

        {/* 07. Roadmap Section */}
        <RoadmapSection />

        {/* 08. Jaringan & Mitra Section */}
        <NetworkSection onOpenDetail={handleOpenNetworkDetail} />

        {/* 09. Informasi Investor Section */}
        <InvestorInformationSection onSelectItem={handleOpenInvestorInfo} />

        {/* 10. Quick Action Section (Dark) */}
        <QuickActionSection
          onOpenInterest={() => handleOpenInterest(1)}
          onOpenPitchdeck={() => setIsPitchdeckModalOpen(true)}
        />

        {/* 11. Artikel & Berita Section */}
        <ArticlesSection onSelectArticle={handleOpenArticle} />
      </main>

      {/* 12. Footer (Dark) */}
      <Footer
        onOpenInterest={() => handleOpenInterest(1)}
        onOpenPitchdeck={() => setIsPitchdeckModalOpen(true)}
        onOpenDetail={handleOpenFooterDetail}
      />

      {/* Interactive Modals */}
      <EquityInterestModal
        isOpen={isInterestModalOpen}
        onClose={() => setIsInterestModalOpen(false)}
        initialUnits={selectedUnits}
      />

      <PitchdeckModal
        isOpen={isPitchdeckModalOpen}
        onClose={() => setIsPitchdeckModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenInterest={() => setIsInterestModalOpen(true)}
        onSuccessLogin={() => {
          void openInvestor();
        }}
        onSuccessAdminLogin={() => {
          void openAdmin();
        }}
      />

      <DetailInfoModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal((prev) => ({ ...prev, isOpen: false }))}
        title={detailModal.title}
        category={detailModal.category}
        content={detailModal.content}
        detailsList={detailModal.detailsList}
        onOpenInterest={() => setIsInterestModalOpen(true)}
      />
    </div>
  );
}
