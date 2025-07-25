# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# 💰 Gestión de Gastos

Una aplicación web moderna para la gestión de gastos personales y familiares, desarrollada con React + TypeScript + Material-UI.

## ✨ Características

- 📊 **Gestión completa de gastos** - Agregar, editar y eliminar gastos actuales y futuros
- 💳 **Soporte para tarjetas** - Asociar gastos futuros con tarjetas de crédito
- 🏷️ **Categorización** - Organizar gastos por categorías personalizables
- 📱 **Interfaz moderna** - Diseño responsivo con Material-UI
- 💾 **Persistencia local** - Los datos se guardan automáticamente en localStorage
- 🎯 **Navegación por tabs** - Interfaz intuitiva organizada por pestañas

## 🚀 Tecnologías

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Material-UI (MUI)** - Componentes y diseño
- **Vite** - Build tool y servidor de desarrollo
- **localStorage** - Persistencia de datos

## 🛠️ Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/gastos.git

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📋 Funcionalidades actuales

- ✅ CRUD completo de gastos (crear, leer, actualizar, eliminar)
- ✅ Diferenciación entre gastos actuales y futuros
- ✅ Asociación de tarjetas a gastos futuros
- ✅ Sistema de categorías
- ✅ Resumen de totales
- ✅ Interfaz de navegación por tabs
- ✅ Persistencia automática en localStorage

## 🔄 Próximas mejoras

- 📊 Gráficos y visualizaciones (Chart.js)
- 🔍 Búsqueda y filtros avanzados
- 📅 Vista de calendario
- 💳 Gestión de cuotas e installments
- 📈 Análisis de tendencias históricas
- 🌙 Modo oscuro/claro
- 📱 PWA (Progressive Web App)
- 🔄 Sincronización en la nube

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
