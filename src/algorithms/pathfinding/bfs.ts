// src/algorithms/pathfinding/bfs.ts
import type { AlgorithmDefinition } from '../types';

const bfs: AlgorithmDefinition<any> = {
  id: 'bfs',
  name: 'Breadth-First Search',
  category: 'Pathfinding',
  visualizer: 'grid-2d', // <--- Esto activará el mensaje "Visualizador no implementado" en React
  description: 'An algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
  
  generateInput: () => [],
  run: function* () {
    yield { data: [], description: 'Not implemented yet' };
  }
};

export default bfs;