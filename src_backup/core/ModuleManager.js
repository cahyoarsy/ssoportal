/**
 * SSO Module Manager
 * Mengelola registrasi, loading, dan komunikasi antar module
 */

import logger, { createLogger } from '../utils/logger';

class ModuleManager {
  constructor(ssoCore) {
    this.sso = ssoCore;
    this.modules = new Map();
    this.activeModule = null;
    this.container = null;
    
    this.init();
  }

  init() {
    // Register built-in modules
    this.registerBuiltInModules();
    
    // Listen for SSO events
    this.sso.addEventListener('session_created', this.onSessionChanged.bind(this));
    this.sso.addEventListener('session_cleared', this.onSessionChanged.bind(this));
    this.sso.addEventListener('preferences_updated', this.onPreferencesChanged.bind(this));
  }

  registerBuiltInModules() {
  const BASE = (typeof import.meta !== 'undefined' && import.meta?.env?.BASE_URL) ? import.meta.env.BASE_URL : '/';
    // E-Learning Module
    this.register('elearning', {
      name: 'E-Learning IML',
      description: 'Instalasi Motor Listrik - Interactive Learning Module',
      icon: 'fas fa-graduation-cap',
      path: BASE + 'integrations/elearning-iml/index.html',
      category: 'education',
      requiresAuth: true,
      adminOnly: false,
      permissions: ['elearning.access'],
      features: ['video', 'quiz', 'progress-tracking', 'certificates'],
      version: '2.1.0'
    });

    // Monitoring Module (Admin Only)
    this.register('monitoring', {
      name: 'Monitoring Dashboard',
      description: 'Real-time monitoring dan analytics untuk admin',
      icon: 'fas fa-chart-line',
      path: BASE + 'integrations/monitoring/index.html',
      category: 'admin',
      requiresAuth: true,
      adminOnly: true,
      permissions: ['admin.monitoring', 'admin.analytics'],
      features: ['real-time', 'analytics', 'alerts', 'reports'],
      version: '1.5.0'
    });

    // Profile Management
    this.register('profile', {
      name: 'Profile Management',
      description: 'Kelola profil dan pengaturan akun',
      icon: 'fas fa-user-cog',
      path: null, // Built-in component
      category: 'user',
      requiresAuth: true,
      adminOnly: false,
      permissions: ['profile.view', 'profile.edit'],
      features: ['avatar-upload', 'personal-info', 'preferences'],
      version: '1.0.0'
    });

    // Admin Dashboard
    this.register('admin', {
      name: 'Admin Dashboard',
      description: 'Panel administrasi untuk mengelola sistem',
      icon: 'fas fa-shield-alt',
      path: null, // Built-in component
      category: 'admin',
      requiresAuth: true,
      adminOnly: true,
      permissions: ['admin.*'],
      features: ['user-management', 'system-settings', 'analytics', 'logs'],
      version: '1.8.0'
    });
  }

  register(moduleId, config) {
    const module = {
      id: moduleId,
      name: config.name,
      description: config.description || '',
      icon: config.icon || 'fas fa-cube',
      path: config.path,
      category: config.category || 'general',
      requiresAuth: config.requiresAuth !== false,
      adminOnly: config.adminOnly === true,
      permissions: config.permissions || [],
      features: config.features || [],
      version: config.version || '1.0.0',
      
      // Runtime state
      iframe: null,
      component: null,
      ready: false,
      loading: false,
      error: null,
      lastAccessed: null,
      accessCount: 0
    };

    this.modules.set(moduleId, module);
    this.sso.broadcast('module_registered', { moduleId, module });
    
    logger.info(`[ModuleManager] Registered module: ${moduleId} - ${module.name}`);
    return module;
  }

  unregister(moduleId) {
    const module = this.modules.get(moduleId);
    if (!module) return false;

    // Clean up if loaded
    if (module.iframe) {
      module.iframe.remove();
    }

    this.modules.delete(moduleId);
    this.sso.broadcast('module_unregistered', { moduleId });
    
    logger.info(`[ModuleManager] Unregistered module: ${moduleId}`);
    return true;
  }

