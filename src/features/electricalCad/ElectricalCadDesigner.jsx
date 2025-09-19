import React, { useRef } from 'react';
import { useElectricalCadEngine } from './hooks/useElectricalCadEngine';

const COMPONENT_PALETTE = [
  { id: 'outlet', label: 'Outlet', icon: '🔌' },
  { id: 'switch', label: 'Switch', icon: '🔀' },
  { id: 'lamp', label: 'Lamp', icon: '💡' },
  { id: 'breaker', label: 'MCB', icon: '⚡' },
  { id: 'junction', label: 'Junction', icon: '⚪' },
  { id: 'panel', label: 'Panel', icon: '📋' },
  { id: 'transformer', label: 'Transformer', icon: '🔄' },
  { id: 'contactor', label: 'Contactor', icon: '🔃' },
  { id: 'relay', label: 'Relay', icon: '📶' },
  { id: 'motor', label: 'Motor', icon: '⚙️' },
  { id: 'generator', label: 'Generator', icon: '🔋' },
  { id: 'fuse', label: 'Fuse', icon: '🛡️' }
];

const TOOLBAR = [
  { id: 'select', label: 'Select', icon: '🖱️' },
  { id: 'component', label: 'Component', icon: '🔧' },
  { id: 'wire', label: 'Wire', icon: '〰️' },
  { id: 'text', label: 'Text', icon: '📝' },
  { id: 'pan', label: 'Pan', icon: '✋' },
  { id: 'erase', label: 'Erase', icon: '🧹' }
];

