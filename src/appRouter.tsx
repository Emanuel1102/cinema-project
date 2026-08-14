import { createBrowserRouter } from "react-router";
import { LoginPage } from "./features/auth/views/LoginView";
import { ProfilePage } from "./features/auth/views/ProfileView";
import { RegisterPage } from "./features/auth/views/RegisterView";
import { HomeMovies } from "./features/billboard/layouts/HomeMovies";
import { MoviesOnBillboard } from "./features/billboard/views/MoviesOnBillboardView";
import MovieDetails from "./features/billboard/views/MovieDetailsView";
import { Formulario } from "./features/billboard/views/LocationView";
import { UpcomingPage } from "./features/billboard/views/UpcomingView";

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
