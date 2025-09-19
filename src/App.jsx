import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import AdminDashboard from './components/AdminDashboardEnhanced.jsx';
import UnesaDashboard from './components/UnesaDashboard.jsx';
import Stats from './components/Stats.jsx';
import MobileApp from './components/MobileApp.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Profile from './components/Profile.jsx';
import Footer from './components/Footer.jsx';
import AppEmbed from './components/AppEmbed.jsx';
import StatusOverlay from './components/StatusOverlay.jsx';

// Import SSO Core (singleton instance)
import ssoCore from './core/SSOCore.js';
import AuthService from './core/AuthService.js';
import ModuleManager from './core/ModuleManager.js';

// Configure runtime OAuth settings from environment before creating AuthService
try {
  const clientId = import.meta?.env?.VITE_GOOGLE_CLIENT_ID || '';
  if (clientId) {
    ssoCore.config.google.clientId = clientId;
    console.log('[APP] Google Client ID configured from env');
  } else {
    console.warn('[APP] VITE_GOOGLE_CLIENT_ID is empty. Google Sign-In may fail.');
  }
} catch (e) {
  console.warn('[APP] Failed to read VITE_GOOGLE_CLIENT_ID:', e);
}

const authService = new AuthService(ssoCore);
const moduleManager = new ModuleManager(ssoCore);

