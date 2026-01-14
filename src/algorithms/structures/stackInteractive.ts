import type { AlgorithmDefinition, GraphState, GraphNode, GraphEdge } from '../types';

// El estado lógico es simplemente un array de números
type StackState = number[];

// Helper: Convierte el array en una torre vertical visual
const generateGraph = (stack: number[], activeIndex: number = -1): GraphState => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  // Base Y (parte inferior del canvas)
  const BaseY = 350;
  const NodeSpacing = 50;

  stack.forEach((val, idx) => {
    // ID único basado en índice para mantener la referencia visual
    const id = `node-${idx}`;
    
    // Coordenadas: X fijo (centro), Y crece hacia arriba
    nodes.push({
      id,
      value: val,
      x: 400,
      y: BaseY - (idx * NodeSpacing),
      isActive: idx === activeIndex,
      color: idx === activeIndex ? '#fbbf24' : undefined
    });

    // Conectar con el nodo de abajo (visualiza la estructura)
    if (idx > 0) {
      edges.push({
        from: `node-${idx-1}`,
        to: id,
        isDirected: true,
        color: '#475569'
      });
    }
  });

  return { nodes, edges, isDirected: true };
};

const stackInteractive: AlgorithmDefinition<StackState> = {
  id: 'stack-interactive',
  name: 'Stack',
  category: 'Data Structures',
  visualizer: 'primitive-graph',
  description: 'LIFO Structure: Last In, First Out.',

  controls: [
    { type: 'input-number', label: 'Value', id: 'val', defaultValue: 10 },
    { type: 'button', label: 'Push', id: 'push', method: 'push' },
    { type: 'button', label: 'Pop', id: 'pop', method: 'pop' },
  ],

  generateInput: () => [], // Inicia vacía

  methods: {
    push: function* (stack: StackState, value: number) {
      if (value === undefined) return;
      
      // Mutación del estado lógico
      stack.push(value);
      const newIdx = stack.length - 1;

      yield {
        data: generateGraph(stack, newIdx),
        description: `Pushed ${value} to the top.`
      };
      
      yield { data: generateGraph(stack), description: 'Ready' };
    },

    pop: function* (stack: StackState) {
      if (stack.length === 0) {
        yield { data: generateGraph(stack), description: 'Stack Underflow! (Empty)' };
        return;
      }

      const topIdx = stack.length - 1;
      const val = stack[topIdx];

      // 1. Resaltar el nodo a eliminar
      yield {
        data: generateGraph(stack, topIdx),
        description: `Popping top value: ${val}`
      };

      // 2. Eliminar lógicamente
      stack.pop();

      yield {
        data: generateGraph(stack),
        description: `Removed ${val}. New top is ${stack[stack.length - 1] ?? 'none'}`
      };
    }
  }
};

export default stackInteractive;