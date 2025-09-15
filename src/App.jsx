import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import LoginForm from './components/LoginForm.jsx';
import Stats from './components/Stats.jsx';
import MobileApp from './components/MobileApp.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import AppEmbed from './components/AppEmbed.jsx';

// Komponen kecil untuk menampilkan audit log terakhir
function AuditLogList({ readAudit }){
  const events = readAudit().slice(-10).reverse();
  if(!events.length) return (
    <div className="mt-4 border rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">Belum ada event audit.</div>
  );
  return (
    <div className="mt-6 w-full">
      <h4 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200 flex items-center gap-2">Audit Log <span className="text-[10px] font-normal text-slate-400">(last {events.length})</span></h4>
      <div className="overflow-x-auto border rounded-lg bg-white dark:bg-slate-900/60">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Waktu</th>
              <th className="text-left px-3 py-2 font-medium">Type</th>
              <th className="text-left px-3 py-2 font-medium">Email</th>
              <th className="text-left px-3 py-2 font-medium">Role</th>
              <th className="text-left px-3 py-2 font-medium">JTI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {events.map((e,i)=>(
              <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="px-3 py-1.5 whitespace-nowrap text-slate-500 dark:text-slate-400">{new Date(e.ts).toLocaleTimeString()}</td>
                <td className="px-3 py-1.5 font-medium uppercase tracking-wide text-[11px] text-slate-700 dark:text-slate-200">{e.type}</td>
                <td className="px-3 py-1.5 text-slate-600 dark:text-slate-300">{e.email || '-'}</td>
                <td className="px-3 py-1.5 text-slate-600 dark:text-slate-300">{e.role || '-'}</td>
                <td className="px-3 py-1.5 font-mono text-[10px] text-slate-500 dark:text-slate-400" title={e.jti || ''}>{e.jti ? e.jti.slice(0,8)+'...' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Konfigurasi multi-aplikasi terintegrasi
const APPS = [
  { id: 'proyek1', name: 'Proyek1', path: 'proyek1/index.html', hashBase: '#home' },
  { id: 'demo2', name: 'Demo App 2', path: 'demo2/index.html', hashBase: '#start' },
  { id: 'elearning-iml', name: 'E-Learning IML', path: 'elearning-iml/index.html', hashBase: '' }
];

function App(){
  const [ssoToken, setSsoToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedApp, setSelectedApp] = useState(APPS[0].id);
  const [dark, setDark] = useState(false);
  const [immersive, setImmersive] = useState(true); // default masuk immersive setelah login
  const [wide, setWide] = useState(true); // global wide layout state
  const TOKEN_KEY = 'sso-jwt';
  const AUDIT_KEY = 'sso-audit-log';
  const refreshTimerRef = useRef(null);

  // Whitelist origin (dev + same-origin)
  const ALLOWED_ORIGINS = [window.location.origin, 'http://localhost:5500'];

  // ----- Audit Log Helpers -----
  function readAudit(){
    try { return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]'); } catch { return []; }
  }
  function writeAudit(list){
    try { localStorage.setItem(AUDIT_KEY, JSON.stringify(list.slice(-50))); } catch {}
  }
  function pushAudit(evt){
    const list = readAudit();
    list.push({ ts: Date.now(), ...evt });
    writeAudit(list);
  }

  // Helper decode JWT payload
  function decodePayload(tok){
    try {
      const parts = tok.split('.');
      if(parts.length!==3) return null;
      const json = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
      return json;
    } catch { return null; }
  }

  // Mock re-issuer (placeholder silent refresh). Real impl: call backend endpoint to get signed token.
  function refreshToken(oldTok){
    const payload = decodePayload(oldTok);
    if(!payload || !payload.email) return;
    const header = { alg:'none', typ:'JWT' }; // placeholder (no signature)
    const exp = Math.floor(Date.now()/1000) + 5*60; // extend 5 menit
    const newPayload = { ...payload, exp, jti: (crypto.randomUUID ? crypto.randomUUID() : ('jti-' + Math.random().toString(36).slice(2))) };
    function b64u(obj){
      return btoa(JSON.stringify(obj)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    }
    const unsigned = b64u(header)+'.'+b64u(newPayload)+'.x';
    setSsoToken(unsigned);
    sessionStorage.setItem(TOKEN_KEY, unsigned);
    pushAudit({ type:'refresh', email: payload.email, role: payload.role, jti: newPayload.jti });
    // broadcast ke iframe aktif (jika ada)
    setTimeout(()=>{
      document.querySelectorAll('iframe').forEach(f=>{
        try { f.contentWindow && f.contentWindow.postMessage({ type:'SSO_TOKEN', token: unsigned }, '*'); } catch {}
      });
    },50);
  }

  // Schedule silent refresh (placeholder)
  useEffect(()=>{
    if(refreshTimerRef.current){ clearTimeout(refreshTimerRef.current); refreshTimerRef.current = null; }
    if(!ssoToken) return;
    const payload = decodePayload(ssoToken);
    if(!payload || !payload.exp) return;
    const expiresMs = payload.exp*1000;
    const now = Date.now();
    const lead = 30*1000; // refresh 30s sebelum exp
    const delay = Math.max(1000, expiresMs - now - lead);
    if(expiresMs <= now){
      // sudah kedaluwarsa -> logout
      exitEmbedded();
      return;
    }
    refreshTimerRef.current = setTimeout(()=>{
      refreshToken(ssoToken);
    }, delay);
    return ()=> { if(refreshTimerRef.current){ clearTimeout(refreshTimerRef.current); } };
  },[ssoToken]);

  // Restore token & preferences on mount
  useEffect(()=>{
    try {
      const savedPref = localStorage.getItem('pref-dark');
      if (savedPref !== null) setDark(savedPref === 'true');
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setDark(true);
    } catch {}

    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) {
      // Basic decode & exp check (no signature here; signature verified originally on issuance)
      try {
        const [,payload] = saved.split('.');
        const json = JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/')));
        if (json.exp * 1000 > Date.now()) {
          setSsoToken(saved);
          setIsAdmin(json.role === 'admin');
          setImmersive(false); // mulai dalam mode portal dahulu setelah refresh
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
        }
      } catch {
        sessionStorage.removeItem(TOKEN_KEY);
      }
    }
  },[]);

  function handleSSOLogin(token){
    setSsoToken(token);
    sessionStorage.setItem(TOKEN_KEY, token);
    const payload = decodePayload(token);
    setIsAdmin(!!payload && payload.role === 'admin');
    if(payload){ pushAudit({ type:'login', email: payload.email, role: payload.role, jti: payload.jti }); }
    setImmersive(true);
    requestAnimationFrame(()=> window.scrollTo({ top:0, behavior:'smooth' }));
  }

  function exitEmbedded(){
    setSsoToken(null);
    setIsAdmin(false);
    sessionStorage.removeItem(TOKEN_KEY);
    pushAudit({ type:'logout', reason:'user', email: undefined, role: undefined });
    setImmersive(false);
  }

  function revokeSession(){
    const payload = decodePayload(ssoToken);
    pushAudit({ type:'revoke', email: payload?.email, role: payload?.role, jti: payload?.jti });
    exitEmbedded();
  }

  // Listen global messages (logout + optional future commands) dengan filter origin
  useEffect(()=>{
    function onMessage(e){
      if(!e || !e.data) return;
      if(e.origin && !ALLOWED_ORIGINS.includes(e.origin)) return;
      if(e.data.type === 'SSO_LOGOUT'){
        exitEmbedded();
      }
      // Future: handle TOKEN_REFRESH_ACK, THEME_REQUEST, etc.
    }
    window.addEventListener('message', onMessage);
    return ()=> window.removeEventListener('message', onMessage);
  },[]);

  // Mode halaman penuh setelah login SSO
  // Terapkan kelas dark pada html root
  useEffect(()=>{
    const root = document.documentElement; // <html>
    if (dark) root.classList.add('dark'); else root.classList.remove('dark');
    try { localStorage.setItem('pref-dark', String(dark)); } catch {}
  },[dark]);

  function openImmersive(){ setImmersive(true); }
  function minimizeImmersive(){ setImmersive(false); }

  if (ssoToken){
    return (
      <>
        <Navbar dark={dark} setDark={setDark} />
        <AnimatePresence>
          {immersive && (
            <motion.div key="immersive"
              initial={{opacity:0, scale:.98}}
              animate={{opacity:1, scale:1}}
              exit={{opacity:0, scale:.98}}
              transition={{duration:0.35, ease:'easeOut'}}
              className="fixed inset-0 z-[60]"
            >
              <AppEmbed
                token={ssoToken}
                immersive
                onExit={exitEmbedded}
                onMinimize={minimizeImmersive}
                app={selectedApp}
                apps={APPS}
                onSelectApp={setSelectedApp}
                dark={dark}
                setDark={setDark}
                isAdmin={isAdmin}
                onAdminRefresh={()=> refreshToken(ssoToken)}
                wide={wide}
                setWide={setWide}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {!immersive && (
          <main className="container-section py-12 flex flex-col gap-12">
            <section className="card p-8 flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Aplikasi Terintegrasi</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">Anda sudah login melalui SSO. Pilih aplikasi untuk dibuka dalam mode immersive penuh layar atau ganti aplikasi default sebelum membuka.</p>
              <div className="flex flex-wrap gap-4 items-center">
                <label className="text-sm font-medium">Pilih Aplikasi:</label>
                <select
                  value={selectedApp}
                  onChange={e=> setSelectedApp(e.target.value)}
                  className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100"
                >
                  {APPS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <button onClick={openImmersive} className="btn-primary px-5 py-2 text-sm">Buka Mode Immersive</button>
                <button onClick={exitEmbedded} className="btn-outline px-5 py-2 text-sm">Logout</button>
              </div>
            </section>
            <section className="grid md:grid-cols-2 gap-8">
              <div className="card p-6 flex flex-col gap-3">
                <h3 className="font-semibold">Apa itu Mode Immersive?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Mode ini menyembunyikan portal dan menampilkan aplikasi terpilih memenuhi layar dengan overlay kontrol minimal (selector, dark toggle, logout, minimize/restore).</p>
              </div>
              <div className="card p-6 flex flex-col gap-3">
                <h3 className="font-semibold">Sinkronisasi Tema</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Saat Anda mengubah tema portal, aplikasi di iframe menerima pesan dan dapat menerapkan tema seragam (kelas <code>dark-sso</code> / <code>light-sso</code>).</p>
              </div>
              {isAdmin && (
                <div className="card p-6 flex flex-col gap-4 md:col-span-2">
                  <h3 className="font-semibold text-amber-600 flex items-center gap-2">Panel Admin <span className="text-[10px] font-normal uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-0.5 rounded">role: admin</span></h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Fitur ini hanya tampil untuk token dengan claim <code>role=admin</code>. Letakkan manajemen user, audit log, revoke token, dsb di sini.</p>
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={()=> refreshToken(ssoToken)} className="px-4 py-2 rounded-md text-sm bg-amber-600 hover:bg-amber-500 text-white">Perbarui Token Manual</button>
                    <button type="button" onClick={()=> { document.querySelectorAll('iframe').forEach(f=>{ try { f.contentWindow.postMessage({ type:'THEME_SYNC', dark }, '*'); } catch {} }); }} className="px-4 py-2 rounded-md text-sm bg-slate-700 hover:bg-slate-600 text-white">Sinkronisasi Tema Paksa</button>
                    <button type="button" onClick={()=> { const payload = decodePayload(ssoToken); alert('Payload JWT (mock):\n'+ JSON.stringify(payload,null,2)); }} className="px-4 py-2 rounded-md text-sm bg-slate-500 hover:bg-slate-400 text-white">Lihat Payload</button>
                    <button type="button" onClick={revokeSession} className="px-4 py-2 rounded-md text-sm bg-red-600 hover:bg-red-500 text-white">Revoke Session</button>
                  </div>
                  <AuditLogList readAudit={readAudit} />
                </div>
              )}
            </section>
          </main>
        )}
      </>
    );
  }

  return (
    <>
  <Navbar dark={dark} setDark={setDark} />
      <main className="flex flex-col gap-24">
        <Hero />
        <section id="login" className="container-section scroll-mt-24">
          <LoginForm onSSOLogin={handleSSOLogin} />
        </section>
        <Stats />
        <MobileApp />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
