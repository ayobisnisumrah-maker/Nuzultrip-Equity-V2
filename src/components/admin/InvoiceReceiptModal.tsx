import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { CashierTransaction } from '../../services/realtimeStore';

interface InvoiceReceiptModalProps {
  transaction: CashierTransaction | null;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Official Header */}
        <div className="text-center pb-5 border-b border-dashed border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={13} className="text-emerald-600" />
            Bukti Transaksi Resmi Terverifikasi
          </div>
          <h3 className="text-xl font-extrabold text-[#0f172a]">PT Nuzul Berkah Wisata</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Gedung Nuzultrip Tower, Lantai 12, TB Simatupang, Jakarta Selatan
          </p>
          <p className="text-[11px] text-slate-400">SK Kemenkumham: AHU-0019281.AH.01.01</p>
        </div>

        {/* Invoice Info */}
        <div className="py-4 space-y-2 text-xs border-b border-dashed border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-500">Nomor Invoice</span>
            <span className="font-mono font-bold text-slate-900">{transaction.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Waktu Transaksi</span>
            <span className="font-medium text-slate-800">{transaction.createdAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Kasir Petugas</span>
            <span className="font-medium text-slate-800">{transaction.createdBy}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Pelanggan / Investor</span>
            <span className="font-bold text-slate-900">{transaction.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Kontak Telepon</span>
            <span className="font-medium text-slate-800">{transaction.customerPhone}</span>
          </div>
        </div>

        {/* Transaction Item Breakdown */}
        <div className="py-4 border-b border-dashed border-slate-200 text-xs space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {transaction.transactionType === 'equity_purchase'
                  ? `Pembelian Unit Equity Nuzultrip (${transaction.unitsCount || 1} Unit)`
                  : transaction.transactionType === 'umroh_package'
                  ? 'Pembayaran Paket Umroh Reguler / VIP'
                  : transaction.transactionType === 'hotel_allotment'
                  ? 'Pemesanan Kamar Hotel Makkah/Madinah (B2B)'
                  : 'Layanan Visa & Muassasah Saudi'}
              </div>
              {transaction.notes && (
                <div className="text-[11px] text-slate-500 mt-0.5">{transaction.notes}</div>
              )}
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {formatRupiah(transaction.amountTotal)}
            </div>
          </div>
        </div>

        {/* Total & Payment details */}
        <div className="py-4 space-y-2 text-xs border-b border-dashed border-slate-200">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-slate-700">Total Pembayaran</span>
            <span className="text-lg font-black text-emerald-700">
              {formatRupiah(transaction.amountTotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Metode Pembayaran</span>
            <span className="font-semibold text-slate-800 uppercase">
              {transaction.paymentMethod.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status Pembayaran</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 size={12} className="text-emerald-600" />
              {transaction.paymentStatus}
            </span>
          </div>
        </div>

        {/* Legal Disclaimer & Seal */}
        <div className="pt-4 text-center text-[10.5px] text-slate-400 space-y-1">
          <p>Terima kasih atas kepercayaan Anda bersama PT Nuzul Berkah Wisata.</p>
          <p>Resi ini merupakan dokumen sah yang diterbitkan oleh sistem kasir realtime terintegrasi.</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Printer size={15} />
            <span>Cetak Struk Resmi</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
