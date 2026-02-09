# 🧠 Algorithm Visualizer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)
![Astro](https://img.shields.io/badge/Astro-4.0-FF5D01.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

> **Una plataforma interactiva y educativa para visualizar algoritmos clásicos de Ciencias de la Computación.**
> Construido con rendimiento y mantenibilidad en mente.

![Demo Preview](public/demo-placeholder.gif)
*(¡Reemplaza esto con un GIF de tu visualizador funcionando!)*

## ✨ Características Principales

Este no es solo otro visualizador. Está diseñado para ser **extensible** y **fácil de entender**.

* **📚 Multi-Categoría:** Soporte para Ordenamiento, Búsqueda de Caminos (Pathfinding), Estructuras de Datos, Generación de Terrenos y más.
* **🎮 Control Total:** Pausa, reproduce, retrocede y ajusta la velocidad de la animación en tiempo real.
* **🧊 2D y 3D:** Renderizado de grillas clásicas y terrenos en 3D (Three.js).
* **⚡ Arquitectura Moderna:** Construido sobre **Astro** y **React** para máxima velocidad.
* **🛠️ Type-Safe:** Código 100% TypeScript estricto.
* **🧩 Arquitectura Plug-and-Play:** Agregar un nuevo algoritmo es tan fácil como crear un solo archivo. El sistema lo detecta automáticamente.

## 🧮 Algoritmos Implementados

### 📶 Sorting (Ordenamiento)
* Bubble Sort, Selection Sort, Insertion Sort
* Merge Sort, Quick Sort
* Shell Sort, Gnome Sort, Cocktail Shaker

### 🗺️ Pathfinding & Graph (Grafos)
* Dijkstra, A* (A-Star)
* BFS (Breadth-First Search), DFS (Depth-First Search)
* Prim's Algorithm (MST)

### ⛰️ Terrain & Mazes (Procedural)
* Maze Generators
* Diamond-Square (3D Terrain)
* Cellular Automata (Caves)

### 🧩 Backtracking
* Sudoku Solver
* N-Queens
* Graph Coloring

---

## 🚀 Instalación y Uso

Asegúrate de tener instalado **Node.js** (v18+) y **pnpm**.

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/algorithm-visualizer.git](https://github.com/tu-usuario/algorithm-visualizer.git)
    cd algorithm-visualizer
    ```

2.  **Instala las dependencias:**
    ```bash
    pnpm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    pnpm dev
    ```

4.  Abre tu navegador en `http://localhost:4321`.

---

## 🏗️ Estructura del Proyecto

Para los curiosos, así organizamos el código:

```text
src/
├── algorithms/          # 🧠 El corazón lógico
│   ├── sorting/         # Algoritmos de ordenamiento
│   ├── pathfinding/     # Algoritmos de búsqueda
│   └── types.ts         # Interfaces TypeScript (Start here!)
├── components/          # ⚛️ Componentes React (UI)
│   ├── renderers/       # Visualizadores (Grid2D, Terrain3D)
│   └── common/          # Botones, Sliders, Controles
├── pages/               # 🚀 Rutas de Astro
└── utils/               # 🛠️ Helpers y el AlgorithmLoader mágico
```

## 🤝 Cómo Contribuir

¡Nos encanta recibir ayuda de la comunidad! Ya seas un estudiante queriendo practicar o un veterano queriendo optimizar.

1.  Lee nuestra [Guía de Contribución](CONTRIBUTING.md) (¡Es muy detallada!).
2.  Busca un Issue con la etiqueta `good first issue` o `help wanted`.
3.  Haz un Fork y envía tu Pull Request.

**¿Quieres agregar un algoritmo nuevo?**
Es muy sencillo. El sistema usa `Generators` (`function*`) para manejar los pasos. Revisa `src/algorithms/sorting/bubbleSort.ts` para ver un ejemplo simple de cómo funciona.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Eres libre de usarlo para estudiar, enseñar o crear tus propios proyectos derivados.

---

<div align="center">
  <sub>Hecho con ❤️ para la comunidad de desarrolladores.</sub>
</div>
