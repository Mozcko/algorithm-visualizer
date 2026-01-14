import type { AlgorithmDefinition } from '../types';

const riffleShuffle: AlgorithmDefinition<number[]> = {
  id: 'riffle-shuffle',
  name: 'Riffle Shuffle',
  category: 'Shuffling',
  visualizer: 'bar-chart',
  description: 'A simulation of the common method of shuffling cards. The deck is cut into two halves, which are then interleaved. A single riffle shuffle is not sufficient to randomize a deck; typically 7 are required for a 52-card deck.',
  
  generateInput: (size = 20) => Array.from({ length: size }, (_, i) => Math.floor((i / (size - 1)) * 90) + 5),
  
  run: function* (input: number[]) {
    let arr = [...input];
    
    // Perform a few riffles to show the effect
    const riffleCount = 3;

    yield { 
        data: [...arr], 
        description: 'Starting: Sorted array' 
    };

    for (let r = 1; r <= riffleCount; r++) {
        // Cut the deck near the middle (with some variance)
        const cutPoint = Math.floor(arr.length / 2) + Math.floor(Math.random() * (arr.length / 5)) - Math.floor(arr.length / 10);
        const left = arr.slice(0, cutPoint);
        const right = arr.slice(cutPoint);
        
        yield {
            data: [...arr],
            highlightedIndices: [cutPoint],
            description: `Riffle ${r}: Cutting deck at index ${cutPoint}`
        };

        let newArr: number[] = [];
        let l = 0;
        let ri = 0;

        // Interleave
        while (l < left.length || ri < right.length) {
            // Probability based on remaining cards in each stack
            let pickLeft = false;
            if (l < left.length && ri < right.length) {
                const leftSize = left.length - l;
                const rightSize = right.length - ri;
                pickLeft = Math.random() < (leftSize / (leftSize + rightSize));
            } else if (l < left.length) {
                pickLeft = true;
            } else {
                pickLeft = false;
            }

            if (pickLeft) newArr.push(left[l++]);
            else newArr.push(right[ri++]);
        }
        
        arr = newArr;
        yield {
            data: [...arr],
            highlightedIndices: [],
            description: `Riffle ${r} completed`
        };
    }

    yield { data: [...arr], highlightedIndices: [], description: 'Shuffling completed!' };
  }
};

export default riffleShuffle;