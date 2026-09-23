export interface CashierPackage {
  id: string;
  code: string;
  name: string;
  unit: string;
  defaultPrice: number;
  taxRate: number;
  description: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: string;
  vendor: string;
  paymentMethod: string;
  quantity: number;
  unitPrice: number;
  taxOrFee: number;
  total: number;
  description: string;
}

export interface RefundTier {
  minDays: number;
  maxDays: number | null; // null = no limit
  refundPercent: number;
}

export interface OfficialInvoice {
  id: string;
  invoiceNumber: string;
  title: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  dueDate: string; // Batas pelunasan (dd/mm/yyyy)
  departureDate: string; // Tanggal keberangkatan (dd/mm/yyyy)
  packageCode: string;
  packageName: string;
  packageDescription: string;
  paxCount: number;
  pricePerPax: number;
  discount: number;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: 'draft' | 'dp' | 'lunas';
  paymentMethodDetails: string;
  notes: string;
  createdAt: string;
  termsAndConditions: string;
}

export const INITIAL_PACKAGES: CashierPackage[] = [
  {
    id: 'pkg-1',
    code: 'PKT-D814659D',
    name: 'Paket Umrah 9 Hari',
    unit: 'pax',
    defaultPrice: 36800000,
    taxRate: 0,
    description: 'Hotel Bintang 5 Makkah (Pullman Zamzam) & Madinah (Frontel Al Harithia), Tiket PP Garuda/Saudia, Visa & Muassasah.',
  },
  {
    id: 'pkg-2',
    code: 'PKT-PLUSTURKI',
    name: 'Paket Umrah Plus Turki 12 Hari',
    unit: 'pax',
    defaultPrice: 44500000,
    taxRate: 0,
    description: 'City Tour Istanbul, Bursa, Bosphorus Cruise, Umrah Makkah & Ziarah Madinah.',
  },
  {
    id: 'pkg-3',
    code: 'PKT-VIPRAMADHAN',
    name: 'Paket Umrah Ramadhan Itikaf',
    unit: 'pax',
    defaultPrice: 52000000,
    taxRate: 0,
    description: '10 Hari Terakhir Ramadhan di Masjidil Haram & Masjid Nabawi.',
  },
  {
    id: 'pkg-4',
    code: 'PKT-LA-HOTEL',
    name: 'Land Arrangement (LA) Hotel Makkah & Madinah B2B',
    unit: 'kamar/malam',
    defaultPrice: 18500000,
    taxRate: 0,
    description: 'Allotment hotel bintang 4 & 5, handling bus eksekutif, dan konsumsi.',
  },
];

export const INITIAL_INVOICES: OfficialInvoice[] = [];

export const DEFAULT_REFUND_TIERS: RefundTier[] = [
  { minDays: 61, maxDays: null, refundPercent: 90 },
  { minDays: 31, maxDays: 60, refundPercent: 75 },
  { minDays: 15, maxDays: 30, refundPercent: 50 },
  { minDays: 8, maxDays: 14, refundPercent: 25 },
  { minDays: 0, maxDays: 7, refundPercent: 0 },
];

export const OFFICIAL_COMPANY_PROFILE = {
  companyName: 'PT. Swarna Dipa Wisata',
  brandName: 'Nuzultrip',
  address: 'RUKO PETTARANI, Jl. A. P. Pettarani No.24\nTamamaung, Kec. Panakkukang\nKota Makassar, Sulawesi Selatan 90232',
  email: 'equity@nuzultrip.com',
  website: 'www.nuzultrip.com',
  prefixInvoice: 'INV',
  prefixPayment: 'PAY',
  prefixRefund: 'RFD',
  paymentInstruction: `Pembayaran dilakukan sesuai nominal dan batas waktu yang tercantum pada invoice melalui rekening atau metode pembayaran resmi PT Swarna Dipa Wisata (Nuzultrip).
Pastikan nomor invoice dan nama pemesan/jamaah/peserta sesuai sebelum melakukan pembayaran.
Pembayaran dinyatakan sah setelah dana berhasil diterima dan terverifikasi pada rekening atau sistem pembayaran resmi perusahaan.
Untuk pembayaran DP atau pembayaran sebagian, sisa tagihan wajib dilunasi paling lambat pada Tanggal Batas Pelunasan yang tercantum pada invoice.`,
};

