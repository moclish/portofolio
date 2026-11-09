/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

export const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      // Optimal threshold: muncul setelah melewati lipatan awal hero (~380px)
      // agar tidak menghalangi tombol aksi di hero dan bersih di semua perangkat
      if (scrollPos > 380) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Hapus fokus elemen agar browser mobile (Safari/Chrome) tidak menahan scroll
    if (e.currentTarget) {
      e.currentTarget.blur();
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // 1. Gulir halus alami persis seperti navigasi navbar
    const topAnchor = document.getElementById('page-top');
    if (topAnchor) {
      topAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    if (document.documentElement) {
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }

    if (document.body) {
      document.body.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }

    // 2. Safety check: memastikan di tablet/ponsel mentok sempurna ke 0px
    setTimeout(() => {
      if (window.scrollY > 0 && window.scrollY < 150) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 750);
  };

  return (
    <button
      type="button"
      id="backToTopBtn"
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6 z-40 w-9.5 h-9.5 sm:w-10 sm:h-10 lg:w-12 lg:h-12 aspect-square rounded-full p-0 flex items-center justify-center shrink-0 bg-gradient-to-tr from-brand-700/85 via-brand-600/80 to-emerald-600/85 hover:from-brand-600 hover:via-brand-500 hover:to-emerald-500 text-white shadow-lg shadow-brand-950/20 hover:shadow-xl hover:shadow-brand-950/30 border border-white/30 dark:border-emerald-400/40 backdrop-blur-md transition-all duration-300 cursor-pointer group active:scale-90 hover:scale-110 select-none ${
        show
          ? 'opacity-75 hover:opacity-100 active:opacity-100 focus:opacity-100 pointer-events-auto translate-y-0'
          : 'opacity-0 pointer-events-none translate-y-4'
      }`}
      aria-label="Kembali ke atas halaman"
      title="Kembali ke atas halaman"
    >
      <i className="fa-solid fa-arrow-up text-xs sm:text-sm lg:text-base text-white group-hover:-translate-y-1 transition-transform duration-200"></i>
    </button>
  );
};
