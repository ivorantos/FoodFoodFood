# React + TypeScript + Vite

/public  (otros recursos estáticos)

/src
  /assets              # Imágenes, íconos, etc.
  /components          # Reutilizables como botones, inputs, etc.
  /widgets             # Componentes funcionales independientes que gestionan lógica de datos.
    /Recipes           # Lógica y componentes relacionados con recetas
      Recipes.tsx
    /Planner           # Lógica y componentes del planificador
      Planner.tsx
  /routes              # Páginas completas que combinan widgets y componentes para construir pantallas.
    Root.tsx           # SPA root que intercambia Recipes ↔ Planner
  /core                # Configuración e inicialización de la aplicación
    /layout             # Define la estructura principal del diseño.
    /theme            # Configuración de Material UI para temas.
  App.tsx              # Entrada principal de React (puede redirigir a Root)
  main.tsx             # Monta la app en el DOM

index.html    # Archivo HTML principal.
vite.config.ts
tsconfig.json
package.json
.gitignore
README.md