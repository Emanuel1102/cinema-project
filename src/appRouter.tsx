import { createBrowserRouter } from "react-router"
import { RegisterPage } from "./features/auth/pages/register/RegisterPage"
import { LoginPage } from "./features/auth/pages/login/LoginPage"

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
])
