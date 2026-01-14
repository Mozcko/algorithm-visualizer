// src/algorithms/sorting/selectionSort.ts
import type { AlgorithmDefinition } from '../types';

const selectionSort: AlgorithmDefinition<number[]> = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'Sorting',
  visualizer: 'bar-chart',
  description: 'Divides the input list into two parts: a sorted sublist of items which is built up from left to right and a sublist of the remaining unsorted items.',
  
  generateInput: (size = 20) => Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10),
  
  run: function* (input) {
    let arr = [...input];
    let n = arr.length;

    yield { data: [...arr], description: 'Starting Selection Sort' };

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      
      // Highlight the current position we are looking to fill
      yield { 
        data: [...arr], 
        highlightedIndices: [i], 
        description: `Looking for minimum value starting from index ${i}` 
      };

      for (let j = i + 1; j < n; j++) {
        // Highlight current minimum found vs current check
        yield {
          data: [...arr],
          highlightedIndices: [minIdx, j],
          description: `Comparing current min ${arr[minIdx]} with ${arr[j]}`
        };

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          yield {
            data: [...arr],
            highlightedIndices: [minIdx],
            description: `New minimum found: ${arr[minIdx]}`
          };
        }
      }

      if (minIdx !== i) {
        let temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        
        yield {
          data: [...arr],
          highlightedIndices: [i, minIdx],
          description: `Swapped minimum ${arr[i]} to correct position`
        };
      }
    }

    yield { data: [...arr], highlightedIndices: [], description: 'Sorted!' };
  }
};

export default selectionSort;