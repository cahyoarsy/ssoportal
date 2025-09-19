import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SoftwarePage = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const softwareCategories = [
    { id: 'all', name: 'Semua Software', icon: '🔧' },
    { id: 'simulation', name: 'Simulasi & CAD', icon: '🖥️' },
    { id: 'calculation', name: 'Perhitungan', icon: '📐' },
    { id: 'design', name: 'Desain Elektrik', icon: '⚡' },
    { id: 'tools', name: 'Tools Utilitas', icon: '🛠️' }
  ];

  const softwareList = [
    {
      id: 'draw-cad-simulation',
      name: 'DRAw CAD SIMULATION',
      description: 'Professional CAD software untuk desain teknik elektrik dengan library komponen lengkap',
      category: 'simulation',
      icon: '🎨',
      color: 'from-purple-500 to-purple-600',
      features: ['280+ Diagram Types', 'Electrical Components', 'DWG Import/Export', 'Professional Templates'],
      status: 'available',
      version: 'v5.2.1',
      size: '245 MB'
    },
    {
      id: 'ekts-cad',
      name: 'EKTS CAD Simulator',
      description: 'Simulator CAD untuk desain sistem kelistrikan lengkap',
      category: 'simulation',
      icon: '🔌',
      color: 'from-blue-500 to-blue-600',
      features: ['Simulasi Rangkaian', 'CAD Elektrik', 'Analisis Beban', 'Export Drawing'],
      status: 'available',
      version: 'v2.1.4',
      size: '125 MB'
    },
    {
      id: 'circuit-sim',
      name: 'Circuit Simulator Pro',
      description: 'Simulasi rangkaian elektrik dan elektronik advanced',
      category: 'simulation',
      icon: '🔗',
      color: 'from-green-500 to-green-600',
      features: ['AC/DC Analysis', 'Transient Analysis', 'FFT Analysis', 'SPICE Compatible'],
      status: 'available',
      version: 'v3.2.1',
      size: '89 MB'
    },
    {
      id: 'motor-calc',
      name: 'Motor Calculator Suite',
      description: 'Kalkulator komprehensif untuk motor listrik 3 fasa',
      category: 'calculation',
      icon: '⚙️',
      color: 'from-orange-500 to-orange-600',
      features: ['Perhitungan Daya', 'Efisiensi Motor', 'Starting Current', 'Torque Analysis'],
      status: 'available',
      version: 'v1.8.3',
      size: '32 MB'
    },
    {
      id: 'electrical-cad',
      name: 'ElectriCAD Designer',
      description: 'Software CAD khusus untuk desain instalasi listrik',
      category: 'design',
      icon: '📋',
      color: 'from-purple-500 to-purple-600',
      features: ['Schematic Design', 'Panel Layout', 'Wire Numbering', 'BOM Generation'],
      status: 'available',
      version: 'v4.5.2',
      size: '156 MB'
    },
    {
      id: 'load-flow',
      name: 'Load Flow Analyzer',
      description: 'Analisis aliran daya dan stabilitas sistem tenaga',
      category: 'calculation',
      icon: '📊',
      color: 'from-red-500 to-red-600',
      features: ['Load Flow Study', 'Short Circuit Analysis', 'Stability Analysis', 'Report Generator'],
      status: 'available',
      version: 'v2.7.1',
      size: '94 MB'
    },
    {
      id: 'panel-designer',
      name: 'Panel Design Studio',
      description: 'Desain panel listrik dengan library komponen lengkap',
      category: 'design',
      icon: '🎛️',
      color: 'from-indigo-500 to-indigo-600',
      features: ['3D Panel View', 'Component Library', 'Thermal Analysis', 'Assembly Drawing'],
      status: 'available',
      version: 'v3.1.8',
      size: '178 MB'
    },
    {
      id: 'wire-calc',
      name: 'Cable Sizing Tool',
      description: 'Perhitungan ukuran kabel dan voltage drop',
      category: 'calculation',
      icon: '📏',
      color: 'from-yellow-500 to-yellow-600',
      features: ['Cable Sizing', 'Voltage Drop', 'Ampacity Calculation', 'Conduit Fill'],
      status: 'available',
      version: 'v2.3.4',
      size: '28 MB'
    },
    {
      id: 'plc-sim',
      name: 'PLC Simulator',
      description: 'Simulasi PLC untuk kontrol motor dan otomasi',
      category: 'simulation',
      icon: '🤖',
      color: 'from-cyan-500 to-cyan-600',
      features: ['Ladder Logic', 'Function Block', 'HMI Integration', 'Real-time Simulation'],
      status: 'available',
      version: 'v1.9.2',
      size: '67 MB'
    }
  ];

  const filteredSoftware = softwareList.filter(software => {
    const matchesCategory = activeCategory === 'all' || software.category === activeCategory;
    const matchesSearch = software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         software.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInstall = (softwareId) => {
    // Simulasi instalasi software
    alert(`Memulai instalasi ${softwareList.find(s => s.id === softwareId)?.name}...`);
  };

  const handleLaunch = (softwareId) => {
    const software = softwareList.find(s => s.id === softwareId);
    if (!software) return;
    if (software.id === 'draw-cad-simulation') {
      onNavigate('drawCadSimulation');
    } else if (software.id === 'ekts-cad') {
      onNavigate('ekts');
    } else if (software.id === 'electrical-cad') {
      onNavigate('electricalCad');
    } else {
      alert(`Meluncurkan ${software?.name}...`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <span>←</span>
                <span>Kembali</span>
              </button>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💻</span>
                <h1 className="text-xl font-bold text-slate-800">Software Kelistrikan</h1>
              </div>
            </div>
            <div className="text-sm text-slate-600">
              {filteredSoftware.length} software tersedia
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari software..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-3 text-slate-400">🔍</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {softwareCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/60 text-slate-700 hover:bg-white/80 hover:shadow-md'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Software Grid */}
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredSoftware.map((software) => (
              <motion.div
                key={software.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Software Header */}
                <div className={`h-32 bg-gradient-to-r ${software.color} p-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 flex items-center justify-between h-full">
                    <div>
                      <div className="text-4xl mb-2">{software.icon}</div>
                      <div className="text-white/90 text-sm font-medium">
                        {software.version} • {software.size}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        software.status === 'available' 
                          ? 'bg-green-400/20 text-green-100' 
                          : 'bg-yellow-400/20 text-yellow-100'
                      }`}>
                        {software.status === 'available' ? 'Tersedia' : 'Update'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Software Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {software.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {software.description}
                  </p>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-slate-500 mb-2">Fitur Utama:</div>
                    <div className="flex flex-wrap gap-1">
                      {software.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                      {software.features.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                          +{software.features.length - 3} lagi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLaunch(software.id)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      🚀 Buka
                    </button>
                    <button
                      onClick={() => handleInstall(software.id)}
                      className="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-slate-300 transition-all duration-200"
                    >
                      📥 Install
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredSoftware.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Tidak ada software ditemukan</h3>
            <p className="text-slate-500">Coba ubah kata kunci pencarian atau filter kategori</p>
          </motion.div>
        )}

        {/* Featured Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">⭐ Software Unggulan</h3>
              <p className="text-purple-100 mb-4">
                EKTS - Solusi lengkap untuk desain dan simulasi sistem kelistrikan
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">✨ Terpopuler</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">🏆 Rating 4.8/5</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">📈 1000+ pengguna</span>
              </div>
            </div>
            <button
              onClick={() => handleLaunch('ekts-cad')}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Coba Sekarang →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwarePage;