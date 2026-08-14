import { Formulario } from "./features/billboard/pages";
import { createBrowserRouter } from "react-router";
import { UpcomingPage } from "./features/billboard/pages/UpcomingPage";
import { HomeMovies } from "./features/billboard/layouts/HomeMovies";
import { MoviesOnBillboard } from "./features/billboard/layouts/MoviesOnBillboard";
// import { ProfilePage } from './features/auth/pages/ProfilePage';
import { RegisterPage } from "./features/auth/pages/register/RegisterPage";
import { LoginPage } from "./features/auth/pages/login/LoginPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Formulario />,
  },
  {
    path: "/auth",
    element: 'Renderizar aqui tus rutas de auth',
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
        path: "upcoming",
        element: <UpcomingPage />,
      },
      // {
      //   path: "profile",
      //   element: <ProfilePage />,
      // },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);