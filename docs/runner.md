# Runner (`src/hooks/useAlgorithmRunner.ts`, `src/utils/algorithmLoader.ts`)

The playback engine. The loader finds a definition by id in the browser; the hook turns
its generators into a controllable animation.

## `algorithmLoader.ts`

```ts
const algorithmsImport = import.meta.glob('../algorithms/**/*.ts'); // lazy
export async function loadAlgorithm(id): Promise<AlgorithmDefinition | null>
```

It walks the glob's keys in order, awaits each module, and returns the first whose
`default.id` matches. Returns `null` if none match.

Why it exists: the page is built with the definition in hand, but definitions contain
functions and cannot be passed as island props. So the page passes only the id and the
client looks the definition up again.

Things to know:

- **It is a linear scan with a dynamic import per module.** The last algorithm
  alphabetically loads every other algorithm's chunk first. Fine at 32 files.
- Modules without a default export (`types.ts`, or any helper added later) are skipped by
  `algo?.id === id`, so an unknown id returns `null` rather than throwing.

## `src/utils/stateGuards.ts`

`isGraphState(data)` and `isGridState(data)`, both taking `unknown`. Used by the hook's
logical-state check and by `AlgorithmRunner` to pick a renderer. `isGridState` checks that
the first cell is an object before using `in`, so a `number[][]` heightmap is simply "not a
grid".

## `useAlgorithmRunner<T>(algorithm)`

Returns `{ currentStep, isPlaying, speed, stepCount, setSpeed, togglePlay, stepForward,
reset, runCommand }`.

### State and refs

| Name | Kind | Meaning |
| --- | --- | --- |
| `currentStep` | state | the `SimulationStep` on screen, or `null` before init |
| `isPlaying` | state | whether the interval is running |
| `speed` | state | interval in ms; default 500; lower is faster |
| `stepCount` | state | steps advanced since the last reset |
| `generatorRef` | ref | the generator being consumed, or `null` |
| `timerRef` | ref | the `setInterval` handle |
| `logicalStateRef` | ref | the real `T`, independent of what is drawn |

### `reset(...args)`

1. Clears the timer and sets `isPlaying` false.
2. `initialData = algorithm.generateInput(...args)`; stores it in `logicalStateRef`.
3. Run mode: creates `algorithm.run(initialData)`, pulls the first yield and shows it. That
   first frame is not counted in `stepCount`.
4. Interactive mode: leaves the generator `null` and shows a "Ready" frame whose data is
   `algorithm.visualize(initialData)` when the definition has `visualize`, else the raw
   `initialData` (which no renderer can draw, so the viewport shows a placeholder).
5. `stepCount` back to 0.

Runs on mount and whenever `algorithm` changes (`useEffect(() => { reset(); }, [reset])`).

### `nextStep()` — also exposed as `stepForward`

1. No generator: set `isPlaying` false and return.
2. Pull the next value. If `done`: stop playing, null the generator, return. The last frame
   stays on screen, and Play/Step are inert until Reset or a new command.
3. `setCurrentStep(value)`.
4. Decide whether to update the logical state (next section).
5. Increment `stepCount`.

There is no history. Stepping backwards would need steps to be buffered, which nothing does.

### Logical state heuristic

```ts
if (!isGraphState(value.data) && !isGridState(value.data)) {
  logicalStateRef.current = value.data;
}
```

The intent: a yielded drawing must not overwrite the real data structure.

- Yielding `GraphState` or `GridState` leaves `logicalStateRef` alone. Interactive methods
  therefore persist changes only by mutating the object they received.
- Yielding anything else (a `number[]`, a `number[][]` heightmap, a `BSTNode`) replaces it.
- When `T` is itself a `GraphState` or `GridState`, yields never update it. Harmless in run
  mode, where the logical state is not read again.
- The check is skipped when `value.data` is falsy.

### `runCommand(methodName, args)`

Interactive mode only. Looks up `algorithm.methods[methodName]`, warns to the console and
returns if absent. Otherwise calls it with `(logicalStateRef.current, ...args)`, installs
the result as the active generator, and sets `isPlaying` true so the operation animates
immediately.

- A command issued mid-animation would replace the running generator; the UI prevents this
  by disabling custom buttons while playing.
- `stepCount` keeps accumulating across commands.
- `logicalStateRef.current!` can legitimately be `null` (empty BST); methods must handle it.

### Timer effect

```ts
useEffect(() => {
  if (isPlaying) timerRef.current = window.setInterval(nextStep, speed);
  else { clearInterval(timerRef.current); timerRef.current = null; }
  return () => clearInterval(timerRef.current);
}, [isPlaying, speed, nextStep]);
```

Changing speed while playing tears down and recreates the interval, which restarts the
current tick. `nextStep` has no dependencies, so it is stable.

## Lifecycle summary

```
mount -> reset() -> first frame
Play  -> interval -> nextStep() ... -> done -> stopped, generator null
Step  -> nextStep() once
Reset -> reset(primaryInputValue) -> new input, new generator
Button (interactive) -> runCommand(method, [arg]) -> plays that operation to the end
```
