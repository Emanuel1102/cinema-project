
export const Footer = () => {
  return (

    <footer className="border-t border-gray-100 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                        <rect x="2" y="2" width="8" height="8" rx="1.5"></rect>
                        <rect x="14" y="2" width="8" height="8" rx="1.5"></rect>
                        <rect x="2" y="14" width="8" height="8" rx="1.5"></rect>
                        <rect x="14" y="14" width="8" height="8" rx="1.5"></rect>
                    </svg>
                </div>
                <span className="text-gray-700">MULTICINE</span>
            </div>
            <div className="flex gap-6 text-xs text-gray-400">
                <button className="hover:text-red-600 transition-colors cursor-pointer">Cartelera</button>
                <button className="hover:text-red-600 transition-colors cursor-pointer">Próximamente</button>
                <button className="hover:text-red-600 transition-colors cursor-pointer">Mi Cuenta</button>
                <button className="hover:text-red-600 transition-colors cursor-pointer">Bonos de Regalo</button>
                <button className="hover:text-red-600 transition-colors cursor-pointer">PQRS</button>
                <button className="hover:text-red-600 transition-colors cursor-pointer">Términos</button>
            </div>
            <p className="text-xs text-gray-400">© 2025 Multicine · API v1.0</p>
        </div>
    </footer>

  )
}
