/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EDUCATION_HISTORY } from '../data/profileData';

export const Education: React.FC = () => {
  const getEduFooterBadgeStyle = (idx: number) => {
    switch (idx) {
      case 0:
        // LIPIA - Emerald / Syari'ah
        return "bg-brand-50 text-brand-700 border border-brand-200/80 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60";
      case 1:
        // LSIA - Amber / Bahasa Arab
        return "bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/60";
      case 2:
        // MAS AL FURQON - Blue / IPS & Pesantren
        return "bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800/60";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const getEduIconBgStyle = (idx: number) => {
    switch (idx) {
      case 0:
        return "bg-brand-100 text-brand-700 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/60";
      case 1:
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-800/60";
      case 2:
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 dark:border dark:border-blue-800/60";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <section id="pendidikan" className="py-20 bg-white dark:bg-slate-900 scroll-mt-[5px] border-t border-emerald-100/50 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-brand-600 dark:text-brand-400 font-bold text-sm uppercase tracking-wider bg-brand-50 dark:bg-slate-800 px-4 py-1.5 rounded-full border border-brand-100 dark:border-slate-700">
            Landasan Keilmuan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-3">
            Riwayat Pendidikan
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-brand-500 to-sunshine-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {EDUCATION_HISTORY.map((edu, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 lg:p-7 xl:p-8 rounded-3xl bg-warmbg dark:bg-slate-800/70 border border-emerald-100 dark:border-slate-700/80 hover:border-brand-500 dark:hover:border-emerald-500/80 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${getEduIconBgStyle(idx)} flex items-center justify-center text-lg sm:text-xl font-bold mb-5 sm:mb-6 shadow-xs transition-colors`}
                >
                  <i className={`fa-solid ${edu.iconClass}`}></i>
                </div>
                <span className="text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
                  {edu.degree}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mt-1 leading-snug">
                  {edu.institution}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                  {edu.subname}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-3.5 sm:mt-4 leading-relaxed">
                  {edu.description}
                </p>
              </div>

              {/* Card Footer: 1 baris di Mobile & Desktop, 2 baris di Tablet */}
              <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-gray-200/70 dark:border-slate-700/80 flex flex-row items-center justify-between md:flex-col md:items-start lg:flex-row lg:items-center lg:justify-between gap-2 md:gap-2.5 lg:gap-2 text-xs font-semibold w-full">
                <span className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 shrink-0 whitespace-nowrap">
                  <i className="fa-regular fa-calendar text-[11px] text-gray-400 dark:text-emerald-400/80 shrink-0"></i>
                  <span className="font-medium text-gray-600 dark:text-slate-300 text-[11px] sm:text-xs">
                    {edu.period}
                  </span>
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-colors shadow-2xs shrink-0 whitespace-nowrap self-auto md:self-start lg:self-auto ${getEduFooterBadgeStyle(
                    idx,
                  )}`}
                >
                  <i className="fa-solid fa-location-dot text-[10px] opacity-75 shrink-0"></i>
                  <span>{edu.location}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
