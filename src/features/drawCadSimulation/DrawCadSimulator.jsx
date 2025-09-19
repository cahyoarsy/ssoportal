import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDrawCadEngine } from './hooks/useDrawCadEngineSimple';
import { useSimulationEngine } from './hooks/useSimulationEngine';

const COMPONENT_CATEGORIES = {
  'basic-electrical': {
    name: 'Basic Electrical',
    icon: '⚡',
    components: [
      { id: 'resistor', label: 'Resistor', icon: '▭═▭' },
      { id: 'capacitor', label: 'Capacitor', icon: '─║║─' },
      { id: 'inductor', label: 'Inductor', icon: '─∿∿─' },
      { id: 'battery', label: 'Battery', icon: '─┤├─' },
      { id: 'voltageSource', label: 'Voltage Source', icon: '─◯─' },
      { id: 'ground', label: 'Ground', icon: '⏚' },
      { id: 'wire', label: 'Wire', icon: '━━━' }
    ]
  },
  'switches-relays': {
    name: 'Switches & Relays',
    icon: '🔀',
    components: [
      { id: 'switch', label: 'SPST Switch', icon: '─╱─' },
      { id: 'spdt-switch', label: 'SPDT Switch', icon: '─╱┬─' },
      { id: 'pushbutton-no', label: 'Push Button NO', icon: '─○─' },
      { id: 'pushbutton-nc', label: 'Push Button NC', icon: '─●─' },
      { id: 'relay-spst', label: 'Relay SPST', icon: '⧈╱' },
      { id: 'relay-spdt', label: 'Relay SPDT', icon: '⧈╱┬' },
      { id: 'dip-switch', label: 'DIP Switch', icon: '╱╱╱╱' }
    ]
  },
  'diodes-leds': {
    name: 'Diodes & LEDs',
    icon: '🔺',
    components: [
      { id: 'diode', label: 'Diode', icon: '─▷│─' },
      { id: 'zener-diode', label: 'Zener Diode', icon: '─▷╫─' },
      { id: 'led', label: 'LED', icon: '─▷│↗' },
      { id: 'photodiode', label: 'Photodiode', icon: '─▷│↘' },
      { id: 'schottky-diode', label: 'Schottky', icon: '─▷S─' },
      { id: 'varicap', label: 'Varicap', icon: '─▷╫╫─' }
    ]
  },
  'transistors': {
    name: 'Transistors',
    icon: '📐',
    components: [
      { id: 'transistorNPN', label: 'NPN Transistor', icon: '┤├→' },
      { id: 'transistorPNP', label: 'PNP Transistor', icon: '┤├←' },
      { id: 'nmos', label: 'NMOS', icon: '┤│→' },
      { id: 'pmos', label: 'PMOS', icon: '┤○→' },
      { id: 'jfet-n', label: 'JFET N-Channel', icon: '┤┴→' },
      { id: 'jfet-p', label: 'JFET P-Channel', icon: '┤┬→' }
    ]
  },
  'power-sources': {
    name: 'Power Sources',
    icon: '🔌',
    components: [
      { id: 'dc-voltage', label: 'DC Voltage', icon: '─⎓─' },
      { id: 'ac-voltage', label: 'AC Voltage', icon: '─∿─' },
      { id: 'currentSource', label: 'Current Source', icon: '─◯I─' },
      { id: 'controlled-voltage', label: 'Controlled Voltage', icon: '─⎔─' },
      { id: 'solar-cell', label: 'Solar Cell', icon: '─☀─' }
    ]
  },
  'meters-instruments': {
    name: 'Meters & Instruments',
    icon: '📊',
    components: [
      { id: 'voltmeter', label: 'Voltmeter', icon: '◯V' },
      { id: 'ammeter', label: 'Ammeter', icon: '◯A' },
      { id: 'ohmmeter', label: 'Ohmmeter', icon: '◯Ω' },
      { id: 'wattmeter', label: 'Wattmeter', icon: '◯W' },
      { id: 'oscilloscope', label: 'Oscilloscope', icon: '◯〰' },
      { id: 'multimeter', label: 'Multimeter', icon: '◯📟' }
    ]
  },
  'logic-gates': {
    name: 'Logic Gates',
    icon: '🔣',
    components: [
      { id: 'andGate', label: 'AND Gate', icon: '┌─D&' },
      { id: 'orGate', label: 'OR Gate', icon: '┌─)≥1' },
      { id: 'notGate', label: 'NOT Gate', icon: '──▷○' },
      { id: 'nand-gate', label: 'NAND Gate', icon: '┌─D○' },
      { id: 'nor-gate', label: 'NOR Gate', icon: '┌─)○' },
      { id: 'xor-gate', label: 'XOR Gate', icon: '┌─)⊕' },
      { id: 'xnor-gate', label: 'XNOR Gate', icon: '┌─)⊙' }
    ]
  },
  'amplifiers': {
    name: 'Amplifiers',
    icon: '📡',
    components: [
      { id: 'op-amp', label: 'Op-Amp', icon: '▷▶' },
      { id: 'buffer', label: 'Buffer', icon: '▷─' },
      { id: 'inverter', label: 'Inverter', icon: '▷○' },
      { id: 'comparator', label: 'Comparator', icon: '▷±' }
    ]
  },
  'transformers': {
    name: 'Transformers',
    icon: '🔄',
    components: [
      { id: 'transformer', label: 'Transformer', icon: '◯◯' },
      { id: 'auto-transformer', label: 'Auto Transformer', icon: '◯⟶◯' },
      { id: 'current-transformer', label: 'Current Transformer', icon: 'CT' },
      { id: 'voltage-transformer', label: 'Voltage Transformer', icon: 'VT' }
    ]
  },
  'motors-actuators': {
    name: 'Motors & Actuators',
    icon: '⚙️',
    components: [
      { id: 'dc-motor', label: 'DC Motor', icon: 'M' },
      { id: 'ac-motor', label: 'AC Motor', icon: 'M~' },
      { id: 'stepper-motor', label: 'Stepper Motor', icon: 'M↻' },
      { id: 'servo-motor', label: 'Servo Motor', icon: 'M⟳' },
      { id: 'solenoid', label: 'Solenoid', icon: '⊃⊂' }
    ]
  },
  'sensors': {
    name: 'Sensors',
    icon: '📡',
    components: [
      { id: 'temperature-sensor', label: 'Temperature', icon: '🌡️' },
      { id: 'pressure-sensor', label: 'Pressure', icon: '⊥' },
      { id: 'light-sensor', label: 'Light Sensor', icon: '☀️' },
      { id: 'motion-sensor', label: 'Motion Sensor', icon: '🔍' },
      { id: 'proximity-sensor', label: 'Proximity', icon: '📏' },
      { id: 'hall-sensor', label: 'Hall Sensor', icon: 'H' }
    ]
  },
  'connectors': {
    name: 'Connectors',
    icon: '🔗',
    components: [
      { id: 'terminal', label: 'Terminal', icon: '●' },
      { id: 'connector-2pin', label: '2-Pin Connector', icon: '⚬⚬' },
      { id: 'connector-3pin', label: '3-Pin Connector', icon: '⚬⚬⚬' },
      { id: 'usb-connector', label: 'USB Connector', icon: 'USB' },
      { id: 'power-jack', label: 'Power Jack', icon: '⚡' }
    ]
  },
  'protection': {
    name: 'Protection',
    icon: '🛡️',
    components: [
      { id: 'fuse', label: 'Fuse', icon: '—◯—' },
      { id: 'circuit-breaker', label: 'Circuit Breaker', icon: '⫸' },
      { id: 'surge-protector', label: 'Surge Protector', icon: '⚡🛡️' },
      { id: 'tvs-diode', label: 'TVS Diode', icon: '▷⊥' }
    ]
  }
};

