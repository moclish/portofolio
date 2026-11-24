/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EducationalMethod } from './components/EducationalMethod';
import { BackToTop } from './components/BackToTop';
import { Toast } from './components/Toast';

const Experience = lazy(() =>
  import('./components/Experience').then((m) => ({ default: m.Experience })),
);
const Education = lazy(() =>
  import('./components/Education').then((m) => ({ default: m.Education })),
);
const Portfolio = lazy(() =>
  import('./components/Portfolio').then((m) => ({ default: m.Portfolio })),
);
const MawarisCalculator = lazy(() =>
  import('./components/MawarisCalculator').then((m) => ({
    default: m.MawarisCalculator,
  })),
);
const Contact = lazy(() =>
  import('./components/Contact').then((m) => ({ default: m.Contact })),
);
const Footer = lazy(() =>
  import('./components/Footer').then((m) => ({ default: m.Footer })),
);

interface DeferredSectionProps {
  id: string;
  label: string;
  fallbackClassName: string;
  tag?: 'section' | 'footer';
  children: React.ReactNode;
}

const DeferredSection: React.FC<DeferredSectionProps> = ({
  id,
  label,
  fallbackClassName,
  tag = 'section',
  children,
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const sentinelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (shouldLoad) return;

    if (window.location.hash === `#${id}`) {
      setShouldLoad(true);
      return;
    }

    const handleHashOrLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest(`a[href="#${id}"]`);
      if (anchor) {
        setShouldLoad(true);
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === `#${id}`) {
        setShouldLoad(true);
      }
    };

    document.addEventListener('click', handleHashOrLinkClick, { passive: true });
    window.addEventListener('hashchange', handleHashChange);

    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return () => {
        document.removeEventListener('click', handleHashOrLinkClick);
        window.removeEventListener('hashchange', handleHashChange);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '850px 0px', threshold: 0 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleHashOrLinkClick);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [id, shouldLoad]);

  const fallback =
    tag === 'footer' ? (
      <footer
        ref={sentinelRef as React.RefObject<HTMLElement>}
        id={id}
        className={fallbackClassName}
        aria-label={label}
      />
    ) : (
      <section
        ref={sentinelRef}
        id={id}
        className={fallbackClassName}
        aria-label={label}
      />
    );

  if (!shouldLoad) {
    return fallback;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const closeToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(null);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen text-gray-800 dark:text-slate-100 antialiased selection:bg-brand-700 selection:text-white transition-colors duration-300">
        {/* Top of page anchor for 100% reliable scroll-to-top */}
        <div id="page-top" className="absolute top-0 left-0 w-px h-px pointer-events-none opacity-0" aria-hidden="true" />

        {/* Sticky Navigation */}
        <Navbar />

        {/* Main Content Sections */}
        <main>
          <Hero />
          <EducationalMethod />
          <DeferredSection
            id="pengalaman"
            label="Pengalaman Kerja"
            fallbackClassName="py-20 bg-warmbg dark:bg-slate-950 min-h-[600px] border-t border-emerald-100/50 dark:border-slate-800"
          >
            <Experience />
          </DeferredSection>
          <DeferredSection
            id="pendidikan"
            label="Riwayat Pendidikan"
            fallbackClassName="py-20 bg-white dark:bg-slate-900 min-h-[500px] border-t border-emerald-100/50 dark:border-slate-800"
          >
            <Education />
          </DeferredSection>
          <DeferredSection
            id="portofolio"
            label="Portofolio & Sertifikasi"
            fallbackClassName="py-20 bg-warmbg dark:bg-slate-950 min-h-[600px] border-t border-emerald-100/60 dark:border-slate-800"
          >
            <Portfolio />
          </DeferredSection>
          <DeferredSection
            id="simulator"
            label="Kalkulator Waris Syar'i"
            fallbackClassName="py-16 md:py-20 bg-gradient-to-br from-emerald-900 via-brand-900 to-teal-950 min-h-[550px]"
          >
            <MawarisCalculator onShowToast={showToast} />
          </DeferredSection>
          <DeferredSection
            id="kontak"
            label="Kontak"
            fallbackClassName="py-20 bg-white dark:bg-slate-900 min-h-[500px] border-t border-emerald-100/50 dark:border-slate-800"
          >
            <Contact onShowToast={showToast} />
          </DeferredSection>
        </main>

        {/* Footer */}
        <DeferredSection
          id="footer"
          tag="footer"
          label="Footer"
          fallbackClassName="py-8 bg-emerald-50/40 dark:bg-slate-950 min-h-[120px] border-t border-emerald-100/80 dark:border-slate-800/80"
        >
          <Footer />
        </DeferredSection>

        {/* Floating Utilities */}
        <BackToTop />
        <Toast message={toastMessage} onClose={closeToast} />
      </div>
    </ThemeProvider>
  );
}
