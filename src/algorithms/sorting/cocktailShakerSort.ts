import type { AlgorithmDefinition } from '../types';

const cocktailShakerSort: AlgorithmDefinition<number[]> = {
  id: 'cocktail-shaker-sort',
  name: 'Cocktail Shaker Sort',
  category: 'Sorting',
  visualizer: 'bar-chart',
  description: 'A variation of Bubble Sort that sorts in both directions on each pass through the list. While marginally more efficient than Bubble Sort, it is still O(n²).',
  
  generateInput: (size = 20) => Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10),
  
  run: function* (input: number[]) {
    let arr = [...input];
    let start = 0;
    let end = arr.length - 1;
    let swapped = true;

    yield { 
        data: [...arr], 
        description: 'Starting Cocktail Shaker Sort' 
    };

    while (swapped) {
      swapped = false;

      // Forward pass
      for (let i = start; i < end; i++) {
        yield { 
            data: [...arr], 
            highlightedIndices: [i, i + 1], 
            description: `Forward: Comparing ${arr[i]} and ${arr[i+1]}` 
        };
        if (arr[i] > arr[i + 1]) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          swapped = true;
          yield { 
            data: [...arr], 
            highlightedIndices: [i, i + 1], 
            description: `Forward: Swapping ${arr[i]} and ${arr[i+1]}` 
          };
        }
      }

      if (!swapped) break;

      swapped = false;
      end--;

      // Backward pass
      for (let i = end - 1; i >= start; i--) {
        yield { data: [...arr], highlightedIndices: [i, i + 1], description: `Backward: Comparing ${arr[i]} and ${arr[i+1]}` };
        if (arr[i] > arr[i + 1]) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          swapped = true;
          yield { data: [...arr], highlightedIndices: [i, i + 1], description: `Backward: Swapping ${arr[i]} and ${arr[i+1]}` };
        }
      }
      start++;
    }

    yield { data: [...arr], highlightedIndices: [], description: 'Sorting completed!' };
  }
};

export default cocktailShakerSort;