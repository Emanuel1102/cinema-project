
export const MovieOnBillboad = () => {
  return (
    
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group flex flex-col">

        <div className="relative overflow-hidden">
            <img alt="titulo de la pelicula aqui" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1593538573197-4e3ee8a864d0?w=400&amp;h=600&amp;fit=crop&amp;auto=format"></img>
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1">🔥 FLASH</span>
            </div>
            <div className="absolute top-2 right-2">
                <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-amber-50 text-amber-700 border-amber-200">PG-13</span>
            </div>
            <div className="absolute bottom-2 left-2">
                <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                    </svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                    </svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                    </svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                    </svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                    </svg>
                    <span className="text-xs font-semibold text-amber-600 ml-0.5">4.0</span>
                </span>
            </div>
        </div>

        <div className="p-3 flex flex-col gap-2 flex-1">
            <div>
                <h3 className="text-gray-900"> Titulo </h3>
                <p className="text-xs text-gray-500 mt-0.5">Genero · duracion min</p>
            </div>
            <div className="flex gap-1 flex-wrap">
                <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-gray-100 text-gray-600 border-gray-200">Formato</span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-purple-50 text-purple-700 border-purple-200">VIP</span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-gray-100 text-gray-600 border-gray-200">doblada, subtitulada o en ingles </span>
            </div>
            <div className="flex flex-col gap-1.5">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Hoy 27 Jul</p>
                <div className="flex flex-wrap gap-1.5">
                    <button title="2D · Doblada" className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200">13:00 (hora)</button>
                    <button title="VIP · Doblada" className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all hover:border-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer bg-white border-gray-200 text-gray-700">16:30 (hora)</button>
                    <button title="2D · Doblada" className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200">19:00 (hora)</button>
                </div>
            </div>
            <div className="flex gap-2 mt-auto pt-1">
                <button className="flex-1 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    Ver detalle
                </button>
                <button className="bg-red-600 flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 cursor-pointer">
                    Comprar
                </button>
            </div>
        </div>
    </div>
    
  )
}
