import { Formulario } from "./features/billboard/pages";
import { createBrowserRouter } from "react-router";
import { UpcomingPage } from "./features/billboard/pages/UpcomingPage";
import { HomeMovies } from "./features/billboard/layouts/HomeMovies";
import { MoviesOnBillboard } from "./features/billboard/layouts/MoviesOnBillboard";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Formulario/>,
  },
  {
    path: "/auth",
    element: 'Renderizar aqui tus rutas de auth'
  },
  {
    path: "/movies",
    element: <HomeMovies/>,
    children: [
      {
        index: true,
        element: <MoviesOnBillboard/>,
      },
      {
        path:'upcomming',
        element: <UpcomingPage/>
      }
    ]
  }
]);