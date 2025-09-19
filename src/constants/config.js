// App Configuration Constants
export const APP_CONFIG = {
  NAME: 'SSO Portal',
  VERSION: '1.0.0',
  DESCRIPTION: 'Single Sign-On Portal untuk Pembelajaran TITL SMK',
  COPYRIGHT: '© 2025 SSO Portal. All rights reserved.'
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  RETRY_COUNT: 3
};

// Theme Configuration
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#3B82F6',
  SECONDARY_COLOR: '#6366F1',
  SUCCESS_COLOR: '#10B981',
  WARNING_COLOR: '#F59E0B',
  ERROR_COLOR: '#EF4444'
};

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  AUTH_TOKEN: 'auth_token',
  THEME: 'theme',
  LANGUAGE: 'language',
  PROGRESS: 'learning_progress'
};