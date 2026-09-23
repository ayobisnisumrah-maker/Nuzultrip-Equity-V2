import React from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer, Calendar, Building2 } from 'lucide-react';
import { InvestorReport } from '../../data/investorData';

interface ReportDetailModalProps {
  report: InvestorReport | null;
  onClose: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  const handleDownload = () => {
    // Generate a downloadable text/markdown summary file as official report preview
    const reportContent = `
========================================================================
PT NUZUL BERKAH WISATA (NUZULTRIP EQUITY)
DOKUMEN RESMI LAPORAN INVESTOR
========================================================================

JUDUL LAPORAN : ${report.title}
PERIODE        : ${report.period}
TANGGAL RILIS  : ${report.date}
KATEGORI       : ${report.category.toUpperCase()}
AUDITOR        : ${report.auditor || 'Internal Investor Relations Nuzultrip'}
STATUS         : TERVERIFIKASI & TERAUDIT

------------------------------------------------------------------------
RINGKASAN EKSEKUTIF:
------------------------------------------------------------------------
${report.summary}

------------------------------------------------------------------------
SOROTAN KINERJA UTAMA:
------------------------------------------------------------------------
${report.highlights.map((h) => `- ${h.label}: ${h.value}`).join('\n')}

------------------------------------------------------------------------
CATATAN MANAJEMEN:
------------------------------------------------------------------------
${report.contentDetails}

------------------------------------------------------------------------
PENGESAHAN DOKUMEN:
Direksi PT Nuzul Berkah Wisata
SK Kemenkumham: AHU-0019281.AH.01.01
Jalan TB Simatupang No. 88, Jakarta Selatan
Hak Cipta dilindungi undang-undang.
========================================================================
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none"
          aria-label="Tutup Laporan"
        >
          <X size={20} />
        </button>

        {/* Header Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-600" />
            Dokumen Resmi Teraudit
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
            {report.fileSize} · {report.fileType}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[19px] sm:text-[23px] font-extrabold text-[#0f172a] leading-snug mb-3">
          {report.title}
        </h3>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pb-5 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-emerald-600" />
            <span>Periode: <strong>{report.period}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 size={14} className="text-emerald-600" />
            <span>Diterbitkan: <strong>{report.date}</strong></span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Ringkasan Eksekutif
          </h4>
          <p className="text-[14.5px] text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {report.summary}
          </p>
        </div>

        {/* Key Highlights Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Sorotan Kinerja Utama
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {report.highlights.map((h, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col"
              >
                <span className="text-xs text-slate-600 font-medium mb-1">{h.label}</span>
                <span className="text-[17px] font-extrabold text-emerald-900 tracking-tight">
                  {h.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Management & Auditor Notes */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Ulasan Operasional & Dewan Direksi
          </h4>
          <p className="text-[13.5px] text-slate-600 leading-relaxed">
            {report.contentDetails}
          </p>
        </div>

        {report.auditor && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 mb-6 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-900">Auditor Eksternal Independen:</span>{' '}
              {report.auditor}. Seluruh angka neraca telah diverifikasi sesuai Standar Akuntansi Keuangan (SAK) Indonesia.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98 cursor-pointer"
          >
            <Download size={16} />
            <span>Unduh Laporan Lengkap ({report.fileSize})</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <Printer size={15} />
            <span>Cetak Salinan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
