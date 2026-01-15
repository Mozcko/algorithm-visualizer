import type { AlgorithmDefinition, GraphState } from '../types';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];

const graphColoring: AlgorithmDefinition<GraphState> = {
  id: 'm-coloring',
  name: 'Graph Coloring',
  category: 'Backtracking',
  visualizer: 'primitive-graph',
  description: 'Assign colors to nodes such that no two adjacent nodes share the same color.',

  // 1. ADD CONTROLS HERE
  controls: [
    { 
      type: 'input-number', 
      label: 'Nodes', 
      id: 'size', // This ID doesn't matter much for generation, but good for uniqueness
      defaultValue: 6 
    }
  ],

  // 2. RECEIVE INPUT SIZE
  generateInput: (val = 6) => { 
    // Clamp the value to keep the graph looking good (min 4, max 12)
    // If it's too big, the text gets unreadable; too small is trivial.
    const nodeCount = Math.max(Math.min(val, 12), 4);
    
    const nodes: any[] = [];
    const edges: any[] = [];

    const centerX = 400;
    const centerY = 200;
    const baseRadius = 130; 

    // Generate Nodes with "Jitter"
    for (let i = 0; i < nodeCount; i++) {
        const angleJitter = (Math.random() - 0.5) * 0.5; 
        const angle = (i / nodeCount) * 2 * Math.PI - (Math.PI / 2) + angleJitter;
        
        const radiusJitter = (Math.random() - 0.5) * 60; // Reduced jitter slightly for cleaner look
        const currentRadius = baseRadius + radiusJitter;

        nodes.push({
            id: String(i),
            value: String.fromCharCode(65 + i),
            x: centerX + currentRadius * Math.cos(angle),
            y: centerY + currentRadius * Math.sin(angle),
            color: undefined
        });
    }

    // Generate Edges
    for (let i = 0; i < nodeCount; i++) {
        let next = (i + 1) % nodeCount;
        edges.push({ from: String(i), to: String(next) });

        for (let j = i + 2; j < nodeCount; j++) {
            if (j !== next && Math.random() > 0.55) { // Adjusted probability
                 edges.push({ from: String(i), to: String(j) });
            }
        }
    }

    return { nodes, edges, isDirected: false };
  },

  run: function* (graph: GraphState) {
    const nodes = graph.nodes;
    const m = 4; 
    
    const copyGraph = () => ({ 
        ...graph, 
        nodes: graph.nodes.map(n => ({...n})) 
    });

    function isSafe(nodeIndex: number, color: string) {
        const node = nodes[nodeIndex];
        const neighbors = graph.edges
            .filter(e => e.from === node.id || e.to === node.id)
            .map(e => e.from === node.id ? e.to : e.from);
            
        for (const neighborId of neighbors) {
            const neighbor = nodes.find(n => n.id === neighborId);
            if (neighbor && neighbor.color === color) return false;
        }
        return true;
    }

    function* solve(nodeIndex: number): Generator<any, boolean, any> {
        if (nodeIndex === nodes.length) return true;

        for (let i = 0; i < m; i++) {
            const color = COLORS[i];
            
            nodes[nodeIndex].isActive = true;
            yield { data: copyGraph(), description: `Trying color for Node ${nodes[nodeIndex].value}` };

            if (isSafe(nodeIndex, color)) {
                nodes[nodeIndex].color = color;
                nodes[nodeIndex].isActive = false; 
                
                yield { data: copyGraph(), description: `Color valid so far` };
                
                if (yield* solve(nodeIndex + 1)) return true;

                // Backtrack
                nodes[nodeIndex].isActive = true; 
                yield { data: copyGraph(), description: `Backtracking Node ${nodes[nodeIndex].value}` };
                
                nodes[nodeIndex].color = undefined;
            }
        }
        nodes[nodeIndex].isActive = false;
        return false;
    }

    yield* solve(0);
    yield { data: copyGraph(), description: 'Finished!' };
  }
};

export default graphColoring;