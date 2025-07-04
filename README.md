# Meal Planner App

Aplicación web SPA desarrollada con React, TypeScript y Vite para la planificación semanal de comidas y gestión de recetas.  
Permite alternar entre un módulo de recetas y un planificador de menús, con una arquitectura modular basada en widgets y rutas.

---

## Estructura del proyecto

/public  
Recursos estáticos (imágenes, iconos, etc.)

/src  
- /assets  
  Imágenes, iconos y otros recursos estáticos usados en la app  
- /components  
  Componentes reutilizables y genéricos (botones, inputs, etc.)  
- /widgets  
  Componentes funcionales independientes con lógica propia  
  - /Recipes  
    Lógica y componentes relacionados con las recetas (Recipes.tsx)  
  - /Planner  
    Lógica y componentes para el planificador semanal (Planner.tsx)  
- /routes  
  Páginas completas que combinan widgets y componentes  
  - Root.tsx: Componente raíz que intercambia entre Recipes y Planner  
- /core  
  Configuración e inicialización global  
  - /layout: Estructura principal del layout  
  - /theme: Configuración y personalización del tema (Material UI)  
- App.tsx  
  Punto de entrada principal de React  
- main.tsx  
  Montaje de React en el DOM  

index.html  
Archivo HTML principal

vite.config.ts  
Configuración de Vite

tsconfig.json  
Configuración de TypeScript

package.json  
Dependencias y scripts

.gitignore  
Archivos ignorados por Git

README.md  
Documentación del proyecto

---

## Tecnologías usadas

- React 18 (hooks y functional components)  
- TypeScript  
- Vite (bundler y servidor de desarrollo rápido)  
- Material UI (MUI) para UI kit y tematización  
- React Router para navegación SPA  

---

## Descripción general

- **Recipes**: módulo para visualizar, buscar y gestionar recetas.  
- **Planner**: módulo para asignar comidas y cenas a días de la semana.  
- **Root**: componente que alterna entre Recipes y Planner sin recargar la página.  
- Arquitectura basada en **widgets** y **rutas** para mantener el código modular y escalable.

---

## Cómo ejecutar

1. Clona el repositorio  
2. Instala dependencias con  
   `npm install` o `yarn`  
3. Levanta el servidor de desarrollo con  
   `npm run dev` o `yarn dev`  
4. Abre en el navegador <http://localhost:5173>  

---

## Próximas mejoras

- Integración con base de datos (Supabase, Firebase…)  
- Autenticación y perfiles de usuario  
- Exportar plan semanal a PDF  
- Tests unitarios e integración  
- Optimización de UI/UX y accesibilidad  

---

¿Tienes sugerencias o quieres colaborar? ¡Abre un issue o PR! 😊
