import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Container } from '../layout/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { loadPublicHome } from '../../services/publicPortalService';
import { supabase } from '../../lib/supabase';

interface RoadmapPhase {
  step: string;
  phaseNumber: number;
  period: string;
  title: string;
  status: 'completed' | 'active' | 'upcoming';
  statusLabel: string;
  summary: string;
  highlights: string[];
  kpi?: { label: string; value: string };
}

export const RoadmapSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cms, setCms] = useState<any>(null);
  const phases: RoadmapPhase[] = Array.isArray(cms?.phases) ? cms.phases : [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{let active=true;const sync=async()=>{try{const sections=await loadPublicHome();if(active)setCms(sections.find((s)=>s.anchorId==='perkembangan')?.content||null)}catch{}};void sync();const channel=supabase?.channel('public-roadmap-cms').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void sync()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void sync()).subscribe();return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)}},[]);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const targetCard = scrollRef.current.children[index] as HTMLElement;
    if (targetCard) {
      const container = scrollRef.current;
      const targetLeft =
        targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const target=Math.max(0,phases.findIndex(p=>p.status==='active'));
    const timer = setTimeout(() => {
      if(phases.length)scrollToIndex(target);
    }, 250);
    return () => clearTimeout(timer);
  }, [phases.length]);

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollToIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(phases.length - 1, activeIndex + 1);
    scrollToIndex(nextIdx);
  };

  // Sync active index when user scrolls on touch or trackpad
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDiff = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const el = child as HTMLElement;
      const childCenter = el.offsetLeft + el.clientWidth / 2;
      const diff = Math.abs(scrollCenter - childCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  return (
    <section
      id="roadmap"
      className="py-14 sm:py-18 lg:py-20 border-t border-black/[0.08] bg-[#FAFAF8] overflow-hidden"
    >
      <Container size="default">
        {/* Header Compact dengan Navigasi Slide */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <Eyebrow>{cms?.eyebrow || ''}</Eyebrow>
            <h2 className="font-h2 font-bold text-[#111111] leading-[1.12] tracking-tight">
              {cms?.title || ''}
            </h2>
            <p className="text-[14.5px] sm:text-[15.5px] text-[#666666] mt-2 max-w-xl">
              {cms?.description || ''}
            </p>
          </div>

          {/* Controls: Phase Indicator & Navigation Arrows */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <span className="text-xs font-bold text-[#666666] tracking-wider uppercase bg-black/[0.04] px-3 py-1.5 rounded-full border border-black/[0.06]">
              {cms?.phase_label || ''} 0{activeIndex + 1} / 0{phases.length}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeIndex === 0}
                aria-label={cms?.previous_label || ''}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  activeIndex === 0
                    ? 'border-black/[0.08] text-black/20 cursor-not-allowed'
                    : 'border-black/20 text-[#111111] hover:bg-black hover:text-white hover:border-black shadow-xs'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={activeIndex === phases.length - 1}
                aria-label={cms?.next_label || ''}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  activeIndex === phases.length - 1
                    ? 'border-black/[0.08] text-black/20 cursor-not-allowed'
                    : 'border-black/20 text-[#111111] hover:bg-black hover:text-white hover:border-black shadow-xs'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Minimalist Horizontal Step Selector Bar */}
        <div className="hidden sm:grid grid-cols-5 gap-2 mb-6 p-1.5 bg-white rounded-xl border border-black/[0.08] shadow-xs">
          {phases.map((phase, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={phase.step}
                type="button"
                onClick={() => scrollToIndex(idx)}
                className={`py-2 px-3 rounded-lg text-left transition-all cursor-pointer flex flex-col justify-center ${
                  isCurrent
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'hover:bg-black/[0.03] text-[#666666]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>{cms?.phase_label || ''} {phase.step}</span>
                  {phase.status === 'completed' && (
                    <span className={isCurrent ? 'text-white/80' : 'text-emerald-600'}>✓</span>
                  )}
                  {phase.status === 'active' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
                <span
                  className={`text-[12px] font-medium truncate mt-0.5 ${
                    isCurrent ? 'text-white' : 'text-[#333333]'
                  }`}
                >
                  {phase.period}
                </span>
              </button>
            );
          })}
        </div>

        {/* Horizontal Slide Carousel Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {phases.map((item, index) => {
            const isSelected = index === activeIndex;
            return (
              <div
                key={item.step}
                onClick={() => scrollToIndex(index)}
                className={`shrink-0 w-[290px] sm:w-[320px] lg:w-[340px] snap-center rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-white border-black/40 shadow-md ring-1 ring-black/10'
                    : 'bg-white/80 border-black/[0.08] hover:border-black/20 hover:bg-white'
                }`}
              >
                {/* Card Top: Step number & Status badge */}
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[12px] font-extrabold text-[#111111] tracking-wider uppercase">
                      {cms?.phase_label || ''} {item.step}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        item.status === 'completed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : item.status === 'active'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-black/[0.03] border-black/[0.06] text-[#777777]'
                      }`}
                    >
                      {item.status === 'active' && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping mr-1.5 align-middle" />
                      )}
                      {item.statusLabel}
                    </span>
                  </div>

                  <div className="text-[12px] font-semibold text-[#888888] mb-1.5">
                    {item.period}
                  </div>

                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#111111] leading-snug tracking-tight mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-[13.5px] text-[#555555] leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-1.5 pt-3 border-t border-black/[0.06]">
                    {item.highlights.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-[12.5px] text-[#444444]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#111111]/40 mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: Key Metric / Milestone outcome */}
                {item.kpi && (
                  <div className="mt-5 pt-3 border-t border-black/[0.06] flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#777777] uppercase tracking-wider">
                      {item.kpi.label}
                    </span>
                    <span className="text-[12.5px] font-bold text-[#111111]">
                      {item.kpi.value}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
