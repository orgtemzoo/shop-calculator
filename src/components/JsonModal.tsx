import React, { useState } from 'react';
import { X, Download, Upload, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Резервное копирование и синхронизация
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Экспорт (Сохранить)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Импорт (Восстановить)
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {activeTab === 'export' ? (
            <>
              <textarea
                readOnly
                rows={8}
                value={currentJson}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none resize-none select-all"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleCopyJson}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-500 flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  <span>{copied ? 'Скопировано!' : 'Копировать JSON'}</span>
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-sky-500" />
                  <span>Скачать .json файл</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <textarea
                rows={8}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Вставьте сюда ранее экспортированный JSON..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
              />
              <button
                onClick={handleImport}
                disabled={!jsonText.trim()}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Восстановить данные</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
