import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedPortalSystem = ({ onLogin }) => {
  const [activePanel, setActivePanel] = useState('intro');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

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

  // Photo slideshow data
  const photoSlides = [
    {
      url: "/profile.jpg",
      title: "Developer Profile",
      description: "Cahyo Arsy - Full Stack Developer"
    },
    {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      title: "Modern Development Environment",
      description: "Building scalable web applications with modern tools"
    },
    {
      url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
      title: "Technology Stack",
      description: "React, Node.js, Firebase ecosystem and cloud technologies"
    },
    {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      title: "System Architecture",
      description: "Enterprise-grade solutions and scalable infrastructure"
    },
    {
      url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=600&fit=crop",
      title: "Code Development",
      description: "Writing clean, maintainable code with best practices"
    },
    {
      url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
      title: "Team Collaboration",
      description: "Working together to build amazing digital experiences"
    }
  ];

  // Auto-rotate background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate photos
  useEffect(() => {
    if (activePanel === 'photos') {
      const interval = setInterval(() => {
        setCurrentPhoto((prev) => (prev + 1) % photoSlides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activePanel]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const currentBg = backgroundSlides[currentSlide];

  const panels = [
    { id: 'intro', label: 'Web Introduction', icon: '🌐' },
    { id: 'login', label: 'Login', icon: '🔐' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'photos', label: 'Gallery', icon: '📸' }
  ];

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
            transition={{ duration: 1.2 }}
            className={`absolute inset-0 bg-gradient-to-br ${currentBg.gradient}`}
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Left Panel - Branding & Info */}
      <div className="hidden lg:flex lg:w-2/5 relative z-10 flex-col justify-center p-12 text-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-7xl mb-8">{currentBg.icon}</div>
          <h1 className="text-6xl font-bold mb-6 leading-tight">{currentBg.title}</h1>
          <h2 className="text-3xl font-light mb-8 text-blue-100">{currentBg.subtitle}</h2>
          <p className="text-xl text-blue-50 mb-12 leading-relaxed max-w-lg">
            {currentBg.description}
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse" />
              <span className="text-blue-100 text-lg">Single Sign-On (SSO) Integration</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse" />
              <span className="text-blue-100 text-lg">Multi-platform Access</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse" />
              <span className="text-blue-100 text-lg">Advanced Analytics & Monitoring</span>
            </div>
          </div>

          <div className="flex space-x-3 mt-16">
            {backgroundSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Multi-Panel System */}
      <div className="w-full lg:w-3/5 relative z-10 flex flex-col">
        
        {/* Panel Navigation */}
        <div className="flex justify-center pt-8 px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
            <div className="flex space-x-2">
              {panels.map((panel) => (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activePanel === panel.id
                      ? 'bg-white text-gray-800 shadow-lg scale-105'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{panel.icon}</span>
                  <span className="font-medium text-sm hidden sm:block">{panel.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {/* Web Introduction Panel */}
              {activePanel === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30"
                >
                  <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🌐</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Portal SSO Terpadu</h2>
                    <p className="text-gray-600 text-lg">Selamat datang di sistem autentikasi modern</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
                      <div className="text-3xl mb-3">🚀</div>
                      <h3 className="font-bold text-gray-900 mb-2">Modern Technology</h3>
                      <p className="text-gray-700 text-sm">Built with React 18, Vite, Firebase, dan teknologi web terdepan</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl">
                      <div className="text-3xl mb-3">🎓</div>
                      <h3 className="font-bold text-gray-900 mb-2">E-Learning Integration</h3>
                      <p className="text-gray-700 text-sm">Akses seamless ke platform pembelajaran digital</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl">
                      <div className="text-3xl mb-3">📊</div>
                      <h3 className="font-bold text-gray-900 mb-2">Real-time Analytics</h3>
                      <p className="text-gray-700 text-sm">Dashboard monitoring dan analitik komprehensif</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
                      <div className="text-3xl mb-3">🔐</div>
                      <h3 className="font-bold text-gray-900 mb-2">Enterprise Security</h3>
                      <p className="text-gray-700 text-sm">Keamanan tingkat enterprise dengan enkripsi end-to-end</p>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setActivePanel('login')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Mulai Login →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Login Panel */}
              {activePanel === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30"
                >
                  <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🔐</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your portal account</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="your.email@domain.com"
                          required
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          📧
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter your password"
                          required
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          🔒
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
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

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      <span className="text-2xl mr-2">🔵</span>
                      Google
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      <span className="text-2xl mr-2">⚫</span>
                      GitHub
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Profile Panel */}
              {activePanel === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30"
                >
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      CA
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Cahyo Arsy</h2>
                    <p className="text-gray-600 text-lg">Full Stack Developer & System Architect</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                        <span className="text-2xl mr-2">🚀</span>
                        Portal SSO Project
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Advanced Single Sign-On portal with React, Firebase, and modern authentication systems.
                        Features include multi-platform integration, real-time analytics, and enterprise-grade security.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                        <span className="text-2xl mr-2">💼</span>
                        Skills & Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'Node.js', 'Firebase', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Docker', 'AWS'].map(skill => (
                          <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                        <span className="text-2xl mr-2">📚</span>
                        Experience
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Full Stack Development</span>
                          <span className="text-blue-600 font-semibold">5+ Years</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">System Architecture</span>
                          <span className="text-blue-600 font-semibold">3+ Years</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">DevOps & Cloud</span>
                          <span className="text-blue-600 font-semibold">2+ Years</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <a
                        href="/cv.pdf"
                        target="_blank"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl text-center hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
                      >
                        📄 Download CV
                      </a>
                      <button
                        onClick={() => setActivePanel('photos')}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold shadow-lg"
                      >
                        📸 View Gallery
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Photo Gallery Panel */}
              {activePanel === 'photos' && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30"
                >
                  <div className="text-center mb-8">
                    <div className="text-5xl mb-4">📸</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Photo Gallery</h2>
                    <p className="text-gray-600">Developer journey and workspace</p>
                  </div>

                  <div className="relative">
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-lg mb-6">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentPhoto}
                          src={photoSlides[currentPhoto].url}
                          alt={photoSlides[currentPhoto].title}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.8 }}
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>
                    </div>

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {photoSlides[currentPhoto].title}
                      </h3>
                      <p className="text-gray-600">
                        {photoSlides[currentPhoto].description}
                      </p>
                    </div>

                    <div className="flex justify-center space-x-4 mb-6">
                      <button
                        onClick={() => setCurrentPhoto((prev) => prev === 0 ? photoSlides.length - 1 : prev - 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full transition-colors"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setCurrentPhoto((prev) => (prev + 1) % photoSlides.length)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full transition-colors"
                      >
                        →
                      </button>
                    </div>

                    <div className="flex justify-center space-x-2">
                      {photoSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhoto(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentPhoto ? 'bg-blue-600 scale-110' : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-white/80">
          <p className="text-sm">© 2025 Portal SSO. Developed by Cahyo Arsy</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPortalSystem;