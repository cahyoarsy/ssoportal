import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PROGRAM_SHORT } from '../branding.js';
import { t } from '../langResources.js';
import { canUseDevMaster, buildMockJWT, isAdminEmail } from '../authHelpers.js';
import { buildGoogleAuthUrl, randomState } from '../oauthHelpers';

export default function LoginForm({ onSSOLogin, lang='id' }){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [adminCode,setAdminCode] = useState('');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [usedEmails,setUsedEmails] = useState([]);
  const [emailHint,setEmailHint] = useState('');
  const EMAIL_STORE_KEY = 'used-emails';

  useEffect(()=>{
    try {
      const raw = localStorage.getItem(EMAIL_STORE_KEY);
      if(raw){
        const arr = JSON.parse(raw);
        if(Array.isArray(arr)) setUsedEmails(arr.filter(e=>typeof e==='string'));
      }
    } catch {}
  },[]);

  // Handle OAuth callback jika ada parameter 'code' di URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('OAuth error from Google:', error);
      setError(`Google OAuth error: ${error}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (code && state) {
      handleOAuthCallback(code, state);
    }
  }, []);
  
  async function handleOAuthCallback(code, state) {
    try {
      setLoading(true);
      setError('');
      
      // Validate state to prevent CSRF attacks
      const storedState = sessionStorage.getItem('oauth-google-state');
      const storedTimestamp = sessionStorage.getItem('oauth-google-timestamp');
      
      if (!storedState || storedState !== state) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }
      
      // Check if not too old (5 minutes max)
      const timestamp = parseInt(storedTimestamp || '0');
      const now = Date.now();
      if (now - timestamp > 5 * 60 * 1000) {
        throw new Error('OAuth session expired, please try again');
      }
      
      // Clean up stored state
      sessionStorage.removeItem('oauth-google-state');
      sessionStorage.removeItem('oauth-google-timestamp');
      
      console.log('OAuth callback successful:', { code: code.substring(0, 10) + '...', state });
      
      // Clean up URL before proceeding
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // For demo: simulate successful OAuth and auto-login with mock email
      // In real implementation, you'd exchange code for access token and get user info
      const mockOAuthEmail = 'oauth.user@gmail.com';
      
      // Set email in form
      setEmail(mockOAuthEmail);
      
      // Simulate login process
      await new Promise(r => setTimeout(r, 1000)); // Simulate API call
      
      const role = isAdminEmail(mockOAuthEmail) ? 'admin' : 'user';
      const jwt = buildMockJWT({ sub: mockOAuthEmail, email: mockOAuthEmail, role, ttlSeconds: 300 });
      
      // Save to used emails
      try {
        const lower = mockOAuthEmail.toLowerCase();
        if (!usedEmails.includes(lower)) {
          const next = [...usedEmails, lower].slice(-50);
          setUsedEmails(next);
          localStorage.setItem(EMAIL_STORE_KEY, JSON.stringify(next));
        }
      } catch {}
      
      // Complete login
      onSSOLogin && onSSOLogin(jwt);
      
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError('OAuth login failed: ' + err.message);
      
      // Clean up URL on error
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setLoading(false);
    }
  }

  function isAllowedEmail(val){
    if(!val) return false;
    const lower = val.toLowerCase();
    // allow gmail.com or previously used stored email
    if(lower.endsWith('@gmail.com')) return true;
    if(usedEmails.includes(lower)) return true;
    return false;
  }

  function onEmailChange(v){
    setEmail(v);
    if(!v){ setEmailHint(''); return; }
    if(isAllowedEmail(v)) setEmailHint('Email valid.');
    else setEmailHint('Hanya email Gmail atau email yang sudah pernah digunakan.');
  }
  // Token dikelola di parent (App) agar bisa menampilkan tampilan penuh

  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    // Dev master shortcut (now can accept optional admin email if included in admin list)
    if (canUseDevMaster({password, email})) {
      const jwt = buildMockJWT({ sub: email || 'admin-master', email: email || 'admin@local', role: 'admin', ttlSeconds: 600 });
      onSSOLogin && onSSOLogin(jwt);
      return;
    }
    if (!import.meta.env.DEV && password === (import.meta.env.VITE_MASTER_PASSWORD || '') && !email) {
      setError('Mode master hanya di development. Sertakan email admin valid di produksi.');
      return;
    }
  if (!email || !password){ setError('Email dan password wajib diisi (atau gunakan master dev dengan email admin)'); return; }
  if (!isAllowedEmail(email)) { setError('Email tidak diizinkan. Gunakan akun Gmail atau email yang sudah tercatat.'); return; }
    setLoading(true);
    // TODO: Integrasikan endpoint backend SSO (POST /auth/login) di sini
    await new Promise(r=>setTimeout(r,600));
    setLoading(false);
    const role = (adminCode && adminCode === 'ADMIN-2025') ? 'admin' : (isAdminEmail(email) ? 'admin' : 'user');
    const jwt = buildMockJWT({ sub: email, email, role, ttlSeconds: 300 });
    // persist used email list
    try {
      const lower = email.toLowerCase();
      if(!usedEmails.includes(lower)){
        const next = [...usedEmails, lower].slice(-50); // cap 50 entries
        setUsedEmails(next);
        localStorage.setItem(EMAIL_STORE_KEY, JSON.stringify(next));
      }
    } catch {}
    onSSOLogin && onSSOLogin(jwt);
  }

  function handleGoogle(){
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if(!clientId){
      setError('VITE_GOOGLE_CLIENT_ID belum diset. Tambahkan di file .env.development');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Use the exact redirect URI configured in Google Console
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173';
    
    const scope = 'openid email profile';
    const state = randomState(24);
    
    try {
      // Store state and timestamp for validation
      sessionStorage.setItem('oauth-google-state', state);
      sessionStorage.setItem('oauth-google-timestamp', Date.now().toString());
      
      const url = buildGoogleAuthUrl({ clientId, redirectUri, scope, state });
      
      // Debug untuk verifikasi redirect URI
      console.log('=== Google OAuth Config ===');
      console.log('Client ID:', clientId);
      console.log('Redirect URI:', redirectUri);
      console.log('State:', state);
      console.log('Full OAuth URL:', url);
      console.log('==========================');
      
      // Add loading state
      setLoading(true);
      
      // Redirect to Google OAuth
      window.location.href = url;
      
    } catch (err) {
      console.error('OAuth error:', err);
      setError('Gagal membangun URL OAuth: ' + err.message);
      setLoading(false);
    }
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
            <input type="email" className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={email} onChange={e=>onEmailChange(e.target.value)} placeholder="nama@gmail.com" />
            {email && emailHint && (
              <span className={`text-[11px] ${isAllowedEmail(email)?'text-emerald-600':'text-amber-600'}`}>{emailHint}</span>
            )}
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
          <button type="button" onClick={handleGoogle} disabled={loading} className="btn-outline px-5 py-2.5 text-sm">
            {loading ? 'Menghubungkan...' : t(lang,'login.google')}
          </button>
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

/*
1. Buka https://console.developers.google.com/
2. Buat project baru atau pilih existing
3. Enable Google+ API atau Google Identity
4. Credentials → Create OAuth 2.0 Client ID
5. Application type: Web application
*/
