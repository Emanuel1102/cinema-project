# Multicine

Aplicación frontend para consulta de cartelera, próximos estrenos, ubicación y reserva de funciones en una experiencia de cine moderna con React + TypeScript + Vite + Tailwind CSS.

El proyecto está preparado para consumir el backend real con los endpoints del contrato OpenAPI. La lógica de navegación, autenticación y cambio de ciudad se mantiene simple y clara, con un enfoque de componentes fáciles de entender y mantenimiento.

## Requisitos

- Node.js 18 o superior
- npm o pnpm
- Backend corriendo en http://localhost:3000

## Ejecución en desarrollo

1. Instala dependencias:

```bash
npm install
```

2. Inicia la app:

```bash
npm run dev
```

3. Abre la URL indicada por Vite en el navegador.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Estructura del proyecto

```text
src/
├── App.tsx                  # Provider principal de rutas y notificaciones
├── appRouter.tsx            # Definición de rutas de la aplicación
├── index.css                # Estilos globales y clases base de Tailwind
├── assets/                  # Imágenes y recursos visuales
├── features/
│   ├── auth/
│   │   ├── components/      # Login, registro y componentes auxiliares
│   │   ├── interfaces/      # Tipos de autenticación y perfil
│   │   ├── services/        # Integración de login y registro con backend
│   │   └── views/           # Páginas de login, registro y perfil
│   └── billboard/
│       ├── components/      # Header, Footer, modal de ubicación, trailers, etc.
│       ├── interfaces/      # Tipos de ciudades, películas, próximos estrenos
│       ├── layouts/         # Layout base de la cartelera
│       ├── services/        # Servicios legacy y compatibilidad
│       └── views/           # Cartelera, detalle, próximos estrenos y ubicación
├── lib/
│   ├── data.ts              # Datos locales de soporte y catálogo mock
│   ├── movies-api.ts        # Capa central para fetch a endpoints reales
│   └── store.ts             # Estado global persistido para usuario, ubicación y reservas
├── shared/
│   └── components/          # Botón de regreso y utilidades compartidas
└── main.tsx                 # Punto de entrada de React
```

## Flujo de rutas principales

- `/` → selector inicial de ciudad / ubicación
- `/login` → inicio de sesión
- `/register` → creación de cuenta
- `/movies` → cartelera principal
- `/movies/details/:movieId` → detalle de una película y selección de funciones
- `/movies/upcoming` → próximos estrenos y suscripción**
- `/movies/profile` → perfil del usuario**

## Estado global y contexto

El proyecto usa un store simple con localStorage para persistir:

- usuario autenticado
- token de sesión
- ubicación activa del usuario
- reservas en memoria del navegador

La lógica central está en [src/lib/store.ts](src/lib/store.ts), donde se guardan y leen estos valores para que el Header, la cartelera y la vista de detalle estén sincronizados.

## Endpoints integrados del backend

La aplicación consume los siguientes endpoints del backend en http://localhost:3000:

- Auth y usuarios
  - POST /api/users/auth
  - POST /api/users
  - PATCH /api/users/location

- Películas y cartelera
  - GET /api/v1/movies/weekly?cityId={id}
  - GET /api/v1/movies/today?cityId={id}
  - GET /api/v1/movies/upcoming
  - GET /api/movies/{id}
  - GET /api/movies/{id}/functions?cityId={id}

- Ubicación
  - GET /api/cities

- Notificaciones
  - POST /api/v1/notifications/upcoming

## Observaciones de implementación

- La selección de ciudad ocurre desde el modal de ubicación y se persiste para reflejar el nombre de la ciudad y el cityId en la app.
- La vista de detalle usa el id numérico o textual de la película provisto por la API y muestra sinopsis, duración, clasificación, trailer y funciones.
- La autenticación valida si existe usuario y token antes de continuar con la reserva.
- La navegación se mantiene con React Router y los botones de Header/Footer funcionan como enlaces o handlers reales.

## Recomendaciones

- Asegúrate de que el backend esté ejecutándose antes de iniciar la aplicación frontend.
- Si el backend devuelve un esquema ligeramente diferente al contrato, revisar los mappers en [src/lib/movies-api.ts](src/lib/movies-api.ts) antes de hacer cambios visuales.
- Mantén los componentes simples y legibles para que el proyecto siga siendo fácil de extender.
