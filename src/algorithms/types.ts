// src/algorithms/types.ts

// Actualizamos las categorías a Inglés
export type AlgorithmCategory = 'Sorting' | 'Pathfinding' | 'Data Structures' | 'Backtracking';
export type VisualizerType = 'bar-chart' | 'grid-2d' | 'terrain-3d';

export interface SimulationStep<T> {
  data: T;
  highlightedIndices?: number[];
  activeNode?: string | number;
  description?: string;
}

export interface AlgorithmDefinition<T = any> {
  id: string;
  name: string;
  category: AlgorithmCategory; // <--- Ahora usará los tipos en inglés
  visualizer: VisualizerType;
  description: string;
  run: (input: T) => Generator<SimulationStep<T>, void, unknown>;
  generateInput: (size?: number) => T;
}