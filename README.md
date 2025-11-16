# Proyecto Jóvenes Creativos – Frontend

Aplicación React + Vite que permite gestionar una biblioteca personal de videojuegos, consultar estadísticas y publicar reseñas conectadas a un backend Node/Express con MongoDB.

## Características principales

- **Biblioteca interactiva**: alta, edición y borrado de juegos con portada, género, estado, horas jugadas y calificación decimal (0–5).
- **Estadísticas en tiempo real**: totales de juegos, horas promedio, calificación media y juego más jugado basados en el estado global.
- **Reseñas conectadas al backend**: listado, creación, edición y eliminación usando `GET/POST/PUT/DELETE /api/reviews` con validaciones y slider de estrellas decimales.
- **Routing SPA**: navegación entre biblioteca/estadísticas y reseñas mediante React Router DOM.

## Stack

- React 19 + Vite 5/7 (HMR)
- React Router DOM 7
- ESLint 9 con reglas de hooks
- Backend objetivo: Node.js 20+, Express, MongoDB (ver `docs/backend-agent-brief.md`)

## Requisitos previos

- Node.js 20+
- npm 10+
- Backend en ejecución en `http://localhost:4000` con los endpoints:
  - `GET/POST/PUT/PATCH/DELETE /api/games`
  - `GET/POST/PUT/DELETE /api/reviews`

> **Nota:** El frontend usa `src/api/config.js` para definir `API_BASE_URL`. Cámbialo si despliegas el backend en otra URL.

## Instalación y ejecución

```bash
# Clonar e instalar dependencias del frontend
git clone <repo>
cd Proyecto-Jovenes-Creativos-Front
npm install

# En el repo del backend (ver documentación)
npm install
npm run dev  # expone http://localhost:4000

# De vuelta en este proyecto, iniciar Vite
npm run dev
```

La aplicación queda disponible (por defecto) en `http://localhost:5173`. Asegúrate de que el backend responda antes de abrir la vista de reseñas o biblioteca.

## Scripts disponibles

| Comando           | Descripción                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Servidor Vite con recarga en caliente         |
| `npm run build`   | Build de producción                           |
| `npm run preview` | Vista previa del build                        |
| `npm run lint`    | Ejecuta ESLint sobre `src/`                   |

## Estructura destacada

```text
src/
├── api/config.js         # URLs del backend (games/reviews)
├── App.jsx               # Estado global y routing
├── components/           # NavBar, GameCard, StarRating, etc.
├── pages/
│   ├── Library.jsx       # UI CRUD de juegos
│   ├── Reviews.jsx       # UI CRUD de reseñas conectadas a API
│   └── Stats.jsx         # Estadísticas agregadas
├── index.css / theme.css # Estilos base del sitio
```

La especificación para el agente backend (modelos, endpoints, checklist) se encuentra en `docs/backend-agent-brief.md`.

## Próximos pasos sugeridos

1. Implementar paginación/filtrado en `GET /api/games` y `GET /api/reviews` si la data crece.
2. Añadir feedback visual (toasts) para operaciones CRUD de juegos y reseñas.
3. Desplegar backend y frontend (Render/Vercel) y actualizar `API_BASE_URL` para producción.
