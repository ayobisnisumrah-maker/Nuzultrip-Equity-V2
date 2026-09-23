import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { realtimeStore, AuditLogItem } from '../../services/realtimeStore';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>(realtimeStore.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    const sync = () => {
      setLogs(realtimeStore.getAuditLogs());
    };
    const unsub = realtimeStore.subscribe(sync);
    return () => unsub();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesCategory =
      categoryFilter === 'ALL' || log.category === categoryFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
            <ScrollText size={13} />
            <span>SISTEM KEAMANAN & AKUNTABILITAS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Audit Log & Rekam Jejak Sistem
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Merekam seluruh aktivitas penting mulai dari pengajuan buyback, pelimpahan waris, transaksi kasir, dividen payout, hingga perubahan konten CMS portal investor.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-right">
          <div className="text-[10px] font-bold uppercase text-slate-400">Total Peristiwa</div>
          <div className="text-lg font-black text-slate-900">{logs.length} Log</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {['ALL', 'KEPEMILIKAN', 'PORTAL', 'KEUANGAN', 'AUTH'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktivitas atau pengguna..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Waktu & Tanggal</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Aktivitas / Aksi</th>
                <th className="py-3 px-4">Pengguna / Subjek</th>
                <th className="py-3 px-4">Detail Peristiwa</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.action}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{log.user}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">{log.details}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : log.status === 'warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : log.status === 'error'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