const TOOLBAR_TOOLS = [
  { id: 'select', label: 'Select', icon: '🖱️', shortcut: '1' },
  { id: 'pan', label: 'Pan', icon: '✋', shortcut: '2' },
  { id: 'zoom', label: 'Zoom', icon: '🔍', shortcut: '3' },
  { id: 'wire', label: 'Wire', icon: '━', shortcut: '4' },
  { id: 'text', label: 'Text', icon: '📝', shortcut: '5' },
  { id: 'measure', label: 'Measure', icon: '📏', shortcut: '6' },
  { id: 'erase', label: 'Erase', icon: '🧹', shortcut: 'Del' }
];

export default function DrawCadSimulator({ onNavigate }) {
  const canvasRef = useRef(null);
  const engine = useDrawCadEngine(canvasRef);
  const simulation = useSimulationEngine();
  const [activeCategory, setActiveCategory] = useState('basic-electrical');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProperties, setShowProperties] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const {
    tool, setTool, activeComponentType, setActiveComponentType,
    zoom, setZoom, pan, setPan, 
    snap, setSnap, snapEnabled, setSnapEnabled,
    gridVisible, setGridVisible, gridSize, setGridSize,
    selection, multiSelection, elements, layers, activeLayer, setActiveLayer,
    undo, redo, canUndo, canRedo, clearAll, deleteSelection, updateElement,
    exportToPNG, exportToDXF, exportToJSON, exportToSVG, importFromDWG,
    onCanvasMouseDown, onCanvasMouseMove, onCanvasMouseUp, onWheel,
    addComponent, startWire, commitWire, addText, render
  } = engine;

  const {
    isSimulating, toggleSimulation, componentStates, signalFlow,
    updateComponentParameter, toggleSwitch, getComponentState,
    COMPONENT_DEFINITIONS, voltage, current, power, setVoltage
  } = simulation;

  // Effect for rendering with simulation data
  useEffect(() => {
    render(signalFlow);
  }, [render, signalFlow, elements, isSimulating]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-200 flex items-center px-4 justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('software')}
            className="text-slate-600 hover:text-slate-900 text-sm flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ← Kembali ke Software
          </button>
          <div className="border-l border-slate-300 h-8"></div>
          <h1 className="font-bold text-slate-800 text-lg">DRAw CAD SIMULATION</h1>
          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-500">
            <span>Tool: <span className="font-medium text-blue-600">{tool}</span></span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>Elements: {elements.length}</span>
            <span>Layer: {layers.find(l => l.id === activeLayer)?.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* File Operations */}
          <div className="flex items-center gap-1 border-r border-slate-300 pr-3">
            <button className="px-3 py-2 text-xs rounded bg-green-500 text-white hover:bg-green-600 transition-colors">📂 New</button>
            <button className="px-3 py-2 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors">📁 Open</button>
            <button className="px-3 py-2 text-xs rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors">💾 Save</button>
          </div>

          {/* Edit Operations */}
          <div className="flex items-center gap-1 border-r border-slate-300 pr-3">
            <button 
              onClick={undo} 
              disabled={!canUndo}
              className={`px-3 py-2 text-xs rounded border transition-colors ${canUndo ? 'bg-slate-100 hover:bg-slate-200' : 'bg-slate-50 text-slate-400'}`}
            >
              ↶ Undo
            </button>
            <button 
              onClick={redo}
              disabled={!canRedo} 
              className={`px-3 py-2 text-xs rounded border transition-colors ${canRedo ? 'bg-slate-100 hover:bg-slate-200' : 'bg-slate-50 text-slate-400'}`}
            >
              ↷ Redo
            </button>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-1 border-r border-slate-300 pr-3">
            <button onClick={() => setZoom(z => Math.min(5, z * 1.2))} className="px-2 py-2 text-xs rounded bg-slate-100 hover:bg-slate-200 border">🔍+</button>
            <button onClick={() => setZoom(z => Math.max(0.1, z / 1.2))} className="px-2 py-2 text-xs rounded bg-slate-100 hover:bg-slate-200 border">🔍-</button>
            <button onClick={() => setZoom(1)} className="px-2 py-2 text-xs rounded bg-slate-100 hover:bg-slate-200 border">1:1</button>
            <button onClick={() => setGridVisible(g => !g)} className={`px-2 py-2 text-xs rounded border ${gridVisible ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>⊞</button>
            <button onClick={() => setSnapEnabled(s => !s)} className={`px-2 py-2 text-xs rounded border ${snapEnabled ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>📐</button>
          </div>

          {/* Simulation Controls */}
          <div className="flex items-center gap-1 border-r border-slate-300 pr-3">
            <button 
              onClick={() => toggleSimulation(elements)}
              className={`px-3 py-2 text-xs rounded transition-colors ${
                isSimulating 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isSimulating ? '⏹️ Stop' : '▶️ Simulate'}
            </button>
            <div className="text-xs text-slate-600 px-2">
              V: {voltage.toFixed(1)}V | I: {current.toFixed(3)}A | P: {power.toFixed(2)}W
            </div>
          </div>

          {/* Export */}
          <div className="flex items-center gap-1">
            <button onClick={() => exportToPNG()} className="px-2 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">PNG</button>
            <button onClick={() => exportToDXF()} className="px-2 py-2 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors">DXF</button>
            <button onClick={() => exportToSVG()} className="px-2 py-2 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">SVG</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools & Components */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-80'} border-r border-slate-200 bg-white/90 backdrop-blur flex flex-col transition-all duration-300`}>
          {/* Sidebar Toggle */}
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            {!sidebarCollapsed && <h3 className="font-semibold text-slate-700">Tools & Components</h3>}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-slate-100 rounded"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          {!sidebarCollapsed && (
            <>
              {/* Toolbar */}
              <div className="p-3 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Drawing Tools</p>
                <div className="grid grid-cols-4 gap-2">
                  {TOOLBAR_TOOLS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTool(t.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded border text-xs transition-all ${
                        tool === t.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      title={`${t.label} (${t.shortcut})`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span className="font-medium text-[10px] leading-tight">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Component Categories */}
              <div className="p-3 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Component Categories</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {Object.entries(COMPONENT_CATEGORIES).map(([categoryId, category]) => (
                    <button
                      key={categoryId}
                      onClick={() => setActiveCategory(categoryId)}
                      className={`w-full flex items-center gap-3 p-2 rounded text-xs transition-all ${
                        activeCategory === categoryId ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Component Palette */}
              <div className="p-3 flex-1 overflow-y-auto">
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
                  {COMPONENT_CATEGORIES[activeCategory]?.name} Components
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {COMPONENT_CATEGORIES[activeCategory]?.components.map(component => (
                    <button
                      key={component.id}
                      onClick={() => {
                        setActiveComponentType(component.id);
                        setTool('component');
                      }}
                      className={`flex flex-col items-center gap-1 p-3 rounded border text-xs transition-all ${
                        activeComponentType === component.id && tool === 'component' 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                          : 'bg-white hover:border-emerald-400 hover:bg-emerald-50'
                      }`}
                      title={component.label}
                    >
                      <span className="text-base">{component.icon}</span>
                      <span className="font-medium text-[9px] leading-tight text-center">{component.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-slate-50">
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            onMouseDown={onCanvasMouseDown}
            onMouseMove={onCanvasMouseMove}
            onMouseUp={onCanvasMouseUp}
            onWheel={onWheel}
            className="w-full h-full cursor-crosshair select-none bg-white"
          />

          {/* Canvas Overlay Info */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-md text-xs text-slate-600 space-x-4 flex items-center">
            <span>Tool: <span className="font-medium text-blue-600">{tool}</span></span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>Grid: {gridVisible ? 'On' : 'Off'}</span>
            <span>Snap: {snapEnabled ? 'On' : 'Off'}</span>
            <span>Elements: {elements.length}</span>
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button onClick={() => setZoom(1)} className="px-3 py-2 bg-white/95 backdrop-blur rounded-lg shadow text-xs hover:bg-white transition-colors">Fit to Screen</button>
            <button onClick={clearAll} className="px-3 py-2 bg-red-500 text-white rounded-lg shadow text-xs hover:bg-red-600 transition-colors">Clear All</button>
          </div>
        </div>

        {/* Right Sidebar - Properties & Layers */}
        {showProperties && (
          <aside className="w-80 border-l border-slate-200 bg-white/90 backdrop-blur flex flex-col">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-700">Properties & Layers</h3>
              <button 
                onClick={() => setShowProperties(false)}
                className="p-2 hover:bg-slate-100 rounded"
              >
                ×
              </button>
            </div>

            {/* Layers Panel */}
            <div className="p-3 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Layers</p>
              <div className="space-y-1">
                {layers.map(layer => (
                  <div key={layer.id} className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveLayer(layer.id)}
                      className={`flex-1 px-3 py-2 text-xs rounded border text-left ${
                        activeLayer === layer.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-blue-50 border-slate-300'
                      }`}
                    >
                      {layer.name}
                    </button>
                    <button className={`w-8 h-8 rounded border text-xs ${layer.visible ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
                      👁️
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Properties Panel */}
            <div className="p-3 flex-1 overflow-auto">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Selection Properties</p>
              {selection ? (
                <div className="space-y-3 p-3 bg-slate-50 rounded border">
                  <div className="font-medium text-slate-700">
                    {selection.type || selection.kind}: {selection.id}
                  </div>
                  
                  {selection.kind === 'component' && (
                    <div className="space-y-2">
                      {/* Basic Properties */}
                      <label className="block">
                        <span className="block text-xs text-slate-600 mb-1">Label</span>
                        <input
                          type="text"
                          className="w-full border rounded p-2 text-xs"
                          value={selection.label || ''}
                          onChange={(e) => updateElement(selection.id, { label: e.target.value })}
                          placeholder="Component label"
                        />
                      </label>
                      
                      <label className="block">
                        <span className="block text-xs text-slate-600 mb-1">Rotation</span>
                        <select
                          className="w-full border rounded p-2 text-xs"
                          value={selection.rotation || 0}
                          onChange={(e) => updateElement(selection.id, { rotation: parseInt(e.target.value) })}
                        >
                          <option value={0}>0°</option>
                          <option value={90}>90°</option>
                          <option value={180}>180°</option>
                          <option value={270}>270°</option>
                        </select>
                      </label>

                      <label className="block">
                        <span className="block text-xs text-slate-600 mb-1">Value</span>
                        <input
                          type="text"
                          className="w-full border rounded p-2 text-xs"
                          value={selection.value || ''}
                          onChange={(e) => updateElement(selection.id, { value: e.target.value })}
                          placeholder="e.g. 10kΩ, 100µF"
                        />
                      </label>

                      {/* Simulation Properties */}
                      {COMPONENT_DEFINITIONS[selection.componentType] && (
                        <div className="mt-4 pt-3 border-t border-slate-300">
                          <p className="text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">
                            ⚡ Simulation Parameters
                          </p>
                          
                          {/* Component-specific parameters */}
                          {selection.componentType === 'resistor' && (
                            <div className="space-y-2">
                              <label className="block">
                                <span className="block text-xs text-slate-600 mb-1">Resistance (Ω)</span>
                                <input
                                  type="number"
                                  className="w-full border rounded p-2 text-xs"
                                  value={getComponentState(selection.id).resistance || 1000}
                                  onChange={(e) => updateComponentParameter(selection.id, 'resistance', parseFloat(e.target.value))}
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-slate-600 mb-1">Power Rating (W)</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="w-full border rounded p-2 text-xs"
                                  value={getComponentState(selection.id).power || 0.25}
                                  onChange={(e) => updateComponentParameter(selection.id, 'power', parseFloat(e.target.value))}
                                />
                              </label>
                            </div>
                          )}

                          {selection.componentType === 'capacitor' && (
                            <div className="space-y-2">
                              <label className="block">
                                <span className="block text-xs text-slate-600 mb-1">Capacitance (F)</span>
                                <input
                                  type="number"
                                  step="0.000001"
                                  className="w-full border rounded p-2 text-xs"
                                  value={getComponentState(selection.id).capacitance || 100e-6}
                                  onChange={(e) => updateComponentParameter(selection.id, 'capacitance', parseFloat(e.target.value))}
                                />
                              </label>
                            </div>
                          )}

                          {selection.componentType === 'voltageSource' && (
                            <div className="space-y-2">
                              <label className="block">
                                <span className="block text-xs text-slate-600 mb-1">Voltage (V)</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="w-full border rounded p-2 text-xs"
                                  value={getComponentState(selection.id).voltage || 5}
                                  onChange={(e) => updateComponentParameter(selection.id, 'voltage', parseFloat(e.target.value))}
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-slate-600 mb-1">Frequency (Hz)</span>
                                <input
                                  type="number"
                                  step="1"
                                  className="w-full border rounded p-2 text-xs"
                                  value={getComponentState(selection.id).frequency || 0}
                                  onChange={(e) => updateComponentParameter(selection.id, 'frequency', parseFloat(e.target.value))}
                                />
                              </label>
                            </div>
                          )}

                          {(selection.componentType === 'andGate' || selection.componentType === 'orGate' || selection.componentType === 'notGate') && (
                            <div className="space-y-2">
                              <label className="block">
                                <span className="block text-xs text-slate-600 mb-1">VCC (V)</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="w-full border rounded p-2 text-xs"
                                  value={getComponentState(selection.id).vcc || 5}
                                  onChange={(e) => updateComponentParameter(selection.id, 'vcc', parseFloat(e.target.value))}
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-slate-600 mb-1">Threshold (V)</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="w-full border rounded p-2 text-xs"
                                  value={getComponentState(selection.id).threshold || 2.5}
                                  onChange={(e) => updateComponentParameter(selection.id, 'threshold', parseFloat(e.target.value))}
                                />
                              </label>
                            </div>
                          )}

                          {selection.componentType === 'switch' && (
                            <div className="space-y-2">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={getComponentState(selection.id).closed || false}
                                  onChange={(e) => toggleSwitch(selection.id)}
                                />
                                <span className="text-sm">Switch Closed</span>
                              </label>
                              <button
                                onClick={() => toggleSwitch(selection.id)}
                                className={`w-full px-3 py-2 text-xs rounded transition-colors ${
                                  getComponentState(selection.id).closed 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : 'bg-red-500 text-white hover:bg-red-600'
                                }`}
                              >
                                {getComponentState(selection.id).closed ? '⚡ ON' : '⭕ OFF'}
                              </button>
                            </div>
                          )}

                          {/* Real-time Status Display */}
                          {isSimulating && signalFlow.has(selection.id) && (
                            <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded">
                              <p className="text-xs font-semibold text-purple-700 mb-1">Live Status</p>
                              {(() => {
                                const status = signalFlow.get(selection.id);
                                return (
                                  <div className="space-y-1 text-xs">
                                    {status.power !== undefined && (
                                      <div>Power: <span className="font-mono text-purple-700">{status.power.toFixed(3)}W</span></div>
                                    )}
                                    {status.logicState !== undefined && (
                                      <div>Logic: <span className={`font-mono ${status.logicState ? 'text-green-600' : 'text-red-600'}`}>
                                        {status.logicState ? 'HIGH' : 'LOW'}
                                      </span></div>
                                    )}
                                    {status.conducting !== undefined && (
                                      <div>State: <span className={`font-mono ${status.conducting ? 'text-green-600' : 'text-red-600'}`}>
                                        {status.conducting ? 'CONDUCTING' : 'BLOCKING'}
                                      </span></div>
                                    )}
                                    {status.reading !== undefined && (
                                      <div>Reading: <span className="font-mono text-blue-600">
                                        {status.reading.toFixed(3)} {status.units}
                                      </span></div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : multiSelection.length > 0 ? (
                <div className="p-3 bg-blue-50 rounded border">
                  <div className="font-medium text-blue-700">Multi-selection</div>
                  <div className="text-blue-600 text-sm">{multiSelection.length} elements selected</div>
                </div>
              ) : (
                <p className="text-slate-400 italic text-sm">No selection</p>
              )}

              {/* Settings */}
              <div className="mt-6">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Canvas Settings</p>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={gridVisible}
                      onChange={(e) => setGridVisible(e.target.checked)}
                    />
                    <span className="text-sm">Show Grid</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={snapEnabled}
                      onChange={(e) => setSnapEnabled(e.target.checked)}
                    />
                    <span className="text-sm">Smart Snap</span>
                  </label>
                  
                  <label className="block">
                    <span className="block text-xs text-slate-600 mb-1">Grid Size</span>
                    <select
                      className="w-full border rounded p-2 text-xs"
                      value={gridSize}
                      onChange={(e) => setGridSize(parseInt(e.target.value))}
                    >
                      <option value={5}>5px</option>
                      <option value={10}>10px</option>
                      <option value={20}>20px</option>
                      <option value={25}>25px</option>
                      <option value={50}>50px</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Shortcuts */}
              <div className="mt-6">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Keyboard Shortcuts</p>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>• 1-7: Select tools</div>
                  <div>• Ctrl+Z/Y: Undo/Redo</div>
                  <div>• Ctrl+A: Select All</div>
                  <div>• Del: Delete selection</div>
                  <div>• Ctrl+G: Group selection</div>
                  <div>• Ctrl+Shift+G: Ungroup</div>
                  <div>• Space+Drag: Pan canvas</div>
                  <div>• Ctrl+Scroll: Zoom</div>
                  <div>• Shift+Click: Multi-select</div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Properties Panel Toggle */}
        {!showProperties && (
          <button
            onClick={() => setShowProperties(true)}
            className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur rounded-lg shadow border hover:bg-white transition-colors"
          >
            ⚙️
          </button>
        )}
      </div>
    </div>
  );
}