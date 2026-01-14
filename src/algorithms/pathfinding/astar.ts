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
  distance: Infinity, // This will act as gScore
  previousNode: null,
});

const astar: AlgorithmDefinition<GridState> = {
  id: 'astar',
  name: 'A* Search',
  category: 'Pathfinding',
  visualizer: 'grid-2d',
  description: 'A smart pathfinding algorithm that uses a heuristic to estimate the distance to the goal. It is generally faster than Dijkstra.',

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

    for (const row of grid) {
      for (const node of row) {
        if (node.isStart) startNode = node;
        if (node.isEnd) endNode = node;
      }
    }
    
    // gScore is stored in node.distance
    startNode.distance = 0;
    
    // fScore map: key "row-col" -> value
    const fScore = new Map<string, number>();
    const getF = (n: GridNode) => fScore.get(`${n.row}-${n.col}`) ?? Infinity;
    
    // Initial fScore = heuristic
    fScore.set(`${startNode.row}-${startNode.col}`, heuristic(startNode, endNode));

    const openSet: GridNode[] = [startNode];

    yield { data: deepCopyGrid(grid), description: 'Starting A*' };

    let found = false;

    while (openSet.length > 0) {
      // Get node with lowest fScore
      openSet.sort((a, b) => getF(a) - getF(b));
      const current = openSet.shift()!;

      // If we reached the end
      if (current.row === endNode.row && current.col === endNode.col) {
        found = true;
        yield { data: deepCopyGrid(grid), description: 'Target found!' };
        break;
      }

      current.isVisited = true;
      
      yield { 
        data: deepCopyGrid(grid), 
        activeNode: `${current.row}-${current.col}`,
        description: `Visiting [${current.row}, ${current.col}] (F: ${getF(current)})` 
      };

      const neighbors = getNeighbors(current, grid);
      
      for (const neighbor of neighbors) {
        if (neighbor.isWall || neighbor.isVisited) continue;

        const tentativeG = (current.distance || 0) + 1;

        // If path is better than previous one
        if (tentativeG < (neighbor.distance || Infinity)) {
          neighbor.previousNode = { row: current.row, col: current.col };
          neighbor.distance = tentativeG;
          
          const f = tentativeG + heuristic(neighbor, endNode);
          fScore.set(`${neighbor.row}-${neighbor.col}`, f);

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
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
        yield { data: deepCopyGrid(grid), description: 'Reconstructing path...' };
      }
      grid[startNode.row][startNode.col].isPath = true;
      yield { data: deepCopyGrid(grid), description: 'Shortest Path Found!' };
    } else {
      yield { data: deepCopyGrid(grid), description: 'No path found.' };
    }
  }
};

// Manhattan distance heuristic
function heuristic(a: GridNode, b: GridNode): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

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

export default astar;