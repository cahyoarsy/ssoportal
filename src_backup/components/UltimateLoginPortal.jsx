import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UltimateLoginPortal = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const [error, setError] = useState('');
  const [currentBg, setCurrentBg] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Dynamic backgrounds
  const backgrounds = [
    {
      name: 'Aurora',
      gradient: 'from-purple-400 via-pink-500 to-red-500',
      pattern: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)'
    },
    {
      name: 'Ocean',
      gradient: 'from-blue-400 via-cyan-500 to-teal-500',
      pattern: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.3) 0%, transparent 50%)'
    },
    {
      name: 'Sunset',
      gradient: 'from-orange-400 via-red-500 to-pink-500',
      pattern: 'radial-gradient(circle at 70% 30%, rgba(251, 146, 60, 0.3) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(244, 63, 94, 0.3) 0%, transparent 50%)'
    },
    {
      name: 'Forest',
      gradient: 'from-green-400 via-emerald-500 to-cyan-500',
      pattern: 'radial-gradient(circle at 60% 40%, rgba(34, 197, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)'
    }
  ];

  // Auto-change background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const userData = {
        name: 'Cahyo Arsy',
        email: formData.email,
        role: formData.email.includes('admin') ? 'admin' : 'user',
        avatar: '/profile.jpg',
        lastLogin: new Date().toISOString(),
        permissions: ['dashboard', 'elearning', 'profile']
      };

      onLogin(userData);
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      const userData = {
        name: 'Cahyo Arsy',
        email: `user@${provider}.com`,
        role: 'user',
        avatar: '/profile.jpg',
        provider: provider,
        lastLogin: new Date().toISOString()
      };
      onLogin(userData);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 2 }}
            className={`absolute inset-0 bg-gradient-to-br ${backgrounds[currentBg].gradient}`}
          />
        </AnimatePresence>
        
        {/* Animated Pattern Overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: backgrounds[currentBg].pattern,
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        />
        
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, Math.random() * 0.5 + 0.8, 1],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-lg text-center"
          >
            {/* Logo Animation */}
            <motion.div
              className="relative mb-12"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <motion.div
                  className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl"
                  animate={{ 
                    rotate: [0, 360],
                    borderRadius: ["30%", "50%", "30%"]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
                <div className="absolute inset-4 bg-white/30 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                  <motion.span 
                    className="text-4xl"
                    animate={{ rotate: [0, -360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    🚀
                  </motion.span>
                </div>
              </div>
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              <motion.span
                className="inline-block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Portal SSO
              </motion.span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Sistem autentikasi modern dengan teknologi terdepan untuk 
              pengalaman pengguna yang seamless dan aman.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: '🔐', text: 'Secure SSO' },
                { icon: '🎓', text: 'E-Learning' },
                { icon: '📊', text: 'Analytics' },
                { icon: '🌐', text: 'Multi-Platform' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30"
                >
                  <span className="text-white text-sm font-medium">
                    {feature.icon} {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Background Selector */}
            <div className="flex justify-center space-x-3">
              {backgrounds.map((bg, index) => (
                <button
                  key={bg.name}
                  onClick={() => setCurrentBg(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentBg 
                      ? 'bg-white scale-125 shadow-lg' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  title={bg.name}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-md"
          >
            
            {/* Login Card */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden">
              
              {/* Card Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>

              {/* Header */}
              <div className="relative text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto mb-4 flex items-center justify-center"
                >
                  <span className="text-2xl">🔐</span>
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-white/80">Sign in to continue your journey</p>
              </div>

              {/* Login Method Toggle */}
              <div className="relative mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setLoginMethod('email')}
                      className={`relative py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                        loginMethod === 'email'
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <span className="relative z-10">📧 Email</span>
                    </button>
                    <button
                      onClick={() => setLoginMethod('phone')}
                      className={`relative py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                        loginMethod === 'phone'
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <span className="relative z-10">📱 Phone</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 px-4 py-3 rounded-2xl mb-6"
                  >
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email/Phone Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-white font-medium mb-2">
                    {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <input
                      type={loginMethod === 'email' ? 'email' : 'tel'}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                      placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter phone number'}
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                      {loginMethod === 'email' ? '📧' : '📱'}
                    </div>
                  </div>
                </motion.div>

                {/* Password Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <label className="block text-white font-medium mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pl-12 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                      placeholder="Enter your password"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                      🔒
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>
                </motion.div>

                {/* Remember Me & Forgot Password */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center text-white/80">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="rounded border-white/20 bg-white/10 text-white focus:ring-white/30 mr-2"
                    />
                    <span className="text-sm">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                </motion.div>

                {/* Login Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white py-4 px-4 rounded-2xl font-semibold hover:bg-white/30 focus:ring-4 focus:ring-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 relative overflow-hidden group"
                >
                  {/* Button Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span className="relative z-10">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Sign In</span>
                      <motion.span
                        className="relative z-10"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="relative my-8"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-transparent px-4 text-white/60 text-sm">Or continue with</span>
                </div>
              </motion.div>

              {/* Social Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="grid grid-cols-2 gap-4 mb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-white group"
                >
                  <span className="text-lg mr-2 group-hover:scale-110 transition-transform">🔵</span>
                  <span className="font-medium">Google</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialLogin('github')}
                  className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-white group"
                >
                  <span className="text-lg mr-2 group-hover:scale-110 transition-transform">⚫</span>
                  <span className="font-medium">GitHub</span>
                </motion.button>
              </motion.div>

              {/* Register Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-center"
              >
                <span className="text-white/60 text-sm">Don't have an account? </span>
                <button
                  onClick={onSwitchToRegister}
                  className="text-white hover:text-white/80 font-semibold text-sm underline decoration-white/30 hover:decoration-white/60 transition-all duration-300"
                >
                  Sign up here
                </button>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center mt-8"
            >
              <p className="text-white/60 text-sm">
                © 2025 Portal SSO. Developed with ❤️ by Cahyo Arsy
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UltimateLoginPortal;