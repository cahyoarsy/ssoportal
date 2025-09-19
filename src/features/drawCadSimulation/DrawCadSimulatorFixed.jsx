import React, { useRef, useState, useEffect } from 'react';

/**
 * DrawCadSimulatorFixed - Fixed version without complex hooks
 * Basic CAD functionality that should work without errors
 */
export function DrawCadSimulatorFixed({ onNavigate }) {
  const canvasRef = useRef(null);
  const [currentTool, setCurrentTool] = useState('select');
  const [activeCategory, setActiveCategory] = useState('basic-electrical');
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  // Wire connection state
  const [wires, setWires] = useState([]);
  const [currentWire, setCurrentWire] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  // Drag state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // Advanced editing state
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [clipboard, setClipboard] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectionBox, setSelectionBox] = useState(null);
  // Component library state
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteComponents, setFavoriteComponents] = useState(['resistor', 'led', 'battery']);
  // Canvas navigation state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Component categories
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
        { id: 'currentSource', label: 'Current Source', icon: '─◊─' },
        { id: 'ground', label: 'Ground', icon: '⏚' },
        { id: 'fuse', label: 'Fuse', icon: '─▢─' },
        { id: 'transformer', label: 'Transformer', icon: '◯))(◯' },
        { id: 'motor', label: 'Motor', icon: '◯M◯' }
      ]
    },
    'switches-relays': {
      name: 'Switches & Relays',
      icon: '🔀',
      components: [
        { id: 'switch', label: 'SPST Switch', icon: '─╱─' },
        { id: 'spdtSwitch', label: 'SPDT Switch', icon: '─╱┬─' },
        { id: 'pushButton', label: 'Push Button', icon: '─○─' },
        { id: 'relay', label: 'Relay', icon: '⧈╱' },
        { id: 'contactor', label: 'Contactor', icon: '╫╱' }
      ]
    },
    'semiconductors': {
      name: 'Semiconductors',
      icon: '🔺',
      components: [
        { id: 'diode', label: 'Diode', icon: '─▷│─' },
        { id: 'zenerDiode', label: 'Zener Diode', icon: '─▷╫─' },
        { id: 'led', label: 'LED', icon: '─▷│↗' },
        { id: 'npnTransistor', label: 'NPN Transistor', icon: '┤├→' },
        { id: 'pnpTransistor', label: 'PNP Transistor', icon: '┤├←' },
        { id: 'nmosFet', label: 'NMOS FET', icon: '┤│→' },
        { id: 'pmosFet', label: 'PMOS FET', icon: '┤│←' },
        { id: 'thyristor', label: 'Thyristor', icon: '─▷│┬─' }
      ]
    },
    'logic-gates': {
      name: 'Logic Gates',
      icon: '🔢',
      components: [
        { id: 'andGate', label: 'AND Gate', icon: '&' },
        { id: 'orGate', label: 'OR Gate', icon: '≥1' },
        { id: 'notGate', label: 'NOT Gate', icon: '¬' },
        { id: 'nandGate', label: 'NAND Gate', icon: '⊼' },
        { id: 'norGate', label: 'NOR Gate', icon: '⊽' },
        { id: 'xorGate', label: 'XOR Gate', icon: '⊕' },
        { id: 'xnorGate', label: 'XNOR Gate', icon: '⊙' },
        { id: 'buffer', label: 'Buffer', icon: '▷' },
        { id: 'triStateBuffer', label: 'Tri-State Buffer', icon: '▷◯' }
      ]
    }
  };

  // Add component to canvas
  const addComponent = (componentType) => {
    const newElement = {
      id: Date.now() + Math.random(),
      type: componentType,
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200,
      rotation: 0,
      label: '',
      value: ''
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    
    // Save to history
    saveToHistory(newElements, wires);
    
    setSelectedElement(newElement);
  };

  // Snap-to-grid helper
  const gridSize = 20;
  function snapToGrid(x, y) {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }

  // Canvas navigation helpers
  const screenToWorld = (screenX, screenY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (screenX - rect.left - panX) / zoom;
    const y = (screenY - rect.top - panY) / zoom;
    return { x, y };
  };

  const worldToScreen = (worldX, worldY) => {
    return {
      x: worldX * zoom + panX,
      y: worldY * zoom + panY
    };
  };

  // Pin detection function
  const findPinAt = (worldX, worldY) => {
    const tolerance = 10 / zoom; // Adjust for zoom level
    
    for (const element of elements) {
      const pins = getComponentPins(element.type);
      if (!pins) continue;
      
      for (const pin of pins) {
        const pinX = element.x + pin.x;
        const pinY = element.y + pin.y;
        const distance = Math.sqrt((worldX - pinX) ** 2 + (worldY - pinY) ** 2);
        
        if (distance <= tolerance) {
          return {
            elementId: element.id,
            pinId: pin.id,
            x: pinX,
            y: pinY,
            type: pin.type
          };
        }
      }
    }
    return null;
  };

  // Get pins for each component type
  const getComponentPins = (componentType) => {
    const pinDefinitions = {
      'resistor': [
        { id: 'pin1', x: -30, y: 0, type: 'input' },
        { id: 'pin2', x: 30, y: 0, type: 'output' }
      ],
      'capacitor': [
        { id: 'pos', x: -30, y: 0, type: 'input' },
        { id: 'neg', x: 30, y: 0, type: 'output' }
      ],
      'inductor': [
        { id: 'pin1', x: -30, y: 0, type: 'input' },
        { id: 'pin2', x: 30, y: 0, type: 'output' }
      ],
      'battery': [
        { id: 'pos', x: -30, y: 0, type: 'output' },
        { id: 'neg', x: 30, y: 0, type: 'input' }
      ],
      'voltageSource': [
        { id: 'pos', x: -30, y: 0, type: 'output' },
        { id: 'neg', x: 30, y: 0, type: 'input' }
      ],
      'currentSource': [
        { id: 'pos', x: -30, y: 0, type: 'output' },
        { id: 'neg', x: 30, y: 0, type: 'input' }
      ],
      'ground': [
        { id: 'terminal', x: 0, y: -20, type: 'input' }
      ],
      'led': [
        { id: 'anode', x: -30, y: 0, type: 'input' },
        { id: 'cathode', x: 30, y: 0, type: 'output' }
      ],
      'diode': [
        { id: 'anode', x: -30, y: 0, type: 'input' },
        { id: 'cathode', x: 30, y: 0, type: 'output' }
      ],
      'switch': [
        { id: 'pin1', x: -30, y: 0, type: 'input' },
        { id: 'pin2', x: 30, y: 0, type: 'output' }
      ],
      'andGate': [
        { id: 'in1', x: -30, y: -10, type: 'input' },
        { id: 'in2', x: -30, y: 10, type: 'input' },
        { id: 'out', x: 30, y: 0, type: 'output' }
      ],
      'orGate': [
        { id: 'in1', x: -30, y: -10, type: 'input' },
        { id: 'in2', x: -30, y: 10, type: 'input' },
        { id: 'out', x: 30, y: 0, type: 'output' }
      ],
      'notGate': [
        { id: 'in', x: -30, y: 0, type: 'input' },
        { id: 'out', x: 30, y: 0, type: 'output' }
      ]
    };
    
    return pinDefinitions[componentType] || [];
  };

  // Wire creation functions
  const startWire = (pin) => {
    setSelectedPin(pin);
    setCurrentWire({
      startPin: pin,
      endPin: null,
      path: [{ x: pin.x, y: pin.y }]
    });
  };

  const completeWire = (endPin) => {
    if (currentWire && selectedPin) {
      // Create wire connection
      const newWire = {
        id: Date.now(),
        startPin: selectedPin,
        endPin: endPin,
        path: [
          { x: selectedPin.x, y: selectedPin.y },
          { x: endPin.x, y: endPin.y }
        ]
      };
      
      setWires(prev => [...prev, newWire]);
      setCurrentWire(null);
      setSelectedPin(null);
    }
  };

  const cancelWire = () => {
    setCurrentWire(null);
    setSelectedPin(null);
  };

  // History management functions
  const saveToHistory = (newElements, newWires) => {
    const newState = { 
      elements: JSON.parse(JSON.stringify(newElements)), 
      wires: JSON.parse(JSON.stringify(newWires)) 
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setHistory(newHistory);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setElements(state.elements);
      setWires(state.wires);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setElements(state.elements);
      setWires(state.wires);
      setHistoryIndex(newIndex);
    }
  };

  // Clipboard operations
  const copySelected = () => {
    if (selectedElements.length > 0) {
      const selectedData = {
        elements: elements.filter(el => selectedElements.includes(el.id)),
        wires: wires.filter(wire => 
          selectedElements.includes(wire.startPin.elementId) && 
          selectedElements.includes(wire.endPin.elementId)
        )
      };
      setClipboard(selectedData);
    }
  };

  const paste = () => {
    if (clipboard && clipboard.elements.length > 0) {
      const offset = 50; // Offset for pasted elements
      const idMap = new Map();
      
      // Create new elements with new IDs
      const newElements = clipboard.elements.map(el => {
        const newId = Date.now() + Math.random();
        idMap.set(el.id, newId);
        return {
          ...el,
          id: newId,
          x: el.x + offset,
          y: el.y + offset
        };
      });
      
      // Create new wires with mapped IDs
      const newWires = clipboard.wires.map(wire => ({
        ...wire,
        id: Date.now() + Math.random(),
        startPin: {
          ...wire.startPin,
          elementId: idMap.get(wire.startPin.elementId)
        },
        endPin: {
          ...wire.endPin,
          elementId: idMap.get(wire.endPin.elementId)
        }
      }));
      
      const updatedElements = [...elements, ...newElements];
      const updatedWires = [...wires, ...newWires];
      
      saveToHistory(updatedElements, updatedWires);
      setElements(updatedElements);
      setWires(updatedWires);
      setSelectedElements(newElements.map(el => el.id));
    }
  };

  const duplicateSelected = () => {
    copySelected();
    paste();
  };

  const deleteSelected = () => {
    if (selectedElements.length > 0) {
      const updatedElements = elements.filter(el => !selectedElements.includes(el.id));
      const updatedWires = wires.filter(wire => 
        !selectedElements.includes(wire.startPin.elementId) && 
        !selectedElements.includes(wire.endPin.elementId)
      );
      
      saveToHistory(updatedElements, updatedWires);
      setElements(updatedElements);
      setWires(updatedWires);
      setSelectedElements([]);
      setSelectedElement(null);
    }
  };

  const selectAll = () => {
    setSelectedElements(elements.map(el => el.id));
  };

  const clearSelection = () => {
    setSelectedElements([]);
    setSelectedElement(null);
  };

  // Circuit Simulation Engine
  const simulateCircuit = () => {
    if (!isSimulating) return;

    // Create a circuit graph
    const circuit = {
      nodes: new Map(),
      components: new Map(),
      wires: new Map()
    };

    // Add components to circuit
    elements.forEach(element => {
      const pins = getComponentPins(element.type);
      if (pins && pins.length > 0) {
        circuit.components.set(element.id, {
          ...element,
          pins: pins,
          voltages: new Map(),
          currents: new Map()
        });

        // Create nodes for each pin
        pins.forEach(pin => {
          const nodeId = `${element.id}_${pin.id}`;
          circuit.nodes.set(nodeId, {
            voltage: 0,
            connections: [],
            componentId: element.id,
            pinId: pin.id
          });
        });
      }
    });

    // Add wire connections
    wires.forEach(wire => {
      const startNodeId = `${wire.startPin.elementId}_${wire.startPin.pinId}`;
      const endNodeId = `${wire.endPin.elementId}_${wire.endPin.pinId}`;
      
      circuit.wires.set(wire.id, {
        ...wire,
        startNodeId,
        endNodeId,
        current: 0
      });

      // Connect nodes
      if (circuit.nodes.has(startNodeId) && circuit.nodes.has(endNodeId)) {
        circuit.nodes.get(startNodeId).connections.push(endNodeId);
        circuit.nodes.get(endNodeId).connections.push(startNodeId);
      }
    });

    // Simple simulation: Voltage sources set voltage, resistors limit current
    circuit.components.forEach((comp, compId) => {
      const type = comp.type;
      
      if (type === 'voltageSource' || type === 'battery') {
        // Set voltage at positive terminal
        const posNodeId = `${compId}_pos`;
        const negNodeId = `${compId}_neg`;
        
        if (circuit.nodes.has(posNodeId)) {
          circuit.nodes.get(posNodeId).voltage = comp.properties?.voltage || 5;
        }
        if (circuit.nodes.has(negNodeId)) {
          circuit.nodes.get(negNodeId).voltage = 0; // Ground reference
        }
      }
      
      if (type === 'ground') {
        // Ground sets voltage to 0
        const terminalId = `${compId}_terminal`;
        if (circuit.nodes.has(terminalId)) {
          circuit.nodes.get(terminalId).voltage = 0;
        }
      }
      
      if (type === 'led') {
        // LED forward voltage drop
        const anodeId = `${compId}_anode`;
        const cathodeId = `${compId}_cathode`;
        
        if (circuit.nodes.has(anodeId) && circuit.nodes.has(cathodeId)) {
          const anode = circuit.nodes.get(anodeId);
          const cathode = circuit.nodes.get(cathodeId);
          
          // Simple LED model: if voltage > 2V, conduct
          if (anode.voltage - cathode.voltage > 2) {
            comp.properties = { ...comp.properties, isOn: true };
            // LED drops about 2V
            cathode.voltage = Math.max(cathode.voltage, anode.voltage - 2);
          } else {
            comp.properties = { ...comp.properties, isOn: false };
          }
        }
      }

      if (type === 'switch') {
        // Switch can be open or closed
        const pin1Id = `${compId}_pin1`;
        const pin2Id = `${compId}_pin2`;
        
        if (circuit.nodes.has(pin1Id) && circuit.nodes.has(pin2Id)) {
          const pin1 = circuit.nodes.get(pin1Id);
          const pin2 = circuit.nodes.get(pin2Id);
          
          // If switch is closed (default), equalize voltages
          if (comp.properties?.closed !== false) {
            const avgVoltage = (pin1.voltage + pin2.voltage) / 2;
            pin1.voltage = avgVoltage;
            pin2.voltage = avgVoltage;
          }
        }
      }

      // Logic gates
      if (type === 'andGate') {
        const in1Id = `${compId}_in1`;
        const in2Id = `${compId}_in2`;
        const outId = `${compId}_out`;
        
        if (circuit.nodes.has(in1Id) && circuit.nodes.has(in2Id) && circuit.nodes.has(outId)) {
          const in1 = circuit.nodes.get(in1Id);
          const in2 = circuit.nodes.get(in2Id);
          const out = circuit.nodes.get(outId);
          
          // AND logic: output high only if both inputs are high (>2.5V)
          if (in1.voltage > 2.5 && in2.voltage > 2.5) {
            out.voltage = 5;
          } else {
            out.voltage = 0;
          }
        }
      }

      if (type === 'orGate') {
        const in1Id = `${compId}_in1`;
        const in2Id = `${compId}_in2`;
        const outId = `${compId}_out`;
        
        if (circuit.nodes.has(in1Id) && circuit.nodes.has(in2Id) && circuit.nodes.has(outId)) {
          const in1 = circuit.nodes.get(in1Id);
          const in2 = circuit.nodes.get(in2Id);
          const out = circuit.nodes.get(outId);
          
          // OR logic: output high if either input is high (>2.5V)
          if (in1.voltage > 2.5 || in2.voltage > 2.5) {
            out.voltage = 5;
          } else {
            out.voltage = 0;
          }
        }
      }

      if (type === 'notGate') {
        const inId = `${compId}_in`;
        const outId = `${compId}_out`;
        
        if (circuit.nodes.has(inId) && circuit.nodes.has(outId)) {
          const input = circuit.nodes.get(inId);
          const output = circuit.nodes.get(outId);
          
          // NOT logic: output opposite of input
          if (input.voltage > 2.5) {
            output.voltage = 0;
          } else {
            output.voltage = 5;
          }
        }
      }
    });

    // Propagate voltages through wires (simplified)
    let changed = true;
    let iterations = 0;
    while (changed && iterations < 10) {
      changed = false;
      iterations++;
      
      circuit.wires.forEach(wire => {
        const startNode = circuit.nodes.get(wire.startNodeId);
        const endNode = circuit.nodes.get(wire.endNodeId);
        
        if (startNode && endNode) {
          const avgVoltage = (startNode.voltage + endNode.voltage) / 2;
          if (Math.abs(startNode.voltage - avgVoltage) > 0.01) {
            startNode.voltage = avgVoltage;
            changed = true;
          }
          if (Math.abs(endNode.voltage - avgVoltage) > 0.01) {
            endNode.voltage = avgVoltage;
            changed = true;
          }
        }
      });
    }

    // Update element properties based on simulation
    setElements(prev => prev.map(element => {
      const circuitComp = circuit.components.get(element.id);
      if (circuitComp) {
        return {
          ...element,
          properties: { ...element.properties, ...circuitComp.properties }
        };
      }
      return element;
    }));
  };

    // Run simulation continuously when enabled
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(simulateCircuit, 100); // 10 FPS
      return () => clearInterval(interval);
    }
  }, [isSimulating, elements, wires]);

  // Project Management Functions
  const newProject = () => {
    if (elements.length > 0 || wires.length > 0) {
      if (!confirm('Create new project? Current work will be lost.')) {
        return;
      }
    }
    
    setElements([]);
    setWires([]);
    setSelectedElement(null);
    setSelectedElements([]);
    setHistory([{ elements: [], wires: [] }]);
    setHistoryIndex(0);
    setIsSimulating(false);
    setCurrentWire(null);
    setSelectedPin(null);
  };

  const saveProject = () => {
    const projectData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      elements: elements,
      wires: wires,
      settings: {
        zoom: zoom,
        panX: panX,
        panY: panY
      }
    };
    
    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cad-project-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result);
        
        if (projectData.elements && projectData.wires) {
          setElements(projectData.elements);
          setWires(projectData.wires);
          
          if (projectData.settings) {
            setZoom(projectData.settings.zoom || 1);
            setPanX(projectData.settings.panX || 0);
            setPanY(projectData.settings.panY || 0);
          }
          
          // Reset other states
          setSelectedElement(null);
          setSelectedElements([]);
          setCurrentWire(null);
          setSelectedPin(null);
          setIsSimulating(false);
          
          // Save to history
          saveToHistory(projectData.elements, projectData.wires);
          
          alert('Project loaded successfully!');
        } else {
          alert('Invalid project file format!');
        }
      } catch (error) {
        alert('Error loading project file!');
        console.error('Load error:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const exportProject = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create temporary canvas for export
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    
    // Set export size
    exportCanvas.width = 1200;
    exportCanvas.height = 800;
    
    // White background
    exportCtx.fillStyle = '#ffffff';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    
    // Calculate bounds to fit all elements
    if (elements.length > 0) {
      const bounds = elements.reduce((acc, el) => ({
        minX: Math.min(acc.minX, el.x - 50),
        minY: Math.min(acc.minY, el.y - 50),
        maxX: Math.max(acc.maxX, el.x + 50),
        maxY: Math.max(acc.maxY, el.y + 50)
      }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
      
      const contentWidth = bounds.maxX - bounds.minX;
      const contentHeight = bounds.maxY - bounds.minY;
      const scale = Math.min(
        (exportCanvas.width - 100) / contentWidth,
        (exportCanvas.height - 100) / contentHeight,
        2
      );
      
      exportCtx.save();
      exportCtx.translate(
        (exportCanvas.width - contentWidth * scale) / 2 - bounds.minX * scale,
        (exportCanvas.height - contentHeight * scale) / 2 - bounds.minY * scale
      );
      exportCtx.scale(scale, scale);
      
      // Draw grid
      exportCtx.strokeStyle = '#e5e7eb';
      exportCtx.lineWidth = 1 / scale;
      const step = gridSize;
      for (let x = bounds.minX; x < bounds.maxX; x += step) {
        exportCtx.beginPath();
        exportCtx.moveTo(x, bounds.minY);
        exportCtx.lineTo(x, bounds.maxY);
        exportCtx.stroke();
      }
      for (let y = bounds.minY; y < bounds.maxY; y += step) {
        exportCtx.beginPath();
        exportCtx.moveTo(bounds.minX, y);
        exportCtx.lineTo(bounds.maxX, y);
        exportCtx.stroke();
      }
      
      // Draw wires
      exportCtx.strokeStyle = '#059669';
      exportCtx.lineWidth = 2 / scale;
      wires.forEach(wire => {
        exportCtx.beginPath();
        exportCtx.moveTo(wire.path[0].x, wire.path[0].y);
        for (let i = 1; i < wire.path.length; i++) {
          exportCtx.lineTo(wire.path[i].x, wire.path[i].y);
        }
        exportCtx.stroke();
      });
      
      // Draw components
      elements.forEach(element => {
        drawComponent(exportCtx, element, false);
      });
      
      exportCtx.restore();
    }
    
    // Download the image
    exportCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cad-circuit-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  // Zoom functions
  const zoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const zoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const zoomToFit = () => {
    if (elements.length === 0) {
      setZoom(1);
      setPanX(0);
      setPanY(0);
      return;
    }
    
    const bounds = elements.reduce((acc, el) => ({
      minX: Math.min(acc.minX, el.x - 40),
      maxX: Math.max(acc.maxX, el.x + 40),
      minY: Math.min(acc.minY, el.y - 30),
      maxY: Math.max(acc.maxY, el.y + 30)
    }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const boundsWidth = bounds.maxX - bounds.minX;
    const boundsHeight = bounds.maxY - bounds.minY;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const scaleX = (canvasWidth * 0.8) / boundsWidth;
    const scaleY = (canvasHeight * 0.8) / boundsHeight;
    const newZoom = Math.min(scaleX, scaleY, 2);
    
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    setZoom(newZoom);
    setPanX(canvasWidth / 2 - centerX * newZoom);
    setPanY(canvasHeight / 2 - centerY * newZoom);
  };

  const resetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // Canvas drawing function
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1 / zoom;
    const step = gridSize;
    
    // Calculate visible grid range
    const startX = Math.floor(-panX / zoom / step) * step;
    const endX = startX + (canvas.width / zoom) + step;
    const startY = Math.floor(-panY / zoom / step) * step;
    const endY = startY + (canvas.height / zoom) + step;
    
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

    // Draw components
    elements.forEach(element => {
      const isSelected = selectedElement?.id === element.id || selectedElements.includes(element.id);
      drawComponent(ctx, element, isSelected);
    });

    // Draw selection box
    if (selectionBox) {
      ctx.strokeStyle = '#3b82f6';
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1 / zoom;
      ctx.setLineDash([5 / zoom, 5 / zoom]);
      
      const width = selectionBox.endX - selectionBox.startX;
      const height = selectionBox.endY - selectionBox.startY;
      
      ctx.fillRect(selectionBox.startX, selectionBox.startY, width, height);
      ctx.strokeRect(selectionBox.startX, selectionBox.startY, width, height);
      ctx.setLineDash([]);
    }

    // Draw wires
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2 / zoom;
    wires.forEach(wire => {
      ctx.beginPath();
      ctx.moveTo(wire.path[0].x, wire.path[0].y);
      for (let i = 1; i < wire.path.length; i++) {
        ctx.lineTo(wire.path[i].x, wire.path[i].y);
      }
      ctx.stroke();
    });

    // Draw current wire being created
    if (currentWire && selectedPin) {
      const mousePos = currentWire.path[currentWire.path.length - 1];
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / zoom;
      ctx.setLineDash([5 / zoom, 5 / zoom]);
      ctx.beginPath();
      ctx.moveTo(currentWire.path[0].x, currentWire.path[0].y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw pins when wire tool is active
    if (currentTool === 'wire') {
      elements.forEach(element => {
        const pins = getComponentPins(element.type);
        if (pins && pins.length > 0) {
          pins.forEach(pin => {
            const pinX = element.x + pin.x;
            const pinY = element.y + pin.y;
            
            // Pin circle
            ctx.fillStyle = pin.type === 'input' ? '#ef4444' : '#3b82f6';
            if (selectedPin && selectedPin.elementId === element.id && selectedPin.pinId === pin.id) {
              ctx.fillStyle = '#fbbf24'; // Highlight selected pin
            }
            
            ctx.beginPath();
            ctx.arc(pinX, pinY, 4 / zoom, 0, 2 * Math.PI);
            ctx.fill();
            
            // Pin outline
            ctx.strokeStyle = '#1f2937';
            ctx.lineWidth = 1 / zoom;
            ctx.stroke();
          });
        }
      });
    }

    ctx.restore();

    // Draw zoom info
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.fillText(`Zoom: ${Math.round(zoom * 100)}%`, 10, canvas.height - 10);
  };

  // Mouse event handlers for drag & drop
  function getElementAt(x, y) {
    const worldPos = screenToWorld(x, y);
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      // Increased hit area for easier selection
      if (Math.abs(worldPos.x - el.x) <= 30 && Math.abs(worldPos.y - el.y) <= 25) {
        return el;
      }
    }
    return null;
  }

  const handleCanvasMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const worldPos = screenToWorld(x, y);
    
    // Middle mouse button or Ctrl+click for panning
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
      canvasRef.current.style.cursor = 'grabbing';
      return;
    }
    
    // Wire tool handling
    if (currentTool === 'wire') {
      const pin = findPinAt(worldPos.x, worldPos.y);
      if (pin) {
        if (!selectedPin) {
          // Start wire from this pin
          startWire(pin);
        } else {
          // Complete wire to this pin
          if (pin.elementId !== selectedPin.elementId) {
            completeWire(pin);
          } else {
            // Cancel if clicking same component
            cancelWire();
          }
        }
      } else {
        // Cancel wire if clicking on empty space
        cancelWire();
      }
      return;
    }
    
    // Select tool handling (existing code)
    const el = getElementAt(x, y);
    if (el) {
      // Multi-selection with Ctrl
      if (e.ctrlKey) {
        if (selectedElements.includes(el.id)) {
          setSelectedElements(prev => prev.filter(id => id !== el.id));
        } else {
          setSelectedElements(prev => [...prev, el.id]);
        }
      } else {
        // Single selection
        setSelectedElements([]);
        setDraggingId(el.id);
        setDragOffset({ x: worldPos.x - el.x, y: worldPos.y - el.y });
        setSelectedElement(el);
      }
      canvasRef.current.style.cursor = 'grabbing';
    } else {
      // Start selection box if no element clicked
      if (!e.ctrlKey) {
        setSelectedElements([]);
        setSelectedElement(null);
      }
      setSelectionBox({
        startX: worldPos.x,
        startY: worldPos.y,
        endX: worldPos.x,
        endY: worldPos.y
      });
      canvasRef.current.style.cursor = 'move';
    }
  };

  const handleCanvasMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const worldPos = screenToWorld(x, y);
    
    if (isPanning) {
      setPanX(e.clientX - panStart.x);
      setPanY(e.clientY - panStart.y);
      return;
    }
    
    // Update wire preview when creating wire
    if (currentWire && selectedPin) {
      setCurrentWire(prev => ({
        ...prev,
        path: [
          prev.path[0],
          { x: worldPos.x, y: worldPos.y }
        ]
      }));
    }

    // Update selection box
    if (selectionBox && !draggingId) {
      setSelectionBox(prev => ({
        ...prev,
        endX: worldPos.x,
        endY: worldPos.y
      }));
    }
    
    if (draggingId) {
      const { x: snapX, y: snapY } = snapToGrid(worldPos.x - dragOffset.x, worldPos.y - dragOffset.y);
      
      // Update element position with bounds checking
      setElements(prev => prev.map(el => {
        if (el.id === draggingId) {
          // Keep component within reasonable bounds
          const boundedX = Math.max(-1000, Math.min(snapX, 2000));
          const boundedY = Math.max(-1000, Math.min(snapY, 2000));
          return { ...el, x: boundedX, y: boundedY };
        }
        return el;
      }));
      
      // Update selected element for properties panel
      if (selectedElement?.id === draggingId) {
        const boundedX = Math.max(-1000, Math.min(snapX, 2000));
        const boundedY = Math.max(-1000, Math.min(snapY, 2000));
        setSelectedElement({ ...selectedElement, x: boundedX, y: boundedY });
      }
    } else {
      // Change cursor based on context
      if (currentTool === 'wire') {
        const pin = findPinAt(worldPos.x, worldPos.y);
        canvasRef.current.style.cursor = pin ? 'crosshair' : 'default';
      } else {
        const hoveredEl = getElementAt(x, y);
        canvasRef.current.style.cursor = hoveredEl ? 'grab' : 'move';
      }
    }
  };

  const handleCanvasMouseUp = () => {
    // Complete selection box
    if (selectionBox) {
      const minX = Math.min(selectionBox.startX, selectionBox.endX);
      const maxX = Math.max(selectionBox.startX, selectionBox.endX);
      const minY = Math.min(selectionBox.startY, selectionBox.endY);
      const maxY = Math.max(selectionBox.startY, selectionBox.endY);
      
      const selectedIds = elements.filter(el => 
        el.x >= minX && el.x <= maxX && el.y >= minY && el.y <= maxY
      ).map(el => el.id);
      
      setSelectedElements(selectedIds);
      setSelectionBox(null);
    }
    
    setDraggingId(null);
    setIsPanning(false);
    // Reset cursor
    canvasRef.current.style.cursor = 'move';
  };

  // Keyboard event handler
  const handleKeyDown = (e) => {
    // Prevent default for handled keys
    const handled = ['Escape', 'Delete', 'KeyZ', 'KeyY', 'KeyC', 'KeyV', 'KeyD', 'KeyA'];
    if (handled.includes(e.code) && (e.ctrlKey || e.key === 'Escape' || e.key === 'Delete')) {
      e.preventDefault();
    }

    if (e.key === 'Escape') {
      cancelWire();
      clearSelection();
    } else if (e.key === 'Delete') {
      if (selectedElements.length > 0) {
        deleteSelected();
      } else if (selectedElement) {
        // Delete single selected component
        const updatedWires = wires.filter(wire => 
          wire.startPin.elementId !== selectedElement.id && 
          wire.endPin.elementId !== selectedElement.id
        );
        const updatedElements = elements.filter(el => el.id !== selectedElement.id);
        
        saveToHistory(updatedElements, updatedWires);
        setElements(updatedElements);
        setWires(updatedWires);
        setSelectedElement(null);
      }
    } else if (e.ctrlKey) {
      switch(e.code) {
        case 'KeyZ':
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'KeyY':
          redo();
          break;
        case 'KeyC':
          copySelected();
          break;
        case 'KeyV':
          paste();
          break;
        case 'KeyD':
          duplicateSelected();
          break;
        case 'KeyA':
          selectAll();
          break;
      }
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const worldPos = screenToWorld(mouseX, mouseY);
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5);
      
      // Zoom towards mouse position
      const newWorldPos = screenToWorld(mouseX, mouseY);
      setPanX(prev => prev + (worldPos.x - newWorldPos.x) * newZoom);
      setPanY(prev => prev + (worldPos.y - newWorldPos.y) * newZoom);
      setZoom(newZoom);
    }
  };

  // Draw individual component
  const drawComponent = (ctx, element, selected) => {
    const isDragging = draggingId === element.id;
    
    ctx.save();
    ctx.translate(element.x, element.y);
    ctx.rotate((element.rotation || 0) * Math.PI / 180);

    // Add shadow effect when dragging
    if (isDragging) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    }

    // Set colors
    let strokeColor, fillColor;
    if (isDragging) {
      strokeColor = '#10b981'; // Green when dragging
      fillColor = '#d1fae5';
    } else if (selected) {
      strokeColor = '#3b82f6'; // Blue when selected
      fillColor = '#dbeafe';
    } else {
      strokeColor = '#374151'; // Gray default
      fillColor = '#f9fafb';
    }
    
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = isDragging ? 3 : (selected ? 2 : 1.5);
    ctx.font = '12px Arial';

    // Draw component based on type
    switch (element.type) {
      case 'resistor':
        ctx.strokeRect(-20, -8, 40, 16);
        ctx.fillRect(-20, -8, 40, 16);
        ctx.strokeStyle = strokeColor;
        // Connection lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-20, 0);
        ctx.moveTo(20, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        // Zigzag pattern
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(-10 + i * 5, (i % 2) * 8 - 4);
        }
        ctx.stroke();
        break;

      case 'capacitor':
        ctx.fillRect(-20, -8, 40, 16);
        ctx.strokeRect(-20, -8, 40, 16);
        // Connection lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-5, 0);
        ctx.moveTo(5, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        // Plates
        ctx.beginPath();
        ctx.moveTo(-5, -12);
        ctx.lineTo(-5, 12);
        ctx.moveTo(5, -12);
        ctx.lineTo(5, 12);
        ctx.stroke();
        break;

      case 'inductor':
        ctx.fillRect(-20, -8, 40, 16);
        ctx.strokeRect(-20, -8, 40, 16);
        // Connection lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-15, 0);
        ctx.moveTo(15, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        // Coil
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          ctx.arc(-10 + i * 10, 0, 5, Math.PI, 0, false);
        }
        ctx.stroke();
        break;

      case 'battery':
        // Battery symbol with + and - terminals
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(-10, -15);
        ctx.lineTo(-10, 15);
        ctx.moveTo(-5, -10);
        ctx.lineTo(-5, 10);
        ctx.moveTo(5, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        ctx.fillStyle = strokeColor;
        ctx.fillText('+', -15, -20);
        ctx.fillText('-', 8, -20);
        break;

      case 'voltageSource':
        // Circle with V inside
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        // Connection lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-15, 0);
        ctx.moveTo(15, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        ctx.fillStyle = strokeColor;
        ctx.fillText('V', -3, 4);
        break;

      case 'currentSource':
        // Circle with I inside
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        // Connection lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-15, 0);
        ctx.moveTo(15, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        ctx.fillStyle = strokeColor;
        ctx.fillText('I', -2, 4);
        break;

      case 'ground':
        // Ground symbol
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(0, 0);
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.moveTo(-10, 5);
        ctx.lineTo(10, 5);
        ctx.moveTo(-5, 10);
        ctx.lineTo(5, 10);
        ctx.stroke();
        break;

      case 'fuse':
        // Fuse symbol
        ctx.strokeRect(-15, -8, 30, 16);
        ctx.fillRect(-15, -8, 30, 16);
        // Connection lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-15, 0);
        ctx.moveTo(15, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        ctx.fillStyle = strokeColor;
        ctx.fillText('F', -3, 4);
        break;

      case 'transformer':
        // Transformer with two coils
        ctx.beginPath();
        // Left coil
        for (let i = 0; i < 3; i++) {
          ctx.arc(-15 + i * 5, 0, 2.5, Math.PI, 0, false);
        }
        // Right coil
        for (let i = 0; i < 3; i++) {
          ctx.arc(5 + i * 5, 0, 2.5, Math.PI, 0, false);
        }
        ctx.stroke();
        // Core lines
        ctx.beginPath();
        ctx.moveTo(-5, -15);
        ctx.lineTo(-5, 15);
        ctx.moveTo(0, -15);
        ctx.lineTo(0, 15);
        ctx.stroke();
        // Connection lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-15, 0);
        ctx.moveTo(20, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();
        break;

      case 'motor':
        // Motor symbol
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        // Connection lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-20, 0);
        ctx.moveTo(20, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        ctx.fillStyle = strokeColor;
        ctx.fillText('M', -4, 4);
        break;

      case 'switch':
        // SPST switch
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.lineTo(10, -8);
        ctx.moveTo(10, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        // Contact points
        ctx.beginPath();
        ctx.arc(-10, 0, 2, 0, 2 * Math.PI);
        ctx.arc(10, 0, 2, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case 'spdtSwitch':
        // SPDT switch
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.lineTo(10, -8);
        ctx.moveTo(10, 0);
        ctx.lineTo(30, 0);
        ctx.moveTo(10, -15);
        ctx.lineTo(30, -15);
        ctx.stroke();
        // Contact points
        ctx.beginPath();
        ctx.arc(-10, 0, 2, 0, 2 * Math.PI);
        ctx.arc(10, 0, 2, 0, 2 * Math.PI);
        ctx.arc(10, -15, 2, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case 'pushButton':
        // Push button
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.lineTo(10, -8);
        ctx.moveTo(10, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        // Button
        ctx.strokeRect(-5, -15, 10, 8);
        ctx.beginPath();
        ctx.arc(-10, 0, 2, 0, 2 * Math.PI);
        ctx.arc(10, 0, 2, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case 'relay':
        // Relay symbol
        ctx.strokeRect(-20, -15, 40, 30);
        ctx.fillRect(-20, -15, 40, 30);
        // Coil
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.arc(-15 + i * 7.5, 5, 3, Math.PI, 0, false);
        }
        ctx.stroke();
        // Contacts
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, -5);
        ctx.stroke();
        ctx.fillStyle = strokeColor;
        ctx.fillText('K', -3, -20);
        break;

      case 'contactor':
        // Contactor symbol
        ctx.strokeRect(-25, -15, 50, 30);
        ctx.fillRect(-25, -15, 50, 30);
        // Coil
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.arc(-20 + i * 8, 5, 3, Math.PI, 0, false);
        }
        ctx.stroke();
        // Multiple contacts
        ctx.beginPath();
        ctx.moveTo(-15, -10);
        ctx.lineTo(0, -5);
        ctx.moveTo(0, -10);
        ctx.lineTo(15, -5);
        ctx.stroke();
        ctx.fillStyle = strokeColor;
        ctx.fillText('KM', -5, -20);
        break;

      case 'diode':
        // Diode symbol
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(10, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        // Diode triangle and line
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, 0);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, -10);
        ctx.lineTo(10, 10);
        ctx.stroke();
        break;

      case 'zenerDiode':
        // Zener diode symbol
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(10, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        // Diode triangle
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, 0);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Zener line with bend
        ctx.beginPath();
        ctx.moveTo(10, -10);
        ctx.lineTo(10, 10);
        ctx.lineTo(15, 10);
        ctx.moveTo(10, -10);
        ctx.lineTo(5, -10);
        ctx.stroke();
        break;

      case 'led':
        // LED symbol
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(10, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        // LED triangle and line
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, 0);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        
        // Change color based on simulation state
        if (isSimulating && element.properties?.isOn) {
          ctx.fillStyle = '#fbbf24'; // Yellow when on
          ctx.strokeStyle = '#f59e0b';
        }
        
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = strokeColor; // Reset stroke color
        ctx.beginPath();
        ctx.moveTo(10, -10);
        ctx.lineTo(10, 10);
        ctx.stroke();
        
        // Light emission effect when on
        if (isSimulating && element.properties?.isOn) {
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
          ctx.fill();
        }
        // Light arrows
        ctx.beginPath();
        ctx.moveTo(15, -8);
        ctx.lineTo(20, -12);
        ctx.lineTo(18, -10);
        ctx.lineTo(20, -10);
        ctx.lineTo(20, -12);
        ctx.moveTo(18, -5);
        ctx.lineTo(23, -9);
        ctx.lineTo(21, -7);
        ctx.lineTo(23, -7);
        ctx.lineTo(23, -9);
        ctx.stroke();
        break;

      case 'npnTransistor':
        // NPN transistor
        ctx.beginPath();
        // Base line
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(-10, -15);
        ctx.lineTo(-10, 15);
        // Collector
        ctx.moveTo(-10, -8);
        ctx.lineTo(10, -20);
        ctx.lineTo(10, -30);
        // Emitter with arrow
        ctx.moveTo(-10, 8);
        ctx.lineTo(10, 20);
        ctx.lineTo(10, 30);
        // Arrow on emitter
        ctx.moveTo(5, 15);
        ctx.lineTo(10, 20);
        ctx.lineTo(5, 20);
        ctx.stroke();
        ctx.fillStyle = strokeColor;
        ctx.fillText('Q', -25, -20);
        break;

      case 'pnpTransistor':
        // PNP transistor
        ctx.beginPath();
        // Base line
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(-10, -15);
        ctx.lineTo(-10, 15);
        // Collector
        ctx.moveTo(-10, 8);
        ctx.lineTo(10, 20);
        ctx.lineTo(10, 30);
        // Emitter with arrow
        ctx.moveTo(-10, -8);
        ctx.lineTo(10, -20);
        ctx.lineTo(10, -30);
        // Arrow on emitter (reversed)
        ctx.moveTo(-5, -15);
        ctx.lineTo(-10, -8);
        ctx.lineTo(-5, -8);
        ctx.stroke();
        ctx.fillStyle = strokeColor;
        ctx.fillText('Q', -25, -20);
        break;

      case 'nmosFet':
        // NMOS FET
        ctx.beginPath();
        // Gate
        ctx.moveTo(-30, 0);
        ctx.lineTo(-15, 0);
        ctx.moveTo(-15, -15);
        ctx.lineTo(-15, 15);
        // Drain
        ctx.moveTo(-10, -8);
        ctx.lineTo(10, -8);
        ctx.lineTo(10, -30);
        // Source
        ctx.moveTo(-10, 8);
        ctx.lineTo(10, 8);
        ctx.lineTo(10, 30);
        // Channel
        ctx.moveTo(-10, -8);
        ctx.lineTo(-10, 8);
        ctx.stroke();
        // Arrow
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(-10, -3);
        ctx.lineTo(-10, 3);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = strokeColor;
        ctx.fillText('M', -25, -20);
        break;

      case 'pmosFet':
        // PMOS FET
        ctx.beginPath();
        // Gate
        ctx.moveTo(-30, 0);
        ctx.lineTo(-15, 0);
        ctx.moveTo(-15, -15);
        ctx.lineTo(-15, 15);
        // Drain
        ctx.moveTo(-10, 8);
        ctx.lineTo(10, 8);
        ctx.lineTo(10, 30);
        // Source
        ctx.moveTo(-10, -8);
        ctx.lineTo(10, -8);
        ctx.lineTo(10, -30);
        // Channel
        ctx.moveTo(-10, -8);
        ctx.lineTo(-10, 8);
        ctx.stroke();
        // Arrow (reversed)
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-5, -3);
        ctx.lineTo(-5, 3);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = strokeColor;
        ctx.fillText('M', -25, -20);
        break;

      case 'thyristor':
        // Thyristor (SCR) symbol
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(10, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        // Main body
        ctx.beginPath();
        ctx.moveTo(-10, -15);
        ctx.lineTo(10, 0);
        ctx.lineTo(-10, 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, -15);
        ctx.lineTo(10, 15);
        ctx.stroke();
        // Gate
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(0, 25);
        ctx.stroke();
        ctx.fillStyle = strokeColor;
        ctx.fillText('SCR', -8, -20);
        break;

      case 'andGate':
        // AND gate body
        ctx.beginPath();
        ctx.moveTo(-20, -15);
        ctx.lineTo(-5, -15);
        ctx.lineTo(10, -15);
        ctx.arc(10, 0, 15, -Math.PI/2, Math.PI/2);
        ctx.lineTo(-5, 15);
        ctx.lineTo(-20, 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Input lines
        ctx.beginPath();
        ctx.moveTo(-30, -8);
        ctx.lineTo(-20, -8);
        ctx.moveTo(-30, 8);
        ctx.lineTo(-20, 8);
        ctx.moveTo(25, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();
        
        // Label
        ctx.fillStyle = strokeColor;
        ctx.fillText('&', -10, 4);
        break;

      case 'orGate':
        // OR gate body  
        ctx.beginPath();
        ctx.moveTo(-20, -15);
        ctx.quadraticCurveTo(-5, -15, 0, -8);
        ctx.quadraticCurveTo(15, 0, 25, 0);
        ctx.quadraticCurveTo(15, 0, 0, 8);
        ctx.quadraticCurveTo(-5, 15, -20, 15);
        ctx.quadraticCurveTo(-15, 0, -20, -15);
        ctx.fill();
        ctx.stroke();
        
        // Input/output lines
        ctx.beginPath();
        ctx.moveTo(-30, -8);
        ctx.lineTo(-18, -8);
        ctx.moveTo(-30, 8);
        ctx.lineTo(-18, 8);
        ctx.moveTo(25, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();
        
        // Label
        ctx.fillStyle = strokeColor;
        ctx.fillText('≥1', -12, 4);
        break;

      case 'notGate':
        // NOT gate (triangle with circle)
        ctx.beginPath();
        ctx.moveTo(-20, -12);
        ctx.lineTo(-20, 12);
        ctx.lineTo(15, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Input/output lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-20, 0);
        ctx.moveTo(22, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();
        
        // Inversion circle
        ctx.beginPath();
        ctx.arc(18, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;

      case 'nandGate':
        // NAND gate (AND + NOT)
        ctx.beginPath();
        ctx.moveTo(-20, -15);
        ctx.lineTo(-5, -15);
        ctx.lineTo(10, -15);
        ctx.arc(10, 0, 15, -Math.PI/2, Math.PI/2);
        ctx.lineTo(-5, 15);
        ctx.lineTo(-20, 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Input lines
        ctx.beginPath();
        ctx.moveTo(-30, -8);
        ctx.lineTo(-20, -8);
        ctx.moveTo(-30, 8);
        ctx.lineTo(-20, 8);
        ctx.moveTo(28, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();
        
        // Inversion circle
        ctx.beginPath();
        ctx.arc(25, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Label
        ctx.fillStyle = strokeColor;
        ctx.fillText('⊼', -10, 4);
        break;

      case 'norGate':
        // NOR gate (OR + NOT)
        ctx.beginPath();
        ctx.moveTo(-20, -15);
        ctx.quadraticCurveTo(-5, -15, 0, -8);
        ctx.quadraticCurveTo(15, 0, 22, 0);
        ctx.quadraticCurveTo(15, 0, 0, 8);
        ctx.quadraticCurveTo(-5, 15, -20, 15);
        ctx.quadraticCurveTo(-15, 0, -20, -15);
        ctx.fill();
        ctx.stroke();
        
        // Input/output lines
        ctx.beginPath();
        ctx.moveTo(-30, -8);
        ctx.lineTo(-18, -8);
        ctx.moveTo(-30, 8);
        ctx.lineTo(-18, 8);
        ctx.moveTo(28, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();
        
        // Inversion circle
        ctx.beginPath();
        ctx.arc(25, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Label
        ctx.fillStyle = strokeColor;
        ctx.fillText('⊽', -12, 4);
        break;

      case 'xorGate':
        // XOR gate
        ctx.beginPath();
        ctx.moveTo(-20, -15);
        ctx.quadraticCurveTo(-5, -15, 0, -8);
        ctx.quadraticCurveTo(15, 0, 25, 0);
        ctx.quadraticCurveTo(15, 0, 0, 8);
        ctx.quadraticCurveTo(-5, 15, -20, 15);
        ctx.quadraticCurveTo(-15, 0, -20, -15);
        ctx.fill();
        ctx.stroke();
        
        // Extra curved line for XOR
        ctx.beginPath();
        ctx.quadraticCurveTo(-18, 0, -23, -15);
        ctx.quadraticCurveTo(-18, 0, -23, 15);
        ctx.stroke();
        
        // Input/output lines
        ctx.beginPath();
        ctx.moveTo(-30, -8);
        ctx.lineTo(-23, -8);
        ctx.moveTo(-30, 8);
        ctx.lineTo(-23, 8);
        ctx.moveTo(25, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();
        
        // Label
        ctx.fillStyle = strokeColor;
        ctx.fillText('⊕', -12, 4);
        break;

      case 'xnorGate':
        // XNOR gate (XOR + NOT)
        ctx.beginPath();
        ctx.moveTo(-20, -15);
        ctx.quadraticCurveTo(-5, -15, 0, -8);
        ctx.quadraticCurveTo(15, 0, 22, 0);
        ctx.quadraticCurveTo(15, 0, 0, 8);
        ctx.quadraticCurveTo(-5, 15, -20, 15);
        ctx.quadraticCurveTo(-15, 0, -20, -15);
        ctx.fill();
        ctx.stroke();
        
        // Extra curved line for XOR
        ctx.beginPath();
        ctx.quadraticCurveTo(-18, 0, -23, -15);
        ctx.quadraticCurveTo(-18, 0, -23, 15);
        ctx.stroke();
        
        // Input/output lines
        ctx.beginPath();
        ctx.moveTo(-30, -8);
        ctx.lineTo(-23, -8);
        ctx.moveTo(-30, 8);
        ctx.lineTo(-23, 8);
        ctx.moveTo(28, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();
        
        // Inversion circle
        ctx.beginPath();
        ctx.arc(25, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Label
        ctx.fillStyle = strokeColor;
        ctx.fillText('⊙', -12, 4);
        break;

      case 'buffer':
        // Buffer gate (triangle)
        ctx.beginPath();
        ctx.moveTo(-20, -12);
        ctx.lineTo(-20, 12);
        ctx.lineTo(20, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Input/output lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-20, 0);
        ctx.moveTo(20, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();
        break;

      case 'triStateBuffer':
        // Tri-state buffer (triangle with enable)
        ctx.beginPath();
        ctx.moveTo(-20, -12);
        ctx.lineTo(-20, 12);
        ctx.lineTo(20, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Input/output lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-20, 0);
        ctx.moveTo(20, 0);
        ctx.lineTo(35, 0);
        // Enable line
        ctx.moveTo(0, 12);
        ctx.lineTo(0, 25);
        ctx.stroke();
        
        // Enable label
        ctx.fillStyle = strokeColor;
        ctx.fillText('EN', -5, 20);
        break;

      default:
        // Default rectangle for unknown components
        ctx.fillRect(-20, -10, 40, 20);
        ctx.strokeRect(-20, -10, 40, 20);
        ctx.fillStyle = strokeColor;
        ctx.fillText(element.type.substring(0, 4).toUpperCase(), -15, 4);
    }

    // Selection and drag indicators
    if (selected || isDragging) {
      // Reset shadow for indicators
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      if (isDragging) {
        // Dragging indicator - animated dashed border
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(-30, -25, 60, 50);
        ctx.setLineDash([]);
        
        // Add corner handles for better visual feedback
        ctx.fillStyle = '#10b981';
        const cornerSize = 4;
        [-30, 30].forEach(x => {
          [-25, 25].forEach(y => {
            ctx.fillRect(x - cornerSize/2, y - cornerSize/2, cornerSize, cornerSize);
          });
        });
      } else if (selected) {
        // Selection indicator
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(-25, -20, 50, 40);
        ctx.setLineDash([]);
      }
    }

    // Component label
    if (element.label) {
      ctx.fillStyle = isDragging ? '#10b981' : '#374151';
      ctx.font = '10px Arial';
      ctx.fillText(element.label, -20, -30);
    }

    // Component value
    if (element.value) {
      ctx.fillStyle = isDragging ? '#10b981' : '#6b7280';
      ctx.font = '9px Arial';
      ctx.fillText(element.value, -20, 35);
    }

    ctx.restore();
  };

  // Remove old click handler, use drag handlers

  // Auto-render when elements change
  useEffect(() => {
    drawCanvas();
  }, [elements, selectedElement, draggingId, zoom, panX, panY, wires, currentWire, selectedElements, selectionBox]);

  // Initialize history on first load
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ elements: [], wires: [] }]);
      setHistoryIndex(0);
    }
  }, []);

  // Initial canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 600;
      drawCanvas();
    }
    // Mouse event listeners
    const c = canvasRef.current;
    if (c) {
      c.addEventListener('mousedown', handleCanvasMouseDown);
      c.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('mousemove', handleCanvasMouseMove);
      window.addEventListener('mouseup', handleCanvasMouseUp);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (c) {
        c.removeEventListener('mousedown', handleCanvasMouseDown);
        c.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      window.removeEventListener('mouseup', handleCanvasMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [draggingId, dragOffset, elements, zoom, panX, panY, isPanning]);

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
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                DRAw CAD SIMULATION
              </h1>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600">
                  {isSimulating ? 'Simulating' : 'Stopped'}
                </span>
              </div>
            </div>
            
            {/* Simulation Controls */}
            <div className="flex items-center space-x-2">
              {/* Canvas Navigation Controls */}
              <div className="flex items-center space-x-1 mr-4 border-r pr-4">
                <button
                  onClick={zoomIn}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  title="Zoom In (Ctrl+Scroll)"
                >
                  🔍+
                </button>
                <button
                  onClick={zoomOut}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  title="Zoom Out (Ctrl+Scroll)"
                >
                  🔍-
                </button>
                <button
                  onClick={zoomToFit}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  title="Fit to Screen"
                >
                  📐
                </button>
                <button
                  onClick={resetView}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  title="Reset View"
                >
                  🏠
                </button>
                <span className="text-xs text-gray-500">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  isSimulating 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSimulating ? '⏹ Stop' : '▶ Start'} Simulation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-120px)]">
          
          {/* Component Library */}
          <div className="bg-white rounded-lg shadow-sm border p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Component Library</h3>
            
            {/* Tool Selection */}
            <div className="space-y-2 mb-6">
              <button
                onClick={() => setCurrentTool('select')}
                className={`w-full px-3 py-2 text-left rounded transition-colors ${
                  currentTool === 'select' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                🔲 Select Tool
              </button>
              <button
                onClick={() => setCurrentTool('component')}
                className={`w-full px-3 py-2 text-left rounded transition-colors ${
                  currentTool === 'component' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                ⚡ Add Components
              </button>
              <button
                onClick={() => setCurrentTool('wire')}
                className={`w-full px-3 py-2 text-left rounded transition-colors ${
                  currentTool === 'wire' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                🔌 Wire Tool
              </button>
            </div>

            {/* Navigation Help */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-blue-800 text-sm mb-2">🧭 Navigation</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• <kbd className="px-1 bg-blue-200 rounded">Ctrl+Scroll</kbd> Zoom</div>
                <div>• <kbd className="px-1 bg-blue-200 rounded">Middle Click</kbd> Pan</div>
                <div>• <kbd className="px-1 bg-blue-200 rounded">Drag</kbd> Move components</div>
                <div>• <kbd className="px-1 bg-blue-200 rounded">📐</kbd> Fit to screen</div>
              </div>
            </div>

            {/* Wire Tool Help */}
            {currentTool === 'wire' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <h4 className="font-medium text-green-800 text-sm mb-2">🔌 Wire Tool</h4>
                <div className="text-xs text-green-700 space-y-1">
                  <div>• Click pin to start wire</div>
                  <div>• Click another pin to connect</div>
                  <div>• <kbd className="px-1 bg-green-200 rounded">ESC</kbd> Cancel wire</div>
                  <div>• <kbd className="px-1 bg-green-200 rounded">DEL</kbd> Delete component/wires</div>
                </div>
              </div>
            )}

            {/* Editing Operations */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-gray-800 text-sm mb-3">✂️ Edit Operations</h4>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  ↶ Undo
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Y)"
                >
                  ↷ Redo
                </button>
                <button
                  onClick={copySelected}
                  disabled={selectedElements.length === 0}
                  className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy (Ctrl+C)"
                >
                  📋 Copy
                </button>
                <button
                  onClick={paste}
                  disabled={!clipboard}
                  className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Paste (Ctrl+V)"
                >
                  📄 Paste
                </button>
                <button
                  onClick={duplicateSelected}
                  disabled={selectedElements.length === 0}
                  className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Duplicate (Ctrl+D)"
                >
                  📑 Duplicate
                </button>
                <button
                  onClick={deleteSelected}
                  disabled={selectedElements.length === 0}
                  className="px-2 py-1 text-xs bg-red-50 border border-red-200 rounded hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-700"
                  title="Delete (Del)"
                >
                  🗑️ Delete
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={selectAll}
                  className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50"
                  title="Select All (Ctrl+A)"
                >
                  ☑️ Select All
                </button>
                <button
                  onClick={clearSelection}
                  disabled={selectedElements.length === 0}
                  className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Clear Selection (ESC)"
                >
                  ❌ Clear
                </button>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Selected: {selectedElements.length} items
              </div>
            </div>

            {/* Circuit Simulation */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-purple-800 text-sm mb-3">⚡ Circuit Simulation</h4>
              <div className="space-y-3">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                    isSimulating 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isSimulating ? '⏸️ Stop Simulation' : '▶️ Start Simulation'}
                </button>
                
                {isSimulating && (
                  <div className="bg-green-100 border border-green-300 rounded p-2 text-xs">
                    <div className="text-green-800 font-medium mb-1">Simulation Active</div>
                    <div className="text-green-700">
                      • LEDs will light up based on circuit
                      <br />
                      • Voltage sources provide power
                      <br />
                      • Connect components with wires
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-purple-700">
                  <div>Components: {elements.length}</div>
                  <div>Connections: {wires.length}</div>
                  <div>Status: {isSimulating ? '🟢 Running' : '🔴 Stopped'}</div>
                </div>
              </div>
            </div>

            {/* Project Management */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-indigo-800 text-sm mb-3">📁 Project</h4>
              <div className="space-y-2">
                <button
                  onClick={newProject}
                  className="w-full px-3 py-2 text-xs bg-white border border-indigo-200 rounded hover:bg-indigo-50 text-indigo-700"
                  title="Create New Project"
                >
                  📄 New Project
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={saveProject}
                    className="flex-1 px-2 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded"
                    title="Save Project as JSON"
                  >
                    💾 Save
                  </button>
                  <label className="flex-1 px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer text-center">
                    📂 Load
                    <input
                      type="file"
                      accept=".json"
                      onChange={loadProject}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <button
                  onClick={exportProject}
                  className="w-full px-3 py-2 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded"
                  title="Export as PNG Image"
                >
                  🖼️ Export PNG
                </button>
              </div>
            </div>

            {/* Component Library */}
            {currentTool === 'component' && (
              <div className="space-y-4">
                {/* Search Box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Favorites Section */}
                {favoriteComponents.length > 0 && !searchTerm && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">⭐ Favorites</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {favoriteComponents.slice(0, 5).map(compType => {
                        const comp = Object.values(COMPONENT_CATEGORIES)
                          .flatMap(cat => cat.components)
                          .find(c => c.id === compType);
                        return comp ? (
                          <button
                            key={compType}
                            onClick={() => addComponent(compType)}
                            className="p-2 bg-white border border-yellow-200 rounded hover:bg-yellow-50 text-xs text-left flex items-center"
                            title={comp.label}
                          >
                            <span className="font-mono mr-2">{comp.icon}</span>
                            <span className="truncate">{comp.label}</span>
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Category Tabs */}
                <div className="space-y-2">
                  {searchTerm ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">🔍 Search Results</h4>
                      <div className="space-y-1">
                        {Object.entries(COMPONENT_CATEGORIES)
                          .flatMap(([catId, category]) => 
                            category.components.filter(comp => 
                              comp.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              comp.id.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map(comp => ({ ...comp, categoryId: catId }))
                          )
                          .map(component => (
                            <div key={component.id} className="flex items-center">
                              <button
                                onClick={() => addComponent(component.id)}
                                className="flex-1 px-3 py-2 text-left text-sm rounded hover:bg-gray-100 transition-colors flex items-center"
                                title={`Add ${component.label}`}
                              >
                                <span className="font-mono text-xs mr-2">{component.icon}</span>
                                <span className="flex-1 truncate">{component.label}</span>
                              </button>
                              <button
                                onClick={() => {
                                  setFavoriteComponents(prev => 
                                    prev.includes(component.id) 
                                      ? prev.filter(t => t !== component.id)
                                      : [...prev, component.id]
                                  );
                                }}
                                className={`ml-2 w-6 h-6 text-xs rounded ${
                                  favoriteComponents.includes(component.id) 
                                    ? 'text-yellow-500 bg-yellow-100' 
                                    : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-100'
                                }`}
                                title={favoriteComponents.includes(component.id) ? 'Remove from favorites' : 'Add to favorites'}
                              >
                                ⭐
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    Object.entries(COMPONENT_CATEGORIES).map(([categoryId, category]) => (
                      <div key={categoryId}>
                        <button
                          onClick={() => setActiveCategory(categoryId)}
                          className={`w-full px-3 py-2 text-left rounded font-medium transition-colors ${
                            activeCategory === categoryId 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {category.icon} {category.name}
                        </button>
                        
                        {activeCategory === categoryId && (
                          <div className="mt-2 space-y-1 pl-2">
                            {category.components.map(component => (
                              <div key={component.id} className="flex items-center">
                                <button
                                  onClick={() => addComponent(component.id)}
                                  className="flex-1 px-3 py-2 text-left text-sm rounded hover:bg-gray-100 transition-colors flex items-center"
                                  title={`Add ${component.label}`}
                                >
                                  <span className="font-mono text-xs mr-2">{component.icon}</span>
                                  <span className="flex-1 truncate">{component.label}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setFavoriteComponents(prev => 
                                      prev.includes(component.id) 
                                        ? prev.filter(t => t !== component.id)
                                        : [...prev, component.id]
                                    );
                                  }}
                                  className={`ml-2 w-6 h-6 text-xs rounded ${
                                    favoriteComponents.includes(component.id) 
                                      ? 'text-yellow-500 bg-yellow-100' 
                                      : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-100'
                                  }`}
                                  title={favoriteComponents.includes(component.id) ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                  ⭐
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Drawing Canvas</h3>
              <div className="text-sm text-gray-600">
                Elements: {elements.length} | Wires: {wires.length} | Tool: {currentTool}
              </div>
            </div>
            
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-auto cursor-move"
                style={{ maxHeight: '500px', display: 'block' }}
              />
            </div>
          </div>

          {/* Properties Panel */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
            
            {selectedElement ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <input
                    type="text"
                    value={selectedElement.type}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={selectedElement.label || ''}
                    onChange={(e) => {
                      const updatedElements = elements.map(el => 
                        el.id === selectedElement.id 
                          ? { ...el, label: e.target.value }
                          : el
                      );
                      setElements(updatedElements);
                      setSelectedElement({ ...selectedElement, label: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Enter label..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={selectedElement.value || ''}
                    onChange={(e) => {
                      const updatedElements = elements.map(el => 
                        el.id === selectedElement.id 
                          ? { ...el, value: e.target.value }
                          : el
                      );
                      setElements(updatedElements);
                      setSelectedElement({ ...selectedElement, value: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Enter value..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={Math.round(selectedElement.x)}
                      onChange={(e) => {
                        const newX = parseInt(e.target.value) || 0;
                        const updatedElements = elements.map(el => 
                          el.id === selectedElement.id 
                            ? { ...el, x: newX }
                            : el
                        );
                        setElements(updatedElements);
                        setSelectedElement({ ...selectedElement, x: newX });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="X"
                    />
                    <input
                      type="number"
                      value={Math.round(selectedElement.y)}
                      onChange={(e) => {
                        const newY = parseInt(e.target.value) || 0;
                        const updatedElements = elements.map(el => 
                          el.id === selectedElement.id 
                            ? { ...el, y: newY }
                            : el
                        );
                        setElements(updatedElements);
                        setSelectedElement({ ...selectedElement, y: newY });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Y"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rotation (degrees)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="90"
                      value={selectedElement.rotation || 0}
                      onChange={(e) => {
                        const newRotation = parseInt(e.target.value);
                        const updatedElements = elements.map(el => 
                          el.id === selectedElement.id 
                            ? { ...el, rotation: newRotation }
                            : el
                        );
                        setElements(updatedElements);
                        setSelectedElement({ ...selectedElement, rotation: newRotation });
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-12">
                      {selectedElement.rotation || 0}°
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 space-x-1">
                    {[0, 90, 180, 270].map(angle => (
                      <button
                        key={angle}
                        onClick={() => {
                          const updatedElements = elements.map(el => 
                            el.id === selectedElement.id 
                              ? { ...el, rotation: angle }
                              : el
                          );
                          setElements(updatedElements);
                          setSelectedElement({ ...selectedElement, rotation: angle });
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        {angle}°
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setElements(elements.filter(el => el.id !== selectedElement.id));
                    setSelectedElement(null);
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  🗑 Delete Component
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Select a component to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}