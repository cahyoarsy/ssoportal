import React, { useState, useEffect } from 'react';

export const useEKTSCanvas = (canvasRef) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [tool, setTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const drawGrid = (ctx, width, height) => {
    const gridSize = 20 * zoom;
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = (pan.x % gridSize); x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = (pan.y % gridSize); y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawWire = (ctx, start, end, selected = false) => {
    ctx.strokeStyle = selected ? '#ff6b6b' : '#333333';
    ctx.lineWidth = selected ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    
    // Draw connection points
    ctx.fillStyle = selected ? '#ff6b6b' : '#666666';
    ctx.beginPath();
    ctx.arc(start.x, start.y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(end.x, end.y, 3, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawComponent = (ctx, component, selected = false) => {
    const { x, y, type, rotation = 0, value, label } = component;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = selected ? '#ff6b6b' : '#333333';
    ctx.lineWidth = selected ? 3 : 2;
    ctx.fillStyle = '#333333';
    ctx.font = '12px Arial';

    switch (type) {
      case 'resistor':
        // Resistor zigzag pattern
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-20, 0);
        ctx.lineTo(-15, -10);
        ctx.lineTo(-5, 10);
        ctx.lineTo(5, -10);
        ctx.lineTo(15, 10);
        ctx.lineTo(20, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        
        if (value) {
          ctx.fillText(value, -10, -15);
        }
        break;

      case 'capacitor':
        // Capacitor parallel lines
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-5, 0);
        ctx.moveTo(-5, -15);
        ctx.lineTo(-5, 15);
        ctx.moveTo(5, -15);
        ctx.lineTo(5, 15);
        ctx.moveTo(5, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        
        if (value) {
          ctx.fillText(value, -10, -20);
        }
        break;

      case 'inductor':
        // Inductor coil
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-20, 0);
        for (let i = 0; i < 4; i++) {
          ctx.arc(-15 + i * 10, 0, 5, Math.PI, 0, false);
        }
        ctx.lineTo(30, 0);
        ctx.stroke();
        
        if (value) {
          ctx.fillText(value, -10, -15);
        }
        break;

      case 'battery':
        // Battery symbol
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(-10, -15);
        ctx.lineTo(-10, 15);
        ctx.moveTo(10, -10);
        ctx.lineTo(10, 10);
        ctx.moveTo(10, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        
        ctx.fillText('+', 15, -5);
        ctx.fillText('-', -20, -5);
        break;

      case 'ground':
        // Ground symbol
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 10);
        ctx.moveTo(-15, 10);
        ctx.lineTo(15, 10);
        ctx.moveTo(-10, 15);
        ctx.lineTo(10, 15);
        ctx.moveTo(-5, 20);
        ctx.lineTo(5, 20);
        ctx.stroke();
        break;

      case 'diode':
        // Diode triangle and line
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, 0);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, -10);
        ctx.lineTo(10, 10);
        ctx.moveTo(10, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        break;

      case 'voltmeter':
        // Voltmeter circle with V
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillText('V', -3, 3);
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-15, 0);
        ctx.moveTo(15, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        break;

      case 'ammeter':
        // Ammeter circle with A
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillText('A', -3, 3);
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-15, 0);
        ctx.moveTo(15, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        break;

      default:
        // Default component (rectangle)
        ctx.beginPath();
        ctx.rect(-15, -10, 30, 20);
        ctx.stroke();
        if (label) {
          ctx.fillText(label, -10, 25);
        }
    }
    
    ctx.restore();
    
    // Draw selection highlight
    if (selected) {
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.rect(x - 35, y - 20, 70, 40);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);
    
    // Draw grid
    drawGrid(ctx, canvas.width / zoom, canvas.height / zoom);
    
    // Draw all elements
    elements.forEach(element => {
      if (element.type === 'wire') {
        drawWire(ctx, element.start, element.end, element.id === selectedElement?.id);
      } else {
        drawComponent(ctx, element, element.id === selectedElement?.id);
      }
    });
    
    ctx.restore();
  };

  const addComponent = (type, x, y, properties = {}) => {
    const newComponent = {
      id: Date.now(),
      type,
      x: Math.round(x / 20) * 20,
      y: Math.round(y / 20) * 20,
      rotation: 0,
      ...properties
    };
    
    setElements(prev => [...prev, newComponent]);
    return newComponent;
  };

  const addWire = (start, end) => {
    const newWire = {
      id: Date.now(),
      type: 'wire',
      start: {
        x: Math.round(start.x / 20) * 20,
        y: Math.round(start.y / 20) * 20
      },
      end: {
        x: Math.round(end.x / 20) * 20,
        y: Math.round(end.y / 20) * 20
      }
    };
    
    setElements(prev => [...prev, newWire]);
    return newWire;
  };

  const selectElement = (x, y) => {
    const element = elements.find(el => {
      if (el.type === 'wire') {
        // Check if point is near the wire line
        const distance = distanceFromPointToLine(x, y, el.start, el.end);
        return distance < 10;
      } else {
        // Check if point is within component bounds
        return x >= el.x - 35 && x <= el.x + 35 && y >= el.y - 20 && y <= el.y + 20;
      }
    });
    
    setSelectedElement(element || null);
    return element;
  };

  const distanceFromPointToLine = (px, py, start, end) => {
    const A = px - start.x;
    const B = py - start.y;
    const C = end.x - start.x;
    const D = end.y - start.y;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    
    const param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
      xx = start.x;
      yy = start.y;
    } else if (param > 1) {
      xx = end.x;
      yy = end.y;
    } else {
      xx = start.x + param * C;
      yy = start.y + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const deleteElement = (elementId) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const updateElement = (elementId, updates) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  };

  const clearCanvas = () => {
    setElements([]);
    setSelectedElement(null);
  };

  useEffect(() => {
    redraw();
  }, [elements, selectedElement, zoom, pan]);

  return {
    elements,
    selectedElement,
    tool,
    zoom,
    pan,
    isDrawing,
    currentPath,
    setTool,
    setZoom,
    setPan,
    setIsDrawing,
    setCurrentPath,
    addComponent,
    addWire,
    selectElement,
    deleteElement,
    updateElement,
    clearCanvas,
    redraw
  };
};