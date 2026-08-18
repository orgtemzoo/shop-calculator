import React, { useState, useEffect } from 'react';
import { MaterialIcon } from './MaterialIcon';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)]/60 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
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
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8"
          >
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
              Название категории <span className="text-[var(--md-sys-color-error)]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Кофе и чай"
              className="w-full px-3.5 py-2.5 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-xl text-sm text-[var(--md-sys-color-on-surface)] focus:outline-none focus:border-[var(--md-sys-color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1.5">
              Иконка категории:
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)]/60 rounded-xl max-h-32 overflow-y-auto">
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
                      ? 'bg-[var(--md-sys-color-secondary-container)] scale-110'
                      : 'hover:bg-[var(--md-sys-color-surface-container-high)]'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
              Единица измерения по умолчанию:
            </label>
            <select
              value={defaultUnit}
              onChange={(e) => setDefaultUnit(e.target.value as UnitType)}
              className="w-full px-3.5 py-2.5 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-xl text-sm font-medium text-[var(--md-sys-color-on-surface)] focus:outline-none focus:border-[var(--md-sys-color-primary)] cursor-pointer"
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

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-full text-xs font-medium text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)]/8"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-full text-xs font-medium text-[var(--md-sys-color-on-primary)] bg-[var(--md-sys-color-primary)] hover:opacity-90 transition-all cursor-pointer"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
