import React, { useState, useEffect } from 'react';
import { moduleQuizSystem } from '../data/moduleQuizSystem.js';
import { learningProgressManager } from '../utils/learningProgress.js';

const ModuleQuizComponent = ({ moduleId, currentUser, onComplete, onClose }) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionsOrder, setQuestionsOrder] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  // Initialize quiz
  useEffect(() => {
    const quiz = moduleQuizSystem.module_quizzes.find(q => q.module_id === moduleId);
    if (quiz) {
      setCurrentQuiz(quiz);
      // Shuffle questions if enabled
      const questions = quiz.questions;
      const shuffled = moduleQuizSystem.quiz_settings.shuffle_questions 
        ? [...questions].sort(() => Math.random() - 0.5)
        : questions;
      setQuestionsOrder(shuffled.map((_, index) => index));
      setTimeRemaining(quiz.time_limit * 60); // Convert to seconds
    }
  }, [moduleId]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const startQuiz = () => {
    setQuizStarted(true);
    setIsTimerActive(true);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const handleTimeUp = () => {
    if (moduleQuizSystem.quiz_settings.auto_submit_on_time_up) {
      submitQuiz();
    } else {
      alert('Waktu habis! Silakan submit quiz Anda.');
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    const responseTime = questionStartTime ? (Date.now() - questionStartTime) / 1000 : 0;
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer: answerIndex,
        response_time: responseTime,
        timestamp: Date.now()
      }
    }));

    // Reset timer for next question
    setQuestionStartTime(Date.now());
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else {
      submitQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    }
  };

  const submitQuiz = () => {
    const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
    const results = calculateResults(totalTime);
    setQuizResults(results);
    setQuizCompleted(true);
    setIsTimerActive(false);
    setShowResults(true);

    // Save to learning progress
    learningProgressManager.saveQuizResult(currentUser.id, {
      moduleId,
      quizId: currentQuiz.quiz_id,
      results,
      timestamp: Date.now()
    });

    if (onComplete) {
      onComplete(results);
    }
  };

  const calculateResults = (totalTime) => {
    let correctAnswers = 0;
    let totalScore = 0;
    const questionResults = [];
    let totalResponseTime = 0;

    currentQuiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = userAnswer && userAnswer.answer === question.correct_answer;
      
      if (isCorrect) {
        correctAnswers++;
        let questionScore = moduleQuizSystem.scoring_system.correct_answer;
        
        // Bonus for speed (if answered quickly)
        if (moduleQuizSystem.scoring_system.bonus_for_speed && userAnswer.response_time < 10) {
          const speedBonus = Math.max(0, moduleQuizSystem.scoring_system.max_bonus_points - (userAnswer.response_time / 5));
          questionScore += speedBonus;
        }
        
        totalScore += questionScore;
      }

      if (userAnswer) {
        totalResponseTime += userAnswer.response_time;
      }

      questionResults.push({
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer ? userAnswer.answer : null,
        correctAnswer: question.correct_answer,
        isCorrect,
        options: question.options,
        explanation: question.explanation,
        difficulty: question.difficulty,
        learningObjective: question.learning_objective,
        responseTime: userAnswer ? userAnswer.response_time : null
      });
    });

    const percentage = (correctAnswers / currentQuiz.questions.length) * 100;
    const passed = percentage >= moduleQuizSystem.quiz_settings.passing_score;
    const averageResponseTime = totalResponseTime / currentQuiz.questions.length;

    return {
      totalQuestions: currentQuiz.questions.length,
      correctAnswers,
      incorrectAnswers: currentQuiz.questions.length - correctAnswers,
      percentage: Math.round(percentage * 10) / 10,
      totalScore,
      passed,
      totalTime,
      averageResponseTime,
      questionResults,
      moduleId,
      moduleTitle: currentQuiz.module_title,
      attempts: learningProgressManager.getQuizAttempts(currentUser.id, moduleId) + 1
    };
  };

  const getPerformanceAnalysis = () => {
    if (!quizResults) return null;

    const analysis = {
      strengths: [],
      weaknesses: [],
      recommendations: []
    };

    // Analyze by difficulty
    const difficultyStats = {};
    quizResults.questionResults.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = { correct: 0, total: 0 };
      }
      difficultyStats[q.difficulty].total++;
      if (q.isCorrect) difficultyStats[q.difficulty].correct++;
    });

    Object.entries(difficultyStats).forEach(([difficulty, stats]) => {
      const percentage = (stats.correct / stats.total) * 100;
      if (percentage >= 80) {
        analysis.strengths.push(`Strong understanding of ${difficulty} level concepts (${percentage.toFixed(0)}%)`);
      } else if (percentage < 60) {
        analysis.weaknesses.push(`Need improvement in ${difficulty} level concepts (${percentage.toFixed(0)}%)`);
      }
    });

    // Analyze by learning objectives
    const objectiveStats = {};
    quizResults.questionResults.forEach(q => {
      if (!objectiveStats[q.learningObjective]) {
        objectiveStats[q.learningObjective] = { correct: 0, total: 0 };
      }
      objectiveStats[q.learningObjective].total++;
      if (q.isCorrect) objectiveStats[q.learningObjective].correct++;
    });

    Object.entries(objectiveStats).forEach(([objective, stats]) => {
      const percentage = (stats.correct / stats.total) * 100;
      if (percentage < 70) {
        analysis.weaknesses.push(`Need to review: ${objective}`);
        analysis.recommendations.push(`Study more about: ${objective}`);
      }
    });

    // Response time analysis
    if (quizResults.averageResponseTime > 30) {
      analysis.recommendations.push('Practice more to improve response time');
    } else if (quizResults.averageResponseTime < 10) {
      analysis.strengths.push('Excellent response time - shows good understanding');
    }

    return analysis;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizStarted(false);
    setQuizCompleted(false);
    setShowResults(false);
    setQuizResults(null);
    setTimeRemaining(currentQuiz.time_limit * 60);
    setIsTimerActive(false);
    setShowExplanation(false);
  };

  if (!currentQuiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const analysis = getPerformanceAnalysis();
    
    return (
      <div className="quiz-results bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        {/* Results Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Quiz Results: {currentQuiz.module_title}
          </h2>
          <div className={`text-4xl font-bold mb-2 ${
            quizResults.passed ? 'text-green-600' : 'text-red-600'
          }`}>
            {quizResults.percentage}%
          </div>
          <div className={`text-lg font-semibold ${
            quizResults.passed ? 'text-green-600' : 'text-red-600'
          }`}>
            {quizResults.passed ? '✅ PASSED' : '❌ FAILED'}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {quizResults.correctAnswers} out of {quizResults.totalQuestions} correct
          </div>
        </div>

        {/* Results Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{quizResults.totalScore}</div>
            <div className="text-sm text-blue-600">Total Score</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{formatTime(Math.round(quizResults.totalTime))}</div>
            <div className="text-sm text-green-600">Total Time</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{quizResults.attempts}</div>
            <div className="text-sm text-purple-600">Attempt #</div>
          </div>
        </div>

        {/* Performance Analysis */}
        {analysis && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Performance Analysis</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.strengths.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Strengths</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.weaknesses.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">⚠️ Areas for Improvement</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index}>• {weakness}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {analysis.recommendations.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Recommendations</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Question Review */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Question Review</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {quizResults.questionResults.map((result, index) => (
              <div key={result.questionId} className={`border rounded-lg p-4 ${
                result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">Question {index + 1}</h4>
                  <div className={`text-sm font-semibold ${
                    result.isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                  </div>
                </div>
                
                <p className="text-sm mb-3">{result.question}</p>
                
                <div className="grid grid-cols-1 gap-2 mb-3">
                  {result.options.map((option, optIndex) => (
                    <div key={optIndex} className={`text-xs p-2 rounded ${
                      optIndex === result.correctAnswer ? 'bg-green-200 text-green-800' :
                      optIndex === result.userAnswer && optIndex !== result.correctAnswer ? 'bg-red-200 text-red-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {optIndex === result.userAnswer && '👉 '}{option}
                      {optIndex === result.correctAnswer && ' ✓'}
                    </div>
                  ))}
                </div>

                {result.explanation && (
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                    <strong>Explanation:</strong> {result.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {!quizResults.passed && quizResults.attempts < moduleQuizSystem.quiz_settings.max_attempts && (
            <button
              onClick={retakeQuiz}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Retake Quiz ({moduleQuizSystem.quiz_settings.max_attempts - quizResults.attempts} attempts left)
            </button>
          )}
          
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Print Results
          </button>
          
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-intro bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentQuiz.module_title}
          </h2>
          <p className="text-gray-600">{currentQuiz.description}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">Quiz Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Questions:</strong> {currentQuiz.questions.length}
            </div>
            <div>
              <strong>Time Limit:</strong> {currentQuiz.time_limit} minutes
            </div>
            <div>
              <strong>Passing Score:</strong> {moduleQuizSystem.quiz_settings.passing_score}%
            </div>
            <div>
              <strong>Attempts Allowed:</strong> {moduleQuizSystem.quiz_settings.max_attempts}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Instructions</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Read each question carefully before selecting your answer</li>
            <li>• You can navigate between questions during the quiz</li>
            <li>• The quiz will auto-submit when time runs out</li>
            <li>• You will see explanations after completing the quiz</li>
            <li>• Make sure you have a stable internet connection</li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={startQuiz}
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[questionsOrder[currentQuestionIndex] || currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestion.id];

  return (
    <div className="quiz-active bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      {/* Header with progress and timer */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {currentQuiz.module_title}
          </h2>
          <p className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'
          }`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-600">Time Remaining</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold flex-1">{currentQuestion.question}</h3>
          <div className="ml-4 text-sm">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>
        </div>

        {/* Answer options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                currentAnswer && currentAnswer.answer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  currentAnswer && currentAnswer.answer === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {currentAnswer && currentAnswer.answer === index && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <span className="text-sm">{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning objective */}
      <div className="bg-gray-50 p-3 rounded-lg mb-6">
        <div className="text-xs text-gray-600">
          <strong>Learning Objective:</strong> {currentQuestion.learning_objective}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Answered: {Object.keys(userAnswers).length} / {currentQuiz.questions.length}
        </div>

        {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
          <button
            onClick={submitQuiz}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>

      {/* Question overview */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="font-semibold text-sm mb-3">Question Overview</h4>
        <div className="grid grid-cols-10 gap-1">
          {currentQuiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 text-xs rounded ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : userAnswers[currentQuiz.questions[questionsOrder[index] || index].id]
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleQuizComponent;