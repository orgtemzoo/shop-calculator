import {
  Product,
  CalculatedProduct,
  UnitType,
  UnitGroup,
  UnitInfo,
  DiscountType
} from '../types';

export const UNITS_CONFIG: Record<UnitType, UnitInfo> = {
  g: {
    type: 'g',
    group: 'weight',
    label: 'Граммы (г)',
    shortLabel: 'г',
    standardUnit: 'кг',
    standardMultiplier: 0.001
  },
  kg: {
    type: 'kg',
    group: 'weight',
    label: 'Килограммы (кг)',
    shortLabel: 'кг',
    standardUnit: 'кг',
    standardMultiplier: 1
  },
  ml: {
    type: 'ml',
    group: 'volume',
    label: 'Миллилитры (мл)',
    shortLabel: 'мл',
    standardUnit: 'л',
    standardMultiplier: 0.001
  },
  l: {
    type: 'l',
    group: 'volume',
    label: 'Литры (л)',
    shortLabel: 'л',
    standardUnit: 'л',
    standardMultiplier: 1
  },
  pcs: {
    type: 'pcs',
    group: 'count',
    label: 'Штуки (шт)',
    shortLabel: 'шт',
    standardUnit: 'шт',
    standardMultiplier: 1
  },
  roll: {
    type: 'roll',
    group: 'count',
    label: 'Рулоны (рул)',
    shortLabel: 'рул',
    standardUnit: 'рул',
    standardMultiplier: 1
  },
  caps: {
    type: 'caps',
    group: 'count',
    label: 'Капсулы (капс)',
    shortLabel: 'капс',
    standardUnit: 'капс',
    standardMultiplier: 1
  },
  tablet: {
    type: 'tablet',
    group: 'count',
    label: 'Таблетки (табл)',
    shortLabel: 'табл',
    standardUnit: 'табл',
    standardMultiplier: 1
  },
  pack: {
    type: 'pack',
    group: 'count',
    label: 'Пакетики (пак)',
    shortLabel: 'пак',
    standardUnit: 'пак',
    standardMultiplier: 1
  },
  portion: {
    type: 'portion',
    group: 'count',
    label: 'Порции (порц)',
    shortLabel: 'порц',
    standardUnit: 'порц',
    standardMultiplier: 1
  },
  meter: {
    type: 'meter',
    group: 'length',
    label: 'Метры (м)',
    shortLabel: 'м',
    standardUnit: 'м',
    standardMultiplier: 1
  }
};

export const PRESET_OPTIONS: Record<UnitGroup, Array<{ value: number; unit: UnitType; label: string }>> = {
  weight: [
    { value: 100, unit: 'g', label: '100 г' },
    { value: 180, unit: 'g', label: '180 г' },
    { value: 250, unit: 'g', label: '250 г' },
    { value: 400, unit: 'g', label: '400 г' },
    { value: 450, unit: 'g', label: '450 г' },
    { value: 500, unit: 'g', label: '500 г' },
    { value: 800, unit: 'g', label: '800 г' },
    { value: 900, unit: 'g', label: '900 г' },
    { value: 1, unit: 'kg', label: '1 кг' },
    { value: 1.5, unit: 'kg', label: '1.5 кг' },
    { value: 2, unit: 'kg', label: '2 кг' },
    { value: 5, unit: 'kg', label: '5 кг' }
  ],
  volume: [
    { value: 200, unit: 'ml', label: '200 мл' },
    { value: 330, unit: 'ml', label: '330 мл' },
    { value: 450, unit: 'ml', label: '450 мл' },
    { value: 500, unit: 'ml', label: '500 мл' },
    { value: 900, unit: 'ml', label: '900 мл' },
    { value: 930, unit: 'ml', label: '930 мл' },
    { value: 950, unit: 'ml', label: '950 мл' },
    { value: 1, unit: 'l', label: '1 л' },
    { value: 1.5, unit: 'l', label: '1.5 л' },
    { value: 2, unit: 'l', label: '2 л' },
    { value: 5, unit: 'l', label: '5 л' }
  ],
  count: [
    { value: 2, unit: 'pcs', label: '2 шт' },
    { value: 4, unit: 'pcs', label: '4 шт' },
    { value: 6, unit: 'pcs', label: '6 шт' },
    { value: 8, unit: 'pcs', label: '8 шт' },
    { value: 10, unit: 'pcs', label: '10 шт' },
    { value: 12, unit: 'pcs', label: '12 шт' },
    { value: 20, unit: 'pcs', label: '20 шт' },
    { value: 30, unit: 'pcs', label: '30 шт' },
    { value: 50, unit: 'pcs', label: '50 шт' },
    { value: 100, unit: 'pcs', label: '100 шт' }
  ],
  length: [
    { value: 5, unit: 'meter', label: '5 м' },
    { value: 10, unit: 'meter', label: '10 м' },
    { value: 20, unit: 'meter', label: '20 м' },
    { value: 25, unit: 'meter', label: '25 м' },
    { value: 50, unit: 'meter', label: '50 м' },
    { value: 100, unit: 'meter', label: '100 м' }
  ]
};

