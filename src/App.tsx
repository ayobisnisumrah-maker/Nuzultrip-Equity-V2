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
import { loadPublicHome } from './services/publicPortalService';

export default function App() {
  useEffect(() => {
    let active=true;
    const syncBrand=async()=>{try{const sections=await loadPublicHome();const home=sections.find((s)=>s.anchorId==='beranda');if(!active)return;const favicon=String(home?.content?.favicon_url||'');if(favicon){let link=document.querySelector<HTMLLinkElement>("link[rel~='icon']");if(!link){link=document.createElement('link');link.rel='icon';document.head.appendChild(link)}link.href=favicon}}catch{}};
    void syncBrand();
    const channel=supabase?.channel('public-browser-brand').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void syncBrand()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void syncBrand()).subscribe();
    return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)};
  }, []);

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
  const [publicSections,setPublicSections]=useState<any[]>([]);
  useEffect(()=>{let active=true;const sync=async()=>{try{const sections=await loadPublicHome();if(active)setPublicSections(sections)}catch{}};void sync();const channel=supabase?.channel('public-app-cms').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void sync()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void sync()).subscribe();return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)}},[]);
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

  // Detail modal content is supplied by published CMS payloads/items, never invented in App.
  const openCmsDetail=(fallbackTitle:string,payload:any)=>{
    const detail=payload?.detail||payload?.modal||payload||{};
    setDetailModal({isOpen:true,title:String(detail.title||fallbackTitle||''),category:String(detail.category||''),content:String(detail.content||detail.description||(typeof detail.details==='string'?detail.details:'')||''),detailsList:Array.isArray(detail.detailsList)?detail.detailsList:Array.isArray(detail.details)?detail.details:[]});
  };
  const handleOpenEquityDetail=()=>openCmsDetail('Detail Penawaran Equity',publicSections.find(s=>s.anchorId==='ringkasan')?.content);
  const handleOpenCompanyDetail=()=>openCmsDetail('Detail Perusahaan',publicSections.find(s=>s.anchorId==='bisnis')?.content);
  const handleOpenProcessDetail=()=>openCmsDetail('Detail Proses',publicSections.find(s=>s.anchorId==='governance')?.content);
  const handleOpenNetworkDetail=()=>openCmsDetail('Detail Jaringan',publicSections.find(s=>s.anchorId==='logo-jaringan')?.content);
  const handleOpenServiceDetail=(service:ServiceItem)=>openCmsDetail(service.title,service);
  const handleOpenInvestorInfo=(item:InvestorInfoItem)=>openCmsDetail(item.title,item);
  const handleOpenArticle=(article:ArticleItem)=>openCmsDetail(article.title,article);
  const handleOpenFooterDetail=(title?:string)=>{
    const home=publicSections.find(s=>s.anchorId==='beranda')?.content;
    const entries=Array.isArray(home?.footer_details)?home.footer_details:[];
    const found=entries.find((x:any)=>x?.title===title);
    openCmsDetail(title||'',found||{title:title||'',content:''});
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