export const DEFAULT_LEGAL_TERMS_TEXT = `SYARAT & KETENTUAN PENDAFTARAN, PEMBAYARAN, PEMBATALAN, REFUND, DAN PELAKSANAAN PERJALANAN

PT SWARNA DIPA WISATA (NUZULTRIP)
Berlaku untuk layanan Umrah, Umrah Plus, Halal Tour, dan Land Arrangement

Syarat dan Ketentuan ini merupakan bagian yang tidak terpisahkan dari formulir pendaftaran, quotation, booking, invoice, bukti pembayaran, itinerary, dan/atau dokumen transaksi yang diterbitkan oleh PT Swarna Dipa Wisata ("Nuzultrip").

Dengan melakukan pendaftaran, konfirmasi pemesanan, pembayaran uang muka (DP), pembayaran sebagian, atau pelunasan, pelanggan/jamaah/peserta menyatakan telah membaca, memahami, dan menyetujui Syarat dan Ketentuan ini sesuai produk atau layanan yang dipesan.

PASAL 1 — RUANG LINGKUP
Syarat dan Ketentuan ini berlaku terhadap produk dan layanan Nuzultrip yang meliputi:
a. Umrah;
b. Umrah Plus;
c. Halal Tour; dan
d. Land Arrangement.
Fasilitas, harga, jadwal, itinerary, akomodasi, transportasi dan komponen layanan yang diperoleh pelanggan mengikuti produk, paket, quotation, booking, atau invoice yang disepakati.
Ketentuan khusus yang tercantum pada paket, quotation, kontrak, invoice atau dokumen transaksi merupakan bagian yang tidak terpisahkan dari Syarat dan Ketentuan ini.

PASAL 2 — MEKANISME PENDAFTARAN
Pendaftaran dilakukan melalui kanal resmi Nuzultrip atau perwakilan yang telah memperoleh kewenangan dari perusahaan.
Calon pelanggan/jamaah/peserta wajib memberikan data yang benar, lengkap, valid, dan dapat dipertanggungjawabkan.
Data pendaftaran sekurang-kurangnya dapat meliputi nama lengkap, nomor identitas, nomor paspor, tanggal lahir, alamat, nomor telepon, email, kontak darurat, serta data lain yang diperlukan sesuai jenis perjalanan.
Untuk perjalanan yang memerlukan paspor, visa atau dokumen keimigrasian, peserta wajib menyerahkan dokumen sesuai persyaratan dan batas waktu yang ditetapkan.
Pendaftaran dinyatakan tercatat setelah data yang dipersyaratkan diterima dan transaksi dibuat dalam sistem Nuzultrip.
Pendaftaran yang telah tercatat belum selalu berarti seluruh komponen perjalanan telah terkonfirmasi sampai reservasi dan pembayaran yang dipersyaratkan telah dipenuhi.

PASAL 3 — KONFIRMASI PEMESANAN
Setelah pendaftaran, Nuzultrip dapat menerbitkan quotation, booking confirmation, invoice atau dokumen transaksi lainnya.
Pemesan wajib memeriksa nama peserta, produk, tanggal keberangkatan, jumlah peserta, tipe kamar, fasilitas, harga dan informasi lainnya sebelum melakukan pembayaran.
Kesalahan data wajib segera dilaporkan sebelum tiket, visa, hotel atau layanan terkait ditransaksikan/dikonfirmasi.
Perubahan setelah layanan diterbitkan atau dikonfirmasi dapat menimbulkan biaya sesuai ketentuan penyedia layanan terkait.

PASAL 4 — HARGA DAN KOMPONEN LAYANAN
Harga yang berlaku adalah harga yang tercantum pada invoice, quotation atau dokumen transaksi resmi Nuzultrip.
Harga hanya mencakup fasilitas yang secara tegas dinyatakan termasuk dalam paket atau layanan.
Fasilitas atau pengeluaran yang tidak tercantum sebagai bagian dari paket menjadi tanggung jawab pelanggan/peserta.
Perubahan biaya dari maskapai, hotel, visa, transportasi, ground handler, pajak, fuel surcharge, kurs valuta asing, tiket destinasi atau pihak ketiga lainnya dapat mempengaruhi harga keseluruhan sebelum keberangkatan sesuai kesepakatan tertulis.
Setiap penyesuaian yang berdampak terhadap kewajiban pembayaran pelanggan akan diinformasikan melalui kanal resmi.

PASAL 5 — MEKANISME PEMBAYARAN
Pembayaran wajib dilakukan melalui rekening pembayaran gateway, QRIS atau metode pembayaran resmi yang ditetapkan Nuzultrip.
Pembayaran dapat berupa:
a. uang muka/DP;
b. pembayaran sebagian/cicilan; atau
c. pelunasan.
Besaran DP dan tahapan pembayaran mengikuti paket, quotation, invoice atau kesepakatan transaksi.
Pembayaran dinyatakan sah setelah dana berhasil diterima, teridentifikasi, dan tercatat oleh perusahaan.
Peserta bertanggung jawab atas kebenaran tujuan transfer, nominal, serta biaya administrasi bank/transaksi.
Apabila pembayaran belum dapat diidentifikasi, Nuzultrip berhak meminta bukti transaksi untuk keperluan verifikasi dan rekonsiliasi.
Pembayaran DP atau sebagian bukan merupakan bukti pelunasan.
Pembayaran ke rekening pribadi, pihak, agen, perantara atau metode pembayaran yang tidak ditetapkan atau dikonfirmasi secara resmi oleh perusahaan tidak dianggap sebagai pembayaran kepada Nuzultrip, kecuali pihak tersebut memiliki kewenangan tertulis untuk menerima pembayaran.
Biaya administrasi yang dikenakan bank/payment provider mengikuti ketentuan penyedia pembayaran dan tidak mengurangi kewajiban pembayaran pelanggan kecuali dinyatakan lain.

PASAL 6 — UANG MUKA (DP)
DP merupakan pembayaran awal untuk mengikat pemesanan sesuai ketentuan produk.
Penerimaan DP memberikan kewenangan kepada Nuzultrip untuk memproses reservasi dan/atau pembayaran komponen perjalanan sesuai kebutuhan operasional.
DP bersifat non-refundable (tidak dapat dikembalikan), kecuali ditentukan lain dalam kesepakatan tertulis.
Pengembalian DP apabila terjadi pembatalan tidak otomatis sebesar DP yang dibayarkan dan mengikuti Kebijakan Pembatalan dan Refund yang melekat pada transaksi.

PASAL 7 — PELUNASAN
Sisa pembayaran wajib dilunasi paling lambat pada Tanggal Batas Pelunasan yang tercantum pada invoice.
Pelunasan dinyatakan selesai apabila seluruh nilai transaksi yang menjadi kewajiban pelanggan telah diterima dan tercatat oleh perusahaan.
Setelah pembayaran lunas, sistem dapat menerbitkan status atau dokumen pembayaran LUNAS/PAID.
Bukti pembayaran DP atau sebagian tidak dapat digunakan sebagai bukti pelunasan.

PASAL 8 — KETERLAMBATAN PEMBAYARAN
Pelanggan bertanggung jawab melakukan pembayaran sesuai jadwal.
Apabila pembayaran melewati batas waktu, Nuzultrip berhak melakukan konfirmasi ulang terhadap ketersediaan tiket, hotel, visa, transportasi dan layanan lainnya.
Keterlambatan dapat menyebabkan perubahan harga, fasilitas atau ketersediaan akibat perubahan kondisi penyedia layanan.
Apabila reservasi dibatalkan oleh penyedia layanan akibat keterlambatan pembayaran, penyelesaian transaksi dilakukan berdasarkan kondisi aktual dan biaya yang telah timbul.
Ketentuan ini sesuai dengan struktur batas pelunasan yang sudah ada pada dokumen Anda.

PASAL 9 — DOKUMEN PERJALANAN
Peserta wajib menyerahkan dokumen yang dipersyaratkan secara lengkap dan tepat waktu.
Dokumen dapat mencakup paspor, identitas, foto, visa, dokumen kesehatan dan dokumen lainnya.
Peserta bertanggung jawab atas kebenaran dokumen, keabsahan, masa berlaku, kelayakan fisik dan ketiadaan status tangkal/cekal.
Biaya akibat kesalahan data atau keterlambatan dokumen menjadi tanggung jawab peserta sepanjang bukan disebabkan kesalahan Nuzultrip.

PASAL 10 — VISA DAN IMIGRASI
Penerbitan visa dan izin masuk merupakan kewenangan otoritas terkait.
Nuzultrip hanya membantu proses pengajuan sesuai produk yang dibeli.
Nuzultrip tidak dapat menjamin persetujuan visa apabila keputusan berada pada pemerintah, kedutaan, imigrasi atau otoritas negara tujuan.
Penolakan atau keterlambatan visa diproses berdasarkan kondisi transaksi dan biaya yang telah timbul.

PASAL 11 — PENERBANGAN
Jadwal, maskapai, rute, transit, bagasi dan ketentuan penerbangan mengikuti ketentuan maskapai.
Perubahan jadwal, keterlambatan, pengalihan pesawat, perubahan rute atau pembatalan oleh maskapai berada dalam kewenangan operasional maskapai.
Apabila terjadi perubahan, Nuzultrip akan melakukan koordinasi dan menginformasikan alternatif yang tersedia.

PASAL 12 — HOTEL DAN AKOMODASI
Hotel dan tipe kamar mengikuti paket atau layanan yang dipesan.
Konfigurasi dapat berupa single, double, triple, quad atau konfigurasi lainnya.
Apabila hotel tidak tersedia karena kondisi operasional, dapat dilakukan penggantian dengan mempertimbangkan kategori, lokasi, fasilitas, nilai layanan dan ketersediaan.

PASAL 13 — UMRAH
Perjalanan Umrah dilaksanakan berdasarkan itinerary dan fasilitas paket.
Jamaah wajib memenuhi persyaratan dokumen, kesehatan, visa dan ketentuan lain yang berlaku.
Jamaah wajib mengikuti arahan petugas, tour leader dan pembimbing/mutawwif selama pelaksanaan perjalanan.

PASAL 14 — UMRAH PLUS
Umrah Plus merupakan perjalanan Umrah yang dikombinasikan dengan destinasi tambahan.
Peserta wajib memenuhi persyaratan imigrasi/visa tambahan untuk destinasi lanjutan.
Perubahan regulasi negara tujuan dapat menyebabkan penyesuaian itinerary sesuai kondisi operasional.

PASAL 15 — HALAL TOUR
Halal Tour merupakan perjalanan wisata yang disusun dengan mempertimbangkan kebutuhan wisatawan Muslim.
Fasilitas mencakup makanan halal/ramah muslim, waktu shalat, penginapan dan destinasi ramah Muslim.
Penyebutan Halal Tour tidak dengan sendirinya berarti setiap pihak ketiga memiliki sertifikat halal, kecuali secara eksplisit dinyatakan demikian.
Nuzultrip akan mengupayakan layanan yang sesuai berdasarkan informasi dan ketersediaan pada destinasi.

PASAL 16 — LAND ARRANGEMENT
Land Arrangement ("LA") merupakan layanan perjalanan darat sesuai quotation atau invoice.
LA dapat mencakup hotel, transportasi, makan, guide/mutawwif, ground handling, airport handling, tiket destinasi dan layanan lainnya.
LA tidak otomatis mencakup tiket penerbangan, visa atau asuransi kecuali dinyatakan termasuk.
Harga dapat ditentukan berdasarkan jumlah pax, periode, hotel, tipe kamar, kendaraan, itinerary dan komponen lainnya.
Perubahan jumlah peserta dapat mengubah harga per pax maupun total transaksi.
Pihak pemesan B2B/Travel Partner/pihak pemesan bertanggung jawab atas kebenaran data peserta yang diberikan kepada Nuzultrip.
Ketentuan tersebut konsisten dengan definisi LA yang sudah ada dalam dokumen Anda.

PASAL 17 — PERUBAHAN PESERTA DAN LAYANAN
Perubahan nama, peserta, jumlah pax, bentuk atau layanan harus diajukan melalui kanal resmi.
Perubahan tunduk pada ketersediaan dan ketentuan maskapai, hotel, visa, vendor serta penyedia terkait.
Biaya yang timbul akibat perubahan atas permintaan pelanggan menjadi tanggung jawab pelanggan.

PASAL 18 — PERUBAHAN ITINERARY
Itinerary dapat disesuaikan akibat penerbangan, cuaca, lalu lintas, keamanan, regulasi, kebijakan pemerintah, penutupan destinasi atau kondisi operasional lainnya.
Nuzultrip akan mengupayakan alternatif yang wajar sesuai kondisi aktual.
Penyesuaian itinerary yang diperlukan untuk menjaga keselamatan atau kelancaran tidak dengan sendirinya merupakan pembatalan perjalanan.

PASAL 19 — MEKANISME PEMBATALAN
Pembatalan oleh pelanggan/jamaah/peserta wajib diajukan melalui kanal resmi Nuzultrip.
Permohonan sekurang-kurangnya memuat:
a. nama pemesan;
b. nomor invoice/booking;
c. nama peserta;
d. alasan pembatalan; dan
e. dokumen pendukung apabila diperlukan.
Tanggal permohonan pembatalan diterima dan tercatat secara resmi menjadi tanggal acuan perhitungan.
Pembatalan tidak otomatis memberikan hak atas pengembalian seluruh dana.
Nilai refund mengikuti kebijakan refund yang melekat pada transaksi serta komponen biaya yang telah digunakan atau tidak dapat dikembalikan.
Ini mempertahankan mekanisme pembatalan yang sebelumnya sudah Anda tetapkan.

PASAL 20 — MEKANISME REFUND
Pelanggan yang memenuhi ketentuan dapat mengajukan permohonan refund setelah pembatalan tercatat.
Nuzultrip melakukan verifikasi terhadap:
a. transaksi dan pembayaran;
b. tanggal pembatalan;
c. dokumen pendukung;
d. biaya-biaya yang telah dikeluarkan dan tidak dapat dikembalikan (non-refundable) oleh maskapai, hotel, visa, ground handling, atau vendor lainnya; dan
e. persentase pengembalian dana berdasarkan tenggang waktu menuju tanggal keberangkatan.`;
