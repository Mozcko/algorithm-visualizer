import type { AlgorithmDefinition } from '../types';

const faultFormation: AlgorithmDefinition<number[][]> = {
  id: 'fault-formation',
  name: 'Fault Formation (Tectonics)',
  category: 'Terrain',
  visualizer: 'terrain-3d',
  description: 'Simulates geological activity by repeatedly slicing the terrain with random "fault lines". One side of the line is uplifted, and the other is depressed, eventually forming distinct mountain ranges and valleys.',

  controls: [
      { type: 'input-number', label: 'Size', id: 'size', defaultValue: 20 },
      { type: 'input-number', label: 'Iterations', id: 'iterations', defaultValue: 100 }
  ],

  generateInput: (val = 20) => {
    const n = Math.max(10, Math.min(val, 40));
    // Start with flat ground (height 50)
    return Array.from({ length: n }, () => Array(n).fill(50));
  },

  run: function* (input: number[][]) {
    let map = input.map(row => [...row]);
    const n = map.length;
    // We can infer iterations from controls or hardcode a sensible default relative to size
    const iterations = 60 + (n * 2); 

    const copyGrid = () => map.map(row => [...row]);

    // Helper: Normalize values to keep them between 0 and 100
    const normalize = () => {
        let min = Infinity, max = -Infinity;
        for(let r=0; r<n; r++) for(let c=0; c<n; c++) {
            if(map[r][c] < min) min = map[r][c];
            if(map[r][c] > max) max = map[r][c];
        }
        // Avoid divide by zero
        if (max === min) return;
        
        for(let r=0; r<n; r++) for(let c=0; c<n; c++) {
            map[r][c] = ((map[r][c] - min) / (max - min)) * 100;
        }
    };

    yield { data: copyGrid(), description: 'Starting with flat terrain...' };

    for (let i = 0; i < iterations; i++) {
        // 1. Generate a random line (Fault Line)
        // defined by two points p1 and p2
        const x1 = Math.random() * n;
        const y1 = Math.random() * n;
        const x2 = Math.random() * n;
        const y2 = Math.random() * n;

        // Vector of the line
        const dx = x2 - x1;
        const dy = y2 - y1;

        // Change height based on which side of the line a point is
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                // Cross product determines "side"
                // (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)
                const crossProduct = (c - x1) * dy - (r - y1) * dx;
                
                if (crossProduct > 0) {
                    map[r][c] += 1.5; // Uplift
                } else {
                    map[r][c] -= 1.5; // Depress
                }
            }
        }

        // Normalize every few steps to keep colors nice, or just at the end
        if (i % 10 === 0) {
             normalize();
             yield { 
                 data: copyGrid(), 
                 description: `Fault ${i}/${iterations}: Tectonic Shift` 
             };
        }
    }

    normalize();
    yield { data: copyGrid(), description: 'Simulation Complete: Tectonic Mountains' };
  }
};

export default faultFormation;