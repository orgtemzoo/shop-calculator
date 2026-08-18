import React from 'react';
import { MaterialIcon } from './MaterialIcon';
import { CalculatedProduct } from '../types';
import { UNITS_CONFIG, formatMoney, formatQuantity } from '../utils/calculator';

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
        {/* Leading Icon & Best Product Details */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] flex items-center justify-center shrink-0 mt-0.5">
            <MaterialIcon name="savings" className="w-6 h-6" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] px-2.5 py-0.5 rounded-full">
                Лучший выбор #{bestProduct.rank}
              </span>
              {bestProduct.discountSummaryText && (
                <span className="text-[11px] font-medium bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] px-2 py-0.5 rounded-full">
                  {bestProduct.discountSummaryText}
                </span>
              )}
            </div>

            <div className="text-base sm:text-lg font-bold leading-tight truncate">
              {bestProduct.name}
            </div>

            {/* Price tag & package details */}
            <div className="text-xs font-semibold opacity-90 flex items-center gap-1.5 flex-wrap">
              <span>{formatQuantity(bestProduct.quantity, bestProduct.unit, bestProduct.packCount)}</span>
              <span>•</span>
              <span className="text-sm font-bold text-[var(--md-sys-color-primary)]">
                {formatMoney(bestProduct.price, currencySymbol)}
              </span>
              {bestProduct.effectiveTotalPrice !== bestProduct.price && (
                <span className="opacity-75 font-normal">
                  (с учётом акции: {formatMoney(bestProduct.effectiveTotalPrice, currencySymbol)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Calculated Unit Price & Percentage Savings */}
        <div className="text-right shrink-0">
          <div className="text-lg sm:text-xl font-bold tracking-tight text-[var(--md-sys-color-primary)]">
            {formatMoney(bestProduct.pricePerStandardUnit, currencySymbol)}
          </div>
          <div className="text-[11px] font-medium opacity-80 mb-1">
            за {unitInfo.standardUnit}
          </div>
          <div className="inline-flex items-center text-xs font-bold bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] px-2.5 py-0.5 rounded-full">
            -{maxSavingsPct}%
          </div>
        </div>
      </div>

      {/* Comparison summary footer */}
      <div className="mt-3 pt-2.5 flex items-center gap-1.5 text-xs font-medium border-t border-[var(--md-sys-color-on-primary-container)]/10">
        <MaterialIcon name="trending_down" className="w-4 h-4 shrink-0 text-[var(--md-sys-color-primary)]" />
        <span>
          Выгода: <strong>{formatMoney(maxSavingsRub, currencySymbol)}</strong> на каждый{' '}
          <strong>{unitInfo.standardUnit}</strong> по сравнению с самым дорогим ({worstProduct.name} • {formatMoney(worstProduct.price, currencySymbol)})
        </span>
      </div>
    </div>
  );
};
