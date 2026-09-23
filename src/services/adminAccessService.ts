import { appSchema } from '../lib/supabase';

export type AdminAccess = {
  isSuperAdmin: boolean;
  canViewInvestors: boolean;
  canManageInvestors: boolean;
  canViewOwnership: boolean;
  canManageOwnership: boolean;
  canViewFinance: boolean;
  canManageFinance: boolean;
  canViewDocuments: boolean;
  canManageDocuments: boolean;
  canViewPortal: boolean;
  canManagePortal: boolean;
  canViewMessages: boolean;
  canManageMessages: boolean;
  canViewAdmins: boolean;
  canManageAdmins: boolean;
  canViewAudit: boolean;
};

const permissionKeys = [
  'investors.view','investors.create','investors.update',
  'ownership.view','ownership.update',
  'financial_reports.view','financial_reports.update',
  'documents.view','documents.update',
  'portal.view','portal.update',
  'messages.view','messages.send',
  'admins.view','admins.create',
  'audit_logs.view',
] as const;

export async function loadAdminAccess(): Promise<AdminAccess> {
  if (!appSchema) throw new Error('Supabase production belum terhubung.');

  const checks = await Promise.all(
    permissionKeys.map(async (key) => {
      const { data, error } = await appSchema.rpc('has_permission', { p_key: key });
      if (error) throw error;
      return [key, Boolean(data)] as const;
    })
  );
  const allowed = Object.fromEntries(checks) as Record<string, boolean>;

  // admins.create sengaja hanya efektif untuk Super Admin pada model RBAC production.
  const isSuperAdmin = Boolean(allowed['admins.create']);

  return {
    isSuperAdmin,
    canViewInvestors: allowed['investors.view'],
    canManageInvestors: allowed['investors.create'] || allowed['investors.update'],
    canViewOwnership: allowed['ownership.view'],
    canManageOwnership: allowed['ownership.update'],
    canViewFinance: allowed['financial_reports.view'],
    canManageFinance: allowed['financial_reports.update'],
    canViewDocuments: allowed['documents.view'],
    canManageDocuments: allowed['documents.update'],
    canViewPortal: allowed['portal.view'],
    canManagePortal: allowed['portal.update'],
    canViewMessages: allowed['messages.view'],
    canManageMessages: allowed['messages.send'],
    canViewAdmins: allowed['admins.view'],
    canManageAdmins: isSuperAdmin,
    canViewAudit: allowed['audit_logs.view'],
  };
}
