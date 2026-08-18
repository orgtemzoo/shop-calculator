import React from 'react';
import { MaterialIcon } from './MaterialIcon';
import { CalculatedProduct } from '../types';
import { UNITS_CONFIG, formatMoney } from '../utils/calculator';

interface SummaryBannerProps {
  products: CalculatedProduct[];
  currencySymbol?: string;
}

export const SummaryBanner: React.FC<SummaryBannerProps> = ({ products, currencySymbol = '₽' }) => {
  if (products.length < 2) return null;

  const bestProduct = products.find((p) => p.isBestDeal && p.rank === 1);
  const worstProduct = [...products].sort(
    (a, b) => b.pricePerStandardUnit - a.pricePerStandardUnit
  )[0];

  if (!bestProduct || !worstProduct || bestProduct.id === worstProduct.id) {
    return null;
  }

  const unitInfo = UNITS_CONFIG[bestProduct.unit] || UNITS_CONFIG.g;
  const maxSavingsRub = worstProduct.pricePerStandardUnit - bestProduct.pricePerStandardUnit;
  const maxSavingsPct = (
    (maxSavingsRub / worstProduct.pricePerStandardUnit) *
    100
  ).toFixed(1);

  return (
    <div className="bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] rounded-[28px] p-5 sm:p-6 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] flex items-center justify-center shrink-0">
            <MaterialIcon name="savings" className="w-6 h-6" filled />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Лучший выбор
            </span>
            <div className="text-base font-bold leading-tight">
              {bestProduct.name}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs font-medium opacity-80">Экономия до</div>
          <div className="text-xl font-bold text-[var(--md-sys-color-primary)]">
            -{maxSavingsPct}%
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 flex items-center gap-1.5 text-xs font-medium">
        <MaterialIcon name="trending_down" className="w-4 h-4 shrink-0" />
        <span>
          Выгода: <strong>{formatMoney(maxSavingsRub, currencySymbol)}</strong> на каждый{' '}
          <strong>{unitInfo.standardUnit}</strong> по сравнению с самым дорогим
        </span>
      </div>
    </div>
  );
};
