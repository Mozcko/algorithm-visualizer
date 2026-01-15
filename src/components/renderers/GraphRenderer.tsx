import React from 'react';
import type { GraphState } from '../../algorithms/types';

interface Props {
  data: GraphState | null;
}

export const GraphRenderer: React.FC<Props> = ({ data }) => {
  if (!data) return <div className="text-slate-500">Sin datos</div>;

  const { nodes, edges, isDirected } = data;

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
      <svg 
        className="w-full h-full max-w-4xl" 
        viewBox="0 0 800 400" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* 1. EDGES (Lines) */}
        {edges.map((edge, idx) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          
          if (!fromNode || !toNode) return null;

          // Calculate Midpoint for the label
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;

          return (
            <g key={`edge-${idx}`}>
                {/* The Line */}
                <line
                    className="transition-all duration-500 ease-in-out"
                    x1={fromNode.x} y1={fromNode.y}
                    x2={toNode.x} y2={toNode.y}
                    stroke={edge.color || "#475569"}
                    strokeWidth={edge.color === '#22c55e' ? "4" : "2"} // Thicker if active/green
                    markerEnd={edge.isDirected || isDirected ? "url(#arrowhead)" : undefined}
                    strokeDasharray={edge.color === '#fbbf24' ? "5,5" : "0"} // Dashed if 'checking' (Yellow)
                />
                
                {/* The Weight Label (Cost) */}
                {edge.weight !== undefined && (
                    <g className="animate-pop">
                        {/* Background box for readability */}
                        <rect 
                            x={midX - 10} y={midY - 10} 
                            width="20" height="20" 
                            rx="4" fill="#0f172a" 
                            className="stroke-slate-700" strokeWidth="1"
                        />
                        <text 
                            x={midX} y={midY} 
                            dy=".35em" 
                            textAnchor="middle" 
                            className="fill-slate-300 text-[10px] font-mono font-bold select-none"
                        >
                            {edge.weight}
                        </text>
                    </g>
                )}
            </g>
          );
        })}

        {/* 2. NODES (Routers) */}
        {nodes.map((node) => (
          <g 
            key={node.id} 
            className="transition-spring"
            style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
          >
            {/* Outer Glow for Source Router */}
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
        ))}
      </svg>
    </div>
  );
};