/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div
      id="toast"
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[120] transform transition-all duration-300 bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-gray-700/80 max-w-[90vw] whitespace-nowrap ${
        message
          ? 'translate-y-0 opacity-100 scale-100'
          : '-translate-y-8 opacity-0 pointer-events-none scale-95'
      }`}
    >
      <i className="fa-solid fa-circle-check text-emerald-400 text-base" id="toastIcon"></i>
      <span id="toastMsg">{message || 'Notifikasi'}</span>
    </div>
  );
};
