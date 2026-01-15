import type { AlgorithmDefinition, GraphState, GraphEdge } from '../types';

const ospfRouting: AlgorithmDefinition<GraphState> = {
  id: 'ospf-routing',
  name: 'Network Routing (OSPF)',
  category: 'Greedy',
  visualizer: 'primitive-graph',
  description: 'Simulates a Router running the OSPF (Link State) protocol. It uses Dijkstra’s algorithm to calculate the "Shortest Path Tree" from the Source Router (A) to all other subnets. Link costs represent bandwidth (1 = Fast, 10 = Slow).',

  controls: [{ type: 'input-number', label: 'Routers', id: 'count', defaultValue: 6 }],

  generateInput: (val = 6) => {
    const nodeCount = Math.max(Math.min(val, 10), 4);
    const nodes: any[] = [];
    const edges: GraphEdge[] = [];
    
    // Minimum distance between nodes to prevent overlap
    const MIN_DIST = 90; 

    // 1. Place Source Router (R0)
    nodes.push({ id: '0', value: 'R0', x: 150, y: 200, color: '#22c55e' });

    // 2. Place other routers with Collision Detection
    for (let i = 1; i < nodeCount; i++) {
        let x = 0, y = 0;
        let overlapping = false;
        let attempts = 0;

        // Try up to 50 times to find a free spot
        do {
            overlapping = false;
            // Generate random coordinates
            x = Math.floor(Math.random() * 500) + 200;
            y = Math.floor(Math.random() * 300) + 50;

            // Check distance against ALL existing nodes
            for (const node of nodes) {
                const dx = node.x - x;
                const dy = node.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MIN_DIST) {
                    overlapping = true;
                    break; // Too close! Try again.
                }
            }
            attempts++;
        } while (overlapping && attempts < 50);

        nodes.push({
            id: String(i),
            value: `R${i}`,
            x: x,
            y: y,
        });
    }

    // 3. Connect Routers (Same logic as before)
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            const dist = Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2));
            
            // Connect if close, or guarantee connection for R0
            if (dist < 250 || (i === 0 && j < 3)) {
                 const rand = Math.random();
                 let weight = 10;
                 if (rand > 0.8) weight = 1;
                 else if (rand < 0.3) weight = 50;

                 edges.push({ 
                     from: String(i), 
                     to: String(j), 
                     color: '#334155', 
                     weight: weight
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

    // Dijkstra structures
    const dist: number[] = new Array(n).fill(Infinity);
    const parentEdge: (GraphEdge | null)[] = new Array(n).fill(null);
    const visited = new Set<string>();

    // Start at Router 0
    dist[0] = 0;
    
    // Helper to get edge between two nodes
    const getEdge = (u: string, v: string) => 
        edges.find(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));

    yield { 
        data: { nodes, edges, isDirected: false }, 
        description: 'OSPF Init: Router R0 detects neighbors...' 
    };

    // Priority Queue simulation (finding min dist)
    while (visited.size < n) {
        // 1. Pick unvisited node with smallest distance
        let u = -1;
        let minDist = Infinity;

        for (let i = 0; i < n; i++) {
            if (!visited.has(String(i)) && dist[i] < minDist) {
                minDist = dist[i];
                u = i;
            }
        }

        if (u === -1) break; // Disconnected or Done
        visited.add(String(u));

        // Visual: Highlight Current Router processing LSA
        nodes[u].isActive = true;
        // Visual: Lock in the path that got us here (The "Routing Table Entry")
        if (parentEdge[u]) {
            parentEdge[u]!.color = '#22c55e'; // Green (Selected Route)
            parentEdge[u]!.isDirected = true; // Show flow direction
        }

        yield { 
            data: { nodes: [...nodes], edges: [...edges], isDirected: false }, 
            description: `Router R${u} processing Link State Advertisements. Metric: ${minDist}` 
        };
        nodes[u].isActive = false;

        // 2. Relax Neighbors
        const neighbors = edges.filter(e => e.from === String(u) || e.to === String(u));
        
        for (const edge of neighbors) {
            // Identify neighbor V
            const vId = edge.from === String(u) ? edge.to : edge.from;
            const v = parseInt(vId);

            if (visited.has(vId)) continue;

            // Visual: Check this link (Yellow)
            const oldColor = edge.color;
            if (edge.color !== '#22c55e') edge.color = '#fbbf24'; 
            
            yield { 
                data: { nodes: [...nodes], edges: [...edges], isDirected: false }, 
                description: `R${u} checks link to R${v} (Cost ${edge.weight}). Total: ${dist[u]} + ${edge.weight}` 
            };

            const newDist = dist[u] + (edge.weight || 1);
            
            if (newDist < dist[v]) {
                dist[v] = newDist;
                // If we had a previous parent edge for V, reset it to grey
                if (parentEdge[v]) parentEdge[v]!.color = '#334155';
                
                parentEdge[v] = edge; // This is now the best path to V
                
                yield { 
                    data: { nodes: [...nodes], edges: [...edges], isDirected: false }, 
                    description: `New best route found to R${v}! Metric updated to ${newDist}` 
                };
            } else {
                // Not a better path
                 if (edge.color !== '#22c55e') edge.color = '#334155'; // Reset to grey
            }
        }
    }

    yield { 
        data: { nodes: [...nodes], edges: [...edges], isDirected: false }, 
        description: 'OSPF Converged. Routing Table Built.' 
    };
  }
};

export default ospfRouting;