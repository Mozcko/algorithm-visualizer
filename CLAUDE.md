# Algorithm Visualizer

Static Astro site that animates classic algorithms step by step. Every algorithm is one
TypeScript file exporting a generator-based definition; the site discovers them by glob, so
there is no registry to edit.

Deeper reference lives in `docs/`, one file per section of the code. Read the one for the
area you are about to change:

| Doc | Covers |
| --- | --- |
| `docs/architecture.md` | how the sections connect; contracts that span them |
| `docs/algorithms.md` | `src/algorithms/`: types, writing run-mode and interactive definitions |
| `docs/algorithm-catalog.md` | every algorithm file: id, visualizer, state, controls, quirks |
| `docs/runner.md` | `useAlgorithmRunner` and `algorithmLoader`: playback, logical state |
| `docs/components.md` | `AlgorithmRunner`, `Controls`, `Sidebar`, `Welcome` |
| `docs/renderers.md` | the four visualizers: data shapes, colour and height rules |
| `docs/pages-and-layout.md` | routes, `Layout.astro`, global CSS, assets |
| `docs/tooling.md` | scripts, dependencies, ESLint, Prettier, `.github`, root docs |

Update the matching doc in the same change whenever you alter what it describes. Docs stay in
`docs/`, never beside the code: a `.md` under `src/pages/` becomes a route.

## Stack and commands

Astro 5 (static output) + React 19 islands + Tailwind 4 (via `@tailwindcss/vite`) + TypeScript
strict. Package manager is **pnpm**. No test framework, no CI workflows.

| Command | What it does | Current state |
| --- | --- | --- |
| `pnpm dev` | Dev server on `http://localhost:4321` | works |
| `pnpm build` | Static build to `dist/` (33 pages) | passes; does **not** type-check |
| `pnpm exec tsc --noEmit` | Type-check | clean |
| `pnpm lint` | ESLint flat config | 0 errors, 38 warnings (`any`, unused vars) |
| `pnpm format` | Prettier | works, but has never been run: it would rewrite nearly every file |

Run `tsc` and `lint` after any change; nothing else catches type errors.

## Layout

```
src/
  algorithms/
    types.ts                  # All shared types. Read this first.
    <folder>/<algo>.ts        # One default-exported AlgorithmDefinition per file
  utils/algorithmLoader.ts    # Client-side lookup of a definition by id (lazy glob)
  utils/stateGuards.ts        # isGraphState / isGridState, shared by the hook and the island
  utils/slug.ts               # categorySlug: 'Data Structures' -> 'data-structures'
  hooks/useAlgorithmRunner.ts # Playback engine: owns the generator, timer, logical state
  components/
    AlgorithmRunner.tsx       # React island: loads algo, picks renderer, inline BarChartRenderer
    common/Controls.tsx       # Play / Step / Reset / speed + per-algorithm custom controls
    common/Sidebar.astro      # Build-time nav, grouped by category
    renderers/Grid2D.tsx      # 'grid-2d'
    renderers/GraphRenderer.tsx # 'primitive-graph' (SVG, 800x400 viewBox)
    renderers/Terrain3D.tsx   # 'terrain-3d' (CSS 3D transforms, not Three.js)
    Welcome.astro             # Home page body (static, hardcoded category list)
  layouts/Layout.astro        # Shell: sidebar + mobile menu script; imports styles/global.css
  pages/index.astro
  pages/[category]/[algorithm].astro  # getStaticPaths over the algorithm glob
styles/global.css             # Tailwind import + .animate-pop, .transition-spring
```

`styles/` sits at the repo root, not under `src/`.

## How it fits together

1. `Sidebar.astro` and `[algorithm].astro` eagerly glob `src/algorithms/**/*.ts` at build time
   and keep modules whose default export has a `category`. Route is
   `/${categorySlug(category)}/${id}`, e.g. `/data-structures/min-heap`.
2. The page renders `<AlgorithmRunner client:only="react" algorithmId=... />`. Only the id
   crosses to the client, because definitions hold functions and cannot be serialized.
3. `loadAlgorithm(id)` lazily imports modules one at a time until one matches.
4. `useAlgorithmRunner` calls `generateInput()`, creates the `run` generator, and advances it
   on a `setInterval` (Play) or on demand (Step). Each yielded `SimulationStep` is rendered.
