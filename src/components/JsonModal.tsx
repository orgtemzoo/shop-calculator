import React, { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { AppState } from '../types';
import { exportToJson, importFromJson } from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';

interface JsonModalProps {
  isOpen: boolean;
  appState: AppState;
  onClose: () => void;
  onRestoreState: (importedState: AppState) => void;
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const JsonModal: React.FC<JsonModalProps> = ({
  isOpen,
  appState,
  onClose,
  onRestoreState,
  onShowToast
}) => {
  const [jsonText, setJsonText] = useState('');
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentJson = exportToJson(appState);

  const handleCopyJson = async () => {
    try {
      triggerHaptic('success');
      await navigator.clipboard.writeText(currentJson);
      setCopied(true);
      onShowToast('JSON скопирован в буфер!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Не удалось скопировать', 'error');
    }
  };

  const handleDownloadFile = () => {
    try {
      triggerHaptic('success');
      const blob = new Blob([currentJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shop-calculator-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('Файл резервной копии скачан!', 'success');
    } catch {
      onShowToast('Ошибка скачивания файла', 'error');
    }
  };

  const handleImport = () => {
    if (!jsonText.trim()) return;

    const imported = importFromJson(jsonText);
    if (imported) {
      triggerHaptic('success');
      onRestoreState(imported);
      onShowToast('Данные успешно восстановлены!', 'success');
      onClose();
    } else {
      triggerHaptic('warning');
      onShowToast('Неверный формат JSON', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)]/60 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center">
              <MaterialIcon name="sync" className="text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--md-sys-color-on-surface)]">
              Резервная копия
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8"
          >
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        {/* M3 Segmented Buttons for Export / Import */}
        <div className="flex bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] rounded-full p-1">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 h-9 rounded-full text-xs font-medium transition-all ${
              activeTab === 'export'
                ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
            }`}
          >
            Экспорт (Сохранить)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 h-9 rounded-full text-xs font-medium transition-all ${
              activeTab === 'import'
                ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
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
                className="w-full p-4 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-2xl text-xs font-mono text-[var(--md-sys-color-on-surface)] focus:outline-none resize-none select-all"
              />
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-1">
                <button
                  onClick={handleDownloadFile}
                  className="w-full sm:w-auto h-10 px-5 rounded-full text-xs font-medium text-[var(--md-sys-color-primary)] border border-[var(--md-sys-color-outline)] hover:bg-[var(--md-sys-color-primary)]/8 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <MaterialIcon name="download" className="text-base" />
                  <span>Скачать .json файл</span>
                </button>
                <button
                  onClick={handleCopyJson}
                  className="w-full sm:w-auto h-10 px-6 rounded-full text-xs font-medium text-[var(--md-sys-color-on-primary)] bg-[var(--md-sys-color-primary)] hover:opacity-90 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MaterialIcon name={copied ? 'check' : 'content_copy'} className="text-base" />
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
                className="w-full p-4 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-2xl text-xs font-mono text-[var(--md-sys-color-on-surface)] focus:outline-none resize-none"
              />
              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={handleImport}
                  disabled={!jsonText.trim()}
                  className="w-full sm:w-auto h-10 px-6 rounded-full text-xs font-medium text-[var(--md-sys-color-on-primary)] bg-[var(--md-sys-color-primary)] hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MaterialIcon name="upload" className="text-base" />
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
