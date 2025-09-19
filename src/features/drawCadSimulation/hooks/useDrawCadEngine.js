import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useDrawCadEngine
 * Advanced CAD Engine Hook for DRAw CAD SIMULATION
 * Features: Professional CAD tools, extensive component library, DWG import/export
 */
export function useDrawCadEngine(canvasRef) {
  // Core state
  const [elements, setElements] = useState([]);
  const [selection, setSelection] = useState(null);
  const [multiSelection, setMultiSelection] = useState([]);
  const [tool, setTool] = useState('select');
  const [activeComponentType, setActiveComponentType] = useState('resistor');
  
  // Canvas state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragState, setDragState] = useState(null);
  
  // Drawing state
  const [wireDraft, setWireDraft] = useState(null);
  const [textDraft, setTextDraft] = useState(null);
  
  // Settings
  const [snap, setSnap] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  
  // Layers
  const [layers, setLayers] = useState([
    { id: 'background', name: 'Background', visible: true, locked: false, color: '#f8fafc' },
    { id: 'components', name: 'Components', visible: true, locked: false, color: '#0f172a' },
    { id: 'wiring', name: 'Wiring', visible: true, locked: false, color: '#1e40af' },
    { id: 'text', name: 'Text & Labels', visible: true, locked: false, color: '#059669' },
    { id: 'dimensions', name: 'Dimensions', visible: true, locked: false, color: '#dc2626' }
  ]);
  const [activeLayer, setActiveLayer] = useState('components');
  
  // History management
  const historyRef = useRef({ stack: [], index: -1 });
  const mouseRef = useRef({ x: 0, y: 0 });
  
  // Constants
  const GRID_SIZE = gridSize;
  const SNAP_THRESHOLD = 15;
  const MAX_ZOOM = 10;
  const MIN_ZOOM = 0.05;

  // Initialize history
  useEffect(() => {
    if (historyRef.current.stack.length === 0) {
      historyRef.current = { stack: [[]], index: 0 };
    }
  }, []);

  // History functions
  const pushHistory = useCallback((nextElements) => {
    const { stack, index } = historyRef.current;
    const newStack = stack.slice(0, index + 1);
    newStack.push(JSON.parse(JSON.stringify(nextElements)));
    historyRef.current = { 
      stack: newStack.slice(-50), 
      index: Math.min(newStack.length - 1, 49) 
    };
  }, []);

  const undo = useCallback(() => {
    const { stack, index } = historyRef.current;
    if (index > 0) {
      historyRef.current.index -= 1;
      const newElements = JSON.parse(JSON.stringify(stack[historyRef.current.index]));
      setElements(newElements);
      setSelection(null);
      setMultiSelection([]);
    }
  }, []);

  const redo = useCallback(() => {
    const { stack, index } = historyRef.current;
    if (index < stack.length - 1) {
      historyRef.current.index += 1;
      const newElements = JSON.parse(JSON.stringify(stack[historyRef.current.index]));
      setElements(newElements);
      setSelection(null);
      setMultiSelection([]);
    }
  }, []);

  const canUndo = historyRef.current.index > 0;
  const canRedo = historyRef.current.index < historyRef.current.stack.length - 1;

  // Coordinate transformation
  const screenToWorld = useCallback((screenX, screenY) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (screenX - rect.left - pan.x) / zoom,
      y: (screenY - rect.top - pan.y) / zoom
    };
  }, [pan, zoom]);

  const worldToScreen = useCallback((worldX, worldY) => {
    return {
      x: worldX * zoom + pan.x,
      y: worldY * zoom + pan.y
    };
  }, [pan, zoom]);

  // Snap system
  const snapPoint = useCallback((x, y) => {
    if (!snap && !snapEnabled) return { x, y };

    const snapTo = [];
    
    // Grid snap
    if (gridVisible) {
      const gridX = Math.round(x / GRID_SIZE) * GRID_SIZE;
      const gridY = Math.round(y / GRID_SIZE) * GRID_SIZE;
      snapTo.push({ x: gridX, y: gridY, type: 'grid' });
    }

    // Element snap points
    if (snapEnabled) {
      elements.forEach(el => {
        if (el.kind === 'component') {
          snapTo.push({ x: el.x, y: el.y, type: 'center' });
          const bounds = getComponentBounds(el);
          snapTo.push(
            { x: el.x - bounds.width/2, y: el.y, type: 'edge' },
            { x: el.x + bounds.width/2, y: el.y, type: 'edge' },
            { x: el.x, y: el.y - bounds.height/2, type: 'edge' },
            { x: el.x, y: el.y + bounds.height/2, type: 'edge' }
          );
        } else if (el.kind === 'wire') {
          snapTo.push(
            { x: el.start.x, y: el.start.y, type: 'endpoint' },
            { x: el.end.x, y: el.end.y, type: 'endpoint' }
          );
        }
      });
    }

    if (snapTo.length === 0) return { x, y };

    // Find closest snap point
    let closest = { x, y };
    let minDist = SNAP_THRESHOLD;

    snapTo.forEach(snapPoint => {
      const dist = Math.sqrt((x - snapPoint.x) ** 2 + (y - snapPoint.y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        closest = { x: snapPoint.x, y: snapPoint.y };
      }
    });

    return closest;
  }, [snap, snapEnabled, gridVisible, elements, GRID_SIZE, SNAP_THRESHOLD]);

  // Component management
  const addComponent = useCallback((type, x, y, properties = {}) => {
    const pos = snapPoint(x, y);
    const newComponent = {
      id: Date.now() + Math.random(),
      kind: 'component',
      type,
      componentType: type, // Add componentType for simulation
      x: pos.x,
      y: pos.y,
      rotation: 0,
      layer: activeLayer,
      label: '',
      value: '',
      ...properties
    };
    
    setElements(prev => {
      const next = [...prev, newComponent];
      pushHistory(next);
      return next;
    });
    
    setSelection(newComponent);
  }, [snapPoint, pushHistory, activeLayer]);

  // Wire management
  const startWire = useCallback((x, y) => {
    const pos = snapPoint(x, y);
    setWireDraft({ start: pos, current: pos });
  }, [snapPoint]);

  const updateWireDraft = useCallback((x, y) => {
    if (wireDraft) {
      const pos = snapPoint(x, y);
      setWireDraft(prev => ({ ...prev, current: pos }));
    }
  }, [wireDraft, snapPoint]);

  const commitWire = useCallback((x, y) => {
    if (!wireDraft) return;
    
    const pos = snapPoint(x, y);
    const newWire = {
      id: Date.now() + Math.random(),
      kind: 'wire',
      start: wireDraft.start,
      end: pos,
      layer: activeLayer,
      style: 'solid',
      width: 2
    };
    
    setElements(prev => {
      const next = [...prev, newWire];
      pushHistory(next);
      return next;
    });
    
    setWireDraft(null);
    setSelection(newWire);
  }, [wireDraft, snapPoint, pushHistory, activeLayer]);

  // Text management
  const addText = useCallback((x, y, text = 'Text') => {
    const pos = snapPoint(x, y);
    const newText = {
      id: Date.now() + Math.random(),
      kind: 'text',
      x: pos.x,
      y: pos.y,
      text,
      fontSize: 12,
      fontFamily: 'Arial',
      color: '#0f172a',
      layer: activeLayer
    };
    
    setElements(prev => {
      const next = [...prev, newText];
      pushHistory(next);
      return next;
    });
    
    setSelection(newText);
  }, [snapPoint, pushHistory, activeLayer]);

  // Selection system
  const selectAtPoint = useCallback((x, y) => {
    const found = [...elements].reverse().find(el => {
      const layer = layers.find(l => l.id === el.layer);
      if (layer && !layer.visible) return false;

      if (el.kind === 'component') {
        const bounds = getComponentBounds(el);
        return x >= bounds.x - bounds.width/2 && x <= bounds.x + bounds.width/2 && 
               y >= bounds.y - bounds.height/2 && y <= bounds.y + bounds.height/2;
      } else if (el.kind === 'wire') {
        return distanceToLine(x, y, el.start, el.end) < 8;
      } else if (el.kind === 'text') {
        return x >= el.x - 30 && x <= el.x + 30 && y >= el.y - 10 && y <= el.y + 10;
      }
      return false;
    });
    return found;
  }, [elements, layers]);

  const selectElement = useCallback((element, multiSelect = false) => {
    if (multiSelect) {
      setMultiSelection(prev => {
        const exists = prev.find(el => el.id === element?.id);
        if (exists) {
          return prev.filter(el => el.id !== element.id);
        } else if (element) {
          return [...prev, element];
        }
        return prev;
      });
    } else {
      setSelection(element);
      setMultiSelection([]);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelection(null);
    setMultiSelection([]);
  }, []);

  const deleteSelection = useCallback(() => {
    const toDelete = multiSelection.length > 0 ? multiSelection : (selection ? [selection] : []);
    if (toDelete.length === 0) return;

    setElements(prev => {
      const deleteIds = new Set(toDelete.map(el => el.id));
      const next = prev.filter(el => !deleteIds.has(el.id));
      pushHistory(next);
      return next;
    });
    clearSelection();
  }, [selection, multiSelection, pushHistory, clearSelection]);

  // Update element properties
  const updateElement = useCallback((elementId, updates) => {
    setElements(prev => {
      const next = prev.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      );
      pushHistory(next);
      return next;
    });
    
    if (selection?.id === elementId) {
      setSelection(sel => ({ ...sel, ...updates }));
    }
  }, [selection, pushHistory]);

  // Helper functions
  const getComponentBounds = useCallback((component) => {
    const typeInfo = {
      // Basic electrical
      resistor: { width: 40, height: 12 },
      capacitor: { width: 20, height: 30 },
      inductor: { width: 40, height: 20 },
      battery: { width: 30, height: 20 },
      ground: { width: 20, height: 15 },
      
      // Switches
      'spst-switch': { width: 30, height: 20 },
      'spdt-switch': { width: 40, height: 25 },
      'pushbutton-no': { width: 20, height: 20 },
      'pushbutton-nc': { width: 20, height: 20 },
      
      // Diodes
      diode: { width: 25, height: 15 },
      'zener-diode': { width: 25, height: 15 },
      led: { width: 25, height: 25 },
      photodiode: { width: 25, height: 25 },
      
      // Transistors
      'npn-transistor': { width: 30, height: 30 },
      'pnp-transistor': { width: 30, height: 30 },
      nmos: { width: 30, height: 25 },
      pmos: { width: 30, height: 25 },
      
      // Default
      default: { width: 30, height: 20 }
    };
    
    const info = typeInfo[component.type] || typeInfo.default;
    return {
      x: component.x,
      y: component.y,
      width: info.width,
      height: info.height
    };
  }, []);

  const distanceToLine = useCallback((px, py, start, end) => {
    const A = px - start.x;
    const B = py - start.y;
    const C = end.x - start.x;
    const D = end.y - start.y;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    const param = dot / lenSq;
    let xx, yy;
    if (param < 0) { xx = start.x; yy = start.y; }
    else if (param > 1) { xx = end.x; yy = end.y; }
    else { xx = start.x + param * C; yy = start.y + param * D; }
    const dx = px - xx; const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Export functions
  const exportToPNG = useCallback((filename = 'draw-cad-simulation.png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;

    exportCtx.fillStyle = '#ffffff';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.drawImage(canvas, 0, 0);

    exportCanvas.toBlob(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }, [canvasRef]);

  const exportToDXF = useCallback((filename = 'draw-cad-simulation.dxf') => {
    let dxfContent = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1024
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
5
2
330
0
100
AcDbSymbolTable
70
5
`;

    // Add layers to DXF
    layers.forEach((layer, idx) => {
      dxfContent += `0
LAYER
5
${(10 + idx).toString(16)}
330
2
100
AcDbSymbolTableRecord
100
AcDbLayerTableRecord
2
${layer.name.toUpperCase()}
70
0
6
CONTINUOUS
62
${idx + 1}
`;
    });

    dxfContent += `0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
`;

    // Add elements to DXF
    elements.forEach((el, idx) => {
      if (el.kind === 'component') {
        dxfContent += `0
INSERT
5
${(100 + idx).toString(16)}
330
1F
100
AcDbEntity
8
${layers.find(l => l.id === el.layer)?.name.toUpperCase() || 'COMPONENTS'}
100
AcDbBlockReference
66
1
2
${el.type.toUpperCase()}
10
${el.x}
20
${el.y}
30
0
50
${el.rotation || 0}
`;
      } else if (el.kind === 'wire') {
        dxfContent += `0
LINE
5
${(200 + idx).toString(16)}
330
1F
100
AcDbEntity
8
${layers.find(l => l.id === el.layer)?.name.toUpperCase() || 'WIRING'}
100
AcDbLine
10
${el.start.x}
20
${el.start.y}
30
0
11
${el.end.x}
21
${el.end.y}
31
0
`;
      } else if (el.kind === 'text') {
        dxfContent += `0
TEXT
5
${(300 + idx).toString(16)}
330
1F
100
AcDbEntity
8
${layers.find(l => l.id === el.layer)?.name.toUpperCase() || 'TEXT'}
100
AcDbText
10
${el.x}
20
${el.y}
30
0
40
${el.fontSize || 12}
1
${el.text}
`;
      }
    });

    dxfContent += `0
ENDSEC
0
EOF
`;

    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [elements, layers]);

  const exportToSVG = useCallback((filename = 'draw-cad-simulation.svg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="white"/>
`;

    elements.forEach(el => {
      if (el.kind === 'wire') {
        svgContent += `<line x1="${el.start.x}" y1="${el.start.y}" x2="${el.end.x}" y2="${el.end.y}" stroke="black" stroke-width="2"/>`;
      } else if (el.kind === 'component') {
        const bounds = getComponentBounds(el);
        svgContent += `<rect x="${el.x - bounds.width/2}" y="${el.y - bounds.height/2}" width="${bounds.width}" height="${bounds.height}" stroke="black" fill="none"/>`;
        if (el.label) {
          svgContent += `<text x="${el.x}" y="${el.y + bounds.height/2 + 15}" text-anchor="middle" font-size="10">${el.label}</text>`;
        }
      } else if (el.kind === 'text') {
        svgContent += `<text x="${el.x}" y="${el.y}" font-size="${el.fontSize || 12}" fill="${el.color || 'black'}">${el.text}</text>`;
      }
    });

    svgContent += '</svg>';

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [elements, getComponentBounds]);

  const exportToJSON = useCallback((filename = 'draw-cad-simulation.json') => {
    const exportData = {
      version: '2.0',
      application: 'DRAw CAD SIMULATION',
      timestamp: new Date().toISOString(),
      elements,
      layers,
      settings: {
        gridSize,
        zoom,
        pan,
        gridVisible,
        snapEnabled
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [elements, layers, gridSize, zoom, pan, gridVisible, snapEnabled]);

  // Import functions
  const importFromDWG = useCallback((file) => {
    // Placeholder for DWG import functionality
    // In a real implementation, this would parse DWG file format
    console.log('DWG import functionality would be implemented here');
    // For now, return a promise that resolves
    return Promise.resolve();
  }, []);

  const clearAll = useCallback(() => {
    setElements([]);
    pushHistory([]);
    clearSelection();
  }, [pushHistory, clearSelection]);

  // Drawing loop
  const render = useCallback((signalFlow = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
      const step = GRID_SIZE;
      
      for (let x = -pan.x / zoom; x < canvas.width / zoom; x += step) {
        if (x >= 0) {
          ctx.beginPath();
          ctx.moveTo(x, -pan.y / zoom);
          ctx.lineTo(x, canvas.height / zoom);
          ctx.stroke();
        }
      }
      
      for (let y = -pan.y / zoom; y < canvas.height / zoom; y += step) {
        if (y >= 0) {
          ctx.beginPath();
          ctx.moveTo(-pan.x / zoom, y);
          ctx.lineTo(canvas.width / zoom, y);
          ctx.stroke();
        }
      }
    }

    // Draw elements by layer
    layers.forEach(layer => {
      if (!layer.visible) return;
      
      elements.filter(el => el.layer === layer.id).forEach(el => {
        const isSelected = selection?.id === el.id || multiSelection.find(s => s.id === el.id);
        
        if (el.kind === 'component') {
          drawComponent(ctx, el, isSelected, signalFlow);
        } else if (el.kind === 'wire') {
          drawWire(ctx, el, isSelected, signalFlow);
        } else if (el.kind === 'text') {
          drawText(ctx, el, isSelected);
        }
      });
    });

    // Wire draft
    if (wireDraft) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / zoom;
      ctx.setLineDash([5 / zoom, 5 / zoom]);
      ctx.beginPath();
      ctx.moveTo(wireDraft.start.x, wireDraft.start.y);
      const pos = snapPoint(mouseRef.current.x, mouseRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Drag state visual feedback
    if (dragState) {
      const currentPos = dragState.currentPos || { x: dragState.element.x, y: dragState.element.y };
      
      // Collision feedback
      if (dragState.colliding) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3 / zoom;
        ctx.setLineDash([8 / zoom, 4 / zoom]);
        const bounds = getElementBounds(Object.assign({}, dragState.element, currentPos));
        ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
        ctx.setLineDash([]);
      }
      
      // Connection hints
      dragState.connections.forEach(conn => {
        if (conn.distance < 15) {
          ctx.fillStyle = conn.distance < 10 ? '#10b981' : '#6366f1';
          ctx.beginPath();
          ctx.arc(conn.x, conn.y, 5 / zoom, 0, 2 * Math.PI);
          ctx.fill();
          
          // Connection line
          if (conn.distance < 10) {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2 / zoom;
            ctx.setLineDash([4 / zoom, 2 / zoom]);
            ctx.beginPath();
            ctx.moveTo(currentPos.x, currentPos.y);
            ctx.lineTo(conn.x, conn.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      });
    }

    ctx.restore();
  }, [elements, selection, multiSelection, zoom, pan, wireDraft, gridVisible, layers, snapPoint, GRID_SIZE, dragState, getElementBounds]);

  // Auto-render effect
  useEffect(() => {
    render();
  }, [render]);

  // Enhanced collision detection
  const checkCollision = useCallback((element, newPosition) => {
    const bounds1 = getElementBounds(Object.assign({}, element, { x: newPosition.x, y: newPosition.y }));
    
    for (const other of elements) {
      if (other.id === element.id) continue;
      if (other.kind !== 'component') continue;
      
      const bounds2 = getElementBounds(other);
      
      // AABB collision detection
      if (bounds1.left < bounds2.right && 
          bounds1.right > bounds2.left && 
          bounds1.top < bounds2.bottom && 
          bounds1.bottom > bounds2.top) {
        return other;
      }
    }
    return null;
  }, [elements]);

  // Auto-connection detection
  const findNearbyConnectionPoints = useCallback((x, y, threshold = 15) => {
    const connectionPoints = [];
    
    elements.forEach(el => {
      if (el.kind === 'component') {
        // Component pins
        const pins = getComponentPins(el);
        pins.forEach(pin => {
          const distance = Math.sqrt(Math.pow(pin.x - x, 2) + Math.pow(pin.y - y, 2));
          if (distance <= threshold) {
            connectionPoints.push({ 
              ...pin, 
              element: el, 
              distance,
              type: 'pin' 
            });
          }
        });
      } else if (el.kind === 'wire') {
        // Wire endpoints
        const endpoints = [
          { x: el.start.x, y: el.start.y, element: el, type: 'wire_start' },
          { x: el.end.x, y: el.end.y, element: el, type: 'wire_end' }
        ];
        
        endpoints.forEach(point => {
          const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
          if (distance <= threshold) {
            connectionPoints.push({ ...point, distance });
          }
        });
      }
    });
    
    return connectionPoints.sort((a, b) => a.distance - b.distance);
  }, [elements]);

  // Get component pins for connection
  const getComponentPins = useCallback((component) => {
    const pins = [];
    const baseX = component.x;
    const baseY = component.y;
    
    // Basic electrical components pins
    switch (component.componentType) {
      case 'resistor':
      case 'capacitor':
      case 'inductor':
      case 'diode':
        pins.push(
          { x: baseX - 20, y: baseY, id: 'pin1' },
          { x: baseX + 20, y: baseY, id: 'pin2' }
        );
        break;
      case 'transistorNPN':
      case 'transistorPNP':
        pins.push(
          { x: baseX, y: baseY - 20, id: 'collector' },
          { x: baseX - 20, y: baseY, id: 'base' },
          { x: baseX, y: baseY + 20, id: 'emitter' }
        );
        break;
      case 'andGate':
      case 'orGate':
        pins.push(
          { x: baseX - 30, y: baseY - 10, id: 'input1' },
          { x: baseX - 30, y: baseY + 10, id: 'input2' },
          { x: baseX + 30, y: baseY, id: 'output' }
        );
        break;
      case 'notGate':
        pins.push(
          { x: baseX - 30, y: baseY, id: 'input' },
          { x: baseX + 30, y: baseY, id: 'output' }
        );
        break;
      default:
        pins.push(
          { x: baseX - 15, y: baseY, id: 'pin1' },
          { x: baseX + 15, y: baseY, id: 'pin2' }
        );
    }
    
    return pins;
  }, []);

  // Enhanced drag and drop with snap and collision
  const startDragElement = useCallback((element, mousePos) => {
    setDragState({
      element,
      startPos: { x: element.x, y: element.y },
      offset: { 
        x: mousePos.x - element.x, 
        y: mousePos.y - element.y 
      },
      colliding: null,
      connections: []
    });
  }, []);

  const updateDragElement = useCallback((mousePos) => {
    if (!dragState) return;
    
    const newX = mousePos.x - dragState.offset.x;
    const newY = mousePos.y - dragState.offset.y;
    const snappedPos = snapPoint(newX, newY);
    
    // Check for collisions
    const collision = checkCollision(dragState.element, snappedPos);
    
    // Find nearby connection points
    const connections = findNearbyConnectionPoints(snappedPos.x, snappedPos.y);
    
    setDragState(prev => ({
      ...prev,
      currentPos: snappedPos,
      colliding: collision,
      connections
    }));
    
    // Update element position in real-time
    setElements(prev => prev.map(el => 
      el.id === dragState.element.id 
        ? { ...el, x: snappedPos.x, y: snappedPos.y }
        : el
    ));
  }, [dragState, snapPoint, checkCollision, findNearbyConnectionPoints]);

  const completeDragElement = useCallback(() => {
    if (!dragState) return;
    
    const finalPos = dragState.currentPos || dragState.startPos;
    
    // Auto-connect if near connection points
    if (dragState.connections.length > 0 && !dragState.colliding) {
      const nearestConnection = dragState.connections[0];
      if (nearestConnection.distance < 10) {
        // Create auto-wire to connection point
        const newWire = {
          id: Date.now() + Math.random(),
          kind: 'wire',
          start: { x: finalPos.x, y: finalPos.y },
          end: { x: nearestConnection.x, y: nearestConnection.y },
          layer: activeLayer,
          style: 'solid',
          width: 2,
          autoCreated: true
        };
        
        setElements(prev => {
          const updated = prev.map(el => 
            el.id === dragState.element.id 
              ? { ...el, x: finalPos.x, y: finalPos.y }
              : el
          );
          const withWire = [...updated, newWire];
          pushHistory(withWire);
          return withWire;
        });
      }
    } else if (dragState.colliding) {
      // Revert to start position if colliding
      setElements(prev => prev.map(el => 
        el.id === dragState.element.id 
          ? { ...el, x: dragState.startPos.x, y: dragState.startPos.y }
          : el
      ));
    } else {
      // Complete normal move
      pushHistory(elements);
    }
    
    setDragState(null);
  }, [dragState, activeLayer, elements, pushHistory]);

  const getElementBounds = useCallback((element) => {
    let width = 30, height = 20;
    
    if (element.kind === 'component') {
      switch (element.componentType) {
        case 'andGate':
        case 'orGate':
        case 'notGate':
          width = 60;
          height = 30;
          break;
        case 'transistorNPN':
        case 'transistorPNP':
          width = 40;
          height = 40;
          break;
        default:
          width = 40;
          height = 20;
      }
    }
    
    return {
      left: element.x - width/2,
      right: element.x + width/2,
      top: element.y - height/2,
      bottom: element.y + height/2,
      width,
      height
    };
  }, []);

  // Canvas event handlers
  const onCanvasMouseDown = useCallback((e) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    
    if (tool === 'pan' || e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      return;
    }

    if (tool === 'select') {
      const found = selectAtPoint(worldPos.x, worldPos.y);
      if (found && found.kind === 'component') {
        // Start enhanced drag
        startDragElement(found, worldPos);
      }
      selectElement(found, e.shiftKey);
      return;
    }

    if (tool === 'component') {
      addComponent(activeComponentType, worldPos.x, worldPos.y);
      return;
    }

    if (tool === 'wire') {
      if (!wireDraft) {
        startWire(worldPos.x, worldPos.y);
      } else {
        commitWire(worldPos.x, worldPos.y);
      }
      return;
    }

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        addText(worldPos.x, worldPos.y, text);
      }
      return;
    }

    if (tool === 'erase') {
      const found = selectAtPoint(worldPos.x, worldPos.y);
      if (found) {
        setElements(prev => {
          const next = prev.filter(el => el.id !== found.id);
          pushHistory(next);
          return next;
        });
      }
      return;
    }
  }, [tool, screenToWorld, selectAtPoint, selectElement, addComponent, activeComponentType, startWire, commitWire, wireDraft, addText, pushHistory]);

  const onCanvasMouseMove = useCallback((e) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    mouseRef.current = worldPos;

    if (isPanning) {
      setPan(prev => ({ 
        x: prev.x + e.movementX, 
        y: prev.y + e.movementY 
      }));
      return;
    }

    if (dragState) {
      updateDragElement(worldPos);
      return;
    }

    if (wireDraft) {
      updateWireDraft(worldPos.x, worldPos.y);
      return;
    }
  }, [screenToWorld, isPanning, dragState, updateDragElement, wireDraft, updateWireDraft]);

  const onCanvasMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    
    if (dragState) {
      completeDragElement();
      return;
    }
  }, [isPanning, dragState, completeDragElement]);

  const onWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor)));
    }
  }, [MAX_ZOOM, MIN_ZOOM]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'Delete') deleteSelection();
      if (e.ctrlKey && e.key.toLowerCase() === 'z') undo();
      if (e.ctrlKey && e.key.toLowerCase() === 'y') redo();
      if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setMultiSelection([...elements]);
      }
      
      // Tool shortcuts
      if (e.key === '1') setTool('select');
      if (e.key === '2') setTool('pan');
      if (e.key === '3') setTool('zoom');
      if (e.key === '4') setTool('wire');
      if (e.key === '5') setTool('text');
      if (e.key === '6') setTool('measure');
      if (e.key === '7') setTool('erase');
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [deleteSelection, undo, redo, elements]);

  return {
    // State
    elements,
    selection,
    multiSelection,
    tool,
    zoom,
    pan,
    wireDraft,
    snap,
    snapEnabled,
    gridVisible,
    gridSize,
    activeLayer,
    layers,
    activeComponentType,
    dragState,
    
    // Setters
    setActiveComponentType,
    setTool,
    setZoom,
    setPan,
    setSnap,
    setSnapEnabled,
    setGridVisible,
    setGridSize,
    setActiveLayer,
    
    // Actions
    undo,
    redo,
    canUndo,
    canRedo,
    clearAll,
    deleteSelection,
    selectElement,
    clearSelection,
    updateElement,
    addComponent,
    startWire,
    commitWire,
    addText,
    
    // Canvas handlers
    onCanvasMouseDown,
    onCanvasMouseMove,
    onCanvasMouseUp,
    onWheel,
    screenToWorld,
    worldToScreen,
    
    // Export/Import
    exportToPNG,
    exportToDXF,
    exportToSVG,
    exportToJSON,
    importFromDWG,
    
    // Rendering
    render
  };
}

