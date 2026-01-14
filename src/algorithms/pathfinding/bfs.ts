// src/algorithms/pathfinding/bfs.ts
import type { AlgorithmDefinition, GridNode, GridState } from '../types';

// Configuración de la grilla
const ROWS = 10;
const COLS = 20;

// Ayuda para crear nodos vacíos
const createNode = (row: number, col: number): GridNode => ({
  row, col,
  isStart: row === 1 && col === 1,
  isEnd: row === 8 && col === 18,
  isWall: false,
  isVisited: false,
  isPath: false,
  distance: Infinity,
  previousNode: null,
});

const bfs: AlgorithmDefinition<GridState> = {
  id: 'bfs',
  name: 'Breadth-First Search',
  category: 'Pathfinding',
  visualizer: 'grid-2d',
  description: 'Explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. Guarantees the shortest path in unweighted grids.',

  // Generamos una grilla inicial con algunas paredes aleatorias
  generateInput: () => {
    const grid: GridState = [];
    for (let r = 0; r < ROWS; r++) {
      const row: GridNode[] = [];
      for (let c = 0; c < COLS; c++) {
        const node = createNode(r, c);
        // Agregar muros aleatorios (evitando inicio y fin)
        if (Math.random() < 0.2 && !node.isStart && !node.isEnd) {
          node.isWall = true;
        }
        row.push(node);
      }
      grid.push(row);
    }
    return grid;
  },

  run: function* (initialGrid: GridState) {
    // Clonamos la grilla para no mutar la referencia original directamente en React
    // Nota: Para ser puristas deberíamos hacer Deep Copy, pero por rendimiento en demos simples esto suele bastar si tenemos cuidado.
    // Haremos una copia "profunda ligera" para la visualización.
    let grid = initialGrid.map(row => row.map(node => ({ ...node })));
    
    const startNode = grid[1][1];
    const endNode = grid[8][18];
    const queue: GridNode[] = [startNode];
    
    startNode.isVisited = true;
    startNode.distance = 0;

    yield { data: deepCopyGrid(grid), description: 'Starting BFS from Green Node' };

    let found = false;

    // --- BUCLE PRINCIPAL DE BFS ---
    while (queue.length > 0) {
      const currentNode = queue.shift()!;

      // Si llegamos al final
      if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
        found = true;
        yield { data: deepCopyGrid(grid), description: 'Target found!' };
        break;
      }

      // Explorar vecinos (Arriba, Derecha, Abajo, Izquierda)
      const neighbors = getNeighbors(currentNode, grid);
      
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited && !neighbor.isWall) {
          neighbor.isVisited = true;
          neighbor.previousNode = { row: currentNode.row, col: currentNode.col };
          neighbor.distance = currentNode.distance + 1;
          queue.push(neighbor);
          
          // Visualizar que estamos visitando este nodo
          yield { 
            data: deepCopyGrid(grid), 
            activeNode: `${neighbor.row}-${neighbor.col}`,
            description: `Visiting [${neighbor.row}, ${neighbor.col}]` 
          };
        }
      }
    }

    // --- RECONSTRUIR EL CAMINO (Backtracking) ---
    if (found) {
      let current = grid[endNode.row][endNode.col];
      while (current.previousNode) {
        current.isPath = true;
        const prevCoords = current.previousNode;
        current = grid[prevCoords.row][prevCoords.col];
        
        yield { 
            data: deepCopyGrid(grid), 
            description: 'Reconstructing path...' 
        };
      }
      // Marcar el inicio también como parte del camino visual
      grid[startNode.row][startNode.col].isPath = true;
      
      yield { data: deepCopyGrid(grid), description: 'Shortest Path Found!' };
    } else {
      yield { data: deepCopyGrid(grid), description: 'No path found :(' };
    }
  }
};

// --- Helpers ---

function getNeighbors(node: GridNode, grid: GridState): GridNode[] {
  const neighbors: GridNode[] = [];
  const { row, col } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;

  if (row > 0) neighbors.push(grid[row - 1][col]); // Arriba
  if (row < numRows - 1) neighbors.push(grid[row + 1][col]); // Abajo
  if (col > 0) neighbors.push(grid[row][col - 1]); // Izquierda
  if (col < numCols - 1) neighbors.push(grid[row][col + 1]); // Derecha

  return neighbors;
}

// Función auxiliar para copiar la grilla y que React detecte cambios
function deepCopyGrid(grid: GridState): GridState {
  return grid.map(row => row.map(node => ({ ...node })));
}

export default bfs;