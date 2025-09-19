import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { learningProgressManager } from '../utils/learningProgress';

export default function AssessmentComponent({ 
  assessment, 
  user, 
  onComplete, 
  onBack 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [essayAnswers, setEssayAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState('multiple-choice'); // 'multiple-choice', 'essay', 'completed'
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Parse duration to seconds
  useEffect(() => {
    if (assessment && started) {
      const duration = assessment.duration;
      let seconds = 0;
      
      if (duration.includes('menit')) {
        const minutes = parseInt(duration.match(/\d+/)[0]);
        seconds = minutes * 60;
      }
      
      setTimeLeft(seconds);
    }
  }, [assessment, started]);

  // Timer countdown
  useEffect(() => {
    if (started && !submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && started && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, started, submitted]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleEssayAnswer = (questionId, answer) => {
    setEssayAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    let totalScore = 0;
    let results = {
      multipleChoice: {},
      essay: {}
    };

    // Calculate multiple choice score
    if (assessment.data.questions || assessment.data.multipleChoice) {
      const mcQuestions = assessment.data.questions || assessment.data.multipleChoice;
      const correctMC = mcQuestions.reduce((count, question) => {
        const isCorrect = answers[question.id] === question.correctAnswer;
        results.multipleChoice[question.id] = {
          answer: answers[question.id],
          correct: isCorrect,
          explanation: question.explanation
        };
        return count + (isCorrect ? 1 : 0);
      }, 0);
      
      const mcScore = (correctMC / mcQuestions.length) * 100;
      
      if (assessment.type === 'mixed') {
        // For mixed type, MC is 70% of total score
        totalScore += mcScore * 0.7;
      } else {
        totalScore = mcScore;
      }
    }

    // Handle essay questions (if any)
    if (assessment.data.essays || assessment.data.essay) {
      const essayQuestions = assessment.data.essays || assessment.data.essay.questions;
      essayQuestions.forEach(question => {
        results.essay[question.id] = {
          answer: essayAnswers[question.id] || '',
          points: question.points,
          needsManualGrading: true
        };
      });
      
      // For mixed type, assume 30% from essay (will need manual grading)
      if (assessment.type === 'mixed') {
        // For now, give partial score for essay completion
        const essayCompletionRate = Object.keys(essayAnswers).length / essayQuestions.length;
        totalScore += (essayCompletionRate * 100) * 0.3;
      }
    }

    const finalResult = {
      type: assessment.type,
      score: Math.round(totalScore),
      results,
      timeSpent: getTimeSpent(),
      passed: totalScore >= assessment.passingScore,
      needsManualGrading: !!results.essay && Object.keys(results.essay).length > 0
    };

    // Save to learning progress and monitoring
  learningProgressManager.saveAssessmentResult(user.id, assessment.id, finalResult);
    
    // Send to monitoring system
    sendToMonitoring(finalResult);
    
    setPhase('completed');
    
    if (onComplete) {
      onComplete(finalResult);
    }
  };

  const sendToMonitoring = (result) => {
    try {
      const monitoringData = {
        userId: user.id,
        userName: user.name || 'Unknown',
        email: user.email || '',
        assessmentId: assessment.id,
        assessmentTitle: assessment.title,
        timestamp: new Date().toISOString(),
        score: result.score,
        passed: result.passed,
        timeSpent: result.timeSpent,
        totalQuestions: getTotalQuestions(),
        needsManualGrading: result.needsManualGrading,
        answers: {
          multipleChoice: answers,
          essay: essayAnswers
        },
        results: result.results
      };

      // Store in monitoring system
      const existingData = JSON.parse(localStorage.getItem('monitoring_assessments') || '[]');
      existingData.push(monitoringData);
      localStorage.setItem('monitoring_assessments', JSON.stringify(existingData));

      console.log('Assessment result sent to monitoring:', monitoringData);
    } catch (error) {
      console.error('Failed to send to monitoring:', error);
    }
  };

  const getTimeSpent = () => {
    const totalDuration = assessment.duration.includes('menit') 
      ? parseInt(assessment.duration.match(/\d+/)[0]) * 60 
      : 0;
    return totalDuration - timeLeft;
  };

  const getTotalQuestions = () => {
    let total = 0;
    if (assessment.data.questions) total += assessment.data.questions.length;
    if (assessment.data.multipleChoice) total += assessment.data.multipleChoice.length;
    if (assessment.data.essays) total += assessment.data.essays.length;
    if (assessment.data.essay?.questions) total += assessment.data.essay.questions.length;
    return total;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestions = () => {
    if (phase === 'multiple-choice') {
      return assessment.data.questions || assessment.data.multipleChoice || [];
    } else if (phase === 'essay') {
      return assessment.data.essays || assessment.data.essay?.questions || [];
    }
    return [];
  };

  const currentQuestions = getCurrentQuestions();
  const currentQ = currentQuestions[currentQuestion];

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-2">{assessment.title}</h2>
            <p className="text-gray-600 mb-4">{assessment.description}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Informasi Assessment</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Jumlah Soal:</span>
                <span className="ml-2 font-medium">{getTotalQuestions()}</span>
              </div>
              <div>
                <span className="text-gray-600">Durasi:</span>
                <span className="ml-2 font-medium">{assessment.duration}</span>
              </div>
              <div>
                <span className="text-gray-600">Nilai Lulus:</span>
                <span className="ml-2 font-medium">{assessment.passingScore}%</span>
              </div>
              <div>
                <span className="text-gray-600">Tipe:</span>
                <span className="ml-2 font-medium capitalize">{assessment.type}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">Petunjuk:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Pastikan koneksi internet stabil</li>
              <li>• Jawab semua pertanyaan dengan teliti</li>
              <li>• Waktu akan berjalan otomatis setelah mulai</li>
              <li>• Simpan jawaban secara berkala</li>
              {assessment.type === 'mixed' && (
                <li>• Assessment terdiri dari pilihan ganda dan essay</li>
              )}
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
            >
              Kembali
            </button>
            <button
              onClick={handleStart}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Mulai Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'completed') {
    const score = Math.round(Object.values(answers).filter((answer, index) => {
      const questions = assessment.data.questions || assessment.data.multipleChoice || [];
      return answer === questions[index]?.correctAnswer;
    }).length / (assessment.data.questions?.length || assessment.data.multipleChoice?.length || 1) * 100);

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg">
          <div className={`text-6xl mb-4 ${score >= assessment.passingScore ? 'text-green-500' : 'text-red-500'}`}>
            {score >= assessment.passingScore ? '🎉' : '😔'}
          </div>
          <h2 className="text-2xl font-bold mb-2">Assessment Selesai!</h2>
          <div className="text-3xl font-bold mb-4 text-blue-600">{score}%</div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Waktu Pengerjaan:</span>
                <span className="ml-2 font-medium">{formatTime(getTimeSpent())}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 font-medium ${score >= assessment.passingScore ? 'text-green-600' : 'text-red-600'}`}>
                  {score >= assessment.passingScore ? 'LULUS' : 'TIDAK LULUS'}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            {score >= assessment.passingScore 
              ? 'Selamat! Anda telah lulus assessment ini.' 
              : `Anda belum mencapai nilai minimum (${assessment.passingScore}%). Silakan ulangi assessment.`}
          </p>

          {assessment.type === 'mixed' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                ℹ️ Hasil essay akan direview secara manual oleh instruktur dan nilai akhir akan diupdate.
              </p>
            </div>
          )}

          <div className="space-x-4">
            <button
              onClick={onBack}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Kembali
            </button>
            {score < assessment.passingScore && assessment.type !== 'mixed' && (
              <button
                onClick={() => {
                  setStarted(false);
                  setSubmitted(false);
                  setAnswers({});
                  setEssayAnswers({});
                  setCurrentQuestion(0);
                  setPhase('multiple-choice');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Ulangi Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Assessment Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <p className="text-purple-100">
              {phase === 'multiple-choice' ? 'Bagian A: Pilihan Ganda' : 'Bagian B: Essay'}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 px-3 py-1 rounded-lg mb-2">
              ⏰ {formatTime(timeLeft)}
            </div>
            <div className="text-sm">
              Soal {currentQuestion + 1} dari {currentQuestions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        {phase === 'multiple-choice' && currentQ && (
          <div>
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
        )}

        {phase === 'essay' && currentQ && (
          <div>
            <h3 className="text-lg font-semibold mb-2">{currentQ.question}</h3>
            <div className="text-sm text-gray-600 mb-4">Poin: {currentQ.points}</div>
            <textarea
              value={essayAnswers[currentQ.id] || ''}
              onChange={(e) => handleEssayAnswer(currentQ.id, e.target.value)}
              placeholder="Tuliskan jawaban Anda di sini..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="text-sm text-gray-500 mt-2">
              Tips: Jelaskan dengan detail dan berikan contoh jika memungkinkan.
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(prev => prev - 1);
            } else if (phase === 'essay') {
              // Go back to last MC question
              setPhase('multiple-choice');
              const mcQuestions = assessment.data.questions || assessment.data.multipleChoice || [];
              setCurrentQuestion(mcQuestions.length - 1);
            }
          }}
          disabled={currentQuestion === 0 && phase === 'multiple-choice'}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          ← Sebelumnya
        </button>
        
        <div className="space-x-4">
          {currentQuestion === currentQuestions.length - 1 ? (
            phase === 'multiple-choice' && assessment.type === 'mixed' ? (
              <button
                onClick={() => {
                  setPhase('essay');
                  setCurrentQuestion(0);
                }}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
              >
                Lanjut ke Essay →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Selesai Assessment
              </button>
            )
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
    </div>
  );
}