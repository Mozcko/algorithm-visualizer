// src/components/renderers/Grid2D.tsx
import React from 'react';
import type { GridNode } from '../../algorithms/types';

interface Props {
  grid: GridNode[][];
}

export const Grid2D: React.FC<Props> = ({ grid }) => {
  if (!grid || grid.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-1 p-4 bg-slate-900 rounded-lg">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1">
          {row.map((node, colIdx) => {
            // Determinamos el color según el estado del nodo
            let bgClass = 'bg-slate-800'; // Default (vacío)
            
            if (node.isStart) bgClass = 'bg-green-500 shadow-[0_0_10px_#22c55e] z-10';
            else if (node.isEnd) bgClass = 'bg-red-500 shadow-[0_0_10px_#ef4444] z-10';
            else if (node.isPath) bgClass = 'bg-yellow-400 animate-pulse'; // Camino final
            else if (node.isWall) bgClass = 'bg-slate-600';
            else if (node.isVisited) bgClass = 'bg-blue-500/50'; // Visitado

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`w-6 h-6 rounded-sm border border-slate-700/50 transition-colors duration-200 ${bgClass}`}
                title={`[${rowIdx}, ${colIdx}]`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};