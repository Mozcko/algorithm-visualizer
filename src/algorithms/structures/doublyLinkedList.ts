import type { AlgorithmDefinition, GraphState, GraphNode, GraphEdge } from '../types';

// Estructura lógica interna
class DLLNode {
  id: string;
  value: number;
  next: DLLNode | null = null;
  prev: DLLNode | null = null;
  
  constructor(val: number) {
    this.value = val;
    this.id = `dll-${Math.random().toString(36).substr(2,5)}`;
  }
}

class DoublyLinkedList {
  head: DLLNode | null = null;
  tail: DLLNode | null = null;
  size: number = 0;
}

// Convertidor
const generateGraph = (list: DoublyLinkedList, activeId: string | null = null): GraphState => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  let current = list.head;
  let idx = 0;
  const StartX = 100;
  const Y = 200;
  const Spacing = 120;

  while (current) {
    const x = StartX + (idx * Spacing);
    
    nodes.push({
      id: current.id,
      value: current.value,
      x: x,
      y: Y,
      isActive: current.id === activeId,
      color: current === list.head ? '#8b5cf6' : (current === list.tail ? '#ec4899' : undefined) // Head morado, Tail rosa
    });

    if (current.next) {
      // Flecha Next (Arriba)
      edges.push({
        from: current.id,
        to: current.next.id,
        isDirected: true,
        color: '#94a3b8' // Slate light
      });
      // Flecha Prev (Abajo - Truco visual: invertimos 'from' y 'to')
      edges.push({
        from: current.next.id,
        to: current.id,
        isDirected: true,
        color: '#64748b' // Slate dark
      });
    }

    current = current.next;
    idx++;
  }

  return { nodes, edges, isDirected: true };
};

const dllInteractive: AlgorithmDefinition<DoublyLinkedList> = {
  id: 'doubly-linked-list',
  name: 'Doubly Linked List',
  category: 'Data Structures',
  visualizer: 'primitive-graph',
  description: 'Nodes have pointers to both next and previous nodes.',

  controls: [
    { type: 'input-number', label: 'Val', id: 'val', defaultValue: 99 },
    { type: 'button', label: 'Prepend', id: 'prepend', method: 'prepend' },
    { type: 'button', label: 'Append', id: 'append', method: 'append' },
    { type: 'button', label: 'Delete Head', id: 'delHead', method: 'deleteHead' },
  ],

  generateInput: () => {
    const list = new DoublyLinkedList();
    // Pre-poblar
    [10, 20, 30].forEach(v => {
        const node = new DLLNode(v);
        if (!list.head) { list.head = node; list.tail = node; }
        else { 
            list.tail!.next = node; 
            node.prev = list.tail; 
            list.tail = node; 
        }
        list.size++;
    });
    return list;
  },

  methods: {
    prepend: function* (list: DoublyLinkedList, value: number) {
      const newNode = new DLLNode(value);
      
      if (!list.head) {
        list.head = newNode;
        list.tail = newNode;
      } else {
        newNode.next = list.head;
        list.head.prev = newNode;
        list.head = newNode;
      }
      list.size++;

      yield { 
        data: generateGraph(list, newNode.id), 
        description: `Prepended ${value} to Head` 
      };
      yield { data: generateGraph(list), description: 'Ready' };
    },

    append: function* (list: DoublyLinkedList, value: number) {
      const newNode = new DLLNode(value);
      
      if (!list.tail) {
        list.head = newNode;
        list.tail = newNode;
      } else {
        list.tail.next = newNode;
        newNode.prev = list.tail;
        list.tail = newNode;
      }
      list.size++;

      yield { 
        data: generateGraph(list, newNode.id), 
        description: `Appended ${value} to Tail` 
      };
      yield { data: generateGraph(list), description: 'Ready' };
    },

    deleteHead: function* (list: DoublyLinkedList) {
        if (!list.head) return;

        const removedVal = list.head.value;
        const oldHeadId = list.head.id;

        yield {
            data: generateGraph(list, oldHeadId),
            description: `Deleting Head: ${removedVal}`
        };

        if (list.head === list.tail) {
            list.head = null;
            list.tail = null;
        } else {
            list.head = list.head.next;
            if (list.head) list.head.prev = null;
        }
        list.size--;

        yield { data: generateGraph(list), description: 'Head deleted' };
    }
  }
};

export default dllInteractive;