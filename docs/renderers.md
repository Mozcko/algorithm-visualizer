# Renderers (`src/components/renderers/` and the inline bar chart)

Four renderers, one per `VisualizerType`. Each is a pure function of the current step's
`data`; none knows which algorithm it is drawing. `AlgorithmRunner.tsx` chooses one and
guards the data first (see `components.md`). A failed guard shows a grey placeholder, never
an error.

The viewport they draw into is `aspect-square` on mobile and `aspect-video` from `md` up.
From `md` up a description overlay sits in the top-left corner and can cover content there;
below `md` the description is a separate block above the viewport.

## `bar-chart` — `BarChartRenderer`, inline in `AlgorithmRunner.tsx`

Props: `data: number[]`, `active?: number[]` (the step's `highlightedIndices`).

- A flex row of bars, each with `height: ${value}%`. Values are not normalized, so
  anything over 100 overflows and anything near 0 disappears.
- Highlighted indices are amber with a glow; the rest are blue.
- Bars are keyed by index, so a swap animates as two bars changing height.
- The comment calls it temporary ("Visualizador Temporal"); it was never moved out to
  `renderers/`.

## `grid-2d` — `Grid2D.tsx`

Props: `grid: GridNode[][]`. Returns `null` for an empty grid.

Cell background, first match wins:

1. `customBg` — inline hex, overrides everything
2. `isStart` — green
3. `isEnd` — red
4. `isPath` — yellow
5. `isWall` — slate
6. `isVisited` — translucent blue
7. otherwise a subtle checkerboard

`value` renders as centred bold text: `xs` by default, `xl` from `md` up.
Truthiness is used, so a numeric `0` would not render; algorithms use `''` for empty.

Sizing: the grid div gets `aspect-ratio: cols / rows`. Grids wider than 1.6:1 (the 10 x 20
pathfinding grid) fit the width; squarer ones (sudoku, N-queens) fit the height on `md+`.

Not read: `isValid`, `distance`, `previousNode`.

## `primitive-graph` — `GraphRenderer.tsx`

Props: `data: GraphState | null`. Renders "Sin datos" for null.

An SVG with `viewBox="0 0 800 400"`, so node coordinates must stay in that box. Algorithms
generally place nodes in x 100–700, y 50–350.

**Edges** are drawn first, keyed by array index. Endpoints are looked up by node id; an
edge whose endpoint is missing is silently skipped.

| Edge property | Effect |
| --- | --- |
| `color` | stroke; default `#475569` |
| `color === '#22c55e'` | width 4 instead of 2 |
| `color === '#fbbf24'` | dashed |
| `isDirected`, or `data.isDirected` | arrowhead marker |
| `weight` defined | number in a small box at the midpoint |

**Nodes** are keyed by `id` and positioned with a CSS `translate`, using
`.transition-spring`. Keeping ids stable between frames makes nodes glide; changing ids
makes them remount.

| Node property | Effect |
| --- | --- |
| `color` | circle stroke |
| no `color`, `isActive` | amber stroke |
| neither | blue stroke |
| `isActive` | thicker stroke and 110% scale |
| `color === '#22c55e'` | pulsing green halo behind the node |
| `value` | centred label; use `''` for unlabeled points |

Below the `sm` breakpoint node contents and weight boxes are scaled 1.75x
(`MOBILE_SCALE`), because the 800-unit viewBox shrinks to about 40% on a phone and labels
would otherwise render at 4–5px. Positions are unchanged, so closely packed nodes (a heap
level with 16 nodes, say) can overlap on phones.

The exact hex strings are a contract. Using a different green will not thicken an edge or
add the halo.

Two-way links (the doubly linked list) are drawn as two directed edges over the same line,
so they overlap rather than appearing as parallel arrows.

## `terrain-3d` — `Terrain3D.tsx`

Props: `terrain: number[][]` (treated as square; size is `terrain.length`).

Not WebGL and not Three.js. Every cell is an absolutely positioned div lifted with
`translateZ`, inside a container rotated with `rotateX` / `rotateZ` and
`transform-style: preserve-3d`. Cost grows with the square of the size.

Cell size by grid size: 24px up to 17, 16px up to 33, 8px above that. The whole scene is
scaled to 60% below the `sm` breakpoint.

Height to appearance:

| Value | Colour | Z offset |
| --- | --- | --- |
| exactly `0` | blue | 0 |
| exactly `100` | white | fixed 50px |
| 1–20 | blue | value x 1.5 |
| 21–40 | sand | value x 1.5 |
| 41–70 | green | value x 1.5 |
| 71–85 | slate | value x 1.5 |
| 86–99 | white | value x 1.5 |

Note the discontinuity: `99` sits at 148px but `100` sits at 50px. The maze and cave
generators rely on `100` being a low flat wall, so heightmap generators must stay at or
below `99` (diamond-square clamps to it, fault formation normalizes to 0–99).

Interaction, all local component state:

- Drag with mouse or touch rotates: horizontal drag changes Z rotation, vertical changes X
  rotation clamped to 0–90 degrees. Starting angles are 60 and -45. The container is
  `touch-none`, so a touch drag rotates instead of scrolling the page.
- A "Rotate" button in the bottom-right toggles auto-rotation via `requestAnimationFrame`.
  Auto-rotation pauses while dragging.

The empty-terrain early return sits below the hooks; keep it there.

## Adding a renderer

1. Add the name to `VisualizerType` in `src/algorithms/types.ts`.
2. Create the component in `src/components/renderers/`.
3. In `AlgorithmRunner.tsx`: add a type guard (shared ones live in
   `src/utils/stateGuards.ts`), add a branch that mounts the component, and
   add the name to the array in the "Visualizador no encontrado" fallback.
4. If the data shape is an object or 2D array, check how the runner's logical-state
   heuristic treats it (`runner.md`).
