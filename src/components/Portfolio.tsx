/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { PortfolioCategory, PortfolioItem } from '../types/portfolio';
import { formatPortfolioImageUrl } from '../utils/imageHelper';

// Swiper core styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  // Otomatis mengurutkan dari portofolio terbaru ke yang lama:
  // 1. Berdasarkan tanggal resmi (date) dengan presisi hari/bulan
  // 2. Fallback ke tahun (year) jika tanggal tidak lengkap
  // 3. Jika tahun & tanggal sama, menggunakan ID terbesar
  const sortedPortfolio = useMemo(() => {
    return [...PORTFOLIO_DATA].sort((a, b) => {
      const getTime = (item: PortfolioItem) => {
        if (item.date) {
          const parsed = new Date(item.date).getTime();
          if (!isNaN(parsed)) return parsed;
        }
        const parsedYear = parseInt(item.year, 10) || 0;
        return new Date(`${parsedYear}-01-01`).getTime();
      };

      const timeA = getTime(a);
      const timeB = getTime(b);

      if (timeB !== timeA) {
        return timeB - timeA;
      }
      return b.id - a.id;
    });
  }, []);

  const filteredPortfolio = useMemo(() => {
    if (activeFilter === 'all') return sortedPortfolio;
    return sortedPortfolio.filter((item) => item.category === activeFilter);
  }, [activeFilter, sortedPortfolio]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update();
      swiperRef.current.slideTo(0);
    }
  }, [activeFilter]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="portofolio" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-brand-600 font-bold text-sm uppercase tracking-wider bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100">
            Rekam Jejak
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            Portofolio & Sertifikasi
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Kumpulan sertifikasi profesional, karya, dan dokumentasi program
            edukatif (otomatis terurut dari yang terbaru)
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" id="filterContainer">
          <button
            onClick={() => setActiveFilter('all')}
            className={`filter-btn px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua Items
          </button>
          <button
            onClick={() => setActiveFilter('sertifikat')}
            className={`filter-btn px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'sertifikat'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sertifikasi
          </button>
          <button
            onClick={() => setActiveFilter('faroid')}
            className={`filter-btn px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'faroid'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fikih Waris
          </button>
          <button
            onClick={() => setActiveFilter('akademik')}
            className={`filter-btn px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'akademik'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Akademik
          </button>
        </div>

        {/* Swiper Container: Loncat per jumlah slide yang tampil di layar */}
        <div className="relative px-3 sm:px-10">
          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            loop={false}
            grabCursor={true}
            pagination={{
              clickable: true,
              el: '.swiper-custom-pagination',
            }}
            navigation={{
              nextEl: '.swiper-button-custom-next',
              prevEl: '.swiper-button-custom-prev',
            }}
            breakpoints={{
              320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
            }}
            className="portfolio-swiper pb-14"
          >
            {filteredPortfolio.map((item) => {
              const formattedUrl = formatPortfolioImageUrl(item.imageUrl);

              return (
                <SwiperSlide key={item.id} className="h-auto">
                  <div
                    onClick={() => setSelectedItem(item)}
                    className="bg-white rounded-3xl overflow-hidden border border-emerald-100/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full group cursor-pointer"
                  >
                    {/* Clean Bright Gallery Thumbnail (with click-to-preview) */}
                    <div
                      className="relative overflow-hidden aspect-[4/3] flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-amber-50/50 border-b border-emerald-100/60 select-none"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      {/* Inner Paper Card with elegant shadow */}
                      <div className="relative w-full h-full bg-white rounded-2xl shadow-sm border border-emerald-100/50 flex items-center justify-center overflow-hidden p-2">
                        <img
                          src={formattedUrl}
                          alt={item.title}
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                          onContextMenu={(e) => e.preventDefault()}
                          className="w-full h-full object-contain protected-image drop-shadow-xs group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = item.fallbackUrl;
                          }}
                        />

                        {/* Protective transparent shield layer */}
                        <div
                          className="absolute inset-0 z-10"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </div>

                      {/* Year / Date badge */}
                      <span
                        className={`absolute top-4 right-4 ${item.yearBadgeClass} text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm z-20`}
                      >
                        {item.dateLabel || item.year}
                      </span>

                      {/* Hover action hint */}
                      <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                        <span className="bg-white/95 text-brand-800 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <i className="fa-regular fa-eye"></i> Pratinjau Dokumen
                        </span>
                      </div>
                    </div>

                    {/* Card Content (Bagian "Lihat Dokumen" dihapus sesuai permintaan) */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-start bg-warmbg/40">
                      <div className="flex items-center justify-between mb-2.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${item.categoryBadgeClass}`}
                        >
                          {item.categoryLabel}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {item.organizer}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-brand-600 transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Pagination Container */}
          <div className="swiper-custom-pagination flex justify-center gap-1.5 mt-4"></div>

          {/* Navigation Buttons: Loncat sesuai slidesPerGroup */}
          <button
            type="button"
            className="swiper-button-custom-prev absolute top-1/2 -translate-y-8 -left-2 sm:-left-5 z-30 w-11 h-11 bg-white text-brand-700 rounded-full shadow-xl border border-emerald-100 flex items-center justify-center hover:bg-brand-50 hover:scale-110 transition-all cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Slide Sebelumnya"
          >
            <i className="fa-solid fa-chevron-left text-brand-700 font-bold text-sm"></i>
          </button>
          <button
            type="button"
            className="swiper-button-custom-next absolute top-1/2 -translate-y-8 -right-2 sm:-right-5 z-30 w-11 h-11 bg-white text-brand-700 rounded-full shadow-xl border border-emerald-100 flex items-center justify-center hover:bg-brand-50 hover:scale-110 transition-all cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Slide Selanjutnya"
          >
            <i className="fa-solid fa-chevron-right text-brand-700 font-bold text-sm"></i>
          </button>
        </div>
      </div>

      {/* SECURE MODAL PREVIEW (Protects image from right-click & saving) */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-gray-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedItem(null)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-emerald-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-warmbg/50">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${selectedItem.categoryBadgeClass}`}
                >
                  {selectedItem.categoryLabel}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {selectedItem.organizer} • {selectedItem.dateLabel || selectedItem.year}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Modal Image Display (Protected against right-click and drag) */}
            <div
              className="relative p-4 sm:p-6 bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-amber-50/40 flex items-center justify-center max-h-[50vh] overflow-hidden select-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className="relative bg-white p-2 sm:p-3 rounded-2xl shadow-md border border-emerald-100/80 max-h-[46vh] flex items-center justify-center">
                <img
                  src={formatPortfolioImageUrl(selectedItem.imageUrl)}
                  alt={selectedItem.title}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className="max-h-[42vh] w-auto object-contain protected-image rounded-lg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = selectedItem.fallbackUrl;
                  }}
                />

                {/* Protective transparent overlay */}
                <div
                  className="absolute inset-0 z-10 cursor-default"
                  onContextMenu={(e) => e.preventDefault()}
                />

                {/* Subtle protective watermark */}
                <span className="absolute bottom-3 right-3 z-20 text-[10px] text-gray-400/80 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs font-mono select-none pointer-events-none">
                  Hak Cipta © Sadono, Lc
                </span>
              </div>
            </div>

            {/* Modal Description */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-3 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {selectedItem.description}
              </p>
              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
