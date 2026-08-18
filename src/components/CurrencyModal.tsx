import React, { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { triggerHaptic } from '../utils/haptics';

export interface CurrencyOption {
  symbol: string;
  code: string;
  flag: string;
  name: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { symbol: '₽', code: 'RUB', flag: 'ru', name: 'Российский рубль (₽)' },
  { symbol: '$', code: 'USD', flag: 'us', name: 'Доллар США ($)' },
  { symbol: '€', code: 'EUR', flag: 'eu', name: 'Евро (€)' },
  { symbol: '₸', code: 'KZT', flag: 'kz', name: 'Казахстанский тенге (₸)' },
  { symbol: '₴', code: 'UAH', flag: 'ua', name: 'Украинская гривна (₴)' },
  { symbol: 'BYN', code: 'BYN', flag: 'by', name: 'Белорусский рубль (BYN)' },
  { symbol: '₾', code: 'GEL', flag: 'ge', name: 'Грузинский лари (₾)' },
  { symbol: '֏', code: 'AMD', flag: 'am', name: 'Армянский драм (֏)' },
  { symbol: 'сум', code: 'UZS', flag: 'uz', name: 'Узбекский сум (сум)' },
  { symbol: 'сом', code: 'KGS', flag: 'kg', name: 'Кыргызский сом (сом)' },
  { symbol: 'смн', code: 'TJS', flag: 'tj', name: 'Таджикский сомони (смн)' },
  { symbol: '₼', code: 'AZN', flag: 'az', name: 'Азербайджанский манат (₼)' },
  { symbol: 'AED', code: 'AED', flag: 'ae', name: 'Дирхам ОАЭ (AED)' },
  { symbol: '₺', code: 'TRY', flag: 'tr', name: 'Турецкая лира (₺)' },
  { symbol: '£', code: 'GBP', flag: 'gb', name: 'Фунт стерлингов (£)' },
  { symbol: 'zł', code: 'PLN', flag: 'pl', name: 'Польский злотый (zł)' },
  { symbol: '¥', code: 'CNY', flag: 'cn', name: 'Китайский юань (¥)' },
  { symbol: '¥', code: 'JPY', flag: 'jp', name: 'Японская иена (¥)' },
  { symbol: '₩', code: 'KRW', flag: 'kr', name: 'Южнокорейская вона (₩)' },
  { symbol: '฿', code: 'THB', flag: 'th', name: 'Тайский бат (฿)' },
  { symbol: '₫', code: 'VND', flag: 'vn', name: 'Вьетнамский донг (₫)' },
  { symbol: '₹', code: 'INR', flag: 'in', name: 'Индийская рупия (₹)' },
  { symbol: 'R$', code: 'BRL', flag: 'br', name: 'Бразильский реал (R$)' },
  { symbol: '₪', code: 'ILS', flag: 'il', name: 'Израильский шекель (₪)' },
  { symbol: '₮', code: 'USDT', flag: 'usdt', name: 'Tether USD (₮)' },
  { symbol: '₿', code: 'BTC', flag: 'btc', name: 'Bitcoin (₿)' }
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
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const currentOption = CURRENCY_OPTIONS.find((c) => c.symbol === selectedCurrency) || CURRENCY_OPTIONS[0];

  const filteredOptions = CURRENCY_OPTIONS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)]/60 shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`./flags/${currentOption.flag}.svg`}
              alt=""
              className="w-10 h-10 rounded-full object-cover shadow-xs shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h3 className="text-base font-semibold text-[var(--md-sys-color-on-surface)]">
                Выбор валюты
              </h3>
              <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
                Текущая: {currentOption.code} ({currentOption.symbol})
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

        {/* Search input */}
        <div className="relative flex items-center h-11 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-full px-4 focus-within:border-[var(--md-sys-color-primary)] focus-within:ring-2 focus-within:ring-[var(--md-sys-color-primary)]/20 transition-all">
          <MaterialIcon name="search" className="text-lg text-[var(--md-sys-color-on-surface-variant)] mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск валюты..."
            className="w-full bg-transparent text-xs text-[var(--md-sys-color-on-surface)] focus:outline-none placeholder:text-[var(--md-sys-color-outline)]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] cursor-pointer"
            >
              <MaterialIcon name="close" className="text-base" />
            </button>
          )}
        </div>

        {/* Currency List */}
        <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
          {filteredOptions.map((cur) => {
            const isSelected = cur.symbol === selectedCurrency;
            return (
              <button
                key={cur.code}
                onClick={() => {
                  triggerHaptic('success');
                  onSelectCurrency(cur.symbol);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                    : 'hover:bg-[var(--md-sys-color-on-surface)]/8 text-[var(--md-sys-color-on-surface)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={`./flags/${cur.flag}.svg`}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover shrink-0 shadow-xs"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="truncate">{cur.name}</span>
                </div>
                {isSelected && (
                  <MaterialIcon name="check" className="text-lg text-[var(--md-sys-color-primary)] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
          {filteredOptions.length === 0 && (
            <div className="text-center py-6 text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Валюта не найдена
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
