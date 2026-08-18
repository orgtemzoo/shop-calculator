import React from 'react';
import { MaterialIcon } from './MaterialIcon';
import { triggerHaptic } from '../utils/haptics';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  currencySymbol: string;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onOpenCurrency: () => void;
  onOpenShare: () => void;
  onOpenBackup: () => void;
  onClearCategory: () => void;
  hasProducts: boolean;
  activeCategoryName: string;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  currencySymbol,
  onThemeChange,
  onOpenCurrency,
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
    <header className="sticky top-0 z-30 bg-[var(--md-sys-color-surface)] border-b border-[var(--md-sys-color-outline-variant)]/50 transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* App Title & Leading Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center shrink-0">
            <MaterialIcon name="calculate" className="text-2xl" filled />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-medium tracking-normal text-[var(--md-sys-color-on-surface)] leading-tight">
              Калькулятор выгоды
            </h1>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Сравнение стоимости за единицу
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Currency Switcher */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenCurrency();
            }}
            title={`Валюта: ${currencySymbol}`}
            className="h-9 px-2.5 rounded-full flex items-center gap-1 text-xs font-bold bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/60 cursor-pointer transition-colors"
          >
            <span>{currencySymbol}</span>
            <MaterialIcon name="arrow_drop_down" className="text-base text-[var(--md-sys-color-on-surface-variant)] -mr-0.5" />
          </button>

          {/* Share */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenShare();
            }}
            disabled={!hasProducts}
            title="Поделиться списком"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 active:bg-[var(--md-sys-color-on-surface)]/12 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <MaterialIcon name="share" className="text-xl" />
          </button>

          {/* Backup / Restore JSON */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenBackup();
            }}
            title="Резервное копирование"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 active:bg-[var(--md-sys-color-on-surface)]/12 transition-colors cursor-pointer"
          >
            <MaterialIcon name="sync" className="text-xl" />
          </button>

          {/* Clear Category */}
          <button
            onClick={() => {
              triggerHaptic('warning');
              onClearCategory();
            }}
            disabled={!hasProducts}
            title={`Очистить: ${activeCategoryName}`}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-error)] hover:bg-[var(--md-sys-color-error-container)]/30 active:bg-[var(--md-sys-color-error-container)]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <MaterialIcon name="delete" className="text-xl" />
          </button>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            title={`Тема: ${theme === 'light' ? 'Светлая' : theme === 'dark' ? 'Тёмная' : 'Системная'}`}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 active:bg-[var(--md-sys-color-on-surface)]/12 transition-colors cursor-pointer"
          >
            {theme === 'light' && <MaterialIcon name="light_mode" className="text-xl text-amber-600 dark:text-amber-400" filled />}
            {theme === 'dark' && <MaterialIcon name="dark_mode" className="text-xl text-indigo-400" filled />}
            {theme === 'system' && <MaterialIcon name="desktop_windows" className="text-xl" />}
          </button>
        </div>
      </div>
    </header>
  );
};
