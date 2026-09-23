export interface InvestorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  unitsOwned: number;
  unitPrice: number;
  totalInvestment: number;
  equityPercentage: number;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  totalDividendsReceived: number;
  pendingDividend: number;
  nextDividendDate: string;
  status: 'Aktif' | 'Pending' | 'Review';
}

export interface InvestorReport {
  id: string;
  title: string;
  period: string;
  date: string;
  category: 'keuangan' | 'operasional' | 'bagi_hasil' | 'legalitas';
  summary: string;
  fileSize: string;
  fileType: string;
  isNew?: boolean;
  auditor?: string;
  highlights: {
    label: string;
    value: string;
  }[];
  contentDetails: string;
  downloadUrl?: string;
}

export interface DividendRecord {
  id: string;
  period: string;
  paymentDate: string;
  amountPerUnit: number;
  units: number;
  totalGross: number;
  taxDeduction: number;
  totalNet: number;
  status: 'Berhasil' | 'Diproses' | 'Dijadwalkan';
  referenceNumber: string;
  paymentMethod: string;
}

export const DEMO_INVESTOR: InvestorProfile = {
  id: 'NZ-INV-001',
  name: 'Investor Terdaftar Nuzultrip',
  email: 'investor@nuzultrip.com',
  phone: '+62 812-8921-8890',
  joinDate: 'September 2026',
  unitsOwned: 1,
  unitPrice: 100000000,
  totalInvestment: 100000000,
  equityPercentage: 0.8, // 1 unit dari 50 total alokasi perusahaan (0.8%)
  bankAccount: {
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7192-0000-0000',
    accountHolder: 'INVESTOR KEPEMILIKAN SAHAM',
  },
  totalDividendsReceived: 0,
  pendingDividend: 0,
  nextDividendDate: 'Sesuai Keputusan RUPS',
  status: 'Aktif',
};

