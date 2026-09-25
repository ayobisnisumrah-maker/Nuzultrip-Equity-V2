import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BarChart3, Calendar, CheckCircle2, FileText, RefreshCw, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadPublicPdf } from '../../services/documentService';

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

type ReportVersion = {
  id: string;
  financial_report_id: string;
  status: string;
  structured_content: Record<string, string> | null;
  document_asset_id: string | null;
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
  const [versions, setVersions] = useState<ReportVersion[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [publishedDocumentAssetIds, setPublishedDocumentAssetIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [draftItems, setDraftItems] = useState<Array<{statement:string;category:string;line_key:string;label:string;amount:string;note:string}>>([]);
  const [calkDraft, setCalkDraft] = useState('');

  const load = async () => {
    if (!supabase) {
      setError('Supabase production belum terhubung.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const [periodResult, reportResult, versionResult, itemResult, kpiResult, documentResult] = await Promise.all([
      supabase.from('financial_periods').select('id,period_type,fiscal_year,period_index,starts_on,ends_on,status').order('starts_on', { ascending: false }),
      supabase.from('financial_reports').select('id,financial_period_id,title,summary,status,visibility,current_version_id,published_version_id,updated_at').order('updated_at', { ascending: false }),
      supabase.from('financial_report_versions').select('id,financial_report_id,status,structured_content,document_asset_id'),
      supabase.from('financial_line_items').select('id,financial_report_version_id,statement,category,line_key,label,amount,currency,position,note').order('position'),
      supabase.from('financial_kpis').select('id,financial_report_version_id,kpi_key,label,value,unit,basis,position').order('position'),
      supabase.from('documents').select('published_version:document_versions!documents_published_version_id_fkey(file_asset_id)').eq('visibility','public').eq('status','published').eq('kind','investor_report'),
    ]);
    const firstError = periodResult.error || reportResult.error || versionResult.error || itemResult.error || kpiResult.error || documentResult.error;
    if (firstError) {
      setError(firstError.message);
    } else {
      setPeriods((periodResult.data || []) as PeriodRow[]);
      setReports((reportResult.data || []) as ReportRow[]);
      setVersions((versionResult.data || []) as ReportVersion[]);
      setLineItems((itemResult.data || []).map((x: any) => ({ ...x, amount: Number(x.amount || 0) })) as LineItem[]);
      setKpis((kpiResult.data || []).map((x: any) => ({ ...x, value: Number(x.value || 0) })) as Kpi[]);
      setPublishedDocumentAssetIds(new Set((documentResult.data || []).map((d: any) => d.published_version?.file_asset_id).filter(Boolean)));
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

  const currentVersion = useMemo(
    () => versions.find((version) => version.id === currentVersionId) || null,
    [versions, currentVersionId],
  );

  const tocSections = useMemo(() => {
    const content = currentVersion?.structured_content || {};
    return [
      ['executive_summary', 'Ringkasan Eksekutif'],
      ['company_information', 'Profil & Informasi Perusahaan'],
      ['performance_overview', 'Ikhtisar Kinerja Periode'],
      ['financial_position', 'Laporan Posisi Keuangan'],
      ['profit_loss_comprehensive', 'Laporan Laba Rugi & Penghasilan Komprehensif'],
      ['changes_in_equity', 'Laporan Perubahan Ekuitas'],
      ['cash_flows', 'Laporan Arus Kas'],
      ['notes_to_financial_statements', 'Catatan atas Laporan Keuangan (CALK)'],
      ['material_events', 'Risiko & Peristiwa Material'],
      ['management_follow_up', 'Rencana / Tindak Lanjut Manajemen'],
      ['approval', 'Pengesahan Laporan'],
    ].map(([key, label]) => ({ key, label, complete: Boolean(String(content[key] || '').trim()) }));
  }, [currentVersion]);

  const officialPdfPublished = Boolean(currentVersion?.document_asset_id && publishedDocumentAssetIds.has(currentVersion.document_asset_id));

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
    setCalkDraft(String(currentVersion?.structured_content?.notes_to_financial_statements || ''));
  }, [currentVersion?.id, currentVersion?.structured_content]);

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

  const saveCalk = async () => {
    if (!supabase || !currentReport || !currentVersion || currentReport.status !== 'draft') return;
    setSaving(true); setMessage(null);
    const nextContent = { ...(currentVersion.structured_content || {}), notes_to_financial_statements: calkDraft.trim() };
    const { error: saveError } = await supabase
      .from('financial_report_versions')
      .update({ structured_content: nextContent })
      .eq('id', currentVersion.id)
      .eq('status', 'draft');
    if (saveError) setMessage(saveError.message);
    else { setMessage('CALK tersimpan pada draft laporan production.'); await load(); }
    setSaving(false);
  };

  const uploadOfficialPdf = async (file: File) => {
    if (!currentReport || !currentVersion) return;
    if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
      setMessage('File laporan resmi wajib PDF.');
      return;
    }
    if (!tocSections.every((section) => section.complete) || !balanceCheck.balanced) {
      setMessage('PDF belum dapat didaftarkan: daftar isi wajib lengkap dan neraca harus seimbang.');
      return;
    }
    setUploadingPdf(true); setMessage(null);
    try {
      const uploaded = await uploadPublicPdf(file, {
        title: currentReport.title,
        summary: currentReport.summary || 'Laporan keuangan resmi untuk investor.',
        kind: 'investor_report',
      });
      const { error: linkError } = await supabase
        .from('financial_report_versions')
        .update({ document_asset_id: uploaded.assetId })
        .eq('id', currentVersion.id)
        .eq('status', 'draft');
      if (linkError) throw linkError;
      setMessage('PDF berhasil masuk Dokumen Portal sebagai Draft dan terhubung ke versi laporan keuangan. Admin Dokumen wajib menjalankan Review → Approved → Published sebelum tersedia untuk investor.');
      await load();
    } catch (uploadError) {
      setMessage(uploadError instanceof Error ? uploadError.message : 'Upload PDF laporan gagal.');
    } finally {
      setUploadingPdf(false);
    }
  };

  const printOfficialReport = () => {
    if (!currentReport || !currentVersion) return;
    const period = periods.find((p) => p.id === currentReport.financial_period_id);
    const content = currentVersion.structured_content || {};
    const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch] || ch));
    const sectionHtml = tocSections.map((section, index) => `
      <section><h2>${index + 1}. ${escapeHtml(section.label)}</h2><p>${escapeHtml(content[section.key] || '').replace(/\n/g,'<br>')}</p></section>`).join('');
    const rows = currentItems.map((item) => `<tr><td>${escapeHtml(item.line_key)}</td><td>${escapeHtml(item.label)}</td><td>${escapeHtml(item.statement)}</td><td class="num">${escapeHtml(formatRupiah(item.amount))}</td><td>${escapeHtml(item.note || '')}</td></tr>`).join('');
    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) { setMessage('Browser memblokir jendela cetak. Izinkan pop-up untuk membuat PDF.'); return; }
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(currentReport.title)}</title><style>
      @page{size:A4;margin:18mm 16mm} body{font-family:Arial,sans-serif;color:#111827;font-size:11px;line-height:1.55} h1{font-size:26px;margin:0 0 8px} h2{font-size:15px;margin:26px 0 8px;break-after:avoid} .cover{min-height:245mm;display:flex;flex-direction:column;justify-content:center;page-break-after:always}.muted{color:#64748b}.toc{page-break-after:always}.toc div{display:flex;justify-content:space-between;border-bottom:1px dotted #cbd5e1;padding:6px 0} table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border-bottom:1px solid #e2e8f0;padding:6px;text-align:left;vertical-align:top}.num{text-align:right;white-space:nowrap}section{break-inside:avoid} .footer{margin-top:30px;color:#64748b;font-size:9px}
    </style></head><body>
      <div class="cover"><div class="muted">NUZULTRIP EQUITY</div><h1>${escapeHtml(currentReport.title)}</h1><p>${escapeHtml(currentReport.summary || '')}</p><p class="muted">Periode: ${escapeHtml(period ? `${formatDate(period.starts_on)} – ${formatDate(period.ends_on)}` : '-')}</p><p class="muted">Status: ${escapeHtml(currentReport.status.toUpperCase())}</p></div>
      <div class="toc"><h1>Daftar Isi</h1>${tocSections.map((s,i)=>`<div><span>${i+1}. ${escapeHtml(s.label)}</span><span>${s.complete?'Lengkap':'Belum Lengkap'}</span></div>`).join('')}</div>
      ${sectionHtml}
      <section><h2>Lampiran — Line Item Laporan Keuangan</h2><table><thead><tr><th>Kode</th><th>Akun</th><th>Laporan</th><th>Nominal</th><th>Catatan/CALK</th></tr></thead><tbody>${rows}</tbody></table></section>
      <div class="footer">Dokumen ini dihasilkan dari data laporan production. Gunakan dialog Print → Save as PDF untuk membuat berkas PDF resmi.</div>
      <script>window.onload=()=>window.print()</script></body></html>`);
    win.document.close();
  };

  const transitionReport = async (target: 'review' | 'approved' | 'published') => {
    if (!supabase || !currentReport) return;
    if (target === 'published' && !officialPdfPublished) {
      setMessage('Laporan belum dapat dipublikasikan: PDF resmi yang terhubung harus sudah Published melalui workflow Dokumen Portal.');
      return;
    }
    if (target === 'review' && (!tocSections.every((x) => x.complete) || !balanceCheck.balanced || !currentItems.some((x) => x.statement === 'income') || !currentItems.some((x) => x.statement === 'cash_flow'))) {
      setMessage('Laporan belum siap direview: seluruh daftar isi wajib lengkap, neraca harus seimbang, serta Laba Rugi dan Arus Kas harus memiliki line item.');
      return;
    }
    setTransitioning(true); setMessage(null);
    const { error: transitionError } = await supabase.schema('app').rpc('transition_financial_report', {
      p_report_id: currentReport.id,
      p_target: target,
    });
    if (transitionError) setMessage(transitionError.message);
    else { setMessage(`Status laporan berhasil diubah menjadi ${target}.`); await load(); }
    setTransitioning(false);
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
              <div className="bg-white p-5 rounded-3xl border border-slate-200">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="text-xs font-black text-slate-900">Daftar Isi & Kelengkapan Laporan</div>
                    <p className="text-xs text-slate-500 mt-1">Urutan ini menjadi struktur dokumen resmi. Bagian kosong ditandai sebelum laporan dilanjutkan.</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${tocSections.every((x)=>x.complete)?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>
                    {tocSections.filter((x)=>x.complete).length}/{tocSections.length} lengkap
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tocSections.map((section,index)=>(
                    <div key={section.key} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-700">{index+1}. {section.label}</span>
                      <span className={section.complete?'text-emerald-700 font-bold':'text-amber-700 font-bold'}>{section.complete?'Lengkap':'Belum Lengkap'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {currentReport.status === 'draft' && (
                <div className="bg-white p-5 rounded-3xl border border-slate-200">
                  <div className="mb-3">
                    <div className="text-xs font-black text-slate-900">Catatan atas Laporan Keuangan (CALK)</div>
                    <p className="text-xs text-slate-500 mt-1">Isi kebijakan akuntansi, rincian akun material, estimasi/pertimbangan, komitmen, kontinjensi, transaksi pihak berelasi, dan informasi lain yang memang berlaku. Jangan mengisi fakta yang tidak didukung dokumen pembukuan.</p>
                  </div>
                  <textarea value={calkDraft} onChange={(e)=>setCalkDraft(e.target.value)} rows={8} placeholder="Masukkan CALK berdasarkan data dan dokumen perusahaan..." className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-200"/>
                  <div className="mt-3 flex justify-end">
                    <button type="button" disabled={saving} onClick={()=>void saveCalk()} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold disabled:opacity-50">{saving?'Menyimpan...':'Simpan CALK Production'}</button>
                  </div>
                </div>
              )}

              <div className="bg-white p-5 rounded-3xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-slate-900">Workflow Laporan Resmi</div>
                    <p className="text-xs text-slate-500 mt-1">Draft → Review → Approved → Published. Transisi tetap diverifikasi oleh permission dan RPC production.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-2 rounded-xl text-xs font-bold ${officialPdfPublished?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{officialPdfPublished?'PDF resmi Published':'PDF resmi belum Published'}</span>
                    <button type="button" onClick={printOfficialReport} className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold">Cetak / Simpan PDF</button>
                    <label className={`px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold cursor-pointer ${uploadingPdf?'opacity-50 pointer-events-none':''}`}>
                      {uploadingPdf ? 'Mengunggah PDF...' : 'Daftarkan PDF ke Dokumen Portal'}
                      <input type="file" accept="application/pdf,.pdf" className="hidden" disabled={uploadingPdf} onChange={(e)=>{const file=e.target.files?.[0]; if(file) void uploadOfficialPdf(file); e.currentTarget.value='';}}/>
                    </label>
                    {currentReport.status === 'draft' && <button type="button" disabled={transitioning} onClick={()=>void transitionReport('review')} className="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold disabled:opacity-50">Kirim ke Review</button>}
                    {currentReport.status === 'review' && <button type="button" disabled={transitioning} onClick={()=>void transitionReport('approved')} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold disabled:opacity-50">Setujui Laporan</button>}
                    {currentReport.status === 'approved' && <button type="button" disabled={transitioning || !officialPdfPublished} onClick={()=>void transitionReport('published')} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-50">Publish ke Investor</button>}
                    {currentReport.status === 'published' && <span className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold">✓ Published</span>}
                  </div>
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
