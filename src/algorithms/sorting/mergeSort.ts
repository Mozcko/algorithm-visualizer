import type { AlgorithmDefinition } from '../types';

const mergeSort: AlgorithmDefinition<number[]> = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'Sorting',
  visualizer: 'bar-chart',
  description: 'An efficient, stable, divide-and-conquer sorting algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
  
  generateInput: (size = 20) => Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10),
  
  run: function* (input: number[]) {
    let arr = [...input];

    function* merge(l: number, m: number, r: number) {
        let n1 = m - l + 1;
        let n2 = r - m;
        
        // Create temp arrays
        let L = new Array(n1);
        let R = new Array(n2);
        
        for (let i = 0; i < n1; i++) L[i] = arr[l + i];
        for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
        
        let i = 0;
        let j = 0;
        let k = l;
        
        while (i < n1 && j < n2) {
            yield { 
                data: [...arr], 
                highlightedIndices: [l + i, m + 1 + j], 
                description: `Comparing ${L[i]} and ${R[j]}` 
            };

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            yield { 
                data: [...arr], 
                highlightedIndices: [k], 
                description: `Merging: Placed ${arr[k]} at index ${k}` 
            };
            k++;
        }
        
        while (i < n1) {
            arr[k] = L[i];
            yield { 
                data: [...arr], 
                highlightedIndices: [k], 
                description: `Merging remaining L: Placed ${arr[k]} at index ${k}` 
            };
            i++;
            k++;
        }
        
        while (j < n2) {
            arr[k] = R[j];
            yield { 
                data: [...arr], 
                highlightedIndices: [k], 
                description: `Merging remaining R: Placed ${arr[k]} at index ${k}` 
            };
            j++;
            k++;
        }
    }

    function* mergeSortHelper(l: number, r: number): Generator<any, void, any> {
        if (l >= r) {
            return;
        }
        let m = l + Math.floor((r - l) / 2);
        yield* mergeSortHelper(l, m);
        yield* mergeSortHelper(m + 1, r);
        yield* merge(l, m, r);
    }

    yield { 
        data: [...arr], 
        description: 'Starting Merge Sort' 
    };

    yield* mergeSortHelper(0, arr.length - 1);

    yield { 
        data: [...arr], 
        highlightedIndices: [], 
        description: 'Sorting completed!' 
    };
  }
};

export default mergeSort;