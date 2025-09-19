import { saveJobSheet, saveTestResult } from '../utils/elearningStore';
import logger, { createLogger } from '../utils/logger';

/**
 * SSO Portal Core Authentication System
 * Mengelola authentication, authorization, session management untuk semua module
 */

class SSOCore {
  constructor() {
    this.TOKEN_KEY = 'sso-portal-session';
    this.USER_KEY = 'sso-portal-user';
    this.PREFS_KEY = 'sso-portal-preferences';
    this.ACTIVITY_KEY = 'sso-portal-activity';
    // Basic runtime config holder (e.g., Google OAuth clientId)
    this.config = {
      google: {
        clientId: ''
      }
    };
    
    this.session = null;
    this.user = null;
    this.preferences = this.loadPreferences();
    this.listeners = new Set();
    this.modules = new Map();
    
    // Initialize
    this.init();
  }

  init() {
    // Ensure Google OAuth clientId is wired from environment if provided
    try {
      const envClientId = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_GOOGLE_CLIENT_ID)
        ? import.meta.env.VITE_GOOGLE_CLIENT_ID
        : '';
      if (!this.config.google.clientId && envClientId) {
        this.config.google.clientId = envClientId;
        logger.info('Google Client ID configured from env.');
      }
    } catch (_) { /* no-op */ }

