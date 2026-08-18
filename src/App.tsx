import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { SummaryBanner } from './components/SummaryBanner';
import { ShareModal } from './components/ShareModal';
import { TabModal } from './components/TabModal';
import { JsonModal } from './components/JsonModal';
import { ClearConfirmModal } from './components/ClearConfirmModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Product, CategoryTab, AppState, CalculatedProduct, UnitType } from './types';
import {
  loadState,
  saveState,
  deserializeTabFromHash,
  DEFAULT_TABS
} from './utils/storage';
import { calculateComparison } from './utils/calculator';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => loadState());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTab, setEditingTab] = useState<CategoryTab | null>(null);

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTabModalOpen, setIsTabModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Save state on any change
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  // Handle Theme (light / dark / system) and meta theme-color
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark =
        appState.theme === 'dark' ||
        (appState.theme === 'system' && mediaQuery.matches);

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Update meta theme-color for iOS / Android mobile chrome
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#101511' : '#006d44');
      }
    };

    applyTheme();

    if (appState.theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [appState.theme]);

  // Check URL Hash for shared tab on initial mount
  useEffect(() => {
    if (window.location.hash) {
      const sharedTab = deserializeTabFromHash(window.location.hash);
      if (sharedTab && sharedTab.products.length > 0) {
        setAppState((prev) => {
          const existingIdx = prev.tabs.findIndex((t) => t.id === sharedTab.id);
          const nextTabs =
            existingIdx >= 0
              ? prev.tabs.map((t) => (t.id === sharedTab.id ? sharedTab : t))
              : [sharedTab, ...prev.tabs];

          return {
            ...prev,
            tabs: nextTabs,
            activeTabId: sharedTab.id
          };
        });
        addToast(`Категория «${sharedTab.title}» загружена из ссылки!`, 'success');
        // Clear hash to prevent reloading on simple refresh
        history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  // Active Category
  const activeTab = useMemo(() => {
    return (
      appState.tabs.find((t) => t.id === appState.activeTabId) ||
      appState.tabs[0] ||
      DEFAULT_TABS[0]
    );
  }, [appState.tabs, appState.activeTabId]);

  // Calculated comparison for active category
  const calculatedProducts = useMemo(() => {
    return calculateComparison(activeTab.products, appState.currencySymbol || '₽');
  }, [activeTab.products, appState.currencySymbol]);

  // Actions: Products
  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      // Update existing
      const updatedProduct: Product = {
        ...editingProduct,
        ...productData
      };
      setAppState((prev) => ({
        ...prev,
        tabs: prev.tabs.map((tab) =>
          tab.id === prev.activeTabId
            ? {
                ...tab,
                products: tab.products.map((p) =>
                  p.id === editingProduct.id ? updatedProduct : p
                )
              }
            : tab
        )
      }));
      setEditingProduct(null);
      addToast('Товар успешно обновлен', 'success');
    } else {
      // Add new
      const newProduct: Product = {
        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        ...productData,
        createdAt: Date.now()
      };
      setAppState((prev) => ({
        ...prev,
        tabs: prev.tabs.map((tab) =>
          tab.id === prev.activeTabId
            ? {
                ...tab,
                products: [...tab.products, newProduct]
              }
            : tab
        )
      }));
      addToast('Товар добавлен в сравнение', 'success');
    }
  };

  const handleEditProduct = (product: CalculatedProduct) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicateProduct = (product: CalculatedProduct) => {
    const duplicated: Product = {
      ...product,
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${product.name} (Копия)`,
      createdAt: Date.now()
    };
    setAppState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab) =>
        tab.id === prev.activeTabId
          ? {
              ...tab,
              products: [...tab.products, duplicated]
            }
          : tab
      )
    }));
    addToast('Товар продублирован', 'info');
  };

  const handleDeleteProduct = (productId: string) => {
    setAppState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab) =>
        tab.id === prev.activeTabId
          ? {
              ...tab,
              products: tab.products.filter((p) => p.id !== productId)
            }
          : tab
      )
    }));
    if (editingProduct?.id === productId) {
      setEditingProduct(null);
    }
    addToast('Товар удален', 'info');
  };

  const handleClearCategory = () => {
    setAppState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab) =>
        tab.id === prev.activeTabId
          ? {
              ...tab,
              products: []
            }
          : tab
      )
    }));
    setEditingProduct(null);
    addToast('Список очищен', 'info');
  };

  const handleAddSampleProduct = () => {
    const sample: Product = {
      id: `p-${Date.now()}`,
      name: `Образец ${activeTab.title}`,
      price: 150,
      quantity: activeTab.defaultUnit === 'g' ? 500 : activeTab.defaultUnit === 'ml' ? 500 : 10,
      unit: activeTab.defaultUnit || 'g',
      packCount: 1,
      discountType: 'none',
      createdAt: Date.now()
    };
    setAppState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab) =>
        tab.id === prev.activeTabId
          ? {
              ...tab,
              products: [...tab.products, sample]
            }
          : tab
      )
    }));
    addToast('Пример добавлен в список', 'info');
  };

  // Actions: Tabs
  const handleSelectTab = (tabId: string) => {
    setAppState((prev) => ({ ...prev, activeTabId: tabId }));
    setEditingProduct(null);
  };

  const handleSaveTab = (data: { title: string; emoji: string; defaultUnit: UnitType }) => {
    if (editingTab) {
      setAppState((prev) => ({
        ...prev,
        tabs: prev.tabs.map((t) =>
          t.id === editingTab.id
            ? {
                ...t,
                title: data.title,
                emoji: data.emoji,
                defaultUnit: data.defaultUnit
              }
            : t
        )
      }));
      setEditingTab(null);
      addToast('Категория обновлена', 'success');
    } else {
      const newTab: CategoryTab = {
        id: `tab-${Date.now()}`,
        title: data.title,
        emoji: data.emoji,
        defaultUnit: data.defaultUnit,
        products: [],
        createdAt: Date.now()
      };
      setAppState((prev) => ({
        ...prev,
        tabs: [...prev.tabs, newTab],
        activeTabId: newTab.id
      }));
      addToast(`Категория «${data.title}» создана!`, 'success');
    }
  };

  const handleDeleteTab = (tabId: string) => {
    if (appState.tabs.length <= 1) {
      addToast('Нельзя удалить последнюю категорию', 'error');
      return;
    }
    setAppState((prev) => {
      const filtered = prev.tabs.filter((t) => t.id !== tabId);
      const nextActiveId =
        prev.activeTabId === tabId ? filtered[0]?.id || 'tab-1' : prev.activeTabId;
      return {
        ...prev,
        tabs: filtered,
        activeTabId: nextActiveId
      };
    });
    addToast('Категория удалена', 'info');
  };

  return (
    <div className="min-h-screen bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] flex flex-col font-sans antialiased selection:bg-[var(--md-sys-color-primary-container)] selection:text-[var(--md-sys-color-on-primary-container)] transition-colors">
      {/* Top Navigation */}
      <Header
        theme={appState.theme}
        onThemeChange={(theme) => setAppState((prev) => ({ ...prev, theme }))}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenBackup={() => setIsJsonModalOpen(true)}
        onClearCategory={() => setIsClearModalOpen(true)}
        hasProducts={activeTab.products.length > 0}
        activeCategoryName={activeTab.title}
      />

      {/* Category Tabs */}
      <CategoryTabs
        tabs={appState.tabs}
        activeTabId={appState.activeTabId}
        onSelectTab={handleSelectTab}
        onAddTab={() => {
          setEditingTab(null);
          setIsTabModalOpen(true);
        }}
        onEditTab={(tab) => {
          setEditingTab(tab);
          setIsTabModalOpen(true);
        }}
        onDeleteTab={handleDeleteTab}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Summary Winner Banner */}
        <SummaryBanner products={calculatedProducts} />

        {/* Add/Edit Product Form */}
        <ProductForm
          defaultUnit={activeTab.defaultUnit || 'g'}
          existingProducts={calculatedProducts}
          editingProduct={editingProduct}
          onSaveProduct={handleSaveProduct}
          onCancelEdit={() => setEditingProduct(null)}
        />

        {/* Products Comparison List */}
        <ProductList
          products={calculatedProducts}
          categoryEmoji={activeTab.emoji}
          categoryTitle={activeTab.title}
          onEditProduct={handleEditProduct}
          onDuplicateProduct={handleDuplicateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddSampleProduct={handleAddSampleProduct}
        />
      </main>

      {/* Modals & Dialogs */}
      <ShareModal
        tab={activeTab}
        calculatedProducts={calculatedProducts}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShowToast={addToast}
      />

      <TabModal
        isOpen={isTabModalOpen}
        editingTab={editingTab}
        canDelete={appState.tabs.length > 1}
        onClose={() => {
          setIsTabModalOpen(false);
          setEditingTab(null);
        }}
        onSaveTab={handleSaveTab}
        onDeleteTab={handleDeleteTab}
      />

      <JsonModal
        isOpen={isJsonModalOpen}
        appState={appState}
        onClose={() => setIsJsonModalOpen(false)}
        onRestoreState={(imported) => setAppState(imported)}
        onShowToast={addToast}
      />

      <ClearConfirmModal
        isOpen={isClearModalOpen}
        categoryTitle={activeTab.title}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearCategory}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
