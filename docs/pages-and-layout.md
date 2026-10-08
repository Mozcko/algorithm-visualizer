# Pages, layout and styles (`src/pages/`, `src/layouts/`, `styles/`)

The Astro shell around the React island. Everything here runs at build time except one
small inline script.

Do not put `.md` files in `src/pages/`: Astro turns them into routes. That is why section
docs live in `docs/`.

## Routes

| Route | File | Count |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | 1 |
| `/<category>/<id>` | `src/pages/[category]/[algorithm].astro` | 32 |

Output is fully static (`astro build` with no adapter). There is no 404 page and no base
path configured in `astro.config.mjs`.

## `pages/[category]/[algorithm].astro`

`getStaticPaths()`:

1. Eager-globs `../../algorithms/**/*.ts`.
2. Keeps default exports that have a `category`.
3. Returns one entry per algorithm with
   `params: { category: categorySlug(algo.category), algorithm: algo.id }` and
   `props: { algorithm: algo }`.

The page then renders, inside the layout:

- a header with `algorithm.name` and `algorithm.description`
- `<AlgorithmRunner client:only="react" algorithmId={algorithm.id} />` in a `max-w-5xl`
  column

Notes:

- The full definition is available here as a prop because this is build-time code. Only
  the id is handed to the island; the client re-resolves it with `loadAlgorithm`.
- `client:only="react"` means no server render of the island, so the built HTML contains
  the header but not the visualization.
- The category segment comes from `categorySlug` in `src/utils/slug.ts` (lowercase, spaces
  to hyphens), which `Sidebar.astro` also uses for its links. `'Data Structures'` becomes
  `/data-structures/...`.
- Ids must be unique across the whole project, not just per category: the loader matches
  on id alone.

## `pages/index.astro`

Renders `<Layout title="Home"><Welcome /></Layout>`. The starter-template comment at the
top is leftover.

## `layouts/Layout.astro`

Props: `title: string` (required), `currentAlgoId?: string`.

Structure:

```
<html lang="es">
  <body class="bg-slate-950 text-slate-200">
    <div class="flex h-screen overflow-hidden">
      #mobile-overlay            dimmed backdrop, hidden by default, md:hidden
      <Sidebar currentId=... />  #app-sidebar
      <main class="flex-1 overflow-y-auto">
        <header class="md:hidden"> title + #menu-toggle </header>
        <slot />
      </main>
    </div>
    <script> toggle logic </script>
```

- Imports `../../styles/global.css`, which is the only place the stylesheet is pulled in.
- The page is a fixed-height flex row; `<main>` is the scroll container, not the body.
- The script toggles `-translate-x-full` on the sidebar and `hidden` on the overlay, and
  is bound to the menu button and the overlay. The sidebar's close button triggers the
  overlay's click to reuse it.
- `<title>` is `{title} | AlgoVisualizer`, and the favicon is linked. No meta description.

## `styles/global.css`

Lives at the repo root, outside `src/`.

```css
@import "tailwindcss";
.animate-pop        /* 0.3s scale-in with overshoot; used for graph edge weight labels */
.transition-spring  /* 300ms all-properties transition with slight overshoot;
                       used for graph nodes and terrain tiles */
```

Tailwind 4 is configured purely through this import and the Vite plugin; there is no
`tailwind.config.*`. A few class names in the components are not defined anywhere and are
no-ops unless a plugin is added: `animate-in`, `fade-in`, `zoom-in`,
`slide-in-from-bottom-2`, `scrollbar-thin`, `scrollbar-thumb-slate-700`.

## Assets

- `public/favicon.svg` — served at `/favicon.svg`, linked from the layout.
- `src/assets/astro.svg`, `src/assets/background.svg` — Astro starter leftovers, unused.

## Design language

Dark slate throughout (`slate-950` page, `slate-900` panels, `slate-800` controls,
`slate-700` borders), blue as the accent, green / amber / red for state. Breakpoints in use
are `sm` and `md` only; `md` is where the sidebar becomes permanent and the viewport
switches from square to 16:9.