5. `AlgorithmRunner` switches on `algorithm.visualizer` and type-guards `step.data` before
   handing it to a renderer.

## Adding an algorithm

Create `src/algorithms/<folder>/<name>.ts`. Nothing else needs editing.

```ts
import type { AlgorithmDefinition } from '../types';

const myAlgo: AlgorithmDefinition<number[]> = {
  id: 'my-algo',            // unique across the project; becomes the URL slug
  name: 'My Algo',
  category: 'Sorting',      // must be a member of AlgorithmCategory, English, exact case
  visualizer: 'bar-chart',  // 'bar-chart' | 'grid-2d' | 'primitive-graph' | 'terrain-3d'
  description: '...',
  generateInput: (size = 20) => Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10),
  run: function* (input) {
    const arr = [...input];
    yield { data: [...arr], highlightedIndices: [0, 1], description: 'Comparing...' };
  },
};

export default myAlgo;
```

Rules that are easy to get wrong:

- **Yield a fresh copy of the data every step.** Renderers rely on new references.
- **No timers inside algorithms.** The hook owns timing; just `yield`.
- Recursion uses `yield*` with helper generators typed `Generator<any, boolean, any>`.
- The `data` shape must satisfy the type guard for the chosen visualizer, or the runner shows
  a "waiting for data" placeholder instead of an error. Shapes are in `docs/renderers.md`.
- The folder name is cosmetic. The `category` field drives the route and the sidebar group
  (`structures/` holds category `'Data Structures'`).
- A new category needs adding to the `AlgorithmCategory` union in `types.ts`. `Welcome.astro`
  has a hardcoded category list to update by hand.
- A new visualizer needs: the `VisualizerType` union, a branch in `AlgorithmRunner.tsx`, and
  the fallback list on the same file's "Visualizador no encontrado" check.

Two modes exist. **Run mode** defines `run` (most algorithms). **Interactive mode** omits `run`
and defines `methods`, `controls` buttons with a `method` name, and `visualize` so the initial
state is drawn (stack, queue, BST, doubly linked list). Interactive methods must mutate the
logical state in place — see `docs/runner.md` for why. Buttons and Reset receive the value of
the first `input-number` control.

## Conventions

- Language is mixed on purpose so far: README, CONTRIBUTING, code comments and a few UI
  strings are Spanish (`<html lang="es">`); algorithm names, descriptions and step
  descriptions are English. Match the file you are in.
- Semantic colours are passed as hex strings and the graph renderer keys behaviour off the
  exact values: `#22c55e` done/selected, `#fbbf24` active/candidate, `#ef4444` conflict.
- Dark slate Tailwind palette throughout. Responsive breakpoints `sm:` and `md:`.
- Source is not Prettier-formatted yet (4-space indents are common); do not reformat files
  you are only touching lightly.

## Known issues

Verified on 2026-10-07 after a full bug pass. Check before relying on any of these, and fix
only when asked.

- **Only one input reaches the algorithm.** Buttons and Reset both use the first
  `input-number` control; a second one would be ignored.
- **`run` only sees what `generateInput` returned.** Extra parameters have to ride on that
  object (the min-heap's untyped `raw` array).
- **Never formatted.** `pnpm format` works now but has not been run, to avoid a
  whole-repo diff. Lint still reports 38 warnings.
- **ESLint 10 is newer than the plugins support** (`typescript-eslint`, react plugins declare
  peers up to 9). It works; pnpm prints peer warnings on install.
- **README overstates:** no step-back, no Three.js, Astro badge says 4.0, references a missing
  `public/demo-placeholder.gif` and a placeholder clone URL.
- **CONTRIBUTING step 2** shows an `AlgorithmStep[]`-returning API that does not exist. Step 3
  (the `AlgorithmDefinition` export) is the accurate one.
- `.github/dependabot.yml` is an empty file.
- `GridNode.isValid` and `SimulationStep.activeNode` are set by some algorithms but no
  renderer reads them.
- A handful of Tailwind classes in the components are undefined no-ops (`animate-in`,
  `fade-in`, `zoom-in`, `scrollbar-thin`).
- Subset Sum draws values 1–20 as bar heights in percent, so its bars are very short.
- No tests. Algorithm logic was checked with a throwaway headless script, and the UI changes
  from the bug pass were verified by type-check and build only, not in a browser.
