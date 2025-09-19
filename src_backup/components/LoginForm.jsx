import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PROGRAM_SHORT } from '../branding.js';
import { t } from '../langResources.js';
import { canUseDevMaster, buildMockJWT, isAdminEmail } from '../authHelpers.js';
import { buildGoogleAuthUrl, randomState, generateRandomString, createCodeChallenge } from '../oauthHelpers';
import { loginUser, emailExists, getRegisteredEmails, getUserByEmail } from '../authStorage';

export default function LoginForm({ onSSOLogin, onSwitchToRegister, lang='id', authService }){
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
      // Load registered emails untuk validation
      const registeredEmails = getRegisteredEmails();
      setUsedEmails(registeredEmails);
      
      // Backward compatibility: load old used emails
      const raw = localStorage.getItem(EMAIL_STORE_KEY);
      if(raw){
        const arr = JSON.parse(raw);
        if(Array.isArray(arr)) {
          const oldEmails = arr.filter(e=>typeof e==='string');
          // Merge with registered emails
          const allEmails = [...new Set([...registeredEmails, ...oldEmails])];
          setUsedEmails(allEmails);
        }
      }
    } catch {}
  },[]);

  // Listen for authentication events
  useEffect(() => {
    if (!authService) return;

    const handleAuthError = (event) => {
      setError(event.detail.error);
      setLoading(false);
    };

    const handleSessionCreated = () => {
      setLoading(false);
      setError('');
    };

    authService.sso.addEventListener('auth_error', handleAuthError);
    authService.sso.addEventListener('session_created', handleSessionCreated);

    return () => {
      authService.sso.removeEventListener('auth_error', handleAuthError);
      authService.sso.removeEventListener('session_created', handleSessionCreated);
    };
  }, [authService]);

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
    if (!authService) {
      setError('Authentication service not available');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Validate state to prevent CSRF attacks
      const storedState = sessionStorage.getItem('oauth-google-state');
      
      if (!storedState || storedState !== state) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }
      
      // Clean up stored state
      sessionStorage.removeItem('oauth-google-state');
      sessionStorage.removeItem('oauth-google-nonce');
      sessionStorage.removeItem('oauth-google-code-verifier');
      sessionStorage.removeItem('oauth-google-timestamp');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // For demo: simulate OAuth flow with mock data
      // In production, you would handle the actual OAuth token exchange here
      console.log('OAuth callback - would exchange code for tokens in production');
      
      // Simulate successful OAuth with mock Google response
      const mockGoogleResponse = {
        credential: 'mock.jwt.token', // In production, this would be the actual ID token
        // Mock user data that would come from Google
        mockUserData: {
          sub: 'oauth.user.123',
          email: 'oauth.user@gmail.com',
          name: 'OAuth Test User',
          picture: 'https://via.placeholder.com/150',
          email_verified: true,
          given_name: 'OAuth',
          family_name: 'User'
        }
      };
      
      // Use AuthService to handle the authentication
      await authService.handleGoogleResponse(mockGoogleResponse);
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function isAllowedEmail(val){
    if(!val) return false;
    const lower = val.toLowerCase();
    // allow gmail.com, registered emails, or previously used stored email
    if(lower.endsWith('@gmail.com')) return true;
    if(emailExists(lower)) return true; // Check in registered users
    if(usedEmails.includes(lower)) return true;
    return false;
  }

  function onEmailChange(v){
    setEmail(v);
    if(!v){ setEmailHint(''); return; }
    if(isAllowedEmail(v)) setEmailHint('Email valid.');
    else setEmailHint('Hanya email Gmail, email terdaftar, atau email yang sudah pernah digunakan.');
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
  if (!isAllowedEmail(email)) { setError('Email tidak diizinkan. Gunakan akun Gmail, email terdaftar, atau email yang sudah tercatat.'); return; }
    setLoading(true);
    
    try {
      // Try to login with registered account first
      const user = loginUser({ email, password });
      
      // Success: create JWT and login
      const jwt = buildMockJWT({ 
        sub: user.id, 
        email: user.email, 
        role: user.role, 
        name: user.fullName,
        ttlSeconds: 300 
      });
      
      // Update used emails list
      const lower = email.toLowerCase();
      if (!usedEmails.includes(lower)) {
        const next = [...usedEmails, lower].slice(-50);
        setUsedEmails(next);
        localStorage.setItem(EMAIL_STORE_KEY, JSON.stringify(next));
      }
      
      onSSOLogin && onSSOLogin(jwt);
      return;
      
    } catch (authError) {
      // If authentication fails, fall back to legacy behavior for demo/development
      console.log('Auth failed, trying legacy mode:', authError.message);
      
      // TODO: Legacy demo login - remove in production
      await new Promise(r=>setTimeout(r,600));
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
  }

  async function handleGoogle(){
    if (!authService) {
      setError('Authentication service not available');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Use AuthService for Google authentication
      await authService.login();
      
    } catch (error) {
      console.error('Google login error:', error);
      setError('Login gagal: ' + error.message);
      setLoading(false);
    }
  }

  // Quick Admin Login (passwordless) & Passwordless login for registered users
  function canPasswordless(){
    return (import.meta?.env?.VITE_ALLOW_PASSWORDLESS ?? 'true') === 'true';
  }

  const handleAdminQuickLogin = async () => {
    try {
      if (!canPasswordless()) { setError('Passwordless dinonaktifkan.'); return; }
      // Prefer an existing admin user if available
      const adminCandidates = ['admin@demo.com','admin@unesa.ac.id'];
      let adminEmail = email && isAdminEmail(email) ? email : adminCandidates.find(e=>emailExists(e)) || (email && isAdminEmail(email) ? email : null);
      if (!adminEmail) adminEmail = 'admin@demo.com';

      const payload = { sub: 'admin-quick', email: adminEmail, role: 'admin', name: 'Administrator', ttlSeconds: 900 };
      const jwt = buildMockJWT(payload);
      onSSOLogin && onSSOLogin(jwt);
    } catch (e) {
      setError(e.message || 'Gagal admin quick login');
    }
  };

  const handlePasswordlessLogin = async () => {
    try {
      if (!canPasswordless()) { setError('Passwordless dinonaktifkan.'); return; }
      if (!email) { setError('Masukkan email terdaftar untuk akses tanpa password'); return; }
      const user = getUserByEmail(email);
      if (!user) { setError('Email tidak ditemukan di daftar akun.'); return; }
      const jwt = buildMockJWT({ sub: user.id, email: user.email, role: user.role, name: user.fullName, ttlSeconds: 900 });
      onSSOLogin && onSSOLogin(jwt);
    } catch (e) {
      setError(e.message || 'Gagal passwordless login');
    }
  };

  return (
    <motion.div 
      initial={{y:40, opacity:0}} 
      whileInView={{y:0, opacity:1}} 
      viewport={{once:true}} 
      transition={{duration:0.8, delay:0.2}} 
      className="grid lg:grid-cols-2 gap-16 items-start"
    >
      {/* Login Form Section */}
      <div className="flex flex-col gap-6">
        <motion.div 
          initial={{y:20, opacity:0}} 
          whileInView={{y:0, opacity:1}} 
          viewport={{once:true}} 
          transition={{duration:0.6, delay:0.3}}
          className="space-y-4"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-brand-600 bg-clip-text text-transparent">
            {t(lang,'login.heading').replace('Sangsongko Engineering', PROGRAM_SHORT)}
          </h2>
          <p className="text-lg text-slate-600">{t(lang,'login.sub')}</p>
          <p className="text-sm text-slate-500 italic">{t(lang,'login.subNote')}</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          initial={{y:30, opacity:0}} 
          whileInView={{y:0, opacity:1}} 
          viewport={{once:true}} 
          transition={{duration:0.7, delay:0.4}}
          className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-blue-500/10 max-w-md"
        >
          {/* Floating background elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse" />
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse" />
          
          <div className="relative space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                {t(lang,'login.email')}
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm" 
                  value={email} 
                  onChange={e=>onEmailChange(e.target.value)} 
                  placeholder="nama@gmail.com" 
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              {email && emailHint && (
                <motion.span 
                  initial={{opacity:0, y:-10}}
                  animate={{opacity:1, y:0}}
                  className={`text-xs font-medium ${isAllowedEmail(email)?'text-emerald-600':'text-amber-600'}`}
                >
                  {emailHint}
                </motion.span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                {t(lang,'login.password')}
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  placeholder="••••••••" 
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Admin Code Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></span>
                {t(lang,'login.adminCode')} 
                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  ({t(lang,'login.optional')})
                </span>
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm" 
                  value={adminCode} 
                  onChange={e=>setAdminCode(e.target.value)} 
                  placeholder="Masukkan kode admin" 
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              {adminCode && adminCode === 'ADMIN-2025' && (
                <motion.div 
                  initial={{opacity:0, scale:0.9}}
                  animate={{opacity:1, scale:1}}
                  className="text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200"
                >
                  ✨ Mode admin akan diaktifkan
                </motion.div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{opacity:0, y:-10}}
                animate={{opacity:1, y:0}}
                className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200 font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button 
              disabled={loading} 
              type="submit" 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-brand-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {loading ? t(lang,'login.processing') : t(lang,'login.loginBtn')}
              </span>
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">{t(lang,'login.or')}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </div>

            {/* Google Button */}
            <motion.button 
              type="button" 
              onClick={handleGoogle} 
              disabled={loading} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full border-2 border-slate-200 hover:border-brand-500 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-brand-50 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Menghubungkan...' : t(lang,'login.google')}
            </motion.button>
            
            {/* Register Link */}
            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Daftar di sini
                </button>
              </p>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed text-center">
              {t(lang,'login.disclaimer')} <br />
              <span className="italic text-[10px] text-slate-500">{t(lang,'login.disclaimerNote')}</span>
            </p>
          </div>
        </motion.form>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 items-center">
          <button type="button" onClick={handleAdminQuickLogin} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm">
            Admin Login Cepat
          </button>
          <button type="button" onClick={handlePasswordlessLogin} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
            Masuk tanpa Password (email terdaftar)
          </button>
        </div>
      </div>

      {/* Features Section */}
      <motion.div 
        initial={{y:40, opacity:0}} 
        whileInView={{y:0, opacity:1}} 
        viewport={{once:true}} 
        transition={{duration:0.8, delay:0.5}}
        className="flex flex-col gap-8"
      >
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-800">Mengapa Portal SSO?</h3>
          <p className="text-slate-600">Nikmati pengalaman autentikasi yang aman, efisien, dan terintegrasi</p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { 
              icon: "🔒", 
              title: "Keamanan", 
              desc: "Autentikasi tunggal menekan risiko kredensial tersebar dan mempermudah kontrol akses.",
              gradient: "from-blue-500 to-cyan-500"
            },
            { 
              icon: "⚡", 
              title: "Efisiensi", 
              desc: "Satu kali login membuka banyak sistem tanpa mengulang autentikasi.",
              gradient: "from-purple-500 to-pink-500"
            },
            { 
              icon: "🔗", 
              title: "Integrasi", 
              desc: "Profil pengguna tunggal konsisten di seluruh layanan internal.",
              gradient: "from-green-500 to-emerald-500"
            },
            { 
              icon: "📊", 
              title: "Monitoring", 
              desc: "Aktivitas tercatat & dapat diaudit terpusat untuk kepatuhan.",
              gradient: "from-orange-500 to-red-500"
            }
          ].map((feature, index) => (
            <motion.div 
              key={feature.title}
              initial={{y:30, opacity:0}} 
              whileInView={{y:0, opacity:1}} 
              viewport={{once:true}} 
              transition={{duration:0.6, delay:0.6 + index * 0.1}}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" 
                   style={{backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`}} />
              
              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-slate-800">{feature.title}</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
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
