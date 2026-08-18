import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Percent,
  Layers,
  Check,
  X
} from 'lucide-react';
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

  // Sync state when entering / exiting edit mode or changing tab default unit
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

  // Live preview calculations
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

      // Compare against existing products in same unit group
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
              text: `🏆 Станет лучшей ценой! (на ${diffPct}% выгоднее текущего лидера)`
            };
          } else if (
            Math.abs(calculated.pricePerStandardUnit - bestExisting.pricePerStandardUnit) < 0.01
          ) {
            comparisonBadge = {
              type: 'equal',
              text: '✨ Равна лучшей цене в списке'
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
              text: `На +${diffPct}% дороже лучшего товара (+${diffRub} ₽ за ${currentUnitInfo.standardUnit})`
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-5 transition-all">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header for Form / Edit Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              {editingProduct ? '✏️' : '➕'}
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingProduct ? 'Редактировать товар' : 'Добавить товар для сравнения'}
            </h2>
          </div>
          {editingProduct && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800"
            >
              Отмена
            </button>
          )}
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Название товара <span className="text-slate-400 font-normal">(необязательно)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Простоквашино 3.2% или упаковка 4 шт"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
            {name && (
              <button
                type="button"
                onClick={() => setName('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Grid: Price & Quantity/Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Price input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Цена ценника <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="149.90"
                className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 dark:text-slate-500 pointer-events-none">
                ₽
              </span>
            </div>
          </div>

          {/* Quantity & Unit selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Вес / Объём / Количество <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                min="0.001"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="900"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="shrink-0 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer"
              >
                <optgroup label="Масса (Вес)">
                  <option value="g">г (граммы)</option>
                  <option value="kg">кг (килограммы)</option>
                </optgroup>
                <optgroup label="Объём (Жидкости)">
                  <option value="ml">мл (миллилитры)</option>
                  <option value="l">л (литры)</option>
                </optgroup>
                <optgroup label="Штучные товары">
                  <option value="pcs">шт (штуки)</option>
                  <option value="roll">рул (рулоны)</option>
                  <option value="caps">капс (капсулы)</option>
                  <option value="tablet">табл (таблетки)</option>
                  <option value="pack">пак (пакетики)</option>
                  <option value="portion">порц (порции)</option>
                  <option value="meter">м (метры)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Presets Bar */}
        {currentGroupPresets.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Быстрый выбор фасовки:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentGroupPresets.map((preset) => {
                const isSelected =
                  parseFloat(quantity) === preset.value && unit === preset.unit;
                return (
                  <button
                    key={`${preset.value}-${preset.unit}`}
                    type="button"
                    onClick={() => applyPreset(preset.value, preset.unit)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Multipack & Promo toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Multi-pack toggle */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsMultiPack(!isMultiPack);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isMultiPack
                ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700'
                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Набор / Мультипак</span>
          </button>

          {/* Promo toggle */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowPromoOptions(!showPromoOptions);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              discountType !== 'none' || showPromoOptions
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>
              {discountType !== 'none'
                ? `Акция: ${DISCOUNT_LABELS[discountType]}`
                : 'Скидка или акция (1+1, карта...)'}
            </span>
          </button>
        </div>

        {/* Multi-pack quantity selector */}
        {isMultiPack && (
          <div className="p-3 bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 rounded-xl animate-in fade-in-50">
            <label className="block text-xs font-semibold text-sky-900 dark:text-sky-200 mb-1.5">
              Количество упаковок в наборе (мультипак):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="2"
                max="1000"
                value={packCount}
                onChange={(e) => setPackCount(e.target.value)}
                className="w-28 px-3 py-1.5 bg-white dark:bg-slate-800 border border-sky-300 dark:border-sky-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white"
              />
              <span className="text-xs text-sky-700 dark:text-sky-300">
                Итоговый вес набора:{' '}
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

        {/* Promo / Discount selector */}
        {showPromoOptions && (
          <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-3 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Выберите тип акции или скидки:
              </span>
              {discountType !== 'none' && (
                <button
                  type="button"
                  onClick={() => {
                    setDiscountType('none');
                    setDiscountValue('');
                  }}
                  className="text-xs text-amber-700 dark:text-amber-300 underline font-semibold"
                >
                  Сбросить скидку
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
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-400'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 border border-amber-200/60 dark:border-amber-800/40'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Sub-inputs for percent / card discount */}
            {discountType === 'percent' && (
              <div className="flex items-center gap-2 pt-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Размер скидки:
                </label>
                <div className="relative w-28">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="20"
                    className="w-full pl-3 pr-7 py-1.5 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    %
                  </span>
                </div>
              </div>
            )}

            {discountType === 'card' && (
              <div className="flex items-center gap-2 pt-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Цена по карте магазина:
                </label>
                <div className="relative w-32">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="119.90"
                    className="w-full pl-3 pr-7 py-1.5 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ₽
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Preview Widget */}
        {liveCalculated && (
          <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl shadow-md border border-slate-700 space-y-2 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Расчёт на лету:
                </span>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-black text-emerald-400">
                  {formatMoney(liveCalculated.calculated.pricePerStandardUnit)}
                </span>
                <span className="text-xs font-semibold text-slate-300 ml-1">
                  / {currentUnitInfo.standardUnit}
                </span>
              </div>
            </div>

            {/* Verdict against existing items */}
            {liveCalculated.comparisonBadge && (
              <div
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                  liveCalculated.comparisonBadge.type === 'best'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : liveCalculated.comparisonBadge.type === 'equal'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                <span>{liveCalculated.comparisonBadge.text}</span>
              </div>
            )}
          </div>
        )}

        {/* Submit Action Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {editingProduct ? (
            <>
              <Check className="w-5 h-5" />
              <span>Сохранить изменения</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Добавить в сравнение</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
