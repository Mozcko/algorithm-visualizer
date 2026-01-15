import type { AlgorithmDefinition } from '../types';

const naiveShuffle: AlgorithmDefinition<number[]> = {
  id: 'naive-shuffle',
  name: 'Naive Shuffle (Biased)',
  category: 'Shuffling',
  visualizer: 'bar-chart',
  description: 'A common incorrect implementation of shuffling. It swaps each element with a random element from the *entire* array (instead of just the remaining unshuffled portion). This results in n^n permutations rather than n!, leading to a statistically biased result.',
  
  generateInput: (size = 20) => Array.from({ length: size }, (_, i) => Math.floor((i / (size - 1)) * 90) + 5),
  
  run: function* (input: number[]) {
    let arr = [...input];
    let n = arr.length;

    yield { 
        data: [...arr], 
        description: 'Starting: Sorted array' 
    };

    for (let i = 0; i < n; i++) {
      // THE MISTAKE: Picking a random index from the ENTIRE array (0 to n)
      // instead of just the remaining portion.
      let j = Math.floor(Math.random() * n);

      yield { 
          data: [...arr], 
          highlightedIndices: [i, j], 
          description: `i=${i}: Swapping with random index ${j} (from whole array)` 
      };

      [arr[i], arr[j]] = [arr[j], arr[i]];

      yield { 
          data: [...arr], 
          highlightedIndices: [i, j], 
          description: `Swapped elements at ${i} and ${j}` 
      };
    }

    yield { 
        data: [...arr], 
        highlightedIndices: [], 
        description: 'Shuffling completed (with likely bias)' 
    };
  }
};

export default naiveShuffle;