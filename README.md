# Multicine

Aplicación frontend de cine desarrollada con React + TypeScript + Vite + Tailwind CSS para gestionar cartelera, selección de ciudad, compra de boletas, pago, confirmación digital y cancelación de reservas.

Este repositorio refleja el estado real del proyecto: incluye el flujo de compra completo de punta a punta, una arquitectura modular por features, servicios desacoplados y una capa de persistencia transaccional en sessionStorage/localStorage para soporte de reservas y cancelación.

## 1. Visión general

Multicine es una SPA orientada a la compra de entradas para cine con un flujo de UX guiado:

1. Selección de ciudad y cine
2. Consulta de cartelera semanal y próxima
3. Detalle de película y horarios
4. Selección interactiva de sillas
5. Confitería y cálculo reactivo de subtotal
6. Pasarela de pago por tarjeta o PSE
7. Confirmación con ticket digital y QR simulado
8. Historial de boletas y cancelación con liberación de sillas

La experiencia se concentra en la feature billboard, con componentes y servicios especializados para cada paso del proceso de compra.

## 2. Stack tecnológico

- React 19
- TypeScript 6
- Vite 8
- React Router 8
- Tailwind CSS 4
- Axios
- Lucide React
- json-server (mock backend opcional)
- ESLint + React Hooks

### Dependencias clave declaradas en package.json

```json
"dependencies": {
  "@tailwindcss/cli": "^4.3.3",
  "@tailwindcss/vite": "^4.3.3",
  "@tanstack/react-router": "^1.170.25",
  "axios": "^1.20.0",
  "clsx": "^2.1.1",
  "lucide-react": "^1.46.0",
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-router": "^8.3.0",
  "react-router-dom": "^7.18.2",
  "sonner": "^2.0.8",
  "tailwind-merge": "^3.6.0",
  "tailwindcss": "^4.3.3"
},
"devDependencies": {
  "@eslint/js": "^10.0.1",
  "@types/node": "^24.13.3",
  "@types/react": "^19.2.17",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^6.0.4",
  "eslint": "^10.8.0",
  "eslint-plugin-react-hooks": "^7.1.1",
  "eslint-plugin-react-refresh": "^0.5.3",
  "globals": "^17.7.0",
  "typescript": "~6.0.2",
  "typescript-eslint": "^8.65.0",
  "vite": "^8.2.0"
}
```

### Requisitos de entorno recomendados

- Node.js 18+
- npm o pnpm
- Git
- Navegador moderno
- Backend mock o API real en http://localhost:3000

## 3. Instalación y ejecución

### Opción 1: con npm

```bash
npm install
npm run dev
```

### Opción 2: con pnpm

```bash
pnpm install
pnpm dev
```

### Instalación del backend mock con json-server

```bash
npm install -D json-server
# o
pnpm add -D json-server
```

### Ejecutar backend local

```bash
npx json-server --watch db.json --port 3000
```

o con pnpm:

```bash
pnpm exec json-server --watch db.json --port 3000
```

### Variables de entorno recomendadas

El frontend usa la siguiente base por defecto en los servicios:

```bash
VITE_API_BASE=http://localhost:3000
```

## 4. Scripts del proyecto

```bash
npm run dev      # arranca Vite en modo desarrollo
npm run build    # compila TypeScript + Vite
npm run preview  # vista previa de la build
npm run lint     # valida ESLint
```

## 5. Estructura real del proyecto

