import { AppState, CategoryTab, Product } from '../types';

const STORAGE_KEY = 'shop_calculator_state_v2';
const LEGACY_STORAGE_KEY = 'products'; // From v1 if any

export const DEFAULT_TABS: CategoryTab[] = [
  {
    id: 'tab-dairy',
    title: 'Молочка',
    emoji: '🥛',
    defaultUnit: 'g',
    createdAt: 1700000000000,
    products: [
      {
        id: 'p-1',
        name: 'Молоко Домик в деревне 3.2%',
        price: 98,
        quantity: 930,
        unit: 'ml',
        packCount: 1,
        discountType: 'none',
        createdAt: 1700000001000
      },
      {
        id: 'p-2',
        name: 'Молоко Простоквашино 3.2%',
        price: 114,
        quantity: 1,
        unit: 'l',
        packCount: 1,
        discountType: 'none',
        createdAt: 1700000002000
      },
      {
        id: 'p-3',
        name: 'Молоко Село Зеленое (по акции 1+1)',
        price: 120,
        quantity: 900,
        unit: 'ml',
        packCount: 1,
        discountType: 'buy1get1',
        createdAt: 1700000003000
      }
    ]
  },
  {
    id: 'tab-cheese',
    title: 'Сыр и масло',
    emoji: '🧀',
    defaultUnit: 'g',
    createdAt: 1700000010000,
    products: [
      {
        id: 'p-4',
        name: 'Сыр Российский брусок',
        price: 189,
        quantity: 200,
        unit: 'g',
        packCount: 1,
        discountType: 'none',
        createdAt: 1700000011000
      },
      {
        id: 'p-5',
        name: 'Сыр Российский фасовка 400г',
        price: 339,
        quantity: 400,
        unit: 'g',
        packCount: 1,
        discountType: 'card',
        discountValue: 299,
        createdAt: 1700000012000
      }
    ]
  },
  {
    id: 'tab-household',
    title: 'Для дома',
    emoji: '🧻',
    defaultUnit: 'roll',
    createdAt: 1700000020000,
    products: [
      {
        id: 'p-6',
        name: 'Zewa 4 рулона 3 слоя',
        price: 149,
        quantity: 4,
        unit: 'roll',
        packCount: 1,
        discountType: 'none',
        createdAt: 1700000021000
      },
      {
        id: 'p-7',
        name: 'Zewa 12 рулонов 3 слоя (Мегапак)',
        price: 389,
        quantity: 12,
        unit: 'roll',
        packCount: 1,
        discountType: 'none',
        createdAt: 1700000022000
      }
    ]
  }
];

export const INITIAL_STATE: AppState = {
  tabs: DEFAULT_TABS,
  activeTabId: DEFAULT_TABS[0].id,
  theme: 'system',
  currencySymbol: '₽'
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.tabs && Array.isArray(parsed.tabs) && parsed.tabs.length > 0) {
        return {
          tabs: parsed.tabs,
          activeTabId: parsed.activeTabId || parsed.tabs[0].id,
          theme: parsed.theme || 'system',
          currencySymbol: parsed.currencySymbol || '₽'
        };
      }
    }

    // Try migration from v1 legacy products array if exists
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyProducts = JSON.parse(legacyRaw);
      if (Array.isArray(legacyProducts) && legacyProducts.length > 0) {
        const migratedProducts: Product[] = legacyProducts.map((p: any, idx: number) => ({
          id: p.id ? String(p.id) : `p-leg-${idx}`,
          name: p.name || `Товар ${idx + 1}`,
          price: Number(p.price) || 0,
          quantity: Number(p.weight) || 1,
          unit: 'g',
          packCount: 1,
          discountType: 'none',
          createdAt: Date.now() - idx * 1000
        }));

        const legacyTab: CategoryTab = {
          id: 'tab-main',
          title: 'Мои товары',
          emoji: '🛒',
          products: migratedProducts,
          defaultUnit: 'g',
          createdAt: Date.now()
        };

        const state: AppState = {
          tabs: [legacyTab, ...DEFAULT_TABS.slice(1)],
          activeTabId: legacyTab.id,
          theme: (localStorage.getItem('theme') as any) || 'system',
          currencySymbol: '₽'
        };
        saveState(state);
        return state;
      }
    }
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
  }

  return INITIAL_STATE;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function exportToJson(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function importFromJson(jsonStr: string): AppState | null {
  try {
    const data = JSON.parse(jsonStr);
    if (data.tabs && Array.isArray(data.tabs)) {
      return {
        tabs: data.tabs,
        activeTabId: data.activeTabId || data.tabs[0]?.id || 'tab-1',
        theme: data.theme || 'system',
        currencySymbol: data.currencySymbol || '₽'
      };
    }
  } catch (e) {
    console.error('Invalid JSON import format:', e);
  }
  return null;
}

/**
 * Компактная сериализация одной вкладки в URL hash для быстрой отправки ссылки
 */
export function serializeTabToHash(tab: CategoryTab): string {
  try {
    const payload = {
      t: tab.title,
      e: tab.emoji,
      u: tab.defaultUnit,
      p: tab.products.map((p) => [
        p.name,
        p.price,
        p.quantity,
        p.unit,
        p.packCount || 1,
        p.discountType !== 'none' ? p.discountType : undefined,
        p.discountValue
      ])
    };
    const json = JSON.stringify(payload);
    return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  } catch (e) {
    console.error('Failed to serialize tab to hash', e);
    return '';
  }
}

/**
 * Десериализация вкладки из URL hash
 */
export function deserializeTabFromHash(hashStr: string): CategoryTab | null {
  try {
    const cleanHash = hashStr.replace(/^#/, '');
    if (!cleanHash) return null;
    const json = decodeURIComponent(escape(atob(decodeURIComponent(cleanHash))));
    const data = JSON.parse(json);
    if (data && data.t && Array.isArray(data.p)) {
      const products: Product[] = data.p.map((item: any, idx: number) => ({
        id: `url-p-${Date.now()}-${idx}`,
        name: String(item[0] || 'Товар'),
        price: Number(item[1]) || 0,
        quantity: Number(item[2]) || 1,
        unit: item[3] || 'g',
        packCount: Number(item[4]) || 1,
        discountType: item[5] || 'none',
        discountValue: item[6] !== undefined ? Number(item[6]) : undefined,
        createdAt: Date.now() - idx * 100
      }));

      return {
        id: `tab-shared-${Date.now()}`,
        title: data.t,
        emoji: data.e || '🛒',
        defaultUnit: data.u || 'g',
        products,
        createdAt: Date.now()
      };
    }
  } catch (e) {
    console.error('Failed to parse tab from hash', e);
  }
  return null;
}
