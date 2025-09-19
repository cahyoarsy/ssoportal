/**
 * Hybrid Connection Indicator Component
 * 
 * Real-time visual indicator for Firebase hybrid mode connection status.
 * Features:
 * - Real-time online/offline status
 * - Firebase connection monitoring
 * - Pending operations count
 * - Manual sync trigger
 * - Expandable details view
 * - Connection mode descriptions
 */

import { useState, useEffect } from 'react';
import { firebaseHybridManager } from '../services/FirebaseHybridManager';

const HybridConnectionIndicator = ({ className = '' }) => {
  const [connectionStatus, setConnectionStatus] = useState(
    firebaseHybridManager.getConnectionStatus()
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    // Listen for connection status changes
    const handleConnectionChange = (status) => {
      setConnectionStatus(status);
    };

    const handleSyncStarted = () => {
      setSyncStatus('syncing');
    };

    const handleSyncCompleted = (result) => {
      setSyncStatus('completed');
      setLastSync(new Date());
      setTimeout(() => setSyncStatus('idle'), 3000);
    };

    const handleOperationQueued = () => {
      setConnectionStatus(firebaseHybridManager.getConnectionStatus());
    };

    // Add event listeners
    firebaseHybridManager.on('connectionStatusChanged', handleConnectionChange);
    firebaseHybridManager.on('syncStarted', handleSyncStarted);
    firebaseHybridManager.on('syncCompleted', handleSyncCompleted);
    firebaseHybridManager.on('operationQueued', handleOperationQueued);
    firebaseHybridManager.on('pendingOperationsChanged', handleOperationQueued);

    // Cleanup
    return () => {
      firebaseHybridManager.off('connectionStatusChanged', handleConnectionChange);
      firebaseHybridManager.off('syncStarted', handleSyncStarted);
      firebaseHybridManager.off('syncCompleted', handleSyncCompleted);
      firebaseHybridManager.off('operationQueued', handleOperationQueued);
      firebaseHybridManager.off('pendingOperationsChanged', handleOperationQueued);
    };
  }, []);

  const handleManualSync = async () => {
    if (syncStatus === 'syncing') return;
    
    try {
      setSyncStatus('syncing');
      await firebaseHybridManager.manualSync();
    } catch (error) {
      console.error('Manual sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const getStatusColor = () => {
    if (!connectionStatus.isOnline) return 'bg-red-500';
    if (!connectionStatus.isFirebaseConnected) return 'bg-yellow-500';
    if (connectionStatus.pendingOperationsCount > 0) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!connectionStatus.isOnline) return 'Offline';
    if (!connectionStatus.isFirebaseConnected) return 'Firebase Disconnected';
    if (connectionStatus.pendingOperationsCount > 0) return 'Syncing';
    return 'Online';
  };

  const getStatusDescription = () => {
    if (!connectionStatus.isOnline) {
      return 'No network connection. Changes are saved locally and will sync when reconnected.';
    }
    if (!connectionStatus.isFirebaseConnected) {
      return 'Network available but Firebase is unreachable. Operating in hybrid mode.';
    }
    if (connectionStatus.pendingOperationsCount > 0) {
      return `${connectionStatus.pendingOperationsCount} operations pending sync. Data is being synchronized.`;
    }
    return 'Fully connected. All data is synchronized with Firebase.';
  };

  const getSyncButtonText = () => {
    switch (syncStatus) {
      case 'syncing': return 'Syncing...';
      case 'completed': return 'Synced ✓';
      case 'error': return 'Sync Failed';
      default: return 'Manual Sync';
    }
  };

  return (
    <div className={`hybrid-connection-indicator ${className}`}>
      {/* Compact Status Indicator */}
      <div 
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Status Dot */}
        <div className="relative">
          <div 
            className={`w-3 h-3 rounded-full ${getStatusColor()} ${
              connectionStatus.syncInProgress ? 'animate-pulse' : ''
            }`}
          />
          {connectionStatus.pendingOperationsCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {connectionStatus.pendingOperationsCount > 9 ? '9+' : connectionStatus.pendingOperationsCount}
            </div>
          )}
        </div>
        
        {/* Status Text */}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getStatusText()}
        </span>
        
        {/* Expand Icon */}
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Connection Details */}
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Connection Status
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getStatusDescription()}
              </p>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Network:</span>
                <span className={`ml-2 ${connectionStatus.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {connectionStatus.isOnline ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Firebase:</span>
                <span className={`ml-2 ${connectionStatus.isFirebaseConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {connectionStatus.isFirebaseConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Pending:</span>
                <span className="ml-2 text-blue-600">
                  {connectionStatus.pendingOperationsCount} operations
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Last Check:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {new Date(connectionStatus.lastConnectionCheck).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Sync Information */}
            {lastSync && (
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Last Sync:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {lastSync.toLocaleTimeString()}
                </span>
              </div>
            )}

            {/* Manual Sync Button */}
            {connectionStatus.isOnline && (
              <button
                onClick={handleManualSync}
                disabled={syncStatus === 'syncing' || !connectionStatus.isOnline}
                className={`w-full mt-3 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  syncStatus === 'syncing'
                    ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                    : syncStatus === 'completed'
                    ? 'bg-green-100 text-green-600'
                    : syncStatus === 'error'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {getSyncButtonText()}
              </button>
            )}

            {/* Offline Notice */}
            {!connectionStatus.isOnline && (
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Operating in Offline Mode
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Your changes are being saved locally and will automatically sync when connection is restored.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Compact version for minimal display
export const HybridStatusDot = ({ className = '' }) => {
  const [connectionStatus, setConnectionStatus] = useState(
    firebaseHybridManager.getConnectionStatus()
  );

  useEffect(() => {
    const handleConnectionChange = (status) => {
      setConnectionStatus(status);
    };

    firebaseHybridManager.on('connectionStatusChanged', handleConnectionChange);
    firebaseHybridManager.on('pendingOperationsChanged', () => {
      setConnectionStatus(firebaseHybridManager.getConnectionStatus());
    });

    return () => {
      firebaseHybridManager.off('connectionStatusChanged', handleConnectionChange);
      firebaseHybridManager.off('pendingOperationsChanged', handleConnectionChange);
    };
  }, []);

  const getStatusColor = () => {
    if (!connectionStatus.isOnline) return 'bg-red-500';
    if (!connectionStatus.isFirebaseConnected) return 'bg-yellow-500';
    if (connectionStatus.pendingOperationsCount > 0) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getTitle = () => {
    if (!connectionStatus.isOnline) return 'Offline - Changes saved locally';
    if (!connectionStatus.isFirebaseConnected) return 'Firebase disconnected - Hybrid mode active';
    if (connectionStatus.pendingOperationsCount > 0) return `${connectionStatus.pendingOperationsCount} operations pending sync`;
    return 'Fully connected and synchronized';
  };

  return (
    <div 
      className={`relative ${className}`}
      title={getTitle()}
    >
      <div 
        className={`w-3 h-3 rounded-full ${getStatusColor()} ${
          connectionStatus.syncInProgress ? 'animate-pulse' : ''
        }`}
      />
      {connectionStatus.pendingOperationsCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {connectionStatus.pendingOperationsCount > 9 ? '9+' : connectionStatus.pendingOperationsCount}
        </div>
      )}
    </div>
  );
};

export default HybridConnectionIndicator;