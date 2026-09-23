import React, { useEffect, useState } from 'react';
import { FileText, Upload, RefreshCw } from 'lucide-react';
import { listPublicPortalDocuments, uploadPublicPdf } from '../../services/documentService';
import { appSchema } from '../../lib/supabase';

type Doc = Awaited<ReturnType<typeof listPublicPortalDocuments>>[number];

export function PublicDocumentManager() {
  const [docs,setDocs]=useState<Doc[]>([]), [file,setFile]=useState<File|null>(null);
  const [title,setTitle]=useState(''), [summary,setSummary]=useState('');
  const [kind,setKind]=useState<'investment_proposal'|'pitch_deck'|'investor_report'|'business_update'|'supporting'>('investment_proposal');
  const [busy,setBusy]=useState(false), [message,setMessage]=useState<string|null>(null);
  const refresh=()=>listPublicPortalDocuments().then(setDocs).catch(e=>setMessage(e.message));
  useEffect(()=>{refresh()},[]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault(); if(!file)return; setBusy(true);setMessage(null);try{await uploadPublicPdf(file,{title,summary,kind});setFile(null);setTitle('');setSummary('');setMessage('PDF berhasil diunggah sebagai draft. Lanjutkan review dan publish.');await refresh()}catch(e){setMessage(e instanceof Error?e.message:'Upload gagal')}finally{setBusy(false)}};
  const transition=async(id:string,target:'review'|'approved'|'published'|'archived')=>{if(!appSchema)return;setBusy(true);try{const {error}=await appSchema.rpc('transition_document_publication',{p_document_id:id,p_target:target});if(error)throw error;await refresh();setMessage('Status dokumen diperbarui.')}catch(e){setMessage(e instanceof Error?e.message:'Workflow gagal')}finally{setBusy(false)}};
  return <div className="space-y-5">
    <form onSubmit={submit} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
      <div><h3 className="font-black text-slate-900">Dokumen PDF untuk Calon Investor</h3><p className="text-xs text-slate-500">Hanya PDF yang diunggah Admin Dokumen dan berstatus published yang dapat diunduh dari portal publik.</p></div>
      {message&&<div className="p-3 rounded-xl bg-slate-50 border text-xs font-semibold">{message}</div>}
      <div className="grid md:grid-cols-2 gap-3">
        <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Judul dokumen" className="border rounded-xl px-3 py-2.5 text-sm"/>
        <select value={kind} onChange={e=>setKind(e.target.value as any)} className="border rounded-xl px-3 py-2.5 text-sm"><option value="investment_proposal">Proposal Investasi</option><option value="pitch_deck">Pitch Deck</option><option value="investor_report">Laporan Investor</option><option value="business_update">Business Update</option><option value="supporting">Dokumen Pendukung</option></select>
      </div>
      <textarea value={summary} onChange={e=>setSummary(e.target.value)} placeholder="Ringkasan" className="w-full border rounded-xl px-3 py-2.5 text-sm"/>
      <input required type="file" accept="application/pdf,.pdf" onChange={e=>setFile(e.target.files?.[0]||null)} className="text-sm"/>
      <button disabled={busy||!file} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex gap-2 items-center disabled:opacity-50"><Upload size={14}/>Upload PDF sebagai Draft</button>
    </form>
    <div className="bg-white p-6 rounded-3xl border border-slate-200">
      <div className="flex justify-between mb-4"><h4 className="font-bold">Dokumen Publik Terbit</h4><button onClick={refresh}><RefreshCw size={15}/></button></div>
      {docs.length===0?<p className="text-xs text-slate-500">Belum ada PDF published.</p>:docs.map(d=><div key={d.id} className="py-3 border-t flex justify-between gap-3"><div className="flex gap-3"><FileText size={18}/><div><div className="text-xs font-bold">{d.title}</div><div className="text-[11px] text-slate-500">{d.fileName}</div></div></div><button disabled={busy} onClick={()=>transition(d.id,'archived')} className="text-xs font-bold text-rose-600">Arsipkan</button></div>)}
    </div>
  </div>;
}
