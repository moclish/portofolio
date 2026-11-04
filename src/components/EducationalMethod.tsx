/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const EducationalMethod: React.FC = () => {
  return (
    <section id="tentang" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-600 font-bold text-sm uppercase tracking-wider bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100">
            Mengenal Lebih Dekat
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            Metode Mendidik
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-brand-500 to-sunshine-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-warmbg border border-orange-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform shadow-md">
              <i className="fa-solid fa-heart-pulse"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Pendekatan Warm & Empatis
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Menjadi pendidik bukan sekadar mentransfer ilmu, melainkan
              membimbing santri memahami hikmah di balik syariat Islam dengan
              suasana belajar yang ramah, terbuka, dan inklusif.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-warmbg border border-emerald-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform shadow-md">
              <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Spesialisasi Fikih Waris
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Mengurai kompleksitas ilmu fikih waris menjadi konsep praktis yang
              mudah dicerna oleh generasi muda melalui ilustrasi diagram, studi
              kasus riil, dan penerapan logika yang runtut.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-warmbg border border-blue-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform shadow-md">
              <i className="fa-solid fa-robot"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Pemanfaatan AI & Teknologi
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Sebagai <em>Certified Gemini Educator</em>, aktif memanfaatkan
              kecerdasan buatan dan alat digital untuk memodernisasi
              pembelajaran dan media mengajar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
