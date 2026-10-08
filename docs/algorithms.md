# Algorithms (`src/algorithms/`)

The logic layer. One file per algorithm, each default-exporting an `AlgorithmDefinition`.
Nothing here imports React or touches the DOM. For the list of what exists, see
`algorithm-catalog.md`.

## `types.ts`

The only shared module in this directory. It has no default export, which is how the build
tells it apart from an algorithm.

```ts
AlgorithmCategory = 'Sorting' | 'Pathfinding' | 'Data Structures' | 'Backtracking'
                  | 'Shuffling' | 'Terrain' | 'Greedy'
VisualizerType    = 'bar-chart' | 'grid-2d' | 'terrain-3d' | 'primitive-graph'
```

| Type | Fields |
| --- | --- |
| `GridNode` | `row`, `col`; pathfinding flags `isStart` `isEnd` `isWall` `isVisited` `isPath` `distance` `previousNode`; generic `value` `customBg` `isValid` |
| `GridState` | `GridNode[][]` |
| `GraphNode` | `id`, `value`, `x`, `y`, `color?`, `isActive?` |
| `GraphEdge` | `from`, `to`, `color?`, `isDirected?`, `weight?` |
| `GraphState` | `nodes`, `edges`, `isDirected?` |
| `VisualState` | `GraphState \| GridState` |
| `SimulationStep<T>` | `data: T \| VisualState`, `highlightedIndices?`, `activeNode?`, `description?` |
| `AlgorithmControl` | `type: 'button' \| 'input-number'`, `label`, `id`, `method?`, `defaultValue?` |
| `AlgorithmDefinition<T>` | `id`, `name`, `category`, `visualizer`, `description`, `controls?`, `methods?`, `run?`, `generateInput`, `visualize?` |

`T` is the algorithm's logical state. `data` also accepts a `VisualState` so that an
algorithm whose state is not directly drawable can yield a drawing of it.

`previousNode` stores coordinates, not a node reference, so grids survive shallow copies.

## Anatomy of a definition

```ts
const algo: AlgorithmDefinition<T> = {
  id,            // unique; URL slug; what loadAlgorithm matches on
  name,          // sidebar label and page <h1>
  category,      // sidebar group and first URL segment (lowercased)
  visualizer,    // which renderer AlgorithmRunner mounts
  description,   // subtitle under the page <h1>
  controls,      // optional extra inputs and buttons
  generateInput, // builds the initial T; receives at most one number from Reset
  run,           // run mode: generator over the whole algorithm
  methods,       // interactive mode: one generator per operation
  visualize,     // interactive mode: logical state -> drawable state, for the first frame
};
export default algo;
```

File naming is camelCase and usually, not always, matches the id in kebab-case
(`sattolosAlgorithm.ts` is `sattolo-shuffle`, `graphColoring.ts` is `m-coloring`).

## Run mode

`run(input)` is a generator. Each `yield` is one frame.

Patterns the existing files follow:

- Copy the input first (`const arr = [...input]`) and yield copies
  (`data: [...arr]`, or a `copyGrid()` / `deepCopyGrid()` helper for 2D data).
- Open with a "Starting..." step and close with a "...completed!" step with highlights
  cleared.
- Recursion is written as inner generator functions and delegated with `yield*`. When the
  helper needs to return a value, type it `Generator<any, boolean, any>` (backtracking) or
  `Generator<any, number, any>` (quick sort's `partition`) and use
  `if (yield* solve(next)) return true;`.
- Skip frames when a step is visually dull: convex hull yields every third scan, fault
  formation every tenth fault.
- Never use timers. Playback speed belongs to the runner.

## Interactive mode

Omit `run`. Provide `methods` and matching `controls`:

```ts
controls: [
  { type: 'input-number', label: 'Value', id: 'value', defaultValue: 50 },
  { type: 'button', label: 'Insert', id: 'btn-insert', method: 'insert' },
],
visualize: (state) => generateGraph(state),
methods: {
  insert: function* (state, value: number) { /* mutate state, yield drawings */ },
},
```

Each method receives the current logical state plus one argument from the UI. Rules:

- **Mutate the state you are given.** Yielded `GraphState` / `GridState` drawings do not
  replace the logical state (see `runner.md`), so `stack.push(v)` on the passed array is
  what persists.
- To swap the state object itself, yield the real `T` once, and not as the last step:
  the final yield is what stays on screen and a raw `T` cannot be drawn. Only the BST
  does this, to go from `null` to its first node.
- Keep a local `generateGraph(state, active)` that projects logical state to a
  `GraphState`, expose it as `visualize`, and end each method with an un-highlighted
  "Ready" frame.
- Buttons receive the first `input-number` control's value (typed, else `defaultValue`).
- Cap growth. Node positions are computed from size, so each structure refuses inserts
  past what fits in the 800 x 400 canvas (`MAX_SIZE` / `MAX_DEPTH` constants).

## `generateInput` and size controls

Reset calls `generateInput(n)` with one number, or with nothing. Conventions:

- Give the parameter a default and repeat it as the control's `defaultValue`: the first
  load calls `generateInput()` with no argument, while Reset sends the displayed value.
- Clamp inside `generateInput` (`Math.max(Math.min(val, 12), 4)`); the input field itself
  is unvalidated.
- Only the first `input-number` control reaches `generateInput`. Do not add a second one
  expecting it to work.
- `run` receives only what `generateInput` returned. To pass extra data, put it on the
  returned object, as the min-heap does with an untyped `raw` array.

## What to yield per visualizer

| Visualizer | `data` | Extras that matter |
| --- | --- | --- |
| `bar-chart` | non-empty `number[]`, values 0–100 | `highlightedIndices` |
| `grid-2d` | `GridNode[][]` with `row` on each node | flags, `customBg`, `value` |
| `primitive-graph` | `GraphState`, coordinates within 800 x 400 | `color`, `isActive`, `weight`, stable `id`s |
| `terrain-3d` | square `number[][]`, values 0–100 | `100` means flat wall; keep heightmaps at or below 99 |

Details and colour rules are in `renderers.md`.

## Duplication to be aware of

- The four pathfinding files each define their own `ROWS`, `COLS`, `createNode`,
  `getNeighbors` and `deepCopyGrid`.
- Sorting files repeat the same `generateInput`; shuffling files repeat theirs.
- Each interactive structure has its own `generateGraph`.

There is no shared helper module inside `src/algorithms/`. One can be added safely as long
as it has no default export; all three globs skip such files.
