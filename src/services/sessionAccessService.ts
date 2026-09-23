import { supabase } from '../lib/supabase';
export type SessionAccess={authenticated:boolean;isAdmin:boolean;isInvestor:boolean;investorStatus:string|null};
export async function resolveSessionAccess():Promise<SessionAccess>{
 if(!supabase)return{authenticated:false,isAdmin:false,isInvestor:false,investorStatus:null};
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return{authenticated:false,isAdmin:false,isInvestor:false,investorStatus:null};
 const [admin,investor]=await Promise.all([
  supabase.from('admins').select('id,is_active').eq('id',user.id).eq('is_active',true).maybeSingle(),
  supabase.from('investors').select('id,status').eq('id',user.id).maybeSingle()
 ]);
 const investorStatus=(investor.data as any)?.status??null;
 return{authenticated:true,isAdmin:Boolean(admin.data),isInvestor:Boolean(investor.data)&&['approved','active'].includes(investorStatus),investorStatus};
}
export async function secureLogout(){if(supabase)await supabase.auth.signOut({scope:'local'});}
