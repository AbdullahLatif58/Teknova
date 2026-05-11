'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useDialog } from '@/components/context/DialogContext';
import Button from './Button';

export default function ConfirmDialog() {
  const { confirmState, setConfirmState } = useDialog();

  if (!confirmState) return null;

  const { title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'primary', resolve } = confirmState;

  const handleConfirm = () => {
    resolve(true);
    setConfirmState(null);
  };

  const handleCancel = () => {
    resolve(false);
    setConfirmState(null);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={handleCancel}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0d0d14] p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600" />
        
        <button
          onClick={handleCancel}
          className="absolute right-6 top-6 rounded-full p-2 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`rounded-3xl p-4 ${variant === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-violet-500/10 text-violet-500'}`}>
            <AlertTriangle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">
              {title}
            </h2>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {message}
            </p>
          </div>

          <div className="flex w-full gap-3 pt-4">
            <Button
              variant="ghost"
              className="flex-1 rounded-2xl py-4 font-black text-xs uppercase tracking-widest"
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={variant === 'danger' ? 'primary' : 'primary'}
              className={`flex-1 rounded-2xl py-4 font-black text-xs uppercase tracking-widest ${variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700 shadow-[0_0_20px_rgba(225,29,72,0.3)]' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600'}`}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
