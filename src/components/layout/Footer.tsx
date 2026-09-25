import React, { useState, useEffect } from 'react';
import { ArrowRight, Instagram, Facebook, Disc as TikTokIcon, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { Container } from './Container';
import { loadPublicHome } from '../../services/publicPortalService';
import { supabase } from '../../lib/supabase';

interface FooterProps {
  onOpenInterest?: () => void;
  onOpenPitchdeck?: () => void;
  onOpenDetail: (title?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDetail,
}) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    let active=true;
    const syncLogo=async()=>{try{const sections=await loadPublicHome();const home=sections.find((s)=>s.anchorId==='beranda');if(active){setLogoUrl(String(home?.content?.footer_logo_url||home?.content?.logo_url||''));setCms(home?.content||null)}}catch{}};
    void syncLogo();
    const channel=supabase?.channel('public-footer-brand').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void syncLogo()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void syncLogo()).subscribe();
    return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)};
  }, []);

  const normalizeLinks=(value:any)=>Array.isArray(value)?value.map((x:any)=>typeof x==='string'?{label:x}:{label:String(x?.label||''),href:String(x?.href||'')}):[];
  const tentangLinks=normalizeLinks(cms?.footer_about_links);
  const infoLinks=normalizeLinks(cms?.footer_info_links);
  const contactPhone=String(cms?.contact_phone||'');
  const socials=cms?.socials||{};

  return (
    <footer id="site-footer" className="bg-[#080808] text-white pt-16 sm:pt-20 pb-12 border-t border-white/10">
      <Container size="default">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/15">
          {/* Col 1: Brand & Tagline & Socials */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                {logoUrl ? <img src={logoUrl} alt={cms?.footer_logo_alt || cms?.logo_alt || ''} className="h-10 sm:h-11 w-auto max-w-[220px] object-contain" /> : <>
                  <span className="text-[24px] sm:text-[26px] font-extrabold tracking-tight text-white">{cms?.company_name || ''}</span>
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.16em] px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/15">{cms?.brand_suffix || ''}</span>
                </>}
              </div>
              <p className="text-[14px] sm:text-[15px] text-white/70 leading-relaxed max-w-[320px]">
                {cms?.footer_tagline || ''}
              </p>

              <div className="mt-4 text-xs text-white/60 space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{cms?.company_address || ''}</span>
                </div>
                {cms?.company_license && (
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{cms.company_license}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8 flex items-center gap-3">
              {socials.instagram && <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Nuzultrip"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Instagram size={17} />
              </a>}
              {socials.facebook && <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Nuzultrip"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Facebook size={17} />
              </a>}
              {socials.tiktok && <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Nuzultrip"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <TikTokIcon size={17} />
              </a>}
            </div>
          </div>

          {/* Col 2: Tentang Nuzultrip */}
          <div className="lg:col-span-3">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/50 mb-5">
              {cms?.footer_about_title || ''}
            </h4>
            <ul className="space-y-2.5">
              {tentangLinks.map((item:any) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => item.href ? (window.location.href=item.href) : onOpenDetail(item.label)}
                    className="text-[14px] text-white/75 hover:text-white transition-colors text-left focus-visible:outline-none cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Informasi & Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/50 mb-5">
              {cms?.footer_info_title || ''}
            </h4>
            <ul className="space-y-2.5">
              {infoLinks.map((item:any) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => item.href ? (window.location.href=item.href) : onOpenDetail(item.label)}
                    className="text-[14px] text-white/75 hover:text-white transition-colors text-left focus-visible:outline-none cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Contact Box */}
          <div className="lg:col-span-3">
            <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/15">
              <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/60 mb-2">
                {cms?.footer_contact_title || ''}
              </h4>
              <p className="text-[13.5px] text-white/70 leading-relaxed mb-5">
                {cms?.footer_contact_description || ''}
              </p>
              <a
                href={`https://wa.me/${contactPhone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(cms?.contact_message||'')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[56px] py-3 px-4 rounded-xl bg-white text-[#090909] font-bold text-[13.5px] flex items-center justify-between gap-3 hover:bg-[#EDEDEB] transition-all group cursor-pointer"
              >
                <span className="min-w-0 text-left leading-[1.35]">
                  <span className="block sm:inline">{cms?.contact_label || ''}</span>
                  <span className="block sm:inline sm:ml-1 break-words">({contactPhone})</span>
                </span>
                <span className="w-8 h-8 shrink-0 rounded-full bg-[#F4F1E8] flex items-center justify-center text-[#8B6B08]">
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/50">
          <p>{cms?.footer_copyright || ''}</p>
          <div className="flex items-center gap-4 text-center sm:text-right">
            <span>{cms?.footer_bottom_text || ''}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
