import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useElectricalCadEngine
 * Hook inti untuk ElectriCAD Designer - Enhanced Version
 * Menangani: elemen, seleksi, drag, zoom, pan, export, layers, properties
 */
export function useElectricalCadEngine(canvasRef) {
  const [elements, setElements] = useState([]); // semua entity (component | wire | annotation | text)
  const [selection, setSelection] = useState(null);
  const [multiSelection, setMultiSelection] = useState([]);
  const [tool, setTool] = useState('select'); // select | component | wire | text | erase | measure
  const [activeComponentType, setActiveComponentType] = useState('outlet');
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [wireDraft, setWireDraft] = useState(null); // { start: {x,y}, current: {x,y} }
  const [snap, setSnap] = useState(true);
  const [layers, setLayers] = useState([
    { id: 'components', name: 'Components', visible: true, locked: false },
    { id: 'wiring', name: 'Wiring', visible: true, locked: false },
    { id: 'annotations', name: 'Annotations', visible: true, locked: false }
  ]);
  const [activeLayer, setActiveLayer] = useState('components');
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const historyRef = useRef({ stack: [], index: -1 });
  const mouseRef = useRef({ x: 0, y: 0 });

  // Constants
  const GRID_SIZE = gridSize;
  const SNAP_THRESHOLD = 15;

  // Initialize history with empty state
  useEffect(() => {
    if (historyRef.current.stack.length === 0) {
      historyRef.current = { stack: [[]], index: 0 };
    }
  }, []);

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

  // Enhanced snap helper
  const snapPoint = useCallback((x, y) => {
    if (!snap && !snapEnabled) return { x, y };

    const snapTo = [];
    
    // Grid snap
    if (snap || gridVisible) {
      const gridX = Math.round(x / gridSize) * gridSize;
      const gridY = Math.round(y / gridSize) * gridSize;
      snapTo.push({ x: gridX, y: gridY, type: 'grid' });
    }

    // Element snap points (only if snapEnabled)
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

    snapTo.forEach(snap => {
      const dist = Math.sqrt((x - snap.x) ** 2 + (y - snap.y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        closest = { x: snap.x, y: snap.y };
      }
    });

    return closest;
  }, [snap, snapEnabled, gridVisible, elements, gridSize]);

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((screenX, screenY) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (screenX - rect.left - pan.x) / zoom,
      y: (screenY - rect.top - pan.y) / zoom
    };
  }, [pan, zoom]);

  // Add component with proper layer assignment
  const addComponent = useCallback((type, x, y, properties = {}) => {
    const pos = snapPoint(x, y);
    const newComponent = {
      id: Date.now() + Math.random(),
      kind: 'component',
      type,
      x: pos.x,
      y: pos.y,
      rotation: 0,
      layer: activeLayer,
      label: properties.label || '',
      value: properties.value || '',
      meta: { ...properties }
    };
    setElements(prev => {
      const next = [...prev, newComponent];
      pushHistory(next);
      return next;
    });
    return newComponent;
  }, [snapPoint, pushHistory, activeLayer]);

  // Add text annotation
  const addText = useCallback((x, y, text = 'Text') => {
    const pos = snapPoint(x, y);
    const newText = {
      id: Date.now() + Math.random(),
      kind: 'text',
      x: pos.x,
      y: pos.y,
      text,
      fontSize: 12,
      color: '#000000',
      layer: 'annotations'
    };
    setElements(prev => {
      const next = [...prev, newText];
      pushHistory(next);
      return next;
    });
    return newText;
  }, [snapPoint, pushHistory]);

  // Enhanced wire creation
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
    const end = snapPoint(x, y);
    
    // Don't create wire if start and end are the same
    if (wireDraft.start.x === end.x && wireDraft.start.y === end.y) {
      setWireDraft(null);
      return;
    }

    const newWire = {
      id: Date.now() + Math.random(),
      kind: 'wire',
      start: wireDraft.start,
      end,
      layer: 'wiring',
      wireType: 'single',
      color: '#000000'
    };
    
    setWireDraft(null);
    setElements(prev => {
      const next = [...prev, newWire];
      pushHistory(next);
      return next;
    });
    return newWire;
  }, [wireDraft, snapPoint, pushHistory]);

  const cancelWire = useCallback(() => {
    setWireDraft(null);
  }, []);

  // Enhanced selection system
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

  // Enhanced delete with multi-selection support
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
    
    // Update selection if it's the updated element
    if (selection?.id === elementId) {
      setSelection(sel => ({ ...sel, ...updates }));
    }
  }, [selection, pushHistory]);

  // Helper functions
  const getComponentBounds = (component) => {
    const typeInfo = {
      outlet: { width: 30, height: 20 },
      switch: { width: 30, height: 20 },
      lamp: { width: 25, height: 25 },
      breaker: { width: 25, height: 35 },
      junction: { width: 15, height: 15 },
      panel: { width: 40, height: 60 },
      transformer: { width: 50, height: 40 }
    };
    return {
      x: component.x,
      y: component.y,
      width: typeInfo[component.type]?.width || 20,
      height: typeInfo[component.type]?.height || 20
    };
  };

  const distanceToLine = (px, py, start, end) => {
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
  };

  // Drag and drop system
  const [dragState, setDragState] = useState(null);

  const startDrag = useCallback((element, startX, startY) => {
    const targets = multiSelection.length > 0 ? multiSelection : (element ? [element] : []);
    if (targets.length === 0) return;

    setDragState({
      elements: targets,
      startX,
      startY,
      offsetX: startX - element.x,
      offsetY: startY - element.y
    });
  }, [multiSelection]);

  const updateDrag = useCallback((x, y) => {
    if (!dragState) return;

    const deltaX = x - dragState.startX;
    const deltaY = y - dragState.startY;

    setElements(prev => prev.map(el => {
      const dragging = dragState.elements.find(d => d.id === el.id);
      if (dragging) {
        const newX = dragging.x + deltaX;
        const newY = dragging.y + deltaY;
        return { ...el, x: newX, y: newY };
      }
      return el;
    }));
  }, [dragState]);

  const endDrag = useCallback(() => {
    if (dragState) {
      pushHistory(elements);
      setDragState(null);
    }
  }, [dragState, elements, pushHistory]);

  // Clear all function
  const clearAll = useCallback(() => {
    setElements([]);
    pushHistory([]);
    clearSelection();
  }, [pushHistory, clearSelection]);

  // Export Functions
  const exportToPNG = useCallback((filename = 'electrical-diagram.png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas with white background
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;

    // Fill white background
    exportCtx.fillStyle = '#ffffff';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Copy current canvas content
    exportCtx.drawImage(canvas, 0, 0);

    // Trigger download
    exportCanvas.toBlob(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }, [canvasRef]);

  const exportToDXF = useCallback((filename = 'electrical-diagram.dxf') => {
    let dxfContent = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1015
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
1
0
LAYER
5
10
330
2
100
AcDbSymbolTableRecord
100
AcDbLayerTableRecord
2
0
70
0
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
`;

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
0
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
0
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
  }, [elements]);

  const exportToJSON = useCallback((filename = 'electrical-diagram.json') => {
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      elements,
      layers,
      settings: {
        gridSize,
        zoom,
        pan
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [elements, layers, zoom, pan]);

  const importFromJSON = useCallback((jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (data.elements) {
        setElements(data.elements);
        pushHistory(data.elements);
      }
      if (data.layers) {
        setLayers(data.layers);
      }
      if (data.settings) {
        if (data.settings.zoom) setZoom(data.settings.zoom);
        if (data.settings.pan) setPan(data.settings.pan);
      }
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  }, [pushHistory]);

  // drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const step = gridSize;
    for (let x = -pan.x; x < canvas.width / zoom; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, -pan.y);
      ctx.lineTo(x, canvas.height / zoom);
      ctx.stroke();
    }
    for (let y = -pan.y; y < canvas.height / zoom; y += step) {
      ctx.beginPath();
      ctx.moveTo(-pan.x, y);
      ctx.lineTo(canvas.width / zoom, y);
      ctx.stroke();
    }

    // draw elements
    elements.forEach(el => {
      if (el.kind === 'component') {
        drawComponent(ctx, el, selection?.id === el.id);
      } else if (el.kind === 'wire') {
        drawWire(ctx, el, selection?.id === el.id);
      }
    });

    // wire draft
    if (wireDraft) {
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(wireDraft.start.x, wireDraft.start.y);
      const { x:mx, y:my } = snapPoint(mousePosRef.current.x, mousePosRef.current.y);
      ctx.lineTo(mx, my);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }, [elements, selection, zoom, pan, wireDraft, snapPoint, canvasRef]);

  const mousePosRef = useRef({ x:0, y:0 });

  const onCanvasMouseDown = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (tool === 'pan' || (e.button === 1 || (e.button === 0 && e.altKey))) {
      setIsPanning(true);
      return;
    }

    if (tool === 'component') {
      addComponent(activeComponentType, x, y);
      return;
    }

    if (tool === 'wire') {
      if (!wireDraft) startWire(x, y);
      else commitWire(x, y);
      return;
    }

    if (tool === 'select') {
      const found = selectAtPoint(x, y);
      if (!found) setSelection(null);
      return;
    }

    if (tool === 'erase') {
      const found = selectAtPoint(x, y);
      if (found) deleteSelection();
      return;
    }
  }, [tool, pan, zoom, addComponent, activeComponentType, wireDraft, startWire, commitWire, selectAtPoint, deleteSelection]);

  const onCanvasMouseMove = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mousePosRef.current = { x: e.clientX - rect.left - pan.x, y: e.clientY - rect.top - pan.y };

    if (isPanning) {
      setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
    }
  }, [isPanning, pan]);

  const onCanvasMouseUp = useCallback(() => setIsPanning(false), []);

  const onWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      setZoom(z => Math.min(3, Math.max(0.3, z - e.deltaY * 0.001)));
    }
  }, []);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Delete') deleteSelection();
      if (e.ctrlKey && e.key.toLowerCase() === 'z') undo();
      if (e.ctrlKey && e.key.toLowerCase() === 'y') redo();
      if (e.key === '1') setTool('select');
      if (e.key === '2') setTool('component');
      if (e.key === '3') setTool('wire');
      if (e.key === '4') setTool('pan');
      if (e.key === '5') setTool('erase');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [deleteSelection, undo, redo]);

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
    clearAll,
    deleteSelection,
    selectElement,
    clearSelection,
    updateElement,
    startDrag,
    updateDrag,
    endDrag,
    
    // Canvas handlers
    onCanvasMouseDown,
    onCanvasMouseMove,
    onCanvasMouseUp,
    onWheel,
    screenToWorld,
    
    // Export functions
    exportToPNG,
    exportToDXF,
    exportToJSON,
    importFromJSON,
    
    // Drawing (exposed for external use)
    drawComponent,
    drawWire
  };
}

// Component drawing function
function drawComponent(ctx, el, selected) {
  ctx.save();
  ctx.translate(el.x, el.y);
  ctx.rotate((el.rotation || 0) * Math.PI / 180);
  ctx.strokeStyle = selected ? '#2563eb' : '#0f172a';
  ctx.lineWidth = selected ? 2.5 : 2;
  ctx.fillStyle = '#0f172a';
  ctx.font = '10px Inter, Arial';

  switch (el.type) {
    case 'outlet':
      ctx.beginPath();
      ctx.rect(-15, -10, 30, 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-5, 0, 2, 0, 2*Math.PI);
      ctx.arc(5, 0, 2, 0, 2*Math.PI);
      ctx.fill();
      break;
    case 'switch':
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(15, 0);
      ctx.moveTo(-6, 0);
      ctx.lineTo(6, -10);
      ctx.stroke();
      break;
    case 'lamp':
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, 2*Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-8, -8);
      ctx.lineTo(8, 8);
      ctx.moveTo(8, -8);
      ctx.lineTo(-8, 8);
      ctx.stroke();
      break;
    case 'breaker':
      ctx.beginPath();
      ctx.rect(-12, -17, 24, 34);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-12, -5);
      ctx.lineTo(12, -5);
      ctx.moveTo(-12, 5);
      ctx.lineTo(12, 5);
      ctx.stroke();
      break;
    case 'junction':
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, 2*Math.PI);
      ctx.fill();
      break;
    case 'panel':
      ctx.strokeRect(-20, -30, 40, 60);
      ctx.fillText('PANEL', -15, -35);
      ctx.moveTo(-20, -15);
      ctx.lineTo(20, -15);
      ctx.moveTo(-20, 0);
      ctx.lineTo(20, 0);
      ctx.moveTo(-20, 15);
      ctx.lineTo(20, 15);
      ctx.stroke();
      break;
    case 'transformer':
      ctx.beginPath();
      ctx.arc(-12, 0, 15, 0, 2*Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12, 0, 15, 0, 2*Math.PI);
      ctx.stroke();
      break;
    case 'contactor':
      ctx.strokeRect(-12, -15, 24, 30);
      ctx.moveTo(-12, -5);
      ctx.lineTo(12, -5);
      ctx.moveTo(-12, 5);
      ctx.lineTo(12, 5);
      ctx.stroke();
      ctx.fillText('C', -3, 2);
      break;
    case 'relay':
      ctx.strokeRect(-10, -12, 20, 24);
      ctx.fillText('R', -3, 2);
      break;
    case 'motor':
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, 2*Math.PI);
      ctx.stroke();
      ctx.fillText('M', -3, 2);
      break;
    case 'generator':
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, 2*Math.PI);
      ctx.stroke();
      ctx.fillText('G', -3, 2);
      break;
    case 'fuse':
      ctx.strokeRect(-8, -15, 16, 30);
      ctx.moveTo(-5, -10);
      ctx.lineTo(5, 10);
      ctx.stroke();
      break;
    default:
      ctx.beginPath();
      ctx.rect(-10, -10, 20, 20);
      ctx.stroke();
  }

  // Selection highlight
  if (selected) {
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(-20, -20, 40, 40);
    ctx.setLineDash([]);
  }
  
  ctx.restore();
}

// Wire drawing function
function drawWire(ctx, el, selected) {
  ctx.strokeStyle = selected ? '#dc2626' : '#334155';
  ctx.lineWidth = selected ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(el.start.x, el.start.y);
  ctx.lineTo(el.end.x, el.end.y);
  ctx.stroke();
  
  // Connection points
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(el.start.x, el.start.y, 3, 0, 2*Math.PI);
  ctx.arc(el.end.x, el.end.y, 3, 0, 2*Math.PI);
  ctx.fill();
}

// Text drawing function  
function drawText(ctx, el, selected) {
  ctx.save();
  ctx.font = `${el.fontSize || 12}px Inter, Arial`;
  ctx.fillStyle = selected ? '#2563eb' : '#0f172a';
  ctx.textAlign = el.align || 'left';
  ctx.fillText(el.text, el.x, el.y);
  
  if (selected) {
    const metrics = ctx.measureText(el.text);
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(el.x - 2, el.y - (el.fontSize || 12), metrics.width + 4, (el.fontSize || 12) + 2);
    ctx.setLineDash([]);
  }
  
  ctx.restore();
}