  getAvailableModules(userRole = null) {
    const role = userRole || this.sso.user?.role;
    const isAuthenticated = this.sso.isAuthenticated();
    
    return Array.from(this.modules.values()).filter(module => {
      // Check authentication requirement
      if (module.requiresAuth && !isAuthenticated) return false;
      
      // Check admin requirement
      if (module.adminOnly && role !== 'admin') return false;
      
      // Check permissions
      if (module.permissions.length > 0) {
        return module.permissions.some(perm => this.sso.hasPermission(perm));
      }
      
      return true;
    });
  }

  getModulesByCategory() {
    const available = this.getAvailableModules();
    const categories = {};
    
    available.forEach(module => {
      const cat = module.category;
      if (!categories[cat]) {
        categories[cat] = [];
      }
      categories[cat].push(module);
    });
    
    return categories;
  }

  canAccess(moduleId) {
    const module = this.modules.get(moduleId);
    if (!module) return false;
    
    return this.getAvailableModules().some(m => m.id === moduleId);
  }

  async load(moduleId, container) {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    if (!this.canAccess(moduleId)) {
      throw new Error(`Access denied to module: ${moduleId}`);
    }

    // Set container
    this.container = container;
    
    // Clean previous module
    if (this.activeModule && this.activeModule !== moduleId) {
      await this.unload(this.activeModule);
    }

    // Clear previous error
    module.error = null;
    
    // Already loaded
    if (module.ready && module.iframe) {
      this.activeModule = moduleId;
      this.updateAccessStats(moduleId);
      return module;
    }

    module.loading = true;
    module.error = null;

    try {
      if (module.path) {
        await this.loadIframeModule(module, container);
      } else {
        await this.loadComponentModule(module, container);
      }
      
      module.ready = true;
      module.loading = false;
      this.activeModule = moduleId;
      this.updateAccessStats(moduleId);
      
      this.sso.broadcast('module_loaded', { moduleId, module });
      
  logger.info(`[ModuleManager] Successfully loaded module: ${moduleId}`);
      return module;
      
    } catch (error) {
      module.loading = false;
      module.error = error.message;
      
      this.sso.broadcast('module_load_error', { moduleId, error: error.message });
      
      logger.warn(`[ModuleManager] Failed to load module ${moduleId}:`, error);
      throw error;
    }
  }

