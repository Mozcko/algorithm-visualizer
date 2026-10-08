# Components (`src/components/`)

UI pieces other than the renderers (those are in `renderers.md`).

| File | Kind | Runs |
| --- | --- | --- |
| `AlgorithmRunner.tsx` | React island | browser only (`client:only`) |
| `common/Controls.tsx` | React, child of the island | browser |
| `common/Sidebar.astro` | Astro component | build time |
| `Welcome.astro` | Astro component | build time |

## `AlgorithmRunner.tsx`

The single interactive island on each algorithm page. Default export; props
`{ algorithmId: string }`.

It is split in two so the hook is only ever called with a real definition:

- **`AlgorithmRunner`** keeps `{ id, algorithm }` from the last finished
  `loadAlgorithm(id)` call. It shows a pulsing "Cargando lógica del algoritmo..." box until
  the stored id matches the prop, a red "Algoritmo no encontrado" box when the loader
  returned `null` or rejected, and otherwise `<RunnerInternal key={id}>`. A stale load is
  ignored through a `cancelled` flag in the effect cleanup.
- **`RunnerInternal`** calls `useAlgorithmRunner(algorithm)` and renders the viewport plus
  `<Controls>`. Shows "Inicializando..." until the first step exists.

### Viewport

A bordered box, `aspect-square` on mobile and `aspect-video` from `md`, containing one
renderer chosen by `algorithm.visualizer`:

| Visualizer | Guard on `currentStep.data` | Placeholder when the guard fails |
| --- | --- | --- |
| `bar-chart` | `isNumberArray`: array whose first item is a number | "Esperando datos numéricos..." |
| `grid-2d` | `isGridState`: 2D array whose first cell has `row` | "Esperando estructura de grilla..." |
| `primitive-graph` | `isGraphState`: `nodes` and `edges` are arrays | "Procesando estructura..." |
| `terrain-3d` | inline: 2D array whose first cell is a number | "Generating Terrain Map..." |
| anything else | — | red "Visualizador no encontrado" |

`isGraphState` and `isGridState` come from `src/utils/stateGuards.ts`; `isNumberArray` is
local and rejects an empty array.

Interactive structures define `visualize`, so their initial state is drawn on load. One
without it would sit on the `primitive-graph` placeholder until its first command.

Over the viewport, top-left, sits the "Estado Actual" overlay showing
`currentStep.description` or "Listo".

The file also contains the inline `BarChartRenderer`.

## `common/Controls.tsx`

Named export `Controls`. Stateless apart from `inputValues`, a map from control id to the
number typed into it.

Props: `isPlaying`, `onTogglePlay`, `onNext`, `onReset(arg?)`, `speed`, `onSpeedChange`,
`stepCount`, and optional `customControls`, `onCommand(method, args)`.

### Custom row

Rendered only when the definition has `controls`.

- **`input-number`** — a number field with the label as placeholder. Shows
  `inputValues[id]` if set, else `defaultValue`. An entry is created only on change, and
  `Number('')` makes a cleared field `0`.
- **`button`** — disabled while playing. Calls `onCommand(ctrl.method, [arg])`.

Both buttons and Reset use one value, the **primary input**: the first `input-number` in
the definition's `controls`, read as its typed value or else its `defaultValue`.

```ts
const primaryInput = customControls?.find(ctrl => ctrl.type === 'input-number');
const primaryValue = primaryInput
  ? (inputValues[primaryInput.id] ?? primaryInput.defaultValue)
  : undefined;
```

Buttons fall back to a random 0–99 only when there is no input control at all. Every
button gets the same single argument, including ones that ignore it (Pop, Dequeue). The
input's `id` no longer matters; any further `input-number` controls are not forwarded
anywhere.

### Standard row

- **Play / Pause** — green or amber; always enabled, even when there is nothing to play.
- **Step →** — disabled while playing.
- **Reset** — `onReset(primaryValue)`, or `undefined` when the definition has no input, in
  which case `generateInput`'s own default applies.
- **Speed slider** — range 50–1000, step 50, displayed value `1050 - speed`, so dragging
  right shortens the interval. Default speed 500 puts the thumb just right of centre.
- **Step counter** — one copy for `sm+` inside the row, one centred below for mobile.

`inputValues` lives in this component. Moving between algorithms is a full page
navigation, so typed values never carry over.

## `common/Sidebar.astro`

Build-time navigation. Prop: `currentId`.

1. Eager-globs `../../algorithms/**/*.ts`.
2. Maps to `module.default` and keeps entries with a `category` (drops `types.ts`).
3. Groups by `category` in encounter order.
4. Renders each group as a `<details>`, open only if it contains `currentId`, with links to
   `/${categorySlug(category)}/${id}`. The current link gets a blue left border.

Layout: fixed, off-canvas (`-translate-x-full`) below `md`; static 16rem column from `md`.
The mobile close button calls `document.getElementById('mobile-overlay').click()` to reuse
the toggle handler defined in `Layout.astro`.

On the home page no group is open, since there is no `currentId`.

## `Welcome.astro`

Static home page content: title, three feature cards, and an "Available Categories" grid
that hardcodes the seven categories plus "More coming soon...". It is not generated from
the algorithm glob, so a new category has to be added here by hand. No links to
algorithms; navigation is via the sidebar only.

Copy here is English, unlike the Spanish strings in the runner.
