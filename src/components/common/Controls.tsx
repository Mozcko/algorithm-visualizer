// src/components/common/Controls.tsx
import React, { useState } from 'react';
import type { AlgorithmControl } from '../../algorithms/types';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onReset: (arg?: any) => void; 
  speed: number;
  onSpeedChange: (val: number) => void;
  stepCount: number;
  
  // Props opcionales para interactividad
  customControls?: AlgorithmControl[];
  onCommand?: (method: string, args: any[]) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying, onTogglePlay, onNext, onReset, speed, onSpeedChange, stepCount,
  customControls, onCommand
}) => {
  const [inputValues, setInputValues] = useState<Record<string, number>>({});

  const handleInputChange = (id: string, val: string) => {
    setInputValues(prev => ({ ...prev, [id]: Number(val) }));
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      
      {/* 1. BARRA DE HERRAMIENTAS ESPECÍFICAS (BST, Grafos, etc.) */}
      {customControls && customControls.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-900/50 border border-slate-700 rounded-lg animate-in fade-in slide-in-from-bottom-2">
            {customControls.map((ctrl) => {
                if (ctrl.type === 'input-number') {
                    return (
                        <input 
                            key={ctrl.id}
                            type="number"
                            placeholder={ctrl.label}
                            // Responsive width: full on mobile, fixed on desktop
                            className="bg-slate-800 text-white px-3 py-2 sm:py-1 rounded border border-slate-600 w-full sm:w-24 text-sm focus:border-blue-500 outline-none"
                            value={inputValues[ctrl.id] !== undefined ? inputValues[ctrl.id] : (ctrl.defaultValue ?? '')}
                            onChange={(e) => handleInputChange(ctrl.id, e.target.value)}
                        />
                    );
                }
                if (ctrl.type === 'button') {
                   return (
                       <button
                           key={ctrl.id}
                           onClick={() => {
                               const val = inputValues['value']; 
                               const arg = val !== undefined ? val : Math.floor(Math.random() * 100);
                               onCommand?.(ctrl.method!, [arg]);
                           }}
                           disabled={isPlaying}
                           className="flex-1 sm:flex-none px-3 py-2 sm:py-1 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded border border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                       >
                           {ctrl.label}
                       </button>
                   )
                }
                return null;
            })}
        </div>
      )}

      {/* 2. CONTROLES DE REPRODUCCIÓN ESTÁNDAR */}
      {/* Flex-wrap allows content to flow on small screens */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-slate-800 p-2 sm:p-3 rounded-lg border border-slate-700 text-sm">
        
        {/* Botón Play/Pause - Grows on mobile */}
        <button
          onClick={onTogglePlay}
          className={`flex-1 sm:flex-none px-4 py-2 rounded font-bold transition-colors shadow-sm ${
            isPlaying 
              ? 'bg-amber-600 hover:bg-amber-500 text-white' 
              : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>

        {/* Botón Step Forward - Grows on mobile */}
        <button
            onClick={onNext}
            disabled={isPlaying}
            className="flex-1 sm:flex-none px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50 text-white transition-colors border border-slate-600"
            title="Avanzar un paso"
        >
            Step &rarr;
        </button>

        {/* Botón Reset - Pushed to right on desktop */}
        <button
            onClick={() => {
                const values = Object.values(inputValues);
                onReset(values.length > 0 ? values[0] : undefined);
            }}
            className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-800 rounded transition-colors ml-auto sm:ml-0"
        >
            Reset
        </button>

        {/* Separator - Hidden on mobile */}
        <div className="w-px h-8 bg-slate-600 mx-2 hidden sm:block"></div>

        {/* Slider de Velocidad - Full width on new line for mobile */}
        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-slate-700 sm:border-t-0">
            <span className="text-slate-400 text-xs sm:text-sm">Speed:</span>
            <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={1050 - speed} 
                onChange={(e) => onSpeedChange(1050 - Number(e.target.value))}
                className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                title="Ajustar velocidad de animación"
            />
        </div>

        {/* Contador de Pasos (Desktop) */}
        <div className="hidden sm:block ml-auto text-slate-500 font-mono text-xs sm:text-sm">
            Steps: <span className="text-blue-400">{stepCount}</span>
        </div>
      </div>

      {/* Contador de Pasos (Mobile only) */}
      <div className="sm:hidden text-center text-slate-500 font-mono text-xs">
         Step: <span className="text-blue-400">{stepCount}</span>
      </div>
    </div>
  );
};