  async loadIframeModule(module, container) {
    return new Promise((resolve, reject) => {
      // Validate container
      if (!container) {
        reject(new Error('Container is null or undefined'));
        return;
      }
      
      // Clear container
      try {
        container.innerHTML = '';
      } catch (error) {
        reject(new Error(`Failed to clear container: ${error.message}`));
        return;
      }
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = module.path;
      iframe.className = 'w-full h-full border-0 bg-white dark:bg-gray-900';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals');
      iframe.setAttribute('loading', 'lazy');
      
      // Timeout handler
      const timeout = setTimeout(() => {
        reject(new Error('Module load timeout'));
      }, 30000); // 30 seconds
      
      // Load handler
      iframe.onload = () => {
        clearTimeout(timeout);
        module.iframe = iframe;
        
        // Wait for module to signal ready
        const readyTimeout = setTimeout(() => {
          // Assume ready if no signal within 5 seconds
          this.syncModule(module);
          resolve(module);
        }, 5000);
        
        // Listen for ready signal
        const messageHandler = (event) => {
          if (event.source === iframe.contentWindow && 
              event.data?.type === 'SSO_MODULE_READY') {
            clearTimeout(readyTimeout);
            window.removeEventListener('message', messageHandler);
            this.syncModule(module);
            resolve(module);
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Send initial sync
        setTimeout(() => this.syncModule(module), 100);
      };
      
      iframe.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load module iframe'));
      };
      
      container.appendChild(iframe);
    });
  }

  async loadComponentModule(module, container) {
    // For built-in React components
    const { default: Component } = await import(`../components/${module.id}Module.jsx`);
    
    module.component = Component;
    // Component will be rendered by parent React component
    
    return module;
  }

  async unload(moduleId) {
    const module = this.modules.get(moduleId);
    if (!module) return;

    if (module.iframe) {
      // Send cleanup signal
      try {
        module.iframe.contentWindow.postMessage({
          type: 'SSO_MODULE_UNLOAD'
        }, '*');
      } catch (e) {
        // Ignore if iframe is already destroyed
      }
      
      module.iframe.remove();
      module.iframe = null;
    }

    module.component = null;
    module.ready = false;
    module.error = null;

    if (this.activeModule === moduleId) {
      this.activeModule = null;
    }

    this.sso.broadcast('module_unloaded', { moduleId });
  }

  syncModule(module) {
    if (!module.iframe) return;
    
    try {
      const syncData = {
        type: 'SSO_SESSION_SYNC',
        session: this.sso.session,
        user: this.sso.user,
        preferences: this.sso.preferences,
        permissions: this.sso.getUserPermissions(),
        moduleConfig: {
          id: module.id,
          name: module.name,
          version: module.version,
          features: module.features
        },
        theme: {
          dark: this.sso.preferences.darkMode || false,
          wide: this.sso.preferences.wideLayout || false
        }
      };
      
      module.iframe.contentWindow.postMessage(syncData, '*');
      // Also send theme sync in a dedicated message for integrations expecting it
      try {
        module.iframe.contentWindow.postMessage({
          type: 'SSO_THEME_SYNC',
          dark: this.sso.preferences.darkMode || false,
          wide: this.sso.preferences.wideLayout || false
        }, '*');
      } catch {}

      logger.debug(`[ModuleManager] Synced session with module: ${module.id}`);
    } catch (error) {
      logger.warn(`[ModuleManager] Failed to sync module ${module.id}:`, error);
    }
  }

  syncAllModules() {
    this.modules.forEach(module => {
      if (module.ready && module.iframe) {
        this.syncModule(module);
      }
    });
  }

  updateAccessStats(moduleId) {
    const module = this.modules.get(moduleId);
    if (!module) return;

    module.lastAccessed = new Date().toISOString();
    module.accessCount++;

    // Log activity
    this.sso.logActivity('module_access', {
      moduleId,
      moduleName: module.name,
      accessCount: module.accessCount
    });
  }

  getModuleStats() {
    const stats = {
      total: this.modules.size,
      available: this.getAvailableModules().length,
      loaded: 0,
      active: this.activeModule,
      usage: []
    };

    this.modules.forEach(module => {
      if (module.ready) stats.loaded++;
      
      if (module.accessCount > 0) {
        stats.usage.push({
          id: module.id,
          name: module.name,
          accessCount: module.accessCount,
          lastAccessed: module.lastAccessed
        });
      }
    });

    // Sort by usage
    stats.usage.sort((a, b) => b.accessCount - a.accessCount);

    return stats;
  }

  // Event handlers
  onSessionChanged() {
    // Re-sync all modules when session changes
    setTimeout(() => this.syncAllModules(), 100);
  }

  onPreferencesChanged() {
    // Re-sync all modules when preferences change
    setTimeout(() => this.syncAllModules(), 100);
  }

  // Module communication
  sendMessage(moduleId, message) {
    const module = this.modules.get(moduleId);
    if (!module || !module.iframe) return false;

    try {
      module.iframe.contentWindow.postMessage({
        type: 'SSO_MESSAGE',
        ...message
      }, '*');
      return true;
    } catch (error) {
      console.error(`[ModuleManager] Failed to send message to ${moduleId}:`, error);
      return false;
    }
  }

  broadcast(message, excludeModule = null) {
    this.modules.forEach((module, moduleId) => {
      if (moduleId !== excludeModule && module.iframe) {
        this.sendMessage(moduleId, message);
      }
    });
  }

  // Lifecycle methods
  reload(moduleId) {
    const module = this.modules.get(moduleId);
    if (!module || !this.container) return;

    return this.unload(moduleId).then(() => {
      return this.load(moduleId, this.container);
    });
  }

  refresh(moduleId) {
    const module = this.modules.get(moduleId);
    if (!module || !module.iframe) return;

    // Send refresh signal
    this.sendMessage(moduleId, { type: 'REFRESH' });
  }

  refreshAll() {
    this.modules.forEach((module, moduleId) => {
      if (module.iframe) {
        this.refresh(moduleId);
      }
    });
  }
}

export default ModuleManager;