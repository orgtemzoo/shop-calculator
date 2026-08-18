import React from 'react';
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
  onEditTab
}) => {
  return (
    <div className="bg-[var(--md-sys-color-surface-container-low)] border-b border-[var(--md-sys-color-outline-variant)]/40 py-2.5">
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const productCount = tab.products.length;

          return (
            <div
              key={tab.id}
              className={`shrink-0 h-10 rounded-full flex items-center transition-all select-none ${
                isActive
                  ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] pl-3.5 pr-1.5'
                  : 'bg-transparent text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] px-3.5'
              }`}
            >
              {/* Tab Title Click */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onSelectTab(tab.id);
                }}
                className="h-full flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span className="truncate max-w-[120px] sm:max-w-[160px]">
                  {tab.title}
                </span>

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

              {/* Always accessible Edit Button for the active tab */}
              {isActive && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('light');
                    onEditTab(tab);
                  }}
                  title="Настройки категории"
                  className="w-7 h-7 ml-1 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-secondary-container)]/80 hover:bg-[var(--md-sys-color-on-secondary-container)]/20 transition-colors cursor-pointer"
                >
                  <MaterialIcon name="tune" className="text-base" />
                </button>
              )}
            </div>
          );
        })}

        {/* M3 Assist Chip: Add New Tab */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            onAddTab();
          }}
          className="shrink-0 h-10 px-3.5 rounded-full text-sm font-medium bg-transparent border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)]/8 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <MaterialIcon name="add" className="text-lg" />
          <span>Категория</span>
        </button>
      </div>
    </div>
  );
};