// Component drawing functions with simulation visualization
function drawComponent(ctx, el, selected, signalFlow = null) {
  ctx.save();
  ctx.translate(el.x, el.y);
  ctx.rotate((el.rotation || 0) * Math.PI / 180);
  
  // Get simulation status
  const simStatus = signalFlow?.get(el.id);
  const isActive = simStatus?.active || false;
  const isSimulating = signalFlow && signalFlow.size > 0;
  
  // Component outline color based on simulation state
  if (isSimulating && isActive) {
    ctx.strokeStyle = selected ? '#10b981' : '#059669';
    ctx.fillStyle = selected ? '#10b981' : '#059669';
  } else if (isSimulating && !isActive) {
    ctx.strokeStyle = selected ? '#ef4444' : '#dc2626';
    ctx.fillStyle = selected ? '#ef4444' : '#dc2626';
  } else {
    ctx.strokeStyle = selected ? '#3b82f6' : '#0f172a';
    ctx.fillStyle = selected ? '#3b82f6' : '#0f172a';
  }
  
  ctx.lineWidth = selected ? 2.5 : 1.5;
  ctx.font = '10px Arial';

  switch (el.componentType || el.type) {
    case 'resistor':
      // Zigzag resistor symbol
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-15, 0);
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(-10 + i * 4, (i % 2) * 10 - 5);
      }
      ctx.lineTo(15, 0);
      ctx.lineTo(20, 0);
      ctx.stroke();
      
      // Power dissipation visualization
      if (simStatus?.power > 0.1) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '8px Arial';
        ctx.fillText(`${simStatus.power.toFixed(1)}W`, -15, -15);
      }
      break;
      
    case 'capacitor':
      // Two parallel lines
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
      
      // Voltage visualization
      if (simStatus?.voltage !== undefined) {
        ctx.fillStyle = '#8b5cf6';
        ctx.font = '8px Arial';
        ctx.fillText(`${simStatus.voltage.toFixed(1)}V`, -15, -15);
      }
      break;
      
    case 'inductor':
      // Coil symbol
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-15, 0);
      for (let i = 0; i < 4; i++) {
        ctx.arc(-10 + i * 5, 0, 2.5, Math.PI, 0, false);
      }
      ctx.moveTo(5, 0);
      ctx.lineTo(20, 0);
      ctx.stroke();
      
      // Current visualization
      if (simStatus?.current !== undefined) {
        ctx.fillStyle = '#06b6d4';
        ctx.font = '8px Arial';
        ctx.fillText(`${(simStatus.current * 1000).toFixed(1)}mA`, -15, -15);
      }
      break;
      ctx.stroke();
      break;
      
    case 'battery':
      // Battery symbol
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(-10, 0);
      ctx.moveTo(-10, -8);
      ctx.lineTo(-10, 8);
      ctx.moveTo(-5, -12);
      ctx.lineTo(-5, 12);
      ctx.moveTo(5, -8);
      ctx.lineTo(5, 8);
      ctx.moveTo(10, -12);
      ctx.lineTo(10, 12);
      ctx.moveTo(10, 0);
      ctx.lineTo(15, 0);
      ctx.stroke();
      break;
      
    case 'ground':
      // Ground symbol
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(0, 0);
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.moveTo(-6, 4);
      ctx.lineTo(6, 4);
      ctx.moveTo(-3, 8);
      ctx.lineTo(3, 8);
      ctx.stroke();
      break;
      
    case 'diode':
      // Diode symbol
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(-5, 0);
      ctx.moveTo(-5, -8);
      ctx.lineTo(-5, 8);
      ctx.lineTo(5, 0);
      ctx.closePath();
      ctx.moveTo(5, -8);
      ctx.lineTo(5, 8);
      ctx.moveTo(5, 0);
      ctx.lineTo(15, 0);
      ctx.stroke();
      break;
      
    case 'led':
      // LED symbol
      drawComponent.call(this, ctx, {...el, type: 'diode'}, selected);
      // Add light arrows
      ctx.beginPath();
      ctx.moveTo(8, -12);
      ctx.lineTo(12, -8);
      ctx.moveTo(10, -12);
      ctx.lineTo(12, -10);
      ctx.moveTo(12, -16);
      ctx.lineTo(16, -12);
      ctx.moveTo(14, -16);
      ctx.lineTo(16, -14);
      ctx.stroke();
      break;
      
    case 'npn-transistor':
      // NPN transistor
      ctx.beginPath();
      ctx.moveTo(-10, -15);
      ctx.lineTo(-10, 15);
      ctx.moveTo(-10, -8);
      ctx.lineTo(8, -15);
      ctx.moveTo(-10, 8);
      ctx.lineTo(8, 15);
      // Arrow on emitter
      ctx.moveTo(5, 12);
      ctx.lineTo(8, 15);
      ctx.lineTo(5, 18);
      ctx.stroke();
      break;
      
    case 'op-amp':
      // Op-amp triangle
      ctx.beginPath();
      ctx.moveTo(-15, -10);
      ctx.lineTo(-15, 10);
      ctx.lineTo(15, 0);
      ctx.closePath();
      ctx.stroke();
      // Input marks
      ctx.fillText('+', -10, -3);
      ctx.fillText('-', -10, 6);
      break;
      
    default:
      // Default rectangle
      ctx.strokeRect(-15, -10, 30, 20);
      ctx.fillText(el.type, -10, 3);
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

