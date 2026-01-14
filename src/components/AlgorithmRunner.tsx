// src/components/AlgorithmRunner.tsx
import React, { useState, useEffect } from 'react';
import type { AlgorithmDefinition } from '../algorithms/types';
import { useAlgorithmRunner } from '../hooks/useAlgorithmRunner';
import { Controls } from './common/Controls';
import { loadAlgorithm } from '../utils/algorithmLoader'; // <--- Importamos el loader

// --- Visualizador Temporal ---
const BarChartRenderer = ({ data, active }: { data: number[]; active?: number[] }) => (
  <div className="flex items-end gap-1 h-full w-full px-8 pb-4">
    {data.map((value, idx) => (
      <div
        key={idx}
        style={{ height: `${value}%` }}
        className={`flex-1 rounded-t transition-all duration-200 ${
            active?.includes(idx) ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-blue-600'
        }`}
      ></div>
    ))}
  </div>
);
// -----------------------------

interface Props {
  algorithmId: string; // <--- Cambiamos: Ahora solo pedimos el ID string
}

export default function AlgorithmRunner({ algorithmId }: Props) {
  const [algorithm, setAlgorithm] = useState<AlgorithmDefinition | null>(null);

  // 1. Efecto para cargar el algoritmo REAL (con funciones) basado en el ID
  useEffect(() => {
    loadAlgorithm(algorithmId).then((loadedAlgo) => {
      setAlgorithm(loadedAlgo);
    });
  }, [algorithmId]);

  // Si aún no carga el algoritmo, mostramos loading
  if (!algorithm) return <div className="text-slate-500 animate-pulse">Cargando lógica del algoritmo...</div>;

  return <RunnerInternal algorithm={algorithm} />;
}

// Separamos la parte interna para que el Hook se inicialice solo cuando 'algorithm' ya existe
function RunnerInternal({ algorithm }: { algorithm: AlgorithmDefinition }) {
  const { 
    currentStep, isPlaying, togglePlay, stepForward, reset, speed, setSpeed, stepCount 
  } = useAlgorithmRunner(algorithm);

  if (!currentStep) return <div className="text-slate-500">Inicializando...</div>;

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* VISTA */}
      <div className="w-full aspect-video bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden p-4 shadow-inner">
        
        {algorithm.visualizer === 'bar-chart' && (
          <BarChartRenderer 
            data={currentStep.data as number[]} 
            active={currentStep.highlightedIndices} 
          />
        )}
        
        {algorithm.visualizer !== 'bar-chart' && (
           <p className="text-slate-500">Visualizador '{algorithm.visualizer}' no implementado.</p>
        )}

        {/* Overlay de Descripción */}
        <div className="absolute top-4 left-4 bg-slate-950/90 text-blue-200 px-4 py-2 rounded-md text-sm border border-blue-900/50 shadow-lg backdrop-blur-sm">
           <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Estado Actual</span>
           {currentStep.description || "Listo"}
        </div>
      </div>

      {/* CONTROLES */}
      <Controls 
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onNext={stepForward}
        onReset={reset}
        speed={speed}
        onSpeedChange={setSpeed}
        stepCount={stepCount}
      />
    </div>
  );
}