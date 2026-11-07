/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PROFILE_INFO } from '../data/profileData';
import { formatPortfolioImageUrl } from '../utils/imageHelper';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [logoError, setLogoError] = useState(false);

  const formattedLogoUrl = PROFILE_INFO.logoUrl
    ? formatPortfolioImageUrl(PROFILE_INFO.logoUrl)
    : '';

  // Update Favicon dynamically from Google Drive or local link if specified
  useEffect(() => {
    const rawFavicon = PROFILE_INFO.faviconUrl || PROFILE_INFO.logoUrl;
    if (rawFavicon) {
      const formatted = formatPortfolioImageUrl(rawFavicon);
      const link =
        (document.getElementById('app-favicon') as HTMLLinkElement) ||
        (document.querySelector("link[rel*='icon']") as HTMLLinkElement);
      if (link && formatted) {
        link.href = formatted;
      }
    }
  }, []);

  // Scroll spy to detect active section and highlight the active menu
  useEffect(() => {
    // Exact DOM order: portofolio is now placed above simulator
    const sectionIds = [
      'beranda',
      'tentang',
      'pengalaman',
      'pendidikan',
      'portofolio',
      'simulator',
      'kontak',
    ];

    const handleScroll = () => {
      // If user reaches near the bottom of document, activate kontak
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80
      ) {
        setActiveSection('kontak');
        return;
      }

      // Focal inspection line right below the 80px fixed navbar
      const focalLine = 110;
      let current = 'beranda';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalLine && rect.bottom > focalLine) {
            current = id === 'tentang' ? 'beranda' : id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
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
        // Navbar height offset: 80px on desktop/tablet, 72px on mobile
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
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-emerald-100/60 shadow-sm transition-all duration-300"
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-8">
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
                alt={PROFILE_INFO.name}
                onError={() => setLogoError(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl sm:rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform border border-emerald-100 bg-white shrink-0"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-600 to-sunshine-500 flex items-center justify-center text-white font-bold text-base lg:text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
                <span className="font-arabic font-bold text-lg lg:text-2xl leading-none">
                  س
                </span>
              </div>
            )}
            <div className="min-w-0">
              <span className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 block leading-tight group-hover:text-brand-600 transition-colors whitespace-nowrap">
                {PROFILE_INFO.name}
              </span>
              <span className="text-[10px] sm:text-[11px] lg:text-xs text-brand-700 font-semibold tracking-wide block whitespace-nowrap">
                {PROFILE_INFO.spec}
              </span>
            </div>
          </a>

          {/* Desktop & Tablet Navigation */}
          <div className="hidden md:flex items-center gap-1.5 md:gap-2.5 lg:gap-4 xl:gap-6 min-w-0">
            <div className="flex items-center space-x-0.5 md:space-x-1 lg:space-x-1.5 font-medium text-xs lg:text-sm text-gray-700">
              <a
                href="#beranda"
                onClick={(e) => scrollToSection(e, 'beranda')}
                className={`px-2 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2 xl:px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeSection === 'beranda'
                    ? 'text-brand-700 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60'
                    : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50/50'
                }`}
              >
                Beranda
              </a>
              <a
                href="#pengalaman"
                onClick={(e) => scrollToSection(e, 'pengalaman')}
                className={`px-2 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2 xl:px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeSection === 'pengalaman'
                    ? 'text-brand-700 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60'
                    : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50/50'
                }`}
              >
                Pengalaman
              </a>
              <a
                href="#pendidikan"
                onClick={(e) => scrollToSection(e, 'pendidikan')}
                className={`px-2 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2 xl:px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeSection === 'pendidikan'
                    ? 'text-brand-700 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60'
                    : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50/50'
                }`}
              >
                Pendidikan
              </a>
              <a
                href="#portofolio"
                onClick={(e) => scrollToSection(e, 'portofolio')}
                className={`px-2 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2 xl:px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeSection === 'portofolio'
                    ? 'text-brand-700 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60'
                    : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50/50'
                }`}
              >
                Portofolio
              </a>
              <a
                href="#simulator"
                onClick={(e) => scrollToSection(e, 'simulator')}
                className={`px-2 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2 xl:px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeSection === 'simulator'
                    ? 'text-white bg-gradient-to-r from-brand-600 to-emerald-600 font-bold shadow-md shadow-brand-600/25 ring-2 ring-brand-400'
                    : 'text-brand-700 bg-emerald-50 hover:bg-emerald-100 font-semibold'
                }`}
              >
                <i className="fa-solid fa-calculator mr-1 text-[11px] lg:text-xs"></i>
                <span>Hitung Warisan</span>
              </a>
            </div>

            {/* CTA Button */}
            <div className="flex items-center shrink-0">
              <a
                href="#kontak"
                onClick={(e) => scrollToSection(e, 'kontak')}
                className={`px-3 py-1.5 md:px-3.5 md:py-1.5 lg:px-5 lg:py-2.5 rounded-full font-bold text-xs lg:text-sm shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeSection === 'kontak'
                    ? 'bg-gradient-to-r from-brand-700 to-teal-800 text-white ring-2 ring-brand-400 ring-offset-2 shadow-lg scale-105'
                    : 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white hover:shadow-lg'
                }`}
              >
                <i className="fa-regular fa-paper-plane text-xs"></i>
                <span>
                  Kontak
                  <span className="hidden landscape:inline lg:inline"> Saya</span>
                </span>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-brand-600 p-2 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-lg border-b border-gray-100 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <a
              href="#beranda"
              onClick={(e) => scrollToSection(e, 'beranda')}
              className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
                activeSection === 'beranda'
                  ? 'bg-brand-50 text-brand-700 font-bold border-l-4 border-brand-600 pl-3'
                  : 'text-gray-700 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              Beranda
            </a>
            <a
              href="#pengalaman"
              onClick={(e) => scrollToSection(e, 'pengalaman')}
              className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
                activeSection === 'pengalaman'
                  ? 'bg-brand-50 text-brand-700 font-bold border-l-4 border-brand-600 pl-3'
                  : 'text-gray-700 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              Pengalaman
            </a>
            <a
              href="#pendidikan"
              onClick={(e) => scrollToSection(e, 'pendidikan')}
              className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
                activeSection === 'pendidikan'
                  ? 'bg-brand-50 text-brand-700 font-bold border-l-4 border-brand-600 pl-3'
                  : 'text-gray-700 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              Pendidikan
            </a>
            <a
              href="#portofolio"
              onClick={(e) => scrollToSection(e, 'portofolio')}
              className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
                activeSection === 'portofolio'
                  ? 'bg-brand-50 text-brand-700 font-bold border-l-4 border-brand-600 pl-3'
                  : 'text-gray-700 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              Portofolio
            </a>
            <a
              href="#simulator"
              onClick={(e) => scrollToSection(e, 'simulator')}
              className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
                activeSection === 'simulator'
                  ? 'bg-emerald-600 text-white font-bold pl-3 shadow'
                  : 'text-brand-700 bg-emerald-50 font-semibold'
              }`}
            >
              <i className="fa-solid fa-calculator mr-2"></i> Hitung Warisan
            </a>
            <a
              href="#kontak"
              onClick={(e) => scrollToSection(e, 'kontak')}
              className={`block text-center mt-3 py-3 rounded-xl font-semibold shadow transition-all ${
                activeSection === 'kontak'
                  ? 'bg-brand-700 text-white ring-2 ring-brand-400'
                  : 'bg-brand-600 text-white'
              }`}
            >
              Kontak Saya
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
