import { supabase } from '../lib/supabase';

export type FinanceSnapshot = {
  income: number; expenses: number; refunds: number; netCash: number;
  openPeriods: number; lockedPeriods: number;
};

export async function loadFinanceSnapshot(): Promise<FinanceSnapshot> {
  if (!supabase) throw new Error('Supabase production belum terhubung.');
  const [payments, expenses, refunds, periods] = await Promise.all([
    supabase.from('finance_payments').select('amount'),
    supabase.from('finance_expenses').select('total_amount,status'),
    supabase.from('finance_refunds').select('amount,status'),
    supabase.from('financial_periods').select('status'),
  ]);
  for (const result of [payments, expenses, refunds, periods]) if (result.error) throw result.error;
  const income = (payments.data || []).reduce((n:any,r:any)=>n+Number(r.amount||0),0);
  const expenseTotal = (expenses.data || []).filter((r:any)=>r.status !== 'void').reduce((n:any,r:any)=>n+Number(r.total_amount||0),0);
  const refundTotal = (refunds.data || []).filter((r:any)=>r.status !== 'void').reduce((n:any,r:any)=>n+Number(r.amount||0),0);
  return {
    income, expenses: expenseTotal, refunds: refundTotal,
    netCash: income-expenseTotal-refundTotal,
    openPeriods: (periods.data||[]).filter((r:any)=>r.status==='open').length,
    lockedPeriods: (periods.data||[]).filter((r:any)=>r.status==='locked').length,
  };
}

export async function createExpense(input: { category:string; vendorName?:string; description:string; amount:number; paymentMethod?:string; notes?:string }) {
  if (!supabase) throw new Error('Supabase production belum terhubung.');
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Sesi admin tidak valid.');
  const ref='EXP-'+new Date().toISOString().replace(/\D/g,'').slice(0,14);
  const { data,error }=await supabase.from('finance_expenses').insert({
    reference:ref,status:'recorded',expense_on:new Date().toISOString().slice(0,10),
    category:input.category,vendor_name:input.vendorName||null,description:input.description,
    quantity:1,unit_price:input.amount,tax_amount:0,total_amount:input.amount,currency:'IDR',
    payment_method:input.paymentMethod||null,notes:input.notes||null,recorded_by:user.user.id,
  }).select().single();
  if(error) throw new Error(error.message);
  return data;
}
