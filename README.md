# Multicine

Aplicación web de cartelera de cine creada con React, Vite y TypeScript. Permite seleccionar una ubicación, consultar películas disponibles, ver sus detalles, reproducir tráileres y realizar reservas simuladas.

La aplicación usa datos locales mientras el backend está en desarrollo. La lógica está preparada para sustituir esas fuentes simuladas por endpoints sin cambiar las vistas ni los componentes.

## Funcionalidades

- Selección de país, departamento y ciudad antes de entrar a la cartelera.
- Cambio de ubicación desde el encabezado reutilizando el mismo formulario inicial.
- Cartelera construida desde el arreglo `movies` de `src/lib/data.ts`.
- Vista de detalle por película usando el identificador de cada película.
- Filtros de funciones por fecha, formato y ciudad.
- Tráileres y detalles de próximos estrenos en modales.
- Inicio de sesión simulado y reservas guardadas en `localStorage`.
- Notificaciones visuales para acciones como reservar o consultar reservas.

## Tecnologías

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Sonner para notificaciones
- Lucide React para iconos

## Estructura del proyecto

```text
src/
├── assets/                 # Imágenes y recursos locales
├── features/
│   ├── auth/
│   │   ├── components/     # Formularios y piezas reutilizables de autenticación
│   │   ├── interfaces/     # Tipos de usuario y autenticación
│   │   ├── services/       # Funciones simuladas de autenticación y perfil
│   │   └── views/          # Pantallas de login, registro y perfil
│   └── billboard/
│       ├── components/     # Header, footer, formulario, modales y componentes de película
│       ├── interfaces/     # Tipos de ubicación, películas y próximos estrenos
│       ├── layouts/        # Estructura compartida de las pantallas de cartelera
│       ├── services/       # Servicios simulados de ubicación y próximos estrenos
│       └── views/          # Pantallas de ubicación, cartelera, detalle y próximos estrenos
├── lib/
│   ├── data.ts             # Datos simulados principales: películas, ciudades y funciones
│   ├── movies-api.ts       # Capa de consultas de películas y reservas pendientes
│   └── store.ts            # Estado compartido persistido en localStorage
├── App.tsx                 # Proveedor de rutas y notificaciones
├── appRouter.tsx           # Definición de rutas de la aplicación
└── index.css               # Estilos globales y utilidades visuales
```

## Flujo de datos actual

1. `src/lib/data.ts` contiene el arreglo `movies`; cada objeto tiene un `id` único.
2. La cartelera consume ese arreglo y navega a `/movies/:movieId` al seleccionar **Ver detalle**.
3. `src/lib/movies-api.ts` centraliza las funciones `fetchMovie`, `fetchFunctions` y `fetchRecommendations`. Actualmente responden con datos locales y son el punto donde se conectarán los endpoints reales.
4. `src/lib/store.ts` guarda ubicación, usuario y reservas simuladas en `localStorage` para que estén disponibles entre componentes.

## Rutas principales

| Ruta | Pantalla |
| --- | --- |
| `/` | Selector inicial de ubicación |
| `/login` | Inicio de sesión |
| `/register` | Registro |
| `/movies` | Cartelera |
| `/movies/:movieId` | Detalle de una película |
| `/movies/upcoming` | Próximos estrenos |
| `/movies/profile` | Perfil de usuario |

## Ejecutar el proyecto localmente

1. Instala Node.js en una versión actual LTS.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el entorno de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre en el navegador la dirección indicada por Vite.

## Comandos disponibles

```bash
npm run dev    # Inicia Vite en modo desarrollo
npm run lint   # Revisa errores de estilo y TypeScript con ESLint
npm run build  # Valida TypeScript y genera la versión de producción
npm run preview # Previsualiza la compilación de producción
```

## Conectar el backend

Cuando los endpoints estén disponibles, conserva las vistas y componentes. Solo reemplaza las respuestas simuladas de `src/lib/movies-api.ts`, los servicios de `src/features/*/services` y, si corresponde, la información local de `src/lib/data.ts` por llamadas con `fetch`.

De esta forma se mantienen los mismos parámetros, estados de carga y handlers que ya consume la interfaz.