export const DISCOUNT_LABELS: Record<DiscountType, string> = {
  none: 'Обычная цена',
  percent: 'Скидка %',
  card: 'По карте магазина',
  buy1get1: '1+1 (Второй бесплатно)',
  buy2get1: '2+1 (Третий бесплатно)',
  buy3get1: '3+1 (Четвертый бесплатно)',
  secondHalf: '-50% на 2-й товар',
  second70: '-70% на 2-й товар'
};

/**
 * Рассчитывает эффективную стоимость с учетом скидок и акций
 */
export function calculateEffectivePrice(
  basePrice: number,
  discountType: DiscountType,
  discountValue?: number
): { effectivePrice: number; summaryText?: string } {
  if (basePrice <= 0) {
    return { effectivePrice: 0 };
  }

  switch (discountType) {
    case 'percent': {
      const pct = Math.min(Math.max(discountValue || 0, 0), 100);
      const effectivePrice = basePrice * (1 - pct / 100);
      return {
        effectivePrice,
        summaryText: pct > 0 ? `Скидка ${pct}% (-${(basePrice - effectivePrice).toFixed(2)} ₽)` : undefined
      };
    }
    case 'card': {
      if (discountValue && discountValue > 0 && discountValue < basePrice) {
        return {
          effectivePrice: discountValue,
          summaryText: `По карте (-${(basePrice - discountValue).toFixed(2)} ₽)`
        };
      }
      return { effectivePrice: discountValue && discountValue > 0 ? discountValue : basePrice };
    }
    case 'buy1get1': {
      // 1+1: 2 штуки по цене 1 -> эффективная цена за единицу = 50%
      const effectivePrice = basePrice * 0.5;
      return {
        effectivePrice,
        summaryText: 'Акция 1+1 (50% скидка на единицу)'
      };
    }
    case 'buy2get1': {
      // 2+1: 3 штуки по цене 2 -> эффективная цена = 66.67%
      const effectivePrice = basePrice * (2 / 3);
      return {
        effectivePrice,
        summaryText: 'Акция 2+1 (33.3% скидка на единицу)'
      };
    }
    case 'buy3get1': {
      // 3+1: 4 штуки по цене 3 -> эффективная цена = 75%
      const effectivePrice = basePrice * 0.75;
      return {
        effectivePrice,
        summaryText: 'Акция 3+1 (25% скидка на единицу)'
      };
    }
    case 'secondHalf': {
      // -50% на второй товар: 2 шт стоят 1.5 цены -> средняя цена 75%
      const effectivePrice = basePrice * 0.75;
      return {
        effectivePrice,
        summaryText: '-50% на второй (-25% на пару)'
      };
    }
    case 'second70': {
      // -70% на второй товар: 2 шт стоят 1.3 цены -> средняя цена 65%
      const effectivePrice = basePrice * 0.65;
      return {
        effectivePrice,
        summaryText: '-70% на второй (-35% на пару)'
      };
    }
    case 'none':
    default:
      return { effectivePrice: basePrice };
  }
}

/**
 * Рассчитывает все параметры для одного товара
 */
export function calculateSingleProduct(
  product: Product,
  currency = '₽'
): Omit<CalculatedProduct, 'isBestDeal' | 'diffPercentVsBest' | 'diffPriceVsBest' | 'rank'> {
  const unitInfo = UNITS_CONFIG[product.unit] || UNITS_CONFIG.g;
  const packCount = Math.max(product.packCount || 1, 1);
  const effectiveQuantity = product.quantity * packCount;
  const effectiveStandardUnits = effectiveQuantity * unitInfo.standardMultiplier;

  const { effectivePrice, summaryText } = calculateEffectivePrice(
    product.price,
    product.discountType,
    product.discountValue
  );

  const effectiveTotalPrice = effectivePrice * packCount;
  const pricePerStandardUnit =
    effectiveStandardUnits > 0 ? effectiveTotalPrice / effectiveStandardUnits : 0;

  const standardUnitLabel = `${currency} / ${unitInfo.standardUnit}`;
  const packageUnitLabel = `${effectiveQuantity} ${unitInfo.shortLabel}`;

  return {
    ...product,
    unitGroup: unitInfo.group,
    effectiveQuantity,
    effectiveStandardUnits,
    effectiveTotalPrice,
    pricePerStandardUnit,
    standardUnitLabel,
    packageUnitLabel,
    discountSummaryText: summaryText
  };
}

