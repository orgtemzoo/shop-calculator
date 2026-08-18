import React from 'react';
import {
  Crown,
  Edit2,
  Copy,
  Trash2,
  Tag,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { CalculatedProduct } from '../types';
import { UNITS_CONFIG, formatMoney, formatQuantity } from '../utils/calculator';
import { triggerHaptic } from '../utils/haptics';

interface ProductCardProps {
  product: CalculatedProduct;
  totalInGroup: number;
  secondBestPrice?: number;
  onEdit: (product: CalculatedProduct) => void;
  onDuplicate: (product: CalculatedProduct) => void;
  onDelete: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  totalInGroup,
  secondBestPrice,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const unitInfo = UNITS_CONFIG[product.unit] || UNITS_CONFIG.g;
  const isBest = product.isBestDeal && totalInGroup > 1;

  // Calculate savings vs second best for the best deal
  let bestSavingsText = null;
  if (product.isBestDeal && secondBestPrice && secondBestPrice > product.pricePerStandardUnit) {
    const diffPct = (
      ((secondBestPrice - product.pricePerStandardUnit) / secondBestPrice) *
      100
    ).toFixed(1);
    const diffRub = (secondBestPrice - product.pricePerStandardUnit).toFixed(2);
    bestSavingsText = `Выгоднее второго места на ${diffPct}% (экономия ${diffRub} ₽ за ${unitInfo.standardUnit})`;
  }

  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-200 ${
        isBest
          ? 'bg-gradient-to-br from-emerald-50/90 via-emerald-100/40 to-teal-50/90 dark:from-emerald-950/60 dark:via-slate-900 dark:to-teal-950/40 border-2 border-emerald-500/80 dark:border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-400/20'
          : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Best Deal Badge */}
      {isBest && (
        <div className="absolute -top-3 left-4 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md shadow-emerald-600/30 uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" />
          <span>Самый выгодный</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pt-1">
        {/* Product Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              #{product.rank}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {product.name}
            </h3>
          </div>

          {/* Breakdown specs */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Фасовка: {formatQuantity(product.quantity, product.unit, product.packCount)}
            </span>
            <span>•</span>
            <span>
              Цена: {formatMoney(product.price)}
              {product.packCount > 1 && ` × ${product.packCount} шт`}
            </span>
          </div>

          {/* Promo / Discount badge if any */}
          {product.discountSummaryText && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300/40 dark:border-amber-700/40">
              <Tag className="w-3 h-3 shrink-0" />
              <span>{product.discountSummaryText}</span>
            </div>
          )}
        </div>

        {/* Standard Unit Price (Main Metric) */}
        <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
          <div className="text-right">
            <div
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                isBest
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatMoney(product.pricePerStandardUnit)}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              за {unitInfo.standardUnit}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison diff banner */}
      {totalInGroup > 1 && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {product.isBestDeal ? (
            bestSavingsText ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{bestSavingsText}</span>
              </div>
            ) : null
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    На +{product.diffPercentVsBest.toFixed(1)}% дороже лучшего
                  </span>
                </div>
                <span>
                  +{(product.diffPriceVsBest).toFixed(2)} ₽ / {unitInfo.standardUnit}
                </span>
              </div>

              {/* Relative comparison bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (product.diffPercentVsBest / 100) * 100 + 10
                    )}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="mt-3 pt-2.5 flex items-center justify-end gap-1 border-t border-slate-100 dark:border-slate-800/60">
        <button
          onClick={() => {
            triggerHaptic('light');
            onDuplicate(product);
          }}
          title="Дублировать товар"
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            onEdit(product);
          }}
          title="Редактировать товар"
          className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            triggerHaptic('warning');
            onDelete(product.id);
          }}
          title="Удалить товар"
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
