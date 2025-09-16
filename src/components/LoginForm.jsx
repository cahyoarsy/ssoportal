import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PROGRAM_SHORT } from '../branding.js';
import { t } from '../langResources.js';

export default function LoginForm({ onSSOLogin, lang='id' }){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [adminCode,setAdminCode] = useState('');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  // Token dikelola di parent (App) agar bisa menampilkan tampilan penuh

  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    // Fast admin path (DEV ONLY): jika hanya memasukkan master password tanpa email
    if (import.meta.env.DEV && !email && password === 'jancok') {
      const header = { alg: 'HS256', typ: 'JWT' };
      const exp = Math.floor(Date.now()/1000) + 10*60; // admin token 10 menit
      const jti = crypto.randomUUID ? crypto.randomUUID() : ('jti-' + Math.random().toString(36).slice(2));
      const pl = { sub: 'admin-master', email: 'admin@local', role: 'admin', iat: Math.floor(Date.now()/1000), exp, jti };
      function b64(obj){ return btoa(JSON.stringify(obj)).replace(/=+/g,'').replace(/\+/g,'-').replace(/\//g,'_'); }
      const unsigned = b64(header)+'.'+b64(pl);
      const jwt = unsigned + '.master';
      onSSOLogin && onSSOLogin(jwt);
      return;
    }
    if (!import.meta.env.DEV && !email && password === 'jancok') {
      setError('Master password hanya tersedia di lingkungan development.');
      return;
    }
    if (!email || !password){ setError('Email dan password wajib diisi (atau gunakan master password saja untuk admin)'); return; }
    setLoading(true);
    // TODO: Integrasikan endpoint backend SSO (POST /auth/login) di sini
    await new Promise(r=>setTimeout(r,600));
    setLoading(false);
    // Mock hasil autentikasi berhasil -> generate token SSO sederhana (JANGAN gunakan di produksi)
    // Buat JWT mock: header.payload.signature (signature dummy)
    const header = { alg: 'HS256', typ: 'JWT' };
    const exp = Math.floor(Date.now()/1000) + 5*60; // 5 menit
  const role = (adminCode && adminCode === 'ADMIN-2025') ? 'admin' : 'user';
  const jti = crypto.randomUUID ? crypto.randomUUID() : ('jti-' + Math.random().toString(36).slice(2));
  const pl = { sub: email, email, role, iat: Math.floor(Date.now()/1000), exp, jti };
    function b64(obj){
      return btoa(JSON.stringify(obj)).replace(/=+/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    }
    const unsigned = b64(header)+'.'+b64(pl);
    const signature = 'demo-signature'; // TODO: gantikan dengan HMAC SHA256 (server)
    const jwt = unsigned + '.' + signature;
    onSSOLogin && onSSOLogin(jwt);
  }

  function handleGoogle(){
    // TODO: Redirect ke OAuth Google (auth/google?redirect=...) di sini
    alert('Redirect ke Google OAuth (placeholder)');
  }

  return (
    <motion.div initial={{y:40, opacity:0}} whileInView={{y:0, opacity:1}} viewport={{once:true}} transition={{duration:0.6}} className="grid lg:grid-cols-2 gap-12 items-start">
    <div className="flex flex-col gap-4">
  <h2 className="text-3xl font-semibold text-slate-800">{t(lang,'login.heading').replace('Sangsongko Engineering', PROGRAM_SHORT)}</h2>
  <p className="text-slate-600">{t(lang,'login.sub')}</p>
  <p className="text-xs text-slate-500 italic">{t(lang,'login.subNote')}</p>
        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5 max-w-md">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t(lang,'login.email')}</label>
            <input type="email" className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nama@institusi.ac.id" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t(lang,'login.password')}</label>
            <input type="password" className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium flex items-center gap-2">{t(lang,'login.adminCode')} <span className="text-[10px] font-normal text-slate-400">({t(lang,'login.optional')})</span></label>
            <input type="password" className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={adminCode} onChange={e=>setAdminCode(e.target.value)} placeholder="Masukkan kode admin" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {adminCode && adminCode === 'ADMIN-2025' && (
            <div className="text-[11px] text-emerald-600 -mt-2">Mode admin akan diaktifkan.</div>
          )}
          <button disabled={loading} type="submit" className="btn-primary px-5 py-2.5">{loading? t(lang,'login.processing') : t(lang,'login.loginBtn')}</button>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">{t(lang,'login.or')}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <button type="button" onClick={handleGoogle} className="btn-outline px-5 py-2.5 text-sm">{t(lang,'login.google')}</button>
          <p className="text-xs text-slate-400 leading-relaxed">{t(lang,'login.disclaimer')} <span className="italic text-[10px] text-slate-500">{t(lang,'login.disclaimerNote')}</span></p>
        </form>
      </div>
      <div className="flex flex-col gap-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="card p-5 flex flex-col gap-3">
            <span className="badge">Keamanan</span>
            <p className="text-sm text-slate-600">Autentikasi tunggal menekan risiko kredensial tersebar dan mempermudah kontrol akses.</p>
          </div>
          <div className="card p-5 flex flex-col gap-3">
            <span className="badge">Efisiensi</span>
            <p className="text-sm text-slate-600">Satu kali login membuka banyak sistem tanpa mengulang autentikasi.</p>
          </div>
          <div className="card p-5 flex flex-col gap-3">
            <span className="badge">Integrasi</span>
            <p className="text-sm text-slate-600">Profil pengguna tunggal konsisten di seluruh layanan internal.</p>
          </div>
          <div className="card p-5 flex flex-col gap-3">
            <span className="badge">Monitoring</span>
            <p className="text-sm text-slate-600">Aktivitas tercatat & dapat diaudit terpusat untuk kepatuhan.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
