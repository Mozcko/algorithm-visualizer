// src/components/common/Controls.tsx
import React, { useState } from 'react';
import type { AlgorithmControl } from '../../algorithms/types';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  // CORRECCIÓN AQUÍ: Permitimos un argumento opcional
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
  // Estado local para los inputs numéricos (ej: valor a insertar)
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
                            className="bg-slate-800 text-white px-3 py-1 rounded border border-slate-600 w-24 text-sm focus:border-blue-500 outline-none"
                            // Usamos defaultValue si el estado está vacío inicialmente
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
                               // Lógica simple: Si el botón es "Insert", busca el input "value"
                               // En un futuro podríamos hacer esto más dinámico buscando inputs vinculados
                               const val = inputValues['value']; 
                               // Si no hay valor, usamos uno random o default
                               const arg = val !== undefined ? val : Math.floor(Math.random() * 100);
                               onCommand?.(ctrl.method!, [arg]);
                           }}
                           disabled={isPlaying}
                           className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded border border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                       >
                           {ctrl.label}
                       </button>
                   )
                }
                return null;
            })}
        </div>
      )}

      {/* 2. CONTROLES DE REPRODUCCIÓN ESTÁNDAR (Play, Step, Reset, Speed) */}
      <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-700 text-sm">
        
        {/* Botón Play/Pause */}
        <button
          onClick={onTogglePlay}
          className={`px-4 py-2 rounded font-bold transition-colors ${
            isPlaying 
              ? 'bg-amber-600 hover:bg-amber-500 text-white' 
              : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>

        {/* Botón Step Forward */}
        <button
            onClick={onNext}
            disabled={isPlaying}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50 text-white transition-colors"
            title="Avanzar un paso"
        >
            Step &rarr;
        </button>

        {/* Botón Reset */}
        <button
            onClick={() => {
                // Enviar el primer valor del input (ej: 'n' para N-Queens) si existe
                // Esto permite reiniciar N-Queens con un tamaño diferente
                const values = Object.values(inputValues);
                onReset(values.length > 0 ? values[0] : undefined);
            }}
            className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-800 rounded transition-colors"
        >
            Reset
        </button>

        <div className="w-px h-8 bg-slate-600 mx-2 hidden sm:block"></div>

        {/* Slider de Velocidad */}
        <div className="hidden sm:flex items-center gap-2">
            <span className="text-slate-400">Speed:</span>
            <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={1050 - speed} 
                onChange={(e) => onSpeedChange(1050 - Number(e.target.value))}
                className="w-24 accent-blue-500 cursor-pointer"
                title="Ajustar velocidad de animación"
            />
        </div>

        {/* Contador de Pasos */}
        <div className="ml-auto text-slate-500 font-mono text-xs sm:text-sm">
            Steps: <span className="text-blue-400">{stepCount}</span>
        </div>
      </div>
    </div>
  );
};