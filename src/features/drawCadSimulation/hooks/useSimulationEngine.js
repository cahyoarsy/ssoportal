import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useSimulationEngine
 * Real-time electrical simulation engine for CAD symbols
 * Features: Signal flow, electrical calculations, component behaviors
 */
export function useSimulationEngine() {
  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [voltage, setVoltage] = useState(5); // Default 5V
  const [current, setCurrent] = useState(0);
  const [power, setPower] = useState(0);
  
  // Component states for simulation
  const [componentStates, setComponentStates] = useState(new Map());
  const [signalFlow, setSignalFlow] = useState(new Map());
  const [connections, setConnections] = useState(new Map());
  
  // Animation frame reference
  const animationRef = useRef(null);
  const lastUpdateRef = useRef(0);

  // Enhanced component definitions with simulation properties
  const COMPONENT_DEFINITIONS = {
    // Basic Electrical Components
    resistor: {
      type: 'passive',
      pins: [{ id: 'pin1', x: -20, y: 0 }, { id: 'pin2', x: 20, y: 0 }],
      parameters: { resistance: 1000, tolerance: 5, power: 0.25 },
      simulate: (state, inputs) => {
        const voltage = inputs.pin1?.voltage || 0;
        const current = voltage / state.resistance;
        return {
          pin2: { voltage: 0, current },
          power: Math.pow(current, 2) * state.resistance,
          dissipation: Math.pow(current, 2) * state.resistance
        };
      }
    },
    capacitor: {
      type: 'passive',
      pins: [{ id: 'pin1', x: -20, y: 0 }, { id: 'pin2', x: 20, y: 0 }],
      parameters: { capacitance: 100e-6, voltage: 0, charge: 0 },
      simulate: (state, inputs, deltaTime) => {
        const inputVoltage = inputs.pin1?.voltage || 0;
        const current = state.capacitance * (inputVoltage - state.voltage) / deltaTime;
        const newVoltage = state.voltage + (current * deltaTime) / state.capacitance;
        return {
          pin2: { voltage: newVoltage, current },
          voltage: newVoltage,
          charge: state.capacitance * newVoltage,
          energy: 0.5 * state.capacitance * Math.pow(newVoltage, 2)
        };
      }
    },
    inductor: {
      type: 'passive',
      pins: [{ id: 'pin1', x: -20, y: 0 }, { id: 'pin2', x: 20, y: 0 }],
      parameters: { inductance: 1e-3, current: 0, flux: 0 },
      simulate: (state, inputs, deltaTime) => {
        const inputVoltage = inputs.pin1?.voltage || 0;
        const newCurrent = state.current + (inputVoltage * deltaTime) / state.inductance;
        const voltage = state.inductance * (newCurrent - state.current) / deltaTime;
        return {
          pin2: { voltage: inputVoltage - voltage, current: newCurrent },
          current: newCurrent,
          flux: state.inductance * newCurrent,
          energy: 0.5 * state.inductance * Math.pow(newCurrent, 2)
        };
      }
    },
    
    // Power Sources
    voltageSource: {
      type: 'source',
      pins: [{ id: 'positive', x: -20, y: 0 }, { id: 'negative', x: 20, y: 0 }],
      parameters: { voltage: 5, frequency: 0, phase: 0, amplitude: 5 },
      simulate: (state, inputs, deltaTime, time) => {
        const voltage = state.frequency > 0 
          ? state.amplitude * Math.sin(2 * Math.PI * state.frequency * time + state.phase)
          : state.voltage;
        return {
          positive: { voltage, current: 0 },
          negative: { voltage: 0, current: 0 },
          outputVoltage: voltage,
          outputPower: voltage * (inputs.positive?.current || 0)
        };
      }
    },
    currentSource: {
      type: 'source',
      pins: [{ id: 'positive', x: -20, y: 0 }, { id: 'negative', x: 20, y: 0 }],
      parameters: { current: 0.001, frequency: 0, phase: 0, amplitude: 0.001 },
      simulate: (state, inputs, deltaTime, time) => {
        const current = state.frequency > 0
          ? state.amplitude * Math.sin(2 * Math.PI * state.frequency * time + state.phase)
          : state.current;
        return {
          positive: { voltage: inputs.positive?.voltage || 0, current },
          negative: { voltage: inputs.negative?.voltage || 0, current: -current },
          outputCurrent: current
        };
      }
    },
    
    // Semiconductors
    diode: {
      type: 'semiconductor',
      pins: [{ id: 'anode', x: -20, y: 0 }, { id: 'cathode', x: 20, y: 0 }],
      parameters: { forwardVoltage: 0.7, reverseVoltage: 50, saturationCurrent: 1e-12 },
      simulate: (state, inputs) => {
        const anodeVoltage = inputs.anode?.voltage || 0;
        const cathodeVoltage = inputs.cathode?.voltage || 0;
        const voltageDrop = anodeVoltage - cathodeVoltage;
        
        if (voltageDrop >= state.forwardVoltage) {
          // Forward bias - conducting
          const current = state.saturationCurrent * (Math.exp(voltageDrop / 0.026) - 1);
          return {
            cathode: { voltage: anodeVoltage - state.forwardVoltage, current },
            conducting: true,
            power: state.forwardVoltage * current
          };
        } else {
          // Reverse bias - blocking
          return {
            cathode: { voltage: cathodeVoltage, current: 0 },
            conducting: false,
            power: 0
          };
        }
      }
    },
    transistorNPN: {
      type: 'semiconductor',
      pins: [
        { id: 'collector', x: 0, y: -20 },
        { id: 'base', x: -20, y: 0 },
        { id: 'emitter', x: 0, y: 20 }
      ],
      parameters: { beta: 100, vbe: 0.7, vce_sat: 0.2 },
      simulate: (state, inputs) => {
        const baseVoltage = inputs.base?.voltage || 0;
        const emitterVoltage = inputs.emitter?.voltage || 0;
        const collectorVoltage = inputs.collector?.voltage || 0;
        
        const vbe = baseVoltage - emitterVoltage;
        const vce = collectorVoltage - emitterVoltage;
        
        if (vbe >= state.vbe && vce >= state.vce_sat) {
          // Active region
          const baseCurrent = (vbe - state.vbe) / 1000; // Assume 1kΩ base resistance
          const collectorCurrent = state.beta * baseCurrent;
          return {
            collector: { voltage: collectorVoltage, current: -collectorCurrent },
            emitter: { voltage: emitterVoltage, current: collectorCurrent + baseCurrent },
            saturation: false,
            power: vce * collectorCurrent + vbe * baseCurrent
          };
        } else if (vbe >= state.vbe && vce < state.vce_sat) {
          // Saturation region
          const collectorCurrent = (collectorVoltage - state.vce_sat - emitterVoltage) / 100; // Load resistance
          return {
            collector: { voltage: emitterVoltage + state.vce_sat, current: -collectorCurrent },
            emitter: { voltage: emitterVoltage, current: collectorCurrent },
            saturation: true,
            power: state.vce_sat * collectorCurrent
          };
        } else {
          // Cut-off region
          return {
            collector: { voltage: collectorVoltage, current: 0 },
            emitter: { voltage: emitterVoltage, current: 0 },
            saturation: false,
            cutoff: true,
            power: 0
          };
        }
      }
    },
    
    // Logic Gates
    andGate: {
      type: 'digital',
      pins: [
        { id: 'input1', x: -30, y: -10 },
        { id: 'input2', x: -30, y: 10 },
        { id: 'output', x: 30, y: 0 }
      ],
      parameters: { vcc: 5, threshold: 2.5, outputHigh: 5, outputLow: 0 },
      simulate: (state, inputs) => {
        const input1 = (inputs.input1?.voltage || 0) > state.threshold;
        const input2 = (inputs.input2?.voltage || 0) > state.threshold;
        const result = input1 && input2;
        return {
          output: { 
            voltage: result ? state.outputHigh : state.outputLow, 
            current: 0.001 
          },
          logicState: result,
          truth: { input1, input2, output: result }
        };
      }
    },
    orGate: {
      type: 'digital',
      pins: [
        { id: 'input1', x: -30, y: -10 },
        { id: 'input2', x: -30, y: 10 },
        { id: 'output', x: 30, y: 0 }
      ],
      parameters: { vcc: 5, threshold: 2.5, outputHigh: 5, outputLow: 0 },
      simulate: (state, inputs) => {
        const input1 = (inputs.input1?.voltage || 0) > state.threshold;
        const input2 = (inputs.input2?.voltage || 0) > state.threshold;
        const result = input1 || input2;
        return {
          output: { 
            voltage: result ? state.outputHigh : state.outputLow, 
            current: 0.001 
          },
          logicState: result,
          truth: { input1, input2, output: result }
        };
      }
    },
    notGate: {
      type: 'digital',
      pins: [
        { id: 'input', x: -30, y: 0 },
        { id: 'output', x: 30, y: 0 }
      ],
      parameters: { vcc: 5, threshold: 2.5, outputHigh: 5, outputLow: 0 },
      simulate: (state, inputs) => {
        const input = (inputs.input?.voltage || 0) > state.threshold;
        const result = !input;
        return {
          output: { 
            voltage: result ? state.outputHigh : state.outputLow, 
            current: 0.001 
          },
          logicState: result,
          truth: { input, output: result }
        };
      }
    },
    
    // Meters and Instruments
    voltmeter: {
      type: 'meter',
      pins: [{ id: 'positive', x: -20, y: 0 }, { id: 'negative', x: 20, y: 0 }],
      parameters: { range: 10, accuracy: 0.1, impedance: 1e6 },
      simulate: (state, inputs) => {
        const voltage = (inputs.positive?.voltage || 0) - (inputs.negative?.voltage || 0);
        const current = voltage / state.impedance; // High impedance
        return {
          reading: voltage,
          units: 'V',
          inRange: Math.abs(voltage) <= state.range,
          accuracy: state.accuracy,
          power: voltage * current
        };
      }
    },
    ammeter: {
      type: 'meter',
      pins: [{ id: 'in', x: -20, y: 0 }, { id: 'out', x: 20, y: 0 }],
      parameters: { range: 1, accuracy: 0.01, resistance: 0.001 },
      simulate: (state, inputs) => {
        const current = inputs.in?.current || 0;
        const voltageDropped = current * state.resistance; // Small resistance
        return {
          out: { 
            voltage: (inputs.in?.voltage || 0) - voltageDropped, 
            current 
          },
          reading: current,
          units: 'A',
          inRange: Math.abs(current) <= state.range,
          accuracy: state.accuracy,
          power: voltageDropped * current
        };
      }
    },
    
    // Switches
    switch: {
      type: 'control',
      pins: [{ id: 'terminal1', x: -20, y: 0 }, { id: 'terminal2', x: 20, y: 0 }],
      parameters: { closed: false, resistance_closed: 0.001, resistance_open: 1e9 },
      simulate: (state, inputs) => {
        const resistance = state.closed ? state.resistance_closed : state.resistance_open;
        const voltage = inputs.terminal1?.voltage || 0;
        const current = state.closed ? (inputs.terminal1?.current || 0) : 0;
        return {
          terminal2: { 
            voltage: state.closed ? voltage : 0, 
            current 
          },
          closed: state.closed,
          resistance,
          power: Math.pow(current, 2) * resistance
        };
      }
    }
  };

  // Simulation engine core functions
  const updateComponentState = useCallback((componentId, newState) => {
    setComponentStates(prev => {
      const updated = new Map(prev);
      updated.set(componentId, { ...updated.get(componentId), ...newState });
      return updated;
    });
  }, []);

  const getComponentState = useCallback((componentId) => {
    return componentStates.get(componentId) || {};
  }, [componentStates]);

  const calculateNetworkSolution = useCallback((elements) => {
    // Simplified nodal analysis for basic circuits
    const nodes = new Map();
    const components = elements.filter(el => el.kind === 'component');
    const wires = elements.filter(el => el.kind === 'wire');
    
    // Build node network
    components.forEach(comp => {
      const def = COMPONENT_DEFINITIONS[comp.componentType];
      if (def) {
        def.pins.forEach(pin => {
          const nodeId = `${comp.id}_${pin.id}`;
          nodes.set(nodeId, {
            voltage: 0,
            components: [{ comp, pin }],
            connections: []
          });
        });
      }
    });
    
    // Connect nodes through wires
    wires.forEach(wire => {
      // Simple wire connection logic
      const startNode = findNearestNode(wire.start, components);
      const endNode = findNearestNode(wire.end, components);
      
      if (startNode && endNode) {
        nodes.get(startNode).connections.push(endNode);
        nodes.get(endNode).connections.push(startNode);
      }
    });
    
    return nodes;
  }, []);

  const findNearestNode = (point, components) => {
    let nearest = null;
    let minDistance = Infinity;
    
    components.forEach(comp => {
      const def = COMPONENT_DEFINITIONS[comp.componentType];
      if (def) {
        def.pins.forEach(pin => {
          const pinX = comp.x + pin.x;
          const pinY = comp.y + pin.y;
          const distance = Math.sqrt(Math.pow(point.x - pinX, 2) + Math.pow(point.y - pinY, 2));
          
          if (distance < minDistance && distance < 10) { // 10px threshold
            minDistance = distance;
            nearest = `${comp.id}_${pin.id}`;
          }
        });
      }
    });
    
    return nearest;
  };

  const runSimulationStep = useCallback((elements, deltaTime, currentTime) => {
    if (!isSimulating) return;
    
    const networks = calculateNetworkSolution(elements);
    const newStates = new Map();
    const newSignals = new Map();
    
    // Simulate each component
    elements.filter(el => el.kind === 'component').forEach(comp => {
      const def = COMPONENT_DEFINITIONS[comp.componentType];
      if (def && def.simulate) {
        const currentState = componentStates.get(comp.id) || { ...def.parameters };
        
        // Gather inputs from connected pins
        const inputs = {};
        def.pins.forEach(pin => {
          const nodeId = `${comp.id}_${pin.id}`;
          const node = networks.get(nodeId);
          if (node) {
            inputs[pin.id] = {
              voltage: node.voltage,
              current: 0 // Will be calculated iteratively
            };
          }
        });
        
        // Run component simulation
        const result = def.simulate(currentState, inputs, deltaTime, currentTime);
        
        // Update component state
        newStates.set(comp.id, { ...currentState, ...result });
        
        // Update signal flow visualization
        newSignals.set(comp.id, {
          pins: result,
          status: def.type,
          power: result.power || 0,
          active: true
        });
      }
    });
    
    setComponentStates(newStates);
    setSignalFlow(newSignals);
  }, [isSimulating, componentStates, calculateNetworkSolution]);

  // Animation loop for real-time simulation
  const animate = useCallback((timestamp) => {
    if (!isSimulating) return;
    
    const deltaTime = (timestamp - lastUpdateRef.current) / 1000; // Convert to seconds
    lastUpdateRef.current = timestamp;
    
    if (deltaTime > 0 && deltaTime < 0.1) { // Prevent huge time steps
      // Run simulation logic here
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isSimulating]);

  // Start/stop simulation
  const startSimulation = useCallback((elements) => {
    setIsSimulating(true);
    lastUpdateRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setComponentStates(new Map());
    setSignalFlow(new Map());
  }, []);

  const toggleSimulation = useCallback((elements) => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation(elements);
    }
  }, [isSimulating, startSimulation, stopSimulation]);

  // Component interaction
  const toggleSwitch = useCallback((componentId) => {
    setComponentStates(prev => {
      const updated = new Map(prev);
      const current = updated.get(componentId) || {};
      updated.set(componentId, { ...current, closed: !current.closed });
      return updated;
    });
  }, []);

  const updateComponentParameter = useCallback((componentId, parameter, value) => {
    setComponentStates(prev => {
      const updated = new Map(prev);
      const current = updated.get(componentId) || {};
      updated.set(componentId, { ...current, [parameter]: value });
      return updated;
    });
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    // Simulation state
    isSimulating,
    simulationSpeed,
    componentStates,
    signalFlow,
    connections,
    
    // Simulation controls
    startSimulation,
    stopSimulation,
    toggleSimulation,
    setSimulationSpeed,
    
    // Component interaction
    getComponentState,
    updateComponentState,
    updateComponentParameter,
    toggleSwitch,
    
    // Component definitions
    COMPONENT_DEFINITIONS,
    
    // Network analysis
    calculateNetworkSolution,
    runSimulationStep,
    
    // Global parameters
    voltage,
    current,
    power,
    setVoltage,
    setCurrent,
    setPower
  };
}