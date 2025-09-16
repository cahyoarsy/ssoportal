import React from 'react';
import { PROGRAM_NAME, PROGRAM_SHORT } from '../branding.js';

export default function Footer(){
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-8 md:gap-4 justify-between text-sm text-slate-600">
        <div className="flex flex-col gap-3 max-w-sm">
          <span className="font-semibold text-slate-800">{PROGRAM_NAME}</span>
          <p>Platform terpadu pembelajaran, monitoring, dan autentikasi ringan untuk eksperimen arsitektur identitas.</p>
          <p className="text-xs text-slate-400">v0.1.0 – demo front-end (tanpa backend produksi).</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-slate-800 mb-1">Portal</span>
            <a href="#login" className="hover:text-brand-600">Login</a>
            <a href="#profile" className="hover:text-brand-600">Profil</a>
            <a href="#contact" className="hover:text-brand-600">Kontak</a>
          </div>
            <div className="flex flex-col gap-2">
            <span className="font-medium text-slate-800 mb-1">Eksperimen</span>
            <button className="text-left hover:text-brand-600" disabled>MFA (soon)</button>
            <button className="text-left hover:text-brand-600" disabled>Device Trust</button>
            <button className="text-left hover:text-brand-600" disabled>Audit Trail</button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-slate-800 mb-1">Referensi</span>
            <button className="text-left hover:text-brand-600" disabled>Dokumentasi</button>
            <button className="text-left hover:text-brand-600" disabled>Status Sistem</button>
            <button className="text-left hover:text-brand-600" disabled>Integrasi API</button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">© {year} {PROGRAM_SHORT}. All rights reserved.</div>
    </footer>
  );
}
