import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROGRAM_SHORT } from '../branding.js';
import { t } from '../langResources.js';
import { canUseDevMaster, buildMockJWT, isAdminEmail } from '../authHelpers.js';
import { buildGoogleAuthUrl, randomState, generateRandomString, createCodeChallenge } from '../oauthHelpers';
import { loginUser, emailExists, getRegisteredEmails } from '../authStorage';

export default function LoginFormEnhanced({ onSSOLogin, onSwitchToRegister, lang='id', authService }){
  // Basic form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Enhanced features
  const [showPassword, setShowPassword] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  // Email suggestions
  const [usedEmails, setUsedEmails] = useState([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  
  const EMAIL_STORE_KEY = 'used-emails';

  useEffect(() => {
    loadEmailSuggestions();
    checkLoginAttempts();
  }, []);

  const loadEmailSuggestions = () => {
    try {
      const registeredEmails = getRegisteredEmails();
      setUsedEmails(registeredEmails);
      
      const raw = localStorage.getItem(EMAIL_STORE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const oldEmails = arr.filter(e => typeof e === 'string');
          const allEmails = [...new Set([...registeredEmails, ...oldEmails])];
          setUsedEmails(allEmails);
        }
      }
    } catch (error) {
      console.error('Failed to load email suggestions:', error);
    }
  };

  const checkLoginAttempts = () => {
    const attempts = localStorage.getItem('login_attempts') || 0;
    setLoginAttempts(parseInt(attempts));
  };

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return Math.min(strength, 100);
  };

  const handleMFAVerification = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setError('Please enter valid 6-digit MFA code');
      return;
    }
    
    setLoading(true);
    try {
      // Mock MFA verification
      if (mfaCode === '123456') {
        setSuccess('MFA verification successful!');
        setTimeout(() => {
          handleSuccessfulLogin({ email, method: 'mfa' });
        }, 1000);
      } else {
        setError('Invalid MFA code. Please try again.');
      }
    } catch (error) {
      setError('MFA verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Check if user exists
      const userExists = await emailExists(email);
      if (!userExists) {
        throw new Error('Invalid email or password');
      }
      
      // Attempt login
  const loginResult = await loginUser(email, password);
      
      if (loginResult.requiresMFA) {
        setMfaRequired(true);
        setLoading(false);
        return;
      }
      
      // Check for admin
      if (adminCode && isAdminEmail(email)) {
        if (adminCode !== 'admin123') {
          throw new Error('Invalid admin code');
        }
      }
      
      // Success
      setSuccess('Login successful!');
      saveEmailToHistory(email);
      clearFailedAttempts();
      
      setTimeout(() => {
        handleSuccessfulLogin(loginResult);
        try {
          // If SSOCore is present, create a core session for module integration
          if (window.SSOCore && typeof window.SSOCore.createSessionFromLocal === 'function') {
            window.SSOCore.createSessionFromLocal({
              email: loginResult.user?.email || email,
              role: loginResult.user?.role || (isAdminEmail(email) ? 'admin' : 'user'),
              name: loginResult.user?.fullName,
              provider: 'local'
            });
          }
        } catch (e) {
          console.warn('[Login] Failed to notify SSOCore:', e);
        }
      }, 500);
      
    } catch (error) {
      handleFailedLogin(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFailedLogin = (errorMsg) => {
    const attempts = loginAttempts + 1;
    setLoginAttempts(attempts);
    localStorage.setItem('login_attempts', attempts.toString());
    setError(errorMsg);
  };

  const handleSuccessfulLogin = (loginData) => {
    if (onSSOLogin) {
      onSSOLogin(loginData.token || buildMockJWT(email, isAdminEmail(email)));
    }
  };

  const clearFailedAttempts = () => {
    localStorage.removeItem('login_attempts');
    setLoginAttempts(0);
  };

  const saveEmailToHistory = (email) => {
    try {
      const existing = JSON.parse(localStorage.getItem(EMAIL_STORE_KEY) || '[]');
      const updated = [email, ...existing.filter(e => e !== email)].slice(0, 10);
      localStorage.setItem(EMAIL_STORE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save email history:', error);
    }
  };

  const filteredEmailSuggestions = usedEmails
    .filter(e => e.toLowerCase().includes(email.toLowerCase()))
    .slice(0, 5);

  const passwordStrength = calculatePasswordStrength(password);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-2xl">🔐</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Enhanced Login</h2>
          <p className="text-blue-100">Secure access to {PROGRAM_SHORT}</p>
        </div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm"
            >
              🚨 {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-sm"
            >
              ✅ {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MFA Step */}
        <AnimatePresence>
          {mfaRequired && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Multi-Factor Authentication</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                    maxLength="6"
                  />
                </div>
                
                <button
                  onClick={handleMFAVerification}
                  disabled={loading || mfaCode.length !== 6}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Login Form */}
        {!mfaRequired && (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-blue-100 mb-2">
                📧 Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowEmailSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowEmailSuggestions(email.length > 0)}
                  onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 200)}
                  placeholder="your.email@unesa.ac.id"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                
                {/* Email Suggestions */}
                <AnimatePresence>
                  {showEmailSuggestions && filteredEmailSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden z-50"
                    >
                      {filteredEmailSuggestions.map((suggestedEmail, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setEmail(suggestedEmail);
                            setShowEmailSuggestions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                        >
                          {suggestedEmail}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-blue-100 mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-200">Strength:</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength < 25 ? 'bg-red-500' :
                          passwordStrength < 50 ? 'bg-yellow-500' :
                          passwordStrength < 75 ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <span className={`text-xs ${
                      passwordStrength < 25 ? 'text-red-300' :
                      passwordStrength < 50 ? 'text-yellow-300' :
                      passwordStrength < 75 ? 'text-blue-300' :
                      'text-green-300'
                    }`}>
                      {passwordStrength < 25 ? 'Weak' :
                       passwordStrength < 50 ? 'Fair' :
                       passwordStrength < 75 ? 'Good' :
                       'Strong'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Code (conditional) */}
            {isAdminEmail(email) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="relative"
              >
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  👨‍💼 Admin Code
                </label>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin verification code"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </motion.div>
            )}

            {/* Security Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-blue-200">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded"
                  />
                  <span>Remember this device</span>
                </label>
                
                <button
                  type="button"
                  className="text-sm text-blue-300 hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In Securely'
              )}
            </button>
          </form>
        )}

        {/* Register Link */}
        <div className="mt-8 text-center">
          <button
            onClick={onSwitchToRegister}
            className="text-blue-300 hover:text-white transition-colors text-sm"
          >
            Don't have an account? <span className="font-semibold">Register here</span>
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center justify-center gap-4 text-xs text-blue-300">
            <span className="flex items-center gap-1">
              <span>🔒</span>
              <span>SSL Secured</span>
            </span>
            <span className="flex items-center gap-1">
              <span>🛡️</span>
              <span>MFA Ready</span>
            </span>
            <span className="flex items-center gap-1">
              <span>✅</span>
              <span>Enhanced Security</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}