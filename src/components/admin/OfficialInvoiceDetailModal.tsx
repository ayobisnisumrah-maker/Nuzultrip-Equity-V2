import React, { useState } from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import {
  OfficialInvoice,
  OFFICIAL_COMPANY_PROFILE,
  DEFAULT_LEGAL_TERMS_TEXT,
  DEFAULT_REFUND_TIERS,
} from '../../data/cashierData';

interface OfficialInvoiceDetailModalProps {
  invoice: OfficialInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateInvoice?: (updated: OfficialInvoice) => void;
}

export const OfficialInvoiceDetailModal: React.FC<OfficialInvoiceDetailModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onUpdateInvoice,
}) => {
  if (!isOpen || !invoice) return null;

  const [dueDate, setDueDate] = useState(invoice.dueDate || '22/09/2026');
  const [departureDate, setDepartureDate] = useState(invoice.departureDate || '25/10/2026');
  const [isSaved, setIsSaved] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(invoice.paymentStatus);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Calculate days to departure (approx 32 days as in screenshot)
  const daysToDeparture = 32;
  const maxRefundPercent = 75; // Based on 31-60 days tier

  const handleSaveDates = () => {
    if (onUpdateInvoice) {
      onUpdateInvoice({
        ...invoice,
        dueDate,
        departureDate,
        paymentStatus,
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleStatus = () => {
    const nextStatus = paymentStatus === 'draft' ? 'dp' : paymentStatus === 'dp' ? 'lunas' : 'draft';
    const nextPaid = nextStatus === 'lunas' ? invoice.totalAmount : nextStatus === 'dp' ? invoice.totalAmount * 0.3 : 0;
    setPaymentStatus(nextStatus);
    if (onUpdateInvoice) {
      onUpdateInvoice({
        ...invoice,
        paymentStatus: nextStatus,
        paidAmount: nextPaid,
        remainingAmount: invoice.totalAmount - nextPaid,
      });
    }
  };

  // Split terms into articles/pasal for clean multi-page presentation
  const termsArticles = DEFAULT_LEGAL_TERMS_TEXT.split('PASAL ');
  const preamble = termsArticles[0];
  const pasals = termsArticles.slice(1).map((p) => 'PASAL ' + p);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col overflow-y-auto">
      {/* Top action header (Screen only) */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              BUKTI PEMBAYARAN
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
              {invoice.title}
            </h2>
            <div className="text-xs text-slate-500 font-mono">
              {invoice.invoiceNumber} · {invoice.customerName}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer size={14} />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              type="button"
              onClick={toggleStatus}
              className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs cursor-pointer ${
                paymentStatus === 'lunas'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : paymentStatus === 'dp'
                  ? 'bg-blue-600 hover:bg-blue-500'
                  : 'bg-emerald-700 hover:bg-emerald-600'
              }`}
            >
              <span>
                {paymentStatus === 'draft'
                  ? 'Terbitkan invoice'
                  : paymentStatus === 'dp'
                  ? 'Tandai Lunas'
                  : 'Status: LUNAS'}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-2 cursor-pointer"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Date control bar & Refund notice */}
        <div className="max-w-5xl mx-auto mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Batas pelunasan:</span>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-28 px-2.5 py-1 rounded-lg border border-slate-200 text-center font-mono font-medium focus:border-emerald-600 outline-none"
              />
              <button
                type="button"
                onClick={handleSaveDates}
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
              >
                {isSaved ? 'Tersimpan!' : 'Simpan'}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Tanggal keberangkatan:</span>
              <input
                type="text"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-28 px-2.5 py-1 rounded-lg border border-slate-200 text-center font-mono font-medium focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            Tanggal ini diatur manual oleh kasir. Dipakai untuk menentukan persentase refund.
          </div>
        </div>

        {/* Blue alert box for Refund Policy */}
        <div className="max-w-5xl mx-auto mt-2.5 p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="text-sky-600 shrink-0" />
          <div>
            <span className="font-bold">Refund mengikuti kebijakan invoice:</span>{' '}
            {daysToDeparture} hari menuju keberangkatan - kebijakan maksimal {maxRefundPercent}% dari pembayaran yang diterima.
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (Matching Screenshot 2 Multi-page A4) */}
      <div className="p-4 sm:p-8 flex-1 flex justify-center print:p-0">
        <div className="w-full max-w-4xl space-y-8 print:space-y-0 print:w-full">
          {/* =========================================================================
              PAGE 1: BUKTI PEMBAYARAN / INVOICE (Matching Screenshot 2 Page 1)
             ========================================================================= */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-200 text-slate-900 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:min-h-screen print:page-break-after-always">
            <div>
              {/* Header Box */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-6">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    {invoice.title}
                  </h1>
                  <div className="text-xs font-mono font-semibold text-slate-500 mt-1">
                    Order ID <span className="font-bold text-emerald-800">#{invoice.invoiceNumber}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                      N
                    </div>
                    <span className="font-black text-lg text-slate-900 tracking-tight">Nuzultrip</span>
                  </div>
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                      paymentStatus === 'lunas'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : paymentStatus === 'dp'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {paymentStatus === 'lunas' ? 'LUNAS' : paymentStatus === 'dp' ? 'DP' : 'DRAFT'}
                  </span>
                </div>
              </div>

              {/* Customer Box */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 mb-6 text-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Nama Pemesan</div>
                  <div className="font-bold text-slate-900">{invoice.customerName}</div>
                  {invoice.customerAddress && (
                    <div className="text-[11px] text-slate-500 mt-1">{invoice.customerAddress}</div>
                  )}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Alamat Email</div>
                  <div className="text-slate-700">{invoice.customerEmail || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Nomor Ponsel</div>
                  <div className="text-slate-700 font-mono">{invoice.customerPhone || '-'}</div>
                </div>
              </div>

              {/* Detail Pembayaran Table */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Detail Pembayaran
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/90 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-4 w-12 text-center">No.</th>
                        <th className="py-2.5 px-4">Produk</th>
                        <th className="py-2.5 px-4">Deskripsi</th>
                        <th className="py-2.5 px-4 text-center">Jumlah</th>
                        <th className="py-2.5 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-4 text-center text-slate-400">1</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{invoice.packageName}</td>
                        <td className="py-3 px-4 text-slate-600 whitespace-pre-line text-[11px]">
                          {invoice.packageDescription}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">
                          {invoice.paxCount} pax
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                          {formatRupiah(invoice.totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subtotal & Calculations */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6 mb-6">
                {/* Payment method note */}
                <div className="space-y-2 text-xs text-slate-600 max-w-sm">
                  <div>
                    <div className="text-[10.5px] font-bold uppercase text-slate-400">
                      Waktu & Metode Pembayaran
                    </div>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {paymentStatus === 'lunas'
                        ? 'Lunas via Transfer Bank BSI Syariah PT Swarna Dipa Wisata'
                        : invoice.paymentMethodDetails}
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px] block">
                      Batas pelunasan: {dueDate}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Keberangkatan: {departureDate}
                    </span>
                  </div>
                </div>

                {/* Numbers breakdown */}
                <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-900">{formatRupiah(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-1.5">
                    <span>Total Tagihan</span>
                    <span className="font-mono">{formatRupiah(invoice.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Sudah Dibayar</span>
                    <span className="font-mono">{formatRupiah(invoice.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 border-t border-slate-100 pt-1.5">
                    <span>Sisa Tagihan</span>
                    <span className="font-mono">{formatRupiah(invoice.remainingAmount)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-2">
                    <span>Total pembayaran</span>
                    <span className="font-mono">{formatRupiah(invoice.paidAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Official Seal & Stamp Box */}
              <div className="flex justify-end pr-8 py-2">
                <div className="text-center relative">
                  <div className="text-[11px] text-slate-400 mb-1">Pengesahan Resmi Kasir</div>
                  {/* Red Corporate Stamp Simulation (PT Swarna Dipa Wisata) */}
                  <div className="w-28 h-28 mx-auto rounded-full border-2 border-dashed border-rose-600/80 p-1 flex items-center justify-center relative rotate-[-8deg] bg-rose-50/30">
                    <div className="w-full h-full rounded-full border border-rose-600 flex flex-col items-center justify-center text-center p-1">
                      <span className="text-[7.5px] font-black uppercase text-rose-700 tracking-wider">
                        PT. SWARNA DIPA WISATA
                      </span>
                      <div className="w-6 h-6 my-0.5 rounded-full border border-rose-600 flex items-center justify-center text-rose-600 text-[9px] font-black">
                        ★
                      </div>
                      <span className="text-[7px] font-bold uppercase text-rose-600 tracking-tight">
                        MAKASSAR - INDONESIA
                      </span>
                    </div>
                  </div>
                  <div className="font-bold text-xs text-slate-900 mt-2">PT. Swarna Dipa Wisata</div>
                  <div className="text-[10px] text-slate-400">Finance & Cashier Division</div>
                </div>
              </div>
            </div>

            {/* Page 1 Footer */}
            <div className="border-t border-slate-200 pt-4 mt-8 flex flex-col sm:flex-row justify-between items-end gap-3 text-[10.5px] text-slate-500">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-800">{OFFICIAL_COMPANY_PROFILE.companyName}</div>
                <div className="text-[10px] text-slate-500 whitespace-pre-line">
                  {OFFICIAL_COMPANY_PROFILE.address}
                </div>
                <div className="text-emerald-700 font-semibold">Kontak: {OFFICIAL_COMPANY_PROFILE.email}</div>
              </div>

              <div className="text-right space-y-1">
                <div className="italic text-slate-400">
                  Syarat & Ketentuan tercantum mulai halaman 2. Dokumen dibuat otomatis oleh sistem Nuzultrip.
                </div>
                <div className="font-bold text-slate-700">Halaman 1 dari 5</div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              PAGES 2 S/D 5: SYARAT & KETENTUAN (20 PASAL TRAVEL & UMRAH)
             ========================================================================= */}
          {/* Page 2: Pasal 1 s/d Pasal 5 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-200 text-slate-900 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:min-h-screen print:page-break-after-always">
            <div>
              {/* Header */}
              <div className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-start">
                <div>
                  <div className="text-sm font-black text-slate-900">
                    {OFFICIAL_COMPANY_PROFILE.companyName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    RUKO PETTARANI, Jl. A. P. Pettarani No.24 Tamamaung, Kec. Panakkukang Kota Makassar, Sulawesi Selatan 90232
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono font-bold text-slate-600">
                    INVOICE #{invoice.invoiceNumber}
                  </div>
                  <div className="text-[11px] font-extrabold text-slate-800">
                    Syarat & Ketentuan Pemesanan dan Pembayaran
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  SYARAT & KETENTUAN PENDAFTARAN, PEMBAYARAN, PEMBATALAN, REFUND, DAN PELAKSANAAN PERJALANAN
                </h2>
                <div className="text-[11px] font-bold text-emerald-800 mt-1">
                  PT SWARNA DIPA WISATA (NUZULTRIP)
                </div>
                <div className="text-[10.5px] text-slate-500 italic">
                  Berlaku untuk layanan Umrah, Umrah Plus, Halal Tour, dan Land Arrangement
                </div>
              </div>

              <div className="text-[11px] text-slate-700 leading-relaxed space-y-4 text-justify">
                <p>
                  Syarat dan Ketentuan ini merupakan bagian yang tidak terpisahkan dari formulir pendaftaran, quotation, booking, invoice, bukti pembayaran, itinerary, dan/atau dokumen transaksi yang diterbitkan oleh PT Swarna Dipa Wisata ("Nuzultrip").
                </p>
                <p>
                  Dengan melakukan pendaftaran, konfirmasi pemesanan, pembayaran uang muka (DP), pembayaran sebagian, atau pelunasan, pelanggan/jamaah/peserta menyatakan telah membaca, memahami, dan menyetujui Syarat dan Ketentuan ini sesuai produk atau layanan yang dipesan.
                </p>

                {pasals.slice(0, 5).map((pasal, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="font-extrabold text-slate-900">{pasal.split('\n')[0]}</div>
                    <div className="whitespace-pre-line text-slate-600">
                      {pasal.split('\n').slice(1).join('\n')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-6 flex justify-between text-[10px] text-slate-400">
              <span>PT. Swarna Dipa Wisata · Dokumen syarat ini merupakan bagian tidak terpisahkan dari invoice.</span>
              <span className="font-bold text-slate-700">Halaman 2 dari 5</span>
            </div>
          </div>

          {/* Page 3: Pasal 6 s/d Pasal 12 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-200 text-slate-900 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:min-h-screen print:page-break-after-always">
            <div>
              <div className="border-b border-slate-200 pb-3 mb-6 flex justify-between items-start text-xs">
                <span className="font-bold text-slate-800">{OFFICIAL_COMPANY_PROFILE.companyName}</span>
                <span className="font-mono text-slate-500">INVOICE #{invoice.invoiceNumber}</span>
              </div>

              <div className="text-[11px] text-slate-700 leading-relaxed space-y-4 text-justify">
                {pasals.slice(5, 12).map((pasal, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="font-extrabold text-slate-900">{pasal.split('\n')[0]}</div>
                    <div className="whitespace-pre-line text-slate-600">
                      {pasal.split('\n').slice(1).join('\n')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-6 flex justify-between text-[10px] text-slate-400">
              <span>PT. Swarna Dipa Wisata · Dokumen syarat ini merupakan bagian tidak terpisahkan dari invoice.</span>
              <span className="font-bold text-slate-700">Halaman 3 dari 5</span>
            </div>
          </div>

          {/* Page 4: Pasal 13 s/d Pasal 18 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-200 text-slate-900 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:min-h-screen print:page-break-after-always">
            <div>
              <div className="border-b border-slate-200 pb-3 mb-6 flex justify-between items-start text-xs">
                <span className="font-bold text-slate-800">{OFFICIAL_COMPANY_PROFILE.companyName}</span>
                <span className="font-mono text-slate-500">INVOICE #{invoice.invoiceNumber}</span>
              </div>

              <div className="text-[11px] text-slate-700 leading-relaxed space-y-4 text-justify">
                {pasals.slice(12, 18).map((pasal, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="font-extrabold text-slate-900">{pasal.split('\n')[0]}</div>
                    <div className="whitespace-pre-line text-slate-600">
                      {pasal.split('\n').slice(1).join('\n')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-6 flex justify-between text-[10px] text-slate-400">
              <span>PT. Swarna Dipa Wisata · Dokumen syarat ini merupakan bagian tidak terpisahkan dari invoice.</span>
              <span className="font-bold text-slate-700">Halaman 4 dari 5</span>
            </div>
          </div>

          {/* Page 5: Pasal 19 s/d Pasal 20 & Kebijakan SLA Refund Table */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-200 text-slate-900 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:min-h-screen">
            <div>
              <div className="border-b border-slate-200 pb-3 mb-6 flex justify-between items-start text-xs">
                <span className="font-bold text-slate-800">{OFFICIAL_COMPANY_PROFILE.companyName}</span>
                <span className="font-mono text-slate-500">INVOICE #{invoice.invoiceNumber}</span>
              </div>

              <div className="text-[11px] text-slate-700 leading-relaxed space-y-4 text-justify">
                {pasals.slice(18).map((pasal, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="font-extrabold text-slate-900">{pasal.split('\n')[0]}</div>
                    <div className="whitespace-pre-line text-slate-600">
                      {pasal.split('\n').slice(1).join('\n')}
                    </div>
                  </div>
                ))}

                {/* Refund SLA Table */}
                <div className="pt-4 space-y-2">
                  <div className="font-extrabold text-slate-900 text-xs">
                    TABEL PERSENTASE REFUND BERDASARKAN JARAK KEBERANGKATAN:
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Tenggang Waktu Menuju Keberangkatan</th>
                          <th className="py-2 px-3 text-right">Maksimal Pengembalian (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {DEFAULT_REFUND_TIERS.map((tier, idx) => (
                          <tr key={idx} className={tier.refundPercent === maxRefundPercent ? 'bg-amber-50 font-bold' : ''}>
                            <td className="py-2 px-3">
                              {tier.maxDays === null
                                ? `Lebih dari ${tier.minDays} hari`
                                : `${tier.minDays} – ${tier.maxDays} hari sebelum berangkat`}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold">
                              {tier.refundPercent}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-[10.5px] text-slate-400 italic">
                    SLA Standar proses verifikasi dan pencairan refund maksimal 90 hari kalender sesuai ketentuan perbankan dan maskapai.
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-6 flex justify-between text-[10px] text-slate-400">
              <span>PT. Swarna Dipa Wisata · Syarat dan ketentuan lengkap telah disetujui pemesan.</span>
              <span className="font-bold text-slate-700">Halaman 5 dari 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
