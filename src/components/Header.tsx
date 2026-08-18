import React from 'react';
import {
  Sun,
  Moon,
  Laptop,
  Share2,
  Trash2,
  FolderDown
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onOpenShare: () => void;
  onOpenBackup: () => void;
  onClearCategory: () => void;
  hasProducts: boolean;
  activeCategoryName: string;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onOpenShare,
  onOpenBackup,
  onClearCategory,
  hasProducts,
  activeCategoryName
}) => {
  const toggleTheme = () => {
    triggerHaptic('light');
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    onThemeChange(nextTheme);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-1 ring-white/20">
            <span className="text-xl">🍎</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                Шоп-Калькулятор
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40">
                PRO 2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Честное сравнение реальной выгоды
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Share button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenShare();
            }}
            disabled={!hasProducts}
            title="Поделиться списком"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Backup / Restore JSON */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenBackup();
            }}
            title="Резервная копия и синхронизация"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <FolderDown className="w-4 h-4" />
          </button>

          {/* Clear Category */}
          <button
            onClick={() => {
              triggerHaptic('warning');
              onClearCategory();
            }}
            disabled={!hasProducts}
            title={`Очистить список: ${activeCategoryName}`}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            title={`Тема: ${theme === 'light' ? 'Светлая' : theme === 'dark' ? 'Тёмная' : 'Системная'}`}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
            {theme === 'system' && <Laptop className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
