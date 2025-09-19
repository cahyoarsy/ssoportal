import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Feature imports using barrel exports
import { UltimateLoginPortal } from '../features/auth';
import { SimpleDashboard } from '../features/dashboard';
import { ELearningPage } from '../features/elearning';
import { IMLPage } from '../features/iml';
import { SoftwarePage } from '../features/software';
import { EKTSWebApp } from '../features/ekts';
import { ElectricalCadDesigner } from '../features/electricalCad';
import { DrawCadSimulatorFixed as DrawCadSimulator } from '../features/drawCadSimulation/DrawCadSimulatorFixed';
import { MonitoringPage } from '../features/monitoring';

// Hooks
import { useAuth, useNavigation } from '../hooks';

function App() {
  console.log('🚀 [APP] Enhanced App function called');
  
  // Using custom hooks for state management
  const { isAuthenticated, user, loading, login, logout } = useAuth();
  const { currentView, navigateTo, goBack } = useNavigation();

  const handleModuleSelect = (moduleId) => {
    console.log('Module selected:', moduleId);
    navigateTo(moduleId);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">SSO Portal</h1>
          <p className="text-slate-600 dark:text-slate-400">Memuat aplikasi...</p>
        </motion.div>
      </div>
    );
  }
  
  // Show ultimate login portal if not authenticated
  if (!isAuthenticated) {
    return (
      <UltimateLoginPortal 
        onLogin={login}
      />
    );
  }

  // Show different views based on currentView state
  return (
    <AnimatePresence mode="wait">
      {currentView === 'dashboard' && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <SimpleDashboard 
            user={user}
            onLogout={logout}
            onModuleSelect={handleModuleSelect}
          />
        </motion.div>
      )}

      {currentView === 'elearning' && (
        <motion.div
          key="elearning"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ELearningPage
            user={user}
            onBack={goBack}
            onModuleSelect={handleModuleSelect}
            onOpenIMLPage={handleModuleSelect}
          />
        </motion.div>
      )}

      {currentView === 'software' && (
        <motion.div
          key="software"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <SoftwarePage
            user={user}
            onNavigate={navigateTo}
          />
        </motion.div>
      )}

      {currentView === 'ekts' && (
        <motion.div
          key="ekts"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <EKTSWebApp
            user={user}
            onNavigate={navigateTo}
          />
        </motion.div>
      )}

      {currentView === 'electricalCad' && (
        <motion.div
          key="electricalCad"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ElectricalCadDesigner onNavigate={navigateTo} />
        </motion.div>
      )}

      {currentView === 'drawCadSimulation' && (
        <motion.div
          key="drawCadSimulation"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <DrawCadSimulator onNavigate={navigateTo} />
        </motion.div>
      )}

      {currentView === 'iml' && (
        <motion.div
          key="iml"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <IMLPage
            user={user}
            onBack={goBack}
            onModuleSelect={handleModuleSelect}
          />
        </motion.div>
      )}

      {currentView === 'monitoring' && (
        <motion.div
          key="monitoring"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <MonitoringPage
            user={user}
            onBack={goBack}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;