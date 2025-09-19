/**
 * Firebase Hybrid Manager
 * 
 * Provides comprehensive offline/online hybrid functionality for Firebase operations.
 * Features:
 * - Real-time connection monitoring
 * - Automatic operation queuing when offline
 * - Seamless sync when connection restored
 * - Hybrid read/write operations with fallback
 * - Event-driven architecture for status updates
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  onSnapshot,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../config/firebase';

class FirebaseHybridManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.isFirebaseConnected = false;
    this.pendingOperations = [];
    this.eventListeners = [];
    this.syncInProgress = false;
    this.lastConnectionCheck = Date.now();
    this.heartbeatInterval = null;
    this.connectionCheckInterval = 30000; // 30 seconds
    
    this.init();
  }

  /**
   * Initialize the hybrid manager
   */
  init() {
    // Monitor network connectivity
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Monitor Firebase auth state
    onAuthStateChanged(auth, (user) => {
      this.emit('authStateChanged', { user, isAuthenticated: !!user });
    });
    
    // Start connection monitoring
    this.startConnectionMonitoring();
    
    // Load pending operations from localStorage
    this.loadPendingOperations();
    
    console.log('Firebase Hybrid Manager initialized');
  }

  /**
   * Start heartbeat monitoring for Firebase connection
   */
  startConnectionMonitoring() {
    this.heartbeatInterval = setInterval(() => {
      this.checkFirebaseConnection();
    }, this.connectionCheckInterval);
    
    // Initial connection check
    this.checkFirebaseConnection();
  }

  /**
   * Check Firebase connection status
   */
  async checkFirebaseConnection() {
    if (!this.isOnline) {
      this.isFirebaseConnected = false;
      this.emit('connectionStatusChanged', this.getConnectionStatus());
      return;
    }

    try {
      // Try to read a small document to test Firebase connectivity
      const testRef = doc(db, '.info/connected');
      await getDoc(testRef);
      
      if (!this.isFirebaseConnected) {
        this.isFirebaseConnected = true;
        this.emit('connectionStatusChanged', this.getConnectionStatus());
        this.emit('firebaseConnected');
        
        // Auto-sync when connection is restored
        if (this.pendingOperations.length > 0) {
          this.syncPendingOperations();
        }
      }
    } catch (error) {
      if (this.isFirebaseConnected) {
        this.isFirebaseConnected = false;
        this.emit('connectionStatusChanged', this.getConnectionStatus());
        this.emit('firebaseDisconnected');
      }
    }
    
    this.lastConnectionCheck = Date.now();
  }

  /**
   * Handle online event
   */
  handleOnline() {
    console.log('Network connection restored');
    this.isOnline = true;
    this.emit('networkOnline');
    this.checkFirebaseConnection();
  }

  /**
   * Handle offline event
   */
  handleOffline() {
    console.log('Network connection lost');
    this.isOnline = false;
    this.isFirebaseConnected = false;
    this.emit('networkOffline');
    this.emit('connectionStatusChanged', this.getConnectionStatus());
  }

  /**
   * Get current connection status
   */
  getConnectionStatus() {
    return {
      isOnline: this.isOnline,
      isFirebaseConnected: this.isFirebaseConnected,
      pendingOperationsCount: this.pendingOperations.length,
      lastConnectionCheck: this.lastConnectionCheck,
      syncInProgress: this.syncInProgress
    };
  }

  /**
   * Hybrid read operation - tries Firebase first, falls back to localStorage
   */
  async hybridRead(collectionName, docId, options = {}) {
    const cacheKey = `cache_${collectionName}_${docId}`;
    
    if (this.isFirebaseConnected) {
      try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          // Cache the data locally
          localStorage.setItem(cacheKey, JSON.stringify(data));
          return data;
        } else {
          return null;
        }
      } catch (error) {
        console.warn('Firebase read failed, falling back to cache:', error);
        this.isFirebaseConnected = false;
        this.emit('connectionStatusChanged', this.getConnectionStatus());
      }
    }
    
    // Fallback to localStorage cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        console.log('Using cached data for:', cacheKey);
        return data;
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }
    
    return null;
  }

  /**
   * Hybrid write operation - tries Firebase, queues if offline
   */
  async hybridWrite(collectionName, docId, data, operation = 'set') {
    const timestamp = Date.now();
    const operationData = {
      id: `${operation}_${collectionName}_${docId}_${timestamp}`,
      type: operation,
      collectionName,
      docId,
      data,
      timestamp,
      attempts: 0
    };
    
    if (this.isFirebaseConnected) {
      try {
        await this.executeOperation(operationData);
        this.emit('operationSuccess', operationData);
        return true;
      } catch (error) {
        console.warn('Firebase write failed, queuing operation:', error);
        this.isFirebaseConnected = false;
        this.emit('connectionStatusChanged', this.getConnectionStatus());
      }
    }
    
    // Queue operation for later sync
    this.queueOperation(operationData);
    
    // Store data locally as backup
    const cacheKey = `cache_${collectionName}_${docId}`;
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ id: docId, ...data }));
    } catch (error) {
      console.error('Error caching data locally:', error);
    }
    
    this.emit('operationQueued', operationData);
    return true;
  }

  /**
   * Execute a Firebase operation
   */
  async executeOperation(operationData) {
    const { type, collectionName, docId, data } = operationData;
    const docRef = doc(db, collectionName, docId);
    
    switch (type) {
      case 'set':
        await setDoc(docRef, data);
        break;
      case 'update':
        await updateDoc(docRef, data);
        break;
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  /**
   * Queue an operation for later execution
   */
  queueOperation(operationData) {
    this.pendingOperations.push(operationData);
    this.savePendingOperations();
    this.emit('pendingOperationsChanged', this.pendingOperations.length);
  }

  /**
   * Sync all pending operations
   */
  async syncPendingOperations() {
    if (!this.isFirebaseConnected || this.syncInProgress || this.pendingOperations.length === 0) {
      return;
    }
    
    this.syncInProgress = true;
    this.emit('syncStarted');
    
    const operationsToSync = [...this.pendingOperations];
    const successfulOperations = [];
    const failedOperations = [];
    
    for (const operation of operationsToSync) {
      try {
        await this.executeOperation(operation);
        successfulOperations.push(operation);
        this.emit('operationSynced', operation);
      } catch (error) {
        console.error('Failed to sync operation:', operation, error);
        operation.attempts = (operation.attempts || 0) + 1;
        
        // Retry failed operations up to 3 times
        if (operation.attempts < 3) {
          failedOperations.push(operation);
        } else {
          this.emit('operationFailed', { operation, error });
        }
      }
    }
    
    // Update pending operations list
    this.pendingOperations = failedOperations;
    this.savePendingOperations();
    
    this.syncInProgress = false;
    this.emit('syncCompleted', {
      successful: successfulOperations.length,
      failed: failedOperations.length,
      remaining: this.pendingOperations.length
    });
    
    this.emit('pendingOperationsChanged', this.pendingOperations.length);
  }

  /**
   * Manual sync trigger
   */
  async manualSync() {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    await this.checkFirebaseConnection();
    
    if (!this.isFirebaseConnected) {
      throw new Error('Firebase connection not available');
    }
    
    await this.syncPendingOperations();
  }

  /**
   * Save pending operations to localStorage
   */
  savePendingOperations() {
    try {
      localStorage.setItem('firebase_pending_operations', JSON.stringify(this.pendingOperations));
    } catch (error) {
      console.error('Error saving pending operations:', error);
    }
  }

  /**
   * Load pending operations from localStorage
   */
  loadPendingOperations() {
    try {
      const saved = localStorage.getItem('firebase_pending_operations');
      if (saved) {
        this.pendingOperations = JSON.parse(saved);
        console.log(`Loaded ${this.pendingOperations.length} pending operations`);
      }
    } catch (error) {
      console.error('Error loading pending operations:', error);
      this.pendingOperations = [];
    }
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_') || key === 'firebase_pending_operations') {
        localStorage.removeItem(key);
      }
    });
    this.pendingOperations = [];
    this.emit('cacheCleared');
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    this.eventListeners.push({ event, callback });
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    this.eventListeners = this.eventListeners.filter(
      listener => listener.event !== event || listener.callback !== callback
    );
  }

  /**
   * Emit event to all listeners
   */
  emit(event, data) {
    this.eventListeners
      .filter(listener => listener.event === event)
      .forEach(listener => {
        try {
          listener.callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
  }

  /**
   * Get system statistics
   */
  getStats() {
    return {
      connectionStatus: this.getConnectionStatus(),
      cacheSize: this.getCacheSize(),
      eventListeners: this.eventListeners.length,
      uptime: Date.now() - this.lastConnectionCheck
    };
  }

  /**
   * Get cache size
   */
  getCacheSize() {
    let size = 0;
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        size += localStorage.getItem(key).length;
      }
    });
    return size;
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    this.eventListeners = [];
    
    console.log('Firebase Hybrid Manager destroyed');
  }
}

// Create and export singleton instance
export const firebaseHybridManager = new FirebaseHybridManager();
export default firebaseHybridManager;