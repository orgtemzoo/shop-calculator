import React, { useState, useEffect, useMemo } from 'react';
import { MaterialIcon } from './MaterialIcon';
import {
  Product,
  UnitType,
  DiscountType,
  CalculatedProduct
} from '../types';
import {
  UNITS_CONFIG,
  PRESET_OPTIONS,
  DISCOUNT_LABELS,
  calculateSingleProduct,
  formatMoney,
  formatQuantity
} from '../utils/calculator';
import { triggerHaptic } from '../utils/haptics';

interface ProductFormProps {
  defaultUnit: UnitType;
  existingProducts: CalculatedProduct[];
  editingProduct: Product | null;
  onSaveProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancelEdit: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  defaultUnit,
  existingProducts,
  editingProduct,
  onSaveProduct,
  onCancelEdit
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<UnitType>(defaultUnit || 'g');
  const [packCount, setPackCount] = useState('1');
  const [isMultiPack, setIsMultiPack] = useState(false);
  const [discountType, setDiscountType] = useState<DiscountType>('none');
  const [discountValue, setDiscountValue] = useState('');
  const [showPromoOptions, setShowPromoOptions] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(String(editingProduct.price));
      setQuantity(String(editingProduct.quantity));
      setUnit(editingProduct.unit);
      setPackCount(String(editingProduct.packCount || 1));
      setIsMultiPack((editingProduct.packCount || 1) > 1);
      setDiscountType(editingProduct.discountType || 'none');
      setDiscountValue(
        editingProduct.discountValue !== undefined ? String(editingProduct.discountValue) : ''
      );
      setShowPromoOptions(editingProduct.discountType !== 'none');
    } else {
      resetForm();
      setUnit(defaultUnit || 'g');
    }
  }, [editingProduct, defaultUnit]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setQuantity('');
    setPackCount('1');
    setIsMultiPack(false);
    setDiscountType('none');
    setDiscountValue('');
    setShowPromoOptions(false);
  };

  const currentUnitInfo = UNITS_CONFIG[unit] || UNITS_CONFIG.g;
  const currentGroupPresets = PRESET_OPTIONS[currentUnitInfo.group] || [];

  // Live preview calculation
  const liveCalculated = useMemo(() => {
    const numPrice = parseFloat(price);
    const numQty = parseFloat(quantity);
    const numPack = isMultiPack ? parseInt(packCount, 10) || 1 : 1;
    const numDiscVal = discountValue ? parseFloat(discountValue) : undefined;

    if (!isNaN(numPrice) && numPrice > 0 && !isNaN(numQty) && numQty > 0) {
      const draftProduct: Product = {
        id: 'draft',
        name: name || 'Черновик',
        price: numPrice,
        quantity: numQty,
        unit: unit,
        packCount: numPack,
        discountType: discountType,
        discountValue: numDiscVal,
        createdAt: Date.now()
      };

      const calculated = calculateSingleProduct(draftProduct);

      const sameGroupProducts = existingProducts.filter(
        (p) => p.unitGroup === calculated.unitGroup && (!editingProduct || p.id !== editingProduct.id)
      );

      let comparisonBadge = null;

      if (sameGroupProducts.length > 0) {
        const bestExisting = sameGroupProducts.find((p) => p.rank === 1);
        if (bestExisting) {
          if (calculated.pricePerStandardUnit < bestExisting.pricePerStandardUnit) {
            const diffPct = (
              ((bestExisting.pricePerStandardUnit - calculated.pricePerStandardUnit) /
                bestExisting.pricePerStandardUnit) *
              100
            ).toFixed(1);
            comparisonBadge = {
              type: 'best',
              text: `Самая выгодная цена в списке (-${diffPct}%)`
            };
          } else if (
            Math.abs(calculated.pricePerStandardUnit - bestExisting.pricePerStandardUnit) < 0.01
          ) {
            comparisonBadge = {
              type: 'equal',
              text: 'Равна лучшей цене в списке'
            };
          } else {
            const diffPct = (
              ((calculated.pricePerStandardUnit - bestExisting.pricePerStandardUnit) /
                bestExisting.pricePerStandardUnit) *
              100
            ).toFixed(1);
            const diffRub = (
              calculated.pricePerStandardUnit - bestExisting.pricePerStandardUnit
            ).toFixed(2);
            comparisonBadge = {
              type: 'worse',
              text: `+${diffPct}% к лидеру (+${diffRub} ₽ / ${currentUnitInfo.standardUnit})`
            };
          }
        }
      }

      return {
        calculated,
        comparisonBadge
      };
    }

    return null;
  }, [
    price,
    quantity,
    unit,
    packCount,
    isMultiPack,
    discountType,
    discountValue,
    existingProducts,
    editingProduct,
    currentUnitInfo,
    name
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    const numQty = parseFloat(quantity);
    const numPack = isMultiPack ? Math.max(parseInt(packCount, 10) || 1, 1) : 1;
    const numDiscVal = discountValue ? parseFloat(discountValue) : undefined;

    if (!isNaN(numPrice) && numPrice > 0 && !isNaN(numQty) && numQty > 0) {
      triggerHaptic('success');
      onSaveProduct({
        name: name.trim() || `Товар (${numQty} ${currentUnitInfo.shortLabel})`,
        price: numPrice,
        quantity: numQty,
        unit,
        packCount: numPack,
        discountType,
        discountValue: numDiscVal
      });

      if (!editingProduct) {
        resetForm();
      }
    }
  };

  const applyPreset = (presetValue: number, presetUnit: UnitType) => {
    triggerHaptic('light');
    setQuantity(String(presetValue));
    setUnit(presetUnit);
  };

  return (
    <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-3xl p-5 sm:p-6 border border-[var(--md-sys-color-outline-variant)]/40 transition-all">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Title & Edit Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center">
              <MaterialIcon name={editingProduct ? 'edit' : 'add'} className="text-xl" />
            </div>
            <h2 className="text-base font-semibold text-[var(--md-sys-color-on-surface)]">
              {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
            </h2>
          </div>
          {editingProduct && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-xs font-medium text-[var(--md-sys-color-primary)] px-3 py-1 rounded-full hover:bg-[var(--md-sys-color-primary)]/8 transition-colors"
            >
              Отмена
            </button>
          )}
        </div>

        {/* M3 Outlined Text Field: Product Name */}
        <div>
          <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
            Название товара
          </label>
          <div className="relative flex items-center h-12 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-xl focus-within:border-[var(--md-sys-color-primary)] focus-within:ring-1 focus-within:ring-[var(--md-sys-color-primary)] transition-all">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Молоко Простоквашино"
              className="w-full h-full px-4 bg-transparent text-sm text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-outline)] focus:outline-none"
            />
            {name && (
              <button
                type="button"
                onClick={() => setName('')}
                className="w-10 h-10 mr-1 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8"
              >
                <MaterialIcon name="close" className="text-lg" />
              </button>
            )}
          </div>
        </div>

        {/* Grid: Price & Quantity / Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
              Цена <span className="text-[var(--md-sys-color-error)]">*</span>
            </label>
            <div className="relative flex items-center h-12 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-xl focus-within:border-[var(--md-sys-color-primary)] focus-within:ring-1 focus-within:ring-[var(--md-sys-color-primary)] transition-all">
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100.00"
                className="w-full h-full pl-4 pr-9 bg-transparent text-sm font-semibold text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-outline)] focus:outline-none"
              />
              <span className="absolute right-4 text-sm font-semibold text-[var(--md-sys-color-on-surface-variant)] pointer-events-none">
                ₽
              </span>
            </div>
          </div>

          {/* Quantity & Unit */}
          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
              Вес / объём / количество <span className="text-[var(--md-sys-color-error)]">*</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative flex items-center h-12 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-xl focus-within:border-[var(--md-sys-color-primary)] focus-within:ring-1 focus-within:ring-[var(--md-sys-color-primary)] transition-all">
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0.001"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="900"
                  className="w-full h-full px-4 bg-transparent text-sm font-semibold text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-outline)] focus:outline-none"
                />
              </div>

              {/* M3 Outlined Select */}
              <div className="relative flex items-center h-12 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-xl focus-within:border-[var(--md-sys-color-primary)] focus-within:ring-1 focus-within:ring-[var(--md-sys-color-primary)]">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as UnitType)}
                  className="h-full pl-3.5 pr-8 bg-transparent text-sm font-medium text-[var(--md-sys-color-on-surface)] focus:outline-none appearance-none cursor-pointer"
                >
                  <optgroup label="Масса (Вес)">
                    <option value="g">г</option>
                    <option value="kg">кг</option>
                  </optgroup>
                  <optgroup label="Объём">
                    <option value="ml">мл</option>
                    <option value="l">л</option>
                  </optgroup>
                  <optgroup label="Штучные товары">
                    <option value="pcs">шт</option>
                    <option value="roll">рул</option>
                    <option value="caps">капс</option>
                    <option value="tablet">табл</option>
                    <option value="pack">пак</option>
                    <option value="portion">порц</option>
                    <option value="meter">м</option>
                  </optgroup>
                </select>
                <MaterialIcon name="arrow_drop_down" className="absolute right-2 text-xl text-[var(--md-sys-color-on-surface-variant)] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* M3 Suggestion Chips (Presets) */}
        {currentGroupPresets.length > 0 && (
          <div>
            <span className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1.5">
              Популярная фасовка:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentGroupPresets.map((preset) => {
                const isSelected =
                  parseFloat(quantity) === preset.value && unit === preset.unit;
                return (
                  <button
                    key={`${preset.value}-${preset.unit}`}
                    type="button"
                    onClick={() => applyPreset(preset.value, preset.unit)}
                    className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                        : 'bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                    }`}
                  >
                    {isSelected && <MaterialIcon name="check" className="text-sm" />}
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* M3 Filter Chips: Multipack & Promo toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsMultiPack(!isMultiPack);
            }}
            className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              isMultiPack
                ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                : 'bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
            }`}
          >
            <MaterialIcon name={isMultiPack ? 'check_box' : 'check_box_outline_blank'} className="text-base" />
            <span>Мультипак</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowPromoOptions(!showPromoOptions);
            }}
            className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              discountType !== 'none' || showPromoOptions
                ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] font-semibold'
                : 'bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
            }`}
          >
            <MaterialIcon name="sell" className="text-base" />
            <span>
              {discountType !== 'none'
                ? `${DISCOUNT_LABELS[discountType]}`
                : 'Скидка / акция'}
            </span>
          </button>
        </div>

        {/* Multipack details */}
        {isMultiPack && (
          <div className="p-3.5 bg-[var(--md-sys-color-surface-container)] rounded-2xl space-y-2 animate-in fade-in-50">
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface)]">
              Количество упаковок в наборе:
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                inputMode="numeric"
                min="2"
                max="1000"
                value={packCount}
                onChange={(e) => setPackCount(e.target.value)}
                className="w-24 px-3 py-1.5 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-lg text-sm font-semibold text-[var(--md-sys-color-on-surface)]"
              />
              <span className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
                Итого:{' '}
                <strong>
                  {formatQuantity(
                    parseFloat(quantity) || 0,
                    unit,
                    parseInt(packCount, 10) || 1
                  )}
                </strong>
              </span>
            </div>
          </div>
        )}

        {/* Promo / Discount Chips */}
        {showPromoOptions && (
          <div className="p-4 bg-[var(--md-sys-color-surface-container)] rounded-2xl space-y-3 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--md-sys-color-on-surface)]">
                Тип скидки / акции:
              </span>
              {discountType !== 'none' && (
                <button
                  type="button"
                  onClick={() => {
                    setDiscountType('none');
                    setDiscountValue('');
                  }}
                  className="text-xs text-[var(--md-sys-color-primary)] font-medium hover:underline"
                >
                  Сбросить
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(
                [
                  ['none', 'Без акции'],
                  ['percent', 'Скидка в %'],
                  ['card', 'По карте'],
                  ['buy1get1', '1+1 (50%)'],
                  ['buy2get1', '2+1 (33%)'],
                  ['buy3get1', '3+1 (25%)'],
                  ['secondHalf', '-50% на 2-й'],
                  ['second70', '-70% на 2-й']
                ] as Array<[DiscountType, string]>
              ).map(([type, label]) => {
                const isSelected = discountType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setDiscountType(type);
                    }}
                    className={`h-8 px-2.5 rounded-lg text-xs font-medium text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                        : 'bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {discountType === 'percent' && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-medium text-[var(--md-sys-color-on-surface)]">
                  Скидка:
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="99"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="20"
                  className="w-24 px-3 py-1.5 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-lg text-xs font-semibold text-[var(--md-sys-color-on-surface)]"
                />
                <span className="text-xs text-[var(--md-sys-color-on-surface-variant)]">%</span>
              </div>
            )}

            {discountType === 'card' && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-medium text-[var(--md-sys-color-on-surface)]">
                  Цена по карте:
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="119.90"
                  className="w-28 px-3 py-1.5 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-lg text-xs font-semibold text-[var(--md-sys-color-on-surface)]"
                />
                <span className="text-xs text-[var(--md-sys-color-on-surface-variant)]">₽</span>
              </div>
            )}
          </div>
        )}

        {/* Live Preview Card */}
        {liveCalculated && (
          <div className="p-4 bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-2xl border border-[var(--md-sys-color-outline-variant)]/60 space-y-1.5 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">
                Предпросмотр расчёта:
              </span>
              <div className="text-right">
                <span className="text-lg font-bold text-[var(--md-sys-color-primary)]">
                  {formatMoney(liveCalculated.calculated.pricePerStandardUnit)}
                </span>
                <span className="text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] ml-1">
                  / {currentUnitInfo.standardUnit}
                </span>
              </div>
            </div>

            {liveCalculated.comparisonBadge && (
              <div
                className={`text-xs font-medium px-3 py-1.5 rounded-xl ${
                  liveCalculated.comparisonBadge.type === 'best'
                    ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]'
                    : liveCalculated.comparisonBadge.type === 'equal'
                    ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]'
                    : 'bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]'
                }`}
              >
                <span>{liveCalculated.comparisonBadge.text}</span>
              </div>
            )}
          </div>
        )}

        {/* M3 Filled Button: Submit */}
        <button
          type="submit"
          className="w-full h-11 rounded-full font-medium text-sm text-[var(--md-sys-color-on-primary)] bg-[var(--md-sys-color-primary)] hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <MaterialIcon name={editingProduct ? 'check' : 'add'} className="text-xl" />
          <span>{editingProduct ? 'Сохранить изменения' : 'Добавить в список'}</span>
        </button>
      </form>
    </div>
  );
};
