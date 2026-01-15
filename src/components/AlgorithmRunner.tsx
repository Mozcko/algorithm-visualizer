// src/components/AlgorithmRunner.tsx
import React, { useState, useEffect } from 'react';
import type { AlgorithmDefinition, GridState, GraphState } from '../algorithms/types';
import { useAlgorithmRunner } from '../hooks/useAlgorithmRunner';
import { Controls } from './common/Controls';
import { loadAlgorithm } from '../utils/algorithmLoader';
import { Grid2D } from './renderers/Grid2D';
import { GraphRenderer } from './renderers/GraphRenderer';
import { Terrain3D } from './renderers/Terrain3D';

// --- Type Guards (Validaciones de seguridad) ---
function isGraphState(data: any): data is GraphState {
  return data && Array.isArray(data.nodes) && Array.isArray(data.edges);
}

function isGridState(data: any): data is GridState {
  return Array.isArray(data) && Array.isArray(data[0]) && 'row' in data[0][0];
}

function isNumberArray(data: any): data is number[] {
  return Array.isArray(data) && typeof data[0] === 'number';
}

// --- Visualizador Temporal (Bar Chart) ---
const BarChartRenderer = ({ data, active }: { data: number[]; active?: number[] }) => (
  <div className="flex items-end gap-1 h-full w-full px-8 pb-4">
    {data.map((value, idx) => (
      <div
        key={idx}
        style={{ height: `${value}%` }}
        className={`flex-1 rounded-t transition-all duration-200 ${
            active?.includes(idx) 
              ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
              : 'bg-blue-600'
        }`}
      ></div>
    ))}
  </div>
);

// -----------------------------------------

interface Props {
  algorithmId: string;
}

export default function AlgorithmRunner({ algorithmId }: Props) {
  const [algorithm, setAlgorithm] = useState<AlgorithmDefinition | null>(null);

  useEffect(() => {
    setAlgorithm(null); 
    loadAlgorithm(algorithmId).then((loadedAlgo) => {
      setAlgorithm(loadedAlgo);
    });
  }, [algorithmId]);

  if (!algorithm) return (
    <div className="w-full aspect-video flex items-center justify-center text-slate-500 animate-pulse bg-slate-900 rounded-lg border border-slate-800">
      Cargando lógica del algoritmo...
    </div>
  );

  return <RunnerInternal algorithm={algorithm} />;
}

function RunnerInternal({ algorithm }: { algorithm: AlgorithmDefinition }) {
  const { 
    currentStep, 
    isPlaying, 
    togglePlay, 
    stepForward, 
    reset, 
    speed, 
    setSpeed, 
    stepCount,
    runCommand 
  } = useAlgorithmRunner(algorithm);

  if (!currentStep) return <div className="text-slate-500">Inicializando...</div>;

  const { data } = currentStep;

  return (
    // Responsive Gap: gap-4 on mobile, gap-6 on larger screens
    <div className="w-full flex flex-col gap-4 sm:gap-6">
      
      {/* --- AREA DE VISUALIZACIÓN --- */}
      {/* Responsive Aspect Ratio: aspect-square (mobile) -> aspect-video (desktop) */}
      <div className="w-full aspect-square md:aspect-video bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden p-2 sm:p-4 shadow-inner">
        
        {/* 1. Sorting (Bar Chart) */}
        {algorithm.visualizer === 'bar-chart' && (
          isNumberArray(data) 
            ? <BarChartRenderer data={data} active={currentStep.highlightedIndices} />
            : <div className="text-slate-500 text-sm">Esperando datos numéricos...</div>
        )}

        {/* 2. Pathfinding (Grid 2D) */}
        {algorithm.visualizer === 'grid-2d' && (
           isGridState(data)
            ? <Grid2D grid={data} />
            : <div className="text-slate-500 text-sm">Esperando estructura de grilla...</div>
        )}
        
        {/* 3. Estructuras de Datos (Grafos/Árboles) */}
        {algorithm.visualizer === 'primitive-graph' && (
            isGraphState(data)
             ? <GraphRenderer data={data} />
             : <div className="text-slate-500 text-sm">
                 Procesando estructura...
               </div>
        )}

        {/* 4. Terrain 3D */}
        {algorithm.visualizer === 'terrain-3d' && (
           (Array.isArray(data) && Array.isArray(data[0]) && typeof data[0][0] === 'number')
            ? <Terrain3D terrain={data as number[][]} />
            : <div className="text-slate-500">Generating Terrain Map...</div>
        )}

        {/* Fallback */}
        {!['bar-chart', 'grid-2d', 'primitive-graph', 'terrain-3d'].includes(algorithm.visualizer) && (
           <div className="text-center">
             <p className="text-red-400 font-bold mb-2">Visualizador no encontrado</p>
             <p className="text-slate-500 text-sm">
               El tipo '{algorithm.visualizer}' no tiene un componente asignado.
             </p>
           </div>
        )}

        {/* Overlay de Descripción */}
        <div className="absolute top-4 left-4 bg-slate-950/90 text-blue-200 px-4 py-2 rounded-md text-sm border border-blue-900/50 shadow-lg backdrop-blur-sm z-20">
           <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Estado Actual</span>
           {currentStep.description || "Listo"}
        </div>
      </div>

      {/* --- CONTROLES --- */}
      <Controls 
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onNext={stepForward}
        onReset={reset}
        speed={speed}
        onSpeedChange={setSpeed}
        stepCount={stepCount}
        customControls={algorithm.controls}
        onCommand={runCommand}
      />
    </div>
  );
}