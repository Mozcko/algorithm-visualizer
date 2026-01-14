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

const dfs: AlgorithmDefinition<GridState> = {
  id: 'dfs',
  name: 'Depth-First Search',
  category: 'Pathfinding',
  visualizer: 'grid-2d',
  description: 'Explores as far as possible along each branch before backtracking. It does not guarantee the shortest path.',

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
    
    // Stack for DFS
    const stack: GridNode[] = [startNode];
    
    startNode.distance = 0;

    yield { data: deepCopyGrid(grid), description: 'Starting DFS' };

    let found = false;

    while (stack.length > 0) {
      const currentNode = stack.pop()!;

      if (!currentNode.isVisited) {
        currentNode.isVisited = true;
        
        yield { 
            data: deepCopyGrid(grid), 
            activeNode: `${currentNode.row}-${currentNode.col}`,
            description: `Visiting [${currentNode.row}, ${currentNode.col}]` 
        };

        if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
            found = true;
            yield { data: deepCopyGrid(grid), description: 'Target found!' };
            break;
        }

        const neighbors = getNeighbors(currentNode, grid);
        
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited && !neighbor.isWall) {
                neighbor.previousNode = { row: currentNode.row, col: currentNode.col };
                stack.push(neighbor);
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
      yield { data: deepCopyGrid(grid), description: 'Path Found!' };
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

  if (row > 0) neighbors.push(grid[row - 1][col]); // Up
  if (col < numCols - 1) neighbors.push(grid[row][col + 1]); // Right
  if (row < numRows - 1) neighbors.push(grid[row + 1][col]); // Down
  if (col > 0) neighbors.push(grid[row][col - 1]); // Left

  return neighbors;
}

function deepCopyGrid(grid: GridState): GridState {
  return grid.map(row => row.map(node => ({ ...node })));
}

export default dfs;