import type { AlgorithmDefinition } from '../types';

const cellularCaves: AlgorithmDefinition<number[][]> = {
  id: 'cellular-caves',
  name: 'Cellular Automata (Caves)',
  category: 'Terrain',
  visualizer: 'terrain-3d',
  description: 'Generates cave-like structures using Cellular Automata (similar to Conway\'s Game of Life). It starts with random noise and iteratively smooths it out to form open caverns and solid walls.',

  controls: [
      { type: 'input-number', label: 'Size', id: 'size', defaultValue: 30 }
  ],

  generateInput: (val = 30) => {
    const n = Math.max(10, Math.min(val, 40));
    // Start with random noise: ~45% chance to be a wall
    return Array.from({ length: n }, () => 
        Array.from({ length: n }, () => Math.random() < 0.45 ? 100 : 0)
    );
  },

  run: function* (input: number[][]) {
    let map = input.map(row => [...row]);
    const n = map.length;
    const steps = 10; // 5 to 10 smoothing steps is usually enough

    const copyGrid = () => map.map(row => [...row]);
    
    // Helper to count walls around a cell (3x3 grid)
    const countWalls = (grid: number[][], r: number, c: number) => {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue; // Skip self
                
                const nr = r + i;
                const nc = c + j;
                
                // Edges are considered walls (closed cave)
                if (nr < 0 || nr >= n || nc < 0 || nc >= n) {
                    count++;
                } else if (grid[nr][nc] > 50) { // If value is high, it's a wall
                    count++;
                }
            }
        }
        return count;
    };

    yield { data: copyGrid(), description: 'Initial Random Noise' };

    for (let s = 0; s < steps; s++) {
        // Create new buffer for this step
        const nextMap = map.map(row => [...row]);

        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const walls = countWalls(map, r, c);

                // THE RULES:
                // 1. If more than 4 neighbors are walls -> become a wall
                // 2. If less than 4 -> become floor
                if (walls > 4) {
                    nextMap[r][c] = 100; // Wall
                } else if (walls < 4) {
                    nextMap[r][c] = 0;   // Floor
                }
                // If exactly 4, stay same (do nothing)
            }
        }

        map = nextMap;
        yield { 
            data: copyGrid(), 
            description: `Step ${s+1}/${steps}: Smoothing Walls` 
        };
    }

    yield { data: copyGrid(), description: 'Cave Generation Complete' };
  }
};

export default cellularCaves;