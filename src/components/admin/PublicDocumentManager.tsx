import React, { useEffect, useState } from 'react';
import { FileText, Upload, RefreshCw, Download } from 'lucide-react';
import { getPublicDocumentDownload, listAdminDocuments, transitionAdminDocument, uploadPublicPdf, type AdminDocument } from '../../services/documentService';

export function PublicDocumentManager() {
  const [docs,setDocs]=useState<AdminDocument[]>([]),[file,setFile]=useState<File|null>(null);
  const [title,setTitle]=useState(''),[summary,setSummary]=useState('');
  const [kind,setKind]=useState<'investment_proposal'|'pitch_deck'|'investor_report'|'business_update'|'supporting'>('investment_proposal');
  const [busy,setBusy]=useState(false),[message,setMessage]=useState<string|null>(null);
  const refresh=async()=>{try{setDocs(await listAdminDocuments())}catch(e){setMessage(e instanceof Error?e.message:'Gagal memuat dokumen')}};
  useEffect(()=>{void refresh()},[]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!file)return;setBusy(true);setMessage(null);try{await uploadPublicPdf(file,{title,summary,kind});setFile(null);setTitle('');setSummary('');setMessage('PDF berhasil diunggah sebagai draft.');await refresh()}catch(e){setMessage(e instanceof Error?e.message:'Upload gagal')}finally{setBusy(false)}};
  const move=async(d:AdminDocument,target:'draft'|'review'|'approved'|'published'|'archived')=>{setBusy(true);setMessage(null);try{await transitionAdminDocument(d.id,target);setMessage(`${d.title}: status menjadi ${target}.`);await refresh()}catch(e){setMessage(e instanceof Error?e.message:'Workflow gagal')}finally{setBusy(false)}};
  const download=async(d:AdminDocument)=>{try{const x=await getPublicDocumentDownload(d.id);window.open(x.url,'_blank','noopener,noreferrer')}catch(e){setMessage(e instanceof Error?e.message:'Download gagal')}};
  const next=(d:AdminDocument)=>{
    if(d.status==='draft')return <button onClick={()=>move(d,'review')} className="font-bold text-blue-700">Kirim Review</button>;
    if(d.status==='review')return <div className="flex gap-3"><button onClick={()=>move(d,'approved')} className="font-bold text-emerald-700">Setujui</button><button onClick={()=>move(d,'draft')} className="font-bold text-amber-700">Kembalikan</button></div>;
    if(d.status==='approved')return <div className="flex gap-3"><button onClick={()=>move(d,'published')} className="font-bold text-emerald-700">Publish</button><button onClick={()=>move(d,'draft')} className="font-bold text-amber-700">Kembalikan</button></div>;
    if(d.status==='published')return <div className="flex gap-3"><button onClick={()=>download(d)} className="font-bold text-slate-700 flex gap-1 items-center"><Download size={13}/>PDF</button><button onClick={()=>move(d,'archived')} className="font-bold text-rose-600">Arsipkan</button></div>;
    return <span className="text-slate-400 font-semibold">Arsip</span>;
  };
  return <div className="space-y-5">
    <form onSubmit={submit} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
      <div><h3 className="font-black text-slate-900">Dokumen PDF untuk Calon Investor</h3><p className="text-xs text-slate-500">PDF masuk sebagai draft. Portal hanya dapat mengunduh versi yang sudah melewati review, approval, dan publish.</p></div>
      {message&&<div className="p-3 rounded-xl bg-slate-50 border text-xs font-semibold">{message}</div>}
      <div className="grid md:grid-cols-2 gap-3"><input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Judul dokumen" className="border rounded-xl px-3 py-2.5 text-sm"/><select value={kind} onChange={e=>setKind(e.target.value as typeof kind)} className="border rounded-xl px-3 py-2.5 text-sm"><option value="investment_proposal">Proposal Investasi</option><option value="pitch_deck">Pitch Deck</option><option value="investor_report">Laporan Investor</option><option value="business_update">Business Update</option><option value="supporting">Dokumen Pendukung</option></select></div>
      <textarea value={summary} onChange={e=>setSummary(e.target.value)} placeholder="Ringkasan" className="w-full border rounded-xl px-3 py-2.5 text-sm"/>
      <input required type="file" accept="application/pdf,.pdf" onChange={e=>setFile(e.target.files?.[0]||null)} className="text-sm"/>
      <button disabled={busy||!file} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex gap-2 items-center disabled:opacity-50"><Upload size={14}/>Upload PDF sebagai Draft</button>
    </form>
    <div className="bg-white p-6 rounded-3xl border border-slate-200">
      <div className="flex justify-between mb-4"><div><h4 className="font-bold">Workflow Dokumen Portal</h4><p className="text-xs text-slate-500">Draft → Review → Approved → Published → Archived</p></div><button onClick={()=>void refresh()}><RefreshCw size={15}/></button></div>
      {docs.length===0?<p className="text-xs text-slate-500">Belum ada dokumen.</p>:<div className="divide-y">{docs.map(d=><div key={d.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3"><div className="flex gap-3"><FileText size={18}/><div><div className="text-xs font-bold">{d.title}</div><div className="text-[11px] text-slate-500">{d.fileName||'Tanpa file'} · v{d.versionNumber||1} · {new Date(d.updatedAt).toLocaleString('id-ID')}</div><span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold uppercase">{d.status}</span></div></div><div className="text-xs" aria-disabled={busy}>{next(d)}</div></div>)}</div>}
    </div>
  </div>;
}
