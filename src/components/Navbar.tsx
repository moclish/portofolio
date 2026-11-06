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

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-emerald-100/60 shadow-sm transition-all duration-300"
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo / Title */}
          <a href="#beranda" className="flex items-center gap-3 group">
            {formattedLogoUrl && !logoError ? (
              <img
                src={formattedLogoUrl}
                alt={PROFILE_INFO.name}
                onError={() => setLogoError(true)}
                className="w-11 h-11 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform border border-emerald-100 bg-white"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-sunshine-500 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                <span className="font-arabic font-bold text-2xl leading-none">س</span>
              </div>
            )}
            <div>
              <span className="text-xl font-bold text-gray-900 block leading-tight group-hover:text-brand-600 transition-colors">
                {PROFILE_INFO.name}
              </span>
              <span className="text-xs text-brand-700 font-semibold tracking-wide">
                {PROFILE_INFO.spec}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <div className="flex items-center space-x-1 lg:space-x-1.5 font-medium text-sm text-gray-700">
              <a
                href="#beranda"
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  activeSection === 'beranda'
                    ? 'text-brand-700 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60'
                    : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50/50'
                }`}
              >
                Beranda
              </a>
              <a
                href="#pengalaman"
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  activeSection === 'pengalaman'
                    ? 'text-brand-700 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60'
                    : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50/50'
                }`}
              >
                Pengalaman
              </a>
              <a
                href="#pendidikan"
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  activeSection === 'pendidikan'
                    ? 'text-brand-700 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60'
                    : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50/50'
                }`}
              >
                Pendidikan
              </a>
              <a
                href="#portofolio"
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  activeSection === 'portofolio'
                    ? 'text-brand-700 bg-brand-50/90 font-bold shadow-2xs ring-1 ring-brand-200/60'
                    : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50/50'
                }`}
              >
                Portofolio
              </a>
              <a
                href="#simulator"
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  activeSection === 'simulator'
                    ? 'text-white bg-gradient-to-r from-brand-600 to-emerald-600 font-bold shadow-md shadow-brand-600/25 ring-2 ring-brand-400'
                    : 'text-brand-700 bg-emerald-50 hover:bg-emerald-100 font-semibold'
                }`}
              >
                <i className="fa-solid fa-calculator mr-1.5 text-xs"></i> Hitung Warisan
              </a>
            </div>

            {/* CTA Button */}
            <div className="flex items-center">
              <a
                href="#kontak"
                className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
                  activeSection === 'kontak'
                    ? 'bg-gradient-to-r from-brand-700 to-teal-800 text-white ring-2 ring-brand-400 ring-offset-2 shadow-lg scale-105'
                    : 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white hover:shadow-lg'
                }`}
              >
                <i className="fa-regular fa-paper-plane"></i> Kontak Saya
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xl">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <a
              href="#beranda"
              onClick={() => setMobileMenuOpen(false)}
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
              onClick={() => setMobileMenuOpen(false)}
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
              onClick={() => setMobileMenuOpen(false)}
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
              onClick={() => setMobileMenuOpen(false)}
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
              onClick={() => setMobileMenuOpen(false)}
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
              onClick={() => setMobileMenuOpen(false)}
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