    this.restoreSession();
    this.setupMessageHandling();
    this.setupTokenRefresh();
    this.trackActivity();
  }

  // ===== Session Management =====
  
  restoreSession() {
    try {
      const sessionData = sessionStorage.getItem(this.TOKEN_KEY);
      const userData = localStorage.getItem(this.USER_KEY);
      
      if (sessionData && userData) {
        const session = JSON.parse(sessionData);
        const user = JSON.parse(userData);
        
        // Validate session
        if (this.isValidSession(session)) {
          this.session = session;
          this.user = user;
          this.broadcast('session_restored', { user, session });
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      logger.warn('Failed to restore session:', error);
      this.clearSession();
    }
  }

  isValidSession(session) {
    if (!session || !session.token || !session.expiresAt) return false;
    return new Date(session.expiresAt) > new Date();
  }

  createSession(loginData) {
    const { email, role, provider } = loginData;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 hours
    
    const session = {
      id: this.generateSessionId(),
      token: this.generateJWT(loginData),
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastActivity: now.toISOString(),
      provider,
      ipAddress: this.getClientIP(),
      user: undefined
    };

    const user = {
      email,
      role,
      name: loginData.name || email.split('@')[0],
      avatar: loginData.avatar || this.generateAvatar(email),
      loginCount: this.getLoginCount(email) + 1,
      lastLogin: now.toISOString()
    };

  this.session = session;
    this.user = user;
  this.session.user = { email: user.email, role: user.role, name: user.name, avatar: user.avatar };
    
    // Persist
    sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(session));
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    // Log activity
    this.logActivity('login', { provider, email, role });
    
    // Broadcast to all modules
    this.broadcast('session_created', { user, session });
    
    return { user, session };
  }

  createSessionFromLocal({ email, role = 'user', name, avatar, provider = 'local' }) {
    const sessionData = this.createSession({ email, role, name, avatar, provider });
    return sessionData;
  }

  // Allow external services (e.g., local auth) to set/create session
  setSession(session) {
    try {
      this.session = session;
      this.user = session.user || this.user;
      sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(this.session));
      if (this.user) localStorage.setItem(this.USER_KEY, JSON.stringify(this.user));
      this.broadcast('session_created', { user: this.user, session: this.session });
    } catch (err) {
      logger.error('Failed to set session:', err);
    }
  }

  refreshSession() {
    if (!this.session || !this.isValidSession(this.session)) {
      this.clearSession();
      return false;
    }

    const now = new Date();
    this.session.lastActivity = now.toISOString();
    this.session.expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();
    
    sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(this.session));
    this.broadcast('session_refreshed', { session: this.session });
    
    return true;
  }

  clearSession() {
    const wasLoggedIn = !!this.session;
    
    this.session = null;
    this.user = null;
    
    sessionStorage.removeItem(this.TOKEN_KEY);
    // Keep user data in localStorage for quick re-login
    
    if (wasLoggedIn) {
      this.logActivity('logout');
      this.broadcast('session_cleared');
    }
  }

  // ===== Module Management =====
  
  registerModule(moduleId, config) {
    const module = {
      id: moduleId,
      name: config.name,
      path: config.path,
      requiresAuth: config.requiresAuth !== false,
      adminOnly: config.adminOnly === true,
      permissions: config.permissions || [],
      iframe: null,
      ready: false
    };
    
    this.modules.set(moduleId, module);
    this.broadcast('module_registered', { module });
    
    return module;
  }

  canAccessModule(moduleId) {
    const module = this.modules.get(moduleId);
    if (!module) return false;
    
    // Public modules
    if (!module.requiresAuth) return true;
    
    // Need authentication
    if (!this.isAuthenticated()) return false;
    
    // Admin only modules
    if (module.adminOnly && !this.isAdmin()) return false;
    
    // Permission check
    if (module.permissions.length > 0) {
      return module.permissions.some(perm => this.hasPermission(perm));
    }
    
    return true;
  }

  loadModule(moduleId, container) {
    if (!this.canAccessModule(moduleId)) {
      throw new Error(`Access denied to module: ${moduleId}`);
    }
    
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module not found: ${moduleId}`);
    }
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = module.path;
    iframe.className = 'w-full h-full border-0';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
    
    // Setup communication
    iframe.onload = () => {
      module.iframe = iframe;
      module.ready = true;
      this.syncModuleSession(moduleId);
      this.broadcast('module_loaded', { moduleId, module });
    };
    
    container.appendChild(iframe);
    return iframe;
  }

  syncModuleSession(moduleId) {
    const module = this.modules.get(moduleId);
    if (!module || !module.iframe || !module.ready) return;
    
    try {
      const data = {
        type: 'SSO_SESSION_SYNC',
        session: this.session,
        user: this.user,
        preferences: this.preferences,
        moduleConfig: {
          id: moduleId,
          permissions: this.getUserPermissions()
        }
      };
      
      module.iframe.contentWindow.postMessage(data, '*');
    } catch (error) {
      logger.warn('Failed to sync session with module:', moduleId, error);
    }
  }

  // ===== Authorization =====
  
  isAuthenticated() {
    return !!this.session && this.isValidSession(this.session);
  }

  isAdmin() {
    return this.isAuthenticated() && this.user?.role === 'admin';
  }

  hasPermission(permission) {
    if (!this.isAuthenticated()) return false;
    if (this.isAdmin()) return true; // Admin has all permissions
    
    const userPermissions = this.getUserPermissions();
    return userPermissions.includes(permission);
  }

  getUserPermissions() {
    if (!this.user) return [];
    
    const basePermissions = ['profile.view', 'profile.edit'];
    const rolePermissions = {
      admin: ['*'], // All permissions
      user: ['elearning.access', 'tests.take'],
      teacher: ['elearning.access', 'elearning.manage', 'tests.create', 'students.view']
    };
    
    return [...basePermissions, ...(rolePermissions[this.user.role] || [])];
  }

  // ===== Event System =====
  
  addEventListener(event, callback) {
    const listener = { event, callback };
    this.listeners.add(listener);
    
    return () => this.listeners.delete(listener);
  }

  removeEventListener(event, callback){
    // Optional explicit removal API
    for (const listener of this.listeners) {
      if (listener.event === event && listener.callback === callback) {
        this.listeners.delete(listener);
      }
    }
  }

  broadcast(event, data = {}) {
    // Broadcast to local listeners
    this.listeners.forEach(listener => {
      if (listener.event === event || listener.event === '*') {
        try {
          // Provide a CustomEvent-like payload for UI handlers expecting event.detail
          const evt = {
            type: event,
            event, // backward compat
            detail: data,
            data,  // backward compat
            timestamp: new Date().toISOString()
          };
          listener.callback(evt);
        } catch (error) {
          logger.warn('Listener error:', error);
        }
      }
    });
    
    // Broadcast to all loaded modules
    this.modules.forEach(module => {
      if (module.iframe && module.ready) {
        try {
          module.iframe.contentWindow.postMessage({
            type: 'SSO_EVENT',
            event,
            data
          }, '*');
        } catch (error) {
          logger.warn('Module broadcast error:', error);
        }
      }
    });
  }

  // ===== Message Handling =====
  
  setupMessageHandling() {
    const log = createLogger('SSO:msg');
    window.addEventListener('message', (event) => {
      if (!event.data || typeof event.data !== 'object') return;
      // log.trace('recv', event.origin, event.data?.type);
      const { type, moduleId, data } = event.data;
      
  switch (type) {
        case 'SSO_REQUEST_SESSION':
          this.handleSessionRequest(event.source, moduleId);
          break;
          
        case 'SSO_LOGOUT':
          this.clearSession();
          break;
          
        case 'SSO_ACTIVITY':
          this.logActivity(data.action, data.details);
          break;
          
        case 'SSO_MODULE_READY':
          this.handleModuleReady(moduleId);
          break;
          
        case 'SSO_PREFERENCE_UPDATE':
          this.updatePreferences(data);
          break;
          
        // E-Learning specific messages
        case 'MODULE_REGISTER':
          this.handleModuleRegistration(event.source, event.data);
          break;
          
        case 'REQUEST_SESSION':
          this.handleElearningSessionRequest(event.source, moduleId);
          break;
          
        case 'ELEARNING_PROGRESS':
          this.handleElearningProgress(moduleId, event.data);
          break;
          
        case 'SECTION_COMPLETED':
          this.handleSectionCompletion(moduleId, event.data);
          break;

        case 'ELEARNING_JOB_SHEET':
          this.handleJobSheetSubmission(moduleId, event.data);
          break;

        case 'ELEARNING_TEST_RESULT':
          this.handleTestResult(moduleId, event.data);
          break;

        // Persisted E‑Learning artifacts
        case 'ELEARNING_JOB_SHEET':
          this.handleJobSheetSubmission(moduleId, event.data);
          break;

        case 'ELEARNING_TEST_RESULT':
          this.handleTestResult(moduleId, event.data);
          break;
          
        case 'SESSION_EXPIRED':
          this.handleElearningSessionExpired(event.source, moduleId);
          break;
          
        case 'REQUEST_LOGOUT':
          this.handleElearningLogout(event.source, moduleId);
          break;
        case 'ELEARNING_JOB_SHEET':
          this.handleJobSheetSubmission(moduleId, data || event.data);
          break;
        case 'ELEARNING_TEST_RESULT':
          this.handleTestResult(moduleId, data || event.data);
          break;
      }
    });
  }

  handleSessionRequest(source, moduleId) {
    const module = this.modules.get(moduleId);
    if (!module || module.iframe?.contentWindow !== source) return;
    
    this.syncModuleSession(moduleId);
  }

  handleModuleReady(moduleId) {
    const module = this.modules.get(moduleId);
    if (module) {
      module.ready = true;
      this.syncModuleSession(moduleId);
    }
  }

  // ===== E-Learning Integration Handlers =====
  
  handleModuleRegistration(source, data) {
    const { moduleId, appName, version, capabilities, currentPage } = data;
    
    console.log('E-Learning module registering:', { moduleId, appName, currentPage });
    
    // Register or update module info
    const moduleInfo = {
      id: moduleId,
      name: appName,
      version: version,
      capabilities: capabilities || [],
      currentPage: currentPage,
      source: source,
      lastActivity: Date.now(),
      progress: {},
      ready: true
    };
    
    this.modules.set(moduleId, moduleInfo);
    
    // Log activity
    this.logActivity('module_register', {
      moduleId,
      appName,
      currentPage,
      capabilities
    });
    
    // Send current session if available
    this.handleElearningSessionRequest(source, moduleId);
  }
  
  handleElearningSessionRequest(source, moduleId) {
    if (!this.session || !this.user) {
      // No active session - inform module
      source.postMessage({
        type: 'SSO_SESSION_EXPIRED',
        moduleId,
        timestamp: Date.now()
      }, '*');
      return;
    }
    
    // Send current session to e-learning module
    const sessionToken = this.generateJWT({
      sub: this.user.id,
      email: this.user.email,
      name: this.user.name,
      role: this.user.role
    });
    
    source.postMessage({
      type: 'SSO_SESSION_UPDATE',
      moduleId,
      token: sessionToken,
      user: this.user,
      timestamp: Date.now()
    }, '*');
    
    // Log activity
    this.logActivity('session_sync', {
      moduleId,
      user: this.user.email,
      action: 'session_provided'
    });
  }
  
  handleElearningProgress(moduleId, data) {
    const { progress } = data;
    
    // Update module progress tracking
    const module = this.modules.get(moduleId);
    if (module) {
      module.progress = {
        ...module.progress,
        ...progress,
        lastUpdate: Date.now()
      };
      module.lastActivity = Date.now();
    }
    
    // Log activity
    this.logActivity('elearning_progress', {
      moduleId,
      currentPage: progress.currentPage,
      timeSpent: progress.timeSpent,
      completedSections: progress.completedSections?.length || 0
    });
    
    // Broadcast progress update to listeners
    this.broadcast('elearning_progress_updated', {
      moduleId,
      progress,
      module
    });
  }
  
  handleSectionCompletion(moduleId, data) {
    const { sectionId, progress } = data;
    
    // Update module progress
    const module = this.modules.get(moduleId);
    if (module) {
      module.progress = {
        ...module.progress,
        ...progress,
        lastUpdate: Date.now()
      };
      module.lastActivity = Date.now();
    }
    
    // Log completion
    this.logActivity('section_completed', {
      moduleId,
      sectionId,
      user: this.user?.email,
      currentPage: progress.currentPage,
      totalCompleted: progress.completedSections?.length || 0
    });
    
    // Broadcast completion event
    this.broadcast('section_completed', {
      moduleId,
      sectionId,
      progress,
      user: this.user
    });
  }
  
  handleElearningSessionExpired(source, moduleId) {
    // E-learning module reports session expired
  logger.info('E-Learning module reports session expired:', moduleId);
    
    // If we have a valid session, resend it
    if (this.session && this.user && this.isValidSession(this.session)) {
      this.handleElearningSessionRequest(source, moduleId);
    } else {
      // Session truly expired - clear and notify
      this.clearSession();
    }
  }
  
  handleElearningLogout(source, moduleId) {
  logger.info('E-Learning module requests logout:', moduleId);
    
    // Log activity
    this.logActivity('logout_requested', {
      moduleId,
      user: this.user?.email,
      initiatedBy: 'elearning_module'
    });
    
    // Clear session (will notify all modules)
    this.clearSession();
  }

  // ===== E‑Learning Artifacts Persistence =====
  handleJobSheetSubmission(moduleId, payload) {
    try {
      const email = this.user?.email;
      if (!email) return;
      const module = moduleId || payload?.moduleId || 'elearning-iml';
      const saved = saveJobSheet(email, module, payload?.jobSheet || payload?.data || payload);
      this.logActivity('jobsheet_submitted', { moduleId: module, email, id: saved?.id });
      this.broadcast('elearning_jobsheet_saved', { email, moduleId: module, entry: saved });
    } catch (e) {
      console.error('Failed to persist jobsheet:', e);
    }
  }

  handleTestResult(moduleId, payload) {
    try {
      const email = this.user?.email;
      if (!email) return;
      const module = moduleId || payload?.moduleId || 'elearning-iml';
      const saved = saveTestResult(email, module, payload?.result || payload?.data || payload);
      this.logActivity('test_result_recorded', { moduleId: module, email, id: saved?.id, kind: payload?.kind || payload?.type });
      this.broadcast('elearning_test_saved', { email, moduleId: module, entry: saved });
    } catch (e) {
      console.error('Failed to persist test result:', e);
    }
  }

  // ===== Utilities =====
  
  generateSessionId() {
    return 'ses_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateJWT(payload) {
    // Simple JWT simulation for demo
    const header = { alg: 'HS256', typ: 'JWT' };
    const exp = Math.floor(Date.now() / 1000) + 8 * 60 * 60; // 8 hours
    const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };
    
    return btoa(JSON.stringify(header)) + '.' + 
           btoa(JSON.stringify(fullPayload)) + '.' + 
           'signature';
  }

  generateAvatar(email) {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const initial = email.charAt(0).toUpperCase();
    const colorIndex = email.charCodeAt(0) % colors.length;
    
    return {
      type: 'initials',
      initial,
      backgroundColor: colors[colorIndex],
      textColor: '#FFFFFF'
    };
  }

  getClientIP() {
    // In real implementation, get from server
    return '127.0.0.1';
  }

  getLoginCount(email) {
    try {
      const activity = JSON.parse(localStorage.getItem(this.ACTIVITY_KEY) || '[]');
      return activity.filter(a => a.action === 'login' && a.details?.email === email).length;
    } catch {
      return 0;
    }
  }

  logActivity(action, details = {}) {
    try {
      const activity = JSON.parse(localStorage.getItem(this.ACTIVITY_KEY) || '[]');
      const entry = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        action,
        details,
        timestamp: new Date().toISOString(),
        user: this.user?.email || 'anonymous',
        session: this.session?.id || null
      };
      
      activity.unshift(entry);
      
      // Keep only last 1000 entries
      if (activity.length > 1000) {
        activity.splice(1000);
      }
      
      localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(activity));
      this.broadcast('activity_logged', entry);
    } catch (error) {
      logger.warn('Failed to log activity:', error);
    }
  }

  getActivity(limit = 50) {
    try {
      const activity = JSON.parse(localStorage.getItem(this.ACTIVITY_KEY) || '[]');
      return activity.slice(0, limit);
    } catch {
      return [];
    }
  }

  // ===== Preferences =====
  
  loadPreferences() {
    try {
      return JSON.parse(localStorage.getItem(this.PREFS_KEY) || '{}');
    } catch {
      return {};
    }
  }

  updatePreferences(updates) {
    this.preferences = { ...this.preferences, ...updates };
    localStorage.setItem(this.PREFS_KEY, JSON.stringify(this.preferences));
    this.broadcast('preferences_updated', { preferences: this.preferences });
  }

  // ===== User Profile Management =====
  /**
   * Update current user profile fields and persist
   * @param {Object} updates - Partial user fields to update (e.g., { name, avatar })
   */
  updateUserProfile(updates = {}) {
    if (!this.user) {
      throw new Error('No active user session');
    }
    try {
      this.user = { ...this.user, ...updates };
      localStorage.setItem(this.USER_KEY, JSON.stringify(this.user));
      // Keep session user snapshot if stored there by external services
      if (this.session) {
        this.session.user = { ...(this.session.user || {}), ...updates };
        sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(this.session));
      }
      this.broadcast('user_profile_updated', { user: this.user });
      return this.user;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  // ===== Token Refresh =====
  
  setupTokenRefresh() {
    setInterval(() => {
      if (this.isAuthenticated()) {
        this.refreshSession();
      }
    }, 30 * 60 * 1000); // Every 30 minutes
  }

  // ===== Activity Tracking =====
  
  trackActivity() {
    let lastActivity = Date.now();
    
    const updateActivity = () => {
      lastActivity = Date.now();
      if (this.session) {
        this.session.lastActivity = new Date().toISOString();
        sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(this.session));
      }
    };
    
    // Track user interactions
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
    
    // Check for inactivity
    setInterval(() => {
      if (this.isAuthenticated() && Date.now() - lastActivity > 30 * 60 * 1000) {
        this.logActivity('session_timeout');
        this.clearSession();
      }
    }, 60 * 1000); // Check every minute
  }
}

// Global SSO instance
window.SSOCore = window.SSOCore || new SSOCore();

export default window.SSOCore;