/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaIcon } from './FaIcon';

export const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let rafId = 0;

    const checkScroll = () => {
      const scrollPos =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        window.scrollY ||
        0;

      // Pada posisi paling atas (0), tombol selalu tersembunyi tanpa perlu mengukur layout DOM
      if (scrollPos === 0) {
        setShow(false);
        return;
      }

      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth ||
        1024;

      const isWideDesktop = width >= 1024;
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;

      let shouldShow = false;

      if (isWideDesktop) {
        // Pada desktop layar lebar (>= 1024px): tombol muncul ketika sampai di section Pengalaman
        const pengalamanEl = document.getElementById('pengalaman');
        if (pengalamanEl) {
          const rect = pengalamanEl.getBoundingClientRect();
          shouldShow = rect.top <= vh;
        } else {
          shouldShow = scrollPos > 700;
        }
      } else {
        // Pada mobile & tablet (< 1024px): tombol muncul ketika sampai di section Metode Mendidik
        const tentangEl = document.getElementById('tentang');
        if (tentangEl) {
          const rect = tentangEl.getBoundingClientRect();
          shouldShow = rect.top <= vh;
        } else {
          shouldShow = scrollPos > 500;
        }
      }

      setShow(shouldShow);
    };

    const scheduleCheck = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        checkScroll();
      });
    };

    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('touchmove', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck, { passive: true });

    if (window.scrollY > 0) {
      scheduleCheck();
    }

    return () => {
      window.removeEventListener('scroll', scheduleCheck);
      window.removeEventListener('touchmove', scheduleCheck);
      window.removeEventListener('resize', scheduleCheck);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget) {
      e.currentTarget.blur();
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

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

    setTimeout(() => {
      if (window.scrollY > 0 && window.scrollY < 150) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 750);
  };

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const content = (
    <button
      type="button"
      id="backToTopBtn"
      onClick={scrollToTop}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      style={{
        position: 'fixed',
        zIndex: 9990,
      }}
      className={`fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 lg:bottom-6 lg:right-6 z-[9990] w-9.5 h-9.5 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 aspect-square rounded-full p-0 flex items-center justify-center shrink-0 bg-gradient-to-tr from-brand-800/60 via-brand-700/55 to-emerald-700/60 hover:from-brand-700 hover:via-brand-700 hover:to-emerald-600 text-white shadow-lg shadow-brand-950/15 hover:shadow-xl hover:shadow-brand-950/35 border border-white/35 dark:border-emerald-400/40 hover:border-white/70 dark:hover:border-emerald-300 backdrop-blur-md transition-all duration-300 cursor-pointer group select-none ${
        show
          ? 'opacity-45 hover:opacity-100 active:opacity-100 focus-visible:opacity-100 pointer-events-auto visible'
          : 'opacity-0 pointer-events-none invisible'
      }`}
      aria-label="Kembali ke atas halaman"
      title="Kembali ke atas halaman"
    >
      <FaIcon
        name="arrow-up"
        className="text-xs sm:text-sm lg:text-base text-white group-hover:-translate-y-1 group-active:scale-90 transition-transform duration-200"
      />
    </button>
  );

  return createPortal(content, document.body);
};
