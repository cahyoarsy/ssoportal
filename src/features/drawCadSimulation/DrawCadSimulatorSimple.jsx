import React, { useRef, useState } from 'react';

/**
 * Simplified DrawCadSimulator Component
 * Basic version without complex hooks to identify issues
 */
export function DrawCadSimulatorSimple({ onNavigate }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('select');
  const [components, setComponents] = useState([]);

  const addComponent = (type) => {
    const newComponent = {
      id: Date.now(),
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200
    };
    setComponents(prev => [...prev, newComponent]);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    const gridSize = 20;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw components
    components.forEach(comp => {
      ctx.fillStyle = '#3b82f6';
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.rect(comp.x - 15, comp.y - 10, 30, 20);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(comp.type.substring(0, 3).toUpperCase(), comp.x, comp.y + 3);
    });
  };

  React.useEffect(() => {
    drawCanvas();
  }, [components]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate?.('dashboard')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                DRAw CAD SIMULATION (Simplified)
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-120px)]">
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Toolbar</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => setTool('select')}
                className={`w-full px-3 py-2 text-left rounded ${
                  tool === 'select' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                🔲 Select
              </button>
              
              <button
                onClick={() => setTool('component')}
                className={`w-full px-3 py-2 text-left rounded ${
                  tool === 'component' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                ⚡ Components
              </button>
            </div>

            <hr className="my-4" />

            <h4 className="font-medium text-gray-800 mb-2">Add Components</h4>
            <div className="space-y-1">
              <button
                onClick={() => addComponent('resistor')}
                className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100"
              >
                🔴 Resistor
              </button>
              <button
                onClick={() => addComponent('capacitor')}
                className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100"
              >
                🔵 Capacitor
              </button>
              <button
                onClick={() => addComponent('inductor')}
                className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100"
              >
                🟡 Inductor
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Drawing Canvas</h3>
              <div className="text-sm text-gray-600">
                Components: {components.length}
              </div>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-auto cursor-crosshair"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}