/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'pill' | 'icon';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'icon',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative h-8.5 w-8.5 md:h-9 md:w-9 lg:h-9.5 lg:w-9.5 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 border border-transparent shrink-0 select-none ${
        isDark
          ? 'text-amber-300 hover:bg-slate-800/90 hover:border-slate-700/80 hover:text-amber-200 hover:shadow-xs'
          : 'text-amber-500 hover:bg-emerald-50/80 hover:border-emerald-200/80 hover:text-amber-600 hover:shadow-xs'
      } ${className}`}
      aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      title={isDark ? 'Mode Terang (Klik untuk ganti)' : 'Mode Gelap (Klik untuk ganti)'}
    >
      <div className="relative w-4 h-4 md:w-4.5 md:h-4.5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon (shown in Light mode) */}
        <i
          className={`fa-solid fa-sun text-[13px] md:text-[13px] lg:text-sm text-amber-500 transition-all duration-300 transform absolute ${
            isDark
              ? 'rotate-90 scale-0 opacity-0 pointer-events-none'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        ></i>
        {/* Moon Icon (shown in Dark mode) */}
        <i
          className={`fa-solid fa-moon text-[12px] md:text-[12px] lg:text-[13px] text-amber-300 transition-all duration-300 transform absolute ${
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0 pointer-events-none'
          }`}
        ></i>
      </div>
    </button>
  );
};
