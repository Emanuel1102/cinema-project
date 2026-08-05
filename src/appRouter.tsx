import { createBrowserRouter } from "react-router";
import { UpcomingPage } from "./features/billboard/pages/UpcomingPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
  {
    path: "upcoming",
    element:<UpcomingPage/>,
  },
  {
    path: "/auth",
    element: 'Renderizar aqui tus rutas de auth'
  }
]);