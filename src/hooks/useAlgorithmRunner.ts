// src/hooks/useAlgorithmRunner.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import type { AlgorithmDefinition, SimulationStep } from '../algorithms/types';

export function useAlgorithmRunner<T>(algorithm: AlgorithmDefinition<T>) {
  // --- Estados ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [stepCount, setStepCount] = useState(0);
  const [currentStep, setCurrentStep] = useState<SimulationStep<T> | null>(null);

  // --- Referencias ---
  // El generador actual (la "película" que se está reproduciendo)
  const generatorRef = useRef<Generator<SimulationStep<T>, void, unknown> | null>(null);
  // El timer del setInterval
  const timerRef = useRef<number | null>(null);
  
  // ESTADO LÓGICO: Guardamos la estructura real de datos (ej. el objeto Árbol completo)
  // Independiente de lo que se esté dibujando en pantalla.
  const logicalStateRef = useRef<T | null>(null);

  // --- Inicialización / Reset ---
  const reset = useCallback(() => {
    // 1. Detener cualquier reproducción
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
    setIsPlaying(false);
    
    // 2. Generar el estado inicial fresco
    const initialData = algorithm.generateInput();
    logicalStateRef.current = initialData; // Guardamos el estado lógico base

    // 3. Configurar el generador
    // Si tiene un método 'run' automático (Sorting/Pathfinding), lo iniciamos
    if (algorithm.run) {
      generatorRef.current = algorithm.run(initialData);
      
      // Ejecutamos el primer paso inmediatamente para que se vea algo
      const first = generatorRef.current.next();
      if (!first.done) {
          setCurrentStep(first.value);
      }
    } else {
      // Modo Interactivo (Estructuras de Datos): Solo mostramos el estado inicial
      // Creamos un paso "falso" de inicio
      setCurrentStep({ 
          data: initialData, // Puede ser null o un objeto vacío
          description: 'Ready' 
      });
      generatorRef.current = null;
    }
    setStepCount(0);
  }, [algorithm]);

  // --- Ejecución de Comandos Interactivos (Insert, Delete, etc.) ---
  const runCommand = useCallback((methodName: string, args: any[]) => {
    if (!algorithm.methods || !algorithm.methods[methodName]) {
        console.warn(`Método '${methodName}' no encontrado en el algoritmo.`);
        return;
    }
    
    // 1. Obtenemos el generador de la operación específica
    // Usamos el estado lógico actual como base
    const operationGenerator = algorithm.methods[methodName](logicalStateRef.current!, ...args);
    
    // 2. Lo asignamos como el generador activo
    generatorRef.current = operationGenerator;
    
    // 3. Damos Play automáticamente para ver la animación
    setIsPlaying(true);
  }, [algorithm]);


  // --- Loop Principal (Next Step) ---
  const nextStep = useCallback(() => {
    if (!generatorRef.current) {
        setIsPlaying(false);
        return;
    }

    const { value, done } = generatorRef.current.next();

    if (done) {
      setIsPlaying(false);
      generatorRef.current = null; // Limpiamos al terminar la operación
      return;
    }

    // 1. Actualizamos la vista
    setCurrentStep(value);
    
    // 2. Actualizamos el estado lógico (CON PROTECCIÓN)
    // Esto es crucial: Algunos algoritmos devuelven una proyección visual (GraphState)
    // en lugar del objeto real. No queremos sobrescribir nuestro Árbol con un dibujo.
    if (value.data) {
        const data: any = value.data;
        
        // Detectamos si es un objeto visual (Heurística simple)
        const isGraph = data.nodes && Array.isArray(data.nodes) && data.edges;
        const isGrid = Array.isArray(data) && Array.isArray(data[0]) && 'row' in data[0][0];

        // Solo actualizamos el estado lógico si NO parece ser un estado puramente visual
        // O si es la primera inicialización de un objeto (cuando T y visual coinciden o son null)
        if (!isGraph && !isGrid) {
            logicalStateRef.current = value.data as T;
        }
    }
    
    setStepCount((prev) => prev + 1);
  }, []);

  // --- Efecto del Timer (Play/Pause) ---
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(nextStep, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, nextStep]);

  // Reiniciar cuando cambia el algoritmo
  useEffect(() => { reset(); }, [reset]);

  return {
    currentStep,
    isPlaying,
    speed,
    stepCount,
    setSpeed,
    togglePlay: () => setIsPlaying((p) => !p),
    stepForward: nextStep,
    reset,
    runCommand // <--- Exportado para la UI
  };
}