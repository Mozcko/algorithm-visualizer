// src/utils/algorithmLoader.ts
import type { AlgorithmDefinition } from '../algorithms/types';

// Cargamos todos los algoritmos disponibles
const algorithmsImport = import.meta.glob('../algorithms/**/*.ts');

export async function loadAlgorithm(id: string): Promise<AlgorithmDefinition | null> {
  // Buscamos en los archivos importados aquel que coincida con el ID
  for (const path in algorithmsImport) {
    // Importamos el módulo dinámicamente
    const module = await algorithmsImport[path]() as any;
    const algo = module.default as AlgorithmDefinition;
    
    if (algo.id === id) {
      return algo;
    }
  }
  return null;
}