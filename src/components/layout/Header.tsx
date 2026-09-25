import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Container } from './Container';
import { loadPublicHome } from '../../services/publicPortalService';
import { supabase } from '../../lib/supabase';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenInterest: () => void;
  isLoggedIn?: boolean;
  onOpenDashboard?: () => void;
  onOpenSuperAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLogin,
  onOpenInterest,
  isLoggedIn = false,
  onOpenDashboard,
  onOpenSuperAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    let active=true;
    const syncLogo=async()=>{try{const sections=await loadPublicHome();const home=sections.find((s)=>s.anchorId==='beranda');if(active){setLogoUrl(String(home?.content?.logo_url||''));setCms(home?.content||null)}}catch{}};
    void syncLogo();
    const channel=supabase?.channel('public-header-brand').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void syncLogo()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void syncLogo()).subscribe();
    return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)};
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = Array.isArray(cms?.nav_links) && cms.nav_links.length ? cms.nav_links : [
    { label: 'Tentang', href: '#tentang' },{ label: 'Peluang', href: '#peluang' },{ label: 'Proses', href: '#proses' },{ label: 'Roadmap', href: '#roadmap' },{ label: 'Jaringan', href: '#jaringan' },{ label: 'Informasi', href: '#informasi' },{ label: 'Kontak', href: '#kontak' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#111822]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <Container size="default">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            id="header-logo"
            className="flex items-center gap-2 group focus-visible:outline-none"
            aria-label="Nuzultrip Equity Beranda"
          >
            {logoUrl ? <img src={logoUrl} alt="Nuzultrip Equity" className="h-8 sm:h-9 w-auto max-w-[180px] object-contain transition-opacity group-hover:opacity-85" /> : <div className="flex items-baseline">
              <span className="text-[20px] sm:text-[23px] font-extrabold tracking-tight text-white transition-opacity group-hover:opacity-85">Nuzultrip</span>
              <span className="ml-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">Equity</span>
            </div>}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Navigasi Utama">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[13.5px] xl:text-[14.5px] font-medium text-slate-300 hover:text-white transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Masuk & CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            {isLoggedIn ? (
              <button
                id="header-dashboard-btn"
                type="button"
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[13px] sm:text-[13.5px] font-semibold transition-all duration-200 active:scale-98 shadow-xs group cursor-pointer backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{cms?.dashboard_label || 'Dashboard Investor'}</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                id="header-masuk-btn"
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[13px] sm:text-[13.5px] font-semibold transition-all duration-200 active:scale-98 shadow-xs group cursor-pointer backdrop-blur-sm"
              >
                <span>{cms?.login_label || 'Masuk'}</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -mr-1 rounded-lg text-white hover:bg-white/10 transition-colors focus-visible:outline-none"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {/* Mobile Full-Screen Overlay Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-overlay"
          className="lg:hidden fixed inset-0 top-[56px] bg-[#111822]/98 backdrop-blur-2xl z-40 px-6 py-6 flex flex-col justify-between border-t border-white/10 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="flex flex-col gap-3.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[17px] font-semibold text-white py-2.5 border-b border-white/10 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight size={15} className="text-emerald-400" />
              </a>
            ))}
          </div>

          <div className="pt-6 pb-4 flex flex-col gap-3">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDashboard?.();
                }}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-[#0d151d] font-bold text-center flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#0d151d] animate-ping" />
                <span>Buka Dashboard Investor</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenInterest();
                  }}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-[#0d151d] font-bold text-center flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md cursor-pointer"
                >
                  <span>{cms?.mobile_interest_label || cms?.cta_primary || 'Ajukan Minat Equity'}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full py-3 px-5 rounded-xl border border-white/20 text-white font-medium text-center hover:bg-white/10 transition-all cursor-pointer"
                >
                  {cms?.mobile_login_label || 'Masuk Portal (Investor / Admin)'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
