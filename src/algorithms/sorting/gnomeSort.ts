import type { AlgorithmDefinition } from '../types';

const gnomeSort: AlgorithmDefinition<number[]> = {
  id: 'gnome-sort',
  name: 'Gnome Sort',
  category: 'Sorting',
  visualizer: 'bar-chart',
  description: 'A sorting algorithm originally proposed by Hamid Sarbazi-Azad (called Stupid sort). It is similar to insertion sort, except that moving an element to its proper place is accomplished by a series of swaps.',
  
  generateInput: (size = 20) => Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10),
  
  run: function* (input: number[]) {
    let arr = [...input];
    let index = 0;
    let n = arr.length;

    yield { data: [...arr], description: 'Starting Gnome Sort' };

    while (index < n) {
      if (index === 0) {
        index++;
      }
      
      yield { 
          data: [...arr], 
          highlightedIndices: [index, index - 1], 
          description: `Comparing index ${index} and ${index-1}` 
      };
      
      if (arr[index] >= arr[index - 1]) {
        index++;
      } else {
        [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
        yield { 
            data: [...arr], 
            highlightedIndices: [index, index - 1], 
            description: `Swapping ${arr[index]} and ${arr[index-1]}` 
        };
        index--;
      }
    }

    yield { data: [...arr], highlightedIndices: [], description: 'Sorting completed!' };
  }
};

export default gnomeSort;