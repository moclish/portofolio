/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PROFILE_INFO } from '../data/profileData';
import { formatPortfolioImageUrl } from '../utils/imageHelper';

export const Hero: React.FC = () => {
  const [photoError, setPhotoError] = useState(false);
  const formattedPhotoUrl = PROFILE_INFO.photoUrl
    ? formatPortfolioImageUrl(PROFILE_INFO.photoUrl)
    : '';

  return (
    <section
      id="beranda"
      className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden bg-pattern scroll-mt-24 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sunshine-400/20 dark:bg-sunshine-500/15 text-sunshine-600 dark:text-sunshine-400 font-semibold text-sm border border-sunshine-400/30 dark:border-sunshine-500/30">
              <i className="fa-solid fa-sparkles text-sunshine-500"></i>
              <span>Rasulullah ﷺ bersabda:</span>
            </div>

            <h1 className="text-[1.7rem] sm:text-4xl lg:text-[2.5rem] font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight capitalize">
              "Berikanlah bagian{' '}
              <span className="bg-gradient-to-r from-brand-600 via-emerald-500 to-sunshine-500 dark:from-brand-400 dark:via-emerald-400 dark:to-sunshine-400 bg-clip-text text-transparent inline-block">
                warisan
              </span>{' '}
              kepada{' '}
              <span className="bg-gradient-to-r from-brand-600 via-emerald-500 to-sunshine-500 dark:from-brand-400 dark:via-emerald-400 dark:to-sunshine-400 bg-clip-text text-transparent inline-block">
                yang berhak..."
              </span>
            </h1>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-brand-700 dark:text-brand-400 font-bold text-sm mt-3.5">
              <i className="fa-solid fa-book-open text-brand-500"></i>
              <span> HR. Bukhari (6.732) & Muslim (1.615)</span>
            </div>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mt-2">
              Seorang pendidik mata pelajaran fikih waris yang komitmen menghadirkan
              pembelajaran yang kontekstual, menyenangkan, dan relevan dengan
              kehidupan bermasyarakat
            </p>

            {/* Key highlights badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800/90 shadow-sm border border-emerald-100 dark:border-slate-700 text-xs font-semibold text-brand-800 dark:text-emerald-300">
                <i className="fa-solid fa-graduation-cap text-brand-600 dark:text-brand-400"></i>
                Alumnus LIPIA Jakarta
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800/90 shadow-sm border border-amber-100 dark:border-slate-700 text-xs font-semibold text-amber-800 dark:text-amber-300">
                <i className="fa-solid fa-award text-sunshine-500"></i> Certified
                Gemini Educator
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800/90 shadow-sm border border-blue-100 dark:border-slate-700 text-xs font-semibold text-blue-800 dark:text-blue-300">
                <i className="fa-solid fa-book-quran text-blue-600 dark:text-blue-400"></i> Waris
                Enthusiast
              </span>
            </div>

            {/* Call to Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#tentang"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-600/30 hover:bg-brand-700 hover:shadow-xl transition-all text-center flex items-center justify-center gap-2 group"
              >
                <span>Yuk Kenalan!</span>
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </a>
              <a
                href="#simulator"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-semibold border border-gray-200 dark:border-slate-700 shadow-sm hover:border-brand-500 dark:hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-all text-center flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-calculator text-brand-600 dark:text-brand-400"></i>
                Hitung Warisan
              </a>
            </div>
          </div>

          {/* Visual Profile Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 dark:bg-emerald-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-40 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-sunshine-400 dark:bg-amber-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-40 animate-pulse delay-1000"></div>

              <div className="relative bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-emerald-50 dark:border-slate-800 space-y-6 transition-colors duration-300">
                <div className="text-center relative">
                  {/* Symmetrical, aesthetic avatar with hair-safe crop and right-click protection */}
                  <div
                    className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-full bg-gradient-to-tr from-brand-600 via-emerald-500 to-sunshine-400 p-1.5 sm:p-2 shadow-2xl relative select-none group"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <div
                      className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden relative ring-2 ring-white/90 dark:ring-slate-800 shadow-inner"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      {formattedPhotoUrl && !photoError ? (
                        <>
                          <img
                            src={formattedPhotoUrl}
                            alt={PROFILE_INFO.name}
                            onError={() => setPhotoError(true)}
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-full h-full object-cover rounded-full select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
                            style={{
                              objectPosition: '50% 12%',
                              WebkitTouchCallout: 'none',
                              WebkitUserSelect: 'none',
                              userSelect: 'none',
                            }}
                          />
                          {/* Invisible shield to completely block right-click, context menu, and tap-and-hold downloads */}
                          <div
                            className="absolute inset-0 z-10 rounded-full bg-transparent select-none cursor-default"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
                            aria-hidden="true"
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-emerald-50 dark:bg-slate-800 flex flex-col items-center justify-center text-brand-700 dark:text-brand-300 select-none">
                          <i className="fa-solid fa-user-tie text-5xl sm:text-6xl mb-1"></i>
                        </div>
                      )}
                    </div>
                    <span
                      className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 z-20 bg-gradient-to-br from-sunshine-400 to-sunshine-600 text-white p-2 sm:p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-800 text-xs sm:text-sm flex items-center justify-center transition-transform hover:scale-110"
                      title="Gemini Certified Educator 2026"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">
                    {PROFILE_INFO.name}
                  </h3>
                  <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
                    {PROFILE_INFO.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    <i className="fa-solid fa-location-dot text-rose-500 mr-1"></i>
                    {PROFILE_INFO.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/70 border border-emerald-100 dark:border-slate-700 text-center">
                    <span className="block text-2xl font-black text-brand-700 dark:text-emerald-400">
                      7+ Tahun
                    </span>
                    <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">
                      Pengabdian
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-slate-800/70 border border-amber-100 dark:border-slate-700 text-center">
                    <span className="block text-2xl font-black text-amber-700 dark:text-amber-400">
                      100%
                    </span>
                    <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">
                      Integrasi Edu Tech
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-gray-600 dark:text-slate-300 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-slate-800 text-brand-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-school"></i>
                    </div>
                    <span className="truncate">{PROFILE_INFO.school}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
