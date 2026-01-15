import type { AlgorithmDefinition } from '../types';

const diamondSquare: AlgorithmDefinition<number[][]> = {
  id: 'diamond-square',
  name: 'Diamond-Square Terrain',
  category: 'Terrain',
  visualizer: 'terrain-3d',
  description: 'A fractal algorithm used to generate realistic heightmaps for computer graphics. It works by recursively dividing a square into four smaller squares, adding random roughness at each step.',

  controls: [
      // Powers of 2 + 1 (5, 9, 17, 33)
      // 5 = 2^2 + 1
      // 9 = 2^3 + 1
      // 17 = 2^4 + 1
      { type: 'input-number', label: 'Size (Power of 2 + 1)', id: 'size', defaultValue: 17 }
  ],

  generateInput: (val = 17) => {
    // Force size to be 2^n + 1 (Standard for Diamond Square)
    // Common sizes: 5, 9, 17, 33
    const validSizes = [5, 9, 17, 33];
    const n = validSizes.find(s => s >= val) || 33;

    // Initialize n x n grid with zeros
    return Array.from({ length: n }, () => Array(n).fill(0));
  },

  run: function* (input: number[][]) {
    // Deep copy helper
    const getGrid = () => map.map(row => [...row]);

    let map = input.map(row => [...row]);
    const n = map.length;
    
    // 1. Initialize Corners
    // We give them random high/low values to start the "continents"
    map[0][0] = Math.random() * 50 + 20;
    map[0][n-1] = Math.random() * 50 + 20;
    map[n-1][0] = Math.random() * 50 + 20;
    map[n-1][n-1] = Math.random() * 50 + 20;

    yield { data: getGrid(), description: 'Step 1: Initialize Corners' };

    let chunkSize = n - 1;
    let roughness = 40; // How "bumpy" the terrain is

    // Main Loop: Reduce chunk size by half each time
    while (chunkSize > 1) {
        const half = chunkSize / 2;

        // --- DIAMOND STEP ---
        // (Find the center of the square)
        for (let y = 0; y < n - 1; y += chunkSize) {
            for (let x = 0; x < n - 1; x += chunkSize) {
                // Average of 4 corners
                const tl = map[y][x];
                const tr = map[y][x + chunkSize];
                const bl = map[y + chunkSize][x];
                const br = map[y + chunkSize][x + chunkSize];

                const avg = (tl + tr + bl + br) / 4;
                // Add random jitter
                const jitter = (Math.random() - 0.5) * roughness;
                
                map[y + half][x + half] = Math.max(0, Math.min(100, avg + jitter));
            }
        }

        yield { 
            data: getGrid(), 
            description: `Diamond Step: Calculated centers (Roughness: ${roughness.toFixed(1)})` 
        };

        // --- SQUARE STEP ---
        // (Find the midpoints of the edges)
        for (let y = 0; y < n; y += half) {
            // Determines if this row requires offset (Diamond pattern grid logic)
            // If y is a "half" row (1, 3, 5...), x starts at 0.
            // If y is a "chunk" row (0, 2, 4...), x starts at half.
            const rowShift = (y % chunkSize === 0) ? half : 0;

            for (let x = rowShift; x < n; x += chunkSize) {
                // Sum valid neighbors (Top, Right, Bottom, Left)
                let sum = 0;
                let count = 0;

                // Check bounds for wrap-around or edge handling
                if (y - half >= 0) { sum += map[y - half][x]; count++; }
                if (y + half < n)  { sum += map[y + half][x]; count++; }
                if (x - half >= 0) { sum += map[y][x - half]; count++; }
                if (x + half < n)  { sum += map[y][x + half]; count++; }

                const avg = sum / count;
                const jitter = (Math.random() - 0.5) * roughness;

                map[y][x] = Math.max(0, Math.min(100, avg + jitter));
            }
        }

        yield { 
            data: getGrid(), 
            description: `Square Step: Filled edges (Chunk size: ${chunkSize} -> ${half})` 
        };

        // Reduce randomness for next layer (makes smaller details less jagged)
        roughness /= 2;
        chunkSize /= 2;
    }

    yield { data: getGrid(), description: 'Terrain Generation Complete!' };
  }
};

export default diamondSquare;