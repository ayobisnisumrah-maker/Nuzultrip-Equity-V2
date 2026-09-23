import React, { useState, useEffect } from 'react';
import { ArrowRight, Instagram, Facebook, Disc as TikTokIcon, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { Container } from './Container';
import { realtimeStore, PortalSettings } from '../../services/realtimeStore';

interface FooterProps {
  onOpenInterest?: () => void;
  onOpenPitchdeck?: () => void;
  onOpenDetail: (title?: string) => void;
  onOpenSuperAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDetail,
  onOpenSuperAdmin,
}) => {
  const [settings, setSettings] = useState<PortalSettings>(() =>
    realtimeStore.getPortalSettings()
  );

  useEffect(() => {
    const update = () => {
      setSettings(realtimeStore.getPortalSettings());
    };
    const unsub = realtimeStore.subscribe(update);
    return () => unsub();
  }, []);

  const tentangLinks = [
    'Model Bisnis',
    'Ekosistem Bisnis',
    'Perkembangan',
    'Agen dan Kemitraan',
    'Informasi',
    'Ringkasan Penawaran',
    'Pemegang Equity',
  ];

  const infoLinks = [
    'Penggunaan Dana',
    'Tata Kelola',
    'Faktor Risiko',
    'Mekanisme Hasil',
    'Legal',
    'Kebijakan Privasi',
    'Syarat & Ketentuan',
    'Risk Disclosure',
  ];

  return (
    <footer id="site-footer" className="bg-[#080808] text-white pt-16 sm:pt-20 pb-12 border-t border-white/10">
      <Container size="default">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/15">
          {/* Col 1: Brand & Tagline & Socials */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-[24px] sm:text-[26px] font-extrabold tracking-tight text-white">
                  {settings.companyName.split('(')[0].trim() || 'Nuzultrip'}
                </span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.16em] px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/15">
                  Equity
                </span>
              </div>
              <p className="text-[14px] sm:text-[15px] text-white/70 leading-relaxed max-w-[320px]">
                Melayani perjalanan Muslim Indonesia dengan hati, profesionalisme, dan teknologi.
              </p>

              <div className="mt-4 text-xs text-white/60 space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{settings.companyAddress}</span>
                </div>
                {settings.companyLicensePpiu && (
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{settings.companyLicensePpiu}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Nuzultrip"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Instagram size={17} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Nuzultrip"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Facebook size={17} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Nuzultrip"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <TikTokIcon size={17} />
              </a>
            </div>
          </div>

          {/* Col 2: Tentang Nuzultrip */}
          <div className="lg:col-span-3">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/50 mb-5">
              TENTANG NUZULTRIP
            </h4>
            <ul className="space-y-2.5">
              {tentangLinks.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => onOpenDetail(item)}
                    className="text-[14px] text-white/75 hover:text-white transition-colors text-left focus-visible:outline-none cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Informasi & Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/50 mb-5">
              INFORMASI
            </h4>
            <ul className="space-y-2.5">
              {infoLinks.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => onOpenDetail(item)}
                    className="text-[14px] text-white/75 hover:text-white transition-colors text-left focus-visible:outline-none cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Contact Box */}
          <div className="lg:col-span-3">
            <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/15">
              <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/60 mb-2">
                BUTUH INFORMASI TERBARU?
              </h4>
              <p className="text-[13.5px] text-white/70 leading-relaxed mb-5">
                Hubungi tim Investor Relations untuk informasi, dokumen, atau pembaruan resmi Nuzultrip Equity.
              </p>
              <a
                href={`https://wa.me/${settings.contactPhone.replace(/[^0-9]/g, '')}?text=Halo%20Tim%20Investor%20Relations,%20saya%20membutuhkan%20informasi%20terbaru%20mengenai%20penawaran%20equity.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white text-[#090909] font-bold text-[13.5px] flex items-center justify-center gap-2 hover:bg-[#EDEDEB] transition-all group cursor-pointer"
              >
                <span>Hubungi Kami ({settings.contactPhone})</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/50">
          <p>{settings.footerCopyright || '© 2026 PT. Swarna Dipa Wisata. All Rights Reserved.'}</p>
          <div className="flex items-center gap-4 text-center sm:text-right">
            <span>Platform Penawaran Equity Ekosistem Perjalanan Muslim Indonesia.</span>
            {onOpenSuperAdmin && (
              <button
                type="button"
                onClick={onOpenSuperAdmin}
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <span>⚙️ Super Admin</span>
              </button>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
};
