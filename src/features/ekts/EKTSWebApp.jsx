import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEKTSCanvas } from './hooks/useEKTSCanvas';

const EKTSWebApp = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('simulator');
  const [projectName, setProjectName] = useState('Proyek Baru');
  const [selectedComponent, setSelectedComponent] = useState('resistor');
  const canvasRef = useRef(null);
  
  const {
    elements,
    selectedElement,
    tool,
    zoom,
    isDrawing,
    setTool,
    setZoom,
    addComponent,
    addWire,
    selectElement,
    deleteElement,
    updateElement,
    clearCanvas
  } = useEKTSCanvas(canvasRef);

  const tools = [
    { id: 'select', name: 'Select', icon: '👆', shortcut: 'V' },
    { id: 'wire', name: 'Wire', icon: '〰️', shortcut: 'W' },
    { id: 'component', name: 'Component', icon: '🔧', shortcut: 'C' },
    { id: 'text', name: 'Text', icon: '📝', shortcut: 'T' },
    { id: 'measure', name: 'Measure', icon: '📏', shortcut: 'M' }
  ];

  const componentLibrary = [
    {
      category: 'Power Sources',
      items: [
        { id: 'battery', name: 'Battery', symbol: '⚡', description: 'DC Power Source' },
        { id: 'ac_source', name: 'AC Source', symbol: '∼', description: 'AC Power Source' },
        { id: 'ground', name: 'Ground', symbol: '⊥', description: 'Ground Connection' }
      ]
    },
    {
      category: 'Resistive Elements',
      items: [
        { id: 'resistor', name: 'Resistor', symbol: '▭', description: 'Fixed Resistor' },
        { id: 'variable_resistor', name: 'Variable Resistor', symbol: '⟲', description: 'Adjustable Resistor' },
        { id: 'potentiometer', name: 'Potentiometer', symbol: '⟳', description: 'Three Terminal Resistor' }
      ]
    },
    {
      category: 'Reactive Elements',
      items: [
        { id: 'capacitor', name: 'Capacitor', symbol: '||', description: 'Energy Storage Element' },
        { id: 'inductor', name: 'Inductor', symbol: '⟜⟝', description: 'Magnetic Energy Storage' },
        { id: 'transformer', name: 'Transformer', symbol: '⧨', description: 'Magnetic Coupling' }
      ]
    },
    {
      category: 'Semiconductors',
      items: [
        { id: 'diode', name: 'Diode', symbol: '▷|', description: 'One-way Current Flow' },
        { id: 'led', name: 'LED', symbol: '◁▷|', description: 'Light Emitting Diode' },
        { id: 'transistor', name: 'Transistor', symbol: '⧩', description: 'Amplifying Element' }
      ]
    },
    {
      category: 'Switching Elements',
      items: [
        { id: 'switch', name: 'Switch', symbol: '○-/', description: 'Manual Switch' },
        { id: 'relay', name: 'Relay', symbol: '[]--', description: 'Electromagnetic Switch' },
        { id: 'breaker', name: 'Circuit Breaker', symbol: '[]○', description: 'Protection Switch' }
      ]
    },
    {
      category: 'Measuring Instruments',
      items: [
        { id: 'voltmeter', name: 'Voltmeter', symbol: 'V', description: 'Voltage Measurement' },
        { id: 'ammeter', name: 'Ammeter', symbol: 'A', description: 'Current Measurement' },
        { id: 'ohmmeter', name: 'Ohmmeter', symbol: 'Ω', description: 'Resistance Measurement' }
      ]
    }
  ];

  const analysisTools = [
    { id: 'dc_analysis', name: 'DC Analysis', icon: '⚡', description: 'Steady-state DC circuit analysis' },
    { id: 'ac_analysis', name: 'AC Analysis', icon: '∼', description: 'Frequency domain analysis' },
    { id: 'transient', name: 'Transient Analysis', icon: '📈', description: 'Time domain simulation' },
    { id: 'load_flow', name: 'Load Flow', icon: '🔄', description: 'Power system load flow' },
    { id: 'short_circuit', name: 'Short Circuit', icon: '⚠️', description: 'Fault current calculation' },
    { id: 'harmonic', name: 'Harmonic Analysis', icon: '🌊', description: 'Frequency spectrum analysis' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'select') {
      selectElement(x, y);
    } else if (tool === 'component') {
      const componentProps = {
        value: selectedComponent === 'resistor' ? '1kΩ' : 
               selectedComponent === 'capacitor' ? '1µF' :
               selectedComponent === 'inductor' ? '1mH' : ''
      };
      addComponent(selectedComponent, x, y, componentProps);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Delete' && selectedElement) {
      deleteElement(selectedElement.id);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedElement]);

  const handleExport = (format) => {
    const canvas = canvasRef.current;
    let dataUrl;
    
    switch (format) {
      case 'png':
        dataUrl = canvas.toDataURL('image/png');
        break;
      case 'svg':
        // SVG export logic would go here
        alert('Export to SVG format');
        return;
      case 'pdf':
        // PDF export logic would go here
        alert('Export to PDF format');
        return;
      case 'dxf':
        // DXF export logic would go here
        alert('Export to DXF format');
        return;
      default:
        return;
    }
    
    const link = document.createElement('a');
    link.download = `${projectName.replace(/\s+/g, '_')}.${format}`;
    link.href = dataUrl;
    link.click();
  };

  const runAnalysis = (analysisType) => {
    // Simulation analysis logic
    alert(`Menjalankan ${analysisType} analysis...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('software')}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <span>←</span>
                <span>Kembali</span>
              </button>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔌</span>
                <h1 className="text-xl font-bold text-slate-800">EKTS</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="px-3 py-1 border border-slate-300 rounded-md text-sm"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExport('png')}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
                >
                  📄 Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200 overflow-y-auto">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              🔧 Simulator
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'analysis'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              📊 Analysis
            </button>
          </div>

          {activeTab === 'simulator' && (
            <div className="p-4 space-y-6">
              {/* Tools */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Drawing Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map((toolItem) => (
                    <button
                      key={toolItem.id}
                      onClick={() => setTool(toolItem.id)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        tool === toolItem.id
                          ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="text-lg mb-1">{toolItem.icon}</div>
                      <div>{toolItem.name}</div>
                      <div className="text-xs opacity-75">({toolItem.shortcut})</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Component Library */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Component Library</h3>
                <div className="space-y-4">
                  {componentLibrary.map((category) => (
                    <div key={category.category}>
                      <h4 className="text-xs font-medium text-slate-500 mb-2">{category.category}</h4>
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <button
                            key={item.id}
                            className="w-full p-2 text-left rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                            onClick={() => {
                              setSelectedComponent(item.id);
                              setTool('component');
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{item.symbol}</span>
                              <div>
                                <div className="text-sm font-medium text-slate-700">{item.name}</div>
                                <div className="text-xs text-slate-500">{item.description}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Analysis Tools</h3>
              {analysisTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => runAnalysis(tool.name)}
                  className="w-full p-3 text-left rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{tool.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-700">{tool.name}</div>
                      <div className="text-xs text-slate-500">{tool.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-md hover:bg-slate-100 transition-colors">
                    ↶ Undo
                  </button>
                  <button className="p-2 rounded-md hover:bg-slate-100 transition-colors">
                    ↷ Redo
                  </button>
                </div>
                <div className="w-px h-6 bg-slate-300"></div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-md hover:bg-slate-100 transition-colors">
                    🔍+ Zoom In
                  </button>
                  <span className="text-sm text-slate-600">100%</span>
                  <button className="p-2 rounded-md hover:bg-slate-100 transition-colors">
                    🔍- Zoom Out
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Selected: {tool}</span>
                <div className="w-px h-6 bg-slate-300"></div>
                <button 
                  onClick={() => runAnalysis('Circuit Simulation')}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  ▶️ Simulate
                </button>
                <button 
                  onClick={clearCanvas}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-hidden bg-white relative">
            <canvas
              ref={canvasRef}
              width={1200}
              height={800}
              className="border border-slate-200 cursor-crosshair"
              onClick={handleCanvasClick}
              style={{ 
                backgroundImage: `
                  radial-gradient(circle, #ddd 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Canvas Status */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-sm text-slate-600">
                <div>Elements: {elements.length}</div>
                <div>Selected: {selectedElement ? selectedElement.type : 'None'}</div>
                <div>Tool: {tool}</div>
                <div>Zoom: {Math.round(zoom * 100)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 bg-white/80 backdrop-blur-sm border-l border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Properties</h3>
          
          {tool === 'component' && selectedElement && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Component Type</label>
                <select 
                  value={selectedElement.type}
                  onChange={(e) => updateElement(selectedElement.id, { type: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="resistor">Resistor</option>
                  <option value="capacitor">Capacitor</option>
                  <option value="inductor">Inductor</option>
                  <option value="battery">Battery</option>
                  <option value="ground">Ground</option>
                  <option value="diode">Diode</option>
                  <option value="voltmeter">Voltmeter</option>
                  <option value="ammeter">Ammeter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Value</label>
                <input
                  type="text"
                  value={selectedElement.value || ''}
                  onChange={(e) => updateElement(selectedElement.id, { value: e.target.value })}
                  placeholder="1kΩ"
                  className="w-full p-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Rotation</label>
                <select 
                  value={selectedElement.rotation || 0}
                  onChange={(e) => updateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value={0}>0°</option>
                  <option value={90}>90°</option>
                  <option value={180}>180°</option>
                  <option value={270}>270°</option>
                </select>
              </div>

              <button
                onClick={() => deleteElement(selectedElement.id)}
                className="w-full px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
              >
                🗑️ Delete Component
              </button>
            </div>
          )}

          {!selectedElement && (
            <div className="text-sm text-slate-500">
              Select a component to edit its properties
            </div>
          )}

          <div className="mt-8">
            <h4 className="text-xs font-medium text-slate-500 mb-3">Project Info</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div>Created: {new Date().toLocaleDateString()}</div>
              <div>Modified: {new Date().toLocaleTimeString()}</div>
              <div>Version: 1.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EKTSWebApp;