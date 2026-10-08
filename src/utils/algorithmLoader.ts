// src/utils/algorithmLoader.ts
import type { AlgorithmDefinition } from '../algorithms/types';

// Cargamos todos los algoritmos disponibles
const algorithmsImport = import.meta.glob('../algorithms/**/*.ts');

export async function loadAlgorithm(id: string): Promise<AlgorithmDefinition | null> {
  // Buscamos en los archivos importados aquel que coincida con el ID
  for (const path in algorithmsImport) {
    // Importamos el módulo dinámicamente
    const module = (await algorithmsImport[path]()) as { default?: AlgorithmDefinition };
    const algo = module.default;

    // Archivos sin export default (ej: types.ts) no son algoritmos
    if (algo?.id === id) {
      return algo;
    }
  }
  return null;
}