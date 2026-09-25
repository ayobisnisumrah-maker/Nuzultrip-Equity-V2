import React, { useState, useEffect } from 'react';
import { Compass, Globe, Building2, Luggage, ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { ArrowButton } from '../ui/ArrowButton';
import { ServiceItem } from '../../data/landingData';
import { loadPublicHome } from '../../services/publicPortalService';
import { supabase } from '../../lib/supabase';

interface ServicesSectionProps {
  onOpenServiceDetail: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenServiceDetail }) => {
  const [cms, setCms] = useState<any>(null);

  useEffect(()=>{let active=true;const sync=async()=>{try{const sections=await loadPublicHome();if(active)setCms(sections.find((s)=>s.anchorId==='ekosistem')?.content||null)}catch{}};void sync();const channel=supabase?.channel('public-services-cms').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void sync()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void sync()).subscribe();return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)}},[]);

  const activeServices: ServiceItem[] = Array.isArray(cms?.services) ? cms.services : [];

  const getIcon = (iconName: string) => {
    const iconClass = "transition-colors duration-200 text-[#111111] group-hover:text-white";
    switch (iconName) {
      case 'umroh':
        return <Building2 size={24} className={iconClass} />;
      case 'land':
        return <Luggage size={24} className={iconClass} />;
      case 'tour':
        return <Compass size={24} className={iconClass} />;
      case 'travel':
        return <Globe size={24} className={iconClass} />;
      default:
        return <Building2 size={24} className={iconClass} />;
    }
  };

  return (
    <section
      id="layanan"
      className="py-16 sm:py-24 lg:py-32 border-t border-black/[0.06]"
    >
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Title & Description */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full">
            <div>
              <Eyebrow>{cms?.eyebrow || 'LAYANAN UTAMA'}</Eyebrow>
              <h2 className="font-h2 font-bold text-[#111111] leading-[1.05] tracking-tight mb-5 sm:mb-6">{cms?.title || <>Ekosistem<br />Perjalanan Muslim<br />Nuzultrip</>}</h2>
              <p className="text-[16px] sm:text-[17px] text-[#555555] leading-[1.65] max-w-[360px]">
                {cms?.description || 'Menghubungkan mitra, vendor layanan, dan jaringan distribusi dalam satu kesatuan sistem yang transparan dan terstandar.'}
              </p>
            </div>

            {/* Bottom-aligned CTA on Left Column */}
            <div className="pt-8 sm:pt-10 mt-auto">
              <ArrowButton
                variant="link"
                onClick={() => activeServices[0] && onOpenServiceDetail(activeServices[0])}
                id="services-cta-other"
              >
                {cms?.cta_label || 'Layanan Lainnya'}
              </ArrowButton>
            </div>
          </div>

          {/* Right Column: 2x2 Services Grid */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {activeServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => onOpenServiceDetail(service)}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[180px] sm:min-h-[200px] hover:-translate-y-1 hover:border-black/25 hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    {/* Minimal Icon with soft background that turns green on card hover */}
                    <div className="w-12 h-12 rounded-xl bg-[#F5F5F3] flex items-center justify-center border border-black/[0.06] group-hover:scale-105 group-hover:bg-[#10b981] group-hover:border-[#10b981] group-hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all duration-300">
                      {getIcon(service.iconName)}
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#888888] group-hover:text-black transition-colors">
                      {service.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[18px] sm:text-[19px] font-bold text-[#111111] mb-2 tracking-tight group-hover:text-black">
                      {service.title}
                    </h3>
                    <p className="text-[14px] sm:text-[14.5px] text-[#666666] leading-relaxed">
                      "{service.tagline}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between text-[13px] font-semibold text-[#111111] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{cms?.card_cta_label || 'Pelajari selengkapnya'}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
