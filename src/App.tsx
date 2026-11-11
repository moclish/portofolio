/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EducationalMethod } from './components/EducationalMethod';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { MawarisCalculator } from './components/MawarisCalculator';
import { Portfolio } from './components/Portfolio';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { Toast } from './components/Toast';

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
      <div className="min-h-screen text-gray-800 dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white transition-colors duration-300">
        {/* Top of page anchor for 100% reliable scroll-to-top */}
        <div id="page-top" className="absolute top-0 left-0 w-px h-px pointer-events-none opacity-0" aria-hidden="true" />

        {/* Sticky Navigation */}
        <Navbar />

        {/* Main Content Sections */}
        <main>
          <Hero />
          <EducationalMethod />
          <Experience />
          <Education />
          <Portfolio />
          <MawarisCalculator onShowToast={showToast} />
          <Contact onShowToast={showToast} />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Utilities */}
        <BackToTop />
        <Toast message={toastMessage} onClose={closeToast} />
      </div>
    </ThemeProvider>
  );
}
