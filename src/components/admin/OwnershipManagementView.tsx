import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  GitFork,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ShieldCheck,
  DollarSign,
  User,
  Building,
  FileText,
  AlertCircle,
  Send,
} from 'lucide-react';
import { realtimeStore, ShareTransferRequest } from '../../services/realtimeStore';

interface OwnershipManagementViewProps {
  initialType?: 'all' | 'sale' | 'inheritance';
  title?: string;
  subtitle?: string;
}

export const OwnershipManagementView: React.FC<OwnershipManagementViewProps> = ({
  initialType = 'all',
  title = 'Pusat Manajemen Transfer & Pewarisan Saham',
  subtitle = 'Kelola permohonan pelepasan saham (buyback) dan pengalihan hak waris dari investor terdaftar.',
}) => {
  const [requests, setRequests] = useState<ShareTransferRequest[]>(
    realtimeStore.getTransferRequests()
  );
  const [selectedType, setSelectedType] = useState<'all' | 'sale' | 'inheritance'>(initialType);
  const [selectedStatus, setSelectedStatus] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReq, setSelectedReq] = useState<ShareTransferRequest | null>(null);
  const [actionNotes, setActionNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setRequests(realtimeStore.getTransferRequests());
    };
    const unsub = realtimeStore.subscribe(sync);
    return () => unsub();
  }, []);

  useEffect(() => {
    setSelectedType(initialType);
  }, [initialType]);

  const filteredRequests = requests.filter((r) => {
    const matchesType =
      selectedType === 'all' ||
      (selectedType === 'sale' && r.type === 'sale') ||
      (selectedType === 'inheritance' && r.type === 'inheritance');

    const matchesStatus =
      selectedStatus === 'semua' || r.status === selectedStatus;

    const matchesSearch =
      r.investorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.heirName && r.heirName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.bankAccount && r.bankAccount.includes(searchQuery));

    return matchesType && matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (
    reqId: string,
    newStatus: ShareTransferRequest['status']
  ) => {
    setIsProcessing(true);
    try {
      await realtimeStore.updateTransferRequestStatus(
        reqId,
        newStatus,
        actionNotes ||
          (newStatus === 'Disetujui'
            ? 'Dokumen hukum dan rekening tujuan telah diverifikasi sah oleh Divisi Hukum & Finance.'
            : 'Perlu melengkapi dokumen keabsahan notaris tambahan.')
      );
      setFeedback(`Pengajuan #${reqId} berhasil diperbarui menjadi "${newStatus}"!`);
      setSelectedReq(null);
      setActionNotes('');
      setTimeout(() => setFeedback(null), 4000);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Pengajuan gagal diperbarui.');
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'Menunggu Verifikasi').length;
  const approvedCount = requests.filter((r) => r.status === 'Disetujui').length;

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
            <ArrowLeftRight size={13} />
            <span>DIVISI KEPEMILIKAN & NOTARIAT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">{subtitle}</p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2.5">
          <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <div className="text-[10px] font-bold uppercase text-amber-800">Menunggu</div>
            <div className="text-lg font-black text-amber-900">{pendingCount}</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-[10px] font-bold uppercase text-emerald-800">Disetujui</div>
            <div className="text-lg font-black text-emerald-900">{approvedCount}</div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Type tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('sale')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === 'sale'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Penjualan / Buyback ({requests.filter((r) => r.type === 'sale').length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('inheritance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === 'inheritance'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pewarisan / Ahli Waris ({requests.filter((r) => r.type === 'inheritance').length})
          </button>
        </div>

        {/* Search & Status select */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari investor, ID, ahli waris..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="semua">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Diproses Notaris">Diproses Notaris</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Tidak ada permohonan pengalihan atau pewarisan saham yang cocok dengan filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left: Request details */}
                <div className="space-y-2.5 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        req.type === 'sale'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {req.type === 'sale' ? 'Jual Saham / Buyback' : 'Pewarisan ke Ahli Waris'}
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-700">
                      #{req.id}
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {req.createdAt}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                        req.status === 'Disetujui'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'Ditolak'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          req.status === 'Disetujui'
                            ? 'bg-emerald-500'
                            : req.status === 'Ditolak'
                            ? 'bg-rose-500'
                            : 'bg-amber-500 animate-pulse'
                        }`}
                      />
                      {req.status}
                    </span>
                  </div>

                  {/* Investor info */}
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      {req.investorName}
                      <span className="text-xs font-normal text-slate-500 ml-2">
                        ({req.investorPhone} · {req.investorEmail})
                      </span>
                    </h4>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">
                      Jumlah Unit: {req.units} Unit Saham · Nilai Nominal: Rp{' '}
                      {req.totalValue.toLocaleString('id-ID')}
                    </div>
                  </div>

                  {/* Specific information */}
                  {req.type === 'sale' ? (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                      <div>
                        <strong>Rekening Pencairan:</strong> {req.bankName} No.{' '}
                        <strong className="font-mono">{req.bankAccount}</strong> a.n.{' '}
                        <strong>{req.bankAccountName}</strong>
                      </div>
                      {req.saleReason && (
                        <div className="text-slate-500">
                          <strong>Alasan Jual:</strong> &ldquo;{req.saleReason}&rdquo;
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                      <div>
                        <strong>Ahli Waris Penerima:</strong> {req.heirName} ({req.heirRelationship})
                        · NIK: <strong className="font-mono">{req.heirNik}</strong>
                      </div>
                      <div>
                        <strong>Kontak Ahli Waris:</strong> {req.heirPhone}{' '}
                        {req.heirEmail ? `· ${req.heirEmail}` : ''}
                      </div>
                      {req.legalDocNumber && (
                        <div>
                          <strong>Dokumen Legalitas:</strong> {req.legalDocNumber}
                        </div>
                      )}
                      {req.inheritanceNotes && (
                        <div className="text-slate-500">
                          <strong>Amanah / Catatan:</strong> &ldquo;{req.inheritanceNotes}&rdquo;
                        </div>
                      )}
                    </div>
                  )}

                  {req.adminNotes && (
                    <div className="text-[11.5px] text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                      <strong>Catatan Super Admin:</strong> {req.adminNotes}
                    </div>
                  )}
                </div>

                {/* Right: Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isProcessing || req.status === 'Disetujui'}
                      onClick={() => handleUpdateStatus(req.id, 'Disetujui')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Setujui</span>
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing || req.status === 'Ditolak'}
                      onClick={() => handleUpdateStatus(req.id, 'Ditolak')}
                      className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>Tolak</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400 text-right">
                    Tercatat otomatis di Audit Log
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
