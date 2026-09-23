-- =========================================================================
-- NUZULTRIP EQUITY & PORTAL INVESTOR SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- =========================================================================

-- 1. Tabel Laporan Investor (Investor Reports)
create table if not exists public.investor_reports (
  id text primary key,
  title text not null,
  period text not null,
  date text not null,
  category text not null, -- 'keuangan', 'operasional', 'bagi_hasil', 'legalitas'
  summary text not null,
  content_details text not null,
  file_size text default '2.4 MB',
  file_type text default 'PDF',
  is_new boolean default true,
  auditor text,
  highlights jsonb default '[]'::jsonb,
  download_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabel Transaksi Kasir / Pembelian Unit & Layanan (Cashier Transactions)
create table if not exists public.cashier_transactions (
  id text primary key,
  invoice_number text not null unique,
  transaction_type text not null, -- 'equity_purchase', 'umroh_package', 'hotel_allotment', 'visa_handling'
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  units_count integer default 0,
  amount_total numeric not null,
  payment_method text not null, -- 'bank_transfer_bsi', 'bank_transfer_mandiri', 'qris', 'cash'
  payment_status text default 'Lunas', -- 'Lunas', 'Menunggu Verifikasi', 'Dibatalkan'
  notes text,
  created_by text default 'Super Admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabel Riwayat Penyaluran Bagi Hasil / Dividen (Dividend Records)
create table if not exists public.dividend_records (
  id text primary key,
  period text not null,
  payment_date text not null,
  amount_per_unit numeric not null,
  total_units integer default 50,
  total_payout numeric not null,
  status text default 'Berhasil',
  reference_number text not null,
  payment_method text default 'Bank Transfer (BSI Syariah)',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabel Pengaturan Konten Portal & Ekosistem (Portal Content & Settings)
create table if not exists public.portal_contents (
  id text primary key default 'active_config',
  hero_headline text not null,
  hero_subheadline text not null,
  equity_percentage numeric default 40,
  total_units integer default 50,
  available_units integer default 14,
  price_per_unit numeric default 100000000,
  annual_yield_projection text default '19.2%',
  running_announcement text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Tabel Database Investor (Equity Investors)
create table if not exists public.equity_investors (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  nik text,
  units_owned integer default 1,
  total_investment numeric not null,
  equity_share_pct numeric not null,
  bank_name text not null,
  bank_account_number text not null,
  bank_account_holder text not null,
  join_date text not null,
  status text default 'Aktif',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.investor_reports enable row level security;
alter table public.cashier_transactions enable row level security;
alter table public.dividend_records enable row level security;
alter table public.portal_contents enable row level security;
alter table public.equity_investors enable row level security;

-- Open policies for prototype/authenticated use
create policy "Allow all read" on public.investor_reports for select using (true);
create policy "Allow all insert" on public.investor_reports for insert with check (true);
create policy "Allow all update" on public.investor_reports for update using (true);
create policy "Allow all delete" on public.investor_reports for delete using (true);

create policy "Allow all read cashier" on public.cashier_transactions for select using (true);
create policy "Allow all insert cashier" on public.cashier_transactions for insert with check (true);

create policy "Allow all read dividends" on public.dividend_records for select using (true);
create policy "Allow all insert dividends" on public.dividend_records for insert with check (true);

create policy "Allow all read portal" on public.portal_contents for select using (true);
create policy "Allow all update portal" on public.portal_contents for update using (true);

create policy "Allow all read investors" on public.equity_investors for select using (true);
create policy "Allow all update investors" on public.equity_investors for update using (true);

-- Enable Realtime Broadcast for all tables
alter publication supabase_realtime add table public.investor_reports;
alter publication supabase_realtime add table public.cashier_transactions;
alter publication supabase_realtime add table public.dividend_records;
alter publication supabase_realtime add table public.portal_contents;
alter publication supabase_realtime add table public.equity_investors;
