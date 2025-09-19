import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SimpleDashboard({ 
  user, 
  onLogout, 
  onModuleSelect
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID'));
      
      const hour = now.getHours();
      if (hour < 12) setGreeting('Selamat Pagi');
      else if (hour < 15) setGreeting('Selamat Siang');
      else if (hour < 18) setGreeting('Selamat Sore');
      else setGreeting('Selamat Malam');
    };
    
    updateTime();
  }, []);

  const modules = [
    {
      id: 'elearning',
      title: 'E-Learning',
      description: 'Pembelajaran dasar TITL SMK',
      icon: '📚',
      color: 'from-blue-500 to-blue-600'
    },
        {
      id: 'software',
      title: 'Software Kelistrikan',
      description: 'CAD, Simulasi & Tools untuk Teknik Elektrik',
      icon: '💻',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'admin-center',
      title: 'Admin Center',
      description: 'Halaman Admin untuk mengelola modul pembelajaran',
      icon: '🛠️',
      color: 'from-indigo-500 to-indigo-600',
      type: 'external',
      url: '/integrations/admin-center/admin-center.html'
    },
    {
      id: 'monitoring',
      title: 'System Monitoring',
      description: 'Real-time monitoring siswa dan sistem',
      icon: '📊',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'monitoring-guru',
      title: 'Monitoring Guru',
      description: 'Pemantauan aktivitas pembelajaran guru',
      icon: '👨‍🏫',
      color: 'from-purple-500 to-purple-600',
      type: 'external',
      url: '/monitoring/index.html'
    },
    {
      id: 'test-portal',
      title: 'Portal Test',
      description: 'Testing dan diagnostik sistem',
      icon: '🧪',
      color: 'from-orange-500 to-orange-600',
      type: 'external',
        url: '/public/integrations/test-portal/test-portal.html'
    },
    {
      id: 'assessment',
      title: 'Assessment',
      description: 'Pusat penilaian dan evaluasi',
      icon: '📝',
      color: 'from-orange-500 to-orange-600',
      type: 'external',
        url: '/public/integrations/assessment/assessment.html'
    }
  ];

  const handleModuleClick = (module) => {
    if (module.type === 'external' && module.url) {
      // Open external URLs in new tab/window with SSO context
      const url = module.url + (module.url.includes('?') ? '&' : '?') + 
                  `sso_token=${encodeURIComponent(JSON.stringify(user))}&timestamp=${Date.now()}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Use regular navigation for internal modules
      onModuleSelect?.(module.id);
    }
  };

  const stats = [
    { label: 'Modul Selesai', value: '12', icon: '✅' },
    { label: 'Jam Belajar', value: '45', icon: '⏰' },
    { label: 'Sertifikat', value: '3', icon: '🏆' },
    { label: 'Progress', value: '78%', icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="text-xl font-bold text-slate-1000">Sangsongko Engineering</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                <span className="font-medium">{currentTime}</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700">{user?.name || 'User'}</span>
              </div>
              
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border border-slate-200/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                {greeting}, {user?.name || 'User'}! 👋
              </h2>
              <p className="text-slate-600">
                Selamat datang di Sangsongko Engineering. Platform terpadu untuk pembelajaran teknik. Belajarlah setinggi-tingginya sampai ke negeri China.
                kalian pasti bisa, semangat selagi masih muda.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-slate-200/50"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleModuleClick(module)}
              className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 hover:scale-105 text-left"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${module.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{module.icon}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {module.title}
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                {module.description}
              </p>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Profil cv mcahyosangsongko arsy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-slate-200/50 overflow-hidden"
        >
          {/* Header with decorative elements */}
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10"></div>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10"></div>
            <h3 className="relative text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent text-center mb-2">
              👨‍🎓 Profil Profesional
            </h3>
            <p className="text-center text-slate-600 text-sm md:text-base">M. Cahyo Sangsongko Arsy</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photo and Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
                {/* Photo Display */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 md:w-72 md:h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                      <img
                        src="/profile.jpg"
                        alt="M. Cahyo Sangsongko Arsy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/profile.jpg';
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-800 mb-1">M. CAHYO SANGSONGKO ARSY</h4>
                    <p className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full inline-block">🎓 Mahasiswa Teknik Elektro</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📧</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm text-slate-700 font-medium">mcahyosangsongkoarsy@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-sm">📱</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Telepon</p>
                        <p className="text-sm text-slate-700 font-medium">0878-7104-9135</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-sm">📍</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Alamat</p>
                        <p className="text-sm text-slate-700 font-medium">Dsn. Besi Ds. Mlati Kec. Mojo Kab. Kediri, 64162</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <h5 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600">👋</span>
                  </span>
                  Tentang Saya
                </h5>
                <div className="space-y-3 text-slate-700 leading-relaxed">
                  <p className="text-sm">
                    Memiliki bekal pendidikan di <span className="font-semibold text-blue-600">Universitas Negeri Surabaya</span>,
                    jurusan <span className="font-semibold text-purple-600">Teknik Elektro</span>.
                  </p>
                  <p className="text-sm">
                    Minat belajar yang tinggi membuat saya ingin terus mendalami dunia elektrik dan teknologi terkini.
                  </p>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <h5 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600">🎓</span>
                  </span>
                  Riwayat Pendidikan
                </h5>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Universitas Negeri Surabaya</p>
                      <p className="text-xs text-slate-600">Teknik Elektro • 2021 - Sekarang</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">SMA Negeri 1 Mojo Kediri</p>
                      <p className="text-xs text-slate-600">Jurusan MIPA • 2018 - 2021</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">SMP Negeri 1 Mojo Kediri</p>
                      <p className="text-xs text-slate-600">Kelas 9F • 2015 - 2018</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">MI MLATI 1 MOJO Kediri</p>
                      <p className="text-xs text-slate-600">2009 - 2015</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">TK RA. Kusuma Mulia MOJO KEDIRI</p>
                      <p className="text-xs text-slate-600">2007 - 2009</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <h5 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-orange-600">💼</span>
                  </span>
                  Pengalaman & Organisasi
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-slate-800">UKM HIMAPALA UNESA</p>
                    <p className="text-xs text-slate-600">Divisi Gunung Hutan • 2021-2025</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-slate-800">MAGANG PT. GLORY ELECTRIC</p>
                    <p className="text-xs text-slate-600">2024</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-slate-800">EKSKUL SMANSAPALA</p>
                    <p className="text-xs text-slate-600">SMA 1 Mojo Kediri</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-semibold text-slate-800">EKSKUL OSIS</p>
                    <p className="text-xs text-slate-600">SMA 1 Mojo Kediri</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm font-semibold text-slate-800">EKSKUL PRAMUKA</p>
                    <p className="text-xs text-slate-600">SMA 1 Mojo Kediri</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-sm font-semibold text-slate-800">VOKASI KOMPUTER</p>
                    <p className="text-xs text-slate-600">SMA 1 Mojo Kediri • 2018-2021</p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <h5 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-yellow-600">🏆</span>
                  </span>
                  Sertifikasi
                </h5>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">🎖️</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Asosiasi Pemandu Gunung Indonesia (APGI)</p>
                    <p className="text-xs text-slate-600">Sertifikasi Pendakian Gunung</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-8">
            <h5 className="text-xl font-bold text-slate-800 mb-6 text-center flex items-center justify-center">
              <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white text-lg">⚡</span>
              </span>
              Keahlian & Kemampuan
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Teknik Elektro & Elektronika */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-lg">🔧</span>
                  </div>
                  <h6 className="text-lg font-semibold text-slate-800">Teknik Elektro & Elektronika</h6>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Teknisi Elektronik', 'Instalasi Motor Listrik 3 Fasa', 'Instalasi Listrik Rumah Tangga',
                    'Perbaikan Peralatan Elektronik', 'Desain Rangkaian Elektronik', 'Pengukuran Tegangan & Arus',
                    'Maintenance Sistem Elektrik', 'Troubleshooting Hardware', 'Kalibrasi Alat Ukur',
                    'Instalasi Panel Listrik', 'Perbaikan Trafo & Generator', 'Sistem Grounding & Proteksi'
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pemrograman & Teknologi */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600 text-lg">💻</span>
                  </div>
                  <h6 className="text-lg font-semibold text-slate-800">Pemrograman & Teknologi</h6>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Python, C, C++, Java, PHP', 'HTML, CSS, JavaScript, React', 'MySQL, PostgreSQL, MongoDB',
                    'Arduino, ESP32, Raspberry Pi', 'IoT Development & Smart Home', 'Embedded Systems Programming',
                    'PLC Programming (Siemens, Omron)', 'SCADA Systems & HMI', 'API Development & RESTful',
                    'Git & Version Control', 'Linux/Unix Administration', 'Network Configuration'
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desain & Simulasi */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-lg">🎨</span>
                  </div>
                  <h6 className="text-lg font-semibold text-slate-800">Desain & Simulasi</h6>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Figma, Adobe XD, AutoCAD', 'SolidWorks, Proteus, Tinkercad', 'MATLAB, Simulink',
                    'PCB Design & Layout', '3D Modeling & Printing', 'Circuit Simulation & Analysis',
                    'Power System Analysis', 'Thermal Analysis', 'Finite Element Analysis',
                    'CFD Simulation', 'Virtual Reality Development'
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Laboratorium & Teknik */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-orange-600 text-lg">🔬</span>
                  </div>
                  <h6 className="text-lg font-semibold text-slate-800">Laboratorium & Teknik</h6>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Multimeter, Osiloskop, Signal Generator', 'Lab. Elektronika, Lab. Pemrograman',
                    'Lab. Elektrik & Kontrol', 'Lab. Telekomunikasi', 'Quality Control & Testing',
                    'Failure Analysis', 'Material Science', 'Robotics & Automation',
                    'Sensor Integration', 'Data Acquisition Systems'
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soft Skills & Manajemen */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-red-600 text-lg">📊</span>
                  </div>
                  <h6 className="text-lg font-semibold text-slate-800">Soft Skills & Manajemen</h6>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Public Speaking & Presentation', 'Problem Solving & Critical Thinking',
                    'Time Management & Organization', 'Data Analysis & Visualization',
                    'Innovation & Creativity', 'Teamwork & Collaboration', 'Leadership & Mentoring',
                    'Project Management (Agile/Scrum)', 'Research & Development',
                    'Technical Writing & Documentation', 'Customer Service Excellence',
                    'Adaptability & Learning Agility', 'Conflict Resolution', 'Decision Making'
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bahasa & Komunikasi */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-indigo-600 text-lg">🌐</span>
                  </div>
                  <h6 className="text-lg font-semibold text-slate-800">Bahasa & Komunikasi</h6>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Bahasa Indonesia: Native', 'Bahasa Inggris: Intermediate (TOEFL 450)',
                    'Bahasa Jawa: Native', 'Technical Documentation Writing',
                    'Business Communication', 'Cross-cultural Communication',
                    'Negotiation Skills', 'Interview & Presentation Skills'
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interests & Hobbies */}
          <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <h5 className="text-lg font-bold text-slate-800 mb-6 text-center flex items-center justify-center">
              <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-pink-600">🎯</span>
              </span>
              Minat & Hobi
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center hover:shadow-lg transition-all duration-300 border border-blue-200 hover:scale-105">
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">⚡</span>
                <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">Teknologi Elektrik</p>
              </div>
              <div className="group bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center hover:shadow-lg transition-all duration-300 border border-green-200 hover:scale-105">
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">🤖</span>
                <p className="text-sm font-medium text-slate-700 group-hover:text-green-700 transition-colors">Robotics & AI</p>
              </div>
              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center hover:shadow-lg transition-all duration-300 border border-purple-200 hover:scale-105">
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">🏔️</span>
                <p className="text-sm font-medium text-slate-700 group-hover:text-purple-700 transition-colors">Pendakian Gunung</p>
              </div>
              <div className="group bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center hover:shadow-lg transition-all duration-300 border border-orange-200 hover:scale-105">
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">📚</span>
                <p className="text-sm font-medium text-slate-700 group-hover:text-orange-700 transition-colors">Belajar Teknologi Baru</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}