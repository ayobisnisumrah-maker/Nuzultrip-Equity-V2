import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { HeroScrollAtmosphere } from '../hero/HeroScrollAtmosphere';

interface HeroSectionProps {
  onOpenInterest: () => void;
  onOpenPitchdeck?: () => void;
}

const HIGHLIGHT_METRICS = [
  { value: '40%', label: 'Alokasi Equity' },
  { value: '50 Unit', label: 'Ketersediaan' },
  { value: 'Rp 100 Jt', label: 'Nilai per Unit' },
  { value: 'Bulanan', label: 'Bagi Hasil' },
  { value: '4 Negara', label: 'Jaringan Mitra' },
  { value: '1.000+', label: 'Jamaah / Tahun' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenInterest,
  onOpenPitchdeck,
}) => {
  const [isEntranceVisible, setIsEntranceVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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
      className="relative min-h-[100dvh] flex flex-col justify-center items-center overflow-hidden bg-[#FAFBF9] text-[#0f172a] pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Light Luxury Scroll Atmosphere Animation: Constellation + Orbital Arcs + Subtle Grid */}
      <HeroScrollAtmosphere scrollY={scrollY} />

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center my-auto space-y-6 sm:space-y-7">
        {/* Overline Badge */}
        <div
          className={`${entranceClass} stagger-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-[11px] sm:text-[12px] font-bold tracking-[0.16em] uppercase shadow-xs will-change-transform`}
          style={parallaxHeading}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span>NUZULTRIP EQUITY · EKOSISTEM PERJALANAN MUSLIM</span>
        </div>

        {/* Display Heading */}
        <h1
          className={`${entranceClass} stagger-2 text-[32px] sm:text-[48px] lg:text-[62px] font-extrabold text-[#0f172a] tracking-tight leading-[1.08] max-w-4xl text-balance will-change-transform`}
          style={parallaxHeading}
        >
          Berkembang Dalam Ekosistem Muslim{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
            Yang Terintegrasi
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`${entranceClass} stagger-3 text-[15px] sm:text-[17px] text-[#475569] max-w-2xl leading-relaxed text-balance will-change-transform`}
          style={parallaxSubtitle}
        >
          Nuzultrip membangun ekosistem perjalanan Muslim melalui integrasi layanan,
          jaringan, dan teknologi untuk pertumbuhan investasi jangka panjang.
        </p>

        {/* CTA Actions */}
        <div
          className={`${entranceClass} stagger-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto pt-2 will-change-transform`}
          style={parallaxButtons}
        >
          {/* Primary CTA */}
          <button
            id="hero-cta-primary"
            type="button"
            onClick={onOpenInterest}
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-98 transition-all duration-200 shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Ajukan Minat Equity</span>
            <ArrowRight size={17} />
          </button>

          {/* Secondary CTA */}
          <button
            id="hero-cta-pitchdeck"
            type="button"
            onClick={onOpenPitchdeck || onOpenInterest}
            className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base text-[#1e293b] bg-white/90 hover:bg-white border border-slate-200/90 hover:border-slate-300 active:scale-98 transition-all duration-200 shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Download size={16} className="text-emerald-600" />
            <span>Unduh Pitchdeck 2025</span>
          </button>
        </div>

        {/* Key Highlights: Clean Responsive Metric Cards (Light Luxury Theme) */}
        <div
          className={`${entranceClass} stagger-5 w-full max-w-4xl pt-6 sm:pt-8 border-t border-black/[0.08] mt-4 sm:mt-6 will-change-transform`}
          style={parallaxMetrics}
        >
          <div className="text-[10.5px] sm:text-[11.5px] font-bold text-emerald-800 uppercase tracking-[0.18em] mb-3.5 text-center">
            Sorotan Ekosistem Investasi
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
            {HIGHLIGHT_METRICS.map((item, idx) => (
              <div
                key={idx}
                className="py-3 px-2 sm:px-3 rounded-xl bg-white/80 backdrop-blur-xs border border-black/[0.08] hover:border-emerald-500/40 hover:shadow-xs transition-all flex flex-col items-center justify-center text-center"
              >
                <span className="text-[17px] sm:text-[19px] font-extrabold text-[#0f172a] tracking-tight leading-none mb-1">
                  {item.value}
                </span>
                <span className="text-[11px] text-[#64748b] font-medium leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subtle Minimalist Scroll Cue */}
        <div
          className="flex flex-col items-center gap-1 pt-2 pointer-events-none select-none transition-opacity duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollY / 90),
          }}
          aria-hidden="true"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400">
            Scroll Eksplorasi
          </span>
          <ChevronDown size={14} className="text-emerald-600 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
