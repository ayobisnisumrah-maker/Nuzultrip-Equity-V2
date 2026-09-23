import { appSchema, supabase } from '../lib/supabase';

export type PortalDocument = { id:string; title:string; summary:string|null; kind:string; fileName:string; assetId:string };

export async function uploadPublicPdf(file: File, input:{title:string;summary?:string;kind:'investment_proposal'|'pitch_deck'|'investor_report'|'business_update'|'supporting'}) {
  if (!supabase || !appSchema) throw new Error('Supabase production belum terhubung.');
  if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) throw new Error('Dokumen portal wajib berupa file PDF.');
  const {data:user}=await supabase.auth.getUser(); if(!user.user) throw new Error('Sesi admin tidak valid.');
  const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'-'); const path=`public-documents/${crypto.randomUUID()}-${safe}`;
  const up=await supabase.storage.from('company-documents').upload(path,file,{contentType:'application/pdf',upsert:false}); if(up.error) throw up.error;
  try {
    const asset=await supabase.from('media_assets').insert({bucket:'company-documents',path,original_filename:file.name,mime_type:'application/pdf',byte_size:file.size,visibility:'public',uploaded_by:user.user.id,finalized_at:new Date().toISOString()}).select('id').single();
    if(asset.error) throw asset.error;
    const slug=input.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+crypto.randomUUID().slice(0,8);
    const created=await appSchema.rpc('create_document_with_draft',{p_title:input.title,p_slug:slug,p_kind:input.kind,p_summary:input.summary||null,p_visibility:'public',p_file_asset_id:asset.data.id});
    if(created.error) throw created.error;
    return created.data;
  } catch(error) { await supabase.storage.from('company-documents').remove([path]); throw error; }
}

export async function listPublicPortalDocuments():Promise<PortalDocument[]> {
  if(!supabase) return [];
  const {data,error}=await supabase.from('documents').select('id,title,summary,kind,published_version:document_versions!documents_published_version_id_fkey(file_asset:media_assets!document_versions_file_asset_id_fkey(id,original_filename,mime_type))').eq('visibility','public').eq('status','published');
  if(error) throw error;
  return (data||[]).flatMap((d:any)=>d.published_version?.file_asset?.mime_type==='application/pdf'?[{id:d.id,title:d.title,summary:d.summary,kind:d.kind,fileName:d.published_version.file_asset.original_filename,assetId:d.published_version.file_asset.id}]:[]);
}
