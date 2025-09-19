import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useDrawCadEngine - Simplified CAD Engine
 * Basic CAD functionality without complex spread operators
 */
export function useDrawCadEngine(canvasRef) {
  // Core state
  const [elements, setElements] = useState([]);
  const [selection, setSelection] = useState(null);
  const [tool, setTool] = useState('select');
  const [activeComponentType, setActiveComponentType] = useState('resistor');
  
  // Canvas state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  
  // Settings
  const [gridVisible, setGridVisible] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  
  // Layers
  const [layers] = useState([
    { id: 'components', name: 'Components', visible: true, locked: false },
    { id: 'wiring', name: 'Wiring', visible: true, locked: false },
    { id: 'text', name: 'Text & Labels', visible: true, locked: false }
  ]);
  const [activeLayer, setActiveLayer] = useState('components');
  
  // History
  const historyRef = useRef({ stack: [[]], index: 0 });
  
  // Coordinate transformation
  const screenToWorld = useCallback((screenX, screenY) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (screenX - rect.left - pan.x) / zoom,
      y: (screenY - rect.top - pan.y) / zoom
    };
  }, [pan, zoom]);

  // Snap system
  const snapPoint = useCallback((x, y) => {
    if (!snapEnabled) return { x, y };
    const gridX = Math.round(x / gridSize) * gridSize;
    const gridY = Math.round(y / gridSize) * gridSize;
    return { x: gridX, y: gridY };
  }, [snapEnabled, gridSize]);

  // Component management
  const addComponent = useCallback((type, x, y) => {
    const pos = snapPoint(x, y);
    const newComponent = {
      id: Date.now() + Math.random(),
      kind: 'component',
      type,
      componentType: type,
      x: pos.x,
      y: pos.y,
      rotation: 0,
      layer: activeLayer,
      label: '',
      value: ''
    };
    
    setElements(prev => {
      const next = [...prev, newComponent];
      historyRef.current = { 
        stack: [...historyRef.current.stack.slice(0, historyRef.current.index + 1), next], 
        index: historyRef.current.index + 1 
      };
      return next;
    });
    
    setSelection(newComponent);
  }, [snapPoint, activeLayer]);

  // Selection
  const selectAtPoint = useCallback((x, y) => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (el.kind === 'component') {
        const dx = x - el.x;
        const dy = y - el.y;
        if (Math.abs(dx) <= 20 && Math.abs(dy) <= 10) {
          return el;
        }
      }
    }
    return null;
  }, [elements]);

  // Update element
  const updateElement = useCallback((id, updates) => {
    setElements(prev => prev.map(el => 
      el.id === id ? Object.assign({}, el, updates) : el
    ));
  }, []);

  // Delete selection
  const deleteSelection = useCallback(() => {
    if (selection) {
      setElements(prev => prev.filter(el => el.id !== selection.id));
      setSelection(null);
    }
  }, [selection]);

  // History functions
  const undo = useCallback(() => {
    const { stack, index } = historyRef.current;
    if (index > 0) {
      historyRef.current.index -= 1;
      setElements([...stack[historyRef.current.index]]);
      setSelection(null);
    }
  }, []);

  const redo = useCallback(() => {
    const { stack, index } = historyRef.current;
    if (index < stack.length - 1) {
      historyRef.current.index += 1;
      setElements([...stack[historyRef.current.index]]);
      setSelection(null);
    }
  }, []);

  const canUndo = historyRef.current.index > 0;
  const canRedo = historyRef.current.index < historyRef.current.stack.length - 1;

  // Drawing function
  const render = useCallback((signalFlow = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Grid
    if (gridVisible) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5 / zoom;
      const step = gridSize;
      
      const startX = Math.floor(-pan.x / zoom / step) * step;
      const endX = startX + canvas.width / zoom + step;
      const startY = Math.floor(-pan.y / zoom / step) * step;
      const endY = startY + canvas.height / zoom + step;
      
      for (let x = startX; x < endX; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }
      
      for (let y = startY; y < endY; y += step) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }
    }

    // Draw elements
    elements.forEach(el => {
      const isSelected = selection?.id === el.id;
      
      if (el.kind === 'component') {
        drawComponent(ctx, el, isSelected, signalFlow);
      }
    });

    ctx.restore();
  }, [elements, selection, zoom, pan, gridVisible, gridSize]);

  // Auto-render effect
  useEffect(() => {
    render();
  }, [render]);

  // Mouse event handlers
  const onCanvasMouseDown = useCallback((e) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    
    if (tool === 'pan' || e.button === 1) {
      setIsPanning(true);
      return;
    }

    if (tool === 'select') {
      const found = selectAtPoint(worldPos.x, worldPos.y);
      setSelection(found);
      return;
    }

    if (tool === 'component') {
      addComponent(activeComponentType, worldPos.x, worldPos.y);
      return;
    }
  }, [tool, screenToWorld, selectAtPoint, addComponent, activeComponentType]);

  const onCanvasMouseMove = useCallback((e) => {
    if (isPanning) {
      setPan(prev => ({ 
        x: prev.x + e.movementX, 
        y: prev.y + e.movementY 
      }));
    }
  }, [isPanning]);

  const onCanvasMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const onWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(z => Math.min(5, Math.max(0.1, z * factor)));
    }
  }, []);

  // Export functions (simplified)
  const exportToPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'draw-cad-simulation.png';
    link.href = canvas.toDataURL();
    link.click();
  }, []);

  const exportToJSON = useCallback(() => {
    const data = {
      elements,
      zoom,
      pan,
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'draw-cad-simulation.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [elements, zoom, pan]);

  return {
    // State
    tool, setTool,
    activeComponentType, setActiveComponentType,
    zoom, setZoom,
    pan, setPan,
    gridVisible, setGridVisible,
    snapEnabled, setSnapEnabled,
    gridSize, setGridSize,
    selection,
    elements,
    layers,
    activeLayer, setActiveLayer,
    
    // History
    undo, redo, canUndo, canRedo,
    
    // Actions
    addComponent,
    updateElement,
    deleteSelection,
    
    // Events
    onCanvasMouseDown,
    onCanvasMouseMove, 
    onCanvasMouseUp,
    onWheel,
    
    // Export
    exportToPNG,
    exportToJSON,
    
    // Rendering
    render
  };
}

// Simple component drawing function
function drawComponent(ctx, el, selected, signalFlow = null) {
  ctx.save();
  ctx.translate(el.x, el.y);
  ctx.rotate((el.rotation || 0) * Math.PI / 180);
  
  // Get simulation status
  const simStatus = signalFlow?.get?.(el.id);
  const isSimulating = signalFlow && signalFlow.size > 0;
  
  // Component colors
  if (isSimulating && simStatus?.active) {
    ctx.strokeStyle = selected ? '#10b981' : '#059669';
    ctx.fillStyle = selected ? '#10b981' : '#059669';
  } else if (isSimulating && !simStatus?.active) {
    ctx.strokeStyle = selected ? '#ef4444' : '#dc2626';
    ctx.fillStyle = selected ? '#ef4444' : '#dc2626';
  } else {
    ctx.strokeStyle = selected ? '#3b82f6' : '#0f172a';
    ctx.fillStyle = selected ? '#3b82f6' : '#0f172a';
  }
  
  ctx.lineWidth = selected ? 2.5 : 1.5;
  ctx.font = '10px Arial';

  // Draw component based on type
  switch (el.componentType || el.type) {
    case 'resistor':
      // Zigzag resistor
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-15, 0);
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(-10 + i * 4, (i % 2) * 10 - 5);
      }
      ctx.lineTo(15, 0);
      ctx.lineTo(20, 0);
      ctx.stroke();
      break;
      
    case 'capacitor':
      // Parallel plates
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(-5, 0);
      ctx.moveTo(-5, -10);
      ctx.lineTo(-5, 10);
      ctx.moveTo(5, -10);
      ctx.lineTo(5, 10);
      ctx.moveTo(5, 0);
      ctx.lineTo(15, 0);
      ctx.stroke();
      break;
      
    case 'inductor':
      // Coil
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-15, 0);
      for (let i = 0; i < 4; i++) {
        ctx.arc(-10 + i * 5, 0, 2.5, Math.PI, 0, false);
      }
      ctx.moveTo(5, 0);
      ctx.lineTo(20, 0);
      ctx.stroke();
      break;
      
    case 'voltageSource':
      // Circle with +/-
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillText('+', -3, -3);
      ctx.fillText('-', -3, 8);
      break;
      
    case 'switch':
      // Switch symbol
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(-5, 0);
      if (simStatus?.closed) {
        ctx.lineTo(5, 0);
      } else {
        ctx.lineTo(5, -5);
      }
      ctx.moveTo(5, 0);
      ctx.lineTo(15, 0);
      ctx.stroke();
      break;
      
    case 'andGate':
      // AND gate shape
      ctx.beginPath();
      ctx.moveTo(-15, -10);
      ctx.lineTo(-5, -10);
      ctx.lineTo(5, -10);
      ctx.arc(5, 0, 10, -Math.PI/2, Math.PI/2);
      ctx.lineTo(-5, 10);
      ctx.lineTo(-15, 10);
      ctx.closePath();
      ctx.stroke();
      ctx.fillText('&', -10, 3);
      break;
      
    case 'orGate':
      // OR gate shape
      ctx.beginPath();
      ctx.moveTo(-15, -10);
      ctx.quadraticCurveTo(-5, -10, 0, -5);
      ctx.quadraticCurveTo(10, 0, 15, 0);
      ctx.quadraticCurveTo(10, 0, 0, 5);
      ctx.quadraticCurveTo(-5, 10, -15, 10);
      ctx.quadraticCurveTo(-10, 0, -15, -10);
      ctx.stroke();
      ctx.fillText('≥1', -10, 3);
      break;
      
    case 'notGate':
      // NOT gate (triangle with circle)
      ctx.beginPath();
      ctx.moveTo(-15, -8);
      ctx.lineTo(-15, 8);
      ctx.lineTo(5, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(8, 0, 3, 0, 2 * Math.PI);
      ctx.stroke();
      break;
      
    default:
      // Default rectangle
      ctx.strokeRect(-15, -10, 30, 20);
      ctx.fillText(el.type || 'COMP', -10, 3);
  }

  // Component label
  if (el.label) {
    ctx.fillText(el.label, -15, -15);
  }
  
  // Component value
  if (el.value) {
    ctx.fillText(el.value, -15, 25);
  }

  // Selection highlight
  if (selected) {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(-25, -20, 50, 40);
    ctx.setLineDash([]);
  }
  
  ctx.restore();
}