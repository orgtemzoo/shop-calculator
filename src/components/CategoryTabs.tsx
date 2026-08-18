import React, { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { CategoryTab } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface CategoryTabsProps {
  tabs: CategoryTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onAddTab: () => void;
  onEditTab: (tab: CategoryTab) => void;
  onDeleteTab: (tabId: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onAddTab,
  onEditTab,
  onDeleteTab
}) => {
  const [menuOpenTabId, setMenuOpenTabId] = useState<string | null>(null);

  return (
    <div className="bg-[var(--md-sys-color-surface-container-low)] border-b border-[var(--md-sys-color-outline-variant)]/40 py-2">
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const productCount = tab.products.length;

          return (
            <div key={tab.id} className="relative shrink-0 flex items-center group">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onSelectTab(tab.id);
                }}
                className={`h-10 px-4 rounded-full text-sm font-medium transition-all flex items-center gap-2 select-none ${
                  isActive
                    ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] shadow-none font-semibold'
                    : 'bg-transparent text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                }`}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span className="truncate max-w-[120px] sm:max-w-[160px]">{tab.title}</span>
                {productCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-[var(--md-sys-color-on-secondary-container)]/15 text-[var(--md-sys-color-on-secondary-container)]'
                        : 'bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)]'
                    }`}
                  >
                    {productCount}
                  </span>
                )}
              </button>

              {/* Context menu trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('light');
                  setMenuOpenTabId(menuOpenTabId === tab.id ? null : tab.id);
                }}
                className={`ml-0.5 w-7 h-7 rounded-full flex items-center justify-center transition-opacity ${
                  isActive
                    ? 'text-[var(--md-sys-color-on-secondary-container)]/70 hover:bg-[var(--md-sys-color-on-secondary-container)]/15'
                    : 'text-[var(--md-sys-color-on-surface-variant)] opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-[var(--md-sys-color-surface-container-high)]'
                }`}
                title="Опции категории"
              >
                <MaterialIcon name="more_vert" className="text-base" />
              </button>

              {/* M3 Menu */}
              {menuOpenTabId === tab.id && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpenTabId(null)}
                  />
                  <div className="absolute top-full left-0 mt-1 z-50 min-w-[180px] bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/60 rounded-2xl shadow-lg p-1.5 animate-in fade-in-50">
                    <button
                      onClick={() => {
                        setMenuOpenTabId(null);
                        onEditTab(tab);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-on-surface)]/8 rounded-xl transition-colors"
                    >
                      <MaterialIcon name="edit" className="text-lg text-[var(--md-sys-color-primary)]" />
                      <span>Изменить</span>
                    </button>
                    {tabs.length > 1 && (
                      <button
                        onClick={() => {
                          setMenuOpenTabId(null);
                          onDeleteTab(tab.id);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--md-sys-color-error)] hover:bg-[var(--md-sys-color-error-container)]/30 rounded-xl transition-colors"
                      >
                        <MaterialIcon name="delete" className="text-lg" />
                        <span>Удалить категорию</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* M3 Assist Chip: Add New Tab */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            onAddTab();
          }}
          className="shrink-0 h-10 px-3.5 rounded-full text-sm font-medium bg-transparent border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)]/8 flex items-center gap-1.5 transition-colors"
        >
          <MaterialIcon name="add" className="text-lg" />
          <span>Новая вкладка</span>
        </button>
      </div>
    </div>
  );
};
