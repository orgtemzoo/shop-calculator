import React, { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { CategoryTab } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface JsonModalProps {
  isOpen: boolean;
  tabs: CategoryTab[];
  onClose: () => void;
  onImportTabs: (importedTabs: CategoryTab[]) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const JsonModal: React.FC<JsonModalProps> = ({
  isOpen,
  tabs,
  onClose,
  onImportTabs,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentJson = JSON.stringify(tabs, null, 2);

  const handleCopyJson = async () => {
    try {
      triggerHaptic('success');
      await navigator.clipboard.writeText(currentJson);
      setCopied(true);
      onShowToast('JSON скопирован в буфер обмена!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Не удалось скопировать JSON', 'error');
    }
  };

  const handleDownloadFile = () => {
    try {
      triggerHaptic('light');
      const blob = new Blob([currentJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shop-calculator-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast('Файл успешно сохранён!', 'success');
    } catch {
      onShowToast('Ошибка скачивания файла', 'error');
    }
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Данные должны быть массивом категорий');
      }

      for (const item of parsed) {
        if (!item.id || !item.title || !Array.isArray(item.products)) {
          throw new Error('Некорректная структура категорий в JSON');
        }
      }

      triggerHaptic('success');
      onImportTabs(parsed);
      onShowToast('Данные успешно импортированы!', 'success');
      onClose();
    } catch (err: any) {
      triggerHaptic('warning');
      onShowToast(`Ошибка импорта: ${err.message}`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center">
              <MaterialIcon name="sync" className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--md-sys-color-on-surface)]">
              Резервная копия
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8 cursor-pointer"
          >
            <MaterialIcon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* M3 Segmented Buttons for Export / Import */}
        <div className="flex bg-[var(--md-sys-color-surface-container-highest)]/70 rounded-full p-1">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 h-9 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] shadow-xs'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)]'
            }`}
          >
            Экспорт (Сохранить)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 h-9 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] shadow-xs'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)]'
            }`}
          >
            Импорт (Восстановить)
          </button>
        </div>

        <div className="space-y-3">
          {activeTab === 'export' ? (
            <>
              <textarea
                readOnly
                rows={7}
                value={currentJson}
                className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)]/60 rounded-2xl text-xs font-mono text-[var(--md-sys-color-on-surface)] focus:outline-none resize-none select-all"
              />
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-1">
                <button
                  onClick={handleDownloadFile}
                  className="w-full sm:w-auto h-10 px-5 rounded-full text-xs font-semibold text-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface-container-highest)] hover:bg-[var(--md-sys-color-surface-container-highest)]/80 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <MaterialIcon name="download" className="w-4 h-4" />
                  <span>Скачать .json файл</span>
                </button>
                <button
                  onClick={handleCopyJson}
                  className="w-full sm:w-auto h-10 px-6 rounded-full text-xs font-semibold text-[var(--md-sys-color-on-primary)] bg-[var(--md-sys-color-primary)] hover:opacity-90 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MaterialIcon name={copied ? 'check' : 'content_copy'} className="w-4 h-4" />
                  <span>{copied ? 'Скопировано!' : 'Копировать JSON'}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <textarea
                rows={7}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Вставьте сюда ранее экспортированный JSON..."
                className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)]/60 rounded-2xl text-xs font-mono text-[var(--md-sys-color-on-surface)] focus:outline-none resize-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)]"
              />
              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={handleImport}
                  disabled={!jsonText.trim()}
                  className="w-full sm:w-auto h-10 px-6 rounded-full text-xs font-semibold text-[var(--md-sys-color-on-primary)] bg-[var(--md-sys-color-primary)] hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MaterialIcon name="upload" className="w-4 h-4" />
                  <span>Восстановить данные</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