function App(){
  console.log('[APP] SSO Portal component initialized');
  
  // Legacy state for compatibility
  const [ssoToken, setSsoToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedApp, setSelectedApp] = useState('elearning');
  const [dark, setDark] = useState(false);
  const [immersive, setImmersive] = useState(true);
  const [lang, setLang] = useState('id');
  const [wide, setWide] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  
  // SSO Core state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [availableModules, setAvailableModules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const TOKEN_KEY = 'sso-jwt';
  const refreshTimerRef = useRef(null);
  const moduleContainerRef = useRef(null);

  // Whitelist origin (dev + same-origin)
  const ALLOWED_ORIGINS = [window.location.origin, 'http://localhost:5500'];

  // SSO Event handlers
  useEffect(() => {
    console.log('[APP] Initializing SSO event handlers');
    // Listen to SSO events
    const handleSessionCreated = (event) => {
      const { session } = event.detail || event.data || {};
      if (!session) return;
      setIsAuthenticated(true);
      setUser(session.user);
      setIsAdmin(session.user?.role === 'admin');
      setSsoToken(session.token); // For legacy compatibility
      setAvailableModules(moduleManager.getAvailableModules());
      setLoading(false);
    };

    const handleSessionCleared = () => {
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      setSsoToken(null);
      setAvailableModules([]);
      setImmersive(false);
      setShowAdminDashboard(false);
    };

    const handlePreferencesUpdated = (event) => {
      const prefs = (event.detail && event.detail.preferences) || event.detail || event.data || {};
      setDark(prefs.darkMode || false);
      setWide(prefs.wideLayout || false);
      setLang(prefs.language || 'id');
    };

    const handleModuleLoaded = (event) => {
      console.log('Module loaded:', event.detail.moduleId);
    };

    // Add event listeners
    ssoCore.addEventListener('session_created', handleSessionCreated);
    ssoCore.addEventListener('session_cleared', handleSessionCleared);
    ssoCore.addEventListener('preferences_updated', handlePreferencesUpdated);
    ssoCore.addEventListener('module_loaded', handleModuleLoaded);

    // Initialize SSO
    const initSSO = async () => {
      try {
        // ssoCore is auto-initialized in constructor; ensure preferences loaded
        
        // Check if already authenticated
        if (ssoCore.isAuthenticated()) {
          setIsAuthenticated(true);
          setUser(ssoCore.user);
          setIsAdmin(ssoCore.user.role === 'admin');
          setSsoToken(ssoCore.session.token);
          setAvailableModules(moduleManager.getAvailableModules());
          
          // Load preferences
          const prefs = ssoCore.preferences;
          setDark(prefs.darkMode || false);
          setWide(prefs.wideLayout || false);
          setLang(prefs.language || 'id');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('SSO initialization failed:', error);
        setLoading(false);
      }
    };

  initSSO();
  console.log('[APP] SSO initialization completed');

    // Cleanup
    return () => {
      ssoCore.removeEventListener('session_created', handleSessionCreated);
      ssoCore.removeEventListener('session_cleared', handleSessionCleared);
      ssoCore.removeEventListener('preferences_updated', handlePreferencesUpdated);
      ssoCore.removeEventListener('module_loaded', handleModuleLoaded);
    };
  }, []);

  // Helper decode JWT payload (legacy compatibility)
  function decodePayload(tok){
    try {
      const parts = tok.split('.');
      if(parts.length!==3) return null;
      const json = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
      return json;
    } catch (error) { 
      return null; 
    }
  }

  // Legacy authentication methods (maintained for compatibility)
  async function handleSSOLogin(response) {
    try {
      await authService.handleGoogleResponse(response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async function exitEmbedded() {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // Module loading with new ModuleManager
  async function loadModule(moduleId) {
    if (!moduleContainerRef.current) return;
    
    try {
      setLoading(true);
      await moduleManager.load(moduleId, moduleContainerRef.current);
      setSelectedApp(moduleId);
      setImmersive(true);
    } catch (error) {
      console.error('Failed to load module:', error);
    } finally {
      setLoading(false);
    }
  }

  // Preferences management with SSO Core
  const updatePreferences = (newPrefs) => {
    ssoCore.updatePreferences(newPrefs);
  };

  const toggleDarkMode = () => {
    updatePreferences({ darkMode: !dark });
  };

  const toggleWideLayout = () => {
    updatePreferences({ wideLayout: !wide });
  };

  const changeLanguage = (newLang) => {
    updatePreferences({ language: newLang });
  };

  // Note: handleSSOLogin above kept for compatibility

  function revokeSession(){
    authService.logout();
  }

  // Listen global messages with new SSO Core
  useEffect(()=>{
    function onMessage(e){
      if(!e || !e.data) return;
      if(e.origin && !ALLOWED_ORIGINS.includes(e.origin)) return;
      
      if(e.data.type === 'SSO_LOGOUT'){
        authService.logout();
      } else if(e.data.type === 'SSO_MODULE_MESSAGE'){
        // Forward to module manager
        moduleManager.sendMessage(e.data.targetModule, e.data.message);
      }
    }
    window.addEventListener('message', onMessage);
    return ()=> window.removeEventListener('message', onMessage);
  },[]);

  // Apply dark mode to root
  useEffect(()=>{
    const root = document.documentElement;
    if (dark) root.classList.add('dark'); 
    else root.classList.remove('dark');
  },[dark]);

  function openImmersive(){ setImmersive(true); }
  function minimizeImmersive(){ setImmersive(false); }

  const showLoadingOverlay = loading && !isAuthenticated;

  // Authenticated state with new SSO system
  if (isAuthenticated && user) {
    console.log('[APP] Rendering authenticated dashboard for:', user.email);
    return (
      <>
        <StatusOverlay
          phase={loading ? 'loading' : 'ready'}
          visible={showLoadingOverlay}
          message={loading ? 'Inisialisasi SSO Portal...' : 'Portal siap.'}
        />
        {/* Admin Dashboard Modal */}
        <AnimatePresence>
          {showAdminDashboard && isAdmin && (
            <AdminDashboard
              onClose={() => setShowAdminDashboard(false)}
              currentUser={user}
              ssoCore={ssoCore}
              moduleManager={moduleManager}
            />
          )}
        </AnimatePresence>

        {/* UNESA-style Dashboard */}
        <UnesaDashboard 
          user={user}
          onLogout={() => authService.logout()}
          onOpenAdminDashboard={() => setShowAdminDashboard(true)}
          ssoCore={ssoCore}
          moduleManager={moduleManager}
          availableModules={availableModules}
          onModuleSelect={loadModule}
        />

        {/* Immersive Module View */}
        <AnimatePresence>
          {immersive && (
            <motion.div key="immersive"
              initial={{opacity:0, scale:.98}}
              animate={{opacity:1, scale:1}}
              exit={{opacity:0, scale:.98}}
              transition={{duration:0.35, ease:'easeOut'}}
              className="fixed inset-0 z-[60]"
            >
              <div className="h-full flex flex-col bg-white dark:bg-gray-900">
                {/* Module Header */}
                <div className="flex items-center justify-between p-4 bg-blue-600 dark:bg-blue-800 text-white">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={minimizeImmersive}
                      className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h1 className="text-lg font-semibold">
                      {availableModules.find(m => m.id === selectedApp)?.name || 'Module'}
                    </h1>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleDarkMode}
                      className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      {dark ? '☀️' : '🌙'}
                    </button>
                    <button
                      onClick={() => authService.logout()}
                      className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Module Container */}
                <div 
                  ref={moduleContainerRef}
                  className="flex-1 bg-white dark:bg-gray-900"
                >
                  {loading && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600 dark:text-gray-400">Memuat module...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Registration handling  
  function handleRegistrationSuccess(newUser) {
    console.log('Registration successful:', newUser);
    setShowRegister(false);
  }

  // Landing page for unauthenticated users
  if (showRegister) {
    return (
      <RegisterForm 
        onRegistrationSuccess={handleRegistrationSuccess}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen ${dark ? 'dark' : ''}`}>
      <Navbar 
        dark={dark} 
        setDark={toggleDarkMode} 
        lang={lang} 
        setLang={changeLanguage} 
        isAdmin={false}
        onOpenAdminDashboard={() => {}}
      />
      <main className="flex flex-col gap-24">
        <Hero lang={lang} />
        <section id="login" className="container-section scroll-mt-24">
          <LoginForm 
            onSSOLogin={() => authService.login()} 
            onSwitchToRegister={() => setShowRegister(true)}
            lang={lang}
            authService={authService}
          />
        </section>
        <Stats />
        <MobileApp />
        <Testimonials lang={lang} />
        <Profile lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
