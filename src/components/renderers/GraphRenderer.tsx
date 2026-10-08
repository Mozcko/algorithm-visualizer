// src/components/renderers/GraphRenderer.tsx
import React from 'react';
import type { GraphState } from '../../algorithms/types';

interface Props {
  data: GraphState | null;
}

// En móvil el viewBox de 800 unidades se reduce a ~40%, así que nodos y pesos
// se dibujan más grandes para que el texto siga siendo legible.
const MOBILE_SCALE = 'max-sm:scale-[1.75]';

export const GraphRenderer: React.FC<Props> = ({ data }) => {
  if (!data) return <div className="text-slate-500">Sin datos</div>;

  const { nodes, edges, isDirected } = data;

  return (
    // CHANGED: Removed overflow-auto.
    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center relative p-2">
      <svg 
        // CHANGED: Removed 'min-w-[600px]'. Now it's just 100% width/height.
        // The viewBox ensures it scales proportionally (content-fit).
        className="w-full h-full max-w-4xl" 
        viewBox="0 0 800 400" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* 1. EDGES */}
        {edges.map((edge, idx) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          
          if (!fromNode || !toNode) return null;

          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;

          return (
            <g key={`edge-${idx}`}>
                <line
                    className="transition-all duration-500 ease-in-out"
                    x1={fromNode.x} y1={fromNode.y}
                    x2={toNode.x} y2={toNode.y}
                    stroke={edge.color || "#475569"}
                    strokeWidth={edge.color === '#22c55e' ? "4" : "2"}
                    markerEnd={edge.isDirected || isDirected ? "url(#arrowhead)" : undefined}
                    strokeDasharray={edge.color === '#fbbf24' ? "5,5" : "0"}
                />
                
                {edge.weight !== undefined && (
                    <g className="animate-pop">
                        <g style={{ transform: `translate(${midX}px, ${midY}px)` }}>
                            <g className={MOBILE_SCALE}>
                                <rect 
                                    x={-10} y={-10} 
                                    width="20" height="20" 
                                    rx="4" fill="#0f172a" 
                                    className="stroke-slate-700" strokeWidth="1"
                                />
                                <text 
                                    dy=".35em" 
                                    textAnchor="middle" 
                                    className="fill-slate-300 text-[10px] font-mono font-bold select-none"
                                >
                                    {edge.weight}
                                </text>
                            </g>
                        </g>
                    </g>
                )}
            </g>
          );
        })}

        {/* 2. NODES */}
        {nodes.map((node) => (
          <g 
            key={node.id} 
            className="transition-spring"
            style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
          >
           <g className={MOBILE_SCALE}>
            {node.color === '#22c55e' && (
                <circle r="28" className="fill-green-500/20 animate-pulse" />
            )}

            <circle
              r="20"
              className={`
                fill-slate-800 transition-all duration-300
                ${node.isActive ? 'stroke-[3px] scale-110' : 'stroke-2 scale-100'} 
              `}
              stroke={node.color || (node.isActive ? '#fbbf24' : '#3b82f6')}
            />
            
            <text
              dy=".3em"
              textAnchor="middle"
              className="fill-slate-200 text-xs font-bold pointer-events-none select-none font-mono"
            >
              {node.value}
            </text>
           </g>
          </g>
        ))}
      </svg>
    </div>
  );
};