function drawWire(ctx, el, selected, signalFlow = null) {
  // Get wire signal status
  const wireSignal = signalFlow?.get(el.id);
  const hasSignal = wireSignal?.current && Math.abs(wireSignal.current) > 0.001;
  const isSimulating = signalFlow && signalFlow.size > 0;
  
  // Wire color based on signal state
  if (isSimulating && hasSignal) {
    // Color based on current direction and magnitude
    const currentMagnitude = Math.abs(wireSignal.current);
    if (currentMagnitude > 0.1) {
      ctx.strokeStyle = selected ? '#ef4444' : '#dc2626'; // High current - red
    } else if (currentMagnitude > 0.01) {
      ctx.strokeStyle = selected ? '#f59e0b' : '#d97706'; // Medium current - yellow
    } else {
      ctx.strokeStyle = selected ? '#10b981' : '#059669'; // Low current - green
    }
  } else if (isSimulating && !hasSignal) {
    ctx.strokeStyle = selected ? '#6b7280' : '#9ca3af'; // No signal - gray
  } else {
    ctx.strokeStyle = selected ? '#dc2626' : '#1e40af'; // Default - blue
  }
  
  ctx.lineWidth = selected ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(el.start.x, el.start.y);
  ctx.lineTo(el.end.x, el.end.y);
  ctx.stroke();
  
  // Current flow animation
  if (isSimulating && hasSignal) {
    const time = Date.now() / 1000;
    const wireLength = Math.sqrt(
      Math.pow(el.end.x - el.start.x, 2) + 
      Math.pow(el.end.y - el.start.y, 2)
    );
    
    // Direction vector
    const dirX = (el.end.x - el.start.x) / wireLength;
    const dirY = (el.end.y - el.start.y) / wireLength;
    
    // Animated arrows showing current flow
    const arrowSpacing = 20;
    const arrowSpeed = wireSignal.current > 0 ? 50 : -50; // Direction based on current
    const offset = (time * arrowSpeed) % arrowSpacing;
    
    ctx.strokeStyle = isSimulating ? '#fbbf24' : '#6b7280';
    ctx.lineWidth = 1;
    
    for (let i = offset; i < wireLength; i += arrowSpacing) {
      const arrowX = el.start.x + dirX * i;
      const arrowY = el.start.y + dirY * i;
      
      // Draw arrow
      const arrowSize = 4;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - dirX * arrowSize - dirY * arrowSize/2,
        arrowY - dirY * arrowSize + dirX * arrowSize/2
      );
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - dirX * arrowSize + dirY * arrowSize/2,
        arrowY - dirY * arrowSize - dirX * arrowSize/2
      );
      ctx.stroke();
    }
    
    // Current magnitude label
    if (Math.abs(wireSignal.current) > 0.001) {
      const midX = (el.start.x + el.end.x) / 2;
      const midY = (el.start.y + el.end.y) / 2;
      
      ctx.fillStyle = '#1f2937';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${(wireSignal.current * 1000).toFixed(1)}mA`,
        midX,
        midY - 8
      );
    }
  }
  
  // Connection points
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(el.start.x, el.start.y, 3, 0, 2*Math.PI);
  ctx.arc(el.end.x, el.end.y, 3, 0, 2*Math.PI);
  ctx.fill();
}

function drawText(ctx, el, selected) {
  ctx.save();
  ctx.font = `${el.fontSize || 12}px ${el.fontFamily || 'Arial'}`;
  ctx.fillStyle = selected ? '#3b82f6' : (el.color || '#059669');
  ctx.textAlign = el.align || 'left';
  ctx.fillText(el.text, el.x, el.y);
  
  if (selected) {
    const metrics = ctx.measureText(el.text);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(el.x - 2, el.y - (el.fontSize || 12), metrics.width + 4, (el.fontSize || 12) + 2);
    ctx.setLineDash([]);
  }
  
  ctx.restore();
}