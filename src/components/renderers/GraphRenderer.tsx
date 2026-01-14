// src/components/renderers/GraphRenderer.tsx
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
      {/* viewBox="0 0 800 400":
         Define un lienzo virtual de 800 unidades de ancho x 400 de alto.
         Esto nos da mucha más resolución que el 100x100 anterior.
      */}
      <svg 
        className="w-full h-full max-w-4xl" 
        viewBox="0 0 800 400" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Marcador para las flechas (Grafo Dirigido) */}
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* 1. DIBUJAR ARISTAS (Líneas) - Van detrás */}
        {edges.map((edge, idx) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={`edge-${idx}`}
              x1={fromNode.x} y1={fromNode.y}
              x2={toNode.x} y2={toNode.y}
              stroke={edge.color || "#475569"}
              strokeWidth="2"
              markerEnd={edge.isDirected || isDirected ? "url(#arrowhead)" : undefined}
            />
          );
        })}

        {/* 2. DIBUJAR NODOS (Círculos) - Van enfrente */}
        {nodes.map((node) => (
          <g key={node.id} className="transition-all duration-500 ease-in-out" style={{ transform: `translate(${node.x}px, ${node.y}px)` }}>
            {/* El nodo ahora se mueve con 'transform', es más suave */}
            
            {/* Círculo base */}
            <circle
              r="20" // Radio fijo en unidades del viewBox
              className={`
                fill-slate-800 stroke-2 transition-colors duration-300
                ${node.isActive ? 'stroke-yellow-400 stroke-[3px]' : 'stroke-blue-500'}
                ${node.color ? '' : 'stroke-blue-500'} 
              `}
              style={{ stroke: node.color }} // Override directo si viene color
            />
            
            {/* Valor del texto */}
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