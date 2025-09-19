import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import Navbar from '../components/layout/Navbar';
import ModuleCard from '../components/dashboard/ModuleCard';
import UserProfile from '../components/dashboard/UserProfile';
import QuickStats from '../components/dashboard/QuickStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import DiagnosticPanel from '../components/tools/DiagnosticPanel';

export default function Dashboard({ 
  user, 
  onLogout, 
  ssoCore, 
  moduleManager, 
  authService,
  availableModules, 
  onModuleSelect,
  onOpenAdminDashboard,
  onOpenELearningPage
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  
  // Module handlers
  const handleModuleSelect = (moduleId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('[Dashboard] Module selected:', moduleId);
    if (onModuleSelect) {
      onModuleSelect(moduleId);
    }
  };

  const handleELearningPage = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('[Dashboard] Opening E-Learning page');
    if (onOpenELearningPage) {
      onOpenELearningPage();
    }
  };

  const handleAdminDashboard = () => {
    console.log('[Dashboard] Opening Admin Dashboard');
    if (user?.role === 'admin' && onOpenAdminDashboard) {
      onOpenAdminDashboard();
    } else {
      alert('Akses Admin Dashboard memerlukan role administrator');
    }
  };

  const handleMonitoring = () => {
    console.log('[Dashboard] Opening Monitoring');
    if (user?.role === 'admin') {
      handleModuleSelect('monitoring');
    } else {
      alert('Akses Monitoring memerlukan role administrator');
    }
  };

  const handleProfile = () => {
    console.log('[Dashboard] Opening Profile');
    setShowProfile(true);
  };

  // Quick Actions handlers
  const handleDownloadCertificate = () => {
    console.log('[Dashboard] Download Certificate');
    // TODO: Implement certificate download
    alert('Fitur download sertifikat akan segera tersedia');
  };

  const handleViewProgress = () => {
    console.log('[Dashboard] View Progress');
    // TODO: Implement progress view
    alert('Fitur lihat progress akan segera tersedia');
  };

  const handleSettings = () => {
    console.log('[Dashboard] Settings');
    // TODO: Implement settings
    alert('Fitur pengaturan akan segera tersedia');
  };
  
  // Update time and greeting
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      const hour = now.getHours();
      
      let greetingText = '';
      if (hour < 12) greetingText = 'Selamat Pagi';
      else if (hour < 15) greetingText = 'Selamat Siang';
      else if (hour < 18) greetingText = 'Selamat Sore';
      else greetingText = 'Selamat Malam';
      
      setCurrentTime(timeStr);
      setGreeting(greetingText);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SSO</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Sangsongko Engineering
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {greeting}, {user?.name || 'User'}
                </p>
              </div>
            </div>

            {/* Time & User Actions */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentTime}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <UserProfile user={user} onLogout={onLogout} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white"
          >
            <h2 className="text-2xl font-bold mb-2">
              {greeting}, {user?.name}! 👋
            </h2>
            <p className="text-blue-100">
              Selamat datang di Sangsongko Engineering. Pilih aplikasi yang ingin Anda akses.
            </p>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <QuickStats user={user} availableModules={availableModules} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Modules Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                📚 Aplikasi Tersedia
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* E-Learning Module */}
                <ModuleCard
                  title="E-Learning TITL"
                  description="Portal pembelajaran kurikulum TITL SMK"
                  icon="🎓"
                  color="from-blue-500 to-blue-600"
                  onClick={handleELearningPage}
                />
                
                {/* Admin Dashboard */}
                {user?.role === 'admin' && (
                  <ModuleCard
                    title="Admin Dashboard"
                    description="Kelola sistem dan pengguna"
                    icon="⚙️"
                    color="from-purple-500 to-purple-600"
                    onClick={handleAdminDashboard}
                  />
                )}
                
                {/* Monitoring */}
                <ModuleCard
                  title="Monitoring"
                  description="Pantau aktivitas sistem"
                  icon="📊"
                  color="from-green-500 to-green-600"
                  onClick={handleMonitoring}
                  disabled={user?.role !== 'admin'}
                />

                {/* Profile Management */}
                <ModuleCard
                  title="Profil Saya"
                  description="Kelola profil pengguna"
                  icon="👤"
                  color="from-orange-500 to-orange-600"
                  onClick={handleProfile}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <RecentActivity user={user} />
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ⚡ Aksi Cepat
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={handleDownloadCertificate}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  📄 Unduh Sertifikat
                </button>
                <button 
                  onClick={handleViewProgress}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  📊 Lihat Progress
                </button>
                <button 
                  onClick={handleSettings}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  🔧 Pengaturan
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Diagnostic Panel - Development Tool */}
      <DiagnosticPanel
        ssoCore={ssoCore}
        moduleManager={moduleManager}
        authService={authService}
        onModuleSelect={onModuleSelect}
        user={user}
        availableModules={availableModules}
      />

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 m-4 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  👤 Profil Pengguna
                </h3>
                <button
                  onClick={() => setShowProfile(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <img
                    src={user?.profileImage || '/profile.jpg'}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto mb-3"
                  />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {user?.name || 'User'}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email || 'email@example.com'}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {user?.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </div>
                
                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Login Terakhir:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Status:</span>
                      <p className="font-medium text-green-600 dark:text-green-400">
                        Aktif
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t dark:border-gray-700 pt-4">
                  <button
                    onClick={onLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}