import { useState } from 'react';

/**
 * Custom hook for managing navigation state
 * @param {string} initialView - Initial view/route
 * @returns {Object} Navigation state and methods
 */
export const useNavigation = (initialView = 'dashboard') => {
  const [currentView, setCurrentView] = useState(initialView);
  const [history, setHistory] = useState([initialView]);

  const navigateTo = (view) => {
    setCurrentView(view);
    setHistory(prev => [...prev, view]);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const previousView = newHistory[newHistory.length - 1];
      setCurrentView(previousView);
      setHistory(newHistory);
    }
  };

  const resetNavigation = (view = 'dashboard') => {
    setCurrentView(view);
    setHistory([view]);
  };

  const canGoBack = history.length > 1;

  return {
    currentView,
    history,
    navigateTo,
    goBack,
    resetNavigation,
    canGoBack
  };
};