import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfessionalLoginPortal = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const [error, setError] = useState('');
  const [activePanel, setActivePanel] = useState('login');

  // Background carousel data
  const backgroundSlides = [
    {
      title: "Portal SSO Terpadu",
      subtitle: "Sistem Autentikasi Profesional",
      description: "Platform terintegrasi untuk manajemen pembelajaran dan administrasi",
      gradient: "from-blue-600 via-purple-600 to-indigo-800",
      icon: "🚀"
    },
    {
      title: "E-Learning Management",
      subtitle: "Pembelajaran Digital Modern",
      description: "Akses ke seluruh modul pembelajaran dengan satu akun",
      gradient: "from-emerald-600 via-teal-600 to-cyan-800",
      icon: "🎓"
    },
    {
      title: "Analytics & Dashboard",
      subtitle: "Monitoring Real-time",
      description: "Dashboard analitik untuk tracking progress dan performa",
      gradient: "from-orange-600 via-red-600 to-pink-800",
      icon: "📊"
    },
    {
      title: "Secure & Reliable",
      subtitle: "Keamanan Tingkat Enterprise",
      description: "Enkripsi end-to-end dan sistem keamanan berlapis",
      gradient: "from-slate-600 via-gray-600 to-zinc-800",
      icon: "🔐"
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length);
    }, 5000);
    return () => clearInterval(interval);
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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

  const currentBg = backgroundSlides[currentSlide];

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 bg-gradient-to-br ${currentBg.gradient}`}
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center p-12 text-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-6xl mb-6">{currentBg.icon}</div>
          <h1 className="text-5xl font-bold mb-4">{currentBg.title}</h1>
          <h2 className="text-2xl font-light mb-6 text-blue-100">{currentBg.subtitle}</h2>
          <p className="text-lg text-blue-50 mb-8 leading-relaxed max-w-lg">
            {currentBg.description}
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span className="text-blue-100">Single Sign-On (SSO) Integration</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span className="text-blue-100">Multi-platform Access</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span className="text-blue-100">Advanced Analytics</span>
            </div>
          </div>

          <div className="flex space-x-2 mt-12">
            {backgroundSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Sliding Login & Profile */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-8">
        <div className="w-full max-w-md relative overflow-hidden">
          
          {/* Panel Container */}
          <motion.div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(${activePanel === 'profile' ? '-50%' : '0%'})`,
              width: '200%'
            }}
          >
            
            {/* Login Panel */}
            <div className="w-1/2 flex-shrink-0 pr-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full"
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                  
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">🚀</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600 text-sm">Sign in to your portal account</p>
                  </div>

                  {/* Panel Navigation */}
                  <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                    <button
                      onClick={() => setActivePanel('login')}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                        activePanel === 'login' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      🔐 Login
                    </button>
                    <button
                      onClick={() => setActivePanel('profile')}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                        activePanel === 'profile' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      👤 Profile
                    </button>
                  </div>

                  {/* Login Method Tabs */}
                  <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                    <button
                      onClick={() => setLoginMethod('email')}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                        loginMethod === 'email' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      📧 Email
                    </button>
                    <button
                      onClick={() => setLoginMethod('phone')}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                        loginMethod === 'phone' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      📱 Phone
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Email/Phone Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                      </label>
                      <div className="relative">
                        <input
                          type={loginMethod === 'email' ? 'email' : 'tel'}
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          placeholder={loginMethod === 'email' ? 'your.email@domain.com' : '+62 812 3456 7890'}
                          required
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          {loginMethod === 'email' ? '📧' : '📱'}
                        </div>
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          placeholder="Enter your password"
                          required
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          🔒
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-xs text-gray-600">Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => handleSocialLogin('google')}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <span className="text-lg mr-2">🔵</span>
                      Google
                    </button>
                    <button
                      onClick={() => handleSocialLogin('github')}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <span className="text-lg mr-2">⚫</span>
                      GitHub
                    </button>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <span className="text-gray-600 text-xs">Don't have an account? </span>
                    <button
                      onClick={onSwitchToRegister}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Profile Panel */}
            <div className="w-1/2 flex-shrink-0 pl-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full"
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                  
                  {/* Profile Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                      CA
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Cahyo Arsy</h3>
                    <p className="text-gray-600 text-sm">Full Stack Developer & System Architect</p>
                  </div>

                  {/* Panel Navigation */}
                  <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                    <button
                      onClick={() => setActivePanel('login')}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                        activePanel === 'login' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      🔐 Login
                    </button>
                    <button
                      onClick={() => setActivePanel('profile')}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                        activePanel === 'profile' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      👤 Profile
                    </button>
                  </div>

                  {/* Profile Content */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2 text-sm">🚀 Portal SSO Project</h5>
                      <p className="text-gray-700 text-xs leading-relaxed">
                        Advanced Single Sign-On portal with React, Firebase, and modern authentication systems.
                        Features include multi-platform integration, real-time analytics, and enterprise-grade security.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2 text-sm">💼 Skills & Technologies</h5>
                      <div className="flex flex-wrap gap-1">
                        {['React', 'Node.js', 'Firebase', 'TypeScript', 'Tailwind CSS', 'MongoDB'].map(skill => (
                          <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2 text-sm">📚 Experience</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-700">Full Stack Development</span>
                          <span className="text-xs text-blue-600 font-medium">5+ Years</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-700">System Architecture</span>
                          <span className="text-xs text-blue-600 font-medium">3+ Years</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-700">DevOps & Cloud</span>
                          <span className="text-xs text-blue-600 font-medium">2+ Years</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <a
                        href="/cv.pdf"
                        target="_blank"
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-center hover:bg-blue-700 transition-colors text-xs font-medium"
                      >
                        📄 Download CV
                      </a>
                      <button
                        onClick={() => setActivePanel('login')}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-400 transition-colors text-xs font-medium"
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white/80 text-xs">
          <p>© 2025 Portal SSO. Developed by Cahyo Arsy</p>
          <button
            onClick={() => setActivePanel('profile')}
            className="text-blue-200 hover:text-white underline mt-1"
          >
            View Developer Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLoginPortal;