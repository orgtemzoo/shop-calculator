import React, { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { CategoryTab, CalculatedProduct } from '../types';
import { UNITS_CONFIG, formatMoney, formatQuantity } from '../utils/calculator';
import { serializeTabToHash } from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';

interface ShareModalProps {
  tab: CategoryTab;
  calculatedProducts: CalculatedProduct[];
  currencySymbol?: string;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  tab,
  calculatedProducts,
  currencySymbol = '₽',
  isOpen,
  onClose,
  onShowToast
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

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
      text += `   • Итог: ${formatMoney(p.pricePerStandardUnit, currencySymbol)} / ${unitInfo.standardUnit}${winnerTag}${diffTag}\n\n`;
    });

    if (calculatedProducts.length >= 2) {
      const best = calculatedProducts[0];
      const worst = calculatedProducts[calculatedProducts.length - 1];
      const diffRub = worst.pricePerStandardUnit - best.pricePerStandardUnit;
      const unitInfo = UNITS_CONFIG[best.unit] || UNITS_CONFIG.g;
      text += `💰 Экономия: до ${formatMoney(diffRub, currencySymbol)} на каждый ${unitInfo.standardUnit}!\n`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)]/60 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center">
              <MaterialIcon name="share" className="text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--md-sys-color-on-surface)]">
              Поделиться списком
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8"
          >
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)]">
            Текст для Telegram / WhatsApp:
          </label>
          <textarea
            readOnly
            rows={7}
            value={reportText}
            className="w-full p-3.5 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-xl text-xs font-mono text-[var(--md-sys-color-on-surface)] focus:outline-none resize-none select-all"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto h-10 px-5 rounded-full text-xs font-medium text-[var(--md-sys-color-primary)] border border-[var(--md-sys-color-outline)] hover:bg-[var(--md-sys-color-primary)]/8 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MaterialIcon name={copiedLink ? 'check' : 'link'} className="text-base" />
            <span>{copiedLink ? 'Ссылка скопирована' : 'Копировать ссылку'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="w-full sm:w-auto h-10 px-6 rounded-full text-xs font-medium text-[var(--md-sys-color-on-primary)] bg-[var(--md-sys-color-primary)] hover:opacity-90 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <MaterialIcon name={copiedText ? 'check' : 'content_copy'} className="text-base" />
            <span>{copiedText ? 'Текст скопирован' : 'Копировать текст'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
