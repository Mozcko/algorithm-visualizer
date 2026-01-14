// src/components/common/Controls.tsx
import React from 'react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (val: number) => void;
  stepCount: number;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onReset,
  speed,
  onSpeedChange,
  stepCount
}) => {
  return (
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

      {/* Botón Next Step */}
      <button
        onClick={onNext}
        disabled={isPlaying}
        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50 text-white"
      >
        Step &rarr;
      </button>

      {/* Botón Reset */}
      <button
        onClick={onReset}
        className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-800 rounded"
      >
        Reset
      </button>

      <div className="w-px h-8 bg-slate-600 mx-2"></div>

      {/* Control de Velocidad */}
      <div className="flex items-center gap-2">
        <span className="text-slate-400">Speed:</span>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={1050 - speed} // Invertimos para que derecha sea más rápido
          onChange={(e) => onSpeedChange(1050 - Number(e.target.value))}
          className="w-24 accent-blue-500"
        />
      </div>

      <div className="ml-auto text-slate-500 font-mono">
        Steps: <span className="text-blue-400">{stepCount}</span>
      </div>
    </div>
  );
};