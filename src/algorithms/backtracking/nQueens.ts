// src/algorithms/backtracking/nQueens.ts
import type { AlgorithmDefinition, GridState, GridNode } from '../types';

const nQueens: AlgorithmDefinition<GridState> = {
  id: 'n-queens',
  name: 'N-Queens Solver',
  category: 'Backtracking',
  visualizer: 'grid-2d',
  description: 'Place N queens on an N×N chessboard so that no two queens attack each other.',

  // Control para cambiar el tamaño del tablero
  controls: [
    { type: 'input-number', label: 'Size (N)', id: 'n', defaultValue: 4 }, // Empezamos con 4 para que sea rápido
    // El botón Play normal inicia el 'run'
  ],

  generateInput: (size = 4) => {
    // Generamos tablero vacío NxN
    // Validación de seguridad para no explotar el navegador
    const n = Math.min(Math.max(size, 4), 10); 
    
    return Array.from({ length: n }, (_, r) => 
      Array.from({ length: n }, (_, c) => ({
        row: r, col: c,
        value: '',
        customBg: (r + c) % 2 === 0 ? '#1e293b' : '#0f172a' // Colores de tablero de ajedrez (Slate-800/900)
      }))
    );
  },

  run: function* (grid: GridState) {
    const n = grid.length;

    // Helper para limpiar visualmente los ataques (rojos) pero dejar las reinas
    const clearAttacks = (currentGrid: GridState) => {
        return currentGrid.map(row => row.map(node => ({
            ...node,
            customBg: node.value === '♛' 
                ? '#22c55e' // Reina confirmada (verde)
                : ((node.row + node.col) % 2 === 0 ? '#1e293b' : '#0f172a') // Tablero normal
        })));
    };

    // Helper para copiar grilla
    const copyGrid = (g: GridState) => g.map(row => row.map(node => ({ ...node })));

    // --- FUNCIÓN RECURSIVA (Simulada con generador) ---
    // Tratamos de poner una reina en la columna 'col'
    function* solve(col: number, currentGrid: GridState): Generator<any, boolean, any> {
        // CASO BASE: Si hemos colocado reinas en todas las columnas, ¡éxito!
        if (col >= n) {
            return true;
        }

        // Intentar todas las filas en esta columna
        for (let row = 0; row < n; row++) {
            
            // 1. Visualizar que estamos considerando esta casilla
            currentGrid[row][col].customBg = '#fbbf24'; // Amarillo (Investigando)
            yield { 
                data: copyGrid(currentGrid), 
                description: `Checking position [${row}, ${col}]...` 
            };

            // 2. Verificar si es seguro
            if (isSafe(currentGrid, row, col, n)) {
                // ¡Es seguro! Colocar Reina
                currentGrid[row][col].value = '♛';
                currentGrid[row][col].customBg = '#22c55e'; // Verde
                
                yield { 
                    data: copyGrid(currentGrid), 
                    description: `Placed Queen at [${row}, ${col}]` 
                };

                // RECURSIÓN: Intentar poner el resto de reinas
                if (yield* solve(col + 1, currentGrid)) {
                    return true; // Encontramos solución completa
                }

                // BACKTRACKING: Si volvemos aquí, es que el camino no sirvió.
                // Quitamos la reina y probamos la siguiente fila.
                currentGrid[row][col].value = ''; // Borrar
                currentGrid[row][col].customBg = '#ef4444'; // Rojo (Fallo/Retroceso)
                
                yield { 
                    data: copyGrid(currentGrid), 
                    description: `Backtracking from [${row}, ${col}]` 
                };
                
                // Limpiar color rojo rápido
                currentGrid[row][col].customBg = (row + col) % 2 === 0 ? '#1e293b' : '#0f172a';

            } else {
                // No es seguro
                currentGrid[row][col].customBg = '#ef4444'; // Rojo (Ataque detectado)
                yield { 
                    data: copyGrid(currentGrid), 
                    description: `Conflict at [${row}, ${col}]!` 
                };
                // Restaurar color
                currentGrid[row][col].customBg = (row + col) % 2 === 0 ? '#1e293b' : '#0f172a';
            }
        }
        return false; // No se pudo poner reina en ninguna fila de esta columna
    }

    // Arrancar
    yield* solve(0, grid);
    yield { data: copyGrid(grid), description: 'Solution Found!' };
  }
};

// Lógica de validación de ajedrez
function isSafe(grid: GridState, row: number, col: number, n: number) {
    // 1. Chequear fila hacia la izquierda
    for (let i = 0; i < col; i++) {
        if (grid[row][i].value === '♛') return false;
    }

    // 2. Chequear diagonal superior izquierda
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (grid[i][j].value === '♛') return false;
    }

    // 3. Chequear diagonal inferior izquierda
    for (let i = row, j = col; i < n && j >= 0; i++, j--) {
        if (grid[i][j].value === '♛') return false;
    }

    return true;
}

export default nQueens;