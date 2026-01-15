import type { AlgorithmDefinition } from '../types';

const sattoloShuffle: AlgorithmDefinition<number[]> = {
  id: 'sattolo-shuffle',
  name: 'Sattolo’s Algorithm',
  category: 'Shuffling',
  visualizer: 'bar-chart',
  description: 'A variation of Fisher-Yates that generates a random cyclic permutation. The key difference is that an element is swapped with a random element from the lower indices *excluding* itself. This guarantees that no element ends up in its original position.',
  
  generateInput: (size = 20) => Array.from({ length: size }, (_, i) => Math.floor((i / (size - 1)) * 90) + 5),
  
  run: function* (input: number[]) {
    let arr = [...input];
    let n = arr.length;

    yield { 
        data: [...arr], 
        description: 'Starting: Sorted array' 
    };

    // Iterate from the last element down to index 1
    for (let i = n - 1; i > 0; i--) {
      // KEY DIFFERENCE: Pick random index from 0 to i-1 (Exclusive of i)
      // Fisher-Yates uses (i + 1), Sattolo uses (i)
      let j = Math.floor(Math.random() * i);

      yield { 
          data: [...arr], 
          highlightedIndices: [i, j], 
          description: `Selected index ${i} and random index ${j} (excluding ${i})` 
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
        description: 'Cyclic shuffle completed!' 
    };
  }
};

export default sattoloShuffle;