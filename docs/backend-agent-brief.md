# Backend Agent Brief – Proyecto Jóvenes Creativos

## 1. Objetivo
Extender el backend Node.js/Express existente para exponer API REST completas de **juegos** y **reseñas**, persistidas en MongoDB, consumidas por el frontend React actual.

## 2. Modelos de datos
### 2.1. Game (colección `games`)
```json
{
  "id": "string",              // alias de _id
  "name": "string",            // requerido
  "genre": "string",           // requerido
  "cover": "string (URL)",     // requerido
  "rating": 0.0,                // número 0-5 (1 decimal)
  "status": "Pendiente|Jugando|Completado",
  "hoursPlayed": 0,             // entero >= 0
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### 2.2. Review (colección `reviews`) – **nuevo**
```json
{
  "id": "string",              // alias de _id
  "gameId": "string",          // referencia a games._id
  "gameName": "string",        // denormalizado para UI
  "review": "string",          // texto >= 10 chars
  "rating": 0.0,                // número 0-5 (1 decimal)
  "cover": "string (URL)",     // opcional, copia de cover del juego
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

- Crear índice `{ gameId: 1, createdAt: -1 }` para listar reseñas por juego.
- Validar que `rating` esté entre 0 y 5 (backend redondea a 1 decimal).

## 3. Endpoints requeridos

### 3.1. Games (ya implementados)

| Método | Endpoint            | Descripción                        |
|--------|---------------------|------------------------------------|
| GET    | `/api/games`        | Lista todos los juegos             |
| GET    | `/api/games/:id`    | Obtiene un juego                   |
| POST   | `/api/games`        | Crea juego                         |
| PUT    | `/api/games/:id`    | Reemplaza juego completo           |
| PATCH  | `/api/games/:id`    | Actualiza campos parciales         |
| DELETE | `/api/games/:id`    | Elimina juego                      |

### 3.2. Reviews (nuevo)

| Método | Endpoint                    | Descripción                                        | Body esperado                              |
|--------|-----------------------------|----------------------------------------------------|---------------------------------------------|
| GET    | `/api/reviews`              | Lista reseñas (orden `createdAt` desc por defecto) | —                                           |
| GET    | `/api/reviews/:id`          | Obtiene reseña por id                              | —                                           |
| GET    | `/api/reviews/game/:gameId` | Lista reseñas de un juego específico               | —                                           |
| POST   | `/api/reviews`              | Crea reseña validada                               | `{ gameId, gameName, review, rating, cover? }` |
| PUT    | `/api/reviews/:id`          | Reemplaza una reseña completa                      | `{ gameId, gameName, review, rating, cover? }` |
| PATCH  | `/api/reviews/:id`          | Actualiza campos parciales                         | `{ ...campos }`                             |
| DELETE | `/api/reviews/:id`          | Elimina una reseña                                 | —                                           |

Notas:

- `POST /api/reviews` debe validar que `gameId` exista en `games`. Si el juego se elimina, considerar `on delete cascade` manual para reseñas relacionadas.
- Todas las respuestas devuelven `id` string (no `_id`).
- Incluir paginación opcional (`?page=1&limit=20`).

## 4. Validaciones y reglas

- `gameId`: string requerido, formato ObjectId. Validar existencia.
- `gameName`: trim, longitud ≥ 1. Puede copiarse del documento `game` para evitar joins.
- `review`: mínimo 10 caracteres, máximo 2000.
- `rating`: número 0–5, aceptar decimales (1 decimal). Redondear/clamp en backend.
- `cover`: si se envía, validar URL. Puede poblarse automáticamente usando el juego vinculado.
- Auditar `createdAt`/`updatedAt` via timestamps de Mongoose.

## 5. Estructura sugerida (resumen)

```text
src/
  routes/
    games.routes.js
    reviews.routes.js
  controllers/
    game.controller.js
    review.controller.js
  models/
    Game.js
    Review.js
  validators/
    game.schema.js
    review.schema.js (Zod)

```

- `review.controller.js` implementa `listReviews`, `listReviewsByGame`, `getReview`, `createReview`, `deleteReview`.
- Middleware `validateRequest(schema)` reutilizable para Zod.
- Añadir pruebas con Vitest + Supertest para `POST /api/reviews` y `GET /api/reviews`.

## 6. Integración con el frontend

- El frontend ahora consume:
  - `GET http://localhost:4000/api/reviews` al montar la vista de reseñas.
  - `POST http://localhost:4000/api/reviews` para crear una reseña.
  - `PUT http://localhost:4000/api/reviews/:id` para editar una reseña existente.
  - `DELETE http://localhost:4000/api/reviews/:id` para eliminar reseñas.
- El backend debe devolver el objeto creado completo; el frontend inserta la reseña en memoria y muestra `createdAt` formateado.
- Para futuras mejoras, exponer `DELETE /api/reviews/:id` permitirá gestionar reseñas desde la UI.

## 7. Checklist para el agente backend

- [ ] Crear modelo `Review` con esquema anterior e índice `{ gameId: 1, createdAt: -1 }`.
- [ ] Añadir rutas/controladores/validadores para endpoints de reseñas.
- [ ] Asegurar CORS (`http://localhost:5173`).
- [ ] Proveer seed o script opcional para reseñas de ejemplo.
- [ ] Actualizar `README` del backend con endpoints nuevos y ejemplo de payload.
- [ ] Extender pruebas automatizadas para la nueva colección (incluyendo PUT/PATCH/DELETE).
