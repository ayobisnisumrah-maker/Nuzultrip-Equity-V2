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


export type EquityCalculatorConfig = {
  unitPrice:number;
  ownershipPerUnit:number;
  maxUnits:number;
  equityPercentage:number;
  totalUnits:number;
  unitOwnershipPercentage:number;
  pricePerUnit:number;
  distributionCadenceMonths:number;
  eyebrow?:string;
  title?:string;
  subtitle?:string;
  officialInfoUrl?:string;
  disclaimer?:string;
  scenarios?:Array<{key:'konservatif'|'moderat'|'optimis';label:string;tag:string;rate:number;description:string}>;
};

export async function loadEquityCalculatorConfig():Promise<EquityCalculatorConfig|null>{
  if(!supabase)return null;
  const [{data:offering,error:offeringError},{data:section,error:sectionError}]=await Promise.all([
    supabase.from('ownership_offerings').select('unit_price,unit_ownership_bps,total_units,total_offered_bps,distribution_cadence_months').eq('status','open').order('effective_from',{ascending:false}).limit(1).maybeSingle(),
    supabase.from('portal_sections').select('published_version:portal_section_versions!portal_sections_published_version_id_fkey(content)').eq('anchor_id','kalkulator-equity').eq('status','published').eq('is_visible',true).maybeSingle()
  ]);
  if(offeringError)throw offeringError;
  if(sectionError)throw sectionError;
  if(!offering)return null;
  const content=(section as any)?.published_version?.content||{};
  return {
    unitPrice:Number((offering as any).unit_price),
    ownershipPerUnit:Number((offering as any).unit_ownership_bps)/100,
    maxUnits:Math.min(Number(content.maxUnitsPerSimulation||25),Number((offering as any).total_units)),
    equityPercentage:Number((offering as any).total_offered_bps)/100,
    totalUnits:Number((offering as any).total_units),
    unitOwnershipPercentage:Number((offering as any).unit_ownership_bps)/100,
    pricePerUnit:Number((offering as any).unit_price),
    distributionCadenceMonths:Number((offering as any).distribution_cadence_months||0),
    eyebrow:content.eyebrow,
    title:content.title,
    subtitle:content.subtitle,
    officialInfoUrl:content.officialInfoUrl,
    disclaimer:content.disclaimer,
    scenarios:Array.isArray(content.scenarios)?content.scenarios:undefined
  };
}
