import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { HeroScrollAtmosphere } from '../hero/HeroScrollAtmosphere';

interface HeroSectionProps {
  onOpenInterest: () => void;
  onOpenPitchdeck?: () => void;
}

const HIGHLIGHT_BADGES = [
  '40% Alokasi Equity',
  '50 Unit Terbatas',
  'Rp 100 Juta / Unit',
  'Dividen Berkala',
  'Jaringan 4 Negara',
  '1000+ Jamaah Tahunan',
  'Izin PPIU Resmi',
  'Kontrak Hotel Langsung Makkah-Madinah',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenInterest,
  onOpenPitchdeck,
}) => {
  const [isEntranceVisible, setIsEntranceVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Staggered entrance animation trigger on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntranceVisible(true);
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // Highly performant scroll listener with requestAnimationFrame
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

  // Smooth layered parallax offsets on scroll
  const parallaxHeading = {
    transform: `translate3d(0, ${scrollY * 0.16}px, 0)`,
    opacity: Math.max(0, 1 - scrollY / 680),
    transition: 'transform 0.05s linear',
  };

  const parallaxSubtitle = {
    transform: `translate3d(0, ${scrollY * 0.22}px, 0)`,
    opacity: Math.max(0, 1 - scrollY / 560),
    transition: 'transform 0.05s linear',
  };

  const parallaxButtons = {
    transform: `translate3d(0, ${scrollY * 0.26}px, 0)`,
    opacity: Math.max(0, 1 - scrollY / 490),
    transition: 'transform 0.05s linear',
  };

  const parallaxPartners = {
    transform: `translate3d(0, ${scrollY * 0.12}px, 0)`,
    transition: 'transform 0.05s linear',
  };

  return (
    <section id="hero" className="hero relative overflow-hidden bg-[#08090f]">
      {/* Dynamic Scroll-Reactive Atmosphere (Canvas Constellation + Orbital Dual Arcs + Perspective Horizon) */}
      <HeroScrollAtmosphere scrollY={scrollY} />

      {/* Hero Content Container with Multi-Layer Parallax */}
      <div className="hero-content relative z-[2]">
        <div className="hero-spacer" />

        {/* Overline */}
        <span
          className={`${entranceClass} stagger-1 hero-overline text-emerald-400 will-change-transform`}
          style={parallaxHeading}
        >
          NUZULTRIP EQUITY • EKOSISTEM PERJALANAN MUSLIM
        </span>

        {/* Display Heading */}
        <h1
          className={`${entranceClass} stagger-2 hero-heading will-change-transform`}
          style={parallaxHeading}
        >
          Berkembang Dalam Ekosistem Muslim{' '}
          <span
            style={{
              color: '#34d399',
              textShadow: '0 0 35px rgba(16, 185, 129, 0.45)',
            }}
          >
            Yang Terintegrasi
          </span>
        </h1>

        {/* Subtitle - Terkalibrasi tepat 2 baris */}
        <p
          className={`${entranceClass} stagger-3 hero-subtitle will-change-transform`}
          style={parallaxSubtitle}
        >
          Nuzultrip membangun ekosistem perjalanan Muslim melalui integrasi layanan,
          jaringan, dan teknologi untuk pertumbuhan investasi jangka panjang.
        </p>

        {/* Primary & Secondary CTA Buttons */}
        <div
          className={`${entranceClass} stagger-4 hero-buttons will-change-transform`}
          style={parallaxButtons}
        >
          {/* Primary CTA */}
          <button
            id="hero-cta-primary"
            onClick={onOpenInterest}
            className="group relative px-8 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base text-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-lg flex items-center justify-center gap-2.5 cursor-pointer overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              boxShadow:
                '0 4px 20px rgba(16, 185, 129, 0.45), 0 10px 40px rgba(16, 185, 129, 0.25)',
            }}
          >
            <span className="relative z-10">Ajukan Minat Equity</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
              }}
            />
          </button>

          {/* Secondary CTA */}
          <button
            id="hero-cta-pitchdeck"
            onClick={onOpenPitchdeck || onOpenInterest}
            className="px-7 py-3.5 sm:py-4 rounded-full font-medium text-sm sm:text-base text-[#f0f0f5] bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.14] hover:border-white/[0.25] backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Unduh Pitchdeck 2025</span>
          </button>
        </div>

        {/* Partners Marquee at Bottom */}
        <div
          className={`${entranceClass} stagger-5 hero-partners will-change-transform`}
          style={parallaxPartners}
        >
          <div className="hero-partners-label-row">
            <span className="hero-partners-label-line" aria-hidden="true" />
            <span className="hero-partners-label text-emerald-400">
              SOROTAN EKOSISTEM NUZULTRIP
            </span>
            <span className="hero-partners-label-line" aria-hidden="true" />
          </div>

          <div className="hero-partners-track">
            <div className="animate-marquee-slow flex items-center gap-2">
              {[...HIGHLIGHT_BADGES, ...HIGHLIGHT_BADGES].map((badge, idx) => (
                <div key={idx} className="hero-chip">
                  <span
                    className="hero-chip-dot"
                    style={{
                      background: '#10b981',
                      boxShadow:
                        '0 0 5px rgba(16, 185, 129, 0.8), 0 0 10px rgba(16, 185, 129, 0.35)',
                    }}
                  />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sleek Minimalist Scroll Cue Indicator */}
        <div
          className="flex flex-col items-center gap-1.5 pt-4 transition-opacity duration-300 pointer-events-none select-none"
          style={{
            opacity: Math.max(0, 1 - scrollY / 90),
          }}
          aria-hidden="true"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/40">
            Scroll Eksplorasi
          </span>
          <ChevronDown size={14} className="text-emerald-400/80 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
