import { createBrowserRouter } from "react-router";
import { Formulario } from "./features/billboard/pages";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Formulario />,
  },
  {
    path: "/auth",
    element: 'Renderizar aqui tus rutas de auth'
  }
]);