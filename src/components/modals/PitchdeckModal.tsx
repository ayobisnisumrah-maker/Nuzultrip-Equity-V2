import React, { useEffect, useState } from 'react';
import { listPublicPortalDocuments } from '../../services/documentService';
import { supabase } from '../../lib/supabase';
import { X, FileText, Download, Check, ShieldCheck } from 'lucide-react';

interface PitchdeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchdeckModal: React.FC<PitchdeckModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [email, setEmail] = useState('');
  const [pitchdeck, setPitchdeck] = useState<{id:string;title:string;fileName:string}|null>(null);
  const [loadError, setLoadError] = useState<string|null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoadError(null);
    listPublicPortalDocuments().then((docs) => {
      const doc = docs.find((d) => d.kind === 'pitch_deck');
      setPitchdeck(doc ? { id: doc.id, title: doc.title, fileName: doc.fileName } : null);
    }).catch(() => setLoadError('Dokumen pitchdeck belum tersedia.'));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchdeck || !supabase) { setLoadError('Pitchdeck PDF belum dipublikasikan oleh Admin Dokumen.'); return; }
    setDownloading(true); setLoadError(null);
    try {
      const { data, error } = await supabase.functions.invoke('public-document-download', { body: { document_id: pitchdeck.id } });
      if (error || !data?.url) throw new Error(data?.error || error?.message || 'Unduhan gagal.');
      const link = document.createElement('a'); link.href = data.url; link.rel = 'noopener'; link.click();
      setDownloaded(true);
    } catch (error) { setLoadError(error instanceof Error ? error.message : 'Unduhan PDF gagal.'); }
    finally { setDownloading(false); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#F5F5F3] rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#666666] hover:text-[#090909] hover:bg-black/5 transition-colors focus-visible:outline-none"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#888888]">
              Dokumen Resmi
            </span>
            <h3 className="text-[20px] sm:text-[22px] font-extrabold text-[#111111]">
              Unduh Pitchdeck Resmi
            </h3>
          </div>
        </div>

        <p className="text-[14px] text-[#555555] leading-relaxed mb-6">
          Dapatkan ringkasan eksekutif, analisis pasar ibadah Muslim 2024–2026, roadmap teknologi, struktur penawaran 50 unit equity, dan proyeksi keuangan Nuzultrip.
        </p>

        {/* Highlights Preview */}
        <div className="bg-white rounded-2xl p-4 border border-black/10 mb-6 space-y-2 text-[13.5px]">
          <div className="flex items-center justify-between py-1 border-b border-black/[0.05]">
            <span className="text-[#666666]">Format Dokumen:</span>
            <span className="font-semibold text-[#111111]">PDF resmi dari Admin Dokumen</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-black/[0.05]">
            <span className="text-[#666666]">Versi Terkini:</span>
            <span className="font-semibold text-[#111111]">Versi publik terbaru</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[#666666]">Kerahasiaan:</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck size={14} /> Terproteksi Confidential
            </span>
          </div>
        </div>

        {downloaded ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
              <Check size={24} />
            </div>
            <h4 className="text-[17px] font-bold text-[#111111]">Dokumen Telah Diunduh</h4>
            <p className="text-[13.5px] text-[#666666] mt-1 mb-4">
              File PDF resmi telah diproses dari penyimpanan dokumen Nuzultrip.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-[#090909] text-white font-semibold text-[14px]"
            >
              Tutup Jendela
            </button>
          </div>
        ) : (
          <form onSubmit={handleDownload} className="space-y-4">\n            {loadError && <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">{loadError}</div>}
            <div>
              <label className="block text-[13px] font-bold text-[#111111] mb-1">
                Masukkan Email Anda untuk Menerima Dokumen *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-black/15 bg-white text-[14px] text-[#111111] placeholder:text-black/35 focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={downloading}
              className="w-full py-3 px-5 rounded-xl bg-[#090909] text-white font-bold text-[14.5px] flex items-center justify-center gap-2 hover:bg-[#222222] active:scale-98 transition-all cursor-pointer disabled:opacity-70"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyiapkan Berkas...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Unduh Pitchdeck PDF</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
