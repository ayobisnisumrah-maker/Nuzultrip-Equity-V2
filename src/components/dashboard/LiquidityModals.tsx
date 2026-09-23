import React, { useState } from 'react';
import {
  X,
  DollarSign,
  GitFork,
  ShieldCheck,
  AlertCircle,
  Building,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { DEMO_INVESTOR } from '../../data/investorData';
import { realtimeStore } from '../../services/realtimeStore';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const SaleRequestModal: React.FC<SaleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [units, setUnits] = useState(1);
  const [bankName, setBankName] = useState('Bank Syariah Indonesia (BSI)');
  const [bankAccount, setBankAccount] = useState('7129840192');
  const [bankAccountName, setBankAccountName] = useState(DEMO_INVESTOR.name);
  const [reason, setReason] = useState('Kebutuhan likuiditas portofolio keluarga');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const unitPrice = 100000000;
  const totalValue = units * unitPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Harap setujui pernyataan pengalihan hak kepemilikan terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      await realtimeStore.createTransferRequest({
        type: 'sale',
        investorId: DEMO_INVESTOR.id,
        investorName: DEMO_INVESTOR.name,
        investorEmail: DEMO_INVESTOR.email,
        investorPhone: DEMO_INVESTOR.phone,
        units,
        unitPrice,
        totalValue,
        bankName,
        bankAccount,
        bankAccountName,
        saleReason: reason,
      });

      onSuccess(
        `Pengajuan penjualan ${units} unit saham senilai Rp ${totalValue.toLocaleString('id-ID')} berhasil dikirim ke Admin Console!`
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Jual Saham / Ajukan Buyback
              </h3>
              <p className="text-xs text-slate-500">
                Secondary market & opsi pembelian kembali oleh perseroan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Info Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Sesuai Anggaran Dasar PT. Swarna Dipa Wisata, penjualan saham unit equity akan ditawarkan terlebih dahulu kepada perseroan (*buyback*) atau mitra pemegang saham terdaftar dengan harga nominal per unit yang disepakati.
            </div>
          </div>

          {/* Unit selection */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Jumlah Unit yang Ingin Dijual
              </label>
              <span className="text-xs text-slate-500">
                Maksimal: {DEMO_INVESTOR.unitsOwned} Unit
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setUnits(num)}
                  disabled={num > DEMO_INVESTOR.unitsOwned}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    units === num
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-sm">{num} Unit Saham</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ({(num * 0.8).toFixed(1)}% Porsi)
                  </div>
                </button>
              ))}
            </div>

            {/* Price calculation */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-600">Estimasi Nilai Pencairan:</span>
              <span className="text-base font-black text-emerald-700">
                Rp {totalValue.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Bank Destination */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 block">
              Rekening Bank Tujuan Pencairan
            </label>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Nama Bank</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
                <option value="Bank Mandiri">Bank Mandiri</option>
                <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
                <option value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</option>
                <option value="Bank Muamalat">Bank Muamalat</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  required
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Contoh: 7129840192"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Nama Pemilik Rekening</label>
                <input
                  type="text"
                  required
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="Nama sesuai buku tabungan"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Alasan Pengajuan Penjualan
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Catatan tambahan untuk tim Investor Relations..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Agreement Checkbox */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="sale-agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="sale-agree" className="text-[11px] text-slate-600 leading-relaxed cursor-pointer">
              Saya menyatakan bahwa pengajuan pelepasan {units} unit saham ini dilakukan atas persetujuan pemilik sah dan bersedia menandatangani Akta Perjanjian Jual Beli Saham Notarial jika permohonan disetujui perseroan.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !agreed}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <FileCheck size={15} />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan Penjualan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface InheritanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const InheritanceModal: React.FC<InheritanceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [units, setUnits] = useState(1);
  const [heirName, setHeirName] = useState('');
  const [heirRelationship, setHeirRelationship] = useState<
    'Anak Kandung' | 'Pasangan (Suami/Istri)' | 'Orang Tua' | 'Saudara Kandung' | 'Ahli Waris Pengganti'
  >('Anak Kandung');
  const [heirNik, setHeirNik] = useState('');
  const [heirPhone, setHeirPhone] = useState('');
  const [heirEmail, setHeirEmail] = useState('');
  const [legalDocNumber, setLegalDocNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const unitPrice = 100000000;
  const totalValue = units * unitPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heirName.trim() || !heirNik.trim() || !heirPhone.trim()) {
      alert('Harap lengkapi nama ahli waris, NIK KTP, dan nomor kontak.');
      return;
    }
    if (!agreed) {
      alert('Harap setujui pernyataan pelimpahan hak waris terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      await realtimeStore.createTransferRequest({
        type: 'inheritance',
        investorId: DEMO_INVESTOR.id,
        investorName: DEMO_INVESTOR.name,
        investorEmail: DEMO_INVESTOR.email,
        investorPhone: DEMO_INVESTOR.phone,
        units,
        unitPrice,
        totalValue,
        heirName,
        heirRelationship,
        heirNik,
        heirPhone,
        heirEmail,
        legalDocNumber: legalDocNumber || 'Dalam Proses Akta Notaris',
        inheritanceNotes: notes,
      });

      onSuccess(
        `Permohonan pewarisan ${units} unit saham kepada ${heirName} (${heirRelationship}) berhasil dikirim ke Admin Console untuk verifikasi notaris!`
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <GitFork size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Berikan ke Ahli Waris (Pewarisan / Hibah)
              </h3>
              <p className="text-xs text-slate-500">
                Pelimpahan hak kepemilikan unit equity & hak dividen masa depan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Info Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Pengalihan saham kepada ahli waris sah diatur secara transparan. Setelah disetujui di Admin Console dan divalidasi dokumen hukumnya (Kartu Keluarga / Akta Kematian / Akta Hibah Notaris), hak pembagian bagi hasil bulanan akan diteruskan langsung ke rekening ahli waris yang ditunjuk.
            </div>
          </div>

          {/* Unit selection */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Jumlah Unit yang Diwariskan
              </label>
              <span className="text-xs text-slate-500">
                Tersedia: {DEMO_INVESTOR.unitsOwned} Unit
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setUnits(num)}
                  disabled={num > DEMO_INVESTOR.unitsOwned}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    units === num
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-sm">{num} Unit Saham</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    (Nilai: Rp {(num * 100000000).toLocaleString('id-ID')})
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Heir Details */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 block">
              Identitas Ahli Waris / Penerima Hibah
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  Nama Lengkap Ahli Waris *
                </label>
                <input
                  type="text"
                  required
                  value={heirName}
                  onChange={(e) => setHeirName(e.target.value)}
                  placeholder="Nama sesuai KTP"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  Hubungan Keluarga *
                </label>
                <select
                  value={heirRelationship}
                  onChange={(e) => setHeirRelationship(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Anak Kandung">Anak Kandung</option>
                  <option value="Pasangan (Suami/Istri)">Pasangan (Suami/Istri)</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Saudara Kandung">Saudara Kandung</option>
                  <option value="Ahli Waris Pengganti">Ahli Waris Pengganti</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  NIK KTP Ahli Waris *
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={heirNik}
                  onChange={(e) => setHeirNik(e.target.value)}
                  placeholder="16 Digit NIK"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  Nomor HP / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={heirPhone}
                  onChange={(e) => setHeirPhone(e.target.value)}
                  placeholder="+62 8..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  Alamat Email Ahli Waris
                </label>
                <input
                  type="email"
                  value={heirEmail}
                  onChange={(e) => setHeirEmail(e.target.value)}
                  placeholder="ahliwaris@email.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Legal reference */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Nomor Dokumen Bukti Waris / Akta Notaris (Opsional / Jika Sudah Ada)
              </label>
              <input
                type="text"
                value={legalDocNumber}
                onChange={(e) => setLegalDocNumber(e.target.value)}
                placeholder="Contoh: Akta Hibah Notaris No. 42/2026 atau Surat Keterangan Waris"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Catatan / Amanah Pelimpahan
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan tambahan untuk perseroan dan divisi hukum..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="inheritance-agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="inheritance-agree" className="text-[11px] text-slate-600 leading-relaxed cursor-pointer">
              Saya menjamin kebenaran identitas ahli waris di atas dan menyetujui pengalihan seluruh hak dividen dan kepemilikan {units} unit saham kepada pihak terkait setelah diverifikasi oleh Super Admin dan Notaris perseroan.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !agreed}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <CheckCircle2 size={15} />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Permohonan Pewarisan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
