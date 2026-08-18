import React from 'react';
import { MaterialIcon } from './MaterialIcon';
import { triggerHaptic } from '../utils/haptics';

export interface CurrencyOption {
  symbol: string;
  code: string;
  name: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { symbol: '₽', code: 'RUB', name: 'Российский рубль (₽)' },
  { symbol: '$', code: 'USD', name: 'Доллар США ($)' },
  { symbol: '€', code: 'EUR', name: 'Евро (€)' },
  { symbol: '₸', code: 'KZT', name: 'Казахстанский тенге (₸)' },
  { symbol: '₴', code: 'UAH', name: 'Украинская гривна (₴)' },
  { symbol: 'BYN', code: 'BYN', name: 'Белорусский рубль (BYN)' },
  { symbol: '₾', code: 'GEL', name: 'Грузинский лари (₾)' },
  { symbol: '֏', code: 'AMD', name: 'Армянский драм (֏)' },
  { symbol: 'сум', code: 'UZS', name: 'Узбекский сум (сум)' },
  { symbol: 'AED', code: 'AED', name: 'Дирхам ОАЭ (AED)' },
  { symbol: '₺', code: 'TRY', name: 'Турецкая лира (₺)' },
  { symbol: 'zł', code: 'PLN', name: 'Польский злотый (zł)' }
];

interface CurrencyModalProps {
  isOpen: boolean;
  selectedCurrency: string;
  onClose: () => void;
  onSelectCurrency: (currencySymbol: string) => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  selectedCurrency,
  onClose,
  onSelectCurrency
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)]/60 shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center text-lg font-bold">
              {selectedCurrency}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--md-sys-color-on-surface)]">
                Выбор валюты
              </h3>
              <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
                Для всех цен в приложении
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 cursor-pointer"
          >
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        {/* Currency List */}
        <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
          {CURRENCY_OPTIONS.map((cur) => {
            const isSelected = cur.symbol === selectedCurrency;
            return (
              <button
                key={cur.code}
                onClick={() => {
                  triggerHaptic('success');
                  onSelectCurrency(cur.symbol);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                    : 'hover:bg-[var(--md-sys-color-on-surface)]/8 text-[var(--md-sys-color-on-surface)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)]/60 flex items-center justify-center text-xs font-bold shrink-0">
                    {cur.symbol}
                  </span>
                  <span>{cur.name}</span>
                </div>
                {isSelected && (
                  <MaterialIcon name="check" className="text-lg text-[var(--md-sys-color-primary)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
