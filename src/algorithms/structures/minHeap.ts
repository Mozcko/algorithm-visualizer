import type { AlgorithmDefinition, GraphState, GraphNode, GraphEdge } from '../types';

const minHeap: AlgorithmDefinition<GraphState> = {
  id: 'min-heap',
  name: 'Binary Min-Heap',
  category: 'Data Structures',
  visualizer: 'primitive-graph',
  description: 'A Binary Heap is a complete binary tree where the parent is always smaller than its children (Min-Heap). It is efficiently stored as an array but visualized as a tree. Watch how elements "bubble up" or "sift down" to maintain the order.',

  controls: [
    { type: 'input-number', label: 'Elements', id: 'size', defaultValue: 12 }
  ],

  generateInput: (val = 12) => {
    // Just return a random array for now, we build the graph in 'run'
    const n = Math.max(Math.min(val, 31), 5); // Limit to 31 nodes (5 levels)
    return { 
        nodes: [], 
        edges: [], 
        isDirected: false,
        raw: Array.from({ length: n }, () => Math.floor(Math.random() * 99) + 1)
    };
  },

  run: function* (initialState: any) {
    const values: number[] = [...initialState.raw];
    const heap: number[] = [];
    
    // --- HELPER: Tree Layout Calculator ---
    // Converts array index 'i' to X,Y coordinates
    const getLayout = (index: number, total: number) => {
        const level = Math.floor(Math.log2(index + 1));
        const levelStartIndex = Math.pow(2, level) - 1;
        const positionInLevel = index - levelStartIndex;
        const nodesInLevel = Math.pow(2, level);
        
        // Dynamic width based on depth (deeper levels need less spread)
        const screenW = 800;
        const y = 50 + level * 70;
        
        // Calculate spread: Root needs full width, lower levels subdivide it
        // Basic logic: Slice the screen into 2^level parts
        const sliceWidth = screenW / (nodesInLevel + 1);
        const x = sliceWidth * (positionInLevel + 1);

        return { x, y };
    };

    // --- HELPER: Generate GraphState from Heap Array ---
    const drawHeap = (arr: number[], activeIndices: number[] = [], completed: boolean = false) => {
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];

        for (let i = 0; i < arr.length; i++) {
            const pos = getLayout(i, arr.length);
            
            // Color logic
            let color = undefined;
            if (activeIndices.includes(i)) color = '#fbbf24'; // Active (Yellow)
            if (completed) color = '#22c55e'; // Done (Green)

            nodes.push({
                id: String(i),
                value: String(arr[i]),
                x: pos.x,
                y: pos.y,
                color: color,
                isActive: activeIndices.includes(i)
            });

            // Add Edge to Parent
            if (i > 0) {
                const parentIdx = Math.floor((i - 1) / 2);
                edges.push({
                    from: String(parentIdx),
                    to: String(i),
                    color: '#475569'
                });
            }
        }
        return { nodes, edges, isDirected: false };
    };

    // --- STEP 1: Insert Elements One by One ---
    for (const val of values) {
        // 1. Add to end
        heap.push(val);
        let curr = heap.length - 1;

        yield {
            data: drawHeap(heap, [curr]),
            description: `Insert ${val} at the next available position (Index ${curr})`
        };

        // 2. Sift Up (Bubble Up)
        while (curr > 0) {
            const parent = Math.floor((curr - 1) / 2);
            
            yield {
                data: drawHeap(heap, [curr, parent]),
                description: `Compare Child (${heap[curr]}) with Parent (${heap[parent]})`
            };

            if (heap[curr] < heap[parent]) {
                // Swap
                [heap[curr], heap[parent]] = [heap[parent], heap[curr]];
                
                yield {
                    data: drawHeap(heap, [curr, parent]),
                    description: `Swap! ${heap[parent]} < ${heap[curr]}, so bubble up.`
                };
                
                curr = parent; // Move up
            } else {
                break; // Order satisfied
            }
        }
    }

    // --- STEP 2: Highlight Complete Heap ---
    yield {
        data: drawHeap(heap, [], true),
        description: 'Min-Heap Construction Complete! Root is the minimum element.'
    };

    // Optional: Demonstrate Extract Min (Remove Root)
    yield {
        data: drawHeap(heap, [0], true),
        description: 'Now, let\'s remove the Minimum (Root)...'
    };
    
    // Move last to root
    const removed = heap[0];
    heap[0] = heap.pop()!;
    
    yield {
        data: drawHeap(heap, [0]),
        description: `Replaced root with last element (${heap[0]}). Now Sift Down.`
    };

    // Sift Down
    let curr = 0;
    while (true) {
        let left = 2 * curr + 1;
        let right = 2 * curr + 2;
        let smallest = curr;

        // Check Left
        if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
        // Check Right
        if (right < heap.length && heap[right] < heap[smallest]) smallest = right;

        if (smallest !== curr) {
            yield {
                data: drawHeap(heap, [curr, smallest]),
                description: `Swapping with smaller child (${heap[smallest]})`
            };

            [heap[curr], heap[smallest]] = [heap[smallest], heap[curr]];
            curr = smallest;
        } else {
            break;
        }
    }

    yield {
        data: drawHeap(heap, [], true),
        description: `Root removed. Heap property restored.`
    };
  }
};

export default minHeap;