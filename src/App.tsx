/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
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

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen text-gray-800 antialiased selection:bg-brand-500 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <EducationalMethod />
        <Experience />
        <Education />
        <MawarisCalculator onShowToast={showToast} />
        <Portfolio />
        <Contact onShowToast={showToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Utilities */}
      <BackToTop />
      <Toast message={toastMessage} />
    </div>
  );
}
