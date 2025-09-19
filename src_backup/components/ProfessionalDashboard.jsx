import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfessionalDashboard = ({ user, onLogout, dark, setDark }) => {
  const [activeModule, setActiveModule] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Profile updated successfully', time: '2 minutes ago' },
    { id: 2, type: 'info', message: 'New e-learning module available', time: '1 hour ago' },
    { id: 3, type: 'warning', message: 'Password expires in 7 days', time: '2 hours ago' }
  ]);
  const [stats, setStats] = useState({
    coursesCompleted: 12,
    totalProgress: 78,
    activeModules: 5,
    certificates: 8
  });

  const modules = [
    {
      id: 'overview',
      name: 'Overview',
      icon: '📊',
      description: 'Dashboard and analytics'
    },
    {
      id: 'elearning',
      name: 'E-Learning',
      icon: '🎓',
      description: 'Learning modules and courses'
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: '👤',
      description: 'Personal information and settings'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: '📈',
      description: 'Performance and progress tracking'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      description: 'System preferences'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Completed', item: 'React Advanced Patterns', time: '2 hours ago', type: 'course' },
    { id: 2, action: 'Started', item: 'TypeScript Fundamentals', time: '1 day ago', type: 'course' },
    { id: 3, action: 'Earned', item: 'Frontend Developer Certificate', time: '3 days ago', type: 'certificate' },
    { id: 4, action: 'Updated', item: 'Profile Information', time: '5 days ago', type: 'profile' }
  ];

  const quickActions = [
    { name: 'Start New Course', icon: '🚀', action: () => setActiveModule('elearning') },
    { name: 'View Progress', icon: '📈', action: () => setActiveModule('analytics') },
    { name: 'Download CV', icon: '📄', action: () => window.open('/cv.pdf', '_blank') },
    { name: 'Update Profile', icon: '👤', action: () => setActiveModule('profile') }
  ];

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
                  <p className="text-blue-100">You're doing great! Keep up the excellent progress.</p>
                </div>
                <div className="text-4xl opacity-80">🌟</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courses Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.coursesCompleted}</p>
                  </div>
                  <div className="text-green-500 text-2xl">✅</div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Progress</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProgress}%</p>
                  </div>
                  <div className="text-blue-500 text-2xl">📊</div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Modules</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeModules}</p>
                  </div>
                  <div className="text-orange-500 text-2xl">🎯</div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.certificates}</p>
                  </div>
                  <div className="text-purple-500 text-2xl">🏆</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        {activity.type === 'course' && '🎓'}
                        {activity.type === 'certificate' && '🏆'}
                        {activity.type === 'profile' && '👤'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.action}</span> {activity.item}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'elearning':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">E-Learning Modules</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'React Fundamentals', progress: 100, status: 'completed', icon: '⚛️' },
                { name: 'TypeScript Advanced', progress: 65, status: 'in-progress', icon: '📘' },
                { name: 'Node.js Backend', progress: 0, status: 'not-started', icon: '🟢' },
                { name: 'Database Design', progress: 85, status: 'in-progress', icon: '🗄️' },
                { name: 'DevOps Basics', progress: 0, status: 'not-started', icon: '🔧' },
                { name: 'System Architecture', progress: 45, status: 'in-progress', icon: '🏗️' }
              ].map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">{course.icon}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">{course.progress}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        course.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        course.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {course.status.replace('-', ' ')}
                      </span>
                      
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium">
                        {course.status === 'completed' ? 'Review' : course.status === 'in-progress' ? 'Continue' : 'Start'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'CA'}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name || 'Cahyo Arsy'}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Role: <span className="capitalize font-medium">{user?.role || 'Developer'}</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Full Name</label>
                      <p className="font-medium text-gray-900 dark:text-white">{user?.name || 'Cahyo Arsy'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Email Address</label>
                      <p className="font-medium text-gray-900 dark:text-white">{user?.email || 'cahyo@example.com'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Last Login</label>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Professional Info</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Position</label>
                      <p className="font-medium text-gray-900 dark:text-white">Full Stack Developer</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Specialization</label>
                      <p className="font-medium text-gray-900 dark:text-white">React, Node.js, System Architecture</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Experience</label>
                      <p className="font-medium text-gray-900 dark:text-white">5+ Years</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Edit Profile
                  </button>
                  <a
                    href="/cv.pdf"
                    target="_blank"
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    📄 Download CV
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Module Under Development</h3>
            <p className="text-gray-600 dark:text-gray-400">This feature is currently being developed.</p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${dark ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        
        {/* Top Navigation */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  🚀 SSO Portal
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">Dashboard</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                    🔔
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDark(!dark)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {dark ? '☀️' : '🌙'}
                </button>
                
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'CA'}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</span>
                  <button
                    onClick={onLogout}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <nav className="space-y-2">
                  {modules.map(module => (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeModule === module.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg">{module.icon}</span>
                      <div>
                        <div className="font-medium">{module.name}</div>
                        <div className="text-xs opacity-80">{module.description}</div>
                      </div>
                    </button>
                  ))}
                </nav>
                
                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <span>{action.icon}</span>
                        <span>{action.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderModuleContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;