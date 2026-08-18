import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CategoryTab, UnitType } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface TabModalProps {
  isOpen: boolean;
  editingTab: CategoryTab | null;
  onClose: () => void;
  onSaveTab: (tabData: { title: string; emoji: string; defaultUnit: UnitType }) => void;
}

const EMOJI_PRESETS = [
  '🥛', '🧀', '🥩', '☕', '🍫', '🧼', '🧻', '🐱', '🍷', '🍎',
  '🥖', '🧴', '💊', '🍕', '🥚', '🧃', '🍪', '🧺', '🥫', '🍦'
];

export const TabModal: React.FC<TabModalProps> = ({
  isOpen,
  editingTab,
  onClose,
  onSaveTab
}) => {
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🛒');
  const [defaultUnit, setDefaultUnit] = useState<UnitType>('g');

  useEffect(() => {
    if (editingTab) {
      setTitle(editingTab.title);
      setEmoji(editingTab.emoji);
      setDefaultUnit(editingTab.defaultUnit || 'g');
    } else {
      setTitle('');
      setEmoji('🛒');
      setDefaultUnit('g');
    }
  }, [editingTab, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    triggerHaptic('success');
    onSaveTab({
      title: title.trim(),
      emoji: emoji || '🛒',
      defaultUnit
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              {emoji}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {editingTab ? 'Редактировать категорию' : 'Новая категория'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Название категории <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Кофе и чай, Стиральный порошок..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Иконка / Эмодзи:
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl max-h-32 overflow-y-auto">
              {EMOJI_PRESETS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setEmoji(em);
                  }}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                    emoji === em
                      ? 'bg-emerald-600 text-white shadow-sm scale-110'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Единица измерения по умолчанию:
            </label>
            <select
              value={defaultUnit}
              onChange={(e) => setDefaultUnit(e.target.value as UnitType)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 cursor-pointer"
            >
              <option value="g">Граммы (г) / Килограммы (кг)</option>
              <option value="ml">Миллилитры (мл) / Литры (л)</option>
              <option value="pcs">Штуки (шт)</option>
              <option value="roll">Рулоны (рул)</option>
              <option value="caps">Капсулы (капс)</option>
              <option value="tablet">Таблетки (табл)</option>
              <option value="pack">Пакетики (пак)</option>
              <option value="meter">Метры (м)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Сохранить</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