export default function ElectricalCadDesigner({ onNavigate }) {
  const canvasRef = useRef(null);
  const engine = useElectricalCadEngine(canvasRef);

  const {
    tool, setTool, activeComponentType, setActiveComponentType,
    zoom, setZoom, snap, setSnap, snapEnabled, setSnapEnabled,
    gridVisible, setGridVisible, gridSize, setGridSize,
    selection, multiSelection, layers, activeLayer, setActiveLayer,
    undo, redo, clearAll, deleteSelection, updateElement,
    exportToPNG, exportToDXF, exportToJSON,
    onCanvasMouseDown, onCanvasMouseMove, onCanvasMouseUp, onWheel
  } = engine;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('software')}
            className="text-slate-600 hover:text-slate-900 text-sm flex items-center gap-1"
          >
            ← Kembali
          </button>
          <h1 className="font-semibold text-slate-800 text-sm md:text-base">ElectriCAD Designer</h1>
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500">
            <span>Tool: <span className="font-medium text-slate-700">{tool}</span></span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>Grid: {gridVisible ? 'On' : 'Off'}</span>
            <span>Snap: {snapEnabled ? 'On' : 'Off'}</span>
            <span>Layer: {layers.find(l => l.id === activeLayer)?.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={undo} className="px-3 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200 border">↶ Undo</button>
          <button onClick={redo} className="px-3 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200 border">↷ Redo</button>
          <div className="border-l border-slate-300 h-6 mx-1"></div>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="px-2 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200 border">🔍+</button>
          <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="px-2 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200 border">🔍-</button>
          <button onClick={() => setGridVisible(g => !g)} className={`px-2 py-1.5 text-xs rounded border ${gridVisible ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>⊞</button>
          <button onClick={() => setSnapEnabled(s => !s)} className={`px-2 py-1.5 text-xs rounded border ${snapEnabled ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>📐</button>
          <div className="border-l border-slate-300 h-6 mx-1"></div>
          <button onClick={clearAll} className="px-3 py-1.5 text-xs rounded bg-red-500 text-white hover:bg-red-600 border border-red-500">Clear</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-slate-200 bg-white/80 backdrop-blur flex flex-col">
          {/* Toolbar Section */}
          <div className="p-3 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Tools</p>
            <div className="grid grid-cols-3 gap-2">
              {TOOLBAR.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded border text-[10px] transition-all ${
                    tool === t.id ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : 'bg-white hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-base">{t.icon}</span>
                  <span className="font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Components Section */}
          <div className="p-3 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Components</p>
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {COMPONENT_PALETTE.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setActiveComponentType(c.id); setTool('component'); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded border text-[10px] transition-all ${
                    activeComponentType === c.id && tool === 'component' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' : 'bg-white hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                >
                  <span className="text-base">{c.icon}</span>
                  <span className="font-medium leading-tight">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Layers Section */}
          <div className="p-3 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Layers</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {layers.map(layer => (
                <div key={layer.id} className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveLayer(layer.id)}
                    className={`flex-1 px-2 py-1 text-xs rounded border text-left ${
                      activeLayer === layer.id ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:bg-green-50 border-slate-300'
                    }`}
                  >
                    {layer.name}
                  </button>
                  <button 
                    className={`w-6 h-6 rounded border text-xs ${layer.visible ? 'bg-blue-500 text-white' : 'bg-slate-200'}`}
                    title={layer.visible ? 'Hide layer' : 'Show layer'}
                  >
                    👁️
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Properties */}
          <div className="p-3 flex-1 overflow-auto text-xs space-y-3">
            <div>
              <p className="font-semibold text-slate-500 mb-2 uppercase tracking-wide">Properties</p>
              {selection ? (
                <div className="space-y-2 p-2 bg-slate-50 rounded border">
                  <div className="font-medium text-slate-700">Selected: {selection.type || selection.kind}</div>
                  <div className="text-slate-500">ID: {selection.id}</div>
                  
                  {selection.kind === 'component' && (
                    <div className="space-y-2">
                      <label className="block">
                        <span className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1">Rotation</span>
                        <select
                          className="w-full border rounded p-1 text-xs"
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
                        <span className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1">Label</span>
                        <input
                          type="text"
                          className="w-full border rounded p-1 text-xs"
                          value={selection.label || ''}
                          onChange={(e) => updateElement(selection.id, { label: e.target.value })}
                          placeholder="Component label"
                        />
                      </label>
                    </div>
                  )}
                  
                  {selection.kind === 'text' && (
                    <div className="space-y-2">
                      <label className="block">
                        <span className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1">Text</span>
                        <input
                          type="text"
                          className="w-full border rounded p-1 text-xs"
                          value={selection.text || ''}
                          onChange={(e) => updateElement(selection.id, { text: e.target.value })}
                        />
                      </label>
                      
                      <label className="block">
                        <span className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1">Font Size</span>
                        <select
                          className="w-full border rounded p-1 text-xs"
                          value={selection.fontSize || 12}
                          onChange={(e) => updateElement(selection.id, { fontSize: parseInt(e.target.value) })}
                        >
                          <option value={8}>8px</option>
                          <option value={10}>10px</option>
                          <option value={12}>12px</option>
                          <option value={14}>14px</option>
                          <option value={16}>16px</option>
                          <option value={18}>18px</option>
                        </select>
                      </label>
                    </div>
                  )}
                </div>
              ) : multiSelection.length > 0 ? (
                <div className="p-2 bg-blue-50 rounded border">
                  <div className="font-medium text-blue-700">Multi-selection</div>
                  <div className="text-blue-600">{multiSelection.length} elements selected</div>
                </div>
              ) : (
                <p className="text-slate-400 italic">No selection</p>
              )}
            </div>

            <div>
              <p className="font-semibold text-slate-500 mb-1 uppercase tracking-wide">Settings</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={gridVisible}
                    onChange={(e) => setGridVisible(e.target.checked)}
                  />
                  <span>Show Grid</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={snapEnabled}
                    onChange={(e) => setSnapEnabled(e.target.checked)}
                  />
                  <span>Smart Snap</span>
                </label>
                
                <label className="block">
                  <span className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1">Grid Size</span>
                  <select
                    className="w-full border rounded p-1 text-xs"
                    value={gridSize}
                    onChange={(e) => setGridSize(parseInt(e.target.value))}
                  >
                    <option value={10}>10px</option>
                    <option value={20}>20px</option>
                    <option value={25}>25px</option>
                    <option value={50}>50px</option>
                  </select>
                </label>
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-500 mb-1 uppercase tracking-wide">Shortcuts</p>
              <ul className="space-y-1 text-[10px] text-slate-600">
                <li>• 1-6: Select tools</li>
                <li>• Ctrl+Z/Y: Undo/Redo</li>
                <li>• Del: Delete selection</li>
                <li>• Alt+Drag: Pan canvas</li>
                <li>• Ctrl+Scroll: Zoom</li>
                <li>• Shift+Click: Multi-select</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-slate-100">
          <canvas
            ref={canvasRef}
            width={1600}
            height={1000}
            onMouseDown={onCanvasMouseDown}
            onMouseMove={onCanvasMouseMove}
            onMouseUp={onCanvasMouseUp}
            onWheel={onWheel}
            className="w-full h-full cursor-crosshair select-none"
          />

          {/* Status Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
            <div className="bg-white/90 backdrop-blur px-3 py-2 rounded shadow text-[10px] text-slate-600 space-x-4 flex items-center">
              <span>Elements: {engine.elements.length}</span>
              <span>Tool: <span className="font-medium">{tool}</span></span>
              <span>Zoom: {Math.round(zoom * 100)}%</span>
              <span>Grid: {gridVisible ? 'On' : 'Off'}</span>
              <span>Snap: {snapEnabled ? 'On' : 'Off'}</span>
              {multiSelection.length > 0 && (
                <span className="text-blue-600 font-medium">Multi: {multiSelection.length}</span>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur px-3 py-2 rounded shadow flex items-center gap-2">
              <button 
                onClick={() => exportToPNG()}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="Export as PNG"
              >
                📄 PNG
              </button>
              <button 
                onClick={() => exportToDXF()}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                title="Export as DXF"
              >
                📐 DXF
              </button>
              <button 
                onClick={() => exportToJSON()}
                className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                title="Save as JSON"
              >
                💾 JSON
              </button>
            </div>
          </div>

          {/* Tool tips */}
          {tool === 'wire' && (
            <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-2 rounded shadow text-xs">
              Click to start wire, click again to finish
            </div>
          )}
          
          {tool === 'component' && activeComponentType && (
            <div className="absolute top-3 left-3 bg-indigo-500 text-white px-3 py-2 rounded shadow text-xs">
              Click to place: {COMPONENT_PALETTE.find(c => c.id === activeComponentType)?.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
