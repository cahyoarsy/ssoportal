import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { learningProgressManager } from '../utils/learningProgress';

export default function ModuleLearning({ 
  user, 
  moduleId, 
  onBack, 
  onComplete 
}) {
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(null);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  // Normalize external ids like 'module-1' to internal keys 'modul-1'
  const normalizeModuleId = (id) => (id && id.startsWith('module-') ? id.replace('module-', 'modul-') : id);
  const internalModuleId = normalizeModuleId(moduleId);
  // Module data structure
  const modules = {
    'modul-1': {
      title: 'Dasar-Dasar Motor Listrik',
      description: 'Pengenalan komponen dan prinsip kerja motor listrik',
      duration: '8 jam',
      sections: [
        {
          id: 'section-1',
          title: 'Pengenalan Motor Listrik',
          content: {
            type: 'presentation',
            slides: [
              {
                title: 'Apa itu Motor Listrik?',
                content: 'Motor listrik adalah mesin yang mengubah energi listrik menjadi energi mekanik (putaran). Motor 3 fasa adalah jenis motor AC yang paling umum digunakan dalam industri.',
                image: '/images/motor-basics.jpg',
                points: [
                  'Konversi energi listrik ke mekanik',
                  'Prinsip induksi elektromagnetik',
                  'Efisiensi tinggi dan handal',
                  'Aplikasi luas di industri'
                ]
              },
              {
                title: 'Jenis-Jenis Motor Listrik',
                content: 'Motor listrik dibagi menjadi beberapa jenis berdasarkan sumber listrik dan konstruksinya.',
                points: [
                  'Motor DC: Motor arus searah dengan brush dan komutator',
                  'Motor AC: Motor arus bolak-balik (1 fasa dan 3 fasa)',
                  'Motor Induksi: Jenis motor AC paling umum, tanpa brush',
                  'Motor Sinkron: Kecepatan konstan sesuai frekuensi'
                ],
                comparison: {
                  'Motor DC': {
                    kelebihan: ['Kontrol kecepatan mudah', 'Torsi starting tinggi'],
                    kekurangan: ['Memerlukan maintenance brush', 'Biaya lebih mahal']
                  },
                  'Motor AC Induksi': {
                    kelebihan: ['Konstruksi sederhana', 'Maintenance minimal', 'Biaya rendah'],
                    kekurangan: ['Kontrol kecepatan kompleks', 'Power factor rendah saat no load']
                  }
                }
              },
              {
                title: 'Komponen Utama Motor 3 Fasa',
                content: 'Motor induksi 3 fasa terdiri dari dua komponen utama: stator dan rotor.',
                components: [
                  {
                    name: 'Stator',
                    description: 'Bagian diam motor yang menghasilkan medan magnet putar',
                    parts: ['Frame/casing', 'Core/inti besi', 'Winding/belitan', 'Terminal box']
                  },
                  {
                    name: 'Rotor',
                    description: 'Bagian berputar yang menghasilkan torsi',
                    types: [
                      'Squirrel cage: Konstruksi sederhana, batang konduktor',
                      'Wound rotor: Dilengkapi slip ring, dapat dikontrol eksternal'
                    ]
                  },
                  {
                    name: 'Bearing',
                    description: 'Menumpu rotor agar dapat berputar dengan gesekan minimal',
                    types: ['Ball bearing', 'Roller bearing', 'Sleeve bearing']
                  }
                ]
              },
              {
                title: 'Prinsip Kerja Motor Induksi',
                content: 'Motor induksi bekerja berdasarkan prinsip induksi elektromagnetik dan medan magnet putar.',
                principles: [
                  {
                    step: 1,
                    title: 'Medan Magnet Putar',
                    description: 'Arus 3 fasa pada stator menghasilkan medan magnet yang berputar dengan kecepatan sinkron'
                  },
                  {
                    step: 2,
                    title: 'Induksi EMF',
                    description: 'Medan putar memotong konduktor rotor dan menginduksi EMF (gaya gerak listrik)'
                  },
                  {
                    step: 3,
                    title: 'Arus Rotor',
                    description: 'EMF yang terinduksi menyebabkan arus mengalir pada konduktor rotor'
                  },
                  {
                    step: 4,
                    title: 'Torsi',
                    description: 'Interaksi arus rotor dengan medan magnet menghasilkan torsi yang memutar rotor'
                  }
                ],
                formulas: [
                  {
                    name: 'Kecepatan Sinkron',
                    formula: 'ns = (120 × f) / p',
                    variables: {
                      'ns': 'Kecepatan sinkron (RPM)',
                      'f': 'Frekuensi (Hz)',
                      'p': 'Jumlah kutub'
                    }
                  },
                  {
                    name: 'Slip',
                    formula: 's = (ns - nr) / ns × 100%',
                    variables: {
                      's': 'Slip (%)',
                      'ns': 'Kecepatan sinkron (RPM)',
                      'nr': 'Kecepatan rotor (RPM)'
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          id: 'section-2',
          title: 'Spesifikasi dan Rating Motor',
          content: {
            type: 'interactive',
            topics: [
              {
                title: 'Nameplate Motor',
                description: 'Membaca dan memahami informasi pada nameplate motor',
                nameplate: {
                  'Model': 'ABC-150M',
                  'Power': '5.5 kW / 7.5 HP',
                  'Voltage': '380V/660V',
                  'Current': '11.2A/6.5A',
                  'Frequency': '50 Hz',
                  'Speed': '1450 RPM',
                  'Power Factor': '0.86',
                  'Efficiency': '87.5%',
                  'Insulation Class': 'F',
                  'IP Rating': 'IP55',
                  'Duty': 'S1 (Continuous)'
                },
                explanations: {
                  'Power': 'Daya keluaran motor dalam kW dan HP',
                  'Voltage': 'Tegangan kerja (star/delta configuration)',
                  'Current': 'Arus nominal pada tegangan kerja',
                  'Speed': 'Kecepatan nominal rotor (dengan slip)',
                  'Power Factor': 'Faktor daya motor pada beban penuh',
                  'Efficiency': 'Efisiensi motor pada beban nominal',
                  'Insulation Class': 'Kelas isolasi (suhu maksimum operasi)',
                  'IP Rating': 'Tingkat proteksi terhadap debu dan air'
                }
              },
              {
                title: 'Perhitungan Dasar Motor',
                examples: [
                  {
                    problem: 'Motor 4 kutub pada frekuensi 50 Hz, berapa kecepatan sinkronnya?',
                    solution: {
                      given: 'p = 4 kutub, f = 50 Hz',
                      formula: 'ns = (120 × f) / p',
                      calculation: 'ns = (120 × 50) / 4 = 1500 RPM',
                      answer: '1500 RPM'
                    }
                  },
                  {
                    problem: 'Motor dengan ns = 1500 RPM, nr = 1450 RPM, berapa slip-nya?',
                    solution: {
                      given: 'ns = 1500 RPM, nr = 1450 RPM',
                      formula: 's = (ns - nr) / ns × 100%',
                      calculation: 's = (1500 - 1450) / 1500 × 100% = 3.33%',
                      answer: '3.33%'
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          id: 'section-3',
          title: 'Karakteristik Motor Induksi',
          content: {
            type: 'simulation',
            simulations: [
              {
                title: 'Kurva Torsi vs Kecepatan',
                description: 'Visualisasi karakteristik torsi motor induksi pada berbagai kondisi beban',
                interactive: true,
                parameters: ['Tegangan', 'Frekuensi', 'Resistansi rotor'],
                curves: {
                  'Starting Torque': 'Torsi saat motor mulai berputar (nr = 0)',
                  'Pull-up Torque': 'Torsi minimum selama akselerasi',
                  'Breakdown Torque': 'Torsi maksimum motor',
                  'Full Load Torque': 'Torsi pada beban penuh'
                }
              }
            ]
          }
        }
      ],
      quiz: {
        title: 'Quiz Modul 1: Dasar-Dasar Motor Listrik',
        timeLimit: 20, // minutes
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'Komponen utama motor induksi 3 fasa terdiri dari?',
            options: [
              'Stator dan rotor',
              'Stator, rotor, dan komutator', 
              'Rotor dan komutator',
              'Stator dan brush'
            ],
            correctAnswer: 0,
            explanation: 'Motor induksi 3 fasa terdiri dari stator (bagian diam) dan rotor (bagian berputar).'
          },
          {
            id: 2,
            question: 'Kecepatan sinkron motor 4 kutub pada frekuensi 50 Hz adalah?',
            options: ['1500 RPM', '3000 RPM', '1000 RPM', '750 RPM'],
            correctAnswer: 0,
            explanation: 'ns = (120 × f) / p = (120 × 50) / 4 = 1500 RPM'
          },
          {
            id: 3,
            question: 'Rating tegangan motor 380V menunjukkan?',
            options: [
              'Tegangan line to line (antar fasa)',
              'Tegangan line to neutral',
              'Tegangan maksimum',
              'Tegangan minimum'
            ],
            correctAnswer: 0,
            explanation: 'Rating 380V pada motor 3 fasa menunjukkan tegangan line to line (antar fasa).'
          },
          {
            id: 4,
            question: 'Slip pada motor induksi adalah?',
            options: [
              'Perbedaan kecepatan sinkron dengan kecepatan rotor',
              'Kehilangan daya pada motor',
              'Perbedaan tegangan stator dan rotor',
              'Efisiensi motor'
            ],
            correctAnswer: 0,
            explanation: 'Slip adalah perbedaan kecepatan medan putar stator dengan kecepatan rotor aktual.'
          },
          {
            id: 5,
            question: 'Prinsip kerja motor induksi berdasarkan?',
            options: [
              'Induksi elektromagnetik dan medan magnet putar',
              'Komutasi mekanis',
              'Gaya gravitasi',
              'Efek piezoelektrik'
            ],
            correctAnswer: 0,
            explanation: 'Motor induksi bekerja berdasarkan prinsip induksi elektromagnetik dari medan magnet putar stator.'
          }
        ]
      }
    },

    'modul-2': {
      title: 'Rangkaian Kontrol Motor',
      description: 'Sistem kontrol dan pengoperasian motor listrik',
      duration: '12 jam',
      sections: [
        {
          id: 'section-1',
          title: 'Komponen Kontrol Motor',
          content: {
            type: 'presentation',
            slides: [
              {
                title: 'Kontaktor',
                content: 'Kontaktor adalah saklar elektromagnetik untuk mengontrol arus besar dengan sinyal kontrol kecil',
                components: [
                  'Main contact: Untuk arus utama motor',
                  'Auxiliary contact: Untuk rangkaian kontrol',
                  'Coil: Untuk mengoperasikan kontaktor',
                  'Arc chute: Untuk memadamkan busur api'
                ]
              }
            ]
          }
        }
      ],
      quiz: {
        title: 'Quiz Modul 2: Rangkaian Kontrol Motor',
        timeLimit: 20,
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'Kontaktor berfungsi untuk?',
            options: [
              'Menghubung dan memutus rangkaian motor secara otomatis',
              'Mengatur kecepatan motor',
              'Melindungi motor dari overload',
              'Mengubah tegangan motor'
            ],
            correctAnswer: 0,
            explanation: 'Kontaktor adalah saklar elektromagnetik untuk mengontrol on/off motor secara otomatis.'
          }
        ]
      }
    }
  };

  useEffect(() => {
    if (user && internalModuleId) {
      const userProgress = learningProgressManager.getProgress(user.id);
      setProgress(userProgress);
      learningProgressManager.startModule(user.id, internalModuleId);
    }
  }, [user, internalModuleId]);

  const currentModule = modules[internalModuleId];
  const currentSectionData = currentModule?.sections[currentSection];

  const handleSectionComplete = (sectionId) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
    
    // Auto advance to next section
    if (currentSection < currentModule.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      // All sections completed, show quiz
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (score) => {
    setQuizScore(score);
    
    if (score >= currentModule.quiz.passingScore) {
      // Module completed successfully
      learningProgressManager.completeModule(user.id, internalModuleId);
      if (onComplete) {
        onComplete(internalModuleId, score);
      }
    }
  };

  const renderSection = () => {
    if (!currentSectionData) return null;

    const { content } = currentSectionData;

    switch (content.type) {
      case 'presentation':
        return (
          <div className="space-y-6">
            {content.slides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold mb-4">{slide.title}</h3>
                <p className="text-gray-700 mb-4">{slide.content}</p>
                
                {slide.points && (
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    {slide.points.map((point, i) => (
                      <li key={i} className="text-gray-600">{point}</li>
                    ))}
                  </ul>
                )}
                
                {slide.components && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {slide.components.map((comp, i) => (
                      <div key={i} className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800">{comp.name}</h4>
                        <p className="text-blue-600 text-sm">{comp.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            
            <div className="flex justify-end">
              <button
                onClick={() => handleSectionComplete(currentSectionData.id)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Selesai Section
              </button>
            </div>
          </div>
        );

      default:
        return <div>Content type not implemented yet</div>;
    }
  };

  if (showQuiz) {
    return (
      <ModuleQuiz
        module={currentModule}
        onComplete={handleQuizComplete}
        onBack={() => setShowQuiz(false)}
        user={user}
      />
    );
  }

  if (!currentModule) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Module tidak ditemukan</p>
        <button onClick={onBack} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{currentModule.title}</h1>
            <p className="text-blue-100">{currentModule.description}</p>
          </div>
          <button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
          >
            ← Kembali
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress Modul</span>
          <span className="text-sm text-gray-500">
            {completedSections.size} / {currentModule.sections.length} selesai
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(completedSections.size / currentModule.sections.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <h3 className="font-semibold mb-3">Daftar Section</h3>
        <div className="space-y-2">
          {currentModule.sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                index === currentSection
                  ? 'bg-blue-100 text-blue-800'
                  : completedSections.has(section.id)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentSection(index)}
            >
              <div className="flex-1">
                <div className="font-medium">{section.title}</div>
              </div>
              <div className="text-sm">
                {completedSections.has(section.id) ? '✓' : index === currentSection ? '▶' : '○'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Section Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">{currentSectionData?.title}</h2>
        {renderSection()}
      </div>
    </div>
  );
}

// Quiz Component
function ModuleQuiz({ module, onComplete, onBack, user }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(module.quiz.timeLimit * 60); // seconds
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    const correctAnswers = module.quiz.questions.reduce((count, question) => {
      return count + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctAnswers / module.quiz.questions.length) * 100);
    
    // Save quiz result
    const moduleKey = (module.id || internalModuleId || '').toString();
    learningProgressManager.saveAssessmentResult(user.id, `quiz-${moduleKey}`, {
      type: 'quiz',
      score,
      answers,
      timeSpent: (module.quiz.timeLimit * 60) - timeLeft,
      passed: score >= module.quiz.passingScore
    });
    
    onComplete(score);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = module.quiz.questions[currentQuestion];

  if (submitted) {
    const score = Math.round((Object.keys(answers).filter(qId => 
      answers[qId] === module.quiz.questions.find(q => q.id == qId)?.correctAnswer
    ).length / module.quiz.questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg">
          <div className={`text-6xl mb-4 ${score >= module.quiz.passingScore ? 'text-green-500' : 'text-red-500'}`}>
            {score >= module.quiz.passingScore ? '🎉' : '😔'}
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Selesai!</h2>
          <div className="text-3xl font-bold mb-4 text-blue-600">{score}%</div>
          <p className="text-gray-600 mb-6">
            {score >= module.quiz.passingScore 
              ? 'Selamat! Anda telah lulus quiz ini.' 
              : 'Anda belum mencapai nilai minimum. Silakan ulangi quiz.'}
          </p>
          <div className="space-x-4">
            <button
              onClick={onBack}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Kembali ke Modul
            </button>
            {score < module.quiz.passingScore && (
              <button
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setCurrentQuestion(0);
                  setTimeLeft(module.quiz.timeLimit * 60);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Ulangi Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold">{module.quiz.title}</h1>
        <div className="flex justify-between items-center mt-4">
          <span>Soal {currentQuestion + 1} dari {module.quiz.questions.length}</span>
          <span className="bg-white/20 px-3 py-1 rounded-lg">
            ⏰ {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                answers[currentQ.id] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={index}
                checked={answers[currentQ.id] === index}
                onChange={() => handleAnswerSelect(currentQ.id, index)}
                className="mr-3"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          ← Sebelumnya
        </button>
        
        {currentQuestion === module.quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Selesai Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Selanjutnya →
          </button>
        )}
      </div>
    </div>
  );
}