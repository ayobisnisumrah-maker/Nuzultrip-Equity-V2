import React, { useEffect, useState } from 'react';
import { Users, Handshake, Building } from 'lucide-react';
import { Container } from '../layout/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { ArrowButton } from '../ui/ArrowButton';
import { IMAGES } from '../../data/landingData';
import { loadPublicHome } from '../../services/publicPortalService';
import { supabase } from '../../lib/supabase';

interface NetworkSectionProps {
  onOpenDetail: () => void;
}

export const NetworkSection: React.FC<NetworkSectionProps> = ({ onOpenDetail }) => {
  const [cms, setCms] = useState<any>(null);
  useEffect(()=>{let active=true;const sync=async()=>{try{const sections=await loadPublicHome();if(active)setCms(sections.find((s)=>s.anchorId==='logo-jaringan')?.content||sections.find((s)=>s.anchorId==='jaringan')?.content||null)}catch{}};void sync();const channel=supabase?.channel('public-network-cms').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void sync()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void sync()).subscribe();return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)}},[]);
  const partners=Array.isArray(cms?.partners)?cms.partners:[];
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user':
        return <Users size={22} className="text-[#111111]" />;
      case 'handshake':
        return <Handshake size={22} className="text-[#111111]" />;
      case 'building':
        return <Building size={22} className="text-[#111111]" />;
      default:
        return <Users size={22} className="text-[#111111]" />;
    }
  };

  return (
    <section
      id="jaringan"
      className="py-16 sm:py-24 lg:py-32 border-t border-black/[0.06]"
    >
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-stretch">
          {/* Column 1: Left Editorial Content */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full">
            <div>
              <Eyebrow>{cms?.eyebrow || 'JARINGAN & MITRA'}</Eyebrow>
              <h2 className="font-h2 font-bold text-[#111111] leading-[1.05] tracking-tight mb-5 sm:mb-6">
                {cms?.title || ''}
              </h2>
              <p className="text-[16px] sm:text-[17px] text-[#555555] leading-[1.65] max-w-[360px]">
                {cms?.description || ''}
              </p>
            </div>

            {/* Bottom-aligned CTA link */}
            <div className="pt-8 sm:pt-10 mt-auto">
              <ArrowButton
                variant="link"
                onClick={onOpenDetail}
                id="network-cta-detail"
              >
                {cms?.cta_label || 'Pelajari Selengkapnya'}
              </ArrowButton>
            </div>
          </div>

          {/* Column 2: 3 Stacked Cards */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            {partners.map((partner:any) => (
              <div
                key={partner.id}
                className="bg-white rounded-2xl p-6 border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-start gap-4 hover:border-black/20 hover:shadow-md transition-all duration-300 group flex-1"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F5F5F3] flex items-center justify-center shrink-0 border border-black/[0.06] group-hover:scale-105 group-hover:bg-white transition-all duration-200">
                  {getIcon(partner.iconName)}
                </div>
                <div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#111111] mb-1.5 tracking-tight group-hover:text-black">
                    {partner.title}
                  </h3>
                  <p className="text-[13.5px] sm:text-[14px] text-[#666666] leading-relaxed">
                    "{partner.description}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Column 3: Large Editorial Image with Overlay */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] rounded-2xl overflow-hidden shadow-lg border border-black/10 flex flex-col justify-end p-7 text-white group">
              <img
                src={cms?.image_url || IMAGES.partnerPortrait}
                alt={cms?.image_alt || ''}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="relative z-10">
                <h3 className="text-[28px] sm:text-[32px] font-bold leading-[1.1] tracking-tight">
                  {cms?.image_title || ''}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
