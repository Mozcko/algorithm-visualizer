import type { AlgorithmDefinition } from '../types';

const quickSort: AlgorithmDefinition<number[]> = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'Sorting',
  visualizer: 'bar-chart',
  description: 'An efficient, divide-and-conquer sorting algorithm. It works by selecting a "pivot" element and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.',
  
  generateInput: (size = 20) => Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10),
  
  run: function* (input: number[]) {
    let arr = [...input];

    function* partition(low: number, high: number): Generator<any, number, any> {
        let pivot = arr[high];
        let i = (low - 1);

        yield { 
            data: [...arr], 
            highlightedIndices: [high], 
            description: `Pivot selected: ${pivot}` 
        };

        for (let j = low; j < high; j++) {
            yield { 
                data: [...arr], 
                highlightedIndices: [j, high], 
                description: `Comparing ${arr[j]} with pivot ${pivot}` 
            };

            if (arr[j] < pivot) {
                i++;
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                yield { 
                    data: [...arr], 
                    highlightedIndices: [i, j], 
                    description: `Swapping ${arr[i]} and ${arr[j]}` 
                };
            }
        }
        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        yield { 
            data: [...arr], 
            highlightedIndices: [i + 1, high], 
            description: `Moving pivot to correct position` 
        };

        return i + 1;
    }

    function* quickSortHelper(low: number, high: number): Generator<any, void, any> {
        if (low < high) {
            let pi = yield* partition(low, high);
            yield* quickSortHelper(low, pi - 1);
            yield* quickSortHelper(pi + 1, high);
        }
    }

    yield { 
        data: [...arr], 
        description: 'Starting Quick Sort' 
    };

    yield* quickSortHelper(0, arr.length - 1);

    yield { 
        data: [...arr], 
        highlightedIndices: [], 
        description: 'Sorting completed!' 
    };
  }
};

export default quickSort;