```text
src/
├── App.tsx
├── appRouter.tsx
├── index.css
├── main.tsx
├── assets/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── interfaces/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   └── views/
│   └── billboard/
│       ├── components/
│       │   ├── Cancellation/
│       │   │   ├── BookingTicketCard.tsx
│       │   │   ├── BookingStatusBadge.tsx
│       │   │   ├── CancelConfirmModal.tsx
│       │   │   ├── RefundSummary.tsx
│       │   │   └── index.ts
│       │   ├── SeatMap/
│       │   │   ├── RoomLayout.tsx
│       │   │   ├── SeatItem.tsx
│       │   │   ├── SeatLegend.tsx
│       │   │   ├── ScreenIndicator.tsx
│       │   │   └── index.ts
│       │   ├── CountdownTimer.tsx
│       │   ├── CountryForm.tsx
│       │   ├── Footer.tsx
│       │   ├── Header.tsx
│       │   ├── MovieOnBillboardCard.tsx
│       │   ├── UpcomingDetailModal.tsx
│       │   ├── MovieItems/
│       │   └── index.ts
│       ├── interfaces/
│       │   ├── cancellation.interface.ts
│       │   ├── location.interface.ts
│       │   ├── location.ts
│       │   ├── movie.interface.ts
│       │   ├── payment.interface.ts
│       │   ├── seat.interface.ts
│       │   ├── snack.interface.ts
│       │   ├── upcoming.interface.ts
│       │   └── index.ts
│       ├── layouts/
│       │   ├── HomeMovies.tsx
│       │   └── index.ts
│       ├── services/
│       │   ├── cancellationService.ts
│       │   ├── locationService.ts
│       │   ├── movieServices.ts
│       │   ├── paymentService.ts
│       │   ├── seatService.ts
│       │   ├── snackService.ts
│       │   ├── upcomingServices.ts
│       │   └── info.md
│       ├── store/
│       │   └── index.ts
│       ├── utils/
│       │   ├── info.md
│       │   └── useSeatSelection.ts
│       └── views/
│           ├── CheckoutPaymentView.tsx
│           ├── LocationView.tsx
│           ├── MovieDetailsView.tsx
│           ├── MoviesOnBillboardView.tsx
│           ├── OrderSuccessView.tsx
│           ├── ProfilePage.tsx
│           ├── SeatSelectionView.tsx
│           ├── SnacksSelectionView.tsx
│           ├── UpcomingMoviesView.tsx
│           └── UpcomingView.tsx
├── lib/
│   ├── data.ts
│   ├── error-capture.ts
│   ├── error-page.ts
│   ├── lovable-error-reporting.ts
│   ├── movies-api.ts
│   └── store.ts
├── shared/
│   ├── components/
│   │   ├── BackToHomeButton.tsx
│   │   └── index.ts
│   ├── interfaces/
│   └── utils/
├── public/
├── db.json
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig*.json
├── vite.config.ts
├── README.md
└── pnpm-lock.yaml (si se usa pnpm)
```

## 6. Arquitectura de rutas y navegación

La navegación está definida en `src/appRouter.tsx` utilizando `createBrowserRouter` de React Router.

### Rutas principales

```text
/                         -> Formulario / selector de ciudad y cine
/login                   -> Login
/register                -> Registro
/seats/:functionId       -> Matriz interactiva de sillas
/seats                   -> Fallback con función por defecto
/checkout/snacks         -> Selección de confitería
/checkout/payment        -> Pasarela de pago
/checkout/success        -> Confirmación de compra y boleta digital
/movies                  -> Cartelera principal
/movies/upcoming         -> Próximos estrenos
/movies/details/:movieId -> Detalle de película y función
/movies/profile          -> Historial y cancelación de reservas
```

### Flujo de compra de extremo a extremo

#### 1) `/` → Selección de ciudad y cine

- `LocationView.tsx` / `Formulario` inicia la experiencia.
- Permite seleccionar ciudad y cine para reflejar el contexto de compra.
- La ciudad se usa luego para filtrar cartelera y funciones.

#### 2) `/movies` → Cartelera semanal y del día

- `MoviesOnBillboardView.tsx`
- Muestra catálogo semanal y funciones vigentes.
- Hace uso de servicios de películas y ubicación para poblar las tarjetas.

#### 3) `/movies/details/:movieId` → Ficha técnica y selección de horario

- `MovieDetailsView.tsx`
- Presenta la sinopsis, duración, género, clasificación y horario disponible.
- Desde ahí se navega hacia la selección de asientos.

#### 4) `/seats` o `/seats/:functionId` → HU-10, matriz interactiva de sillas

- `SeatSelectionView.tsx`
- Consulta la función actual mediante `seatService.getSeatsByFunction(functionId)`.
- Renderiza una `RoomLayout` con filas y sillas.
- Soporta bloqueo de reserva por tiempo, máximo 8 sillas y estados `available`, `sold`, `reserved`, `disabled`.
- Al continuar, guarda la sesión transaccional en `sessionStorage` bajo la clave `checkout_selection`.

