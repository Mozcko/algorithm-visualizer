import type { AlgorithmDefinition } from '../types';

const shellSort: AlgorithmDefinition<number[]> = {
  id: 'shell-sort',
  name: 'Shell Sort',
  category: 'Sorting',
  visualizer: 'bar-chart',
  description: 'An in-place comparison sort. It starts by sorting pairs of elements far apart from each other, then progressively reducing the gap between elements to be compared.',
  
  generateInput: (size = 20) => Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10),
  
  run: function* (input: number[]) {
    let arr = [...input];
    let n = arr.length;

    yield { data: [...arr], description: 'Starting Shell Sort' };

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      yield { 
          data: [...arr], 
          description: `Gap size: ${gap}` 
      };
      
      for (let i = gap; i < n; i++) {
        let temp = arr[i];
        let j;
        
        yield { 
            data: [...arr], 
            highlightedIndices: [i], 
            description: `Current element: ${temp}` 
        };

        for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
          yield { 
              data: [...arr], 
              highlightedIndices: [j, j - gap], 
              description: `Comparing ${arr[j-gap]} > ${temp}` 
          };
          arr[j] = arr[j - gap];
          yield { data: [...arr], highlightedIndices: [j, j - gap], description: `Moving ${arr[j]} to position ${j}` };
        }
        
        arr[j] = temp;
        yield { data: [...arr], highlightedIndices: [j], description: `Placed ${temp} at position ${j}` };
      }
    }

    yield { data: [...arr], highlightedIndices: [], description: 'Sorting completed!' };
  }
};

export default shellSort;