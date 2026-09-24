import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BarChart3, Calendar, CheckCircle2, FileText, RefreshCw, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FinancialManagementViewProps {
  initialSubTab?: 'ringkasan' | 'periode' | 'kpi';
}

type PeriodRow = {
  id: string;
  period_type: string;
  fiscal_year: number;
  period_index: number;
  starts_on: string;
  ends_on: string;
  status: string;
};

type ReportRow = {
  id: string;
  financial_period_id: string;
  title: string;
  summary: string | null;
  status: string;
  visibility: string;
  current_version_id: string | null;
  published_version_id: string | null;
  updated_at: string;
};

type LineItem = {
  id: string;
  financial_report_version_id: string;
  statement: string;
  category: string;
  line_key: string;
  label: string;
  amount: number;
  currency: string;
  position: number;
  note?: string | null;
};

type Kpi = {
  id: string;
  financial_report_version_id: string;
  kpi_key: string;
  label: string;
  value: number;
  unit: string;
  basis: string;
  position: number;
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));

export const FinancialManagementView: React.FC<FinancialManagementViewProps> = ({ initialSubTab = 'ringkasan' }) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'periode' | 'kpi'>(initialSubTab);
  const [periods, setPeriods] = useState<PeriodRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [draftItems, setDraftItems] = useState<Array<{statement:string;category:string;line_key:string;label:string;amount:string;note:string}>>([]);

  const load = async () => {
    if (!supabase) {
      setError('Supabase production belum terhubung.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const [periodResult, reportResult, itemResult, kpiResult] = await Promise.all([
      supabase.from('financial_periods').select('id,period_type,fiscal_year,period_index,starts_on,ends_on,status').order('starts_on', { ascending: false }),
      supabase.from('financial_reports').select('id,financial_period_id,title,summary,status,visibility,current_version_id,published_version_id,updated_at').order('updated_at', { ascending: false }),
      supabase.from('financial_line_items').select('id,financial_report_version_id,statement,category,line_key,label,amount,currency,position,note').order('position'),
      supabase.from('financial_kpis').select('id,financial_report_version_id,kpi_key,label,value,unit,basis,position').order('position'),
    ]);
    const firstError = periodResult.error || reportResult.error || itemResult.error || kpiResult.error;
    if (firstError) {
      setError(firstError.message);
    } else {
      setPeriods((periodResult.data || []) as PeriodRow[]);
      setReports((reportResult.data || []) as ReportRow[]);
      setLineItems((itemResult.data || []).map((x: any) => ({ ...x, amount: Number(x.amount || 0) })) as LineItem[]);
      setKpis((kpiResult.data || []).map((x: any) => ({ ...x, value: Number(x.value || 0) })) as Kpi[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
    if (!supabase) return;
    const channel = supabase
      .channel('admin-financial-management-production')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_periods' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_reports' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_report_versions' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_line_items' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_kpis' }, () => void load())
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, []);

  const currentReport = reports[0] || null;
  const currentVersionId = currentReport?.current_version_id || null;
  const currentItems = useMemo(
    () => lineItems.filter((item) => item.financial_report_version_id === currentVersionId),
    [lineItems, currentVersionId],
  );
  const currentKpis = useMemo(
    () => kpis.filter((item) => item.financial_report_version_id === currentVersionId),
    [kpis, currentVersionId],
  );

  const balanceCheck = useMemo(() => {
    const balanceItems = currentItems.filter((item) => item.statement === 'balance');
    const assets = balanceItems.filter((item) => item.category === 'asset').reduce((sum, item) => sum + item.amount, 0);
    const liabilities = balanceItems.filter((item) => item.category === 'liability').reduce((sum, item) => sum + item.amount, 0);
    const equity = balanceItems.filter((item) => item.category === 'equity').reduce((sum, item) => sum + item.amount, 0);
    const difference = assets - liabilities - equity;
    return { assets, liabilities, equity, difference, hasData: balanceItems.length > 0, balanced: balanceItems.length > 0 && Math.abs(difference) < 1 };
  }, [currentItems]);

  const previousReport = useMemo(() => {
    if (!currentReport) return null;
    const currentPeriod = periods.find((period) => period.id === currentReport.financial_period_id);
    if (!currentPeriod) return null;
    const previousPeriod = periods
      .filter((period) => new Date(period.ends_on).getTime() < new Date(currentPeriod.starts_on).getTime())
      .sort((left, right) => new Date(right.ends_on).getTime() - new Date(left.ends_on).getTime())[0];
    return previousPeriod
      ? reports.find((report) => report.financial_period_id === previousPeriod.id && report.status === 'published') || null
      : null;
  }, [currentReport, periods, reports]);

  useEffect(() => {
    if (!currentReport || currentReport.status !== 'draft') {
      setDraftItems([]);
      return;
    }
    setDraftItems(currentItems.map((item) => ({
      statement: item.statement,
      category: item.category,
      line_key: item.line_key,
      label: item.label,
      amount: String(item.amount),
      note: item.note || '',
    })));
  }, [currentReport?.id, currentReport?.status, currentVersionId, lineItems]);

  const addDraftItem = () => setDraftItems((prev) => [...prev, {
    statement: 'balance', category: 'asset', line_key: '', label: '', amount: '', note: '',
  }]);

  const saveDraftItems = async () => {
    if (!supabase || !currentReport || currentReport.status !== 'draft') return;
    if (draftItems.some((item) => !item.line_key.trim() || !item.label.trim() || item.amount.trim() === '' || !Number.isFinite(Number(item.amount)))) {
      setMessage('Lengkapi kode akun, nama akun, dan nominal yang valid pada seluruh baris.');
      return;
    }
    setSaving(true); setMessage(null);
    const payload = draftItems.map((item, position) => ({
      statement: item.statement,
      category: item.category,
      line_key: item.line_key.trim(),
      label: item.label.trim(),
      amount: Number(item.amount),
      currency: 'IDR',
      position,
      note: item.note.trim() || null,
    }));
    const { error: saveError } = await supabase.schema('app').rpc('save_financial_report_draft_content', {
      p_report_id: currentReport.id,
      p_document_asset_id: null,
      p_line_items: payload,
      p_kpis: currentKpis.map((kpi) => ({
        kpi_key: kpi.kpi_key, label: kpi.label, value: kpi.value, unit: kpi.unit, basis: kpi.basis, position: kpi.position,
      })),
    });
    if (saveError) setMessage(saveError.message);
    else { setMessage('Line item laporan berhasil disimpan ke draft production.'); await load(); }
    setSaving(false);
  };

  const statementGroups = useMemo(() => {
    const groups = new Map<string, LineItem[]>();
    currentItems.forEach((item) => groups.set(item.statement, [...(groups.get(item.statement) || []), item]));
    return [...groups.entries()];
  }, [currentItems]);

  const tabs = [
    { id: 'ringkasan' as const, label: 'Laporan Keuangan', icon: TrendingUp },
    { id: 'periode' as const, label: 'Periode & Status', icon: Calendar },
    { id: 'kpi' as const, label: 'KPI Terlapor', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">Laporan & Manajemen Keuangan Perseroan</h3>
            <p className="text-xs text-slate-500">
              Seluruh angka pada layar ini dibaca dari tabel keuangan production. Tidak ada angka contoh atau simulasi.
            </p>
          </div>
          <button type="button" onClick={() => void load()} disabled={loading} className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 disabled:opacity-50">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sinkronkan
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => setActiveTab(id)} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${activeTab === id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {activeTab === 'ringkasan' && (
        <div className="space-y-5">
          {!currentReport ? (
            <Empty title="Belum ada laporan keuangan production" text="Buat laporan melalui modul Laporan Keuangan. Dashboard tidak akan menampilkan angka sebelum data production tersedia." />
          ) : (
            <>
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Laporan terkini</div>
                    <h4 className="text-base font-black text-slate-900 mt-1">{currentReport.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{currentReport.summary || 'Belum ada ringkasan.'}</p>
                  </div>
                  <span className="self-start px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-black uppercase">{currentReport.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className={`p-5 rounded-3xl border ${balanceCheck.balanced ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="text-xs font-black text-slate-900">Validasi Persamaan Akuntansi</div>
                  {!balanceCheck.hasData ? (
                    <p className="text-xs text-slate-600 mt-2">Belum ada line item Posisi Keuangan.</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-2 mt-3 text-[10px]">
                        <div><div className="text-slate-500">Aset</div><div className="font-bold">{formatRupiah(balanceCheck.assets)}</div></div>
                        <div><div className="text-slate-500">Liabilitas</div><div className="font-bold">{formatRupiah(balanceCheck.liabilities)}</div></div>
                        <div><div className="text-slate-500">Ekuitas</div><div className="font-bold">{formatRupiah(balanceCheck.equity)}</div></div>
                      </div>
                      <div className="mt-3 text-xs font-bold">
                        {balanceCheck.balanced ? '✓ Seimbang: Aset = Liabilitas + Ekuitas' : `Belum seimbang. Selisih: ${formatRupiah(balanceCheck.difference)}`}
                      </div>
                    </>
                  )}
                </div>
                <div className="p-5 rounded-3xl border border-slate-200 bg-white">
                  <div className="text-xs font-black text-slate-900">Informasi Komparatif</div>
                  <p className="text-xs text-slate-500 mt-2">
                    {previousReport
                      ? `Pembanding published terdekat: ${previousReport.title}. Angka komparatif hanya boleh berasal dari versi published periode tersebut.`
                      : 'Belum ada laporan periode sebelumnya berstatus published yang dapat dijadikan pembanding.'}
                  </p>
                </div>
              </div>

              {currentReport.status === 'draft' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Editor Line Item Laporan</h4>
                      <p className="text-xs text-slate-500 mt-1">Input hanya angka pembukuan yang dapat ditelusuri. Data disimpan ke financial_line_items production.</p>
                    </div>
                    <button type="button" onClick={addDraftItem} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">+ Tambah Akun</button>
                  </div>
                  {message && <div className="p-3 rounded-xl bg-slate-50 border text-xs font-semibold text-slate-700">{message}</div>}
                  {draftItems.length === 0 ? <div className="text-xs text-slate-500">Belum ada akun. Tambahkan akun sesuai buku besar/periode laporan.</div> : (
                    <div className="space-y-2">
                      {draftItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                          <select value={item.statement} onChange={(e) => setDraftItems((p) => p.map((x,i)=>i===index?{...x,statement:e.target.value,category:e.target.value==='income'?'revenue':e.target.value==='cash_flow'?'operating':'asset'}:x))} className="md:col-span-2 border rounded-lg px-2 py-2 text-xs bg-white"><option value="balance">Posisi Keuangan</option><option value="income">Laba Rugi</option><option value="cash_flow">Arus Kas</option></select>
                          <select value={item.category} onChange={(e) => setDraftItems((p)=>p.map((x,i)=>i===index?{...x,category:e.target.value}:x))} className="md:col-span-2 border rounded-lg px-2 py-2 text-xs bg-white">
                            {(item.statement==='balance'?['asset','liability','equity']:item.statement==='income'?['revenue','expense']:['operating','investing','financing']).map(v=><option key={v} value={v}>{v}</option>)}
                          </select>
                          <input value={item.line_key} onChange={(e)=>setDraftItems((p)=>p.map((x,i)=>i===index?{...x,line_key:e.target.value}:x))} placeholder="Kode akun" className="md:col-span-2 border rounded-lg px-2 py-2 text-xs"/>
                          <input value={item.label} onChange={(e)=>setDraftItems((p)=>p.map((x,i)=>i===index?{...x,label:e.target.value}:x))} placeholder="Nama akun" className="md:col-span-3 border rounded-lg px-2 py-2 text-xs"/>
                          <input type="number" value={item.amount} onChange={(e)=>setDraftItems((p)=>p.map((x,i)=>i===index?{...x,amount:e.target.value}:x))} placeholder="Nominal IDR" className="md:col-span-2 border rounded-lg px-2 py-2 text-xs"/>
                          <button type="button" onClick={()=>setDraftItems((p)=>p.filter((_,i)=>i!==index))} className="md:col-span-1 text-rose-600 font-bold text-xs">Hapus</button>
                          <input value={item.note} onChange={(e)=>setDraftItems((p)=>p.map((x,i)=>i===index?{...x,note:e.target.value}:x))} placeholder="Catatan akun / referensi CALK (opsional)" className="md:col-span-12 border rounded-lg px-2 py-2 text-xs"/>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button type="button" disabled={saving} onClick={()=>void saveDraftItems()} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-50">{saving?'Menyimpan...':'Simpan Line Item Production'}</button>
                  </div>
                </div>
              )}

              {currentItems.length === 0 ? (
                <Empty title="Belum ada line item laporan" text="Laporan sudah tercatat, tetapi angka Posisi Keuangan, Laba Rugi, Perubahan Ekuitas, dan Arus Kas belum diinput ke financial_line_items. Sistem tidak membuat angka pengganti." />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {statementGroups.map(([statement, items]) => (
                    <div key={statement} className="bg-white p-6 rounded-3xl border border-slate-200">
                      <h4 className="text-sm font-black text-slate-900 mb-4">{statement.replaceAll('_', ' ').toUpperCase()}</h4>
                      <div className="divide-y divide-slate-100">
                        {items.map((item) => (
                          <div key={item.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
                            <div><div className="font-semibold text-slate-800">{item.label}</div>{item.note && <div className="text-[10px] text-slate-400">{item.note}</div>}</div>
                            <div className="font-mono font-bold text-slate-900 whitespace-nowrap">{formatRupiah(item.amount)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'periode' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
          <div className="pb-4 border-b border-slate-100">
            <h4 className="text-base font-black text-slate-900">Periode Keuangan Production</h4>
            <p className="text-xs text-slate-500 mt-1">Status periode ditampilkan apa adanya dari database; dashboard tidak melakukan closing palsu.</p>
          </div>
          {periods.length === 0 ? <Empty title="Belum ada periode" text="Buat periode keuangan sebelum menyusun laporan." /> : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead><tr className="bg-slate-50 text-[10px] uppercase text-slate-500"><th className="p-3">Periode</th><th className="p-3">Rentang</th><th className="p-3">Status</th><th className="p-3">Laporan</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {periods.map((period) => {
                    const report = reports.find((x) => x.financial_period_id === period.id);
                    return <tr key={period.id}>
                      <td className="p-3 font-bold text-slate-900">{period.period_type} {period.fiscal_year} · #{period.period_index}</td>
                      <td className="p-3 text-slate-600">{formatDate(period.starts_on)} – {formatDate(period.ends_on)}</td>
                      <td className="p-3"><span className="px-2 py-1 rounded-lg bg-slate-100 font-bold uppercase text-[10px]">{period.status}</span></td>
                      <td className="p-3">{report ? <div><div className="font-semibold">{report.title}</div><div className="text-[10px] text-slate-400">{report.status}</div></div> : <span className="text-slate-400">Belum ada</span>}</td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'kpi' && (
        <div>
          {!currentReport || currentKpis.length === 0 ? (
            <Empty title="Belum ada KPI terlapor" text="KPI hanya ditampilkan jika sudah tersimpan pada financial_kpis untuk versi laporan yang aktif. Target, yield, margin, atau rasio tidak dibuat otomatis." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentKpis.map((kpi) => (
                <div key={kpi.id} className="bg-white p-5 rounded-3xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{kpi.label}</div>
                  <div className="text-2xl font-black text-slate-900 mt-2">{new Intl.NumberFormat('id-ID').format(kpi.value)} {kpi.unit}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Basis: {kpi.basis}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Empty: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center">
    <FileText size={24} className="mx-auto text-slate-400 mb-2" />
    <div className="text-sm font-bold text-slate-800">{title}</div>
    <p className="text-xs text-slate-500 mt-1 max-w-2xl mx-auto">{text}</p>
  </div>
);
