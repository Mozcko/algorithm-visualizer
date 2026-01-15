import type { AlgorithmDefinition } from '../types';

const subsetSum: AlgorithmDefinition<number[]> = {
  id: 'subset-sum',
  name: 'Subset Sum',
  category: 'Backtracking',
  visualizer: 'bar-chart',
  description: 'Finds a subset of numbers that add up to a specific target. The target is randomly generated from the input data to guarantee a solution exists.',
  
  // 1. Generate purely random numbers
  generateInput: (size = 10) => {
      // Generate numbers between 1 and 20
      return Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1);
  },
  
  run: function* (input: number[]) {
    const arr = [...input];
    
    // 2. SECRET SAUCE: Pick a random valid target from the data itself
    // We simulate a coin flip for each number to decide if it's in the "target subset"
    const randomSubset = arr.filter(() => Math.random() > 0.5);
    // If empty, pick at least the first one
    if (randomSubset.length === 0) randomSubset.push(arr[0]);
    
    const target = randomSubset.reduce((a, b) => a + b, 0);

    // --- The Algorithm (Same as before, but using dynamic target) ---
    
    function* backtrack(index: number, currentSum: number, pathIndices: number[]): Generator<any, boolean, any> {
        // Visual Update
        yield {
            data: [...arr],
            highlightedIndices: [...pathIndices, index],
            description: `Target: ${target} | Current Sum: ${currentSum} | Checking index ${index} (${arr[index]})`
        };

        if (currentSum === target) {
            yield {
                data: [...arr],
                highlightedIndices: [...pathIndices],
                description: `SOLUTION FOUND! Subset sums to ${target}.`
            };
            return true;
        }

        if (index >= arr.length || currentSum > target) return false;

        // Include
        pathIndices.push(index);
        if (yield* backtrack(index + 1, currentSum + arr[index], pathIndices)) return true;

        // Exclude (Backtrack)
        pathIndices.pop();
        if (yield* backtrack(index + 1, currentSum, pathIndices)) return true;

        return false;
    }

    yield { data: [...arr], description: `Generated Target: ${target}. Looking for subset...` };
    
    const found = yield* backtrack(0, 0, []);

    if (!found) {
        yield { data: [...arr], highlightedIndices: [], description: 'No solution found (Search exhausted).' };
    }
  }
};

export default subsetSum;