export const INVESTOR_REPORTS: InvestorReport[] = [
  {
    id: 'REP-2026-Q2',
    title: 'Laporan Keuangan & Operasional Triwulan II 2026 (Audited)',
    period: 'April - Juni 2026',
    date: '15 Juli 2026',
    category: 'keuangan',
    summary:
      'Laporan performa finansial konsolidasi Nuzultrip Q2 2026 mencatat pertumbuhan omzet sebesar 28,4% YoY didorong oleh peningkatan volume keberangkatan umroh Syawal dan musim liburan.',
    fileSize: '4.8 MB',
    fileType: 'PDF',
    isNew: true,
    auditor: 'KAP Hendrawan & Rekan (Chartered Accountants)',
    highlights: [
      { label: 'Omzet Konsolidasi', value: 'Rp 4,82 Miliar' },
      { label: 'Laba Bersih Operasional', value: 'Rp 960 Juta' },
      { label: 'Total Jamaah Q2', value: '382 Jamaah' },
      { label: 'Distribusi Bagi Hasil Unit', value: 'Rp 6,4 Jt / Unit' },
    ],
    contentDetails:
      'Pada kuartal kedua 2026, ekosistem Nuzultrip mencatat efisiensi operasional hotel di Madinah dan Makkah berkat sistem direct contract yang menghasilkan penghematan biaya kamar sebesar 14%. Penyaluran bagi hasil untuk pemegang unit equity dialokasikan sesuai dengan AD/ART perseroan.',
  },
  {
    id: 'REP-2026-DIV-02',
    title: 'Laporan Realisasi Bagi Hasil Tahap 4 Periode Mei - Juni 2026',
    period: 'Mei - Juni 2026',
    date: '30 Juni 2026',
    category: 'bagi_hasil',
    summary:
      'Rincian pencairan deviden berkala kepada seluruh 50 pemegang unit equity terdaftar Nuzultrip melalui transfer otomatis rekening BSI & Mandiri Syariah.',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    isNew: true,
    highlights: [
      { label: 'Total Nilai Bagi Hasil', value: 'Rp 320.000.000' },
      { label: 'Yield Tahunan Proyeksi', value: '19.2% / Tahun' },
      { label: 'Status Penyaluran', value: '100% Selesai Ditransfer' },
    ],
    contentDetails:
      'Bagi hasil ditransfer secara otomatis pada tanggal 30 Juni 2026. Bukti potong pajak dan slip konfirmasi bank terlampir secara digital pada masing-masing akun pemegang unit.',
  },
  {
    id: 'REP-2026-OPS-01',
    title: 'Laporan Perkembangan Jaringan Internasional & Kantor Cabang Jeddah',
    period: 'Semester I 2026',
    date: '10 Juni 2026',
    category: 'operasional',
    summary:
      'Laporan progres ekspansi perwakilan operasional Nuzultrip Land Arrangement di Jeddah dan kemitraan handling muassasah di Arab Saudi.',
    fileSize: '3.4 MB',
    fileType: 'PDF',
    highlights: [
      { label: 'Mitra Transportasi Bus', value: '12 Armada Baru' },
      { label: 'Kontrak Kamar Makkah', value: '150 Room Nights' },
      { label: 'Kepuasan Jamaah (NPS)', value: '94.8 / 100' },
    ],
    contentDetails:
      'Kantor handling resmi di Jeddah kini beroperasi penuh melayani ketibaan dan kepulangan jamaah Nuzultrip serta melayani paket B2B land arrangement untuk 8 travel agent rekanan di Indonesia.',
  },
  {
    id: 'REP-2026-Q1',
    title: 'Laporan Keuangan & Operasional Triwulan I 2026 (Audited)',
    period: 'Januari - Maret 2026',
    date: '18 April 2026',
    category: 'keuangan',
    summary:
      'Realisasi operasional musim umroh awal tahun dan musim Ramadhan 1447H dengan lonjakan permintaan paket premium keluarga.',
    fileSize: '5.2 MB',
    fileType: 'PDF',
    auditor: 'KAP Hendrawan & Rekan (Chartered Accountants)',
    highlights: [
      { label: 'Omzet Konsolidasi', value: 'Rp 4,10 Miliar' },
      { label: 'Laba Bersih Operasional', value: 'Rp 820 Juta' },
      { label: 'Total Jamaah Q1', value: '318 Jamaah' },
      { label: 'Distribusi Bagi Hasil Unit', value: 'Rp 5,8 Jt / Unit' },
    ],
    contentDetails:
      'Keberangkatan umroh Ramadhan mencapai kapasitas 100% dengan margin operasional yang sehat. Penggunaan aplikasi monitoring jamaah mengurangi insiden kendala handling hingga 92%.',
  },
  {
    id: 'REP-2026-RUPS',
    title: 'Risalah Rapat Umum Pemegang Saham (RUPS) Tahunan & Keputusan Dividen',
    period: 'Tahun Buku 2025',
    date: '20 Maret 2026',
    category: 'legalitas',
    summary:
      'Akta Notaris Notulen Keputusan RUPS Tahunan PT Nuzul Berkah Wisata mengenai persetujuan laporan keuangan 2025 dan rencana alokasi equity 2026.',
    fileSize: '6.7 MB',
    fileType: 'PDF',
    highlights: [
      { label: 'Kehadiran Saham', value: '96.2% Kuorum' },
      { label: 'Persetujuan Dividen', value: 'Aklamasi 100%' },
      { label: 'Notaris Pengesah', value: 'H. Sudirman, SH., M.Kn' },
    ],
    contentDetails:
      'Seluruh pemegang unit menyetujui pengesahan neraca keuangan tahun buku 2025 serta rencana penambahan 50 unit equity strategis untuk ekspansi ekosistem digital Nuzultrip.',
  },
  {
    id: 'REP-2025-ANNUAL',
    title: 'Laporan Tahunan Terpadu (Annual Report 2025)',
    period: 'Januari - Desember 2025',
    date: '10 Februari 2026',
    category: 'keuangan',
    summary:
      'Laporan tahunan komprehensif mencakup rekap omzet Rp 11,2 Miliar, 1.000+ jamaah terlayani, dan dividen yield sebesar 18,8% per unit.',
    fileSize: '12.4 MB',
    fileType: 'PDF',
    auditor: 'KAP Hendrawan & Rekan (Chartered Accountants)',
    highlights: [
      { label: 'Total Omzet 2025', value: 'Rp 11,2 Miliar' },
      { label: 'Total Jamaah 2025', value: '1.042 Jamaah' },
      { label: 'Akumulasi Bagi Hasil', value: 'Rp 19,2 Jt / Unit' },
    ],
    contentDetails:
      'Tahun 2025 menandai pertumbuhan fundamental Nuzultrip dengan pembentukan unit bisnis B2B Land Arrangement dan lisensi PPIU resmi dari Kementerian Agama RI.',
  },
  {
    id: 'REP-2024-LEGAL',
    title: 'Surat Keputusan Kemenkumham & Sertifikat Legalitas Unit Saham Equity',
    period: 'Dokumen Perseroan',
    date: '12 Januari 2024',
    category: 'legalitas',
    summary:
      'Salinan resmi AHU Kemenkumham, NIB, Izin PPIU Kemenag, dan e-Sertifikat Kepemilikan Unit Equity Nuzultrip bertanda tangan direksi & komisaris.',
    fileSize: '8.1 MB',
    fileType: 'PDF',
    highlights: [
      { label: 'No. SK Kemenkumham', value: 'AHU-0019281.AH.01.01' },
      { label: 'Status Legal', value: 'Perseroan Terbatas Resmi' },
      { label: 'Tanda Tangan Digital', value: 'Tervalidasi Peruri/BSrE' },
    ],
    contentDetails:
      'Dokumen legalitas ini mengesahkan kepemilikan unit equity sebagai aset kepemilikan yang dilindungi oleh hukum perseroan terbatas di Republik Indonesia.',
  },
];

export const DEMO_DIVIDENDS: DividendRecord[] = [];
