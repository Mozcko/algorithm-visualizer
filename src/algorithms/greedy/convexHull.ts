import type { AlgorithmDefinition, GraphState } from '../types';

const convexHull: AlgorithmDefinition<GraphState> = {
  id: 'convex-hull',
  name: 'Convex Hull (Jarvis March)',
  category: 'Greedy',
  visualizer: 'primitive-graph',
  description: 'Computes the convex hull of a set of points. Intuitively, it mimics wrapping a rubber band around the outer boundary of the points.',

  controls: [{ type: 'input-number', label: 'Points', id: 'n', defaultValue: 10 }],

  generateInput: (val = 10) => {
    const n = Math.max(val, 5);
    const nodes: any[] = [];
    for (let i = 0; i < n; i++) {
        nodes.push({
            id: String(i),
            value: '', // No names needed for simple points
            x: Math.floor(Math.random() * 600) + 100,
            y: Math.floor(Math.random() * 300) + 50,
            color: '#64748b' // Slate-500
        });
    }
    return { nodes, edges: [], isDirected: true }; // Directed edges for the "wrap" path
  },

  run: function* (graph: GraphState) {
    const nodes = [...graph.nodes];
    const n = nodes.length;
    let edges: any[] = [];

    // 1. Find the leftmost point (guaranteed to be on hull)
    let leftMost = 0;
    for (let i = 1; i < n; i++) {
        if (nodes[i].x < nodes[leftMost].x) leftMost = i;
    }

    let p = leftMost;
    let hull = [];

    // Color the start point
    nodes[p].color = '#22c55e';
    nodes[p].isActive = true;
    yield { 
        data: { nodes, edges: [], isDirected: true }, 
        description: 'Starting at leftmost point' 
    };
    nodes[p].isActive = false;

    // Helper: Cross Product to determine turn direction
    const crossProduct = (o: any, a: any, b: any) => {
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    };

    do {
        hull.push(p);
        let q = (p + 1) % n; // Candidate for next point

        // Visualize "Checking" lines
        for (let i = 0; i < n; i++) {
            if (i === p) continue;
            
            // Draw temporary line P -> I
            edges = [...edges.filter(e => e.color === '#22c55e'), { from: String(p), to: String(i), color: '#fbbf24' }];
            
            // If i is more "counter-clockwise" than q, update q
            const val = crossProduct(nodes[p], nodes[i], nodes[q]);
            
            if (val < 0 || (val === 0 && i !== q)) { // Simplified check logic
                 q = i;
            }
             
            // Only yield every few steps to speed it up, or yield every step for detail
            if (i % 3 === 0) {
                 yield { 
                    data: { nodes, edges, isDirected: true }, 
                    description: `Scanning points...` 
                };
            }
        }
        
        // Found the next hull point 'q'
        // Add permanent Green edge P -> Q
        edges = [...edges.filter(e => e.color === '#22c55e'), { from: String(p), to: String(q), color: '#22c55e' }];
        
        nodes[q].color = '#22c55e';
        nodes[q].isActive = true;

        yield { 
            data: { nodes, edges, isDirected: true }, 
            description: `Found hull edge to Point ${q}` 
        };
        nodes[q].isActive = false;

        p = q;

    } while (p !== leftMost);

    yield { 
        data: { nodes, edges, isDirected: true }, 
        description: 'Convex Hull wrapping complete!' 
    };
  }
};

export default convexHull;