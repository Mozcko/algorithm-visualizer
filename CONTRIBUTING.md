# Contributing to Algorithm Visualizer 🚀

¡Gracias por tu interés en contribuir! Este es un proyecto educativo diseñado para ayudar a estudiantes y desarrolladores a entender algoritmos complejos de manera visual.

Nuestra misión es: **Hacer el código legible y la visualización intuitiva.**

## 🛠️ Cómo agregar un nuevo algoritmo

Sigue estos 4 pasos sencillos para integrar tu algoritmo favorito.

### 1. Elige la Categoría
Navega a la carpeta `src/algorithms/`. Encontrarás carpetas por tipo:
* `sorting/` (Ordenamiento)
* `pathfinding/` (Búsqueda de caminos)
* `backtracking/`
* `greedy/`
* ...

Si tu algoritmo no encaja en ninguna, discútelo primero abriendo un Issue o crea una carpeta nueva si tiene sentido.

### 2. Crea el Archivo de Implementación
Crea un archivo TypeScript (ej: `myNewSort.ts`) dentro de la carpeta correspondiente.
Tu función debe seguir la estructura definida en `src/algorithms/types.ts`.

**Ejemplo Base (Sorting):**

```typescript
import { AlgorithmStep, AlgorithmState } from '../types';

export const myNewSort = (array: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr = [...array]; // Trabaja siempre con una copia

  // 1. Registra el estado inicial
  steps.push({ array: [...arr], highlights: [], description: 'Inicio del algoritmo' });

  // 2. Tu lógica
  for (let i = 0; i < arr.length; i++) {
    // Registra pasos intermedios para la animación
    steps.push({
      array: [...arr],
      highlights: [i], // Índices a resaltar en rojo/verde
      description: `Analizando índice ${i}`
    });
  }

  return steps;
};
```

### 3. Registra el Algoritmo (¡Es Automático!)
Nuestro sistema carga dinámicamente todos los archivos `.ts` dentro de la carpeta `src/algorithms/`.
Para que tu algoritmo sea detectado, solo debes asegurarte de **exportar por defecto** un objeto que cumpla con la interfaz `AlgorithmDefinition`.

Asegúrate de definir correctamente estos campos clave en tu exportación:

```typescript
import { AlgorithmDefinition } from '../types';

const myAlgorithm: AlgorithmDefinition<number[]> = {
  id: 'my-unique-algo-id',    // DEBE ser único en todo el proyecto
  name: 'My New Sort',        // Nombre visible en la UI
  category: 'Sorting',        // 'Sorting' | 'Pathfinding' | 'Data Structures' | etc.
  visualizer: 'bar-chart',    // Tipo de visualización: 'bar-chart' | 'grid-2d' | etc.
  description: 'Una breve explicación de cómo funciona tu algoritmo.',
  
  // Función para generar datos iniciales aleatorios
  generateInput: (size = 10) => Array.from({ length: size }, () => Math.random() * 100),

  // El generador principal de la animación
  run: function* (input) {
    // ... tu lógica aquí (yield steps)
  }
};

export default myAlgorithm;
```

### 4. Prueba tu cambio 🧪

Una vez que hayas creado tu archivo (ej: `src/algorithms/sorting/myNewSort.ts`):

1.  Asegúrate de que el servidor de desarrollo esté corriendo:
    ```bash
    pnpm dev
    ```
2.  Abre `http://localhost:4321` en tu navegador.
3.  Busca tu algoritmo en el menú lateral. Debería aparecer automáticamente bajo la categoría que definiste (ej: "Sorting").
4.  Ejecútalo y verifica:
    * ¿La animación fluye correctamente?
    * ¿El código respeta los pasos lógicos?
    * ¿La descripción de cada paso (`description`) ayuda a entender lo que sucede?

---

## 🎨 Guía de Estilo

Para mantener el proyecto educativo y mantenible, seguimos estas reglas:

### 1. Tipado Estricto (TypeScript)
Evita el uso de `any`. Utiliza las interfaces que hemos preparado en `src/algorithms/types.ts`:

* Usa `AlgorithmDefinition<T>` para la estructura principal.
* Usa `SimulationStep<T>` para cada paso que emite tu generador.
* Usa `GridState` o `GraphState` si estás haciendo algo visual como grafos o laberintos.

### 2. Generadores (`function*`)
Usamos **Generadores** de JavaScript para controlar la animación paso a paso.
* **No** uses `setTimeout` ni `setInterval` dentro de tu lógica.
* En su lugar, usa `yield` cada vez que quieras mostrar un cambio visual.
* Esto permite al usuario pausar, retroceder y controlar la velocidad desde la UI central.

**Ejemplo correcto:**
```typescript
// ✅ BIEN: El runner controla el tiempo
for (let i = 0; i < len; i++) {
  yield {
    data: [...arr],
    highlightedIndices: [i],
    description: `Revisando índice ${i}`
  };
}
```

**Ejemplo incorrecto:**

```typescript
// ❌ MAL: Bloquea el hilo y rompe el control de velocidad
setTimeout(() => {
  actualizarArray();
}, 1000);
```

### 3. Simplicidad Educativa 🎓
Recuerda que el usuario final de este proyecto suele ser un estudiante o alguien aprendiendo desde cero.
* **Código Legible:** Prefiere un código claro y paso a paso sobre "one-liners" (código en una sola línea) complejos.
* **Comentarios:** Si tu algoritmo tiene una parte matemática compleja, añade un comentario breve explicando *por qué* funciona.
* **Nombres Descriptivos:** Usa nombres de variables que expliquen lo que representan (ej: `indiceActual` en lugar de `i`, `nodoVisitado` en lugar de `n`).

### 4. Formato y Linting 🧹
Antes de subir tu Pull Request, asegúrate de que tu código cumple con las reglas de estilo del proyecto. Esto evita discusiones innecesarias sobre espacios o puntos y coma.

```bash
pnpm format
```

## 🐛 Reportando Bugs

Si encuentras un error (por ejemplo, una visualización que se traba, un cálculo incorrecto o la animación no termina), por favor repórtalo siguiendo estos pasos:

1.  Ve a la pestaña **Issues** en GitHub.
2.  Crea un nuevo issue. Si existe una plantilla de **"Bug Report"**, úsala.
3.  Proporciona la siguiente información clave para que podamos reproducirlo:
    * **Algoritmo afectado:** (Ej: *QuickSort* o *Dijkstra*).
    * **Input del escenario:** ¿Qué datos usaste? (Ej: "Un array inversamente ordenado de tamaño 10" o "Un laberinto sin solución").
    * **Navegador:** (Ej: Chrome 90, Firefox, Safari).
    * **Comportamiento observado:** Describe qué pasó (Ej: "La barra roja se queda pegada al final y no termina la animación").
    * **Capturas de pantalla:** Si es un error visual, una imagen o GIF vale más que mil palabras.

---

## 💡 Solicitando Nuevos Algoritmos

¿Echas de menos algún algoritmo clásico de Ciencias de la Computación? ¡Pídelo!

1.  Abre un Issue con el título "Feat: [Nombre del Algoritmo]".
2.  Explica brevemente qué es.
3.  **Importante:** Adjunta un enlace a una referencia confiable (Wikipedia, GeeksForGeeks, libro de texto) para
