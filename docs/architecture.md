# Architecture

The end-to-end picture, and an index of the per-section docs. Each section has its own
file; this one only explains how they connect.

## Section docs

| Doc | Covers |
| --- | --- |
| `algorithms.md` | `src/algorithms/`: the types and how to write a definition |
| `algorithm-catalog.md` | every algorithm file, with ids, controls and quirks |
| `runner.md` | `useAlgorithmRunner` and `algorithmLoader`: playback and state |
| `components.md` | `AlgorithmRunner`, `Controls`, `Sidebar`, `Welcome` |
| `renderers.md` | the four visualizers and their data and colour contracts |
| `pages-and-layout.md` | routes, `Layout.astro`, global styles, assets |
| `tooling.md` | scripts, dependencies, ESLint, Prettier, `.github`, root docs |

## Layers

```
src/algorithms/*            pure logic: generators that yield SimulationSteps
        |
        |  discovered by import.meta.glob (3 places)
        v
build time                                   browser
----------                                   -------
Sidebar.astro        nav links               algorithmLoader.ts   id -> definition
[algorithm].astro    one page per algo  -->  AlgorithmRunner.tsx  island
Layout.astro         shell                     useAlgorithmRunner   generator + timer
                                               Controls             buttons, inputs
                                               renderers/*          draw step.data
```

Dependencies point one way: renderers and the runner know the types in
`src/algorithms/types.ts`, and algorithms know nothing about the UI.

## Discovery: three globs over the same files

| Where | Mode | Runs | Filters out `types.ts` |
| --- | --- | --- | --- |
| `components/common/Sidebar.astro` | eager | build | yes, by `algo && algo.category` |
| `pages/[category]/[algorithm].astro` | eager | build | yes, same check |
| `utils/algorithmLoader.ts` | lazy | browser | yes, by `algo?.id === id` |

Adding a file under `src/algorithms/` is therefore enough to get a sidebar entry, a page
and a loadable definition. Sidebar group order follows the sorted glob: Backtracking,
Greedy, Pathfinding, Shuffling, Sorting, Data Structures, Terrain.

## One request, start to finish

1. **Build.** `getStaticPaths` emits `/<category slug>/<id>` for each definition.
   The page renders the name and description statically and embeds
   `<AlgorithmRunner client:only="react" algorithmId>`.
2. **Hydration.** The island calls `loadAlgorithm(id)`. Definitions contain functions, so
   they cannot be serialized as props; the id is the hand-off.
3. **Init.** `useAlgorithmRunner` calls `generateInput()`, keeps the result as the logical
   state, starts the `run` generator and shows its first yield. Interactive definitions
   have no `run`; their `visualize` function draws the initial state instead.
4. **Playback.** Play starts a `setInterval` that pulls one step per tick; Step pulls one.
   When the generator finishes, playback stops until Reset.
5. **Render.** `AlgorithmRunner` picks a renderer from `algorithm.visualizer`, type-guards
   `step.data`, and passes it down. `step.description` goes to the overlay.
6. **Input.** Reset sends the first custom input's value to `generateInput`. Custom
   buttons call `runCommand(method, [arg])`, which runs one of the definition's `methods`
   as a short generator against the logical state.

## Cross-cutting contracts

These span more than one section, so they are easy to break from one side:

- **Step data shape.** An algorithm's `visualizer` and the shape it yields must agree with
  the guards in `AlgorithmRunner.tsx`. Mismatches fail silently as a placeholder.
- **Logical vs. drawn state.** The runner refuses to treat a yielded `GraphState` or
  `GridState` as the new logical state. Interactive methods must mutate in place.
- **Hex colours as signals.** `GraphRenderer` changes edge width, dash and node halo on the
  exact strings `#22c55e` and `#fbbf24`.
- **Terrain sentinels.** `Terrain3D` treats exactly `0` and exactly `100` specially.
- **Primary input.** `Controls` forwards only the first `input-number` control, to both
  buttons and `generateInput`. Its `defaultValue` should equal `generateInput`'s default.
- **Route shape.** `/${categorySlug(category)}/${id}` is built in both `Sidebar.astro` and
  `[algorithm].astro`; they must keep using the same helper.
- **Canvas bounds.** Graph coordinates must stay inside 800 x 400. The interactive
  structures enforce this with size and depth caps.
