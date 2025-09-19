import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboardEnhanced({ onLogout, currentUser }) {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Enhanced features state
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [systemMetrics, setSystemMetrics] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [realTimeData, setRealTimeData] = useState({});
  const [exportLoading, setExportLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const refreshInterval = useRef(null);

  // Enhanced tab definitions
  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: '📊', badge: notifications.length },
    { id: 'users', label: 'User Management', icon: '👥', badge: users.filter(u => u.status === 'pending').length },
    { id: 'modules', label: 'Module Management', icon: '📦', badge: modules.filter(m => m.status === 'maintenance').length },
    { id: 'activity', label: 'Activity Logs', icon: '📋', badge: securityAlerts.length },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'security', label: 'Security Center', icon: '🛡️' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' }
  ];

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
    startRealTimeUpdates();
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Enhanced mock data
      const mockUsers = [
        { 
          id: 1, 
          name: 'Admin User', 
          email: 'admin@unesa.ac.id', 
          role: 'admin', 
          status: 'active', 
          lastLogin: '2024-01-20 14:30',
          loginCount: 145,
          department: 'IT Department',
          avatar: '👨‍💼',
          mfaEnabled: true,
          createdAt: '2023-06-15'
        },
        { 
          id: 2, 
          name: 'John Doe', 
          email: 'john@unesa.ac.id', 
          role: 'user', 
          status: 'active', 
          lastLogin: '2024-01-20 13:15',
          loginCount: 89,
          department: 'Academic',
          avatar: '👨‍🎓',
          mfaEnabled: false,
          createdAt: '2023-08-20'
        },
        { 
          id: 3, 
          name: 'Jane Smith', 
          email: 'jane@unesa.ac.id', 
          role: 'moderator', 
          status: 'inactive', 
          lastLogin: '2024-01-19 09:45',
          loginCount: 34,
          department: 'Research',
          avatar: '👩‍🔬',
          mfaEnabled: true,
          createdAt: '2023-09-10'
        },
        { 
          id: 4, 
          name: 'Mike Johnson', 
          email: 'mike@unesa.ac.id', 
          role: 'user', 
          status: 'pending', 
          lastLogin: 'Never',
          loginCount: 0,
          department: 'Finance',
          avatar: '👨‍💼',
          mfaEnabled: false,
          createdAt: '2024-01-20'
        }
      ];

      const mockModules = [
        { 
          id: 'elearning', 
          name: 'E-Learning System', 
          status: 'active', 
          users: 150, 
          version: '2.1.0',
          description: 'Online learning management system',
          uptime: '99.8%',
          lastUpdate: '2024-01-15',
          maintainer: 'IT Team',
          icon: '📚'
        },
        { 
          id: 'monitoring', 
          name: 'System Monitoring', 
          status: 'active', 
          users: 25, 
          version: '1.5.2',
          description: 'Real-time system monitoring dashboard',
          uptime: '99.9%',
          lastUpdate: '2024-01-18',
          maintainer: 'DevOps Team',
          icon: '📊'
        },
        { 
          id: 'analytics', 
          name: 'Analytics Dashboard', 
          status: 'maintenance', 
          users: 80, 
          version: '1.2.1',
          description: 'Business intelligence and analytics',
          uptime: '95.2%',
          lastUpdate: '2024-01-10',
          maintainer: 'Data Team',
          icon: '📈'
        }
      ];

      const mockActivity = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        user: ['admin@unesa.ac.id', 'john@unesa.ac.id', 'jane@unesa.ac.id', 'mike@unesa.ac.id'][Math.floor(Math.random() * 4)],
        action: ['User Login', 'User Logout', 'Module Access', 'Failed Login', 'Password Reset', 'Profile Update'][Math.floor(Math.random() * 6)],
        module: ['SSO Portal', 'E-Learning', 'Monitoring', 'Analytics'][Math.floor(Math.random() * 4)],
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        status: Math.random() > 0.2 ? 'success' : 'error',
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }));

      // System metrics
      const mockMetrics = {
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.status === 'active').length,
        activeModules: mockModules.filter(m => m.status === 'active').length,
        recentLogins: mockActivity.filter(a => a.action === 'User Login' && new Date(a.timestamp) > new Date(Date.now() - 86400000)).length,
        systemUptime: '99.7%',
        avgResponseTime: '234ms',
        totalSessions: 1247,
        securityIncidents: 3
      };

      const mockNotifications = [
        { id: 1, type: 'warning', message: 'Analytics module under maintenance', timestamp: new Date().toISOString() },
        { id: 2, type: 'info', message: 'New user registration pending approval', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, type: 'success', message: 'System backup completed successfully', timestamp: new Date(Date.now() - 7200000).toISOString() }
      ];

      const mockSecurityAlerts = [
        { id: 1, type: 'failed_login', user: 'unknown@external.com', count: 5, lastAttempt: new Date().toISOString() },
        { id: 2, type: 'suspicious_activity', user: 'jane@unesa.ac.id', details: 'Login from unusual location', timestamp: new Date(Date.now() - 1800000).toISOString() }
      ];

      setUsers(mockUsers);
      setModules(mockModules);
      setActivityLogs(mockActivity);
      setSystemMetrics(mockMetrics);
      setNotifications(mockNotifications);
      setSecurityAlerts(mockSecurityAlerts);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRealTimeUpdates = () => {
    refreshInterval.current = setInterval(() => {
      setRealTimeData({
        timestamp: new Date().toISOString(),
        activeConnections: Math.floor(Math.random() * 50) + 100,
        cpuUsage: Math.floor(Math.random() * 30) + 20,
        memoryUsage: Math.floor(Math.random() * 40) + 30
      });
    }, 30000);
  };

  // Enhanced user management functions
  const handleUserAction = (action, userId) => {
    switch (action) {
      case 'edit':
        setEditingUser(users.find(u => u.id === userId));
        setShowUserModal(true);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this user?')) {
          setUsers(prev => prev.filter(u => u.id !== userId));
        }
        break;
      case 'activate':
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u));
        break;
      case 'deactivate':
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'inactive' } : u));
        break;
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedUsers.length === 0) return;
    
    switch (bulkAction) {
      case 'delete':
        if (confirm(`Delete ${selectedUsers.length} selected users?`)) {
          setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
          setSelectedUsers([]);
        }
        break;
      case 'activate':
        setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u));
        setSelectedUsers([]);
        break;
      case 'deactivate':
        setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'inactive' } : u));
        setSelectedUsers([]);
        break;
    }
    setBulkAction('');
  };

  const exportData = async (type) => {
    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = type === 'users' ? users : type === 'modules' ? modules : activityLogs;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  // Filter functions
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredActivity = activityLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading Enhanced Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🛡️ Enhanced Admin Dashboard
              </h1>
              {realTimeData.timestamp && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full text-xs text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
                  🔔
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              
              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">{currentUser?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-500">{currentUser?.email || 'admin@unesa.ac.id'}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Users</p>
                      <p className="text-3xl font-bold">{systemMetrics.totalUsers}</p>
                    </div>
                    <div className="text-4xl opacity-80">👥</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Active Users</p>
                      <p className="text-3xl font-bold">{systemMetrics.activeUsers}</p>
                    </div>
                    <div className="text-4xl opacity-80">✅</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Active Modules</p>
                      <p className="text-3xl font-bold">{systemMetrics.activeModules}</p>
                    </div>
                    <div className="text-4xl opacity-80">📦</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Today's Logins</p>
                      <p className="text-3xl font-bold">{systemMetrics.recentLogins}</p>
                    </div>
                    <div className="text-4xl opacity-80">🔑</div>
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
                </div>
                <div className="divide-y divide-slate-200">
                  {activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {log.user} - {log.action}
                            </p>
                            <p className="text-xs text-slate-500">{log.module}</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* User Management Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Enhanced User Management</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => exportData('users')}
                    disabled={exportLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {exportLoading ? '⏳ Exporting...' : '📊 Export'}
                  </button>
                  <button
                    onClick={() => {setEditingUser(null); setShowUserModal(true);}}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    ➕ Add User
                  </button>
                </div>
              </div>

              {/* Enhanced Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="🔍 Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="user">User</option>
                  </select>
                </div>
                
                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-blue-800">
                        {selectedUsers.length} user(s) selected
                      </span>
                      <select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                        className="px-3 py-1 border border-blue-300 rounded text-sm"
                      >
                        <option value="">Bulk Actions</option>
                        <option value="activate">Activate</option>
                        <option value="deactivate">Deactivate</option>
                        <option value="delete">Delete</option>
                      </select>
                      <button
                        onClick={handleBulkAction}
                        disabled={!bulkAction}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Users Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(filteredUsers.map(u => u.id));
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                            className="rounded"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">MFA</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers(prev => [...prev, user.id]);
                                } else {
                                  setSelectedUsers(prev => prev.filter(id => id !== user.id));
                                }
                              }}
                              className="rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{user.avatar}</div>
                              <div>
                                <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                <div className="text-sm text-slate-500">{user.email}</div>
                                <div className="text-xs text-slate-400">{user.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                              user.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm ${user.mfaEnabled ? 'text-green-600' : 'text-red-600'}`}>
                              {user.mfaEnabled ? '🔐 Enabled' : '🔓 Disabled'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {user.lastLogin}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleUserAction('edit', user.id)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="Edit User"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => handleUserAction(user.status === 'active' ? 'deactivate' : 'activate', user.id)}
                                className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                                title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                {user.status === 'active' ? '⏸️' : '▶️'}
                              </button>
                              <button 
                                onClick={() => handleUserAction('delete', user.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="Delete User"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-slate-800">Enhanced Module Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                  <motion.div
                    key={module.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{module.icon}</div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        module.status === 'active' ? 'bg-green-100 text-green-800' :
                        module.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {module.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{module.name}</h3>
                    <p className="text-sm text-slate-600 mb-4">{module.description}</p>
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex justify-between">
                        <span>Version:</span>
                        <span className="font-medium">{module.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Users:</span>
                        <span className="font-medium">{module.users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime:</span>
                        <span className="font-medium text-green-600">{module.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintainer:</span>
                        <span className="font-medium">{module.maintainer}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Configure
                      </button>
                      <button className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        View
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Enhanced Activity Logs</h2>
                <button
                  onClick={() => exportData('activity')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  📊 Export Logs
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Module</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredActivity.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`w-3 h-3 rounded-full ${
                              log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {log.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {log.action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {log.module}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {log.ip}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                {editingUser ? '✏️ Edit User' : '➕ Add New User'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={editingUser?.name || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue={editingUser?.email || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="user@unesa.ac.id"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <select
                    defaultValue={editingUser?.role || 'user'}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">👤 User</option>
                    <option value="moderator">👨‍💼 Moderator</option>
                    <option value="admin">👨‍💻 Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                  <input
                    type="text"
                    defaultValue={editingUser?.department || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Department name"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="mfaEnabled"
                    defaultChecked={editingUser?.mfaEnabled || false}
                    className="rounded"
                  />
                  <label htmlFor="mfaEnabled" className="text-sm font-medium text-slate-700">
                    🔐 Enable Multi-Factor Authentication
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 py-3 px-6 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all duration-300"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}