import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Reply,
  ExternalLink,
  Filter,
  User,
  Phone,
  Mail,
  PieChart,
  Send,
  X,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { realtimeStore, InquiryMessage } from '../../services/realtimeStore';

export const MessagesInquiriesView: React.FC = () => {
  const [messages, setMessages] = useState<InquiryMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'replied'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<InquiryMessage | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [broadcastSubject, setBroadcastSubject] = useState<string>('');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setMessages(realtimeStore.getMessages());
    };
    update();
    const unsub = realtimeStore.subscribe(update);
    return () => unsub();
  }, []);

  const triggerAlert = (msg: string) => {
    setAlertSuccess(msg);
    setTimeout(() => setAlertSuccess(null), 4000);
  };

  const handleSelectMessage = (msg: InquiryMessage) => {
    setSelectedMessage(msg);
    setReplyText(msg.replyNote || '');
    if (msg.status === 'unread') {
      realtimeStore.markMessageRead(msg.id);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    await realtimeStore.replyMessage(selectedMessage.id, replyText.trim());
    setSelectedMessage((prev) =>
      prev ? { ...prev, status: 'replied', replyNote: replyText.trim() } : null
    );
    triggerAlert(`Tanggapan berhasil disimpan dan dicatat untuk ${selectedMessage.senderName}.`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus pesan dari ${name}?`)) {
      await realtimeStore.deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      triggerAlert(`Pesan dari ${name} telah dihapus.`);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastMessage) return;

    await realtimeStore.addMessage({
      senderName: 'Manajemen PT. Swarna Dipa Wisata',
      senderPhone: '+62 812-4411-9988',
      senderEmail: 'equity@nuzultrip.com',
      category: 'umum',
      subject: `[BROADCAST] ${broadcastSubject}`,
      message: broadcastMessage,
    });

    realtimeStore.addAuditLog({
      action: 'Broadcast Pesan ke Investor',
      category: 'PORTAL',
      user: 'ayobisnisumrah@gmail.com',
      details: `Broadcast: ${broadcastSubject}`,
      status: 'success',
    });

    setShowBroadcastModal(false);
    setBroadcastSubject('');
    setBroadcastMessage('');
    triggerAlert('Pesan broadcast berhasil diterbitkan ke portal investor.');
  };

  const filteredMessages = messages.filter((m) => {
    if (activeTab === 'unread' && m.status !== 'unread') return false;
    if (activeTab === 'replied' && m.status !== 'replied') return false;
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.senderName.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        m.senderPhone.includes(q) ||
        m.senderEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Alert toast */}
      {alertSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs">
          <span>✓ {alertSuccess}</span>
          <button onClick={() => setAlertSuccess(null)} className="p-1 hover:text-emerald-950">
            <X size={14} />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Pesan Masuk & Konsultasi Investor
                </h3>
                <p className="text-xs text-slate-500">
                  Kelola permohonan minat unit, pertanyaan dividen, dan komunikasi calon investor.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>Buat Pengumuman / Broadcast</span>
            </button>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
              Total Pesan Masuk
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{messages.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Semua komunikasi tercatat</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            <div className="text-[10.5px] font-bold text-amber-800 uppercase tracking-wider">
              Menunggu Tanggapan
            </div>
            <div className="text-2xl font-black text-amber-900 mt-1">{unreadCount}</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Perlu tindak lanjut admin</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-wider">
              Telah Dibalas
            </div>
            <div className="text-2xl font-black text-emerald-900 mt-1">
              {messages.filter((m) => m.status === 'replied').length}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Responsif via WhatsApp / Email</div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: LIST */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          {/* SEARCH & FILTERS */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pengirim, subjek, no HP..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({messages.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('unread')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'unread'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <span>Belum Dibaca</span>
                {unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-amber-600 text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('replied')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'replied'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Dibalas
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter size={13} className="text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">Semua Kategori</option>
                <option value="equity_interest">Pengajuan Minat Equity</option>
                <option value="bagi_hasil">Pertanyaan Bagi Hasil</option>
                <option value="legalitas">Legalitas & Notariat</option>
                <option value="umum">Umum & Konsultasi</option>
              </select>
            </div>
          </div>

          {/* LIST ITEMS */}
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Tidak ada pesan yang sesuai filter.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3 rounded-2xl transition-all cursor-pointer mb-1 border ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : msg.status === 'unread'
                        ? 'bg-amber-50/40 border-amber-200 hover:bg-amber-50/70'
                        : 'bg-white border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 truncate">
                        {msg.status === 'unread' && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        )}
                        <span className="truncate">{msg.senderName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{msg.createdAt}</span>
                    </div>

                    <div className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                      {msg.subject}
                    </div>

                    <p className="text-[11.5px] text-slate-500 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100/80">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider">
                        {msg.category.replace('_', ' ')}
                      </span>

                      {msg.requestedUnits && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                          {msg.requestedUnits} Unit Saham
                        </span>
                      )}

                      {msg.status === 'replied' && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle size={11} /> Dibalas
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL & REPLY */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          {selectedMessage ? (
            <div className="space-y-5">
              {/* Header of selected message */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-mono text-slate-400">
                      ID: {selectedMessage.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                      {selectedMessage.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedMessage.status === 'unread'
                          ? 'bg-amber-100 text-amber-800'
                          : selectedMessage.status === 'replied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {selectedMessage.status === 'unread'
                        ? 'Belum Dibaca'
                        : selectedMessage.status === 'replied'
                        ? 'Sudah Dibalas'
                        : 'Terbaca'}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedMessage.subject}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Diterima pada: {selectedMessage.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(selectedMessage.id, selectedMessage.senderName)
                    }
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                    title="Hapus pesan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* SENDER CONTACT CARD */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Nama Pengirim
                  </div>
                  <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" />
                    <span>{selectedMessage.senderName}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Nomor WhatsApp / Telepon
                  </div>
                  <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <Phone size={13} className="text-emerald-600" />
                    <a
                      href={`https://wa.me/${selectedMessage.senderPhone.replace(
                        /[^0-9]/g,
                        ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline"
                    >
                      {selectedMessage.senderPhone}
                    </a>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Alamat Email
                  </div>
                  <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <Mail size={13} className="text-slate-400" />
                    <a
                      href={`mailto:${selectedMessage.senderEmail}`}
                      className="text-blue-700 hover:underline"
                    >
                      {selectedMessage.senderEmail}
                    </a>
                  </div>
                </div>

                {selectedMessage.requestedUnits && (
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      Permohonan Unit Saham
                    </div>
                    <div className="font-bold text-emerald-800 mt-0.5 flex items-center gap-1.5">
                      <PieChart size={13} className="text-emerald-600" />
                      <span>
                        {selectedMessage.requestedUnits} Unit (Rp{' '}
                        {(
                          selectedMessage.requestedUnits * 100000000
                        ).toLocaleString('id-ID')}
                        )
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* MESSAGE CONTENT */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Isi Pesan / Konsultasi:</div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line shadow-2xs">
                  {selectedMessage.message}
                </div>
              </div>

              {/* QUICK WHATSAPP ACTION BUTTON */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-emerald-900">
                    Hubungi Langsung via WhatsApp Resmi
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Buka percakapan WhatsApp dengan teks pembuka otomatis.
                  </div>
                </div>
                <a
                  href={`https://wa.me/${selectedMessage.senderPhone.replace(
                    /[^0-9]/g,
                    ''
                  )}?text=Assalamu%20alaikum%20${encodeURIComponent(
                    selectedMessage.senderName
                  )},%20kami%20dari%20Investor%20Relations%20PT.%20Swarna%20Dipa%20Wisata%20(Nuzultrip)%20menanggapi%20pertanyaan%20Anda%20mengenai%20${encodeURIComponent(
                    selectedMessage.subject
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-xs cursor-pointer text-xs shrink-0"
                >
                  <Send size={13} />
                  <span>Kirim Pesan WhatsApp</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* REPLY FORM */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Reply size={14} className="text-slate-400" />
                    <span>Catatan Tindak Lanjut & Tanggapan Admin</span>
                  </label>
                  {selectedMessage.repliedAt && (
                    <span className="text-[11px] text-slate-400">
                      Terakhir ditanggapi: {selectedMessage.repliedAt}
                    </span>
                  )}
                </div>

                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tuliskan catatan tindak lanjut, kesepakatan pertemuan notaris, atau respons yang telah diberikan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 outline-none leading-relaxed"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <CheckCircle size={14} />
                    <span>Simpan & Tandai Dibalas</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-700">Pilih Pesan</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Klik salah satu pesan di kolom kiri untuk melihat detail permohonan dan memberikan tanggapan langsung.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL BROADCAST */}
      {showBroadcastModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowBroadcastModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-emerald-600" size={20} />
                <h3 className="font-extrabold text-base text-slate-900">
                  Buat Pengumuman / Broadcast Investor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal RUPS Triwulan III dan Dividen Payout"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Isi Pesan Pengumuman
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan detail pengumuman yang akan dikirimkan kepada seluruh investor dan dicatat dalam riwayat komunikasi..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                Pesan ini akan langsung tercatat di konsol hubungan investor dan disimpan di audit log sistem.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send size={14} />
                  <span>Kirim Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
