// src/utils/stateGuards.ts
import type { GraphState, GridState } from '../algorithms/types';

export function isGraphState(data: unknown): data is GraphState {
  if (typeof data !== 'object' || data === null) return false;
  const candidate = data as Partial<GraphState>;
  return Array.isArray(candidate.nodes) && Array.isArray(candidate.edges);
}

export function isGridState(data: unknown): data is GridState {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return false;
  const firstCell: unknown = data[0][0];
  // El chequeo de 'object' evita que 'in' lance un TypeError con number[][] (Terrain)
  return typeof firstCell === 'object' && firstCell !== null && 'row' in firstCell;
}
