import React from 'react';
import { MaterialIcon } from './MaterialIcon';
import { triggerHaptic } from '../utils/haptics';

interface ClearConfirmModalProps {
  isOpen: boolean;
  categoryTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearConfirmModal: React.FC<ClearConfirmModalProps> = ({
  isOpen,
  categoryTitle,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)]/60 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-in zoom-in-95">
        <div className="w-12 h-12 rounded-full bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)] flex items-center justify-center mx-auto">
          <MaterialIcon name="delete_forever" className="text-2xl" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[var(--md-sys-color-on-surface)]">
            Очистить «{categoryTitle}»?
          </h3>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
            Все товары в этой категории будут безвозвратно удалены.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 px-4 rounded-full text-xs font-medium text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-on-surface)]/8 transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('warning');
              onConfirm();
              onClose();
            }}
            className="flex-1 h-10 px-5 rounded-full text-xs font-medium text-[var(--md-sys-color-on-error)] bg-[var(--md-sys-color-error)] hover:opacity-90 transition-all cursor-pointer"
          >
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
};
