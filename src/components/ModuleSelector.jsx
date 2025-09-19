import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModuleSelector = ({ 
  ssoCore, 
  moduleManager, 
  availableModules, 
  onModuleSelect,
  currentModule,
  user,
  dark,
  onToggleDark 
}) => {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (availableModules) {
      // Group modules by category
      const grouped = availableModules.reduce((acc, module) => {
        const cat = module.category || 'general';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(module);
        return acc;
      }, {});
      
      setCategories(grouped);
    }

    // Get module stats
    if (moduleManager) {
      setStats(moduleManager.getModuleStats());
    }
  }, [availableModules, moduleManager]);

  const getCategoryIcon = (category) => {
    const icons = {
      education: '🎓',
      admin: '⚙️',
      user: '👤',
      general: '📦',
      monitoring: '📊'
    };
    return icons[category] || '📦';
  };

  const getCategoryName = (category) => {
    const names = {
      education: 'Pendidikan',
      admin: 'Administrasi',
      user: 'Pengguna',
      general: 'Umum',
      monitoring: 'Monitoring'
    };
    return names[category] || category;
  };

  const filteredModules = selectedCategory === 'all' 
    ? availableModules 
    : categories[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sangsongko Engineering
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Selamat datang, {user?.name}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Role: <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.available}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                Module Tersedia
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.loaded}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                Module Dimuat
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.usage.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                Module Digunakan
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.active ? '1' : '0'}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                Module Aktif
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            📚 Semua Module
          </button>
          
          {Object.keys(categories).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {getCategoryIcon(category)} {getCategoryName(category)}
            </button>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredModules.map(module => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                onClick={() => onModuleSelect(module.id)}
              >
                <div className="p-6">
                  {/* Module Icon & Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">
                        {module.icon ? (
                          <i className={module.icon}></i>
                        ) : (
                          getCategoryIcon(module.category)
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {module.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          v{module.version}
                        </p>
                      </div>
                    </div>
                    
                    {module.ready && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  {/* Features */}
                  {module.features && module.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {module.features.slice(0, 3).map(feature => (
                        <span
                          key={feature}
                          className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {module.features.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          +{module.features.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      {module.accessCount > 0 && (
                        <span>📊 {module.accessCount}x</span>
                      )}
                      {module.lastAccessed && (
                        <span>
                          🕒 {new Date(module.lastAccessed).toLocaleDateString('id')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {module.adminOnly && (
                        <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                      {module.category && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                          {getCategoryName(module.category)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Launch Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onModuleSelect(module.id);
                    }}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Buka Module</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Tidak ada module tersedia
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {selectedCategory === 'all' 
                ? 'Tidak ada module yang dapat diakses dengan role Anda.'
                : `Tidak ada module dalam kategori ${getCategoryName(selectedCategory)}.`
              }
            </p>
          </div>
        )}

        {/* Recent Activity */}
        {stats && stats.usage.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Aktivitas Terbaru
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.usage.slice(0, 5).map(usage => (
                  <div key={usage.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">
                        {availableModules.find(m => m.id === usage.id)?.icon ? (
                          <i className={availableModules.find(m => m.id === usage.id).icon}></i>
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {usage.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Terakhir diakses: {new Date(usage.lastAccessed).toLocaleString('id')}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {usage.accessCount}x digunakan
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleSelector;