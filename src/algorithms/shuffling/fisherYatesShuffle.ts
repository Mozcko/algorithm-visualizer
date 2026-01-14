import type { AlgorithmDefinition } from '../types';

const fisherYatesShuffle: AlgorithmDefinition<number[]> = {
  id: 'fisher-yates-shuffle',
  name: 'Fisher-Yates Shuffle',
  category: 'Shuffling',
  visualizer: 'bar-chart',
  description: 'The Fisher-Yates shuffle (or Knuth shuffle) is an algorithm for generating a random permutation of a finite sequence. It is unbiased, meaning that every permutation is equally likely.',
  
  // Start with a sorted array to clearly visualize the shuffling process
  generateInput: (size = 20) => Array.from({ length: size }, (_, i) => Math.floor((i / (size - 1)) * 90) + 5),
  
  run: function* (input: number[]) {
    let arr = [...input];
    let n = arr.length;

    yield { 
        data: [...arr], 
        description: 'Starting: Sorted array' 
    };

    // Iterate from the last element down to the second element
    for (let i = n - 1; i > 0; i--) {
      // Pick a random index from 0 to i
      let j = Math.floor(Math.random() * (i + 1));

      yield { 
          data: [...arr], 
          highlightedIndices: [i, j], 
          description: `Selected index ${i} and random index ${j}` 
      };

      // Swap arr[i] with the element at random index
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
        description: 'Shuffling completed!' 
    };
  }
};

export default fisherYatesShuffle;