#### 5) `/checkout/snacks` → HU-12, confitería con sumatoria reactiva

- `SnacksSelectionView.tsx`
- Carga el catálogo desde `snackService.getSnacks()`.
- Calcula subtotal según la selección del usuario.
- Actualiza el mismo `checkout_selection` con `snacks` y `totalPrice` recalculado.

#### 6) `/checkout/payment` → HU-11, pago multicanal con Service Layer desacoplado

- `CheckoutPaymentView.tsx`
- Permite pago por tarjeta o PSE.
- Se usa `paymentService.processPayment(payload, sessionData.seats)`.
- `paymentService` encapsula:
  - almacenamiento en `localStorage` (`user_booking_history`)
  - registro opcional en backend mock `/api/bookings`
  - actualización de estado de sillas a `sold` en la función
- El estado temporal se limpia con `sessionStorage.removeItem("checkout_selection")` justo antes de ir a éxito.

#### 7) `/checkout/success` → HU-11 / HU-13, ticket digital con QR simulado

- `OrderSuccessView.tsx`
- Lee `order_confirmation` desde `sessionStorage`.
- Muestra boleta digital con orden, sillas y monto final.
- Simula QR con un bloque visual y un identificador de comprobante.

#### 8) `/movies/profile` → HU-13 y HU-14, historial y cancelación

- `ProfilePage.tsx`
- Lee `user_booking_history` desde `localStorage`.
- Renderiza boletas con `BookingTicketCard` y estado con `BookingStatusBadge`.
- Permite cancelar reservas activas con `CancelConfirmModal` y `cancellationService.cancelBooking(orderId)`.
- Al cancelar, las sillas se liberan a `available` vía PATCH a `/functions/{functionId}`.

## 7. Flujo de estado y persistencia

### a) sessionStorage: estado transaccional de compra

Se usa para el ciclo de compra activo en curso. Las claves relevantes son:

- `checkout_selection`
- `order_confirmation`

#### `checkout_selection`

Almacena la selección actual de la compra:

```ts
{
  functionId: string,
  reservationId: string,
  seats: Seat[],
  totalPrice: number,
  snacks?: SelectedSnack[],
}
```

Se crea en `SeatSelectionView` y se actualiza en `SnacksSelectionView`.

#### `order_confirmation`

Se guarda al confirmar el pago en `CheckoutPaymentView`.

```ts
{
  orderId: string,
  seats: Seat[],
  totalPaid: number,
  date: string
}
```

Esto permite mantener la información de la compra en memoria temporal mientras se navega a la vista final de éxito.

### b) localStorage: persistencia de historial y sesión

Las claves persistentes documentadas en la implementación son:

- `user_booking_history`: historial de compras confirmadas y canceladas
- credenciales de usuario / sesión del usuario si la app lo habilita en el futuro

Ejemplo de uso en `paymentService` y `cancellationService`.

### c) Patrón anti-cascada: lazy state initialization

El proyecto aplica el patrón recomendado para evitar `react-hooks/set-state-in-effect` y renders en cascada:

```ts
const [sessionData] = useState<CheckoutSessionData | null>(() => {
  const raw = sessionStorage.getItem("checkout_selection");
  return raw ? JSON.parse(raw) : null;
});
```

Esta técnica se usa en:

- `CheckoutPaymentView.tsx`
- `SnacksSelectionView.tsx`
- `ProfilePage.tsx`
- `OrderSuccessView.tsx`

La intención es leer storage de forma síncrona desde el primer render, sin disparar efectos secundarios innecesarios.

## 8. Arquitectura de servicios y lógica de negocio

### Seat service

Archivo: `src/features/billboard/services/seatService.ts`

Responsabilidades:

- `GET /functions/{id}` para obtener la distribución de la sala
- `PATCH /functions/{id}` para actualizar la disponibilidad de sillas
- apoyo al flujo de selección de asientos con tiempos de reserva y validaciones de estado

### Snack service

Archivo: `src/features/billboard/services/snackService.ts`

Responsabilidades:

- `GET /api/snacks`
- fallback a mock local si la API no responde

### Payment service

Archivo: `src/features/billboard/services/paymentService.ts`

Responsabilidades:

- validar y procesar la transacción
- registrar el pedido en `localStorage`
- registrar la operación en `POST /api/bookings`
- marcar sillas como `sold` con `PATCH /functions/{id}`

