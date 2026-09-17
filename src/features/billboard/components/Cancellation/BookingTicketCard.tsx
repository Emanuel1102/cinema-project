import React from 'react';

interface BookingTicketItem {
    id: string;
    movieTitle: string;
    theater: string;
    date: string;
    time: string;
    seat: string[];
    status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
    qrCodeUrl: string;
}

interface BookingTicketCardProps {
    ticket: BookingTicketItem;
    onOpenCancelModal: (ticketId: string) => void;
}

export const BookingTicketCard: React.FC<BookingTicketCardProps> = ({
    ticket,
    onOpenCancelModal,
}) => {
    const isCancelled = ticket.status === 'CANCELLED';
    const isExpired = ticket.status === 'EXPIRED';
    const isInactive = isCancelled || isExpired;
    
    return (
    <div className={`bg-slate-900 border rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-6 shadow-md transition-all ${
      isInactive ? 'border-slate-800 opacity-75' : 'border-slate-700 hover:border-indigo-500'
    }`}>
        {/* info de la orden */}
        <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{ticket.movieTitle}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    ticket.status === 'ACTIVE' ? 'bg-green-500/20 text-emerald-400' :
                    ticket.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'
                }`}>
                    {ticket.status === 'ACTIVE' ? 'Activo' : ticket.status === 'CANCELLED' ? 'Cancelado' : 'Expirado'}
                </span>
            </div>
            <p className="text-sm text-slate-400">{ticket.theater}</p>
            <p className="text-sm text-slate-400">{ticket.date} - {ticket.time}</p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
                {ticket.seat.map((seat) => (
                    <span key={seat} className="px-2 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-300">
                        {seat}
                    </span>
                ))}
            </div>
        </div>

        {/* QR code con manejo condicional si está inactivo */}
        <div className="relative flex flex-col items-center justify-center p-2 bg-white rounded-lg">
            <img 
                src={ticket.qrCodeUrl} 
                alt="QR Code" 
                className={`w-24 h-24 object-contain transition-all ${isInactive ? 'grayscale opacity-30 blur-[1px]' : ''}`} 
            />
            {isInactive && (
                <span className="absolute inset-flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-950/80 px-2 py-1 rounded">
                    {isCancelled ? 'Anulado' : 'Expirado'}
                </span>
            )}
        </div>

        {/* boton de cancelar reservación */}
        <div className="flex flex-col items-end justify-center gap-2">
            {ticket.status === 'ACTIVE' ? (
                <button
                    onClick={() => onOpenCancelModal(ticket.id)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                    Cancelar
                </button>
            ) : (
                <span 
                    className="text-xs italic text-slate-500 text-center px-3 py-1 bg-slate-800/50 rounded"
                    title={isCancelled ? "Esta boleta ya fue cancelada" : "Esta boleta ha expirado"}
                >
                    {isCancelled ? 'Reserva anulada' : 'Función finalizada'}
                </span>
            )}
        </div>
    </div>
    );
};