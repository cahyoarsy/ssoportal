import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserProfile } from '../authStorage';

export default function ProfileViewer({ user, onClose }) {
  const [activeTab, setActiveTab] = useState('info');
  const userProfile = getUserProfile() || user;
  
  // Function to get user's profile image or fallback
  function getProfileImage() {
    const profileImage = userProfile?.profileImage;
    if (profileImage && typeof profileImage === 'string' && profileImage.startsWith('data:')) {
      // Base64 encoded image from upload
      return profileImage;
    }
    // Try public profile.jpg
    return '/profile.jpg';
  }

  // Function to handle image error
  function handleImageError(e) {
    console.log('Image failed to load:', e.target.src);
    e.target.style.display = 'none';
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = 'flex';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src={getProfileImage()} 
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white border-opacity-30"
                onError={handleImageError}
              />
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center border-4 border-white border-opacity-30" style={{display: 'none'}}>
                <span className="text-white text-3xl font-bold">
                  {userProfile?.fullName?.charAt(0).toUpperCase() || user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{user?.fullName}</h2>
              <p className="text-purple-100">{user?.email}</p>
              <div className="mt-2">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  user?.role === 'admin' 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Mahasiswa'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Informasi
            </button>
            <button
              onClick={() => setActiveTab('cv')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cv'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              CV & Portfolio
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Aktivitas
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard title="Email" value={user?.email} icon="✉️" />
                <InfoCard title="Role" value={user?.role === 'admin' ? 'Administrator' : 'Mahasiswa'} icon="👤" />
                <InfoCard title="Status" value="Active" icon="🟢" />
                <InfoCard title="Bergabung" value={new Date(user?.createdAt || Date.now()).toLocaleDateString('id-ID')} icon="📅" />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                <p className="text-gray-600 text-sm">
                  {userProfile?.bio || (userProfile?.role === 'admin' 
                    ? 'Administrator sistem dengan akses penuh untuk mengelola pengguna dan sistem informasi. Bertanggung jawab atas keamanan, monitoring, dan maintenance platform SSO Portal.'
                    : 'Mahasiswa aktif yang menggunakan sistem informasi terintegrasi untuk kebutuhan akademik dan administrasi. Memiliki akses ke berbagai aplikasi pembelajaran dan layanan kampus.'
                  )}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cv' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📄</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Curriculum Vitae</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Download CV untuk melihat riwayat pendidikan dan pengalaman lengkap.
                </p>
                <a 
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
                >
                  <span>📥</span>
                  <span>Download CV (PDF)</span>
                </a>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Portfolio Highlights</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">1</span>
                    <span className="text-sm text-gray-700">SSO Portal System - Authentication & Authorization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">2</span>
                    <span className="text-sm text-gray-700">E-Learning Platform Integration - React & Node.js</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">3</span>
                    <span className="text-sm text-gray-700">Admin Dashboard & Analytics - Data Visualization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">4</span>
                    <span className="text-sm text-gray-700">Google OAuth Integration - Security Implementation</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technology Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React.js</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Node.js</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">JavaScript</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Tailwind CSS</span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Vite</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">OAuth 2.0</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">PKCE</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">REST API</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recent Achievements</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-sm text-gray-700">Successfully implemented enterprise-grade SSO system with Google OAuth integration</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span className="text-sm text-gray-700">Developed comprehensive admin dashboard with real-time analytics and monitoring</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <span className="text-sm text-gray-700">Built responsive UI/UX matching university portal standards (UNESA-style)</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span className="text-sm text-gray-700">Implemented secure profile management with role-based access control</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <ActivityItem 
                icon="🔐"
                title="SSO Authentication Implemented"
                time="Today"
                description="Successfully deployed Google OAuth 2.0 with PKCE security protocol"
              />
              <ActivityItem 
                icon="👤"
                title="Profile System Enhanced"
                time="Yesterday"
                description="Added professional profile management with image upload functionality"
              />
              <ActivityItem 
                icon="📊"
                title="Admin Dashboard Deployed"
                time="2 days ago"
                description="Built comprehensive analytics dashboard with real-time monitoring"
              />
              <ActivityItem 
                icon="�"
                title="UNESA UI Implementation"
                time="3 days ago"
                description="Recreated university portal interface with responsive design"
              />
              <ActivityItem 
                icon="🔧"
                title="Component Architecture"
                time="1 week ago"
                description="Developed modular React component system with reusable UI elements"
              />
              <ActivityItem 
                icon="⚡"
                title="Performance Optimization"
                time="1 week ago"
                description="Optimized build size and implemented lazy loading for better UX"
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoCard({ title, value, icon }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, time, description }) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}