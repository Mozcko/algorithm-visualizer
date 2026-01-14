// src/hooks/useAlgorithmRunner.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import type { AlgorithmDefinition, SimulationStep } from '../algorithms/types';

export function useAlgorithmRunner<T>(algorithm: AlgorithmDefinition<T>) {
  // Estado de la reproducción
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [speed, setSpeed] = useState(500); // ms entre pasos
  
  // Estado de los datos visuales
  const [currentStep, setCurrentStep] = useState<SimulationStep<T> | null>(null);

  // Referencias para mantener persistencia sin re-renderizar
  const generatorRef = useRef<Generator<SimulationStep<T>, void, unknown> | null>(null);
  const timerRef = useRef<number | null>(null);

  // Inicializar o Reiniciar la simulación
  const reset = useCallback(() => {
    stop();
    const initialData = algorithm.generateInput();
    generatorRef.current = algorithm.run(initialData);
    
    // Ejecutar el primer paso inmediatamente para mostrar el estado inicial
    const firstStep = generatorRef.current.next();
    if (!firstStep.done) {
      setCurrentStep(firstStep.value);
    }
    setStepCount(0);
  }, [algorithm]);

  // Ejecutar un solo paso (Next)
  const nextStep = useCallback(() => {
    if (!generatorRef.current) return;

    const { value, done } = generatorRef.current.next();

    if (done) {
      setIsPlaying(false);
      return;
    }

    setCurrentStep(value);
    setStepCount((prev) => prev + 1);
  }, []);

  // Control del Loop de Tiempo (Play/Pause)
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(nextStep, speed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, nextStep]);

  // Inicializar al montar el componente
  useEffect(() => {
    reset();
  }, [reset]);

  return {
    // Estado
    currentStep,
    isPlaying,
    speed,
    stepCount,
    // Acciones
    setSpeed,
    togglePlay: () => setIsPlaying((p) => !p),
    stepForward: nextStep,
    reset,
  };
}