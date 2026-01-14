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
      traverse(node.left, x - offset, y + 60, offset / 1.6);
    }
    if (node.right) {
      edges.push({ from: node.id, to: node.right.id });
      traverse(node.right, x + offset, y + 60, offset / 1.6);
    }
  };

  traverse(root, 400, 50, 180);
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

  methods: {
    // Definimos explícitamente el tipo de retorno del generador para cumplir con la interfaz
    insert: function* (root: BSTNode | null, value: number): Generator<SimulationStep<BSTNode | null>, void, unknown> {
      
      if (value === undefined || value === null) return;
      const newNode = new BSTNode(value);

      // CASO 1: Árbol Vacío
      if (!root) {
        // Truco: TypeScript espera que 'data' sea BSTNode | null | VisualState.
        // Aquí devolvemos el estado visual del nuevo nodo.
        yield { 
            data: generateGraph(newNode, [newNode.id]), 
            description: `Tree empty. ${value} becomes Root.` 
        };
        // Y aquí actualizamos el estado lógico retornando el objeto real en el último paso (opcional, pero buena práctica)
        // Ojo: En el hook 'useAlgorithmRunner', el último yield.data se convierte en el nuevo estado.
        // Como 'generateGraph' devuelve GraphState y nuestro estado es BSTNode, tenemos un conflicto lógico en el hook.
        
        // CORRECCIÓN CRÍTICA DE LÓGICA + TIPOS:
        // El hook usa 'data' para actualizar 'logicalStateRef'.
        // Si devolvemos GraphState, corrompemos el estado lógico.
        // SOLUCIÓN: El hook debe diferenciar visualización de estado lógico.
        // PERO para no reescribir el hook complejo ahora: 
        // Vamos a asumir que el algoritmo muta el objeto 'root' por referencia (lo cual hace).
        // Y para el caso inicial (null -> objeto), necesitamos devolver el OBJETO real al menos una vez.
        
        yield {
             data: newNode, // Aquí devolvemos el T (BSTNode) para inicializar el estado
             description: 'State Initialized'
        };
        return;
      }

      // CASO 2: Inserción Normal
      let current = root;
      
      while (true) {
        yield { 
            data: generateGraph(root, [current.id]), 
            description: `Comparing ${value} vs ${current.value}` 
        };

        if (value < current.value) {
            if (!current.left) {
                current.left = newNode; // Mutación
                yield { data: generateGraph(root, [newNode.id]), description: 'Inserted Left' };
                break;
            }
            current = current.left;
        } else {
             if (!current.right) {
                current.right = newNode; // Mutación
                yield { data: generateGraph(root, [newNode.id]), description: 'Inserted Right' };
                break;
            }
            current = current.right;
        }
      }
      
      // Yield final para asegurar limpieza visual
      yield { data: generateGraph(root), description: 'Ready' };
    }
  }
};

export default bstInteractive;