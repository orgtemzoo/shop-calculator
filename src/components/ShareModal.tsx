import React, { useState } from 'react';
import {
  X,
  Check,
  Share2,
  Link2,
  MessageSquareShare
} from 'lucide-react';
import { CategoryTab, CalculatedProduct } from '../types';
import { UNITS_CONFIG, formatMoney, formatQuantity } from '../utils/calculator';
import { serializeTabToHash } from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';

interface ShareModalProps {
  tab: CategoryTab;
  calculatedProducts: CalculatedProduct[];
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  tab,
  calculatedProducts,
  isOpen,
  onClose,
  onShowToast
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Generate pretty messenger text
  const generateTextReport = () => {
    if (calculatedProducts.length === 0) return '';

    let text = `🛒 Сравнение выгоды: ${tab.emoji} ${tab.title}\n`;
    text += `━━━━━━━━━━━━━━━━━━━\n`;

    calculatedProducts.forEach((p) => {
      const unitInfo = UNITS_CONFIG[p.unit] || UNITS_CONFIG.g;
      const medal = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : '▫️';
      const winnerTag = p.isBestDeal && calculatedProducts.length > 1 ? ' (🏆 Самый выгодный!)' : '';
      const diffTag = !p.isBestDeal && p.diffPercentVsBest > 0 ? ` (+${p.diffPercentVsBest.toFixed(1)}% дороже)` : '';
      
      text += `${medal} #${p.rank} ${p.name}\n`;
      text += `   • Фасовка: ${formatQuantity(p.quantity, p.unit, p.packCount)}\n`;
      text += `   • Итог: ${formatMoney(p.pricePerStandardUnit)} / ${unitInfo.standardUnit}${winnerTag}${diffTag}\n\n`;
    });

    if (calculatedProducts.length >= 2) {
      const best = calculatedProducts[0];
      const worst = calculatedProducts[calculatedProducts.length - 1];
      const diffRub = worst.pricePerStandardUnit - best.pricePerStandardUnit;
      const unitInfo = UNITS_CONFIG[best.unit] || UNITS_CONFIG.g;
      text += `💰 Экономия: до ${formatMoney(diffRub)} на каждый ${unitInfo.standardUnit}!\n`;
    }

    text += `\n✨ Рассчитано в Шоп-Калькуляторе`;
    return text;
  };

  const reportText = generateTextReport();

  const handleCopyText = async () => {
    try {
      triggerHaptic('success');
      await navigator.clipboard.writeText(reportText);
      setCopiedText(true);
      onShowToast('Текст скопирован для отправки в мессенджер!', 'success');
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      onShowToast('Не удалось скопировать текст', 'error');
    }
  };

  const handleCopyLink = async () => {
    try {
      triggerHaptic('success');
      const hash = serializeTabToHash(tab);
      const url = `${window.location.origin}${window.location.pathname}#${hash}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      onShowToast('Ссылка на этот список скопирована!', 'success');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      onShowToast('Не удалось скопировать ссылку', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Поделиться списком сравнения
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Текстовый отчет для Telegram / WhatsApp:
            </label>
            <textarea
              readOnly
              rows={8}
              value={reportText}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none resize-none select-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.99] shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {copiedText ? <Check className="w-4 h-4" /> : <MessageSquareShare className="w-4 h-4" />}
              <span>{copiedText ? 'Скопировано!' : 'Копировать для чата'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.99] transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4 text-sky-500" />}
              <span>{copiedLink ? 'Ссылка скопирована!' : 'Копировать ссылку'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
