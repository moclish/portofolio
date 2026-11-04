/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-emerald-100/60 shadow-sm transition-all duration-300"
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo / Title */}
          <a href="#beranda" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-sunshine-500 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              <span className="font-arabic font-bold text-2xl leading-none">س</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 block leading-tight group-hover:text-brand-600 transition-colors">
                Sadono, Lc
              </span>
              <span className="text-xs text-brand-700 font-semibold tracking-wide">
                Spesialis Fikih Waris
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <div className="flex items-center space-x-1 lg:space-x-2 font-medium text-sm text-gray-700">
              <a
                href="#beranda"
                className="px-3 py-2 rounded-xl hover:text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Beranda
              </a>
              <a
                href="#pengalaman"
                className="px-3 py-2 rounded-xl hover:text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Pengalaman
              </a>
              <a
                href="#pendidikan"
                className="px-3 py-2 rounded-xl hover:text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Pendidikan
              </a>
              <a
                href="#portofolio"
                className="px-3 py-2 rounded-xl hover:text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Portofolio
              </a>
              <a
                href="#simulator"
                className="px-3 py-2 rounded-xl text-brand-700 bg-emerald-50 hover:bg-emerald-100 transition-colors font-semibold"
              >
                Hitung Warisan
              </a>
            </div>

            {/* CTA Button */}
            <div className="flex items-center">
              <a
                href="#kontak"
                className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-md hover:shadow-lg hover:from-brand-700 hover:to-brand-800 transition-all flex items-center gap-2"
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <a
              href="#beranda"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600"
            >
              Beranda
            </a>
            <a
              href="#pengalaman"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600"
            >
              Pengalaman
            </a>
            <a
              href="#pendidikan"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600"
            >
              Pendidikan
            </a>
            <a
              href="#portofolio"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600"
            >
              Portofolio
            </a>
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-brand-700 bg-emerald-50"
            >
              Hitung Warisan
            </a>
            <a
              href="#kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center mt-3 bg-brand-600 text-white py-3 rounded-xl font-semibold shadow"
            >
              Kontak Saya
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
