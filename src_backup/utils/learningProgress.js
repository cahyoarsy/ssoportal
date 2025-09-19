// Learning Progress Management System
export class LearningProgressManager {
  constructor() {
    this.progressKey = 'iml_learning_progress';
    this.sessionKey = 'iml_current_session';
  }

  // Initialize progress for a user
  initializeProgress(userId) {
    const progress = {
      userId,
      currentModule: null,
      completedModules: [],
      moduleProgress: {},
      assessmentResults: {},
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      totalTimeSpent: 0,
      achievements: []
    };
    
    this.saveProgress(progress);
    return progress;
  }

  // Get current progress
  getProgress(userId) {
    const stored = localStorage.getItem(`${this.progressKey}_${userId}`);
    return stored ? JSON.parse(stored) : this.initializeProgress(userId);
  }

  // Save progress
  saveProgress(progress) {
    progress.lastActivity = new Date().toISOString();
    localStorage.setItem(`${this.progressKey}_${progress.userId}`, JSON.stringify(progress));
  }

  // Start module
  startModule(userId, moduleId) {
    const progress = this.getProgress(userId);
    progress.currentModule = moduleId;
    
    if (!progress.moduleProgress[moduleId]) {
      progress.moduleProgress[moduleId] = {
        startTime: new Date().toISOString(),
        sections: {},
        timeSpent: 0,
        status: 'in-progress'
      };
    }
    
    this.saveProgress(progress);
    return progress;
  }

  // Complete module
  completeModule(userId, moduleId) {
    const progress = this.getProgress(userId);
    
    if (!progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
    }
    
    if (progress.moduleProgress[moduleId]) {
      progress.moduleProgress[moduleId].status = 'completed';
      progress.moduleProgress[moduleId].completedTime = new Date().toISOString();
    }
    
    // Check for achievements
    this.checkAchievements(progress);
    
    this.saveProgress(progress);
    return progress;
  }

  // Save assessment result
  saveAssessmentResult(userId, assessmentId, result) {
    const progress = this.getProgress(userId);
    
    progress.assessmentResults[assessmentId] = {
      ...result,
      completedTime: new Date().toISOString(),
      attempts: (progress.assessmentResults[assessmentId]?.attempts || 0) + 1
    };
    
    this.saveProgress(progress);
    
    // Send to monitoring system
    this.sendToMonitoring(userId, {
      type: 'assessment',
      assessmentId,
      result
    });
    
    return progress;
  }

  // --- New: Quiz-specific helpers ---
  saveQuizResult(userId, payload) {
    // payload: { moduleId, quizId, results, timestamp? }
    const progress = this.getProgress(userId);
    const { moduleId, quizId, results } = payload;

    if (!progress.assessmentResults.quizzes) {
      progress.assessmentResults.quizzes = {};
    }

    const key = quizId || moduleId;
    const prev = progress.assessmentResults.quizzes[key];
    progress.assessmentResults.quizzes[key] = {
      ...results,
      attempts: (prev?.attempts || 0) + 1,
      lastAttemptAt: new Date().toISOString(),
    };

    // Maintain last score mirror for overall analytics
    progress.assessmentResults[key] = {
      score: results.percentage,
      completedTime: new Date().toISOString(),
      attempts: (prev?.attempts || 0) + 1,
      type: 'module_quiz',
    };

    this.saveProgress(progress);

    // Send to monitoring
    this.sendToMonitoring(userId, {
      type: 'quiz',
      moduleId,
      quizId: key,
      result: results,
    });

    return progress;
  }

  getQuizAttempts(userId, moduleIdOrQuizId) {
    const progress = this.getProgress(userId);
    const key = moduleIdOrQuizId;
    return progress.assessmentResults?.quizzes?.[key]?.attempts || 0;
  }

  // --- New: Practical assessment helpers ---
  startPracticalAssessment(userId) {
    const progress = this.getProgress(userId);
    progress.assessmentResults.practical = progress.assessmentResults.practical || {
      status: 'in-progress',
      startedAt: new Date().toISOString(),
    };
    this.saveProgress(progress);
    return progress;
  }

