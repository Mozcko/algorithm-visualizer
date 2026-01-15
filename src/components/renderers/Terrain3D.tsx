import React from 'react';

interface Props {
  terrain: number[][]; // A 2D heightmap (0 to 100)
}

export const Terrain3D: React.FC<Props> = ({ terrain }) => {
  if (!terrain || !terrain.length) return null;

  const size = terrain.length;
  
  // Dynamic sizing: Make cells smaller if the grid is huge
  const cellSize = size > 33 ? 12 : (size > 17 ? 20 : 30);
  const gap = 0; // No gap for solid terrain look

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-slate-900 perspective-[1000px]">
      {/* The 3D Scene Container
         rotate-x-60: Tilts it back
         rotate-z-45: Spins it for isometric view
      */}
      <div 
        className="relative transition-transform duration-700 ease-out"
        style={{ 
          transform: `rotateX(60deg) rotateZ(-45deg)`,
          width: size * cellSize,
          height: size * cellSize,
          transformStyle: 'preserve-3d'
        }}
      >
        {terrain.map((row, r) => (
          row.map((heightVal, c) => {
            // Color based on height (Water -> Sand -> Grass -> Snow)
            let color = '#3b82f6'; // Water (Blue)
            if (heightVal > 20) color = '#fcd34d'; // Sand (Yellow)
            if (heightVal > 40) color = '#22c55e'; // Grass (Green)
            if (heightVal > 70) color = '#475569'; // Rock (Grey)
            if (heightVal > 85) color = '#f8fafc'; // Snow (White)

            // Calculate Z-height (Extrude upwards)
            // We multiply by a factor to make mountains "tall"
            const zHeight = Math.max(0, heightVal * 2); 

            return (
              <div
                key={`${r}-${c}`}
                className="absolute border-[0.5px] border-black/10 transition-all duration-300"
                style={{
                  left: c * cellSize,
                  top: r * cellSize,
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: color,
                  // CSS 3D Magic: Move it up in Z-space
                  transform: `translateZ(${zHeight}px)`,
                  // Add a shadow to fake depth below the "floating" tile
                  boxShadow: `0 0 10px rgba(0,0,0,0.3)`
                }}
              />
            );
          })
        ))}
      </div>
      
      {/* Overlay info
      <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-mono">
        CSS 3D Isometric View
      </div> */}
    </div>
  );
};