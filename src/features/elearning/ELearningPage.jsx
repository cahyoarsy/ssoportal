import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IMLPage from '../iml/IMLPage';

export default function ELearningPage({ 
  user, 
  onBack, 
  onModuleSelect,
  onOpenIMLPage,
  moduleManager 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modul E-Learning sesuai kurikulum TITL SMK
  const elearningModules = [
    // Instalasi Motor Listrik (IML)
    {
      id: 'elearning-iml',
      title: 'Instalasi Motor Listrik (IML)',
      description: 'Pemasangan dan pengoperasian motor listrik 3 fasa',
      category: 'instalasi',
      icon: '⚡',
      color: 'from-blue-500 to-blue-600',
      level: 'Menengah',
      duration: '40 jam',
      modules: ['Dasar Motor Listrik', 'Rangkaian Kontrol', 'Troubleshooting']
    },
    // Instalasi Tenaga Listrik (ITL)
    {
      id: 'elearning-itl',
      title: 'Instalasi Tenaga Listrik (ITL)',
      description: 'Instalasi sistem tenaga listrik gedung dan industri',
      category: 'instalasi',
      icon: '🏢',
      color: 'from-green-500 to-green-600',
      level: 'Lanjutan',
      duration: '60 jam',
      modules: ['Panel Listrik', 'Grounding System', 'Load Calculation']
    },
    // Gambar Teknik Listrik (GAMTEK)
    {
      id: 'elearning-gamtek',
      title: 'Gambar Teknik Listrik (GAMTEK)',
      description: 'Membaca dan membuat gambar teknik instalasi listrik',
      category: 'gambar-teknik',
      icon: '📐',
      color: 'from-purple-500 to-purple-600',
      level: 'Dasar',
      duration: '36 jam',
      modules: ['Simbol Listrik', 'Single Line Diagram', 'Wiring Diagram']
    },
    // Pemeliharaan Listrik
    {
      id: 'elearning-pemeliharaan',
      title: 'Pemeliharaan Listrik',
      description: 'Maintenance dan troubleshooting sistem listrik',
      category: 'pemeliharaan',
      icon: '🔧',
      color: 'from-orange-500 to-orange-600',
      level: 'Menengah',
      duration: '45 jam',
      modules: ['Preventive Maintenance', 'Corrective Maintenance', 'Predictive Maintenance']
    },
    // Sistem Kendali Elektronik
    {
      id: 'elearning-kendali',
      title: 'Sistem Kendali Elektronik',
      description: 'Kontrol otomatis menggunakan PLC dan mikrokontroler',
      category: 'kendali',
      icon: '🎛️',
      color: 'from-red-500 to-red-600',
      level: 'Lanjutan',
      duration: '50 jam',
      modules: ['PLC Programming', 'HMI Design', 'SCADA System']
    },
    // Instalasi Penerangan
    {
      id: 'elearning-penerangan',
      title: 'Instalasi Penerangan',
      description: 'Sistem penerangan dalam dan luar gedung',
      category: 'instalasi',
      icon: '💡',
      color: 'from-yellow-500 to-yellow-600',
      level: 'Dasar',
      duration: '35 jam',
      modules: ['Jenis Lampu', 'Perhitungan Pencahayaan', 'Smart Lighting']
    },
    // Proteksi Sistem Tenaga
    {
      id: 'elearning-proteksi',
      title: 'Proteksi Sistem Tenaga',
      description: 'Sistem proteksi dan pengamanan instalasi listrik',
      category: 'proteksi',
      icon: '🛡️',
      color: 'from-indigo-500 to-indigo-600',
      level: 'Lanjutan',
      duration: '55 jam',
      modules: ['Relay Proteksi', 'Circuit Breaker', 'Surge Protection']
    },
    // Teknik Digital
    {
      id: 'elearning-digital',
      title: 'Teknik Digital',
      description: 'Elektronika digital dan sistem komputer',
      category: 'elektronika',
      icon: '💻',
      color: 'from-cyan-500 to-cyan-600',
      level: 'Menengah',
      duration: '42 jam',
      modules: ['Logic Gates', 'Flip-Flop', 'Microprocessor']
    },
    // Software Tools
    {
      id: 'elearning-software',
      title: 'Software Kelistrikan',
      description: 'CAD, Simulasi & Tools untuk Teknik Elektrik',
      category: 'software',
      icon: '💻',
      color: 'from-purple-500 to-purple-600',
      level: 'Lanjutan',
      duration: '50 jam',
      modules: ['CAD Elektrik', 'Simulasi Rangkaian', 'Project Management']
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua Modul', icon: '📚' },
    { id: 'instalasi', name: 'Instalasi', icon: '⚡' },
    { id: 'gambar-teknik', name: 'Gambar Teknik', icon: '📐' },
    { id: 'pemeliharaan', name: 'Pemeliharaan', icon: '🔧' },
    { id: 'kendali', name: 'Sistem Kendali', icon: '🎛️' },
    { id: 'proteksi', name: 'Proteksi', icon: '🛡️' },
    { id: 'elektronika', name: 'Elektronika', icon: '💻' },
    { id: 'software', name: 'Software Tools', icon: '💻' }
  ];

  const filteredModules = selectedCategory === 'all' 
    ? elearningModules 
    : elearningModules.filter(module => module.category === selectedCategory);

  const handleModuleClick = (moduleId) => {
    console.log('[ELearningPage] Module selected:', moduleId);
    if (moduleId === 'elearning-iml') {
      // Navigate to dedicated IML page
      if (onOpenIMLPage) {
        onOpenIMLPage('iml');
      }
    } else if (moduleId === 'elearning-software') {
      // Navigate to software page
      if (onModuleSelect) {
        onModuleSelect('software');
      }
    } else {
      // For other modules, show coming soon message
      alert(`Modul ${moduleId} sedang dalam pengembangan. Silakan gunakan modul IML yang sudah tersedia.`);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Dasar': return 'bg-green-100 text-green-800';
      case 'Menengah': return 'bg-yellow-100 text-yellow-800';
      case 'Lanjutan': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <h1 className="text-xl font-semibold text-gray-900">E-Learning TITL</h1>
                <p className="text-sm text-gray-500">Selamat datang, {user?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">
            🎓 Portal E-Learning TITL SMK
          </h2>
          <p className="text-blue-100 text-lg mb-4">
            Pelajari kurikulum Teknik Instalasi Tenaga Listrik dengan modul pembelajaran interaktif
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{elearningModules.length}</div>
              <div className="text-blue-100">Modul Tersedia</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">350+</div>
              <div className="text-blue-100">Jam Pembelajaran</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">7</div>
              <div className="text-blue-100">Kategori Utama</div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Kategori</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredModules.map((module, index) => (
              <motion.div
                key={module.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => handleModuleClick(module.id)}
              >
                {/* Module Header */}
                <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{module.icon}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(module.level)}`}>
                      {module.level}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                  <p className="text-white/90 text-sm">{module.description}</p>
                </div>

                {/* Module Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {module.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {module.modules.length} Modul
                    </div>
                  </div>

                  {/* Module Topics */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">Materi Pembelajaran:</h4>
                    <ul className="text-sm text-gray-600">
                      {module.modules.slice(0, 3).map((topic, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6">
                    <button 
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 group-hover:shadow-lg"
                      onClick={() => handleModuleClick(module.id)}
                    >
                      {module.id === 'elearning-iml' ? 'Lihat Detail' : 'Segera Hadir'}
                    </button>
                  </div>
                </div>

                {/* Status Indicator for IML */}
                {module.id === 'elearning-iml' && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Tersedia
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredModules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada modul ditemukan
            </h3>
            <p className="text-gray-500">
              Coba pilih kategori lain atau kembali ke semua modul
            </p>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-1">Pembelajaran Terstruktur</h4>
              <p className="text-sm text-gray-600">Kurikulum sesuai standar SMK TITL</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-semibold text-gray-900 mb-1">Sertifikasi</h4>
              <p className="text-sm text-gray-600">Dapatkan sertifikat setelah menyelesaikan modul</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">👨‍🏫</div>
              <h4 className="font-semibold text-gray-900 mb-1">Bimbingan Expert</h4>
              <p className="text-sm text-gray-600">Didampingi instruktur berpengalaman</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}