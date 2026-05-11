'use client';

import React from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useDialog } from '@/components/context/DialogContext';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-sky-500" />,
};

const bgColors = {
  success: 'bg-emerald-500/10 border-emerald-500/20',
  error: 'bg-rose-500/10 border-rose-500/20',
  warning: 'bg-amber-500/10 border-amber-500/20',
  info: 'bg-sky-500/10 border-sky-500/20',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useDialog();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`group relative overflow-hidden rounded-2xl border p-4 backdrop-blur-xl transition-all duration-200 animate-in slide-in-from-right-full ease-out ${bgColors[toast.type]}`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div 
            className="absolute bottom-0 left-0 h-0.5 bg-current opacity-20 transition-all duration-[5000ms] ease-linear w-full origin-left scale-x-0"
            style={{ animation: 'toast-progress 5s linear forwards' }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
