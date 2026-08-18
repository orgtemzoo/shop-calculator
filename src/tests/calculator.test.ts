import { describe, it, expect } from 'vitest';
import {
  calculateEffectivePrice,
  calculateSingleProduct,
  calculateComparison,
  formatMoney,
  formatQuantity
} from '../utils/calculator';
import { Product } from '../types';

describe('Calculator Engine', () => {
  describe('calculateEffectivePrice', () => {
    it('calculates regular price without discount', () => {
      const res = calculateEffectivePrice(100, 'none');
      expect(res.effectivePrice).toBe(100);
      expect(res.summaryText).toBeUndefined();
    });

    it('calculates percentage discount', () => {
      const res = calculateEffectivePrice(200, 'percent', 25);
      expect(res.effectivePrice).toBe(150);
      expect(res.summaryText).toContain('25%');
    });

    it('calculates loyalty card price', () => {
      const res = calculateEffectivePrice(200, 'card', 159);
      expect(res.effectivePrice).toBe(159);
      expect(res.summaryText).toContain('По карте');
    });

    it('calculates 1+1 promo (50% per item)', () => {
      const res = calculateEffectivePrice(100, 'buy1get1');
      expect(res.effectivePrice).toBe(50);
    });

    it('calculates 2+1 promo (33.3% per item)', () => {
      const res = calculateEffectivePrice(90, 'buy2get1');
      expect(res.effectivePrice).toBeCloseTo(60, 2);
    });

    it('calculates second item at -50%', () => {
      const res = calculateEffectivePrice(100, 'secondHalf');
      expect(res.effectivePrice).toBe(75);
    });
  });

  describe('calculateSingleProduct', () => {
    it('calculates price per kg for grams correctly (900g for 108r = 120r/kg)', () => {
      const product: Product = {
        id: '1',
        name: 'Молоко 900г',
        price: 108,
        quantity: 900,
        unit: 'g',
        packCount: 1,
        discountType: 'none',
        createdAt: 1000
      };
      const res = calculateSingleProduct(product);
      expect(res.pricePerStandardUnit).toBe(120);
      expect(res.standardUnitLabel).toBe('₽ / кг');
    });

    it('calculates price per liter for milliliters (450ml for 90r = 200r/l)', () => {
      const product: Product = {
        id: '2',
        name: 'Сок 450мл',
        price: 90,
        quantity: 450,
        unit: 'ml',
        packCount: 1,
        discountType: 'none',
        createdAt: 1000
      };
      const res = calculateSingleProduct(product);
      expect(res.pricePerStandardUnit).toBe(200);
      expect(res.standardUnitLabel).toBe('₽ / л');
    });

    it('handles multi-pack calculations (4 packs of 500g for 360r = 180r/kg)', () => {
      const product: Product = {
        id: '3',
        name: 'Сыр 4x500г',
        price: 90,
        quantity: 500,
        unit: 'g',
        packCount: 4,
        discountType: 'none',
        createdAt: 1000
      };
      const res = calculateSingleProduct(product);
      expect(res.effectiveQuantity).toBe(2000);
      expect(res.effectiveTotalPrice).toBe(360);
      expect(res.pricePerStandardUnit).toBe(180);
    });
  });

  describe('calculateComparison', () => {
    it('accurately identifies best deal and calculates percentage diff', () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Вариант А (900г за 108₽)',
          price: 108,
          quantity: 900,
          unit: 'g',
          packCount: 1,
          discountType: 'none',
          createdAt: 1
        },
        {
          id: 'p2',
          name: 'Вариант Б (1000г за 144₽)',
          price: 144,
          quantity: 1,
          unit: 'kg',
          packCount: 1,
          discountType: 'none',
          createdAt: 2
        }
      ];

      const results = calculateComparison(products);
      expect(results).toHaveLength(2);

      const best = results.find((r) => r.id === 'p1');
      const worst = results.find((r) => r.id === 'p2');

      expect(best?.isBestDeal).toBe(true);
      expect(best?.pricePerStandardUnit).toBe(120);
      expect(best?.diffPercentVsBest).toBe(0);

      expect(worst?.isBestDeal).toBe(false);
      expect(worst?.pricePerStandardUnit).toBe(144);
      // (144 - 120) / 120 = 20%
      expect(worst?.diffPercentVsBest).toBe(20);
      expect(worst?.diffPriceVsBest).toBe(24);
    });
  });

  describe('Formatting Helpers', () => {
    it('formats money and quantities nicely', () => {
      expect(formatMoney(120)).toBe('120 ₽');
      expect(formatMoney(120.5)).toBe('120,50 ₽');
      expect(formatQuantity(900, 'g')).toBe('900 г');
      expect(formatQuantity(500, 'g', 2)).toBe('2 × 500 г (1 000 г)');
    });
  });
});
