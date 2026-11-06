/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PROFILE_INFO } from "../data/profileData";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-brand-900 via-emerald-950 to-brand-950 text-emerald-100 py-10 border-t border-emerald-800/60 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-pattern pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/80 gap-5 text-center sm:text-left">
          <div className="space-y-1.5">
            <p className="font-bold text-white text-sm">
              &copy; 2026 {PROFILE_INFO.name} —{" "}
              <span className="text-emerald-300 font-semibold">
                {PROFILE_INFO.spec}
              </span>
            </p>
            <p className="text-xs text-emerald-200/70">
              Menghidupkan literasi faroidh berbasis teknologi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-300 font-medium mr-1 hidden sm:inline-block text-xs">
              Temukan saya di:
            </span>
            <a
              href={PROFILE_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-emerald-900/90 hover:bg-brand-600 text-emerald-200 hover:text-white flex items-center justify-center transition-all border border-emerald-700/60 shadow-sm hover:scale-105"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook-f text-sm"></i>
            </a>
            <a
              href={PROFILE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-emerald-900/90 hover:bg-brand-600 text-emerald-200 hover:text-white flex items-center justify-center transition-all border border-emerald-700/60 shadow-sm hover:scale-105"
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
