import { Link } from "react-router"

export const Header = () => {
  return (
    
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm"><div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
            <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center ">
                <svg className="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <rect x="2" y="2" width="8" height="8" rx="1.5"></rect>
                    <rect x="14" y="2" width="8" height="8" rx="1.5"></rect>
                    <rect x="2" y="14" width="8" height="8" rx="1.5"></rect>
                    <rect x="14" y="14" width="8" height="8" rx="1.5"></rect>
                </svg>
            </div>
            <span className="text-gray-900 hidden sm:block">MULTICINE</span>
        </div>
        <nav className="flex items-center gap-1 text-sm font-medium">
            <Link to="movies-in-billboard" className="px-3 py-1.5 rounded-lg transition-colors text-red-600 bg-red-50 cursor-pointer">
                Cartelera
            </Link>
            <Link to="upcomming-movies" className="px-3 py-1.5 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer">
                Próximamente
            </Link>
        </nav>
        <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>Soacha
            </button>
            <button className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            </button>
            <button className="px-4 py-1.5 rounded-xl text-white bg-red-600 text-sm font-semibold transition-all hover:opacity-90 cursor-pointer">
                Ingresar
            </button>
        </div></div>
    </header>

  )
}
