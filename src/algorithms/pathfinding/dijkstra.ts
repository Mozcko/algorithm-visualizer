import type { AlgorithmDefinition, GridNode, GridState } from '../types';

const ROWS = 10;
const COLS = 20;

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

const dijkstra: AlgorithmDefinition<GridState> = {
  id: 'dijkstra',
  name: 'Dijkstra Algorithm',
  category: 'Pathfinding',
  visualizer: 'grid-2d',
  description: 'Guarantees the shortest path. It visits nodes in order of their distance from the start node.',

  generateInput: () => {
    const grid: GridState = [];
    for (let r = 0; r < ROWS; r++) {
      const row: GridNode[] = [];
      for (let c = 0; c < COLS; c++) {
        const node = createNode(r, c);
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
    let grid = initialGrid.map(row => row.map(node => ({ 
      ...node,
      distance: Infinity,
      isVisited: false,
      isPath: false,
      previousNode: null
    })));
    
    let startNode = grid[1][1];
    let endNode = grid[8][18];
    
    const unvisitedNodes: GridNode[] = [];
    for (const row of grid) {
        for (const node of row) {
            if (node.isStart) startNode = node;
            if (node.isEnd) endNode = node;
            unvisitedNodes.push(node);
        }
    }

    startNode.distance = 0;

    yield { data: deepCopyGrid(grid), description: 'Starting Dijkstra' };

    let found = false;

    while (unvisitedNodes.length > 0) {
      // Sort by distance (simulate priority queue)
      unvisitedNodes.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
      
      const closestNode = unvisitedNodes.shift()!;

      // If closest node is at infinity, we are trapped
      if (closestNode.distance === Infinity) break;
      
      // If wall, skip
      if (closestNode.isWall) continue;

      closestNode.isVisited = true;
      
      yield { 
        data: deepCopyGrid(grid), 
        activeNode: `${closestNode.row}-${closestNode.col}`,
        description: `Visiting [${closestNode.row}, ${closestNode.col}] (Dist: ${closestNode.distance})` 
      };

      if (closestNode.row === endNode.row && closestNode.col === endNode.col) {
        found = true;
        yield { data: deepCopyGrid(grid), description: 'Target found!' };
        break;
      }

      const neighbors = getNeighbors(closestNode, grid);
      for (const neighbor of neighbors) {
          if (!neighbor.isVisited && !neighbor.isWall) {
              const newDist = (closestNode.distance || 0) + 1;
              if (newDist < (neighbor.distance || Infinity)) {
                  neighbor.distance = newDist;
                  neighbor.previousNode = { row: closestNode.row, col: closestNode.col };
              }
          }
      }
    }

    if (found) {
      let current = grid[endNode.row][endNode.col];
      while (current.previousNode) {
        current.isPath = true;
        const prevCoords = current.previousNode;
        current = grid[prevCoords.row][prevCoords.col];
        yield { data: deepCopyGrid(grid), description: 'Reconstructing shortest path...' };
      }
      grid[startNode.row][startNode.col].isPath = true;
      yield { data: deepCopyGrid(grid), description: 'Shortest Path Found!' };
    } else {
      yield { data: deepCopyGrid(grid), description: 'No path found.' };
    }
  }
};

function getNeighbors(node: GridNode, grid: GridState): GridNode[] {
  const neighbors: GridNode[] = [];
  const { row, col } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < numRows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < numCols - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

function deepCopyGrid(grid: GridState): GridState {
  return grid.map(row => row.map(node => ({ ...node })));
}

export default dijkstra;