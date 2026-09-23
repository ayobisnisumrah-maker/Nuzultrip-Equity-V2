import React, { useState } from 'react';
import {
  FileText,
  Plus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  DollarSign,
  Receipt,
  Building,
  Upload,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Printer,
  Eye,
} from 'lucide-react';
import {
  CashierPackage,
  ExpenseRecord,
  OfficialInvoice,
  INITIAL_PACKAGES,
  INITIAL_INVOICES,
  DEFAULT_REFUND_TIERS,
  OFFICIAL_COMPANY_PROFILE,
  DEFAULT_LEGAL_TERMS_TEXT,
  RefundTier,
} from '../../data/cashierData';
import { OfficialInvoiceDetailModal } from './OfficialInvoiceDetailModal';

export const CashierInvoiceView: React.FC = () => {
  // State for Invoices
  const [invoices, setInvoices] = useState<OfficialInvoice[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<OfficialInvoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // State for Packages
  const [packages, setPackages] = useState<CashierPackage[]>(INITIAL_PACKAGES);

  // State for Expenses
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

  // State for "Buat invoice penjualan"
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(packages[0]?.id || '');
  const [paxCount, setPaxCount] = useState(1);
  const [pricePerPax, setPricePerPax] = useState(packages[0]?.defaultPrice || 22500000);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');
  const [invoiceSuccessMsg, setInvoiceSuccessMsg] = useState('');

  // State for "Tambah produk atau paket"
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgUnit, setNewPkgUnit] = useState('pax');
  const [newPkgPrice, setNewPkgPrice] = useState<number | ''>('');
  const [newPkgTax, setNewPkgTax] = useState(0);
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [pkgSuccessMsg, setPkgSuccessMsg] = useState('');

  // State for "Catat pengeluaran"
  const [expDate, setExpDate] = useState('');
  const [expCategory, setExpCategory] = useState('');
  const [expVendor, setExpVendor] = useState('');
  const [expMethod, setExpMethod] = useState('');
  const [expQty, setExpQty] = useState(1);
  const [expPrice, setExpPrice] = useState<number | ''>('');
  const [expFee, setExpFee] = useState(0);
  const [expDesc, setExpDesc] = useState('');
  const [expSuccessMsg, setExpSuccessMsg] = useState('');

  // State for "Pengaturan invoice"
  const [companyName, setCompanyName] = useState(OFFICIAL_COMPANY_PROFILE.companyName);
  const [companyAddress, setCompanyAddress] = useState(OFFICIAL_COMPANY_PROFILE.address);
  const [paymentInstruction, setPaymentInstruction] = useState(OFFICIAL_COMPANY_PROFILE.paymentInstruction);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

  // State for "Syarat & Ketentuan"
  const [termsText, setTermsText] = useState(DEFAULT_LEGAL_TERMS_TEXT);
  const [refundTiers, setRefundTiers] = useState<RefundTier[]>(DEFAULT_REFUND_TIERS);
  const [termsSuccessMsg, setTermsSuccessMsg] = useState('');

  // Calculations for current invoice form
  const rawSubtotal = paxCount * pricePerPax - discount;
  const currentSubtotal = Math.max(0, rawSubtotal);
  const currentTax = Math.round(currentSubtotal * (taxRate / 100));
  const currentTotal = currentSubtotal + currentTax;

  // Format currency helper
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // KPI Calculations
  const totalInvoiceValue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaidValue = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalExpenseValue = expenses.reduce((acc, exp) => acc + exp.total, 0);

  // When package dropdown changes
  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const found = packages.find((p) => p.id === pkgId);
    if (found) {
      setPricePerPax(found.defaultPrice);
      setTaxRate(found.taxRate);
    }
  };

  // Submit new invoice
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return;

    const chosenPkg = packages.find((p) => p.id === selectedPackageId) || packages[0];
    const newInvId = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newInvoice: OfficialInvoice = {
      id: Math.random().toString(36).substring(2, 9),
      invoiceNumber: newInvId,
      title: `Bukti Pembayaran ${chosenPkg?.name || 'Paket Perjalanan'}`,
      customerName,
      customerEmail: customerEmail || '-',
      customerPhone: customerPhone || '-',
      customerAddress: customerAddress || '-',
      dueDate: dueDate || '22/09/2026',
      departureDate: '25/10/2026',
      packageCode: chosenPkg?.code || 'PKT-GEN',
      packageName: chosenPkg?.name || 'Paket Perjalanan',
      packageDescription: `${chosenPkg?.name}\n${chosenPkg?.code}`,
      paxCount,
      pricePerPax,
      discount,
      taxRate,
      subtotal: currentSubtotal,
      taxAmount: currentTax,
      totalAmount: currentTotal,
      paidAmount: 0,
      remainingAmount: currentTotal,
      paymentStatus: 'draft',
      paymentMethodDetails: 'Belum ada pembayaran',
      notes,
      createdAt: 'Hari ini',
      termsAndConditions: termsText,
    };

    setInvoices([newInvoice, ...invoices]);
    setInvoiceSuccessMsg(`Invoice ${newInvId} berhasil disimpan sebagai draf!`);
    setTimeout(() => setInvoiceSuccessMsg(''), 4000);

    // Reset form
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerAddress('');
    setNotes('');
  };

  // Submit new package
  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName || !newPkgPrice) return;

    const newCode = `PKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newPkg: CashierPackage = {
      id: Math.random().toString(36).substring(2, 9),
      code: newCode,
      name: newPkgName,
      unit: newPkgUnit || 'pax',
      defaultPrice: Number(newPkgPrice),
      taxRate: newPkgTax || 0,
      description: newPkgDesc,
    };

    setPackages([...packages, newPkg]);
    setNewPkgName('');
    setNewPkgPrice('');
    setNewPkgDesc('');
    setPkgSuccessMsg(`Paket baru "${newPkg.name}" (${newCode}) berhasil ditambahkan!`);
    setTimeout(() => setPkgSuccessMsg(''), 4000);
  };

  // Submit new expense
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expPrice || !expCategory) return;

    const total = expQty * Number(expPrice) + Number(expFee);
    const newExp: ExpenseRecord = {
      id: Math.random().toString(36).substring(2, 9),
      date: expDate || new Date().toISOString().split('T')[0],
      category: expCategory,
      vendor: expVendor || '-',
      paymentMethod: expMethod || 'Transfer Bank',
      quantity: expQty,
      unitPrice: Number(expPrice),
      taxOrFee: Number(expFee),
      total,
      description: expDesc,
    };

    setExpenses([newExp, ...expenses]);
    setExpCategory('');
    setExpVendor('');
    setExpPrice('');
    setExpDesc('');
    setExpSuccessMsg('Pengeluaran operasional berhasil dicatat!');
    setTimeout(() => setExpSuccessMsg(''), 4000);
  };

  const handleOpenInvoiceDetail = (inv: OfficialInvoice) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  const handleUpdateInvoice = (updated: OfficialInvoice) => {
    setInvoices(invoices.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedInvoice(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Detail Modal */}
      {selectedInvoice && (
        <OfficialInvoiceDetailModal
          isOpen={isInvoiceModalOpen}
          invoice={selectedInvoice}
          onClose={() => setIsInvoiceModalOpen(false)}
          onUpdateInvoice={handleUpdateInvoice}
        />
      )}

      {/* Top Banner / Section Header (Identical to Screenshot 1) */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
          KEUANGAN OPERASIONAL
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kasir & Invoice</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          Kelola produk atau paket, penjualan per pax, pembayaran, refund, pengeluaran, dan dokumen invoice dari satu tempat.
        </p>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Nilai invoice</div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {formatRupiah(totalInvoiceValue)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Pembayaran bersih</div>
          <div className="text-2xl font-black text-emerald-800 font-mono mt-1">
            {formatRupiah(totalPaidValue)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Pengeluaran tercatat</div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {formatRupiah(totalExpenseValue)}
          </div>
        </div>
      </div>

      {/* Invoice Terbaru (List matching Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Invoice terbaru</h2>
          <span className="text-xs text-slate-400">Klik baris untuk pratinjau & cetak multi-halaman</span>
        </div>

        <div className="divide-y divide-slate-100">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => handleOpenInvoiceDetail(inv)}
              className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                  {inv.invoiceNumber}
                </span>
                <span className="text-xs text-slate-600 font-medium">{inv.customerName}</span>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="font-mono text-xs font-bold text-slate-900">
                  {formatRupiah(inv.totalAmount)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">·</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    inv.paymentStatus === 'lunas'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : inv.paymentStatus === 'dp'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {inv.paymentStatus}
                </span>
                <ChevronRight
                  size={15}
                  className="text-slate-300 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form: Buat invoice penjualan (Matching Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-base font-extrabold text-slate-900">Buat invoice penjualan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Masukkan paket dan jumlah pax. Nilai akhir dihitung ulang oleh database.
          </p>
        </div>

        {invoiceSuccessMsg && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{invoiceSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateInvoice} className="space-y-4">
          {/* Row 1: Nama Pelanggan & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama pelanggan</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Badan Pendapatan Daerah Provinsi Sulawesi Selatan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="email@instansi.go.id"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Row 2: Nomor Telepon & Jatuh Tempo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor telepon</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+62 8..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jatuh tempo</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none font-mono"
              />
            </div>
          </div>

          {/* Row 3: Alamat */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alamat</label>
            <textarea
              rows={2}
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Alamat lengkap instansi atau pemesan"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
          </div>

          {/* Row 4: Produk / Paket, Pax, Harga, Diskon, Pajak */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Produk / paket</label>
              <select
                value={selectedPackageId}
                onChange={(e) => handlePackageSelect(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.code} — {pkg.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah pax</label>
              <input
                type="number"
                min={1}
                value={paxCount}
                onChange={(e) => setPaxCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Harga per pax</label>
              <input
                type="number"
                value={pricePerPax}
                onChange={(e) => setPricePerPax(Number(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">Diskon</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Pajak (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 outline-none font-mono"
              />
            </div>
          </div>

          {/* Subtotal Calculation Bar */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[11px]">Subtotal</span>
              <span className="font-bold text-slate-900">{formatRupiah(currentSubtotal)}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Pajak</span>
              <span className="font-bold text-slate-900">{formatRupiah(currentTax)}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Total invoice</span>
              <span className="text-sm font-black text-emerald-800">{formatRupiah(currentTotal)}</span>
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Catatan</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruksi tambahan, manifest pax, atau catatan khusus"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              Simpan invoice draf
            </button>
          </div>
        </form>
      </div>

      {/* 2-Column Section: Tambah Produk & Catat Pengeluaran */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Tambah produk atau paket */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="mb-4">
            <h2 className="text-sm font-extrabold text-slate-900">Tambah produk atau paket</h2>
          </div>

          {pkgSuccessMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>{pkgSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreatePackage} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama paket</label>
                <input
                  type="text"
                  required
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  placeholder="Contoh: Paket Umrah VIP Bintang 5"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Satuan</label>
                <input
                  type="text"
                  value={newPkgUnit}
                  onChange={(e) => setNewPkgUnit(e.target.value)}
                  placeholder="pax"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Harga default</label>
                <input
                  type="number"
                  required
                  value={newPkgPrice}
                  onChange={(e) => setNewPkgPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="35000000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pajak (%)</label>
                <input
                  type="number"
                  value={newPkgTax}
                  onChange={(e) => setNewPkgTax(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi</label>
              <textarea
                rows={2}
                value={newPkgDesc}
                onChange={(e) => setNewPkgDesc(e.target.value)}
                placeholder="Rincian hotel, tiket, dan fasilitas paket"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              Tambah paket (kode otomatis)
            </button>
          </form>
        </div>

        {/* Right: Catat pengeluaran */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="mb-4">
            <h2 className="text-sm font-extrabold text-slate-900">Catat pengeluaran</h2>
          </div>

          {expSuccessMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>{expSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateExpense} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal</label>
                <input
                  type="text"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori</label>
                <input
                  type="text"
                  required
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  placeholder="Tiket Pesawat / LA Hotel / Visa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Vendor</label>
                <input
                  type="text"
                  value={expVendor}
                  onChange={(e) => setExpVendor(e.target.value)}
                  placeholder="Saudia Airlines / Pullman Zamzam"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Metode pembayaran</label>
                <input
                  type="text"
                  value={expMethod}
                  onChange={(e) => setExpMethod(e.target.value)}
                  placeholder="Transfer Bank / Giro"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Jumlah</label>
                <input
                  type="number"
                  min={1}
                  value={expQty}
                  onChange={(e) => setExpQty(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Harga satuan</label>
                <input
                  type="number"
                  required
                  value={expPrice}
                  onChange={(e) => setExpPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pajak / biaya</label>
                <input
                  type="number"
                  value={expFee}
                  onChange={(e) => setExpFee(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi</label>
              <textarea
                rows={2}
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="Rincian nomor booking tiket atau invoice vendor"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              Catat pengeluaran
            </button>
          </form>
        </div>
      </div>

      {/* Pengaturan invoice (Matching Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Pengaturan invoice</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Identitas dan syarat disalin saat invoice diterbitkan agar dokumen lama tidak ikut berubah.
          </p>
        </div>

        {settingsSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{settingsSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Prefix invoice</label>
            <input
              type="text"
              defaultValue={OFFICIAL_COMPANY_PROFILE.prefixInvoice}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Prefix pembayaran</label>
            <input
              type="text"
              defaultValue={OFFICIAL_COMPANY_PROFILE.prefixPayment}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Prefix refund</label>
            <input
              type="text"
              defaultValue={OFFICIAL_COMPANY_PROFILE.prefixRefund}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama badan usaha</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Identitas pajak (opsional)</label>
            <input
              type="text"
              placeholder="NPWP: 00.000.000.0-000.000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Alamat perusahaan</label>
          <textarea
            rows={2}
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Rekening / metode pembayaran</label>
          <textarea
            rows={2}
            defaultValue="Bank Syariah Indonesia (BSI) — No. Rek: 718-2938-112 a.n. PT SWARNA DIPA WISATA&#10;Bank Mandiri — No. Rek: 152-00-998822-1 a.n. PT SWARNA DIPA WISATA"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Instruksi pembayaran</label>
          <textarea
            rows={4}
            value={paymentInstruction}
            onChange={(e) => setPaymentInstruction(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nomor telepon & email untuk footer invoice</label>
          <input
            type="text"
            defaultValue={OFFICIAL_COMPANY_PROFILE.email}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
          />
        </div>

        {/* Logo, Stempel & Tanda Tangan (Matching Screenshot 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Logo */}
          <div className="border border-slate-200 rounded-2xl p-4 text-center">
            <div className="text-[11px] font-bold text-slate-700">Logo invoice</div>
            <div className="text-[10px] text-slate-400 mb-3">PNG, JPG, atau WebP; maksimal 6 MB.</div>
            <div className="h-14 flex items-center justify-center mb-3">
              <div className="flex items-center gap-1.5 font-black text-slate-900 text-lg">
                <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center text-xs">
                  N
                </div>
                <span>Nuzultrip</span>
              </div>
            </div>
            <div className="flex justify-center gap-2 text-xs">
              <button type="button" className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                Ganti
              </button>
              <button type="button" className="px-3 py-1 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer">
                Hapus
              </button>
            </div>
          </div>

          {/* Stempel */}
          <div className="border border-slate-200 rounded-2xl p-4 text-center">
            <div className="text-[11px] font-bold text-slate-700">Stempel perusahaan</div>
            <div className="text-[10px] text-slate-400 mb-3">PNG, JPG, atau WebP; maksimal 6 MB.</div>
            <div className="h-14 flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full border border-rose-600 flex flex-col items-center justify-center p-0.5 text-rose-600 text-[6px] font-bold">
                <span>SWARNA DIPA</span>
                <span className="text-[7px]">★</span>
              </div>
            </div>
            <div className="flex justify-center gap-2 text-xs">
              <button type="button" className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                Ganti
              </button>
              <button type="button" className="px-3 py-1 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer">
                Hapus
              </button>
            </div>
          </div>

          {/* Tanda tangan */}
          <div className="border border-slate-200 rounded-2xl p-4 text-center">
            <div className="text-[11px] font-bold text-slate-700">Tanda tangan</div>
            <div className="text-[10px] text-slate-400 mb-3">PNG, JPG, atau WebP; maksimal 6 MB.</div>
            <div className="h-14 flex items-center justify-center mb-3">
              <div className="font-serif italic text-xl text-slate-800">SwarnaDipa</div>
            </div>
            <div className="flex justify-center gap-2 text-xs">
              <button type="button" className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                Ganti
              </button>
              <button type="button" className="px-3 py-1 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer">
                Hapus
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSettingsSuccessMsg('Pengaturan invoice dan identitas badan usaha berhasil disimpan!');
            setTimeout(() => setSettingsSuccessMsg(''), 4000);
          }}
          className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          Simpan pengaturan
        </button>
      </div>

      {/* Syarat invoice & kebijakan refund (Matching Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Syarat invoice & kebijakan refund</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan ini disalin sebagai snapshot ketika invoice diterbitkan. Perubahan berikutnya tidak mengubah syarat pada invoice lama.
          </p>
        </div>

        {termsSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{termsSuccessMsg}</span>
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-800">
              Halaman 2 dan seterusnya — Syarat & Ketentuan
            </span>
            <span className="text-[11px] text-slate-400">
              Gunakan mode besar untuk membaca dokumen panjang. Pratinjau membedakan judul/PASAL dari isi agar struktur dokumen lebih mudah diperiksa sebelum disimpan.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-t-xl border border-slate-200 text-xs font-medium text-slate-700">
            <button type="button" className="px-2 py-1 rounded bg-white shadow-2xs hover:bg-slate-50 cursor-pointer">
              Besarkan editor
            </button>
            <button type="button" className="px-2 py-1 rounded bg-white shadow-2xs hover:bg-slate-50 cursor-pointer font-bold">
              A+
            </button>
            <button type="button" className="px-2 py-1 rounded bg-white shadow-2xs hover:bg-slate-50 cursor-pointer font-bold">
              A-
            </button>
            <button type="button" className="px-2 py-1 rounded bg-white shadow-2xs hover:bg-slate-50 cursor-pointer font-bold">
              Tandai judul/pasal
            </button>
            <button type="button" className="px-2 py-1 rounded bg-white shadow-2xs hover:bg-slate-50 cursor-pointer">
              Rata kiri
            </button>
            <button type="button" className="px-2 py-1 rounded bg-white shadow-2xs hover:bg-slate-50 cursor-pointer">
              Tengah
            </button>
            <button type="button" className="px-2 py-1 rounded bg-white shadow-2xs hover:bg-slate-50 cursor-pointer">
              Rata kiri-kanan
            </button>
          </div>

          <textarea
            rows={12}
            value={termsText}
            onChange={(e) => setTermsText(e.target.value)}
            className="w-full p-4 rounded-b-xl border-x border-b border-slate-200 text-[11px] text-slate-800 font-mono leading-relaxed outline-none"
          />
        </div>

        {/* SLA Proses Refund */}
        <div className="space-y-3 pt-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900">SLA proses refund</h3>
            <p className="text-[11px] text-slate-400">
              Contoh: 90 hari kerja. Hari kerja saat ini dihitung Senin–Jumat; kalender hari libur nasional belum mengurangi hitungan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Maksimal proses</label>
              <input
                type="number"
                defaultValue={90}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Dasar hari</label>
              <select defaultValue="kalender" className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white">
                <option value="kalender">Hari kalender</option>
                <option value="kerja">Hari kerja</option>
              </select>
            </div>
          </div>
        </div>

        {/* Persentase refund berdasarkan jarak keberangkatan (Matching Screenshot 1) */}
        <div className="space-y-3 pt-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Persentase refund berdasarkan jarak keberangkatan
            </h3>
            <p className="text-[11px] text-slate-400">
              Tidak ada persentase yang ditentukan sistem. Isi sesuai kebijakan perusahaan. Nilai 0% berarti pembayaran hangus pada rentang tersebut. Rentang tidak boleh tumpang tindih; baris kosong diabaikan.
            </p>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-3 text-[11px] font-bold text-slate-600 px-1">
              <div className="col-span-5">Min. hari sebelum berangkat</div>
              <div className="col-span-5">Maks. hari</div>
              <div className="col-span-2">Pengembalian (%)</div>
            </div>

            {refundTiers.map((tier, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5">
                  <input
                    type="number"
                    value={tier.minDays}
                    onChange={(e) => {
                      const updated = [...refundTiers];
                      updated[idx].minDays = Number(e.target.value);
                      setRefundTiers(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    value={tier.maxDays === null ? 'Kosong = tanpa batas' : tier.maxDays}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = [...refundTiers];
                      updated[idx].maxDays = isNaN(Number(val)) || val === '' ? null : Number(val);
                      setRefundTiers(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={tier.refundPercent}
                    onChange={(e) => {
                      const updated = [...refundTiers];
                      updated[idx].refundPercent = Number(e.target.value);
                      setRefundTiers(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-emerald-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={() => {
              setTermsSuccessMsg('Syarat & ketentuan 20 PASAL dan kebijakan refund berhasil disimpan!');
              setTimeout(() => setTermsSuccessMsg(''), 4000);
            }}
            className="py-2.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            Simpan syarat & kebijakan refund
          </button>
        </div>
      </div>
    </div>
  );
};
