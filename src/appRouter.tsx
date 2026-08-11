import { Formulario } from "./features/billboard/pages";
import { createBrowserRouter } from "react-router";
import { UpcomingPage } from "./features/billboard/pages/UpcomingPage";
import { HomeMovies } from "./features/billboard/layouts/HomeMovies";
import { MoviesOnBillboard } from "./features/billboard/layouts/MoviesOnBillboard";
//Esta es la linea de importacion
import { ProfilePage } from './features/auth/pages/ProfilePage';
export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Formulario />,
  },

  {
    path: "/auth",
    element: 'Renderizar aqui tus rutas de auth'
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
        path: 'upcomming',
        element: <UpcomingPage />
      },

      //ESTO ES LO QUE HAY QUE AGREGAR
      {
        path: 'profile',
        element: <ProfilePage />
      }
      //HASTA AQUI
    ]
  }
]);







