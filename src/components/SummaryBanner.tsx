import React from 'react';
import confetti from 'canvas-confetti';
import { MaterialIcon } from './MaterialIcon';
import { CalculatedProduct } from '../types';
import { UNITS_CONFIG, formatMoney } from '../utils/calculator';
import { triggerHaptic } from '../utils/haptics';

interface SummaryBannerProps {
  products: CalculatedProduct[];
}

export const SummaryBanner: React.FC<SummaryBannerProps> = ({ products }) => {
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

  const fireConfetti = () => {
    triggerHaptic('success');
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div
      onClick={fireConfetti}
      className="cursor-pointer bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] rounded-3xl p-5 border border-[var(--md-sys-color-primary)]/20 transition-all hover:bg-[var(--md-sys-color-primary-container)]/90 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] flex items-center justify-center shrink-0">
            <MaterialIcon name="savings" className="text-2xl" filled />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Итоги сравнения
            </span>
            <div className="text-base font-bold leading-tight">
              Лидер: {bestProduct.name}
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

      <div className="mt-3 pt-3 border-t border-[var(--md-sys-color-on-primary-container)]/15 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name="trending_down" className="text-base" />
          <span>
            Экономия <strong>{formatMoney(maxSavingsRub)}</strong> на каждый{' '}
            <strong>{unitInfo.standardUnit}</strong>
          </span>
        </div>
        <span className="text-[11px] opacity-70">Нажмите для салюта 🎉</span>
      </div>
    </div>
  );
};
