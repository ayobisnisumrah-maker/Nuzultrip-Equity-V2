import React from 'react';
import { Phone, FileDown, ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { loadPublicHome } from '../../services/publicPortalService';
import { supabase } from '../../lib/supabase';

interface QuickActionSectionProps {
  onOpenInterest: () => void;
  onOpenPitchdeck: () => void;
}

export const QuickActionSection: React.FC<QuickActionSectionProps> = ({
  onOpenInterest,
  onOpenPitchdeck,
}) => {
  const [cms, setCms] = React.useState<any>(null);
  React.useEffect(()=>{let active=true;const sync=async()=>{try{const sections=await loadPublicHome();if(active)setCms(sections.find((s)=>s.anchorId==='konten')?.content||null)}catch{}};void sync();const channel=supabase?.channel('public-quick-action-cms').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void sync()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void sync()).subscribe();return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)}},[]);
  return (
    <section
      id="kontak"
      className="bg-[#080808] text-white py-16 sm:py-24 lg:py-28"
    >
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-stretch">
          {/* Column 1: Left Headline */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Eyebrow variant="dark">{cms?.eyebrow || 'QUICK ACTION'}</Eyebrow>
              <h2 className="font-h2 font-bold text-white leading-[1.05] tracking-tight mb-4">
                {cms?.title || ''}
              </h2>
              <p className="text-[15px] sm:text-[16px] text-white/65 leading-relaxed max-w-[320px]">
                {cms?.description || 'Tim {cms?.contact_eyebrow || ''} kami siap memberikan pendampingan personal bagi calon mitra dan investor strategis.'}
              </p>
            </div>
          </div>

          {/* Column 2: 2 Action Cards */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            {/* Action Card 1: {cms?.contact_title || ''} WhatsApp / Call */}
            <a
              href={`https://wa.me/${String(cms?.contact_phone||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(cms?.contact_message||'')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl p-6 border border-white/15 hover:border-white/35 transition-all duration-300 flex flex-col justify-between flex-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <Phone size={18} />
                </div>
                <ArrowRight size={16} className="text-white/60 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/60">
                  Investor Relations
                </span>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-white mt-1">
                  Hubungi Tim
                </h3>
                <p className="text-[14px] text-white/70 mt-1 font-mono">
                  {cms?.contact_phone || ''}
                </p>
              </div>
            </a>

            {/* Action Card 2: Unduh Pitchdeck */}
            <div
              onClick={onOpenPitchdeck}
              className="bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl p-6 border border-white/15 hover:border-white/35 transition-all duration-300 flex flex-col justify-between flex-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <FileDown size={18} />
                </div>
                <ArrowRight size={16} className="text-white/60 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/60">
                  {cms?.pitchdeck_eyebrow || ''}
                </span>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-white mt-1">
                  {cms?.pitchdeck_label || ''}
                </h3>
                <p className="text-[14px] text-white/70 mt-1">
                  {cms?.pitchdeck_description || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Visual Invitation Card with CTA */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden border border-white/15 flex flex-col justify-between p-7 text-white group">
              <img
                src={cms?.image_url || ''}
                alt={cms?.image_alt || ''}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/70" />

              <div className="relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                  {cms?.card_eyebrow || ''}
                </span>
                <h3 className="text-[22px] sm:text-[24px] font-bold text-white mt-2 leading-[1.2]">
                  {cms?.card_title || ''}
                </h3>
                <p className="text-[14px] text-white/75 mt-2 leading-relaxed">
                  {cms?.card_description || ''}
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <button
                  type="button"
                  onClick={onOpenInterest}
                  className="w-full py-3 px-5 rounded-xl bg-white text-[#090909] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#EDEDEB] active:scale-98 transition-all shadow-md group/btn cursor-pointer"
                >
                  <span>{cms?.cta_label || ''}</span>
                  <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
