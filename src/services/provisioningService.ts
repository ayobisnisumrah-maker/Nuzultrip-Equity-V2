import { supabase } from '../lib/supabase';

async function invoke<T>(payload: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error('Supabase production belum terhubung.');
  const { data, error } = await supabase.functions.invoke('admin-provisioning', { body: payload });
  if (error) throw new Error(error.message || 'Provisioning gagal.');
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export const provisioningService = {
  createAdmin(input: {
    email: string; fullName: string; phone?: string; title?: string;
    employeeRef?: string; roleKey: string;
  }) {
    return invoke<{ id: string; email: string; role_key: string }>({
      action: 'create_admin', email: input.email, full_name: input.fullName,
      phone: input.phone, title: input.title, employee_ref: input.employeeRef,
      role_key: input.roleKey,
    });
  },
  createInvestor(input: {
    email: string; legalName: string; whatsappNumber?: string;
    investorType?: 'individual' | 'institution'; city?: string; address?: string;
    organizationName?: string; organizationRole?: string; applicationNote?: string;
  }) {
    return invoke<{ id: string; reference_code: string; status: string }>({
      action: 'create_investor', email: input.email, legal_name: input.legalName,
      whatsapp_number: input.whatsappNumber, investor_type: input.investorType || 'individual',
      city: input.city, address: input.address, organization_name: input.organizationName,
      organization_role: input.organizationRole, application_note: input.applicationNote,
    });
  },
};
