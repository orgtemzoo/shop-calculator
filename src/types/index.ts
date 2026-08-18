export type UnitType =
  // Масса
  | 'g'
  | 'kg'
  // Объём
  | 'ml'
  | 'l'
  // Штучные и счётные
  | 'pcs'
  | 'roll'
  | 'caps'
  | 'tablet'
  | 'pack'
  | 'portion'
  | 'meter';

export type UnitGroup = 'weight' | 'volume' | 'count' | 'length';

export type DiscountType =
  | 'none'
  | 'percent' // Скидка X%
  | 'card' // Цена по карте
  | 'buy1get1' // 1+1 (плати за 1, бери 2 = -50%)
  | 'buy2get1' // 2+1 (плати за 2, бери 3 = -33.3%)
  | 'buy3get1' // 3+1 (плати за 3, бери 4 = -25%)
  | 'secondHalf' // -50% на второй (-25% на оба)
  | 'second70'; // -70% на второй (-35% на оба)

export interface Product {
  id: string;
  name: string;
  price: number; // Базовая цена
  quantity: number; // Объем/вес/количество
  unit: UnitType;
  packCount: number; // Количество упаковок в наборе (по умолчанию 1)
  discountType: DiscountType;
  discountValue?: number; // Процент скидки или цена по карте
  notes?: string;
  createdAt: number;
}

export interface CalculatedProduct extends Product {
  unitGroup: UnitGroup;
  effectiveQuantity: number;
  effectiveStandardUnits: number;
  effectiveTotalPrice: number;
  pricePerStandardUnit: number;
  standardUnitLabel: string;
  packageUnitLabel: string;
  discountSummaryText?: string;
  isBestDeal: boolean;
  diffPercentVsBest: number; // 0 для лучшего, +X% для остальных
  diffPriceVsBest: number; // 0 для лучшего, +Y ₽ за ед.
  savingsVsBestTotal?: number;
  rank: number;
}

export interface CategoryTab {
  id: string;
  title: string;
  emoji: string;
  products: Product[];
  defaultUnit: UnitType;
  createdAt: number;
}

export interface AppState {
  tabs: CategoryTab[];
  activeTabId: string;
  theme: 'light' | 'dark' | 'system';
  currencySymbol: string;
}

export interface UnitInfo {
  type: UnitType;
  group: UnitGroup;
  label: string;
  shortLabel: string;
  standardUnit: string;
  standardMultiplier: number; // Сколько базовых единиц в 1 штуке этой единицы (напр. г -> 0.001 кг)
}
