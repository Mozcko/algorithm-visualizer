import type { AlgorithmDefinition } from '../types';

const mazeGenerator: AlgorithmDefinition<number[][]> = {
  id: 'maze-generator',
  name: 'Maze Generator (Backtracker)',
  category: 'Terrain',
  visualizer: 'terrain-3d',
  description: 'Generates a perfect maze using the Recursive Backtracker algorithm. Think of it as a "miner" digging tunnels: it moves to a random unvisited neighbor, carving a path, and backtracks when stuck to find new routes.',

  controls: [
      { type: 'input-number', label: 'Size (Odd Number)', id: 'size', defaultValue: 21 }
  ],

  generateInput: (val = 21) => {
    // Maze algorithms work best on odd-sized grids to allow for walls between cells
    let n = Math.max(11, Math.min(val, 45));
    if (n % 2 === 0) n++; // Force odd number

    // Start with a solid block of walls (100)
    return Array.from({ length: n }, () => Array(n).fill(100));
  },

  run: function* (input: number[][]) {
    let map = input.map(row => [...row]);
    const n = map.length;
    
    // Directions: Up, Right, Down, Left (jumping 2 cells)
    const directions = [
        { r: -2, c: 0 },
        { r: 0, c: 2 },
        { r: 2, c: 0 },
        { r: 0, c: -2 }
    ];

    const copyGrid = () => map.map(row => [...row]);

    // Stack for backtracking
    const stack: {r: number, c: number}[] = [];
    
    // Start at (1,1) so we have a border wall
    const start = { r: 1, c: 1 };
    map[start.r][start.c] = 0; // Clear start
    stack.push(start);

    yield { data: copyGrid(), description: 'Starting the Miner at (1,1)' };

    while (stack.length > 0) {
        const current = stack[stack.length - 1]; // Peek
        const { r, c } = current;

        // Visual: Mark current "Miner" head with Green (50)
        // We restore it to 0 (Floor) when we move away
        map[r][c] = 50; 
        
        // Find valid neighbors (unvisited and within bounds)
        const validNeighbors: {r: number, c: number, dr: number, dc: number}[] = [];

        for (const dir of directions) {
            const nr = r + dir.r;
            const nc = c + dir.c;

            // Check bounds (leaving 1 cell border)
            if (nr > 0 && nr < n - 1 && nc > 0 && nc < n - 1) {
                // If the target cell is still a Wall (100), it's unvisited
                if (map[nr][nc] === 100) {
                    validNeighbors.push({ r: nr, c: nc, dr: dir.r, dc: dir.c });
                }
            }
        }

        if (validNeighbors.length > 0) {
            // 1. Choose random neighbor
            const next = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
            
            // 2. Remove wall BETWEEN current and next
            // (The wall is at the midpoint)
            map[r + next.dr / 2][c + next.dc / 2] = 0;
            
            // 3. Move to neighbor (mark as floor 0 temporarily, will be green next loop)
            map[next.r][next.c] = 0;
            
            // 4. Push to stack
            stack.push({ r: next.r, c: next.c });

            // Visual update
            map[r][c] = 0; // Old head becomes floor
            map[next.r][next.c] = 50; // New head is Green
            
            yield { 
                data: copyGrid(), 
                description: `Carving path to [${next.r}, ${next.c}]` 
            };

        } else {
            // Dead end! Backtrack.
            map[r][c] = 0; // Ensure current is floor
            stack.pop();
            
            // Highlight the backtrack
            if (stack.length > 0) {
                const prev = stack[stack.length - 1];
                map[prev.r][prev.c] = 30; // Mark backtracking path as Yellow temporarily
                
                yield { 
                    data: copyGrid(), 
                    description: 'Dead end. Backtracking...' 
                };
                
                map[prev.r][prev.c] = 0; // Restore
            }
        }
    }

    yield { data: copyGrid(), description: 'Maze Generation Complete!' };
  }
};

export default mazeGenerator;