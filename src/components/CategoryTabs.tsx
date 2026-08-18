import React from 'react';
import { motion } from 'motion/react';
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
            <div key={tab.id} className="relative shrink-0 flex items-center">
              {/* Genuine Material 3 Sliding Active Indicator Pill */}
              {isActive && (
                <motion.div
                  layoutId="active-category-pill"
                  className="absolute inset-0 rounded-full bg-[var(--md-sys-color-secondary-container)]"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30
                  }}
                />
              )}

              {/* Tab Button & Content */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onSelectTab(tab.id);
                }}
                className={`relative z-10 h-10 px-4 rounded-full flex items-center gap-1.5 text-sm select-none transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                    : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]/60 font-medium'
                }`}
              >
                <span className="text-base leading-none shrink-0">{tab.emoji}</span>
                <span className="truncate max-w-[110px] sm:max-w-[150px]">{tab.title}</span>

                {productCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[var(--md-sys-color-on-secondary-container)]/15 text-[var(--md-sys-color-on-secondary-container)]'
                        : 'bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)]'
                    }`}
                  >
                    {productCount}
                  </span>
                )}
              </button>

              {/* Edit Tune Button for active tab */}
              {isActive && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('light');
                    onEditTab(tab);
                  }}
                  title="Настройки категории"
                  className="relative z-10 w-7 h-7 -ml-2 mr-2 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-secondary-container)]/80 hover:bg-[var(--md-sys-color-on-secondary-container)]/20 transition-colors cursor-pointer"
                >
                  <MaterialIcon name="tune" className="text-base" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Tab Assist Chip */}
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
