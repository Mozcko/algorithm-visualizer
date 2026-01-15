import type { AlgorithmDefinition, GraphState, GraphEdge } from '../types';

const prims: AlgorithmDefinition<GraphState> = {
  id: 'prims-mst',
  name: 'Prim’s MST',
  category: 'Greedy',
  visualizer: 'primitive-graph',
  description: 'Finds the Minimum Spanning Tree (MST) of a graph. It starts from an arbitrary node and repeatedly adds the shortest edge connecting the tree to a node not yet in the tree. Imagine laying fiber-optic cables to connect cities with the least amount of wire.',

  controls: [
      { type: 'input-number', label: 'Nodes', id: 'count', defaultValue: 8 }
  ],

  generateInput: (val = 8) => {
    const nodeCount = Math.max(Math.min(val, 15), 5);
    const nodes: any[] = [];
    const edges: any[] = [];

    // 1. Generate Random Nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            id: String(i),
            value: String.fromCharCode(65 + i),
            x: Math.floor(Math.random() * 600) + 100,
            y: Math.floor(Math.random() * 300) + 50,
            color: undefined
        });
    }

    // 2. Generate a Complete Graph (or dense) with Euclidean Weights
    // We connect every node to every other node if they are reasonably close
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            // Connect if close enough (to make it look like a network)
            // or connect ALL if you want a true complete graph
            if (dist < 350) {
                 edges.push({ 
                     from: String(i), 
                     to: String(j), 
                     color: '#334155' // Dark Slate (Unselected)
                 });
            }
        }
    }

    return { nodes, edges, isDirected: false };
  },

  run: function* (graph: GraphState) {
    const nodes = [...graph.nodes];
    const edges = [...graph.edges];
    const n = nodes.length;

    // Helper to get distance between two node IDs
    const getDist = (id1: string, id2: string) => {
        const n1 = nodes.find(n => n.id === id1)!;
        const n2 = nodes.find(n => n.id === id2)!;
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        return Math.sqrt(dx*dx + dy*dy);
    };

    // State Tracking
    const visited = new Set<string>();
    const mstEdges: GraphEdge[] = [];
    
    // Start with Node 0
    visited.add(nodes[0].id);
    nodes[0].color = '#22c55e'; // Mark Start Node Green
    nodes[0].isActive = true;

    yield { 
        data: { nodes: [...nodes], edges: [...edges], isDirected: false }, 
        description: `Starting Prim's Algorithm at Node ${nodes[0].value}` 
    };
    nodes[0].isActive = false;

    // Main Loop: Until all nodes are visited
    while (visited.size < n) {
        let minEdgeIndex = -1;
        let minDist = Infinity;
        let targetNodeId = null;

        // Find the smallest edge connecting Visited -> Unvisited
        for (let i = 0; i < edges.length; i++) {
            const e = edges[i];
            const isFromVisited = visited.has(e.from);
            const isToVisited = visited.has(e.to);

            // XOR: One must be visited, the other must NOT be
            if (isFromVisited !== isToVisited) {
                // Visualize Candidate (Yellow)
                if (edges[i].color !== '#22c55e') {
                    edges[i].color = '#fbbf24'; 
                }

                const dist = getDist(e.from, e.to);
                if (dist < minDist) {
                    minDist = dist;
                    minEdgeIndex = i;
                    targetNodeId = isFromVisited ? e.to : e.from;
                }
            } else if (!isFromVisited && !isToVisited) {
                // Edge between two unvisited nodes (remain dark)
                edges[i].color = '#334155';
            } else {
                 // Edge between two visited nodes (not part of MST, make it faint)
                 if (edges[i].color !== '#22c55e') edges[i].color = '#1e293b';
            }
        }

        yield { 
            data: { nodes: [...nodes], edges: [...edges], isDirected: false }, 
            description: `Searching for shortest connection...` 
        };

        if (minEdgeIndex !== -1 && targetNodeId) {
            // Confirm Selection
            edges[minEdgeIndex].color = '#22c55e'; // Make it Green
            visited.add(targetNodeId);
            
            // Update Node Color
            const nodeIdx = nodes.findIndex(n => n.id === targetNodeId);
            if (nodeIdx !== -1) {
                nodes[nodeIdx].color = '#22c55e';
                nodes[nodeIdx].isActive = true; // "Pop" effect
            }

            yield { 
                data: { nodes: [...nodes], edges: [...edges], isDirected: false }, 
                description: `Connected Node ${nodes[nodeIdx].value} (Dist: ${Math.floor(minDist)})` 
            };
            
            if (nodeIdx !== -1) nodes[nodeIdx].isActive = false;
        } else {
            break; // Graph might be disconnected
        }
    }

    yield { 
        data: { nodes: [...nodes], edges: [...edges], isDirected: false }, 
        description: 'MST Complete! Minimum wire length achieved.' 
    };
  }
};

export default prims;