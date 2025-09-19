import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MonitoringPage({ user, onBack }) {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    // Simulate loading and connection
    const timer = setTimeout(() => {
      setIsLoading(false);
      setConnectionStatus('connected');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const monitoringData = [
    {
      id: 1,
      name: 'Ahmad Rizki',
      kelas: '11 TITL A',
      modul: 'IML Dasar',
      progress: 85,
      lastActivity: '5 menit lalu',
      status: 'active'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      kelas: '11 TITL B',
      modul: 'Instalasi Panel',
      progress: 72,
      lastActivity: '12 menit lalu',
      status: 'active'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      kelas: '11 TITL A',
      modul: 'Motor 3 Fasa',
      progress: 60,
      lastActivity: '25 menit lalu',
      status: 'idle'
    },
    {
      id: 4,
      name: 'Dewi Sartika',
      kelas: '11 TITL C',
      modul: 'Pengukuran Listrik',
      progress: 94,
      lastActivity: '2 menit lalu',
      status: 'active'
    }
  ];

  const systemStats = [
    { label: 'Total Siswa Online', value: '24', color: 'text-green-600' },
    { label: 'Modul Aktif', value: '8', color: 'text-blue-600' },
    { label: 'Rata-rata Progress', value: '78%', color: 'text-purple-600' },
    { label: 'Server Status', value: 'Normal', color: 'text-green-600' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h1 className="text-2xl font-semibold text-white">Monitoring System</h1>
          <p className="text-slate-300">Memuat data monitoring...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Kembali</span>
              </button>
              <div className="h-6 w-px bg-white/20"></div>
              <h1 className="text-xl font-bold">System Monitoring</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                connectionStatus === 'connected' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400' : 'bg-yellow-400'
                } animate-pulse`}></div>
                <span className="capitalize">{connectionStatus}</span>
              </div>
              <span className="text-sm text-slate-300">
                {user?.name || 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <p className="text-sm text-slate-300 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Monitoring Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Aktivitas Siswa Real-time</h2>
            <p className="text-sm text-slate-300">Pemantauan pembelajaran dan progress siswa</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-300">Siswa</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-300">Kelas</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-300">Modul</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-300">Progress</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-300">Aktivitas</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {monitoringData.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{student.kelas}</td>
                    <td className="px-6 py-4 text-slate-300">{student.modul}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-300">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{student.lastActivity}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {student.status === 'active' ? 'Aktif' : 'Idle'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* External Integration Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <a
            href="/integrations/monitoring/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">👨‍🏫</span>
              </div>
              <div>
                <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">Monitoring Guru</h3>
                <p className="text-sm text-slate-300">Advanced monitoring dashboard</p>
              </div>
            </div>
          </a>

          <a
            href="/integrations/elearning-iml/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">E-Learning IML</h3>
                <p className="text-sm text-slate-300">Integrated learning modules</p>
              </div>
            </div>
          </a>

          <a
            href="/test-portal.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">🧪</span>
              </div>
              <div>
                <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">Portal Test</h3>
                <p className="text-sm text-slate-300">System diagnostics</p>
              </div>
            </div>
          </a>
        </motion.div>
      </main>
    </div>
  );
}