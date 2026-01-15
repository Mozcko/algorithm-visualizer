// src/components/renderers/Terrain3D.tsx
import React, { useState, useRef, useEffect } from 'react';

interface Props {
  terrain: number[][];
}

export const Terrain3D: React.FC<Props> = ({ terrain }) => {
  if (!terrain || !terrain.length) return null;

  const size = terrain.length;
  // Adjusted sizes to be a bit more compact
  const cellSize = size > 33 ? 8 : (size > 17 ? 16 : 24);

  // --- ROTATION STATE ---
  const [rotX, setRotX] = useState(60); 
  const [rotZ, setRotZ] = useState(-45); 
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  
  // --- DRAG STATE ---
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // --- AUTO ROTATION ---
  useEffect(() => {
    let animationFrameId: number;
    if (isAutoRotating && !isDragging) {
        const animate = () => {
            setRotZ(prev => (prev - 0.2) % 360); 
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoRotating, isDragging]);

  // --- MOUSE HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    setRotZ(prev => prev - deltaX * 0.5); 
    setRotX(prev => Math.max(0, Math.min(90, prev - deltaY * 0.5))); 
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
        className={`w-full h-full flex items-center justify-center overflow-hidden bg-slate-900 perspective-[1000px] select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        // Touch events for mobile dragging support
        onTouchStart={(e) => {
            setIsDragging(true);
            lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchMove={(e) => {
            if (!isDragging) return;
            const deltaX = e.touches[0].clientX - lastMousePos.current.x;
            const deltaY = e.touches[0].clientY - lastMousePos.current.y;
            setRotZ(prev => prev - deltaX * 0.5); 
            setRotX(prev => Math.max(0, Math.min(90, prev - deltaY * 0.5))); 
            lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={() => setIsDragging(false)}
    >
      {/* Changed: Wrapper to scale down the 3D scene on mobile so it fits in the square container */}
      <div className="transform scale-[0.6] sm:scale-100 transition-transform duration-300">
          <div 
            className="relative transition-transform duration-100 ease-out" 
            style={{ 
              transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
              width: size * cellSize,
              height: size * cellSize,
              transformStyle: 'preserve-3d'
            }}
          >
            {terrain.map((row, r) => (
              row.map((heightVal, c) => {
                let color = '#3b82f6'; 
                let zHeight = 0;

                if (heightVal === 100) { color = '#f8fafc'; zHeight = 50; } 
                else if (heightVal === 0) { color = '#3b82f6'; zHeight = 0; } 
                else {
                    if (heightVal > 20) color = '#fcd34d'; 
                    if (heightVal > 40) color = '#22c55e'; 
                    if (heightVal > 70) color = '#475569'; 
                    if (heightVal > 85) color = '#f8fafc'; 
                    zHeight = Math.max(0, heightVal * 1.5);
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    className="absolute border-[0.5px] border-black/10 transition-spring"
                    style={{
                      left: c * cellSize,
                      top: r * cellSize,
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: color,
                      transform: `translateZ(${zHeight}px)`,
                      boxShadow: `0 0 10px rgba(0,0,0,0.3)`
                    }}
                  />
                );
              })
            ))}
          </div>
      </div>
      
      {/* HUD Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 z-10 pointer-events-none">
         <div className="text-xs text-slate-500 font-mono bg-slate-900/50 px-2 rounded">
            Drag to Rotate
         </div>
         <button 
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`
                pointer-events-auto px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-colors border
                ${isAutoRotating 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}
            `}
         >
            {isAutoRotating ? 'Stop' : 'Rotate'}
         </button>
      </div>
    </div>
  );
};