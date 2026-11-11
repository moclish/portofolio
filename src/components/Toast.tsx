/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState<string>(message || '');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simpan teks pesan terakhir agar selama transisi keluar (fade out 300ms),
  // teks tidak berubah menjadi fallback atau berkedip teks lain
  useEffect(() => {
    if (message) {
      setDisplayedMessage(message);
    }
  }, [message]);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const isWarning =
    Boolean(displayedMessage) &&
    (displayedMessage.startsWith('Mohon') ||
      displayedMessage.startsWith('Gagal') ||
      displayedMessage.startsWith('Tidak') ||
      displayedMessage.includes('tidak boleh'));

  const content = (
    <div
      id="toast"
      role="status"
      aria-live="polite"
      onClick={onClose}
      className={`fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[10001] transition-all duration-300 ease-out bg-gray-900/95 dark:bg-slate-900/95 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl shadow-2xl shadow-black/35 border ${
        isWarning
          ? 'border-amber-500/50 dark:border-amber-500/60'
          : 'border-emerald-500/40 dark:border-emerald-400/50'
      } backdrop-blur-md flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold w-max max-w-[94vw] sm:max-w-[90vw] cursor-pointer select-none ${
        message
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : '-translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 ${
          isWarning
            ? 'bg-amber-500/20 text-amber-400'
            : 'bg-emerald-500/20 text-emerald-400'
        }`}
      >
        <i
          className={`fa-solid ${
            isWarning ? 'fa-circle-exclamation' : 'fa-circle-check'
          } text-xs sm:text-sm`}
          id="toastIcon"
        ></i>
      </div>
      <span
        id="toastMsg"
        className="leading-snug text-slate-100 font-medium text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap line-clamp-2 sm:line-clamp-none text-left"
      >
        {displayedMessage}
      </span>
      {Boolean(message) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="ml-1 sm:ml-2 text-slate-400 hover:text-white transition-colors p-1 shrink-0 flex items-center justify-center rounded-lg hover:bg-white/10"
          aria-label="Tutup notifikasi"
        >
          <i className="fa-solid fa-xmark text-xs"></i>
        </button>
      )}
    </div>
  );

  return createPortal(content, document.body);
};
