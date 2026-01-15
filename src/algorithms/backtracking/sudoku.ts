import type { AlgorithmDefinition, GridState } from '../types';

const sudokuSolver: AlgorithmDefinition<GridState> = {
  id: 'sudoku-solver',
  name: 'Sudoku Solver',
  category: 'Backtracking',
  visualizer: 'grid-2d',
  description: 'Solves a randomly generated Sudoku puzzle.',

  // 1. COMPLEX GENERATOR
  generateInput: () => {
    // A. Initialize Empty 9x9
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));

    // B. Fill Diagonal 3x3 Boxes (They are independent of each other)
    // Box 0 (0,0), Box 4 (3,3), Box 8 (6,6)
    for (let i = 0; i < 9; i = i + 3) {
        fillBox(board, i, i);
    }

    // C. Solve the rest to get a complete valid board
    solveSudokuHelper(board);

    // D. Remove K digits to make it a puzzle (e.g., remove 40 digits)
    const attempts = 40;
    for(let i=0; i<attempts; i++) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        board[r][c] = 0;
    }

    // E. Convert to GridState
    return board.map((rowVals, r) => 
      rowVals.map((val, c) => ({
        row: r, col: c,
        value: val === 0 ? '' : val,
        customBg: val !== 0 ? '#334155' : '#0f172a', // Grey for fixed, Dark for empty
        isWall: val !== 0 
      }))
    );
  },

  run: function* (grid: GridState) {
    // ... (Use the same run function code provided in the previous answer) ...
    // NOTE: The run logic doesn't change, only the input generation!
    
    // Copy/paste the run function from the previous Sudoku response here.
    // Let me know if you need me to paste it again!
    const n = 9;
    const copyGrid = (g: GridState) => g.map(row => row.map(node => ({ ...node })));

    function isValid(grid: GridState, row: number, col: number, num: number) {
        const val = num;
        for (let c = 0; c < 9; c++) if (c !== col && grid[row][c].value === val) return false;
        for (let r = 0; r < 9; r++) if (r !== row && grid[r][col].value === val) return false;
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if ((startRow + r !== row || startCol + c !== col) && grid[startRow + r][startCol + c].value === val) return false;
            }
        }
        return true;
    }

    function* solve(): Generator<any, boolean, any> {
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          if (grid[row][col].isWall || grid[row][col].value !== '') continue;

          for (let num = 1; num <= 9; num++) {
            grid[row][col].value = num;
            grid[row][col].customBg = '#fbbf24'; 
            yield { data: copyGrid(grid), description: `Trying ${num}...` };

            if (isValid(grid, row, col, num)) {
              grid[row][col].customBg = '#22c55e';
              yield { data: copyGrid(grid), description: `Valid placement` };
              if (yield* solve()) return true;
              grid[row][col].customBg = '#ef4444'; 
              yield { data: copyGrid(grid), description: `Backtracking...` };
              grid[row][col].value = ''; 
              grid[row][col].customBg = '#0f172a'; 
            } else {
              grid[row][col].customBg = '#ef4444'; 
              yield { data: copyGrid(grid) };
              grid[row][col].value = ''; 
              grid[row][col].customBg = '#0f172a';
            }
          }
          return false;
        }
      }
      return true;
    }
    yield* solve();
    yield { data: copyGrid(grid), description: 'Solved!' };
  }
};

// --- HELPER FUNCTIONS FOR GENERATION ---
function fillBox(board: number[][], rowStart: number, colStart: number) {
    let num: number;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = Math.floor(Math.random() * 9) + 1;
            } while (!isSafeInBox(board, rowStart, colStart, num));
            board[rowStart + i][colStart + j] = num;
        }
    }
}
function isSafeInBox(board: number[][], rowStart: number, colStart: number, num: number) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[rowStart + i][colStart + j] === num) return false;
        }
    }
    return true;
}
function solveSudokuHelper(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafeHelper(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudokuHelper(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}
function isSafeHelper(board: number[][], row: number, col: number, num: number) {
    for (let x = 0; x < 9; x++) if (board[row][x] === num || board[x][col] === num) return false;
    let startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (board[i + startRow][j + startCol] === num) return false;
    return true;
}

export default sudokuSolver;