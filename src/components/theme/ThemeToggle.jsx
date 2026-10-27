import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ className = '', showLabel = true }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm ${
        isDark
          ? 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-amber-400'
          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Global Theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
        <Sun
          className={`w-4 h-4 text-amber-400 transform transition-all duration-500 absolute ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon
          className={`w-4 h-4 text-slate-700 transform transition-all duration-500 absolute ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </div>

      {showLabel && (
        <span className="text-[11px] font-bold select-none text-slate-700 dark:text-slate-300">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
