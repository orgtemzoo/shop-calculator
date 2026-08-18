import React from 'react';
import { MaterialIcon } from './MaterialIcon';
import { CalculatedProduct } from '../types';
import { UNITS_CONFIG, formatMoney, formatQuantity } from '../utils/calculator';
import { triggerHaptic } from '../utils/haptics';

interface ProductCardProps {
  product: CalculatedProduct;
  currencySymbol?: string;
  totalInGroup: number;
  secondBestPrice?: number;
  onEdit: (product: CalculatedProduct) => void;
  onDuplicate: (product: CalculatedProduct) => void;
  onDelete: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currencySymbol = '₽',
  totalInGroup,
  secondBestPrice,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const unitInfo = UNITS_CONFIG[product.unit] || UNITS_CONFIG.g;
  const isBest = product.isBestDeal && totalInGroup > 1;

  let bestSavingsText = null;
  if (product.isBestDeal && secondBestPrice && secondBestPrice > product.pricePerStandardUnit) {
    const diffPct = (
      ((secondBestPrice - product.pricePerStandardUnit) / secondBestPrice) *
      100
    ).toFixed(1);
    const diffRub = (secondBestPrice - product.pricePerStandardUnit).toFixed(2);
    bestSavingsText = `Выгоднее 2-го места на ${diffPct}% (экономия ${diffRub} ${currencySymbol} за ${unitInfo.standardUnit})`;
  }

  return (
    <div
      className={`rounded-[28px] p-5 sm:p-6 transition-all ${
        isBest
          ? 'bg-[var(--md-sys-color-primary-container)]/35 border-2 border-[var(--md-sys-color-primary)]'
          : 'bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60'
      }`}
    >
      {/* Top row: Rank, Best Deal Badge & Name */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="h-6 px-3 rounded-full text-xs font-bold inline-flex items-center justify-center bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)]">
              #{product.rank}
            </span>

            {isBest && (
              <span className="h-6 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-xs">
                <MaterialIcon name="emoji_events" className="text-sm" filled />
                <span>Самый выгодный</span>
              </span>
            )}

            {product.discountSummaryText && (
              <span className="h-6 px-3 rounded-full text-xs font-medium inline-flex items-center gap-1 bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]">
                <MaterialIcon name="sell" className="text-xs" />
                <span>{product.discountSummaryText}</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-[var(--md-sys-color-on-surface)] truncate pt-0.5">
            {product.name}
          </h3>

          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
            Фасовка: {formatQuantity(product.quantity, product.unit, product.packCount)} • Цена:{' '}
            {formatMoney(product.price, currencySymbol)}
            {product.packCount > 1 && ` × ${product.packCount} шт`}
          </p>
        </div>

        {/* Main Unit Price */}
        <div className="text-right shrink-0">
          <div
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isBest
                ? 'text-[var(--md-sys-color-primary)]'
                : 'text-[var(--md-sys-color-on-surface)]'
            }`}
          >
            {formatMoney(product.pricePerStandardUnit, currencySymbol)}
          </div>
          <div className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
            за {unitInfo.standardUnit}
          </div>
        </div>
      </div>

      {/* Difference breakdown for comparison */}
      {totalInGroup > 1 && (
        <div className="mt-4 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/40">
          {product.isBestDeal ? (
            bestSavingsText ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)]/50 px-3.5 py-2 rounded-full">
                <MaterialIcon name="trending_down" className="text-base shrink-0" />
                <span>{bestSavingsText}</span>
              </div>
            ) : null
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-[var(--md-sys-color-error)]">
                <div className="flex items-center gap-1">
                  <MaterialIcon name="trending_up" className="text-sm shrink-0" />
                  <span>+ {product.diffPercentVsBest.toFixed(1)}% дороже лидера</span>
                </div>
                <span>+{(product.diffPriceVsBest).toFixed(2)} {currencySymbol} / {unitInfo.standardUnit}</span>
              </div>

              <div className="w-full bg-[var(--md-sys-color-surface-container-highest)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--md-sys-color-error)] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (product.diffPercentVsBest / 100) * 100 + 15)}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* M3 Card Action Row */}
      <div className="mt-3 pt-2 flex items-center justify-end gap-1.5 border-t border-[var(--md-sys-color-outline-variant)]/30">
        <button
          onClick={() => {
            triggerHaptic('light');
            onDuplicate(product);
          }}
          title="Дублировать"
          className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 active:bg-[var(--md-sys-color-on-surface)]/12 transition-colors cursor-pointer"
        >
          <MaterialIcon name="content_copy" className="text-base" />
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            onEdit(product);
          }}
          title="Редактировать"
          className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 active:bg-[var(--md-sys-color-on-surface)]/12 transition-colors cursor-pointer"
        >
          <MaterialIcon name="edit" className="text-base" />
        </button>

        <button
          onClick={() => {
            triggerHaptic('warning');
            onDelete(product.id);
          }}
          title="Удалить"
          className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-error)] hover:bg-[var(--md-sys-color-error-container)]/30 active:bg-[var(--md-sys-color-error-container)]/50 transition-colors cursor-pointer"
        >
          <MaterialIcon name="delete" className="text-base" />
        </button>
      </div>
    </div>
  );
};
