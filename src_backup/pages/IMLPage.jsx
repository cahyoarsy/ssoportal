import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { imlAssessments } from '../data/imlAssessments';
import { learningProgressManager } from '../utils/learningProgress';
import { enhancedJobSheets } from '../data/enhancedJobSheets';
import { moduleQuizSystem } from '../data/moduleQuizSystem';
import { practicalAssessmentSystem } from '../data/practicalAssessmentSystem';
import ModuleLearning from '../components/ModuleLearning';
import AssessmentComponent from '../components/AssessmentComponent';
import ModuleQuizComponent from '../components/ModuleQuizComponent';
import PracticalAssessmentComponent from '../components/PracticalAssessmentComponent';
import { HybridStatusDot } from '../components/HybridConnectionIndicator.jsx';
import { firebaseHybridManager } from '../services/FirebaseHybridManager.js';

export default function IMLPage({ 
  user, 
  onBack, 
  onModuleSelect,
  moduleManager 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedJobsheet, setSelectedJobsheet] = useState(null);
  const [showAssessmentDetail, setShowAssessmentDetail] = useState(false);
  const [showJobsheetDetail, setShowJobsheetDetail] = useState(false);
  const [currentLearningMode, setCurrentLearningMode] = useState(null); // 'module', 'assessment', 'quiz', 'practical'
  const [userProgress, setUserProgress] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showPracticalAssessment, setShowPracticalAssessment] = useState(false);

  // Initialize user progress
  useEffect(() => {
    if (user) {
      const progress = learningProgressManager.getProgress(user.id);
      setUserProgress(progress);
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
          'Jenis-jenis motor listrik',
          'Komponen motor 3 fasa',
          'Prinsip kerja motor induksi',
          'Rating dan spesifikasi motor'
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
          'Sistem Star-Delta',
          'Penggunaan kontaktor dan relay'
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
          'Repair dan overhaul'
        ],
        status: 'available'
      }
    ],

    materials: imlAssessments.learningMaterials,
    jobsheets: imlAssessments.jobSheets,
    
    assessments: [
      {
        id: 'pretest',
        title: 'Pre-Test IML',
        description: 'Tes awal untuk mengukur pemahaman dasar tentang motor listrik dan instalasi',
        questions: imlAssessments.preTest.questions.length,
        duration: '30 menit',
        type: 'multiple-choice',
        passingScore: 70,
        data: imlAssessments.preTest.questions
      },
      {
        id: 'quiz-1',
        title: 'Quiz Modul 1',
        description: 'Evaluasi pemahaman dasar motor listrik dan komponen',
        questions: imlAssessments.quiz.modules[0].questions.length,
        duration: '20 menit',
        type: 'multiple-choice',
        passingScore: 75,
        data: imlAssessments.quiz.modules[0].questions
      },
      {
        id: 'quiz-2',
        title: 'Quiz Modul 2',
        description: 'Evaluasi pemahaman rangkaian kontrol motor',
        questions: imlAssessments.quiz.modules[1].questions.length,
        duration: '20 menit',
        type: 'multiple-choice',
        passingScore: 75,
        data: imlAssessments.quiz.modules[1].questions
      },
      {
        id: 'practical',
        title: 'Praktik Instalasi',
        description: 'Ujian praktik instalasi motor lengkap dengan rubrik penilaian',
        duration: '2 jam',
        type: 'practical',
        passingScore: 80,
        data: imlAssessments.practicalAssessment
      },
      {
        id: 'posttest',
        title: 'Post-Test IML',
        description: 'Tes akhir evaluasi pembelajaran IML (pilihan ganda + essay)',
        questions: imlAssessments.postTest.multipleChoice.questions.length + imlAssessments.postTest.essay.questions.length,
        duration: '45 menit',
        type: 'mixed',
        passingScore: 80,
        data: {
          multipleChoice: imlAssessments.postTest.multipleChoice.questions,
          essays: imlAssessments.postTest.essay.questions
        }
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'modules', label: 'Modul', icon: '📚' },
    { id: 'materials', label: 'Materi', icon: '📄' },
    { id: 'jobsheets', label: 'Job Sheet', icon: '🔧' },
    { id: 'assessments', label: 'Assessment', icon: '📝' }
  ];

  const handleStartLearning = () => {
    // Start with pre-test first
    const preTestCompleted = userProgress?.assessmentResults?.pretest?.passed;
    
    if (!preTestCompleted) {
      // Show pre-test first
      setSelectedAssessment({
        id: 'pretest',
        title: 'Pre-Test IML',
        description: 'Tes awal untuk mengukur pemahaman dasar tentang motor listrik dan instalasi',
        questions: 25,
        duration: '30 menit',
        type: 'multiple-choice',
        passingScore: 70,
        data: imlAssessments.preTest
      });
      setShowAssessmentDetail(true);
    } else {
      // Pre-test done, go to first module or current progress
  const nextAction = learningProgressManager.getNextAction(user.id);
      if (nextAction.type === 'start_module' || nextAction.type === 'continue_module') {
        handleModuleStart(nextAction.moduleId);
      }
    }
  };

  const handleModuleStart = (moduleId) => {
    setSelectedModule(moduleId);
    setCurrentLearningMode('module');
  };

  const handleModuleComplete = (moduleId, score) => {
    // Update progress and refresh
  const updatedProgress = learningProgressManager.getProgress(user.id);
    setUserProgress(updatedProgress);
    
    // Return to overview
    setCurrentLearningMode(null);
    setSelectedModule(null);
    
    // Check if all modules completed -> show post-test
    if (updatedProgress.completedModules.length >= 4) {
      alert('Selamat! Anda telah menyelesaikan semua modul. Silakan ambil Post-Test untuk menyelesaikan pembelajaran.');
    }
  };

  const handleModuleClick = (module) => {
  const isUnlocked = learningProgressManager.isModuleUnlocked(user.id, module.id);
    
    if (!isUnlocked) {
      alert('Modul ini terkunci. Selesaikan modul sebelumnya terlebih dahulu.');
      return;
    }
    
    handleModuleStart(module.id);
  };

  const handleJobsheetOpen = (jobsheet) => {
    setSelectedJobsheet(jobsheet);
    setShowJobsheetDetail(true);
  };

  const handleAssessmentStart = (assessment) => {
    if (assessment.id === 'pretest') {
      setSelectedAssessment(assessment);
      setShowAssessmentDetail(true);
    } else if (assessment.id === 'practical') {
      setShowPracticalAssessment(true);
      setCurrentLearningMode('practical');
    } else {
      setSelectedAssessment(assessment);
      setShowAssessmentDetail(true);
    }
  };

  const handleQuizStart = (moduleId) => {
    setSelectedQuiz(moduleId);
    setCurrentLearningMode('quiz');
  };

  const handleQuizComplete = (results) => {
    // Update progress and refresh
    const updatedProgress = learningProgressManager.getProgress(user.id);
    setUserProgress(updatedProgress);
    
    // Return to overview
    setCurrentLearningMode(null);
    setSelectedQuiz(null);
    
    alert(`Quiz completed! Score: ${results.percentage}%`);
  };

  const handlePracticalAssessmentComplete = (results) => {
    // Update progress and refresh
    const updatedProgress = learningProgressManager.getProgress(user.id);
    setUserProgress(updatedProgress);
    
    // Return to overview
    setCurrentLearningMode(null);
    setShowPracticalAssessment(false);
    
    alert(`Practical assessment completed! Score: ${results.overall_result.weighted_score}%`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Early returns for learning modes
  if (currentLearningMode === 'module' && selectedModule) {
    return (
      <ModuleLearning
        user={user}
        moduleId={selectedModule}
        onBack={() => {
          setCurrentLearningMode(null);
          setSelectedModule(null);
        }}
        onComplete={handleModuleComplete}
      />
    );
  }

  if (currentLearningMode === 'quiz' && selectedQuiz) {
    return (
      <ModuleQuizComponent
        moduleId={selectedQuiz}
        currentUser={user}
        onComplete={handleQuizComplete}
        onClose={() => {
          setCurrentLearningMode(null);
          setSelectedQuiz(null);
        }}
      />
    );
  }

  if (currentLearningMode === 'practical' && showPracticalAssessment) {
    return (
      <PracticalAssessmentComponent
        currentUser={user}
        onComplete={handlePracticalAssessmentComplete}
      />
    );
  }

  if (showAssessmentDetail && selectedAssessment) {
    return (
      <AssessmentComponent
        assessment={selectedAssessment}
        user={user}
        onComplete={(result) => {
          setShowAssessmentDetail(false);
          setSelectedAssessment(null);
          
          // Refresh progress
          const updatedProgress = learningProgressManager.getProgress(user.id);
          setUserProgress(updatedProgress);
          
          // For pre-test, automatically start first module if passed
          if (selectedAssessment.id === 'pretest' && result.passed) {
            setTimeout(() => {
              handleModuleStart('modul-1');
            }, 2000);
          }
        }}
        onBack={() => {
          setShowAssessmentDetail(false);
          setSelectedAssessment(null);
        }}
      />
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Course Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{imlData.title}</h2>
        <p className="text-blue-100 mb-4">{imlData.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-lg font-semibold">{imlData.duration}</div>
            <div className="text-blue-100 text-sm">Total Durasi</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-lg font-semibold">8</div>
            <div className="text-blue-100 text-sm">Modul</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-lg font-semibold">{enhancedJobSheets.length}</div>
            <div className="text-blue-100 text-sm">Job Sheet</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-lg font-semibold">{imlData.level}</div>
            <div className="text-blue-100 text-sm">Level</div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Alur Pembelajaran</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Pre-Test</h4>
              <p className="text-gray-600 text-sm">Evaluasi pemahaman awal tentang motor listrik</p>
            </div>
          </div>
          <div className="flex items-center p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Pembelajaran Modul</h4>
              <p className="text-gray-600 text-sm">Pelajari 8 modul pembelajaran secara berurutan</p>
            </div>
          </div>
          <div className="flex items-center p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Quiz Modul</h4>
              <p className="text-gray-600 text-sm">Evaluasi per modul dengan quiz interaktif</p>
            </div>
          </div>
          <div className="flex items-center p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Praktik Job Sheet</h4>
              <p className="text-gray-600 text-sm">Lakukan praktik hands-on dengan panduan job sheet per session</p>
            </div>
          </div>
          <div className="flex items-center p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Penilaian Praktik</h4>
              <p className="text-gray-600 text-sm">Assessment praktik komprehensif dengan 5 station</p>
            </div>
          </div>
          <div className="flex items-center p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Post-Test & Sertifikasi</h4>
              <p className="text-gray-600 text-sm">Evaluasi akhir dan perolehan sertifikat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Learning Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📚 Modul Pembelajaran</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {moduleQuizSystem.module_quizzes.map((moduleQuiz, index) => (
            <div key={moduleQuiz.module_id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900">{moduleQuiz.module_title}</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {moduleQuiz.questions.length} soal
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{moduleQuiz.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleModuleStart(moduleQuiz.module_id)}
                  className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  📖 Pelajari
                </button>
                <button
                  onClick={() => handleQuizStart(moduleQuiz.module_id)}
                  className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  🧭 Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">🎯 Penilaian Praktik</h4>
          <p className="text-sm text-green-700 mb-3">Assessment praktik komprehensif dengan 5 station evaluasi</p>
          <button
            onClick={() => setShowPracticalAssessment(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full"
          >
            Mulai Assessment
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">📋 Job Sheet</h4>
          <p className="text-sm text-purple-700 mb-3">Panduan praktik per session dengan checklist detail</p>
          <button
            onClick={() => setActiveTab('jobsheets')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors w-full"
          >
            Lihat Job Sheet
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-900 mb-2">📊 Monitoring</h4>
          <p className="text-sm text-orange-700 mb-3">Pantau progress dan hasil assessment real-time</p>
          <button
            onClick={() => window.open('/monitoring', '_blank')}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors w-full"
          >
            Buka Monitoring
          </button>
        </div>
      </div>

      {/* Start Learning Button */}
      <div className="text-center">
        <button
          onClick={handleStartLearning}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          🚀 Mulai Pembelajaran IML
        </button>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Modul Pembelajaran</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {imlAssessments.learningMaterials.map((material, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">{material.title}</h3>
              <p className="text-sm text-blue-700 mb-3">{material.description}</p>
              <div className="space-y-2">
                {(material.topics || material.chapters || []).map((item, itemIndex) => (
                  <div key={itemIndex} className="text-xs text-blue-600 bg-white bg-opacity-50 p-2 rounded">
                    {item}
                  </div>
                ))}
              </div>
              {material.features && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {material.features.map((feature, featureIndex) => (
                    <span key={featureIndex} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📖 Materi Pembelajaran</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {imlAssessments.learningMaterials.map((material, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-green-900">{material.title}</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {(material.topics || material.chapters || []).length} Item
                </span>
              </div>
              <p className="text-green-700 mb-4">{material.description}</p>
              
              <div className="space-y-3 mb-4">
                <h4 className="font-medium text-green-900">Materi yang akan dipelajari:</h4>
                {(material.topics || material.chapters || []).map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center text-sm text-green-700">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    {item}
                  </div>
                ))}
              </div>

              {material.features && (
                <div className="border-t border-green-200 pt-4">
                  <h4 className="font-medium text-green-900 mb-2">Fitur Pembelajaran:</h4>
                  <div className="flex flex-wrap gap-2">
                    {material.features.map((feature, featureIndex) => (
                      <span key={featureIndex} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJobsheets = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔧 Job Sheet Praktikum</h2>
        <p className="text-gray-600 mb-6">Job sheet terstruktur per session dengan panduan detail dan checklist</p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {enhancedJobSheets.map((session, index) => (
            <div key={session.id} className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-orange-900">{session.title}</h3>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  Session {session.session}
                </span>
              </div>
              
              <p className="text-orange-700 mb-4">{session.description || session.title}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-orange-900 mb-2">🎯 Learning Objectives:</h4>
                  <div className="space-y-1">
                    {(session.objectives || session.learning_objectives || []).map((objective, objIndex) => (
                      <div key={objIndex} className="text-sm text-orange-700 bg-white bg-opacity-50 px-2 py-1 rounded">
                        • {objective}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-orange-900 mb-2">⏱️ Durasi & Struktur:</h4>
                  <div className="text-sm text-orange-700 space-y-1">
                    <div>Total: {session.duration || session.total_duration}</div>
                    {session.theory_session?.topics?.length ? (
                      <div>Teori: {session.theory_duration || session.theory_session.topics.reduce((acc, t) => acc, '—')}</div>
                    ) : null}
                    {session.practical_session?.experiments?.length ? (
                      <div>Praktik: {session.practical_duration || `${session.practical_session.experiments.length} kegiatan`}</div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-orange-900 mb-2">⚠️ Safety Requirements:</h4>
                  <div className="space-y-1">
                    {(session.pre_session?.safety_briefing || session.safety_requirements || []).slice(0, 3).map((safety, safetyIndex) => (
                      <div key={safetyIndex} className="text-sm text-orange-700 bg-red-50 border border-red-200 px-2 py-1 rounded">
                        ⚠️ {safety}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedJobsheet(session)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Lihat Detail Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAssessments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Penilaian & Assessment</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pre-Test */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📋</span>
              <h3 className="text-xl font-semibold text-blue-900">Pre-Test</h3>
            </div>
            <p className="text-blue-700 mb-4">Tes awal untuk mengukur pemahaman dasar sebelum pembelajaran</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Jumlah Soal:</span>
                <span className="font-medium text-blue-900">{imlAssessments.preTest.questions.length} soal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Waktu:</span>
                <span className="font-medium text-blue-900">{imlAssessments.preTest.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Tipe:</span>
                <span className="font-medium text-blue-900">Pilihan Ganda</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedAssessment(imlAssessments.preTest)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Mulai Pre-Test
            </button>
          </div>

          {/* Post-Test */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">✅</span>
              <h3 className="text-xl font-semibold text-green-900">Post-Test</h3>
            </div>
            <p className="text-green-700 mb-4">Tes akhir untuk mengukur pencapaian pembelajaran</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Pilihan Ganda:</span>
                <span className="font-medium text-green-900">{imlAssessments.postTest.multipleChoice.questions.length} soal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Essay:</span>
                <span className="font-medium text-green-900">{imlAssessments.postTest.essay.questions.length} soal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Waktu:</span>
                <span className="font-medium text-green-900">{imlAssessments.postTest.duration}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedAssessment(imlAssessments.postTest)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Mulai Post-Test
            </button>
          </div>

          {/* Quiz */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🧩</span>
              <h3 className="text-xl font-semibold text-purple-900">Quiz Interaktif</h3>
            </div>
            <p className="text-purple-700 mb-4">Kuis singkat untuk mengukur pemahaman per modul</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-purple-600">Modul Quiz:</span>
                <span className="font-medium text-purple-900">{imlAssessments.quiz.modules.length} modul</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-600">Tipe:</span>
                <span className="font-medium text-purple-900">Beragam</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedAssessment(imlAssessments.quiz)}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Mulai Quiz
            </button>
          </div>

          {/* Practical Assessment */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 md:col-span-2 lg:col-span-3">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🔧</span>
              <h3 className="text-xl font-semibold text-orange-900">Penilaian Praktik</h3>
            </div>
            <p className="text-orange-700 mb-4">Penilaian keterampilan praktis instalasi motor listrik</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {imlAssessments.practicalAssessment.rubric.map((rubricItem, index) => (
                <div key={index} className="bg-white bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">{rubricItem.aspect}</h4>
                  <div className="space-y-1">
                    {rubricItem.criteria.map((criterion, criterionIndex) => (
                      <div key={criterionIndex} className="text-sm text-orange-700">
                        {criterion}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedAssessment(imlAssessments.practicalAssessment)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Mulai Penilaian Praktik
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'modules': return renderModules();
      case 'materials': return renderMaterials();
      case 'jobsheets': return renderJobsheets();
      case 'assessments': return renderAssessments();
      default: return renderOverview();
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
                Kembali ke E-Learning
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <HybridStatusDot />
              <div className="text-right">
                <h1 className="text-xl font-semibold text-gray-900">IML - Instalasi Motor Listrik</h1>
                <p className="text-sm text-gray-500">Selamat datang, {user?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedAssessment.title || selectedAssessment.type || 'Detail Assessment'}
              </h2>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedAssessment.description && (
                <p className="text-gray-700">{selectedAssessment.description}</p>
              )}
              
              {selectedAssessment.questions && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contoh Soal:</h3>
                  <div className="space-y-4">
                    {selectedAssessment.questions.slice(0, 3).map((question, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        {question.options && (
                          <div className="space-y-1 ml-4">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="text-sm text-gray-600">
                                {String.fromCharCode(65 + optionIndex)}. {option}
                              </div>
                            ))}
                          </div>
                        )}
                        {question.correctAnswer && (
                          <p className="text-sm text-green-600 mt-2">
                            <strong>Jawaban:</strong> {question.correctAnswer}
                          </p>
                        )}
                        {question.explanation && (
                          <p className="text-sm text-blue-600 mt-1">
                            <strong>Penjelasan:</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAssessment.multipleChoice && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Pilihan Ganda ({selectedAssessment.multipleChoice.questions.length} soal):</h3>
                  <div className="space-y-4">
                    {selectedAssessment.multipleChoice.questions.slice(0, 2).map((question, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-1 ml-4">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="text-sm text-gray-600">
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-green-600 mt-2">
                          <strong>Jawaban:</strong> {question.correctAnswer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAssessment.essay && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Essay ({selectedAssessment.essay.questions.length} soal):</h3>
                  <div className="space-y-4">
                    {selectedAssessment.essay.questions.slice(0, 2).map((question, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <p className="text-sm text-blue-600">
                          <strong>Poin Jawaban:</strong> {question.keyPoints.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAssessment.modules && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Modul Quiz:</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedAssessment.modules.map((module, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{module.questions.length} soal</p>
                        <p className="text-sm text-gray-600">Tipe: {module.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAssessment.rubric && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Rubrik Penilaian:</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedAssessment.rubric.map((rubricItem, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">{rubricItem.aspect}</h4>
                        <div className="space-y-1">
                          {rubricItem.criteria.map((criterion, criterionIndex) => (
                            <div key={criterionIndex} className="text-sm">
                              <span className="text-gray-600">{criterion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAssessment(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
              >
                Tutup
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                Mulai Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jobsheet Detail Modal */}
      {selectedJobsheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedJobsheet.title}</h2>
              <button
                onClick={() => setSelectedJobsheet(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                {selectedJobsheet.objectives && (
                  <div className="mb-3">
                    <p className="text-gray-800 font-semibold mb-1">🎯 Tujuan Sesi:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {selectedJobsheet.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-gray-700"><strong>Durasi:</strong> {selectedJobsheet.duration || '—'}</p>
              </div>

              {selectedJobsheet.practical_session?.experiments && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">🧪 Eksperimen/Praktikum:</h3>
                  <div className="space-y-3">
                    {selectedJobsheet.practical_session.experiments.map((exp) => (
                      <div key={exp.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="font-medium text-gray-900">{exp.title}</div>
                        {exp.equipment && (
                          <div className="mt-2 text-sm text-gray-700">
                            <div className="font-semibold">Peralatan:</div>
                            <ul className="list-disc list-inside">
                              {exp.equipment.slice(0, 4).map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJobsheet.pre_session?.safety_briefing && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">⚠️ Keselamatan Kerja:</h3>
                  <div className="space-y-2">
                    {selectedJobsheet.pre_session.safety_briefing.map((safety, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 p-3 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-red-500 mr-2">⚠️</span>
                          <span className="text-red-700">{safety}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJobsheet.practical_session?.experiments?.length ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">📋 Langkah Utama:</h3>
                  <div className="space-y-3">
                    {selectedJobsheet.practical_session.experiments[0]?.procedures?.slice(0, 4).map((p, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <div className="flex items-start">
                          <span className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-blue-900">{p.action || p.description || 'Langkah'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedJobsheet(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
              >
                Tutup
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}