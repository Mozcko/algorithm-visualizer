import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // 0. Carpetas generadas (no son código fuente)
  { ignores: ["dist/", ".astro/", "node_modules/"] },

  // 1. Configuración Global
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,astro}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // 2. Recomendados Base
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,

  // 3. Configuración React
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
    settings: {
      react: { 
        version: "19.0" // Forzamos la versión (coincide con package.json)
      },
    },
  },
  // 4. Reglas Específicas para Algoritmos 🧠
  {
    rules: {
      // Permite 'any' (útil para prototipar algoritmos rápido)
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Permite variables no usadas si empiezan con _ (ej: _index)
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      
      // A veces los algoritmos necesitan loops infinitos controlados
      "no-constant-condition": ["warn", { "checkLoops": false }]
    }
  },

  // 5. Prettier (Siempre al final)
  eslintConfigPrettier,
];
