import type { AlgorithmDefinition, GraphState, GraphNode, GraphEdge } from '../types';

type QueueState = number[];

// Helper: Fila horizontal
const generateGraph = (queue: number[], activeIndices: number[] = []): GraphState => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  const StartX = 100;
  const Y = 200;
  const Spacing = 70;

  queue.forEach((val, idx) => {
    // Truco: Usamos un ID único aleatorio si quisiéramos animación real de desplazamiento,
    // pero para este demo usaremos índice para simplificar.
    const id = `q-${idx}-${val}`; 
    
    nodes.push({
      id,
      value: val,
      x: StartX + (idx * Spacing),
      y: Y,
      isActive: activeIndices.includes(idx),
      color: activeIndices.includes(idx) ? '#ef4444' : (idx === 0 ? '#22c55e' : undefined) // Verde el primero
    });

    // Flecha hacia el siguiente (indicando flujo)
    if (idx < queue.length - 1) {
      edges.push({
        from: id,
        to: `q-${idx+1}-${queue[idx+1]}`,
        isDirected: true
      });
    }
  });

  return { nodes, edges, isDirected: true };
};

const queueInteractive: AlgorithmDefinition<QueueState> = {
  id: 'queue-interactive',
  name: 'Queue',
  category: 'Data Structures',
  visualizer: 'primitive-graph',
  description: 'FIFO Structure: First In, First Out.',

  controls: [
    { type: 'input-number', label: 'Val', id: 'val', defaultValue: 5 },
    { type: 'button', label: 'Enqueue', id: 'enq', method: 'enqueue' },
    { type: 'button', label: 'Dequeue', id: 'deq', method: 'dequeue' },
  ],

  generateInput: () => [10, 20, 30], // Iniciamos con datos para que se vea bonito

  methods: {
    enqueue: function* (queue: QueueState, value: number) {
      if (value === undefined) return;
      
      queue.push(value);
      const newIdx = queue.length - 1;

      yield {
        data: generateGraph(queue, [newIdx]),
        description: `Enqueued ${value} at the rear.`
      };
      yield { data: generateGraph(queue), description: 'Ready' };
    },

    dequeue: function* (queue: QueueState) {
      if (queue.length === 0) {
        yield { data: generateGraph(queue), description: 'Queue Underflow!' };
        return;
      }

      const val = queue[0];

      // 1. Marcar el primero (Front)
      yield {
        data: generateGraph(queue, [0]),
        description: `Dequeuing front value: ${val}`
      };

      // 2. Eliminar (Shift)
      queue.shift();

      yield {
        data: generateGraph(queue),
        description: `Removed ${val}. Elements shifted.`
      };
    }
  }
};

export default queueInteractive;