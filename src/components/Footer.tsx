/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PROFILE_INFO } from "../data/profileData";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-white/90 via-emerald-50/30 to-emerald-50/60 dark:bg-gradient-to-b dark:from-slate-950 dark:via-[#09151e] dark:to-[#050e14] text-gray-700 dark:text-slate-200 py-7 sm:py-8 border-t border-emerald-100/80 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-pattern pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs gap-5 text-center sm:text-left">
          <div className="space-y-1.5">
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              &copy; {new Date().getFullYear()} {PROFILE_INFO.name} —{" "}
              <span className="text-brand-700 dark:text-emerald-400 font-semibold">
                {PROFILE_INFO.spec}
              </span>
            </p>
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Menghidupkan literasi faroidh berbasis teknologi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-700 dark:text-slate-300 font-medium mr-1 hidden sm:inline-block text-xs">
              Temukan saya di:
            </span>
            <a
              href={PROFILE_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900/90 text-brand-700 dark:text-emerald-300 hover:bg-brand-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white flex items-center justify-center transition-all border border-emerald-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:scale-105 active:scale-95"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook-f text-sm"></i>
            </a>
            <a
              href={PROFILE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900/90 text-brand-700 dark:text-emerald-300 hover:bg-brand-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white flex items-center justify-center transition-all border border-emerald-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:scale-105 active:scale-95"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram text-sm"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
