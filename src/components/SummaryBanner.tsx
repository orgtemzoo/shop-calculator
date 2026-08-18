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
    <div className="bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] rounded-[28px] p-5 sm:p-6 transition-all">
      <div className="flex items-start justify-between gap-3">
        {/* Leading Icon & Product Info */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center shrink-0">
            <MaterialIcon name="savings" className="w-5 h-5" />
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            {/* Unified Badges Row (identical to ProductCard) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="h-6 px-3 rounded-full text-xs font-bold inline-flex items-center justify-center bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)]">
                #1
              </span>

              <span className="h-6 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]">
                <MaterialIcon name="emoji_events" className="w-3.5 h-3.5" />
                <span>Самый выгодный</span>
              </span>

              {bestProduct.discountSummaryText && (
                <span className="h-6 px-3 rounded-full text-xs font-medium inline-flex items-center gap-1 bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]">
                  <MaterialIcon name="sell" className="w-3.5 h-3.5" />
                  <span>{bestProduct.discountSummaryText}</span>
                </span>
              )}
            </div>

            {/* Product Name */}
            <h3 className="text-base font-semibold text-[var(--md-sys-color-on-surface)] truncate pt-0.5">
              {bestProduct.name}
            </h3>

            {/* Price & Package Subtitle (identical formatting) */}
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Фасовка: {formatQuantity(bestProduct.quantity, bestProduct.unit, bestProduct.packCount)} • Цена:{' '}
              {formatMoney(bestProduct.price, currencySymbol)}
              {bestProduct.discountType !== 'none' && (
                <span className="text-[var(--md-sys-color-primary)] font-medium ml-1">
                  (по акции: {formatMoney(bestProduct.effectiveTotalPrice, currencySymbol)})
                </span>
              )}
              {bestProduct.packCount > 1 && ` × ${bestProduct.packCount} шт`}
            </p>
          </div>
        </div>

        {/* Calculated Unit Price & Savings Badge */}
        <div className="text-right shrink-0">
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--md-sys-color-primary)]">
            {formatMoney(bestProduct.pricePerStandardUnit, currencySymbol)}
          </div>
          <div className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
            за {unitInfo.standardUnit}
          </div>
          <div className="mt-1 h-6 px-2.5 rounded-full text-xs font-bold inline-flex items-center justify-center bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]">
            -{maxSavingsPct}%
          </div>
        </div>
      </div>

      {/* Comparison Summary Footer */}
      <div className="mt-4 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/20 flex items-center gap-2 text-xs font-medium text-[var(--md-sys-color-on-surface-variant)]">
        <MaterialIcon name="trending_down" className="w-4 h-4 shrink-0 text-[var(--md-sys-color-primary)]" />
        <span>
          Выгода: <strong className="text-[var(--md-sys-color-on-surface)]">{formatMoney(maxSavingsRub, currencySymbol)}</strong> на каждый{' '}
          <strong>{unitInfo.standardUnit}</strong> по сравнению с самым дорогим ({worstProduct.name} • {formatMoney(worstProduct.price, currencySymbol)})
        </span>
      </div>
    </div>
  );
};
