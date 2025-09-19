import React, { useState, useEffect } from 'react';
import { practicalAssessmentSystem, assessmentFormTemplate } from '../data/practicalAssessmentSystem.js';
import { learningProgressManager } from '../utils/learningProgress.js';

const PracticalAssessmentComponent = ({ currentUser, onComplete }) => {
  const [currentStation, setCurrentStation] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [assessmentForm, setAssessmentForm] = useState({
    ...assessmentFormTemplate,
    student_info: {
      ...assessmentFormTemplate.student_info,
      name: currentUser?.name || '',
      id: currentUser?.id || '',
      assessment_date: new Date().toISOString().split('T')[0],
      assessor_name: 'System Assessment'
    }
  });
  
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [taskScores, setTaskScores] = useState({});
  const [currentTaskStartTime, setCurrentTaskStartTime] = useState(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const stations = practicalAssessmentSystem.assessment_stations;
  const currentStationData = stations[currentStation];
  const currentTaskData = currentStationData?.tasks[currentTask];

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

  const startStation = () => {
    if (!assessmentStarted) {
      setAssessmentStarted(true);
      learningProgressManager.startPracticalAssessment(currentUser.id);
    }
    
    const stationDuration = parseInt(currentStationData.duration) * 60; // Convert to seconds
    setTimeRemaining(stationDuration);
    setIsTimerActive(true);
    setCurrentTaskStartTime(Date.now());
  };

  const handleTimeUp = () => {
    alert(`Waktu untuk ${currentStationData.title} telah habis!`);
    if (currentStation < stations.length - 1) {
      nextStation();
    } else {
      completeAssessment();
    }
  };

  const scoreTask = (taskId, score, notes = '') => {
    const newTaskScores = {
      ...taskScores,
      [taskId]: {
        score,
        notes,
        time_taken: currentTaskStartTime ? (Date.now() - currentTaskStartTime) / 1000 : 0
      }
    };
    setTaskScores(newTaskScores);

    // Update assessment form
    const stationKey = `station_${currentStation + 1}`;
    const currentStationScore = calculateStationScore(currentStation, newTaskScores);
    
    setAssessmentForm(prev => ({
      ...prev,
      station_scores: {
        ...prev.station_scores,
        [stationKey]: {
          ...prev.station_scores[stationKey],
          score: currentStationScore
        }
      }
    }));
  };

  const calculateStationScore = (stationIndex, scores) => {
    const station = stations[stationIndex];
    let totalScore = 0;
    let totalPossible = 0;

    station.tasks.forEach(task => {
      const taskScore = scores[task.id];
      if (taskScore) {
        totalScore += taskScore.score;
      }
      totalPossible += task.points;
    });

    return totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
  };

  const nextTask = () => {
    if (currentTask < currentStationData.tasks.length - 1) {
      setCurrentTask(currentTask + 1);
      setCurrentTaskStartTime(Date.now());
    } else {
      nextStation();
    }
  };

  const nextStation = () => {
    if (currentStation < stations.length - 1) {
      setCurrentStation(currentStation + 1);
      setCurrentTask(0);
      setIsTimerActive(false);
      setCurrentTaskStartTime(null);
    } else {
      completeAssessment();
    }
  };

  const calculateOverallScore = () => {
    let weightedScore = 0;
    
    stations.forEach((station, index) => {
      const stationKey = `station_${index + 1}`;
      const stationScore = assessmentForm.station_scores[stationKey].score;
      weightedScore += (stationScore * station.weight) / 100;
    });

    return weightedScore;
  };

  const determineCompetencyLevel = (score) => {
    if (score >= 75) return 'Competent';
    if (score >= 60) return 'Developing';
    return 'Not Yet Competent';
  };

  const completeAssessment = () => {
    const overallScore = calculateOverallScore();
    const competencyLevel = determineCompetencyLevel(overallScore);
    
    const finalAssessmentForm = {
      ...assessmentForm,
      overall_result: {
        weighted_score: overallScore,
        certification_level: competencyLevel,
        pass_fail: overallScore >= 75 ? 'PASS' : 'FAIL',
        recommendations: generateRecommendations(overallScore, competencyLevel),
        areas_for_improvement: identifyImprovementAreas(),
        next_steps: generateNextSteps(competencyLevel)
      }
    };

    // Save to learning progress
    learningProgressManager.completePracticalAssessment(
      currentUser.id,
      finalAssessmentForm
    );

    setAssessmentForm(finalAssessmentForm);
    setShowResults(true);
    setIsTimerActive(false);

    if (onComplete) {
      onComplete(finalAssessmentForm);
    }
  };

  const generateRecommendations = (score, level) => {
    const recommendations = [];
    
    if (level === 'Competent') {
      recommendations.push('Ready for independent work with minimal supervision');
      recommendations.push('Can progress to advanced motor control topics');
      recommendations.push('Eligible for industry certification exams');
    } else if (level === 'Developing') {
      recommendations.push('Additional practical training required');
      recommendations.push('Mentored work experience needed');
      recommendations.push('Review specific weak areas identified');
    } else {
      recommendations.push('Repeat training program');
      recommendations.push('Focus on fundamental concepts');
      recommendations.push('Extensive supervised practice required');
    }
    
    return recommendations;
  };

  const identifyImprovementAreas = () => {
    const areas = [];
    
    Object.entries(assessmentForm.station_scores).forEach(([stationKey, data]) => {
      if (data.score < 75) {
        const stationIndex = parseInt(stationKey.split('_')[1]) - 1;
        const station = stations[stationIndex];
        areas.push(station.title);
      }
    });
    
    return areas;
  };

  const generateNextSteps = (level) => {
    const steps = [];
    
    if (level === 'Competent') {
      steps.push('Apply for motor technician positions');
      steps.push('Consider advanced training in VFD and servo systems');
      steps.push('Pursue industry certifications');
    } else {
      steps.push('Schedule remedial training sessions');
      steps.push('Practice identified weak areas');
      steps.push('Re-take assessment after improvement');
    }
    
    return steps;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="practical-assessment-results bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Hasil Penilaian Praktik IML</h2>
          <div className="mt-4">
            <div className={`text-4xl font-bold ${
              assessmentForm.overall_result.weighted_score >= 75 ? 'text-green-600' : 
              assessmentForm.overall_result.weighted_score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {assessmentForm.overall_result.weighted_score.toFixed(1)}%
            </div>
            <div className={`text-xl font-semibold mt-2 ${
              assessmentForm.overall_result.pass_fail === 'PASS' ? 'text-green-600' : 'text-red-600'
            }`}>
              {assessmentForm.overall_result.certification_level} - {assessmentForm.overall_result.pass_fail}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Skor Per Station</h3>
            <div className="space-y-2">
              {stations.map((station, index) => {
                const stationKey = `station_${index + 1}`;
                const score = assessmentForm.station_scores[stationKey].score;
                return (
                  <div key={station.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{station.title}</span>
                    <span className={`font-semibold ${
                      score >= 75 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {score.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Rekomendasi</h3>
            <ul className="space-y-1 text-sm">
              {assessmentForm.overall_result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {assessmentForm.overall_result.areas_for_improvement.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-orange-600">Area yang Perlu Diperbaiki</h3>
            <div className="flex flex-wrap gap-2">
              {assessmentForm.overall_result.areas_for_improvement.map((area, index) => (
                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Langkah Selanjutnya</h3>
          <ul className="space-y-1 text-sm">
            {assessmentForm.overall_result.next_steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">→</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mr-4"
          >
            Cetak Sertifikat
          </button>
          <button
            onClick={() => setShowResults(false)}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!assessmentStarted) {
    return (
      <div className="practical-assessment-intro bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Penilaian Praktik Instalasi Motor Listrik (IML)
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Gambaran Umum Assessment</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Total Durasi:</strong> {practicalAssessmentSystem.overview.total_duration}</p>
              <p><strong>Passing Score:</strong> {practicalAssessmentSystem.overview.passing_score}%</p>
              <p><strong>Jumlah Station:</strong> {stations.length} station</p>
              <p><strong>Jenis Assessment:</strong> Performance-based practical assessment</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold">Station Assessment:</h3>
          {stations.map((station, index) => (
            <div key={station.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{station.title}</h4>
                <div className="text-sm text-gray-600">
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    {station.duration} | {station.weight}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{station.description}</p>
              <div className="text-xs text-gray-500">
                <strong>Tasks:</strong> {station.tasks.length} tasks
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Instruksi Penting</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Gunakan APD (Alat Pelindung Diri) yang sesuai</li>
            <li>• Ikuti prosedur keselamatan kerja yang telah ditetapkan</li>
            <li>• Setiap station memiliki waktu yang terbatas</li>
            <li>• Tanyakan kepada assessor jika ada hal yang tidak jelas</li>
            <li>• Bekerja secara sistematis dan hati-hati</li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={startStation}
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Mulai Assessment Praktik
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="practical-assessment-active bg-white rounded-lg shadow-lg p-6">
      {/* Header with progress and timer */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Station {currentStation + 1}: {currentStationData.title}
          </h2>
          <p className="text-sm text-gray-600">
            Task {currentTask + 1} of {currentStationData.tasks.length}: {currentTaskData.title}
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
          <span>Progress: Station {currentStation + 1}/{stations.length}</span>
          <span>{Math.round(((currentStation * stations.length + currentTask + 1) / (stations.length * stations.reduce((acc, s) => acc + s.tasks.length, 0))) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentStation * stations.length + currentTask + 1) / (stations.length * stations.reduce((acc, s) => acc + s.tasks.length, 0))) * 100}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Current task content */}
      <div className="border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{currentTaskData.title}</h3>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            {currentTaskData.points} points
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Instruksi:</h4>
            <ul className="space-y-1">
              {currentTaskData.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {currentTaskData.tools_required && (
            <div>
              <h4 className="font-semibold mb-2">Tools Required:</h4>
              <div className="flex flex-wrap gap-2">
                {currentTaskData.tools_required.map((tool, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {currentTaskData.safety_notes && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Safety Notes:</h4>
              <ul className="space-y-1">
                {currentTaskData.safety_notes.map((note, index) => (
                  <li key={index} className="text-sm text-red-700">• {note}</li>
                ))}
              </ul>
            </div>
          )}

          {currentTaskData.time_limit && (
            <div className="text-sm text-orange-600">
              <strong>Time Limit:</strong> {currentTaskData.time_limit}
            </div>
          )}
        </div>
      </div>

      {/* Scoring section */}
      <div className="border rounded-lg p-4 mb-6 bg-gray-50">
        <h4 className="font-semibold mb-3">Assessment Scoring</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(currentTaskData.assessment_criteria).map(([level, criteria]) => (
            <div key={level} className="border rounded p-3 bg-white">
              <h5 className="font-semibold text-sm mb-2">{level}</h5>
              <ul className="text-xs space-y-1">
                {criteria.map((criterion, index) => (
                  <li key={index}>• {criterion}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Quick scoring buttons (for demonstration) */}
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <button
            onClick={() => scoreTask(currentTaskData.id, currentTaskData.points * 0.95)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Excellent (95%)
          </button>
          <button
            onClick={() => scoreTask(currentTaskData.id, currentTaskData.points * 0.85)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Good (85%)
          </button>
          <button
            onClick={() => scoreTask(currentTaskData.id, currentTaskData.points * 0.70)}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Satisfactory (70%)
          </button>
          <button
            onClick={() => scoreTask(currentTaskData.id, currentTaskData.points * 0.50)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Needs Improvement (50%)
          </button>
        </div>

        <button
          onClick={nextTask}
          disabled={!taskScores[currentTaskData.id]}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {currentTask < currentStationData.tasks.length - 1 ? 'Next Task' : 
           currentStation < stations.length - 1 ? 'Next Station' : 'Complete Assessment'}
        </button>
      </div>
    </div>
  );
};

export default PracticalAssessmentComponent;