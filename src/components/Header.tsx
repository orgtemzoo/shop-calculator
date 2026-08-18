import React from 'react';
import { MaterialIcon } from './MaterialIcon';
import { CURRENCY_OPTIONS } from './CurrencyModal';
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
  const activeFlag = CURRENCY_OPTIONS.find((c) => c.symbol === currencySymbol)?.flag;
  const toggleTheme = () => {
    triggerHaptic('light');
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    onThemeChange(nextTheme);
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--md-sys-color-surface)] border-b border-[var(--md-sys-color-outline-variant)]/50 transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* App Title & Leading Icon */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] hidden sm:flex items-center justify-center shrink-0">
            <MaterialIcon name="calculate" className="w-5 h-5 text-[var(--md-sys-color-on-primary-container)]" filled />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-[var(--md-sys-color-on-surface)] whitespace-nowrap">
              Калькулятор выгоды
            </h1>
            <p className="text-[11px] sm:text-xs text-[var(--md-sys-color-on-surface-variant)] truncate hidden md:block">
              Сравнение стоимости за единицу
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {/* Currency Switcher */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenCurrency();
            }}
            title={`Валюта: ${currencySymbol}`}
            className="h-8 sm:h-9 pl-2 pr-2.5 rounded-full flex items-center gap-1.5 text-xs font-bold bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/60 cursor-pointer transition-colors"
          >
            {activeFlag && (
              <img
                src={`./flags/${activeFlag}.svg`}
                alt=""
                className="w-4 h-4 rounded-full object-cover shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <span>{currencySymbol}</span>
            <MaterialIcon name="arrow_drop_down" className="w-4 h-4 text-[var(--md-sys-color-on-surface-variant)] -mr-1" />
          </button>

          {/* Share */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenShare();
            }}
            disabled={!hasProducts}
            title="Поделиться списком"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 active:bg-[var(--md-sys-color-on-surface)]/12 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <MaterialIcon name="share" className="w-5 h-5" />
          </button>

          {/* Backup / Restore JSON */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenBackup();
            }}
            title="Резервное копирование"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 active:bg-[var(--md-sys-color-on-surface)]/12 transition-colors cursor-pointer"
          >
            <MaterialIcon name="sync" className="w-5 h-5" />
          </button>

          {/* Clear Category */}
          <button
            onClick={() => {
              triggerHaptic('warning');
              onClearCategory();
            }}
            disabled={!hasProducts}
            title={`Очистить: ${activeCategoryName}`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-error)] hover:bg-[var(--md-sys-color-error-container)]/30 active:bg-[var(--md-sys-color-error-container)]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <MaterialIcon name="delete" className="w-5 h-5" />
          </button>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            title={`Тема: ${theme === 'light' ? 'Светлая' : theme === 'dark' ? 'Тёмная' : 'Системная'}`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 active:bg-[var(--md-sys-color-on-surface)]/12 transition-colors cursor-pointer"
          >
            {theme === 'light' && <MaterialIcon name="light_mode" className="w-5 h-5 text-amber-600 dark:text-amber-400" filled />}
            {theme === 'dark' && <MaterialIcon name="dark_mode" className="w-5 h-5 text-indigo-400" filled />}
            {theme === 'system' && <MaterialIcon name="desktop_windows" className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
