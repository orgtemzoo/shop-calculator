import React, { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { CategoryTab } from '../types';
import { UNITS_CONFIG, formatMoney, formatQuantity, calculateComparison } from '../utils/calculator';
import { serializeTabToHash } from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';

interface ShareModalProps {
  isOpen: boolean;
  tab: CategoryTab;
  currencySymbol?: string;
  onClose: () => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  tab,
  currencySymbol = '₽',
  onClose,
  onShowToast
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Generate plain text summary
  const generateReport = (): string => {
    if (tab.products.length === 0) return 'Список пуст';

    const calculated = calculateComparison(tab.products, currencySymbol);

    const lines: string[] = [
      `🛒 Сравнение цен: ${tab.emoji} ${tab.title}`,
      `━━━━━━━━━━━━━━━━━━━`
    ];

    calculated.forEach((p) => {
      const unitInfo = UNITS_CONFIG[p.unit] || UNITS_CONFIG.g;
      const medal = p.rank === 1 ? '🥇 ЛУЧШИЙ: ' : `${p.rank}. `;
      lines.push(`${medal}${p.name}`);
      lines.push(
        `   • Фасовка: ${formatQuantity(p.quantity, p.unit, p.packCount)} = ${formatMoney(p.price, currencySymbol)}`
      );
      lines.push(
        `   • За ${unitInfo.standardUnit}: ${formatMoney(p.pricePerStandardUnit, currencySymbol)}`
      );
      if (p.discountSummaryText) {
        lines.push(`   • Акция: ${p.discountSummaryText}`);
      }
    });

    lines.push(`━━━━━━━━━━━━━━━━━━━`);
    lines.push(`Рассчитано в Калькуляторе выгоды 📊`);

    return lines.join('\n');
  };

  const reportText = generateReport();

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
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center">
              <MaterialIcon name="share" className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--md-sys-color-on-surface)]">
              Поделиться списком
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 cursor-pointer"
          >
            <MaterialIcon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] pl-1">
            Текст для Telegram / WhatsApp:
          </label>
          <textarea
            readOnly
            rows={7}
            value={reportText}
            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)]/60 rounded-2xl text-xs font-mono text-[var(--md-sys-color-on-surface)] focus:outline-none resize-none select-all"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto h-10 px-5 rounded-full text-xs font-semibold text-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface-container-highest)] hover:bg-[var(--md-sys-color-surface-container-highest)]/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MaterialIcon name={copiedLink ? 'check' : 'link'} className="w-4 h-4" />
            <span>{copiedLink ? 'Ссылка скопирована' : 'Копировать ссылку'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="w-full sm:w-auto h-10 px-6 rounded-full text-xs font-semibold text-[var(--md-sys-color-on-primary)] bg-[var(--md-sys-color-primary)] hover:opacity-90 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <MaterialIcon name={copiedText ? 'check' : 'content_copy'} className="w-4 h-4" />
            <span>{copiedText ? 'Текст скопирован' : 'Копировать текст'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
