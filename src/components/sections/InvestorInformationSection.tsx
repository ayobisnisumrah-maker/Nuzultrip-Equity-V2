import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { InvestorInfoItem } from '../../data/landingData';
import { loadPublicHome } from '../../services/publicPortalService';
import { supabase } from '../../lib/supabase';

interface InvestorInformationSectionProps {
  onSelectItem: (item: InvestorInfoItem) => void;
}

export const InvestorInformationSection: React.FC<InvestorInformationSectionProps> = ({
  onSelectItem,
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [cms,setCms]=useState<any>(null);
  useEffect(()=>{let active=true;const sync=async()=>{try{const sections=await loadPublicHome();if(active)setCms(sections.find(s=>s.anchorId==='dokumen')?.content||null)}catch{}};void sync();const channel=supabase?.channel('public-investor-info-cms').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void sync()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void sync()).subscribe();return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)}},[]);
  const items:InvestorInfoItem[]=Array.isArray(cms?.items)?cms.items:[];
  const activeId = hoveredCard || items[0]?.id;

  return (
    <section
      id="informasi"
      className="py-16 sm:py-24 lg:py-32 border-t border-black/[0.06]"
    >
      <Container size="default">
        {/* Section Header */}
        <div className="max-w-[720px] mb-12 sm:mb-16">
          <Eyebrow>{cms?.eyebrow || ''}</Eyebrow>
          <h2 className="font-h2 font-bold text-[#111111] leading-[1.08] tracking-tight">
            {cms?.title || ''}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Image that dynamically updates on card hover (gambar saja tanpa text atau keterangan) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative w-full h-full min-h-[380px] sm:min-h-[500px] rounded-2xl overflow-hidden border border-black/[0.08] shadow-sm bg-[#E8E8E4]">
              {items.map((item) => (
                <img
                  key={item.id}
                  src={item.imageUrl}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out ${
                    item.id === activeId
                      ? 'opacity-100 scale-100 z-10'
                      : 'opacity-0 scale-105 z-0 pointer-events-none'
                  }`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          {/* Right Column: 6 Investor Information Cards in 2 columns x 3 rows */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => {
              const isItemActive = item.id === activeId;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onClick={() => onSelectItem(item)}
                  className={`bg-white rounded-2xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                    isItemActive
                      ? 'border-black/50 shadow-md ring-1 ring-black/10'
                      : 'border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-black/30 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <h3 className="text-[17px] sm:text-[18px] font-bold text-[#111111] mb-2 tracking-tight group-hover:text-black">
                      {item.title}
                    </h3>
                    <p className="text-[13.5px] sm:text-[14px] text-[#666666] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center justify-between text-[13px] font-semibold text-[#111111]">
                    <span>{cms?.cta_label || ''}</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
