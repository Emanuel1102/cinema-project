import { createBrowserRouter } from "react-router";
import { LoginPage } from "./features/auth/pages/login/LoginPage";
import { ProfilePage } from "./features/auth/pages/ProfilePage";
import { RegisterPage } from "./features/auth/pages/register/RegisterPage";
import { HomeMovies } from "./features/billboard/layouts/HomeMovies";
import { MoviesOnBillboard } from "./features/billboard/layouts/MoviesOnBillboard";
import MovieDetails from "./features/billboard/pages/MovieDetails";
import { Formulario } from "./features/billboard/pages";
import { UpcomingPage } from "./features/billboard/pages/UpcomingPage";

export const appRouter = createBrowserRouter([
  { path: "/", element: <Formulario /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/movies",
    element: <HomeMovies />,
    children: [
      { index: true, element: <MoviesOnBillboard /> },
      { path: "upcoming", element: <UpcomingPage /> },
      { path: ":movieId", element: <MovieDetails /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);
