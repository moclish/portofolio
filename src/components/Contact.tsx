/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PROFILE_INFO } from "../data/profileData";

interface ContactProps {
  onShowToast: (msg: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const [senderName, setSenderName] = useState("");
  const [senderOrg, setSenderOrg] = useState("");
  const [msgTopic, setMsgTopic] = useState("Konsultasi Fikih Waris (Faroid)");
  const [senderMessage, setSenderMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSentSuccess, setIsSentSuccess] = useState(false);

  const handleCopyEmail = (email: string) => {
    const markSuccess = () => {
      setIsCopied(true);
      onShowToast("Alamat email berhasil disalin ke clipboard!");
      setTimeout(() => setIsCopied(false), 2500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(email)
        .then(markSuccess)
        .catch(() => {
          fallbackCopy(email, markSuccess);
        });
    } else {
      fallbackCopy(email, markSuccess);
    }
  };

  const fallbackCopy = (text: string, onSuccess: () => void) => {
    try {
      const temp = document.createElement("input");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      onSuccess();
    } catch {
      onShowToast("Gagal menyalin. Silakan salin email secara manual.");
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSending) return;

    if (!senderName.trim()) {
      onShowToast("Mohon cantumkan nama lengkap Anda.");
      return;
    }
    if (!senderMessage.trim()) {
      onShowToast("Mohon tuliskan pesan Anda terlebih dahulu.");
      return;
    }

    setIsSending(true);

    const orgLine = senderOrg.trim() ? ` dari *${senderOrg.trim()}*` : "";
    const text = `Assalamu'alaikum Ust. Sadono, Lc.\n\nPerkenalkan saya *${senderName.trim()}*${orgLine}.\n\n*Topik:* ${msgTopic}\n*Pesan:*\n${senderMessage.trim()}\n\nTerima kasih.`;
    const waUrl = `https://wa.me/${PROFILE_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;

    // Buka WhatsApp di tab baru secara langsung (terhindar dari pemblokir popup)
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // Animasi proses pengiriman dan update status responsif
    setTimeout(() => {
      setIsSending(false);
      setIsSentSuccess(true);

      // Reset form inputan
      setSenderName("");
      setSenderOrg("");
      setSenderMessage("");
      setMsgTopic("Konsultasi Fikih Waris (Faroid)");

      // Tampilkan notifikasi toast berhasil
      onShowToast("Pesan telah berhasil dikirim!");

      // Kembalikan tombol ke keadaan normal setelah beberapa detik
      setTimeout(() => {
        setIsSentSuccess(false);
      }, 3500);
    }, 700);
  };

  const directWaGreeting = encodeURIComponent(
    "Assalamu'alaikum Ust. Sadono, Lc., saya ingin bersilaturahmi dan berdiskusi.",
  );

  return (
    <section
      id="kontak"
      className="py-20 bg-warmbg relative overflow-hidden scroll-mt-[5px]"
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-100/40 via-emerald-50/20 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sunshine-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 text-brand-800 text-xs font-bold tracking-wide uppercase border border-emerald-200 shadow-xs mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Silaturahmi & Kolaborasi
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Kontak Saya
          </h2>
          <p className="text-gray-600 mt-3.5 text-sm sm:text-base leading-relaxed">
            Terbuka untuk silaturahmi, konsultasi fikih waris atau kerja sama
            akademis
          </p>
        </div>

        {/* Symmetrical & Aesthetic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Contact Cards & Direct Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Consultation Status Badge (Symmetrical & Mobile Friendly) */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50/80 border border-emerald-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="relative flex h-3.5 w-3.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider truncate">
                    Mari Berdiskusi
                  </h4>
                  <p className="text-[11px] sm:text-xs text-emerald-800 font-medium truncate">
                    Respon aktif via WhatsApp
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-center">
                <span className="text-[11px] font-bold bg-white/95 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs whitespace-nowrap text-center">
                  1x24 Jam
                </span>
              </div>
            </div>

            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${PROFILE_INFO.whatsappNumber}?text=${directWaGreeting}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/90 hover:border-emerald-400 hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-center justify-between relative z-10 gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md shadow-emerald-500/20 group-hover:scale-105 group-hover:bg-emerald-600 transition-all shrink-0">
                    <i className="fa-brands fa-whatsapp"></i>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                      WhatsApp
                    </span>
                    <span className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors block truncate">
                      {PROFILE_INFO.whatsappDisplay}
                    </span>
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 mt-0.5">
                      <i className="fa-regular fa-comment-dots"></i> Buka
                      obrolan instan
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-brand-600 group-hover:text-white text-brand-700 flex items-center justify-center text-xs transition-colors shrink-0">
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </div>
              </div>
            </a>

            {/* Email Card (Inline Symmetrical Layout with Copy Button) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/90 hover:border-amber-400 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/20 shrink-0">
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Email
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 truncate block font-mono">
                    {PROFILE_INFO.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyEmail(PROFILE_INFO.email)}
                className={`shrink-0 py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isCopied
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-amber-50/80 hover:bg-amber-100 text-amber-900 border-amber-200/80 shadow-2xs"
                }`}
                title="Salin Alamat Email"
              >
                <i
                  className={`fa-solid ${isCopied ? "fa-check text-xs" : "fa-copy text-xs"}`}
                ></i>
                <span>{isCopied ? "Tersalin" : "Salin"}</span>
              </button>
            </div>

            {/* Domisili Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-600/20 shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Domisili
                </span>
                <span className="text-sm sm:text-base font-extrabold text-gray-900 block truncate">
                  {PROFILE_INFO.location}
                </span>
              </div>
            </div>

            {/* Media Sosial & Kanal Dakwah Resmi (Menyeimbangkan Tinggi Kolom) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-brand-700 flex items-center justify-center text-sm shrink-0">
                  <i className="fa-solid fa-share-nodes"></i>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Media Sosial
                  </h5>
                  <p className="text-[11px] text-gray-500">
                    Temukan saya di media sosial
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                {/* Facebook */}
                <a
                  href={PROFILE_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-100/90 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                      <i className="fa-brands fa-facebook-f"></i>
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-gray-900 block group-hover:text-blue-700 transition-colors">
                        Facebook
                      </span>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-blue-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"></i>
                </a>

                {/* Instagram */}
                <a
                  href={PROFILE_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-rose-50/60 hover:bg-rose-100/70 border border-rose-100/90 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-sm shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                      <i className="fa-brands fa-instagram"></i>
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-gray-900 block group-hover:text-rose-700 transition-colors">
                        Instagram
                      </span>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-rose-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Clean Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
              {/* Form Title & Description */}
              <div className="mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  Kirim Pesan
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Isi formulir di bawah ini untuk mengirimkan pesan via WhatsApp
                </p>
              </div>

              {/* Contact Form */}
              <form
                onSubmit={handleContactSubmit}
                className="space-y-4 sm:space-y-4.5"
              >
                {/* Name & Organization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <i className="fa-regular fa-user text-xs"></i>
                      </div>
                      <input
                        type="text"
                        required
                        disabled={isSending}
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="Ahmad Fauzi"
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-warmbg/40 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none text-sm transition-all text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Lembaga/Instansi{" "}
                      <span className="text-gray-400 font-normal">
                        (Opsional)
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <i className="fa-solid fa-building-columns text-xs"></i>
                      </div>
                      <input
                        type="text"
                        disabled={isSending}
                        value={senderOrg}
                        onChange={(e) => setSenderOrg(e.target.value)}
                        placeholder="MAS Nurul Huda"
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-warmbg/40 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none text-sm transition-all text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Topic Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Subjek <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      disabled={isSending}
                      value={msgTopic}
                      onChange={(e) => setMsgTopic(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-warmbg/40 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none text-sm transition-all text-gray-900 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="Konsultasi Fikih Waris (Faroid)">
                        ⚖️ Konsultasi Fikih Waris
                      </option>
                      <option value="Kerja Sama Akademik & Lembaga">
                        🤝 Kerja Sama Akademik
                      </option>
                      <option value="Pertanyaan Umum">
                        💬 Pertanyaan Umum
                      </option>
                      <option value="Kritik & Masukan Terkait Kalkulator Waris">
                        ⚙️ Masukan Terkait Aplikasi Kalkulator Waris
                      </option>
                    </select>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Pesan <span className="text-red-500">*</span>
                    </label>
                    {senderMessage.length > 0 && (
                      <span className="text-[11px] text-gray-400">
                        {senderMessage.length} karakter
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    required
                    disabled={isSending}
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-warmbg/40 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none text-sm transition-all text-gray-900 leading-relaxed resize-y disabled:opacity-60 disabled:cursor-not-allowed"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden select-none ${
                      isSending
                        ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-700 text-white cursor-wait opacity-95 shadow-brand-600/20"
                        : isSentSuccess
                          ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                          : "bg-gradient-to-r from-emerald-600 via-brand-600 to-teal-700 hover:from-emerald-700 hover:via-brand-700 hover:to-teal-800 text-white shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transform active:scale-[0.99] cursor-pointer group"
                    }`}
                  >
                    {isSending ? (
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span className="tracking-wide">
                          Sedang Menghubungkan ke WhatsApp...
                        </span>
                      </div>
                    ) : isSentSuccess ? (
                      <div className="flex items-center gap-2.5">
                        <i className="fa-solid fa-circle-check text-xl text-emerald-200"></i>
                        <span className="tracking-wide">
                          Pesan Berhasil Diteruskan!
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <i className="fa-brands fa-whatsapp text-xl transition-transform group-hover:scale-110"></i>
                        <span>Kirim via WhatsApp</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
