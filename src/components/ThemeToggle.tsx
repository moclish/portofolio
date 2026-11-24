/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaIcon } from './FaIcon';

interface ThemeToggleProps {
  className?: string;
  variant?: 'pill' | 'icon';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative h-9 w-9 md:h-9 md:w-9 lg:h-9.5 lg:w-9.5 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 border border-transparent shrink-0 select-none text-amber-600 hover:bg-emerald-50/80 hover:border-emerald-200/80 hover:text-amber-700 hover:shadow-xs dark:text-amber-300 dark:hover:bg-slate-800/90 dark:hover:border-slate-700/80 dark:hover:text-amber-200 ${className}`}
      aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      title={isDark ? 'Mode Terang (Klik untuk ganti)' : 'Mode Gelap (Klik untuk ganti)'}
    >
      <div className="relative w-4 h-4 md:w-4.5 md:h-4.5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon (shown in Light mode) */}
        <FaIcon
          name="sun"
          className="text-[13px] md:text-[13px] lg:text-sm text-amber-600 transition-all duration-300 transform absolute rotate-0 scale-100 opacity-100 dark:rotate-90 dark:scale-0 dark:opacity-0 dark:pointer-events-none"
        />
        {/* Moon Icon (shown in Dark mode) */}
        <FaIcon
          name="moon"
          className="text-[12px] md:text-[12px] lg:text-[13px] text-amber-300 transition-all duration-300 transform absolute -rotate-90 scale-0 opacity-0 pointer-events-none dark:rotate-0 dark:scale-100 dark:opacity-100 dark:pointer-events-auto"
        />
      </div>
    </button>
  );
};
