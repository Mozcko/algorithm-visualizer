// src/components/renderers/Grid2D.tsx
import React from 'react';
import type { GridNode } from '../../algorithms/types';

interface Props {
  grid: GridNode[][];
}

export const Grid2D: React.FC<Props> = ({ grid }) => {
  if (!grid || grid.length === 0) return null;

  const rows = grid.length;
  const cols = grid[0].length;
  const ratio = cols / rows;
  
  // LOGIC:
  // 1. Mobile (Default): Always fit width ('w-full'). In portrait, width is the constraint.
  // 2. Desktop (md):
  //    - If grid is Wide (> 1.6 ratio like Pathfinding), fit width ('md:w-full').
  //    - If grid is Square (Sudoku, N-Queens), fit height ('md:h-full') so it doesn't overflow vertically.
  const sizingClass = ratio > 1.6 
     ? "w-full h-auto md:w-full md:h-auto" 
     : "w-full h-auto md:w-auto md:h-full";

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 bg-slate-900 rounded-lg shadow-2xl">
      
      {/* We use a CSS variable --aspect-ratio to pass the calculated ratio to Tailwind/CSS 
         style={{ aspectRatio: ... }} ensures the grid maintains shape.
      */}
      <div 
        className={`flex flex-col justify-center gap-px ${sizingClass}`}
        style={{ aspectRatio: `${cols} / ${rows}` }}
      >
        {grid.map((row, rowIdx) => (
          // Row needs flex-1 to distribute height equally within the aspect-ratio container
          <div key={rowIdx} className="flex w-full flex-1 gap-px">
            {row.map((node, colIdx) => {
              let bgClass = 'bg-slate-800'; 
              
              if (node.customBg) { /* ... */ } 
              else if (node.isStart) bgClass = 'bg-green-500';
              else if (node.isEnd) bgClass = 'bg-red-500';
              else if (node.isPath) bgClass = 'bg-yellow-400';
              else if (node.isWall) bgClass = 'bg-slate-600';
              else if (node.isVisited) bgClass = 'bg-blue-500/50';
              else if ((rowIdx + colIdx) % 2 === 1) bgClass = 'bg-slate-800/80';

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`
                      flex-1 
                      flex items-center justify-center 
                      rounded-sm border-slate-700/30 
                      transition-all duration-200 ${bgClass}
                  `}
                  style={node.customBg ? { backgroundColor: node.customBg } : {}}
                >
                  {/* Text scales cleanly: hidden on tiny grids, visible on Sudoku */}
                  {node.value && (
                    <span className="text-[8px] sm:text-xs md:text-xl font-bold animate-in zoom-in select-none">
                        {node.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};