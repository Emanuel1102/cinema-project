import { createBrowserRouter } from "react-router";
import { HomeMovies } from "./features/billboard/layouts/HomeMovies";
import { MoviesOnBillboard } from "./features/billboard/layouts/MoviesOnBillboard";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
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