import React, { useState } from 'react';
import {
  ArrowUpDown,
  PlusCircle
} from 'lucide-react';
import { CalculatedProduct } from '../types';
import { ProductCard } from './ProductCard';
import { triggerHaptic } from '../utils/haptics';

interface ProductListProps {
  products: CalculatedProduct[];
  categoryEmoji: string;
  categoryTitle: string;
  onEditProduct: (product: CalculatedProduct) => void;
  onDuplicateProduct: (product: CalculatedProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onAddSampleProduct: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  categoryEmoji,
  categoryTitle,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onAddSampleProduct
}) => {
  const [sortBy, setSortBy] = useState<'rank' | 'price' | 'name'>('rank');

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-inner ring-1 ring-emerald-500/20">
          {categoryEmoji || '🛒'}
        </div>
        <div className="max-w-sm mx-auto space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            В категории «{categoryTitle}» пока пусто
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Добавьте хотя бы 2 похожих товара выше, и калькулятор моментально покажет самый выгодный вариант!
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onAddSampleProduct();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 hover:bg-emerald-100 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Добавить пример для сравнения</span>
        </button>
      </div>
    );
  }

  // Sorted items
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price') {
      return a.effectiveTotalPrice - b.effectiveTotalPrice;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return a.rank - b.rank;
  });

  // Second best price in group for the best deal savings text
  const getSecondBestPrice = (group: string) => {
    const groupItems = products.filter((p) => p.unitGroup === group);
    const sorted = [...groupItems].sort(
      (a, b) => a.pricePerStandardUnit - b.pricePerStandardUnit
    );
    return sorted[1]?.pricePerStandardUnit;
  };

  return (
    <div className="space-y-3.5">
      {/* Header controls for list */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>Сравнение товаров ({products.length})</span>
        </div>

        {/* Sort selector */}
        {products.length > 2 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 dark:text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="rank">По выгоде (от лучшего)</option>
              <option value="price">По цене за пачку</option>
              <option value="name">По названию</option>
            </select>
          </div>
        )}
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {sortedProducts.map((product) => {
          const totalInGroup = products.filter(
            (p) => p.unitGroup === product.unitGroup
          ).length;
          const secondBestPrice = getSecondBestPrice(product.unitGroup);

          return (
            <ProductCard
              key={product.id}
              product={product}
              totalInGroup={totalInGroup}
              secondBestPrice={secondBestPrice}
              onEdit={onEditProduct}
              onDuplicate={onDuplicateProduct}
              onDelete={onDeleteProduct}
            />
          );
        })}
      </div>
    </div>
  );
};
