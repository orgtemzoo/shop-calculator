import React, { useState, useRef, useEffect } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { UnitType } from '../types';
import { UNITS_CONFIG } from '../utils/calculator';
import { triggerHaptic } from '../utils/haptics';

interface M3UnitSelectorProps {
  value: UnitType;
  onChange: (unit: UnitType) => void;
}

const UNIT_GROUPS = [
  {
    title: 'Масса (Вес)',
    units: ['g', 'kg'] as UnitType[]
  },
  {
    title: 'Объём',
    units: ['ml', 'l'] as UnitType[]
  },
  {
    title: 'Штучные товары',
    units: ['pcs', 'roll', 'caps', 'tablet', 'pack', 'portion', 'meter'] as UnitType[]
  }
];

export const M3UnitSelector: React.FC<M3UnitSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentUnitInfo = UNITS_CONFIG[value] || UNITS_CONFIG.g;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (unit: UnitType) => {
    triggerHaptic('light');
    onChange(unit);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic('light');
          setIsOpen(!isOpen);
        }}
        className={`h-12 min-w-[72px] px-3.5 bg-[var(--md-sys-color-surface-container-highest)]/50 hover:bg-[var(--md-sys-color-surface-container-highest)]/70 rounded-2xl flex items-center justify-between gap-1 transition-all cursor-pointer select-none ${
          isOpen
            ? 'ring-2 ring-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface-container-highest)]'
            : ''
        }`}
      >
        <span className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
          {currentUnitInfo.shortLabel}
        </span>
        <MaterialIcon
          name="arrow_drop_down"
          className={`w-5 h-5 text-[var(--md-sys-color-on-surface-variant)] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[var(--md-sys-color-primary)]' : ''
          }`}
        />
      </button>

      {/* M3 Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 min-w-[200px] max-h-[320px] overflow-y-auto bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-2xl shadow-xl p-1.5 animate-in fade-in-50 zoom-in-95">
          {UNIT_GROUPS.map((group, groupIdx) => (
            <div key={group.title} className={groupIdx > 0 ? 'mt-2 pt-2 border-t border-[var(--md-sys-color-outline-variant)]/20' : ''}>
              <div className="px-3 py-1 text-[11px] font-semibold text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">
                {group.title}
              </div>
              <div className="space-y-0.5 mt-0.5">
                {group.units.map((u) => {
                  const info = UNITS_CONFIG[u];
                  const isSelected = value === u;
                  return (
                    <button
                      key={u}
                      type="button"
                      onClick={() => handleSelect(u)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                          : 'hover:bg-[var(--md-sys-color-on-surface)]/8 text-[var(--md-sys-color-on-surface)]'
                      }`}
                    >
                      <span>{info.label}</span>
                      {isSelected && (
                        <MaterialIcon name="check" className="w-4 h-4 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
