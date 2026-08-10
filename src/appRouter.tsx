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
    path: "upcoming",
    element:<UpcomingPage/>,
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
        path: 'movies-in-billboard',
        element: <MoviesOnBillboard/>,
      },
      {
        path:'upcomming-movies',
        element: 'proximas a estrenar'
      }
    ]
  }
]);