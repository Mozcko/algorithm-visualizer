# Algorithm catalog

All 32 definitions under `src/algorithms/`. Route is `/<category slug>/<id>`, e.g.
`/data-structures/min-heap`.
"Control" is the single number input wired to `generateInput` through Reset; the range shown
is the clamp applied inside `generateInput`.

## Sorting — `sorting/`, `bar-chart`, `number[]`

Input for all eight: 20 random integers in 10–89. No controls.

| File | id | Notes |
| --- | --- | --- |
| `bubbleSort.ts` | `bubble-sort` | Early exit when a pass makes no swaps. Simplest reference file. |
| `selectionSort.ts` | `selection-sort` | |
| `insertionSort.ts` | `insertion-sort` | |
| `shellSort.ts` | `shell-sort` | |
| `gnomeSort.ts` | `gnome-sort` | |
| `cocktailShakerSort.ts` | `cocktail-shaker-sort` | |
| `mergeSort.ts` | `merge-sort` | Reference for recursion with `yield*` helper generators. |
| `quickSort.ts` | `quick-sort` | `partition` is a generator that returns the pivot index via `yield*`. |

## Shuffling — `shuffling/`, `bar-chart`, `number[]`

Input for all four: a sorted ramp of 20 values from 5 to 95. No controls.

| File | id | Notes |
| --- | --- | --- |
| `fisherYatesShuffle.ts` | `fisher-yates-shuffle` | |
| `sattolosAlgorithm.ts` | `sattolo-shuffle` | File name and id differ. |
| `naiveShuffle.ts` | `naive-shuffle` | Intentionally biased, for comparison. |
| `riffleShuffle.ts` | `riffle-shuffle` | Three riffles; yields per riffle, not per card. |

## Pathfinding — `pathfinding/`, `grid-2d`, `GridState`

Input for all four: fixed 10 x 20 grid, start at (1,1), end at (8,18), 20% random walls. No
controls. Each file carries its own copy of `createNode`, `getNeighbors` (4-directional) and
`deepCopyGrid`; there is no shared helper module. All end by walking `previousNode` back from
the end to paint `isPath`, and report "No path found" when walled in.

| File | id | Notes |
| --- | --- | --- |
| `bfs.ts` | `bfs` | Yields per discovered neighbour. |
| `dfs.ts` | `dfs` | Explicit stack. |
| `dijkstra.ts` | `dijkstra` | Sorts an array each iteration instead of using a heap. |
| `astar.ts` | `astar` | Manhattan heuristic; g-score in `node.distance`, f-score in a side `Map`. |

The working grid inside each `run` must be annotated `GridState`; inferring it from the
spread literal narrows `previousNode` to `null` and breaks path reconstruction types.

## Backtracking — `backtracking/`

| File | id | Visualizer | State | Control | Notes |
| --- | --- | --- | --- | --- | --- |
| `nQueens.ts` | `n-queens` | `grid-2d` | `GridState` | Size (N), default 4, 4–10 | Uses `value: '♛'` and `customBg` for board, try, placed, conflict. |
| `sudoku.ts` | `sudoku-solver` | `grid-2d` | `GridState` | none | Generates a solved board, blanks up to 40 cells. Givens are marked `isWall`. Always solvable, since the puzzle is carved from a solved board. |
| `graphColoring.ts` | `m-coloring` | `primitive-graph` | `GraphState` | Nodes, default 6, 4–12 | Fixed 4 colours. Nodes on a jittered ring; ring edges plus random chords. Reports when no 4-colouring exists. |
| `subsetSum.ts` | `subset-sum` | `bar-chart` | `number[]` | none | 10 values in 1–20. Target is chosen inside `run` from a random subset, so a solution always exists. Values are small, so bars are short. |

## Greedy — `greedy/`, `primitive-graph`, `GraphState`

| File | id | Control | Notes |
| --- | --- | --- | --- |
| `prims.ts` | `prims-mst` | Nodes, default 8, 5–15 | Random points, edges where distance < 350. Weight is Euclidean distance computed on the fly, not stored in `edge.weight`. Stops early if disconnected. |
| `ospfRouting.ts` | `ospf-routing` | Routers, default 6, 4–10 | Dijkstra from R0 with `edge.weight` of 1, 10 or 50. Placement retries up to 50 times to keep routers 90px apart. Chosen edges turn green and directed. |
| `convexHull.ts` | `convex-hull` | Points, default 10, min 5, no max | Jarvis march from the leftmost point. Collinear ties go to the farthest point. Yields every third scan line only. |

## Data Structures — `structures/`, `primitive-graph`

Folder is `structures`, category is `'Data Structures'`.

| File | id | Mode | Logical state | Controls | Cap |
| --- | --- | --- | --- | --- | --- |
| `stackInteractive.ts` | `stack-interactive` | interactive | `number[]`, starts empty | input; Push, Pop | 7 items |
| `queueInteractive.ts` | `queue-interactive` | interactive | `number[]`, starts `[10, 20, 30]` | input; Enqueue, Dequeue | 10 items |
| `doublyLinkedList.ts` | `doubly-linked-list` | interactive | `DoublyLinkedList` class, starts 10, 20, 30 | input; Prepend, Append, Delete Head | 6 nodes |
| `bstInteractive.ts` | `bst-interactive` | interactive | `BSTNode \| null`, starts `null` | input; Insert | depth 4 |
| `minHeap.ts` | `min-heap` | run | `GraphState` plus an untyped `raw: number[]` | Elements, default 12, 5–31 | — |

Notes:

- Each interactive file has a local `generateGraph(state, active)` that projects the logical
  state to a `GraphState`, also exposed as `visualize`. Methods mutate the state in place
  and yield drawings.
- Caps exist because positions are computed from size and would leave the 800 x 400
  canvas. Hitting one yields a message ("Stack Overflow!", "Max depth reached") and
  changes nothing.
- The BST has no delete or search. Child offset halves per level (190, 95, 47.5, 23.75).
  On the first insert it yields the raw `BSTNode` once to seed the logical state, which
  shows the placeholder for a single frame.
- The queue uses ids of the form `q-<index>-<value>`, so nodes re-key on dequeue rather than
  sliding.
- The min-heap inserts every value with sift-up, then demonstrates one extract-min with
  sift-down. Layout is computed from the array index.

## Terrain — `terrain/`, `terrain-3d`, `number[][]`

| File | id | Control | Notes |
| --- | --- | --- | --- |
| `diamondSquare.ts` | `diamond-square` | Size, default 17 | Snaps up to the next of 5, 9, 17, 33. Roughness starts at 40 and halves each pass. Heights clamped to 0–99. Two yields per pass. |
| `faultFormation.ts` | `fault-formation` | Size, default 20, 10–40 | Runs `60 + 2n` faults. Normalizes to 0–99 and yields every 10th fault. |
| `cellularCaves.ts` | `cellular-caves` | Size, default 30, 10–40 | 45% wall noise, 10 smoothing steps, rule: more than 4 wall neighbours becomes wall, fewer than 4 becomes floor. Out-of-bounds counts as wall. |
| `mazeGenerator.ts` | `maze-generator` | Size, default 21, 11–45, forced odd | Recursive backtracker on a wall-filled grid. Uses sentinel heights 100, 0, 50, 30 for wall, floor, head, backtrack. |
