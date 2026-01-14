import type { AlgorithmDefinition } from '../types';

const selectionSort: AlgorithmDefinition<number[]> = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'Sorting',
  visualizer: 'bar-chart',
  description: 'Sorts an array by repeatedly finding the minimum element from the unsorted part and putting it at the beginning.',
  
  generateInput: (size = 20) => Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10),
  
  run: function* (input: number[]) {
    let arr = [...input];
    let n = arr.length;

    yield { 
        data: [...arr], 
        description: 'Starting: Unsorted array' 
    };

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      
      for (let j = i + 1; j < n; j++) {
        yield { 
            data: [...arr], 
            highlightedIndices: [j, minIdx], 
            description: `Comparing ${arr[j]} with current minimum ${arr[minIdx]}` 
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
            description: `Swapping minimum ${arr[i]} with ${arr[minIdx]}` 
        };
      }
    }

    yield { 
        data: [...arr], 
        highlightedIndices: [], 
        description: 'Sorting completed!' 
    };
  }
};

export default selectionSort;