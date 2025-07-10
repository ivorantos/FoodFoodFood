# Backend - Proyecto de Recetas y Planificación

Este proyecto contiene el backend para la aplicación de recetas y planificación de menús. Está pensado para ser ligero y escalable, con Express y TypeScript, usando SQLite para persistencia local.

---

## 📁 Estructura del proyecto

/server  
  /business-logic  
    /controllers      # Lógica de los endpoints (ej: recetas.controller.ts)  
    /repositories     # Acceso a datos, consultas a la base (wrapper SQLite o ORM)  
    /routers          # Rutas de Express (ej: recetas.router.ts)  

  /config  
    app.config.ts     # Configuración general (puerto, etc.)  
    db.config.ts      # Configuración y conexión a base de datos  

  /constants  
    statusCodes.ts    # Constantes HTTP (200, 404, 500, etc.)  

  /db  
    /models           # Definición de modelos (si no se usa ORM)  

  /helpers            # Funciones auxiliares y utilidades generales  

  /types  
    global.ts         # Tipos TypeScript compartidos (ej: tipo Receta)  

  app.ts              # Punto de entrada principal, arranca el servidor Express

---

## 🚀 Tecnologías y stack base

| Capa          | Tecnología                      |  
|---------------|--------------------------------|  
| Framework     | Express                        |  
| Base de datos | SQLite (usando `better-sqlite3` o `sqlite3`) |  
| ORM           | Opcional (de momento acceso directo o con wrapper) |  
| Lenguaje      | TypeScript                    |  
| Logger        | `console.log` (por ahora)      |  
| Autenticación | Por implementar (Keycloak o JWT futuro) |

---

## 🛠 Cómo arrancar el backend

1. Clonar el repositorio  
2. Entrar a la carpeta `server`  
3. Instalar dependencias:  
npm install


4. Configurar base de datos y variables en `/config` si aplica  
5. Ejecutar el servidor:  
npm run dev


Esto arrancará Express en el puerto configurado (por defecto 3000).

---

## 🧩 Desarrollo y escalabilidad

- Los controladores contienen la lógica por endpoint.  
- Los repositories abstraen el acceso a la base de datos.  
- Los routers exponen las rutas REST.  
- Los tipos TS en `/types/global.ts` se usan para modelar entidades (ej: `Receta`).  
- Se puede añadir Prisma u otro ORM más adelante para facilitar migraciones y modelado.  
- En el futuro se implementará autenticación (Keycloak, JWT o similar).  
- La base SQLite es ligera y permite arrancar rápido sin montar servidor externo.

---

## 🤝 Integración con frontend

Actualmente backend y frontend están separados en carpetas distintas bajo un mismo repositorio monorepo, con git y configuraciones independientes.

---

## 📚 Convenciones y recomendaciones

- Usar TypeScript para todo el código backend.  
- Organizar el código según la estructura propuesta para facilitar escalado.  
- Mantener el acceso a base de datos en repositories para poder cambiar fácilmente el driver o ORM.  
- Documentar controladores y funciones con comentarios JSDoc o similares.  
- Añadir tests unitarios e integración en `/test` (a futuro).

---