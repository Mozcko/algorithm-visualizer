// src/algorithms/structures/bstInteractive.ts
import type { AlgorithmDefinition, GraphState, GraphNode, GraphEdge, SimulationStep } from '../types';

// Estado Lógico Interno
class BSTNode {
  value: number;
  left: BSTNode | null = null;
  right: BSTNode | null = null;
  id: string;
  x: number = 0;
  y: number = 0;

  constructor(value: number) {
    this.value = value;
    this.id = `node-${value}-${Math.random().toString(36).substr(2, 5)}`;
  }
}

// Profundidad máxima: niveles más profundos se saldrían del canvas (viewBox 800x400)
// o se encimarían (el offset horizontal se divide a la mitad en cada nivel)
const MAX_DEPTH = 4;

// Helper: Lógico -> Visual
const generateGraph = (root: BSTNode | null, activeIds: string[] = []): GraphState => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  if (!root) return { nodes: [], edges: [], isDirected: true };

  const traverse = (node: BSTNode, x: number, y: number, offset: number) => {
    // Nota: No mutamos el nodo lógico real con coordenadas visuales en un escenario puro,
    // pero para este demo es aceptable.
    nodes.push({
      id: node.id,
      value: node.value,
      x: x,
      y: y,
      isActive: activeIds.includes(node.id),
      color: activeIds.includes(node.id) ? '#fbbf24' : undefined
    });

    if (node.left) {
      edges.push({ from: node.id, to: node.left.id });
      traverse(node.left, x - offset, y + 60, offset / 2);
    }
    if (node.right) {
      edges.push({ from: node.id, to: node.right.id });
      traverse(node.right, x + offset, y + 60, offset / 2);
    }
  };

  traverse(root, 400, 50, 190);
  return { nodes, edges, isDirected: true };
};

// --- DEFINICIÓN CON TIPADO STRICTO ---
// T es "BSTNode | null".
const bstInteractive: AlgorithmDefinition<BSTNode | null> = {
  id: 'bst-interactive',
  name: 'Binary Search Tree',
  category: 'Data Structures',
  visualizer: 'primitive-graph',
  description: 'Construct a BST by inserting nodes manually.',
  
  controls: [
    { type: 'input-number', label: 'Value', id: 'value', defaultValue: 50 },
    { type: 'button', label: 'Insert', id: 'btn-insert', method: 'insert' },
  ],

  generateInput: () => null,

  visualize: (root) => generateGraph(root),

  methods: {
    // Definimos explícitamente el tipo de retorno del generador para cumplir con la interfaz
    insert: function* (root: BSTNode | null, value: number): Generator<SimulationStep<BSTNode | null>, void, unknown> {
      
      if (value === undefined || value === null) return;
      const newNode = new BSTNode(value);

      // CASO 1: Árbol Vacío
      if (!root) {
        // El hook 'useAlgorithmRunner' ignora los GraphState al actualizar el estado lógico,
        // así que para pasar de null a un árbol debemos emitir el OBJETO real (T) una vez.
        // Va primero para que el último paso (el que queda en pantalla) sea el dibujo.
        yield {
             data: newNode,
             description: 'State Initialized'
        };
        yield { 
            data: generateGraph(newNode, [newNode.id]), 
            description: `Tree empty. ${value} becomes Root.` 
        };
        yield { data: generateGraph(newNode), description: 'Ready' };
        return;
      }

      // CASO 2: Inserción Normal
      let current = root;
      let depth = 0;
      
      while (true) {
        yield { 
            data: generateGraph(root, [current.id]), 
            description: `Comparing ${value} vs ${current.value}` 
        };

        const next = value < current.value ? current.left : current.right;
        if (!next && depth + 1 > MAX_DEPTH) {
            yield { data: generateGraph(root), description: `Max depth (${MAX_DEPTH}) reached. ${value} not inserted.` };
            return;
        }

        if (value < current.value) {
            if (!current.left) {
                current.left = newNode; // Mutación
                yield { data: generateGraph(root, [newNode.id]), description: 'Inserted Left' };
                break;
            }
            current = current.left;
            depth++;
        } else {
             if (!current.right) {
                current.right = newNode; // Mutación
                yield { data: generateGraph(root, [newNode.id]), description: 'Inserted Right' };
                break;
            }
            current = current.right;
            depth++;
        }
      }
      
      // Yield final para asegurar limpieza visual
      yield { data: generateGraph(root), description: 'Ready' };
    }
  }
};

export default bstInteractive;