  completePracticalAssessment(userId, finalForm) {
    const progress = this.getProgress(userId);
    progress.assessmentResults.practical = {
      ...finalForm,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
    // Mirror score for analytics
    progress.assessmentResults['practical_overall'] = {
      score: finalForm?.overall_result?.weighted_score || 0,
      completedTime: new Date().toISOString(),
      type: 'practical',
    };
    this.saveProgress(progress);

    this.sendToMonitoring(userId, {
      type: 'practical_assessment',
      result: finalForm,
    });

    return progress;
  }

  // Check achievements
  checkAchievements(progress) {
    const achievements = [];
    
    // First module completed
    if (progress.completedModules.length === 1 && 
        !progress.achievements.includes('first_module')) {
      achievements.push('first_module');
    }
    
    // All modules completed
    if (progress.completedModules.length >= 4 && 
        !progress.achievements.includes('all_modules')) {
      achievements.push('all_modules');
    }
    
    // Perfect assessment
    Object.values(progress.assessmentResults).forEach(result => {
      if (result.score >= 95 && !progress.achievements.includes('perfect_score')) {
        achievements.push('perfect_score');
      }
    });
    
    progress.achievements.push(...achievements);
    return achievements;
  }

  // Send data to monitoring system
  async sendToMonitoring(userId, data) {
    try {
      const monitoringData = {
        userId,
        timestamp: new Date().toISOString(),
        courseId: 'iml',
        ...data
      };
      
      // Store in localStorage for now (can be enhanced to send to server)
      const monitoringKey = 'monitoring_data';
      const existing = JSON.parse(localStorage.getItem(monitoringKey) || '[]');
      existing.push(monitoringData);
      localStorage.setItem(monitoringKey, JSON.stringify(existing));
      
      console.log('Data sent to monitoring:', monitoringData);
    } catch (error) {
      console.error('Failed to send monitoring data:', error);
    }
  }

  // Get learning analytics
  getAnalytics(userId) {
    const progress = this.getProgress(userId);
    
    return {
      completionRate: (progress.completedModules.length / 4) * 100,
      timeSpent: progress.totalTimeSpent,
      assessmentsCompleted: Object.keys(progress.assessmentResults).length,
      averageScore: this.calculateAverageScore(progress.assessmentResults),
      achievements: progress.achievements.length,
      currentStreak: this.calculateStreak(progress)
    };
  }

  // Calculate average assessment score
  calculateAverageScore(assessmentResults) {
    const scores = Object.values(assessmentResults).map(r => r.score || 0);
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  // Calculate learning streak
  calculateStreak(progress) {
    // Simple implementation - can be enhanced
    return progress.completedModules.length;
  }

  // Check if module is unlocked
  isModuleUnlocked(userId, moduleId) {
    const progress = this.getProgress(userId);
    
    // Module 1 is always unlocked
    const normalId = this.normalizeModuleId(moduleId);
    if (normalId === 'modul-1') return true;
    
    // Other modules require previous completion
    const moduleOrder = ['modul-1', 'modul-2', 'modul-3', 'modul-4', 'modul-5', 'modul-6', 'modul-7', 'modul-8'];
    const currentIndex = moduleOrder.indexOf(normalId);
    
    if (currentIndex <= 0) return true;
    
    const previousModule = moduleOrder[currentIndex - 1];
    return progress.completedModules.includes(previousModule);
  }

  // Get next recommended action
  getNextAction(userId) {
    const progress = this.getProgress(userId);
    
    // If no modules started, recommend starting with module 1
    if (progress.completedModules.length === 0) {
      return {
        type: 'start_module',
        moduleId: 'modul-1',
        message: 'Mulai dengan Modul 1: Dasar-Dasar Motor Listrik'
      };
    }
    
    // If not all modules completed, recommend next module
    if (progress.completedModules.length < 8) {
      const nextModuleIndex = progress.completedModules.length;
      const moduleOrder = ['modul-1', 'modul-2', 'modul-3', 'modul-4', 'modul-5', 'modul-6', 'modul-7', 'modul-8'];
      return {
        type: 'continue_module',
        moduleId: moduleOrder[nextModuleIndex],
        message: `Lanjutkan ke ${moduleOrder[nextModuleIndex]}`
      };
    }
    
    // If all modules completed, recommend assessment
    return {
      type: 'take_assessment',
      assessmentId: 'posttest',
      message: 'Ambil Post-Test untuk menyelesaikan pembelajaran'
    };
  }

  // Normalize module id (supports 'module-1' -> 'modul-1')
  normalizeModuleId(moduleId) {
    if (!moduleId) return moduleId;
    return moduleId.startsWith('module-')
      ? moduleId.replace('module-', 'modul-')
      : moduleId;
  }
}

// Export singleton instance
export const learningProgress = new LearningProgressManager();
// Backward/alternate alias export for components expecting a different name
export const learningProgressManager = learningProgress;