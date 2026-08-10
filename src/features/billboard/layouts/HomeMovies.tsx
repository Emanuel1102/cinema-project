import { Outlet } from "react-router"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"

export const HomeMovies = () => {
  return (
    <>
        <Header/>
        <Outlet/>
        <Footer/>
    </>
  )
}
