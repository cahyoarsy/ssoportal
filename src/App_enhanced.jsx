import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UltimateLoginPortal from './components/UltimateLoginPortal.jsx';
import ProfessionalDashboard from './components/ProfessionalDashboard.jsx';

// Import components (we'll add them gradually)
// import Navbar from './components/Navbar.jsx';
// import LoginForm from './components/LoginForm.jsx';
// import RegisterForm from './components/RegisterForm.jsx';

function App() {
  console.log('🚀 [APP] Enhanced App function called');
  
  // Basic state management
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  useEffect(() => {
    console.log('🚀 [APP] Enhanced App component mounted');
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handle login/logout
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowLogin(false);
    console.log('User logged in:', userData);
  };
  
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    console.log('User logged out');
  };
  
  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">SSO Portal</h1>
          <p className="text-slate-600 dark:text-slate-400">Memuat aplikasi...</p>
        </motion.div>
      </div>
    );
  }
  
  // Show ultimate login portal if not authenticated
  if (!isAuthenticated) {
    return (
      <UltimateLoginPortal 
        onLogin={handleLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  }

  // Show professional dashboard when authenticated
  return (
    <ProfessionalDashboard 
      user={user}
      onLogout={handleLogout}
      dark={dark}
      setDark={setDark}
    />
  );
}

export default App;