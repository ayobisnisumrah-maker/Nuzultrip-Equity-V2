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
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          ? 'bg-[#08090f]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          : 'bg-transparent py-5 sm:py-6'
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
            <div className="flex items-center">
              <span className="text-[22px] sm:text-[24px] font-extrabold tracking-tight text-white transition-opacity group-hover:opacity-80">
                Nuzultrip
              </span>
              <span className="ml-1.5 inline-block text-[10px] font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded bg-white/10 text-[#d1d5db] border border-white/15">
                Equity
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9" aria-label="Navigasi Utama">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[14px] xl:text-[15px] font-medium text-[#9ca3af] hover:text-white transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[14px] font-semibold transition-all duration-200 active:scale-98 shadow-sm group backdrop-blur-sm cursor-pointer"
            >
              <span>Masuk</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors focus-visible:outline-none"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile Full-Screen Overlay Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-overlay"
          className="lg:hidden fixed inset-0 top-[60px] bg-[#08090f]/95 backdrop-blur-xl z-40 px-6 py-8 flex flex-col justify-between border-t border-white/10 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[20px] font-semibold text-white py-2 border-b border-white/[0.08] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight size={16} className="text-white/40" />
              </a>
            ))}
          </div>

          <div className="pt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInterest();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-semibold text-center flex items-center justify-center gap-2"
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
              className="w-full py-3.5 px-6 rounded-xl border border-white/20 text-white font-medium text-center"
            >
              Masuk Portal Investor
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
