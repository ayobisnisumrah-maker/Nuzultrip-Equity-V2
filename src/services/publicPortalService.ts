import { appSchema, supabase } from '../lib/supabase';

export type PortalSection={id:string;anchorId:string;kind:string;position:number;content:Record<string,any>};
export async function loadPublicHome():Promise<PortalSection[]>{
 if(!supabase)return[];
 const {data,error}=await supabase.from('portal_sections').select('id,anchor_id,section_kind,position,published_version:portal_section_versions!portal_sections_published_version_id_fkey(content)').eq('is_visible',true).eq('status','published').order('position');
 if(error)throw error;
 return(data||[]).map((s:any)=>({id:s.id,anchorId:s.anchor_id,kind:s.section_kind,position:s.position,content:s.published_version?.content||{}}));
}
export async function loadAdminHomeSections(){
 if(!supabase)return[];
 const {data,error}=await supabase.from('portal_sections').select('id,anchor_id,section_kind,position,status,is_visible,current_version:portal_section_versions!portal_sections_current_version_id_fkey(content,version_number)').order('position');
 if(error)throw error;return data||[];
}
export async function saveSectionDraft(anchorId:string,content:Record<string,any>,note='Pembaruan melalui Dashboard CMS'){
 if(!appSchema)throw new Error('Supabase production belum terhubung.');
 const {data,error}=await appSchema.rpc('update_portal_section_content',{p_anchor_id:anchorId,p_content:content,p_change_note:note});if(error)throw error;return data;
}
export async function transitionSection(id:string,target:'draft'|'review'|'approved'|'published'){
 if(!appSchema)throw new Error('Supabase production belum terhubung.');
 const {error}=await appSchema.rpc('transition_portal_section',{p_section_id:id,p_target:target});if(error)throw error;
}
