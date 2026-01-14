// src/components/renderers/Grid2D.tsx
import React from 'react';
import type { GridNode } from '../../algorithms/types';

interface Props {
  grid: GridNode[][];
}

export const Grid2D: React.FC<Props> = ({ grid }) => {
  if (!grid || grid.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-1 p-4 bg-slate-900 rounded-lg shadow-2xl">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1">
          {row.map((node, colIdx) => {
            // Lógica de color de fondo con prioridad
            let bgClass = 'bg-slate-800'; // Default
            
            // Prioridad 1: Color personalizado directo (Backtracking)
            // Prioridad 2: Estados de Pathfinding
            if (node.customBg) {
                // Si viene un color hex, lo aplicamos en style, si no, usamos la clase
                // Nota: Tailwind no interpola clases dinámicas arbitrarias fácilmente sin style
            } else if (node.isStart) bgClass = 'bg-green-500';
            else if (node.isEnd) bgClass = 'bg-red-500';
            else if (node.isPath) bgClass = 'bg-yellow-400';
            else if (node.isWall) bgClass = 'bg-slate-600';
            else if (node.isVisited) bgClass = 'bg-blue-500/50';
            else if ((rowIdx + colIdx) % 2 === 1) bgClass = 'bg-slate-800/80'; // Efecto tablero ajedrez

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`
                    w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center 
                    text-lg sm:text-xl font-bold rounded-sm border border-slate-700/30 
                    transition-all duration-200 ${bgClass}
                `}
                style={node.customBg ? { backgroundColor: node.customBg } : {}}
              >
                {/* Mostramos el valor si existe (ej: la Reina) */}
                {node.value && <span className="animate-in zoom-in duration-300">{node.value}</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};