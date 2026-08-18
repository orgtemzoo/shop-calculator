import React from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between px-4 py-3 rounded-2xl bg-[var(--md-sys-color-inverse-surface)] text-[var(--md-sys-color-inverse-on-surface)] shadow-lg transition-all animate-in slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <MaterialIcon
              name={
                toast.type === 'success'
                  ? 'check_circle'
                  : toast.type === 'error'
                  ? 'error'
                  : 'info'
              }
              className={`text-lg ${
                toast.type === 'success'
                  ? 'text-[var(--md-sys-color-inverse-primary)]'
                  : toast.type === 'error'
                  ? 'text-rose-400'
                  : 'text-sky-300'
              }`}
              filled
            />
            <span>{toast.text}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-[var(--md-sys-color-inverse-on-surface)]/70 hover:text-[var(--md-sys-color-inverse-on-surface)] rounded-full transition-colors ml-2"
          >
            <MaterialIcon name="close" className="text-base" />
          </button>
        </div>
      ))}
    </div>
  );
};
