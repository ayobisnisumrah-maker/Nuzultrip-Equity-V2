import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, ChevronDown, Bell } from 'lucide-react';
import { HeroScrollAtmosphere } from '../hero/HeroScrollAtmosphere';
import { realtimeStore, PortalSettings } from '../../services/realtimeStore';
import { loadPublicHome } from '../../services/publicPortalService';
import { supabase } from '../../lib/supabase';

interface HeroSectionProps {
  onOpenInterest: () => void;
  onOpenPitchdeck?: () => void;
}

const DEFAULT_HIGHLIGHT_ITEMS = [
  '40% Alokasi Equity',
  '50 Unit Terbatas',
  'Rp 100 Juta / Unit',
  'Bagi Hasil Berkala',
  'Jaringan 4 Negara',
  '1.000+ Jamaah Tahunan',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenInterest,
  onOpenPitchdeck,
}) => {
  const [isEntranceVisible, setIsEntranceVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [settings, setSettings] = useState<PortalSettings>(() =>
    realtimeStore.getPortalSettings()
  );
  const [cmsHome, setCmsHome] = useState<any>(null);

  useEffect(() => {
    let active=true;
    const sync=async()=>{try{const sections=await loadPublicHome();if(active)setCmsHome(sections.find((s)=>s.anchorId==='beranda')?.content||null)}catch{}};
    void sync();
    const channel=supabase?.channel('public-hero-cms').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void sync()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void sync()).subscribe();
    return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)};
  }, []);

  useEffect(() => {
    const update = () => {
      setSettings(realtimeStore.getPortalSettings());
    };
    const unsub = realtimeStore.subscribe(update);
    return () => unsub();
  }, []);

  // Staggered entrance trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntranceVisible(true);
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const entranceClass = isEntranceVisible ? 'entrance visible' : 'entrance';

  // Smooth parallax offsets
  const parallaxHeading = {
    transform: `translate3d(0, ${scrollY * 0.14}px, 0)`,
    opacity: Math.max(0, 1 - scrollY / 650),
    transition: 'transform 0.05s linear',
  };

  const parallaxSubtitle = {
    transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
    opacity: Math.max(0, 1 - scrollY / 550),
    transition: 'transform 0.05s linear',
  };

  const parallaxButtons = {
    transform: `translate3d(0, ${scrollY * 0.06}px, 0)`,
    opacity: Math.max(0, 1 - scrollY / 480),
    transition: 'transform 0.05s linear',
  };

  const parallaxMetrics = {
    transform: `translate3d(0, ${scrollY * 0.03}px, 0)`,
    opacity: Math.max(0, 1 - scrollY / 420),
    transition: 'transform 0.05s linear',
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-center items-center overflow-hidden bg-[#111822] text-white pt-24 pb-10 px-4 sm:px-6 lg:px-8"
    >
      {cmsHome?.hero_image_url && <><img src={cmsHome.hero_image_url} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-center" /><div className="absolute inset-0 bg-[#111822]/70" /></>}
      {/* Dynamic Scroll Atmosphere Directly Behind the Headline Text */}
      <HeroScrollAtmosphere scrollY={scrollY} />

      {/* Running Announcement Ticker if enabled */}
      {(cmsHome?.show_announcement ?? settings.showAnnouncement) && (cmsHome?.announcement || settings.runningAnnouncement) && (
        <div className="absolute top-20 left-0 right-0 z-20 bg-emerald-900/85 border-y border-emerald-500/30 backdrop-blur-md px-4 py-2 text-center overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-200 font-medium animate-pulse">
            <Bell size={13} className="text-emerald-400 shrink-0" />
            <span className="truncate max-w-3xl">{cmsHome?.announcement || settings.runningAnnouncement}</span>
          </div>
        </div>
      )}

      {/* Main Content Area (Rendered in front of the animation) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center my-auto space-y-5 sm:space-y-6">
        {/* Overline Badge */}
        <div
          className={`${entranceClass} stagger-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] sm:text-[12px] font-bold tracking-[0.16em] uppercase shadow-xs will-change-transform`}
          style={parallaxHeading}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>{cmsHome?.badge_text || settings.heroBadgeText || 'NUZULTRIP EQUITY · EKOSISTEM PERJALANAN MUSLIM'}</span>
        </div>

        {/* Display Heading */}
        <h1
          className={`${entranceClass} stagger-2 text-[32px] sm:text-[46px] lg:text-[58px] font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl text-balance will-change-transform`}
          style={parallaxHeading}
        >
          {cmsHome?.headline || settings.heroHeadline || 'Berkembang Dalam Ekosistem Muslim Yang Terintegrasi'}
        </h1>

        {/* Subtitle */}
        <p
          className={`${entranceClass} stagger-3 text-[14.5px] sm:text-[16.5px] text-slate-300 max-w-2xl leading-relaxed text-balance will-change-transform`}
          style={parallaxSubtitle}
        >
          {cmsHome?.subheadline || settings.heroSubheadline ||
            'Nuzultrip membangun ekosistem perjalanan Muslim melalui integrasi layanan, jaringan, dan teknologi untuk pertumbuhan investasi jangka panjang.'}
        </p>

        {/* CTA Actions */}
        <div
          className={`${entranceClass} stagger-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto pt-1 will-change-transform`}
          style={parallaxButtons}
        >
          {/* Primary CTA */}
          <button
            id="hero-cta-primary"
            type="button"
            onClick={onOpenInterest}
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-[#0d151d] bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 active:scale-98 transition-all duration-200 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>{cmsHome?.cta_primary || settings.heroCtaPrimary || 'Ajukan Minat Equity'}</span>
            <ArrowRight size={17} />
          </button>

          {/* Secondary CTA */}
          <button
            id="hero-cta-pitchdeck"
            type="button"
            onClick={onOpenPitchdeck || onOpenInterest}
            className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base text-slate-100 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 active:scale-98 transition-all duration-200 backdrop-blur-md shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Download size={16} className="text-emerald-400" />
            <span>{cmsHome?.cta_secondary || settings.heroCtaSecondary || 'Unduh Pitchdeck'}</span>
          </button>
        </div>

        {/* Sorotan Ekosistem Investasi: Dibuat Kecil & Rapi Seperti di Awal (Fully Responsive) */}
        <div
          className={`${entranceClass} stagger-5 w-full max-w-4xl pt-4 sm:pt-5 mt-3 sm:mt-4 will-change-transform flex flex-col items-center`}
          style={parallaxMetrics}
        >
          {/* Label with Subtle Hairline Dividers */}
          <div className="flex items-center justify-center gap-3 w-full max-w-md mb-2.5">
            <span className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent flex-1" />
            <span className="text-[10px] sm:text-[10.5px] font-bold text-emerald-400 uppercase tracking-[0.18em]">
              {cmsHome?.highlights_label || 'Sorotan Ekosistem Investasi'}
            </span>
            <span className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent flex-1" />
          </div>

          {/* Compact Chips - Responsive & Compact like at the beginning */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl">
            {(Array.isArray(cmsHome?.highlights) && cmsHome.highlights.length ? cmsHome.highlights : settings.heroHighlights && settings.heroHighlights.length ? settings.heroHighlights : DEFAULT_HIGHLIGHT_ITEMS).map((item:string, idx:number) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white text-[11px] sm:text-[12px] font-medium transition-all shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subtle Minimalist Scroll Cue */}
        <div
          className="flex flex-col items-center gap-1 pt-1 pointer-events-none select-none transition-opacity duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollY / 90),
          }}
          aria-hidden="true"
        >
          <span className="text-[9.5px] tracking-[0.2em] uppercase font-bold text-slate-400">
            {cmsHome?.scroll_label || 'Scroll Eksplorasi'}
          </span>
          <ChevronDown size={13} className="text-emerald-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
