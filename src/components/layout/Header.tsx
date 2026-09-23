import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Container } from './Container';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenInterest: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenInterest }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { label: 'Tentang', href: '#tentang' },
    { label: 'Peluang', href: '#peluang' },
    { label: 'Proses', href: '#proses' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'Jaringan', href: '#jaringan' },
    { label: 'Informasi', href: '#informasi' },
    { label: 'Kontak', href: '#kontak' },
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
          ? 'bg-white/90 backdrop-blur-md border-b border-black/[0.06] py-3 shadow-[0_2px_16px_rgba(0,0,0,0.05)]'
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
            <div className="flex items-baseline">
              <span className="text-[20px] sm:text-[23px] font-extrabold tracking-tight text-[#0f172a] transition-opacity group-hover:opacity-85">
                Nuzultrip
              </span>
              <span className="ml-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                Equity
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Navigasi Utama">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[13.5px] xl:text-[14.5px] font-medium text-[#475569] hover:text-[#0f172a] transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Masuk & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="header-masuk-btn"
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-[13px] sm:text-[13.5px] font-semibold transition-all duration-200 active:scale-98 shadow-xs group cursor-pointer"
            >
              <span>Masuk</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -mr-1 rounded-lg text-[#0f172a] hover:bg-black/5 transition-colors focus-visible:outline-none"
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
          className="lg:hidden fixed inset-0 top-[56px] bg-[#FAFBF9]/98 backdrop-blur-2xl z-40 px-6 py-6 flex flex-col justify-between border-t border-black/10 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="flex flex-col gap-3.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[17px] font-semibold text-[#0f172a] py-2.5 border-b border-black/[0.06] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight size={15} className="text-emerald-600" />
              </a>
            ))}
          </div>

          <div className="pt-6 pb-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInterest();
              }}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-center flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md"
            >
              <span>Ajukan Minat Equity</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-3 px-5 rounded-xl border border-black/15 text-[#0f172a] font-medium text-center hover:bg-black/5 transition-all"
            >
              Masuk Portal Investor
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