/**
 * Производит полное сравнение списка товаров с определением победителя и разницы цен
 */
export function calculateComparison(
  products: Product[],
  currency = '₽'
): CalculatedProduct[] {
  if (!products || products.length === 0) {
    return [];
  }

  // Рассчитываем индивидуальные показатели
  const calculatedItems = products.map((p) => calculateSingleProduct(p, currency));

  // Группируем по группе единиц (масса, объем, штуки, длина)
  const groupMinPrices: Record<string, number> = {};

  // Находим минимальную цену за базовую единицу в каждой группе
  calculatedItems.forEach((item) => {
    if (item.pricePerStandardUnit > 0) {
      if (
        groupMinPrices[item.unitGroup] === undefined ||
        item.pricePerStandardUnit < groupMinPrices[item.unitGroup]
      ) {
        groupMinPrices[item.unitGroup] = item.pricePerStandardUnit;
      }
    }
  });

  // Ранжируем внутри каждой группы
  const groupSorted = { ...groupMinPrices };
  const itemsByGroup: Record<string, typeof calculatedItems> = {};

  calculatedItems.forEach((item) => {
    if (!itemsByGroup[item.unitGroup]) {
      itemsByGroup[item.unitGroup] = [];
    }
    itemsByGroup[item.unitGroup].push(item);
  });

  // Сортируем внутри каждой группы по цене за стандартную единицу
  Object.keys(itemsByGroup).forEach((group) => {
    itemsByGroup[group].sort(
      (a, b) => a.pricePerStandardUnit - b.pricePerStandardUnit
    );
  });

  // Собираем итоговый массив с разницей и рангом
  const result: CalculatedProduct[] = [];

  calculatedItems.forEach((item) => {
    const groupItems = itemsByGroup[item.unitGroup] || [];
    const rank = groupItems.findIndex((g) => g.id === item.id) + 1;
    const minPrice = groupSorted[item.unitGroup] || item.pricePerStandardUnit;
    const isBestDeal = rank === 1 && groupItems.length > 0;

    let diffPercentVsBest = 0;
    let diffPriceVsBest = 0;

    if (minPrice > 0 && item.pricePerStandardUnit > minPrice) {
      diffPercentVsBest = ((item.pricePerStandardUnit - minPrice) / minPrice) * 100;
      diffPriceVsBest = item.pricePerStandardUnit - minPrice;
    }

    result.push({
      ...item,
      isBestDeal,
      diffPercentVsBest,
      diffPriceVsBest,
      rank
    });
  });

  // Возвращаем отсортированные по рангу в группе
  return result.sort((a, b) => {
    if (a.unitGroup !== b.unitGroup) {
      return a.unitGroup.localeCompare(b.unitGroup);
    }
    return a.rank - b.rank;
  });
}

/**
 * Красивое форматирование денежных значений
 */
export function formatMoney(val: number, currency = '₽'): string {
  if (val === undefined || val === null || isNaN(val)) return `0 ${currency}`;
  const formatted = val.toLocaleString('ru-RU', {
    minimumFractionDigits: val % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).replace(/\u00A0/g, ' ');
  return `${formatted} ${currency}`;
}

/**
 * Красивое форматирование количества
 */
export function formatQuantity(quantity: number, unit: UnitType, packCount = 1): string {
  const unitInfo = UNITS_CONFIG[unit] || UNITS_CONFIG.g;
  const totalQty = quantity * (packCount || 1);
  const formattedQty = totalQty.toLocaleString('ru-RU', {
    maximumFractionDigits: 2
  }).replace(/\u00A0/g, ' ');

  if (packCount > 1) {
    return `${packCount} × ${quantity} ${unitInfo.shortLabel} (${formattedQty} ${unitInfo.shortLabel})`;
  }
  return `${formattedQty} ${unitInfo.shortLabel}`;
}
