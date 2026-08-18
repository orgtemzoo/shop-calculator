import React, { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
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
    <div className="relative py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all select-none ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-400/30'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60'
                }`}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span className="truncate max-w-[120px] sm:max-w-[160px]">{tab.title}</span>
                {productCount > 0 && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-emerald-700/80 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {productCount}
                  </span>
                )}
              </button>

              {/* Tab options button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('light');
                  setMenuOpenTabId(menuOpenTabId === tab.id ? null : tab.id);
                }}
                className={`ml-1 p-1 rounded-lg transition-opacity ${
                  isActive
                    ? 'text-white/80 hover:text-white'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 focus:opacity-100'
                }`}
                title="Опции категории"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu */}
              {menuOpenTabId === tab.id && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpenTabId(null)}
                  />
                  <div className="absolute top-full left-0 mt-1.5 z-50 min-w-[170px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 animate-in fade-in-50 zoom-in-95">
                    <button
                      onClick={() => {
                        setMenuOpenTabId(null);
                        onEditTab(tab);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-sky-500" />
                      <span>Переименовать</span>
                    </button>
                    {tabs.length > 1 && (
                      <button
                        onClick={() => {
                          setMenuOpenTabId(null);
                          onDeleteTab(tab.id);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Удалить вкладку</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Add Tab Button */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            onAddTab();
          }}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-dashed border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Новая вкладка</span>
        </button>
      </div>
    </div>
  );
};
