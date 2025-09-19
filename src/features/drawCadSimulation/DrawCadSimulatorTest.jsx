import React from 'react';

/**
 * Simple Test Component for DrawCadSimulator
 * To test if the basic component renders without errors
 */
export function DrawCadSimulatorTest({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate?.('dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              DRAw CAD SIMULATION (Test)
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🎯 Test Component Loaded Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Komponen DRAw CAD SIMULATION berhasil di-render tanpa error.
          </p>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800">✅ Status: OK</h3>
              <p className="text-green-600">Komponen dapat di-load dan di-render dengan normal</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800">🔧 Next Steps:</h3>
              <p className="text-blue-600">Implementasi fitur CAD Simulation lengkap</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}