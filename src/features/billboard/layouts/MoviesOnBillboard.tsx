import { MovieOnBillboad } from "../components/MovieOnBillboardCard"

export const MoviesOnBillboard = () => {
  return (
    
    <div className="p-5 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 max-w-[80%]">
        <MovieOnBillboad/>
        <MovieOnBillboad/>
    </div>

  )
}
