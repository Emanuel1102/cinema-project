import { Formulario } from "./features/billboard/pages";
import { createBrowserRouter } from "react-router";
import { HomeMovies } from "./features/billboard/layouts/HomeMovies";
import { MoviesOnBillboard } from "./features/billboard/layouts/MoviesOnBillboard";
import { UpcomingMoviesPage } from "./features/billboard/pages/UpcomingMoviesPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Formulario />,
  },
  {
    path: "/auth",
    element: "Renderizar aqui tus rutas de auth",
  },
  {
    path: "/movies",
    element: <HomeMovies />,
    children: [
      {
        index: true,
        element: <MoviesOnBillboard />,
      },
      {
        path: "movies-in-billboard",
        element: <MoviesOnBillboard />,
      },
      {
        path: "upcomming-movies",
        element: <UpcomingMoviesPage />,
      },
    ],
  },
]);