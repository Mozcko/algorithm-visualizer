// src/algorithms/types.ts

export type AlgorithmCategory = 'Sorting' | 'Pathfinding' | 'Data Structures' | 'Backtracking';
export type VisualizerType = 'bar-chart' | 'grid-2d' | 'terrain-3d' | 'primitive-graph';

// --- DEFINICIONES VISUALES ---

// Pathfinding (Grid)
export interface GridNode {
  row: number;
  col: number;
  // Propiedades Pathfinding (Legacy)
  isStart?: boolean;
  isEnd?: boolean;
  isWall?: boolean;
  isVisited?: boolean;
  isPath?: boolean;
  distance?: number;
  previousNode?: { row: number, col: number } | null;
  
  // NUEVAS PROPIEDADES GENÉRICAS (Para Backtracking/Tableros)
  value?: string | number; // Para mostrar texto (ej: "♛" o "5")
  customBg?: string;       // Para forzar un color de fondo (ej: "#ef4444")
  isValid?: boolean;       // Para indicar una posición confirmada
}

export type GridState = GridNode[][];
// Estructuras de Datos (Grafos/Árboles)
export interface GraphNode {
  id: string;
  value: string | number;
  x: number;
  y: number;
  color?: string;
  isActive?: boolean;
}
export interface GraphEdge {
  from: string;
  to: string;
  color?: string;
  isDirected?: boolean;
}
export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected?: boolean;
}

// --- CORE DEL SISTEMA ---

// SOLUCIÓN STRICTA:
// Definimos que 'data' puede ser el tipo genérico T (lógico) O una representación visual.
// Esto permite que un algoritmo <BSTNode> emita pasos visuales <GraphState> legalmente.
export type VisualState = GraphState | GridState;

export interface SimulationStep<T> {
  data: T | VisualState; 
  highlightedIndices?: number[];
  activeNode?: string | number;
  description?: string;
}

export interface AlgorithmControl {
  type: 'button' | 'input-number';
  label: string;
  id: string;
  method?: string;
  defaultValue?: number;
}

// Interfaz Maestra (Unificada y Limpia)
export interface AlgorithmDefinition<T = unknown> {
  id: string;
  name: string;
  category: AlgorithmCategory;
  visualizer: VisualizerType;
  description: string;
  
  controls?: AlgorithmControl[];

  // Métodos interactivos
  methods?: {
    [key: string]: (currentState: T, ...args: any[]) => Generator<SimulationStep<T>, void, unknown>;
  };

  // Método automático
  run?: (input: T) => Generator<SimulationStep<T>, void, unknown>;
  
  generateInput: (size?: number) => T;
}