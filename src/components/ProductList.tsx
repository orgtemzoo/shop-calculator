import React, { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';
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
      <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-3xl p-8 text-center space-y-4 border border-[var(--md-sys-color-outline-variant)]/40">
        <div className="w-16 h-16 rounded-full bg-[var(--md-sys-color-surface-container-high)] flex items-center justify-center mx-auto text-3xl">
          {categoryEmoji || '🛒'}
        </div>
        <div className="max-w-sm mx-auto space-y-1">
          <h3 className="text-base font-semibold text-[var(--md-sys-color-on-surface)]">
            В категории «{categoryTitle}» пока нет товаров
          </h3>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
            Добавьте 2 или более товара выше, и калькулятор рассчитает цену за стандартную единицу и покажет выгоду.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onAddSampleProduct();
          }}
          className="h-10 px-5 rounded-full text-xs font-medium bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] hover:opacity-90 inline-flex items-center gap-2 transition-all cursor-pointer"
        >
          <MaterialIcon name="add" className="text-base" />
          <span>Добавить пример для сравнения</span>
        </button>
      </div>
    );
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price') {
      return a.effectiveTotalPrice - b.effectiveTotalPrice;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return a.rank - b.rank;
  });

  const getSecondBestPrice = (group: string) => {
    const groupItems = products.filter((p) => p.unitGroup === group);
    const sorted = [...groupItems].sort(
      (a, b) => a.pricePerStandardUnit - b.pricePerStandardUnit
    );
    return sorted[1]?.pricePerStandardUnit;
  };

  return (
    <div className="space-y-3">
      {/* Header controls */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">
          Список товаров ({products.length})
        </span>

        {products.length > 2 && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--md-sys-color-on-surface-variant)]">
            <MaterialIcon name="sort" className="text-base" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[var(--md-sys-color-on-surface)] font-medium focus:outline-none cursor-pointer"
            >
              <option value="rank">По выгоде (от лучшего)</option>
              <option value="price">По цене за упаковку</option>
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
