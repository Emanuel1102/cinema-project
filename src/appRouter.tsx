import { createBrowserRouter } from "react-router";
import { LoginPage } from "./features/auth/views/LoginView";
import { ProfilePage } from "./features/auth/views/ProfileView";
import { RegisterPage } from "./features/auth/views/RegisterView";
import { HomeMovies } from "./features/billboard/layouts/HomeMovies";
import { MoviesOnBillboard } from "./features/billboard/views/MoviesOnBillboardView";
import MovieDetails from "./features/billboard/views/MovieDetailsView";
import { Formulario } from "./features/billboard/views/LocationView";
import { UpcomingPage } from "./features/billboard/views/UpcomingView";
import { SeatSelectionView } from "./features/billboard/views/SeatSelectionView";
import { CheckoutPaymentView } from "./features/billboard/views/CheckoutPaymentView";
import { OrderSuccessView } from "./features/billboard/views/OrderSuccessView";
import { SnacksSelectionView } from "./features/billboard/views/SnacksSelectionView";

export const appRouter = createBrowserRouter([
  { path: "/", element: <Formulario /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/seats/:functionId",
    element: <SeatSelectionView />,
  },
  {
    path: "/seats",
    element: <SeatSelectionView />,
  },
  {
    path: "/checkout/snacks",
    element: <SnacksSelectionView />,
  },
  {
    path: "/checkout/payment",
    element: <CheckoutPaymentView />,
  },
  {
    path: "/checkout/success",
    element: <OrderSuccessView />,
  },
  {
    path: "/movies",
    element: <HomeMovies />,
    children: [
      { index: true, element: <MoviesOnBillboard /> },
      { path: "upcoming", element: <UpcomingPage /> },
      { path: "details/:movieId", element: <MovieDetails /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);
