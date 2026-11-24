/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PROFILE_INFO } from '../data/profileData';
import { formatPortfolioImageUrl } from '../utils/imageHelper';
import { ThemeToggle } from './ThemeToggle';
import { FaIcon } from './FaIcon';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [logoError, setLogoError] = useState(false);

  const formattedLogoUrl = PROFILE_INFO.logoUrl
    ? formatPortfolioImageUrl(PROFILE_INFO.logoUrl, 128)
    : '';

  // Update Favicon dynamically from bundled local asset or custom URL
  useEffect(() => {
    const rawFavicon = PROFILE_INFO.faviconUrl || PROFILE_INFO.logoUrl;
    if (rawFavicon) {
      const formatted = formatPortfolioImageUrl(rawFavicon, 128);
      const link =
        (document.getElementById('app-favicon') as HTMLLinkElement) ||
        (document.querySelector("link[rel*='icon']") as HTMLLinkElement);
      if (link && formatted) {
        if (formatted.endsWith('.webp') || formatted.startsWith('data:image/webp')) {
          link.type = 'image/webp';
        }
        link.href = formatted;
      }
    }
  }, []);

  // Zero-reflow scroll spy using IntersectionObserver (avoids forced reflows on mount & scroll)
  useEffect(() => {
    const sectionIds = [
      'beranda',
      'tentang',
      'pengalaman',
      'pendidikan',
      'portofolio',
      'simulator',
      'kontak',
    ];

    const visibleSections = new Set<string>();

    const updateActive = () => {
      // Prioritize bottom-most visible section along focal zone or top if at top
      if (visibleSections.has('kontak')) {
        setActiveSection('kontak');
        return;
      }
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        if (visibleSections.has(id)) {
          setActiveSection(id === 'tentang' ? 'beranda' : id);
          return;
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;
          if (entry.isIntersecting) {
            visibleSections.add(id);
          } else {
            visibleSections.delete(id);
          }
        });
        updateActive();
      },
      {
        rootMargin: '-110px 0px -55% 0px',
        threshold: 0,
      },
    );

    const footerObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActiveSection('kontak');
        }
      },
      { threshold: 0.1 },
    );

    const observeAll = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
      const footerEl = document.querySelector('footer');
      if (footerEl) footerObserver.observe(footerEl);
    };

    observeAll();
    // Re-observe once lazy sections mount
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mutationObserver.observe(mainEl, { childList: true });
    }

    return () => {
      observer.disconnect();
      footerObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Smooth scroll helper ensuring mobile menu close transition settles before positioning
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    const wasOpen = mobileMenuOpen;
    if (wasOpen) {
      setMobileMenuOpen(false);
    }

    const performScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const navbarHeight = window.innerWidth < 768 ? 72 : 80;
        const targetY =
          el.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth',
        });
      }
    };

    if (wasOpen) {
      setTimeout(performScroll, 120);
    } else {
      performScroll();
    }
  };

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed top-0 left-0 right-0 z-[100] w-full glass-card border-b border-emerald-100/60 dark:border-slate-800/80 shadow-sm transition-[background-color,border-color,box-shadow] duration-300"
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-3.5 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo / Title */}
          <a
            href="/"
            onClick={(e) => scrollToSection(e, 'beranda')}
            className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 group shrink-0"
          >
            {formattedLogoUrl && !logoError ? (
              <img
                src={formattedLogoUrl}
                alt={`Logo ${PROFILE_INFO.name}`}
                width={44}
                height={44}
                decoding="async"
                onError={() => setLogoError(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 object-contain group-hover:scale-105 transition-transform shrink-0"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-700 to-sunshine-600 flex items-center justify-center text-white font-bold text-base lg:text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
                <span className="font-arabic font-bold text-lg lg:text-2xl leading-none">
                  س
                </span>
              </div>
            )}
            <div className="min-w-0">
              <span className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 dark:text-white block leading-tight group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors whitespace-nowrap">
                {PROFILE_INFO.name}
              </span>
              <span className="text-[10px] sm:text-[11px] lg:text-xs text-brand-700 dark:text-brand-400 font-semibold tracking-wide block whitespace-nowrap">
                {PROFILE_INFO.spec}
              </span>
            </div>
          </a>

          {/* Desktop & Tablet Navigation */}
          <div className="hidden md:flex items-center gap-1 md:gap-1.5 lg:gap-3 xl:gap-5 min-w-0">
            <div className="flex items-center space-x-0.5 md:space-x-1 font-medium text-[11px] md:text-xs lg:text-sm text-gray-700 dark:text-slate-200">
              <a
                href="#beranda"
                onClick={(e) => scrollToSection(e, 'beranda')}
                className={`px-1.5 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2 xl:px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeSection === 'beranda'
                    ? 'text-brand-800 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60 dark:text-brand-300 dark:bg-slate-800/90 dark:ring-brand-500/40'
                    : 'text-gray-700 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-brand-50/50 dark:hover:bg-slate-800/60'
                }`}
              >
                Beranda
              </a>
              <a
                href="#pengalaman"
                onClick={(e) => scrollToSection(e, 'pengalaman')}
                className={`px-1.5 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2 xl:px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeSection === 'pengalaman'
                    ? 'text-brand-800 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60 dark:text-brand-300 dark:bg-slate-800/90 dark:ring-brand-500/40'
                    : 'text-gray-700 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-brand-50/50 dark:hover:bg-slate-800/60'
                }`}
              >
                Pengalaman
              </a>
              <a
                href="#pendidikan"
                onClick={(e) => scrollToSection(e, 'pendidikan')}
                className={`px-1.5 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2 xl:px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeSection === 'pendidikan'
                    ? 'text-brand-800 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60 dark:text-brand-300 dark:bg-slate-800/90 dark:ring-brand-500/40'
                    : 'text-gray-700 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-brand-50/50 dark:hover:bg-slate-800/60'
                }`}
              >
                Pendidikan
              </a>
              <a
                href="#portofolio"
                onClick={(e) => scrollToSection(e, 'portofolio')}
                className={`px-1.5 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2 xl:px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeSection === 'portofolio'
                    ? 'text-brand-800 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60 dark:text-brand-300 dark:bg-slate-800/90 dark:ring-brand-500/40'
                    : 'text-gray-700 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-brand-50/50 dark:hover:bg-slate-800/60'
                }`}
              >
                Portofolio
              </a>
              <a
                href="#simulator"
                onClick={(e) => scrollToSection(e, 'simulator')}
                className={`px-1.5 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2 xl:px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeSection === 'simulator'
                    ? 'text-white bg-gradient-to-r from-brand-700 to-emerald-700 font-bold shadow-md shadow-brand-700/25 ring-2 ring-brand-400'
                    : 'text-brand-800 dark:text-brand-300 bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 font-semibold'
                }`}
              >
                <FaIcon name="calculator" className="mr-1 text-[11px] lg:text-xs" />
                <span>
                  <span className="hidden xl:inline">Hitung </span>Warisan
                </span>
              </a>
            </div>

            {/* Theme Toggle & CTA Button */}
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-2.5 shrink-0">
              <ThemeToggle variant="icon" />
              <a
                href="#kontak"
                onClick={(e) => scrollToSection(e, 'kontak')}
                className={`px-3 py-1.5 md:px-3 md:py-1.5 lg:px-4.5 lg:py-2 rounded-full font-bold text-xs lg:text-sm shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeSection === 'kontak'
                    ? 'bg-gradient-to-r from-brand-800 to-teal-900 text-white ring-2 ring-brand-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-lg scale-105'
                    : 'bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white hover:shadow-lg'
                }`}
              >
                <FaIcon name="paper-plane" className="text-xs" />
                <span>Kontak</span>
              </a>
            </div>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle variant="icon" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center text-gray-700 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-400 hover:bg-brand-50/70 dark:hover:bg-slate-800/80 transition-colors focus-visible:outline-2 focus-visible:outline-brand-600"
            >
              <FaIcon name={mobileMenuOpen ? 'xmark' : 'bars'} className="text-xl leading-none" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg border-b border-gray-100 dark:border-slate-800 shadow-2xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="px-4 pt-3 pb-6 space-y-2">
            <a
              href="#beranda"
              onClick={(e) => scrollToSection(e, 'beranda')}
              className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
                activeSection === 'beranda'
                  ? 'bg-brand-50 dark:bg-slate-800 text-brand-800 dark:text-brand-300 font-bold border-l-4 border-brand-700 dark:border-brand-400 pl-3'
                  : 'text-gray-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800/60 hover:text-brand-700 dark:hover:text-brand-300'
              }`}
            >
              Beranda
            </a>
            <a
              href="#pengalaman"
              onClick={(e) => scrollToSection(e, 'pengalaman')}
              className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
                activeSection === 'pengalaman'
                  ? 'bg-brand-50 dark:bg-slate-800 text-brand-800 dark:text-brand-300 font-bold border-l-4 border-brand-700 dark:border-brand-400 pl-3'
                  : 'text-gray-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800/60 hover:text-brand-700 dark:hover:text-brand-300'
              }`}
            >
              Pengalaman
            </a>
            <a
              href="#pendidikan"
              onClick={(e) => scrollToSection(e, 'pendidikan')}
              className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
                activeSection === 'pendidikan'
                  ? 'bg-brand-50 dark:bg-slate-800 text-brand-800 dark:text-brand-300 font-bold border-l-4 border-brand-700 dark:border-brand-400 pl-3'
                  : 'text-gray-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800/60 hover:text-brand-700 dark:hover:text-brand-300'
              }`}
            >
              Pendidikan
            </a>
            <a
              href="#portofolio"
              onClick={(e) => scrollToSection(e, 'portofolio')}
              className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
                activeSection === 'portofolio'
                  ? 'bg-brand-50 dark:bg-slate-800 text-brand-800 dark:text-brand-300 font-bold border-l-4 border-brand-700 dark:border-brand-400 pl-3'
                  : 'text-gray-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800/60 hover:text-brand-700 dark:hover:text-brand-300'
              }`}
            >
              Portofolio
            </a>
            <a
              href="#simulator"
              onClick={(e) => scrollToSection(e, 'simulator')}
              className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
                activeSection === 'simulator'
                  ? 'bg-emerald-700 text-white font-bold pl-3 shadow'
                  : 'text-brand-800 dark:text-brand-300 bg-emerald-50 dark:bg-slate-800 font-semibold'
              }`}
            >
              <FaIcon name="calculator" className="mr-2" /> Hitung Warisan
            </a>
            <a
              href="#kontak"
              onClick={(e) => scrollToSection(e, 'kontak')}
              className={`block text-center mt-3 py-3 rounded-xl font-semibold shadow transition-all ${
                activeSection === 'kontak'
                  ? 'bg-brand-800 text-white ring-2 ring-brand-400'
                  : 'bg-brand-700 text-white'
              }`}
            >
              Kontak
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
