/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

export const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href="#beranda"
      id="backToTopBtn"
      className={`fixed bottom-6 right-6 z-40 p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-brand-600 to-emerald-700 hover:from-brand-500 hover:to-emerald-600 text-white shadow-xl shadow-brand-900/30 border border-emerald-400/40 transition-all duration-300 flex items-center gap-2 text-xs font-bold group cursor-pointer ${
        show
          ? 'opacity-100 pointer-events-auto translate-y-0'
          : 'opacity-0 pointer-events-none translate-y-4'
      }`}
      aria-label="Kembali ke atas"
    >
      <i className="fa-solid fa-arrow-up text-sm group-hover:-translate-y-0.5 transition-transform text-emerald-200"></i>
      <span className="hidden sm:inline">Top</span>
    </a>
  );
};
