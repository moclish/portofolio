/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PROFILE_INFO } from '../data/profileData';

interface ContactProps {
  onShowToast: (msg: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const [senderName, setSenderName] = useState('');
  const [senderOrg, setSenderOrg] = useState('');
  const [msgTopic, setMsgTopic] = useState('Diskusi Fikih Waris (Faroid)');
  const [senderMessage, setSenderMessage] = useState('');

  const handleCopyEmail = (email: string) => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        onShowToast('Alamat email berhasil disalin ke clipboard!');
      })
      .catch(() => {
        const temp = document.createElement('input');
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        onShowToast('Alamat email berhasil disalin ke clipboard!');
      });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Assalamu'alaikum Ust. Sadono, Lc.\n\nPerkenalkan saya *${senderName}* dari *${
      senderOrg || '-'
    }*.\n\n*Topik Keperluan:* ${msgTopic}\n*Pesan:* ${senderMessage}\n\nTerima kasih.`;
    window.open(
      `https://wa.me/${PROFILE_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
    onShowToast('Mengarahkan ke WhatsApp...');
  };

  return (
    <section id="kontak" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-brand-600 font-bold text-sm uppercase tracking-wider bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100">
                Mari Bersilaturahmi
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
                Hubungi Saya
              </h2>
              <p className="text-gray-600 mt-3 leading-relaxed text-sm">
                Terbuka untuk diskusi akademis maupun konsultasi Waris
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={`https://wa.me/${PROFILE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-warmbg border border-emerald-100 hover:bg-emerald-50 hover:border-brand-300 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    WhatsApp
                  </span>
                  <span className="text-base font-extrabold text-gray-900 group-hover:text-brand-700 transition-colors">
                    {PROFILE_INFO.whatsappDisplay}
                  </span>
                </div>
              </a>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-warmbg border border-amber-100 group">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                    <i className="fa-regular fa-envelope"></i>
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                      Email
                    </span>
                    <span className="text-sm font-extrabold text-gray-900 truncate block font-mono">
                      {PROFILE_INFO.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyEmail(PROFILE_INFO.email)}
                  className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-brand-600 hover:border-brand-500 transition-colors ml-2 cursor-pointer"
                  title="Salin Email"
                >
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-warmbg border border-blue-100">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl flex-shrink-0">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Domisili
                  </span>
                  <span className="text-base font-extrabold text-gray-900">
                    {PROFILE_INFO.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-warmbg p-6 sm:p-10 rounded-3xl border border-gray-200/80 shadow-lg relative">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Kirim Pesan</h3>
              <p className="text-xs text-gray-600 mb-6">
                Isi formulir di bawah ini untuk mengirimkan pesan secara langsung
                via WhatsApp
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Contoh: Ahmad Fauzi"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Instansi/Lembaga
                    </label>
                    <input
                      type="text"
                      value={senderOrg}
                      onChange={(e) => setSenderOrg(e.target.value)}
                      placeholder="Contoh: MAS Nurul Huda"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Topik Keperluan
                  </label>
                  <select
                    value={msgTopic}
                    onChange={(e) => setMsgTopic(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm bg-white"
                  >
                    <option value="Diskusi Fikih Waris (Faroid)">
                      Diskusi/Konsultasi Waris
                    </option>
                    <option value="Silaturahmi & Akademik">
                      Kerja Sama Akademik
                    </option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pesan Anda
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="Tuliskan pesan Anda di sini..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i> Kirim via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
