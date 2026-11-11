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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const isWarning =
    Boolean(message) &&
    (message!.startsWith('Mohon') ||
      message!.startsWith('Gagal') ||
      message!.startsWith('Tidak') ||
      message!.includes('tidak boleh'));

  const content = (
    <div
      id="toast"
      role="status"
      aria-live="polite"
      onClick={onClose}
      className={`fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[10001] transition-all duration-300 ease-out bg-gray-900/95 dark:bg-slate-900/95 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl shadow-black/35 border ${
        isWarning
          ? 'border-amber-500/50 dark:border-amber-500/60'
          : 'border-emerald-500/40 dark:border-emerald-400/50'
      } backdrop-blur-md flex items-center gap-3 text-xs sm:text-sm font-semibold max-w-[92vw] sm:max-w-md cursor-pointer select-none ${
        message
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : '-translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
          isWarning
            ? 'bg-amber-500/20 text-amber-400'
            : 'bg-emerald-500/20 text-emerald-400'
        }`}
      >
        <i
          className={`fa-solid ${
            isWarning ? 'fa-circle-exclamation' : 'fa-circle-check'
          } text-sm sm:text-base`}
          id="toastIcon"
        ></i>
      </div>
      <span id="toastMsg" className="leading-snug text-slate-100 font-medium">
        {message || 'Notifikasi'}
      </span>
      {message && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="ml-1 text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Tutup notifikasi"
        >
          <i className="fa-solid fa-xmark text-xs"></i>
        </button>
      )}
    </div>
  );

  return createPortal(content, document.body);
};
