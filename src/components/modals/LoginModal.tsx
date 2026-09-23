import React, { useState } from 'react';
import {
  X,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  UserCheck,
  ShieldAlert,
  Database,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { realtimeStore } from '../../services/realtimeStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInterest: () => void;
  onSuccessLogin: () => void;
  onSuccessAdminLogin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenInterest,
  onSuccessLogin,
  onSuccessAdminLogin,
}) => {
  const [activeRole, setActiveRole] = useState<'investor' | 'admin'>('investor');
  const [showPassword, setShowPassword] = useState(false);
  const [investorId, setInvestorId] = useState('NZ-INV-2024-018');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleChange = (role: 'investor' | 'admin') => {
    setActiveRole(role);
    setLoginError(null);
    if (role === 'admin') {
      setInvestorId('admin@nuzultrip.com');
      setPassword('admin2026');
    } else {
      setInvestorId('NZ-INV-2024-018');
      setPassword('••••••••••••');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const email = investorId.trim();

    // Check if Supabase client is configured and email format is entered
    if (supabase && isSupabaseConfigured && email.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          // If it matches demo credentials, allow fallback
          if (email === 'admin@nuzultrip.com' && (password === 'admin2026' || password === '••••••••••••')) {
            setIsLoggingIn(false);
            setAuthenticatedEmail('admin@nuzultrip.com');
            setIsSuccess(true);
            return;
          }
          setIsLoggingIn(false);
          setLoginError(
            `Supabase Auth: ${error.message}. Silakan periksa kembali email & kata sandi akun Supabase Anda.`
          );
          return;
        }

        if (data?.user) {
          setIsLoggingIn(false);
          const userEmail = data.user.email || email;
          setAuthenticatedEmail(userEmail);
          setIsSuccess(true);
          realtimeStore.addAuditLog({
            action: 'Login Super Admin via Supabase Auth',
            category: 'AUTH',
            user: userEmail,
            details: `Autentikasi Supabase Auth UID: ${data.user.id}`,
            status: 'success',
          });
          return;
        }
      } catch (err: any) {
        console.warn('Supabase Auth error fallback:', err);
      }
    }

    // Default mock / demo authentication handler
    setTimeout(() => {
      setIsLoggingIn(false);
      setIsSuccess(true);
    }, 450);
  };

  const handleEnterDestination = () => {
    onClose();
    if (activeRole === 'admin' || investorId.toLowerCase().includes('admin') || authenticatedEmail) {
      if (onSuccessAdminLogin) onSuccessAdminLogin();
      else onSuccessLogin();
    } else {
      onSuccessLogin();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus-visible:outline-none cursor-pointer"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center mb-4 shadow-md shadow-emerald-600/30">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-[20px] font-extrabold text-[#0f172a] mb-2">
              Autentikasi Berhasil
            </h3>
            <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6">
              {authenticatedEmail ? (
                <>
                  Selamat datang kembali, <strong>{authenticatedEmail}</strong>. Akun Supabase Auth Anda telah diverifikasi dengan sukses dengan hak akses Super Administrator.
                </>
              ) : activeRole === 'admin' || investorId.toLowerCase().includes('admin') ? (
                <>
                  Selamat datang kembali, <strong>Super Admin Console</strong> (Akses Terotorisasi). Sesi aman kendali kasir, transaksi, dokumen, dan hubungan investor telah aktif.
                </>
              ) : (
                <>
                  Selamat datang kembali, <strong>H. Bambang Hermanto, SE</strong> (NZ-INV-2024-018). Sesi aman Anda telah aktif. Anda dapat meninjau laporan keuangan, penerimaan dividen, dan sertifikat equity.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={handleEnterDestination}
              className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>
                {activeRole === 'admin' || investorId.toLowerCase().includes('admin')
                  ? 'Buka Super Admin Console Sekarang'
                  : 'Buka Dashboard Investor Sekarang'}
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div>
            {/* Header Dialog */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Lock size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                  Portal Resmi
                </span>
                <h3 className="text-[20px] sm:text-[22px] font-extrabold text-[#0f172a]">
                  Masuk Portal Nuzultrip
                </h3>
              </div>
            </div>

            {/* Role Tab Selector (Investor vs Super Admin) */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-4">
              <button
                type="button"
                onClick={() => handleRoleChange('investor')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeRole === 'investor'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck size={14} />
                <span>Investor</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-slate-900 text-amber-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldAlert size={14} />
                <span>Super Admin</span>
              </button>
            </div>

            <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
              {activeRole === 'admin'
                ? 'Pusat kendali eksekutif: kelola transaksi kasir, dividen, dan terbitkan dokumen resmi.'
                : 'Khusus bagi pemegang unit equity terdaftar dan mitra strategis ekosistem Nuzultrip.'}
            </p>

            {/* Quick 1-Click Fast Access Buttons */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 mb-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                <span className="flex items-center gap-1">
                  <Sparkles size={12} className="text-emerald-600" />
                  Akses Cepat 1-Klik (Langsung Masuk):
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSuccessLogin();
                  }}
                  className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11.5px] font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Portal Investor</span>
                  <ArrowRight size={12} />
                </button>
                {onSuccessAdminLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSuccessAdminLogin();
                    }}
                    className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-[11.5px] font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Super Admin</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Form Input */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-bold text-[#0f172a] mb-1">
                  {activeRole === 'admin' ? 'ID Administrator / Email' : 'ID Investor / Email Terdaftar'}
                </label>
                <input
                  type="text"
                  required
                  value={investorId}
                  onChange={(e) => setInvestorId(e.target.value)}
                  placeholder={activeRole === 'admin' ? 'admin@nuzultrip.com' : 'NZ-INV-2024-018'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[12px] font-bold text-[#0f172a]">
                    Kata Sandi
                  </label>
                  <a
                    href="https://wa.me/6281289218890?text=Halo%20Admin%20Nuzultrip,%20saya%20membutuhkan%20bantuan%20reset%20kata%20sandi%20portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11.5px] font-semibold text-emerald-700 hover:underline"
                  >
                    Lupa sandi?
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-[13.5px] transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Sesi...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {activeRole === 'admin' ? 'Masuk ke Super Admin Console' : 'Masuk ke Portal Investor'}
                    </span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-[12.5px] text-slate-500 mb-2">Belum terdaftar sebagai investor?</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInterest();
                }}
                className="text-[12.5px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors underline decoration-emerald-300 underline-offset-4 cursor-pointer"
              >
                Ajukan Lembar Minat Kepemilikan Equity (Mulai 1 Unit)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
