import React from 'react';
import './globals.css';

import { DialogProvider } from '@/components/context/DialogContext';
import ToastContainer from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LayoutClient from '@/components/layout/LayoutClient';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] text-zinc-100 font-sans selection:bg-violet-600 selection:text-white">
        <DialogProvider>
          <LayoutClient>{children}</LayoutClient>
          <ToastContainer />
          <ConfirmDialog />
        </DialogProvider>

        <style>{`
          ::-webkit-scrollbar { width: 5px; height: 5px; }
          ::-webkit-scrollbar-track { background: #0a0a0f; }
          ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #7c3aed; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
      </body>
    </html>
  );
}
