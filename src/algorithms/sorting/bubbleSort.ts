// src/algorithms/sorting/bubbleSort.ts
import type { AlgorithmDefinition } from '../types';

const bubbleSort: AlgorithmDefinition<number[]> = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Sorting', // <--- Importante: categoría en inglés
  visualizer: 'bar-chart',
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  
  generateInput: (size = 20) => Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10),
  
  run: function* (input: number[]) {
    let arr = [...input];
    let n = arr.length;
    let swapped;

    yield { 
        data: [...arr], 
        description: 'Starting: Unsorted array' 
    };

    for (let i = 0; i < n - 1; i++) {
      swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight elements being compared
        yield { 
            data: [...arr], 
            highlightedIndices: [j, j + 1], 
            description: `Comparing ${arr[j]} and ${arr[j+1]}` 
        };

        if (arr[j] > arr[j + 1]) {
          // Swap logic
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;

          // Highlight swap
          yield { 
              data: [...arr], 
              highlightedIndices: [j, j + 1], 
              description: `Swapping ${arr[j+1]} and ${arr[j]}` 
          };
        }
      }
      
      if (!swapped) break;
    }

    yield { 
        data: [...arr], 
        highlightedIndices: [], 
        description: 'Sorting completed!' 
    };
  }
};

export default bubbleSort;