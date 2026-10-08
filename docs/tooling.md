# Tooling and repo config

Everything outside `src/` and `styles/`. Command results below were checked on 2026-10-07.

## Package manager and scripts

pnpm, with `pnpm-lock.yaml`. `package.json` is `"type": "module"`, version `0.0.1`.

| Script | Command | Result |
| --- | --- | --- |
| `dev` | `astro dev` | serves `http://localhost:4321` |
| `build` | `astro build` | passes, 33 pages into `dist/` |
| `preview` | `astro preview` | serves the built `dist/` |
| `lint` | `eslint .` | 0 errors, 38 warnings |
| `lint:fix` | `eslint . --fix` | nothing left to auto-fix |
| `format` | `prettier --write .` | works; never run on the repo |

There is no `test` script and no type-check script. `pnpm exec tsc --noEmit` works and
is clean. `astro check` is unavailable
because `@astrojs/check` is not installed.

## Dependencies

Runtime: `astro` ^5.16, `@astrojs/react` ^4.4, `react` and `react-dom` ^19.2,
`tailwindcss` and `@tailwindcss/vite` ^4.1.

Dev: `eslint` ^10, `@eslint/js`, `typescript-eslint`, `eslint-plugin-astro`,
`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`,
`eslint-config-prettier`, `eslint-plugin-prettier`, `globals`, `prettier` ^3.8,
`prettier-plugin-astro`, React type packages. ESLint 10 is ahead of what
`typescript-eslint` and the React plugins declare as peers (up to 9); pnpm warns on
install but lint runs.

No Three.js, no state library, no router, no test runner. `typescript` is not a direct
dependency, though `tsc` is available in `node_modules/.bin`.

## `astro.config.mjs`

`integrations: [react()]` and `vite.plugins: [tailwindcss()]`. No `site`, `base`, adapter
or output setting, so the build is static and assumes it is served from the domain root.

## `tsconfig.json`

Extends `astro/tsconfigs/strict`, includes everything plus `.astro/types.d.ts`, excludes
`dist`, and sets `jsx: react-jsx` with `jsxImportSource: react`. No path aliases; imports
are relative.

## `eslint.config.mjs`

Flat config, in order:

0. `ignores` for `dist/`, `.astro/` and `node_modules/`.
1. Browser and Node globals for `js, mjs, cjs, ts, tsx, astro`.
2. `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-astro`
   recommended.
3. For `jsx, tsx`: react and react-hooks recommended rules, with `react-in-jsx-scope` and
   `prop-types` off. `jsx-a11y` is registered but none of its rules are enabled. The React
   version setting is pinned to `19.0`.
4. Project overrides: `no-explicit-any` warn, unused vars warn (ignoring `_`-prefixed
   args), `no-constant-condition` warn with loops exempt.
5. `eslint-config-prettier` last.

`eslint-plugin-prettier` is installed but not referenced.

The remaining 38 warnings are `no-explicit-any` and a few unused variables in algorithm
files. `react-hooks` rules apply to `jsx, tsx` only, so `useAlgorithmRunner.ts` is not
checked by them.

## `.prettierrc`

`semi: true`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: es5`,
`printWidth: 100`, plugin `prettier-plugin-astro` with an `*.astro` parser override.

The existing source has never been formatted with this config (many files use 4-space
indents and double quotes), so the first `pnpm format` will touch nearly every file. Do
it as its own commit.

## Git state of the tooling

As of 2026-10-07 the lint and format setup is uncommitted work in progress on `master`:
`package.json` and `pnpm-lock.yaml` are modified (the three scripts and the dev
dependencies above), and `.prettierrc` and `eslint.config.mjs` are untracked. The bug-pass
changes across `src/` and the `docs/` folder are uncommitted as well.

## `.gitignore`

`dist/`, `.astro/`, `node_modules/`, debug logs, `.env` and `.env.production`,
`.DS_Store`, `.idea/`.

## `.github/`

- `ISSUE_TEMPLATE/bug_report.md`, `feature_request.md`, `algorithm_request.md`
- `ISSUE_TEMPLATE/config.yml` — blank issues allowed; links to the repo's discussions
- `dependabot.yml` — an empty file
- No `workflows/`: nothing runs on push or pull request

The actual remote is `https://github.com/Mozcko/algorithm-visualizer`.

## `.vscode/`

Recommends the Astro extension and defines one launch config that runs `astro dev` in a
terminal.

## Root documents

- `README.md` (Spanish) — project pitch, install steps, algorithm list. Inaccurate in
  places: claims step-back and Three.js, shows an Astro 4.0 badge, links a missing
  `public/demo-placeholder.gif`, uses a placeholder clone URL, and its algorithm list
  leaves out Shuffling, Data Structures and most of Greedy.
- `CONTRIBUTING.md` (Spanish) — how to add an algorithm. Step 3 and the generator section
  match the code; the step 2 example (`AlgorithmStep[]` with `array` / `highlights`) does
  not.
- `LICENSE` — MIT.
- `CLAUDE.md` and `docs/` — the documentation base for working in this repo.
