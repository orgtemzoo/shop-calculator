import React from 'react';
import { Award, TrendingDown, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
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
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div
      onClick={fireConfetti}
      className="cursor-pointer group bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-emerald-700/20 ring-1 ring-white/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                Итоги сравнения
              </span>
              <Sparkles className="w-3 h-3 text-amber-300 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="text-base sm:text-lg font-black leading-snug">
              Победитель: {bestProduct.name}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs font-medium text-emerald-200">Экономия до</div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 leading-tight">
            -{maxSavingsPct}%
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-emerald-100">
        <div className="flex items-center gap-1.5">
          <TrendingDown className="w-4 h-4 text-amber-300" />
          <span>
            Экономия: <strong>{formatMoney(maxSavingsRub)}</strong> на каждый{' '}
            <strong>{unitInfo.standardUnit}</strong> по сравнению с самым дорогим
          </span>
        </div>
        <span className="text-[11px] opacity-80">Нажмите для салюта 🎉</span>
      </div>
    </div>
  );
};