### Cancellation service

Archivo: `src/features/billboard/services/cancellationService.ts`

Responsabilidades:

- buscar la reserva por `orderId`
- actualizar el historial local a `CANCELLED`
- liberar sillas a `available`
- enviar `PATCH /api/bookings/{orderId}`

## 9. Contratos de integración y endpoints

El proyecto está preparado para consumir endpoints REST tanto del backend real como del mock local con json-server.

### Endpoints de funciones y sillas

```http
GET /api/functions/{id}
PATCH /api/functions/{id}
```

Uso real implementado:

- `seatService.getSeatsByFunction(functionId)`
- `seatService.lockSeats({ functionId, seatIds })`
- `paymentService.processPayment()` actualiza sillas a `sold`
- `cancellationService.cancelBooking()` actualiza sillas a `available`

### Catálogo de confitería

```http
GET /api/snacks
```

Se consulta desde `snackService.getSnacks()` con fallback a MOCK_SNACKS si el backend no está disponible.

### Registro y cancelación de reservas

```http
POST /api/bookings
PATCH /api/bookings/{orderId}
```

El mock `db.json` incluye la colección `reservations`, y los servicios apuntan a `/api/bookings` con respuesta tolerante si el endpoint no está disponible.

### Estructura de ejemplo del mock backend

```json
{
  "functions": [
    {
      "id": "f-101",
      "movieId": "m-101",
      "cinemaId": "cine-1",
      "roomName": "Sala 1 (Macro XE)",
      "showtime": "7:30 PM",
      "basePrice": 15000,
      "seats": [
        { "id": "A-1", "row": "A", "number": 1, "status": "available", "price": 15000 }
      ]
    }
  ],
  "snacks": [
    { "id": "snack-1", "name": "Combo Pareja", "price": 32000 }
  ],
  "bookings": [
    {
      "orderId": "ORD-123456",
      "functionId": "f-101",
      "seats": ["A-1", "A-2"],
      "totalPaid": 45000,
      "status": "APPROVED"
    }
  ]
}
```

## 10. Reglas y buenas prácticas implementadas

- Separación por feature: `auth` y `billboard`
- Servicios desacoplados por dominio (`seatService`, `snackService`, `paymentService`, `cancellationService`)
- Estado transaccional cargado desde `sessionStorage` para no perder la compra en recarga
- Persistencia durable en `localStorage` para historial y boletas
- Protección de UX con validación de flujo y mensajes de error amigables
- UI modular con componentes reutilizables y subcarpetas dedicadas a SeatMap, Cancellation y MovieItems
- Mantenimiento simple con `barrel exports` (`index.ts`)

## 11. Verificación y validación

Este proyecto cuenta con validación de build y lint:

```bash
npm run build
npm run lint
```

La compilación actual del repo está preparada para Vite + React + TypeScript. La estrategia de configuración adoptada es compatible con la estructura y rutas existentes del proyecto.

## 12. Recomendaciones de ejecución local

1. Instala dependencias con npm o pnpm.
2. Levanta `json-server` en puerto 3000.
3. Ejecuta `npm run dev` o `pnpm dev`.
4. Entra a la ruta local indicada por Vite.
5. Revisa los pasos del flujo:
   - selección de ciudad
   - cartelera
   - detalles de película
   - elección de sillas
   - confitería
   - pago
   - éxito
   - historial y cancelación

## 13. Conclusión

Multicine tiene una arquitectura sólida y moderna para una aplicación de compra de boletos de cine. El proyecto ya refleja los requisitos funcionales del flujo de compra desde la selección de sillas (HU-10) hasta la cancelación de reservas (HU-14), con un diseño centrado en user experience, modularidad y mantenimiento del código.

La implementación actual está lista para continuar evolucionando hacia un backend real con contrato OpenAPI, sin requerir reestructuración grande del frontend, ya que los servicios y los modelos de dominio están desacoplados y preparados para cambiar la fuente de datos sin romper la UI.

---

## Resumen operativo rápido

```bash
npm install
npx json-server --watch db.json --port 3000
npm run dev
```

o

```bash
pnpm install
pnpm exec json-server --watch db.json --port 3000
pnpm dev
```
