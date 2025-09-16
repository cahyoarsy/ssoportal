import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import LoginForm from './components/LoginForm.jsx';
import Stats from './components/Stats.jsx';
import MobileApp from './components/MobileApp.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Profile from './components/Profile.jsx';
import Footer from './components/Footer.jsx';
import AppEmbed from './components/AppEmbed.jsx';


// Konfigurasi multi-aplikasi terintegrasi
const APPS = [
  { id: 'elearning-iml', name: 'E-Learning IML', path: 'elearning-iml/index.html', hashBase: '' },
  { id: 'monitoring', name: 'Monitoring Guru', path: 'monitoring/index.html', hashBase: '' }
];

function App(){
  const [ssoToken, setSsoToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedApp, setSelectedApp] = useState(APPS[0].id);
  const [dark, setDark] = useState(false);
  const [immersive, setImmersive] = useState(true); // default masuk immersive setelah login
  const [lang, setLang] = useState('id'); // 'id' | 'en'
  const [wide, setWide] = useState(true); // global wide layout state
  const TOKEN_KEY = 'sso-jwt';
  // Audit log removed as per simplification request
  const refreshTimerRef = useRef(null);

  // Whitelist origin (dev + same-origin)
  const ALLOWED_ORIGINS = [window.location.origin, 'http://localhost:5500'];

  // ----- Audit Log Helpers -----
  // Stubbed no-op functions removed

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

  // Restore token & preferences on mount (including language)
  useEffect(()=>{
    try {
      const savedPref = localStorage.getItem('pref-dark');
      if (savedPref !== null) setDark(savedPref === 'true');
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setDark(true);
      const savedLang = localStorage.getItem('pref-lang');
      if(savedLang === 'id' || savedLang === 'en') setLang(savedLang);
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
  // audit removed
    setImmersive(true);
    requestAnimationFrame(()=> window.scrollTo({ top:0, behavior:'smooth' }));
  }

  function exitEmbedded(){
    setSsoToken(null);
    setIsAdmin(false);
    sessionStorage.removeItem(TOKEN_KEY);
  // audit removed
    setImmersive(false);
  }

  function revokeSession(){
    const payload = decodePayload(ssoToken);
  // audit removed
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

  // Persist language when changed
  useEffect(()=>{
    try { localStorage.setItem('pref-lang', lang); } catch {}
  },[lang]);

  if (ssoToken){
    return (
      <>
  <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} />
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
                <button onClick={openImmersive} className="btn-primary px-5 py-2 text-sm">Buka Aplikasi</button>
                <button onClick={exitEmbedded} className="btn-outline px-5 py-2 text-sm">Keluar</button>
              </div>
            </section>
            {/* Removed extra explanatory & admin/audit sections per simplification request */}
          </main>
        )}
      </>
    );
  }

  return (
    <>
  <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} />
      <main className="flex flex-col gap-24">
        <Hero lang={lang} />
        <section id="login" className="container-section scroll-mt-24">
          <LoginForm onSSOLogin={handleSSOLogin} lang={lang} />
        </section>
        <Stats />
        <MobileApp />
  <Testimonials lang={lang} />
  <Profile lang={lang} />
  <Contact lang={lang} />
      </main>
      <Footer />
    </>
  );
}

export default App;
