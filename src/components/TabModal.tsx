import React, { useState, useEffect } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { CategoryTab, UnitType } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface TabModalProps {
  isOpen: boolean;
  editingTab: CategoryTab | null;
  canDelete?: boolean;
  onClose: () => void;
  onSaveTab: (tabData: { title: string; emoji: string; defaultUnit: UnitType }) => void;
  onDeleteTab?: (tabId: string) => void;
}

const EMOJI_PRESETS = [
  '🥛', '🧀', '🥩', '☕', '🍫', '🧼', '🧻', '🐱', '🍷', '🍎',
  '🥖', '🧴', '💊', '🍕', '🥚', '🧃', '🍪', '🧺', '🥫', '🍦'
];

export const TabModal: React.FC<TabModalProps> = ({
  isOpen,
  editingTab,
  canDelete = false,
  onClose,
  onSaveTab,
  onDeleteTab
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

  const handleDelete = () => {
    if (editingTab && onDeleteTab) {
      triggerHaptic('warning');
      onDeleteTab(editingTab.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center text-xl">
              {emoji}
            </div>
            <h3 className="text-lg font-semibold text-[var(--md-sys-color-on-surface)]">
              {editingTab ? 'Редактировать категорию' : 'Новая категория'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 cursor-pointer"
          >
            <MaterialIcon name="close" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1 pl-1">
              Название категории <span className="text-[var(--md-sys-color-error)]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Кофе и чай"
              className="w-full px-4 py-3 bg-[var(--md-sys-color-surface-container-highest)]/70 rounded-2xl text-sm text-[var(--md-sys-color-on-surface)] focus:outline-none focus:bg-[var(--md-sys-color-surface-container-highest)] focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1.5 pl-1">
              Иконка:
            </label>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-[var(--md-sys-color-surface-container-highest)]/50 rounded-2xl max-h-28 overflow-y-auto">
              {EMOJI_PRESETS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setEmoji(em);
                  }}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                    emoji === em
                      ? 'bg-[var(--md-sys-color-secondary-container)] scale-110 shadow-xs'
                      : 'hover:bg-[var(--md-sys-color-surface-container-highest)]'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1 pl-1">
              Единица измерения по умолчанию:
            </label>
            <select
              value={defaultUnit}
              onChange={(e) => setDefaultUnit(e.target.value as UnitType)}
              className="w-full px-4 py-3 bg-[var(--md-sys-color-surface-container-highest)]/70 rounded-2xl text-sm font-medium text-[var(--md-sys-color-on-surface)] focus:outline-none focus:bg-[var(--md-sys-color-surface-container-highest)] focus:ring-2 focus:ring-[var(--md-sys-color-primary)] cursor-pointer"
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

          <div className="flex items-center justify-between pt-2">
            {editingTab && canDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="h-10 px-3.5 rounded-full text-xs font-semibold text-[var(--md-sys-color-error)] hover:bg-[var(--md-sys-color-error-container)]/30 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <MaterialIcon name="delete" className="w-4 h-4" />
                <span>Удалить</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 rounded-full text-xs font-semibold text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)]/12 cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-full text-xs font-semibold text-[var(--md-sys-color-on-primary)] bg-[var(--md-sys-color-primary)] hover:opacity-90 transition-all cursor-pointer"
              >
                Сохранить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
