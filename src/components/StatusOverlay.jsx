import React from 'react';

export function StatusOverlay({ phase, message, visible }) {
  if (!visible) return null;
  const color = phase === 'error' ? 'bg-red-600' : phase === 'ready' ? 'bg-emerald-600' : 'bg-blue-600';
  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
      <div className="pointer-events-auto w-full max-w-sm mx-auto px-6 py-5 rounded-2xl shadow-xl backdrop-blur bg-white/80 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <span className={`inline-flex h-3 w-3 rounded-full ${color} shadow`}></span>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-200">Portal Status</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">{message}</p>
        {phase === 'loading' && (
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full" />
            <span>Memuat modul & sesi...</span>
          </div>
        )}
        {phase === 'error' && (
          <div className="mt-4 text-xs text-red-500">Silakan reload atau cek console.</div>
        )}
      </div>
    </div>
  );
}

export default StatusOverlay;
