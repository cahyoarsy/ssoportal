import React, { useState, useEffect } from 'react';
import ModuleLearning, { modul1 } from './modul1';
import { motion, AnimatePresence } from 'framer-motion';

export default function IMLPage({ 
  user, 
  onBack, 
  onModuleSelect
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedJobsheet, setSelectedJobsheet] = useState(null);
  const [showModuleLearning, setShowModuleLearning] = useState(false);
  const [learningModuleId, setLearningModuleId] = useState(null);
  const [userProgress, setUserProgress] = useState({
    completedModules: [],
    currentModule: null,
    totalProgress: 0
  });

  // Initialize user progress
  useEffect(() => {
    if (user) {
      // Load progress from localStorage or initialize
      const savedProgress = localStorage.getItem(`iml_progress_${user.id || 'default'}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
    }
  }, [user]);

  // Data modul IML yang komprehensif
  const imlData = {
    title: 'Instalasi Motor Listrik (IML)',
    description: 'Pembelajaran komprehensif tentang instalasi, pengoperasian, dan pemeliharaan motor listrik 3 fasa',
    duration: '40 jam',
    level: 'Menengah',
    instructor: 'Tim Instruktur TITL',
    
    modules: [
      {
        id: 'modul-1',
        title: 'Dasar-Dasar Motor Listrik',
        description: 'Pengenalan komponen dan prinsip kerja motor listrik',
        duration: '8 jam',
        topics: [
          'Motor Listrik',
          'Jenis-Jenis Motor Listrik',
          'Komponen Utama Motor 3 Fasa',
          'Prinsip Kerja Motor Induksi',
          'Spesifikasi dan Rating Motor ',
          'Perhitungan Dasar Motor',
          'Karakteristik Motor Induksi'
        ],
        status: 'available'
      },
      {
        id: 'modul-2',
        title: 'Rangkaian Kontrol Motor',
        description: 'Sistem kontrol dan pengoperasian motor listrik',
        duration: '12 jam',
        topics: [
          'Rangkaian kontrol langsung',
          'Rangkaian DOL (Direct On Line)',
          'Rangkaian ON, OFF, dan ON/OFF',
          'Sistem Star-Delta',
          'Rangkaian Soft Starter',
          'Rangkaian Pengendali Motor',
          'Penggunaan kontaktor dan relay',
          'Komponen proteksi motor',
          'Rangkaian Forward-Reverse',
        ],
        status: 'available'
      },
      {
        id: 'modul-3',
        title: 'Instalasi dan Wiring',
        description: 'Teknik instalasi dan pengkabelan motor listrik',
        duration: '10 jam',
        topics: [
          'Perencanaan instalasi',
          'Teknik wiring motor',
          'Grounding dan proteksi',
          'Rangkaian kendali bergantian',
          'Rangkaian kendali berurutan',
          'Testing dan commissioning'
        ],
        status: 'available'
      },
      {
        id: 'modul-4',
        title: 'Troubleshooting & Maintenance',
        description: 'Diagnosis masalah dan pemeliharaan motor',
        duration: '10 jam',
        topics: [
          'Identifikasi kerusakan motor',
          'Teknik pengukuran dan testing',
          'Preventive maintenance',
          'Perbaikan rangkaian kendali',
          'Repair dan overhaul'
        ],
        status: 'available'
      }
    ],
    
    assessments: [
      {
        id: 'pretest',
        title: 'Pre-Test IML',
        description: 'Tes awal untuk mengukur pemahaman dasar tentang motor listrik dan instalasi',
        questions: 20,
        duration: '30 menit',
        type: 'multiple-choice',
        passingScore: 70
      },
      {
        id: 'quiz-1',
        title: 'Quiz Modul 1',
        description: 'Evaluasi pemahaman dasar motor listrik dan komponen',
        questions: 15,
        duration: '20 menit',
        type: 'multiple-choice',
        passingScore: 75
      },
      {
        id: 'quiz-2',
        title: 'Quiz Modul 2',
        description: 'Evaluasi pemahaman rangkaian kontrol motor',
        questions: 15,
        duration: '20 menit',
        type: 'multiple-choice',
        passingScore: 75
      },
      {
        id: 'practical',
        title: 'Praktik Instalasi',
        description: 'Ujian praktik instalasi motor lengkap dengan rubrik penilaian',
        duration: '2 jam',
        type: 'practical',
        passingScore: 80
      },
      {
        id: 'posttest',
        title: 'Post-Test IML',
        description: 'Tes akhir evaluasi pembelajaran IML (pilihan ganda + essay)',
        questions: 25,
        duration: '45 menit',
        type: 'mixed',
        passingScore: 80
      }
    ],

    jobsheets: [
      {
        id: 'js-1',
        title: 'Job Sheet 1: Rangkaian Kendali Motor ON',
        description: 'Membuat dan menganalisis rangkaian ON untuk kendali motor listrik',
        duration: '20 menit',
        difficulty: 'Dasar',
        tools: ['Tools Set', 'AVO meter', 'Test Pen'],
        materials: ['Kabel NYAF', 'MCB 1 Phase', 'Push Button', 'Kontaktor Magnet', 'Motor Listrik'],
        objectives: [
          'Membuat rangkaian ON dengan tepat',
          'Menganalisa rangkaian ON dengan tepat dan benar',
          'Memeriksa kesalahan pada rangkaian ON dengan tepat dan benar'
        ]
      },
      {
        id: 'js-2',
        title: 'Job Sheet 2: Rangkaian Kendali Motor OFF',
        description: 'Membuat dan menganalisis rangkaian OFF untuk kendali motor listrik',
        duration: '20 menit',
        difficulty: 'Dasar',
        tools: ['Tools Set', 'AVO meter', 'Test Pen'],
        materials: ['Kabel NYAF', 'MCB 1 Phase', 'Push Button', 'Kontaktor Magnet', 'Motor Listrik'],
        objectives: [
          'Membuat rangkaian OFF dengan tepat',
          'Menganalisa rangkaian OFF dengan tepat dan benar',
          'Memeriksa kesalahan pada rangkaian OFF dengan tepat dan benar'
        ]
      },
      {
        id: 'js-3',
        title: 'Job Sheet 3: Rangkaian Kendali Motor ON/OFF',
        description: 'Merangkai sistem kendali ON/OFF untuk motor listrik',
        duration: '30 menit',
        difficulty: 'Menengah',
        tools: ['Tools Set', 'AVO meter', 'Test Pen'],
        materials: ['Kabel NYAF', 'MCB 1 Phase', 'Push Button ON/OFF', 'Kontaktor Magnet', 'Motor Listrik'],
        objectives: [
          'Membuat rangkaian ON/OFF dengan tepat',
          'Menganalisa rangkaian ON/OFF dengan tepat dan benar',
          'Memeriksa kesalahan pada rangkaian ON/OFF dengan tepat dan benar'
        ]
      },
      {
        id: 'js-4',
        title: 'Job Sheet 4: Rangkaian Direct On Line (DOL)',
        description: 'Instalasi dan pengujian rangkaian DOL untuk motor 3 fasa',
        duration: '45 menit',
        difficulty: 'Menengah',
        tools: ['Tools Set', 'AVO meter', 'Test Pen', 'Megger'],
        materials: ['Kabel NYAF', 'MCB 3 Phase', 'Push Button', 'Kontaktor Magnet', 'Motor 3 Fasa', 'Thermal Overload Relay'],
        objectives: [
          'Memahami prinsip kerja rangkaian DOL',
          'Merangkai sistem DOL dengan benar',
          'Melakukan pengujian dan komisioning'
        ]
      },
      {
        id: 'js-5',
        title: 'Job Sheet 5: Rangkaian Kendali Bergantian',
        description: 'Merangkai sistem kendali untuk dua motor listrik beroperasi bergantian',
        duration: '60 menit',
        difficulty: 'Lanjutan',
        tools: ['Tools Set', 'AVO meter', 'Test Pen', 'Megger'],
        materials: ['Kabel NYAF', 'MCB 3 Phase', 'Push Button', 'Kontaktor Magnet (2 unit)', 'Motor 3 Fasa (2 unit)', 'Timer', 'Thermal Overload Relay'],
        objectives: [
          'Memahami prinsip kerja rangkaian kendali bergantian',
          'Merangkai sistem kendali bergantian dengan benar',
          'Mengatur waktu pergantian operasi motor'
        ]
      },
      {
        id: 'js-6',
        title: 'Job Sheet 6: Rangkaian Kendali Berurutan',
        description: 'Merangkai sistem kendali untuk dua motor listrik beroperasi berurutan',
        duration: '60 menit',
        difficulty: 'Lanjutan',
        tools: ['Tools Set', 'AVO meter', 'Test Pen', 'Megger'],
        materials: ['Kabel NYAF', 'MCB 3 Phase', 'Push Button', 'Kontaktor Magnet (2 unit)', 'Motor 3 Fasa (2 unit)', 'Timer', 'Thermal Overload Relay'],
        objectives: [
          'Memahami prinsip kerja rangkaian kendali berurutan',
          'Merangkai sistem kendali berurutan dengan benar',
          'Menganalisis cara kerja dan time chart'
        ]
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'modules', label: 'Modul', icon: '📚' },
    { id: 'jobsheets', label: 'Job Sheet', icon: '🔧' },
    { id: 'assessments', label: 'Assessment', icon: '📝' },
    { id: 'schematics', label: 'Skema', icon: '⚡' }
  ];

  const handleStartLearning = () => {
    console.log('Starting IML learning for user:', user);
    setActiveTab('modules');
  };

  const handleModuleStart = (moduleId) => {
    if (moduleId === 'modul-1') {
      setLearningModuleId(moduleId);
      setShowModuleLearning(true);
    } else {
      setSelectedModule(moduleId);
      alert(`Memulai ${imlData.modules.find(m => m.id === moduleId)?.title}. Konten akan dikembangkan lebih lanjut.`);
    }
  };

  const handleAssessmentStart = (assessmentId) => {
    console.log('Starting assessment:', assessmentId);
    const assessment = imlData.assessments.find(a => a.id === assessmentId);
    alert(`Memulai ${assessment?.title}. Assessment system akan dikembangkan lebih lanjut.`);
  };

  const handleJobsheetOpen = (jobsheetId) => {
    console.log('Opening jobsheet:', jobsheetId);
    const jobsheet = imlData.jobsheets.find(j => j.id === jobsheetId);
    setSelectedJobsheet(jobsheet);
    
    // In a real implementation, this would navigate to the detailed job sheet page
    // For now, we'll show details in an alert
    const details = `
    ${jobsheet?.title}
    
    Tujuan Pembelajaran:
    ${jobsheet?.objectives?.join('\n')}
    
    Alat dan Bahan:
    - ${jobsheet?.tools?.join('\n- ')}
    - ${jobsheet?.materials?.join('\n- ')}
    
    Durasi: ${jobsheet?.duration}
    
    Tingkat Kesulitan: ${jobsheet?.difficulty}
    `;
    
    alert(details);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'locked': return 'bg-gray-100 text-gray-500';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (showModuleLearning && learningModuleId === 'modul-1') {
    return (
      <ModuleLearning
        user={user}
        moduleId="modul-1"
        moduleData={modul1}
        onBack={() => setShowModuleLearning(false)}
      />
    );
  }

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
                Kembali
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <h1 className="text-xl font-semibold text-gray-900">Instalasi Motor Listrik</h1>
                <p className="text-sm text-gray-500">Okke kakak, {user?.name}, siap untuk belajar?</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview Content */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
                <h2 className="text-3xl font-bold mb-4">⚡ {imlData.title}</h2>
                <p className="text-blue-100 text-lg mb-4">{imlData.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center">
                    <div className="text-blue-100 mb-1">Total Durasi</div>
                    <div className="text-2xl font-bold text-white">{imlData.duration}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center">
                    <div className="text-blue-100 mb-1">Modul Pembelajaran</div>
                    <div className="text-2xl font-bold text-white">{imlData.modules.length}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center">
                    <div className="text-blue-100 mb-1">Level Kesulitan</div>
                    <div className="text-2xl font-bold text-white">{imlData.level}</div>
                  </div>
                </div>
                <button
                  onClick={handleStartLearning}
                  className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Mulai Pembelajaran
                </button>
              </div>

              {/* Course Info */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">📚 Yang Akan Dipelajari</h3>
                  <ul className="space-y-3">
                    {imlData.modules.map((module, index) => (
                      <li key={module.id} className="flex items-start">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{module.title}</h4>
                          <p className="text-sm text-gray-600">{module.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Kompetensi yang Dicapai</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Memahami prinsip kerja motor listrik 3 fasa
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Merangkai sistem kontrol motor listrik
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Melakukan instalasi motor dengan benar
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Troubleshooting masalah motor listrik
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Melakukan maintenance preventif
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Modul Pembelajaran</h2>
              <div className="grid gap-6">
                {imlData.modules.map((module, index) => (
                  <div key={module.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                            {module.status === 'available' ? 'Tersedia' : module.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{module.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {module.duration}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-gray-700">Topik Pembelajaran:</h4>
                          {module.topics.map((topic, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleModuleStart(module.id)}
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mulai
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'jobsheets' && (
            <motion.div
              key="jobsheets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🔧 Job Sheet Praktikum</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {imlData.jobsheets.map((jobsheet, index) => (
                  <div key={jobsheet.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        {index + 1}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        jobsheet.difficulty === 'Dasar' ? 'bg-green-100 text-green-700' :
                        jobsheet.difficulty === 'Menengah' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {jobsheet.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{jobsheet.title}</h3>
                    <p className="text-gray-600 mb-4">{jobsheet.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Durasi:</span> <span className="ml-1">{jobsheet.duration}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Tujuan Pembelajaran:</h4>
                      <ul className="space-y-1">
                        {jobsheet.objectives?.map((objective, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <span className="text-green-500 mr-2">✓</span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Alat yang Dibutuhkan:</h4>
                        <ul className="space-y-1">
                          {jobsheet.tools?.map((tool, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Bahan:</h4>
                        <ul className="space-y-1">
                          {jobsheet.materials?.map((material, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleJobsheetOpen(jobsheet.id)}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Buka Job Sheet
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'assessments' && (
            <motion.div
              key="assessments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Assessment dan Evaluasi</h2>
              <div className="grid gap-6">
                {imlData.assessments.map((assessment, index) => (
                  <div key={assessment.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                            assessment.type === 'multiple-choice' ? 'bg-blue-100 text-blue-700' :
                            assessment.type === 'practical' ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {assessment.type === 'multiple-choice' ? 'Pilihan Ganda' :
                             assessment.type === 'practical' ? 'Praktik' : 'Campuran'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{assessment.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Soal:</span>
                            <div className="font-medium">{assessment.questions} pertanyaan</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Durasi:</span>
                            <div className="font-medium">{assessment.duration}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Nilai Lulus:</span>
                            <div className="font-medium">{assessment.passingScore}%</div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssessmentStart(assessment.id)}
                        className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Mulai Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'schematics' && (
            <motion.div
              key="schematics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">⚡ Skema Rangkaian Kendali Motor</h2>
              
              <div className="grid gap-8">
                {/* Rangkaian ON */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Skema Rangkaian ON</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                        <h4 className="font-medium text-blue-800 mb-2">Diagram Pengawatan</h4>
                        <div className="aspect-video bg-white border border-gray-200 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">[Diagram Rangkaian ON]</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Komponen Utama:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>MCB 1 Phase</li>
                          <li>Push Button ON</li>
                          <li>Kontaktor Magnet</li>
                          <li>Motor Listrik</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cara Kerja:</h4>
                      <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                        <li>Saat Push Button ON ditekan, arus listrik mengalir ke koil kontaktor magnet</li>
                        <li>Kontaktor magnet akan bekerja menarik kontak-kontak NO menjadi tertutup</li>
                        <li>Kontak bantu akan mengunci rangkaian kendali (self holding)</li>
                        <li>Motor akan tetap bekerja meskipun Push Button ON dilepas</li>
                        <li>Motor akan berhenti jika sumber tegangan diputus (melalui MCB)</li>
                      </ol>
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Time Chart:</h4>
                        <div className="h-20 bg-white border border-gray-200 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">[Time Chart Rangkaian ON]</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Rangkaian OFF */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Skema Rangkaian OFF</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
                        <h4 className="font-medium text-red-800 mb-2">Diagram Pengawatan</h4>
                        <div className="aspect-video bg-white border border-gray-200 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">[Diagram Rangkaian OFF]</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Komponen Utama:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>MCB 1 Phase</li>
                          <li>Push Button OFF (NC)</li>
                          <li>Kontaktor Magnet</li>
                          <li>Motor Listrik</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cara Kerja:</h4>
                      <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                        <li>Pada kondisi normal, Push Button OFF (NC) membuat rangkaian tertutup</li>
                        <li>Kontaktor magnet aktif dan motor bekerja</li>
                        <li>Saat Push Button OFF ditekan, rangkaian kendali terputus</li>
                        <li>Kontaktor magnet tidak aktif dan motor berhenti</li>
                        <li>Saat Push Button OFF dilepas, motor tidak akan bekerja kembali secara otomatis</li>
                      </ol>
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Time Chart:</h4>
                        <div className="h-20 bg-white border border-gray-200 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">[Time Chart Rangkaian OFF]</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Rangkaian ON/OFF */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Skema Rangkaian ON/OFF</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
                        <h4 className="font-medium text-green-800 mb-2">Diagram Pengawatan</h4>
                        <div className="aspect-video bg-white border border-gray-200 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">[Diagram Rangkaian ON/OFF]</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Komponen Utama:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>MCB 1 Phase</li>
                          <li>Push Button ON (NO)</li>
                          <li>Push Button OFF (NC)</li>
                          <li>Kontaktor Magnet</li>
                          <li>Motor Listrik</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cara Kerja:</h4>
                      <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                        <li>Saat Push Button ON ditekan, arus mengalir ke koil kontaktor</li>
                        <li>Kontaktor magnet aktif dan mengunci rangkaian melalui kontak bantu (self holding)</li>
                        <li>Motor listrik akan bekerja</li>
                        <li>Saat Push Button OFF ditekan, rangkaian kendali terputus</li>
                        <li>Kontaktor tidak aktif dan motor berhenti bekerja</li>
                      </ol>
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Time Chart:</h4>
                        <div className="h-20 bg-white border border-gray-200 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">[Time Chart Rangkaian ON/OFF]</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* DOL Starter */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Skema Direct On Line (DOL) Starter</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-4">
                        <h4 className="font-medium text-purple-800 mb-2">Diagram Pengawatan</h4>
                        <div className="aspect-video bg-white border border-gray-200 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">[Diagram Rangkaian DOL]</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Komponen Utama:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>MCB 3 Phase</li>
                          <li>Push Button ON (NO) dan OFF (NC)</li>
                          <li>Kontaktor Magnet</li>
                          <li>Thermal Overload Relay (TOR)</li>
                          <li>Motor 3 Fasa</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cara Kerja:</h4>
                      <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                        <li>Saat Push Button ON ditekan, arus mengalir ke koil kontaktor</li>
                        <li>Kontaktor magnet aktif dan mengunci rangkaian (self holding)</li>
                        <li>Kontak utama kontaktor menghubungkan tegangan 3 fasa ke motor</li>
                        <li>Motor listrik akan bekerja dengan starting arus tinggi (5-7x arus nominal)</li>
                        <li>TOR melindungi motor dari beban lebih</li>
                      </ol>
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Proteksi:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>MCB: Proteksi hubung singkat</li>
                          <li>TOR: Proteksi beban lebih</li>
                          <li>Push Button OFF: Pemutus manual</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}