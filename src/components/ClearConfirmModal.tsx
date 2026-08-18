import React from 'react';
import { Trash2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 p-5 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Очистить список «{categoryTitle}»?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Все добавленные товары в этой категории будут удалены.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.99] shadow-md shadow-rose-600/20 transition-all"
          >
            Удалить всё
          </button>
        </div>
      </div>
    </div>
  );
};
