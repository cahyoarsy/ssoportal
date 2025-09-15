import React from 'react';

export default function Footer(){
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-8 md:gap-4 justify-between text-sm text-slate-600">
        <div className="flex flex-col gap-3 max-w-sm">
          <span className="font-semibold text-slate-800">Portal SSO Kampus</span>
          <p>Autentikasi terpadu untuk seluruh layanan akademik, administratif, dan kolaborasi institusi.</p>
          <p className="text-xs text-slate-400">v0.1.0 – build demonstrasi UI (belum terhubung backend).</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-slate-800 mb-1">Layanan</span>
            <a href="#login" className="hover:text-brand-600">Autentikasi</a>
            <a href="#testimonials" className="hover:text-brand-600">Testimoni</a>
            <a href="#contact" className="hover:text-brand-600">Dukungan</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-slate-800 mb-1">Keamanan</span>
            <button className="text-left hover:text-brand-600" disabled>MFA (coming)</button>
            <button className="text-left hover:text-brand-600" disabled>Device Trust</button>
            <button className="text-left hover:text-brand-600" disabled>Log Audit</button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-slate-800 mb-1">Lainnya</span>
            <button className="text-left hover:text-brand-600" disabled>Status Sistem</button>
            <button className="text-left hover:text-brand-600" disabled>Dokumentasi</button>
            <button className="text-left hover:text-brand-600" disabled>Integrasi API</button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} SSO Kampus. Hak cipta dilindungi.</div>
    </footer>
  );
}
