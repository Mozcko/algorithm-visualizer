import type { AlgorithmDefinition } from '../types';

const insertionSort: AlgorithmDefinition<number[]> = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'Sorting',
  visualizer: 'bar-chart',
  description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
  
  generateInput: (size = 20) => Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10),
  
  run: function* (input: number[]) {
    let arr = [...input];
    let n = arr.length;

    yield { 
        data: [...arr], 
        description: 'Starting: Unsorted array' 
    };

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      yield { 
          data: [...arr], 
          highlightedIndices: [i], 
          description: `Selected key: ${key}` 
      };

      while (j >= 0 && arr[j] > key) {
        yield { 
            data: [...arr], 
            highlightedIndices: [j, j + 1], 
            description: `Comparing ${arr[j]} > ${key}` 
        };

        arr[j + 1] = arr[j];
        
        yield { 
            data: [...arr], 
            highlightedIndices: [j, j + 1], 
            description: `Moving ${arr[j]} to position ${j + 1}` 
        };
        
        j = j - 1;
      }
      arr[j + 1] = key;
      
      yield { 
          data: [...arr], 
          highlightedIndices: [j + 1], 
          description: `Inserted ${key} at position ${j + 1}` 
      };
    }

    yield { 
        data: [...arr], 
        highlightedIndices: [], 
        description: 'Sorting completed!' 
    };
  }
};

export default insertionSort;