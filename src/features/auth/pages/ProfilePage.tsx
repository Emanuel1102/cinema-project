import React, { useEffect, useState } from 'react';
import type { UserProfile, MembershipLevel } from '../interfaces/user.interface';
import { getUserProfile, updateUserProfile, RANK_CONFIG } from '../services/profileService';

// Definición de beneficios por nivel
interface Benefit {
  id: string;
  title: string;
  description: string;
  requiredLevel: MembershipLevel;
  iconPath: string;
}

const ALL_BENEFITS: Benefit[] = [
  {
    id: 'premiere',
    title: 'Acceso Premiere',
    description: 'Preventa exclusiva y acceso anticipado a los estrenos más esperados.',
    requiredLevel: 'ORO',
    iconPath: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  },
  {
    id: 'lounge',
    title: 'Salas VIP Lounges',
    description: 'Acceso ilimitado a áreas de descanso premium antes de tu función.',
    requiredLevel: 'PLATA',
    iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    id: 'popcorn',
    title: 'Refill de Palomitas',
    description: 'Un refill gratis en palomitas grandes por visita.',
    requiredLevel: 'PLATA',
    iconPath: 'M12 8v13m0-13V3m0 5l-4-3m4 3l4-3M5 21h14a2 2 0 002-2V9.5a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 9.5V19a2 2 0 002 2z',
  },
  {
    id: 'events',
    title: 'Eventos Privados',
    description: 'Invitaciones exclusivas a meet & greets y funciones privadas.',
    requiredLevel: 'DIAMANTE',
    iconPath: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  },
];

// Jerarquía para comparar qué nivel es mayor
const LEVEL_ORDER: Record<MembershipLevel, number> = {
  BRONCE: 1,
  PLATA: 2,
  ORO: 3,
  DIAMANTE: 4,
};

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '' });

  useEffect(() => {
    getUserProfile().then((data) => {
      setProfile(data);
      if (data) {
        setFormData({ fullName: data.fullName, phone: data.phone });
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const updated = await updateUserProfile(formData);
      setProfile(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({ fullName: profile.fullName, phone: profile.phone });
    }
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          <span>Cargando perfil de Cineplex...</span>
        </div>
      </div>
    );
  }

  const userLevelWeight = LEVEL_ORDER[profile.membershipLevel as MembershipLevel] || 1;
  const currentRank = RANK_CONFIG[profile.membershipLevel as MembershipLevel] || RANK_CONFIG.ORO;
  
  const progressPercent = Math.min(
    Math.round(((profile.points - currentRank.minPoints) / (currentRank.maxPoints - currentRank.minPoints)) * 100),
    100
  );

  return (
    <div className="min-h-screen bg-[#070913] text-white font-sans pb-24 md:pb-12">
      
      {/* NAVBAR SUPERIOR RESPONSIVA */}
      <nav className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-xl font-extrabold tracking-wider text-purple-400">CINEPLEX</span>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition">Home</a>
            <a href="#" className="hover:text-white transition">Movies</a>
            <a href="#" className="hover:text-white transition">Tickets</a>
            <a href="#" className="hover:text-white transition">CinePass</a>
            <a href="#" className="text-purple-400 font-bold border-b-2 border-purple-400 pb-0.5">Profile</a>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <button aria-label="Notificaciones" className="hover:text-purple-400 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button aria-label="Buscar" className="hover:text-purple-400 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center font-bold text-xs border border-white/20">
              {profile.fullName.charAt(0)}
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        
        {/* COLUMNA IZQUIERDA: TARJETA Y FORMULARIO */}
        <aside className="md:col-span-4 space-y-6">
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black text-white">Mi Perfil</h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ciudad de México, MX
              </p>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition flex items-center gap-1.5 bg-purple-900/30 px-3 py-1.5 rounded-full border border-purple-500/30 active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar Perfil
              </button>
            )}
          </div>

          {/* TARJETA VIP (CinePass+) */}
          <div className="rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-[#7C3AED] via-[#9333EA] to-[#DB2777] shadow-[0_0_25px_rgba(124,58,237,0.4)] border border-white/20">
            <div className="relative z-10 flex flex-col justify-between h-44">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">CinePass+ VIP</span>
                  <h2 className="text-2xl font-black text-white">{profile.membershipLevel}</h2>
                </div>
                <svg className="w-7 h-7 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 3h12l4 6-10 12L2 9l4-6z" />
                </svg>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-semibold text-white">{profile.fullName}</p>
                  <p className="text-[10px] font-mono text-white/60">ID: {profile.membershipCode}</p>
                </div>
                <div className="w-14 h-14 bg-white p-1 rounded-lg shadow">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${profile.membershipCode}`}
                    alt="QR Pass"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PROGRESO DE PUNTOS */}
          <div className="bg-[#121829]/80 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-white">Nivel {profile.membershipLevel}</span>
              <span className="text-purple-400">{profile.points.toLocaleString()} / {currentRank.maxPoints.toLocaleString()} pts</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-2 text-center">
              Faltan {(currentRank.maxPoints - profile.points).toLocaleString()} pts para el siguiente rango
            </p>
          </div>

          {/* FORMULARIO DATOS PERSONALES */}
          <div className="bg-[#121829]/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">Datos Personales</h3>
            
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.fullName}
                  disabled={!isEditing || isSaving}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#1A2238] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 disabled:opacity-60 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.phone}
                  disabled={!isEditing || isSaving}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#1A2238] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 disabled:opacity-60 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Correo Electrónico (Solo Lectura)</label>
                <input
                  type="text"
                  value={profile.email}
                  disabled
                  className="w-full bg-[#121829] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">DNI / Cédula (Solo Lectura)</label>
                <input
                  type="text"
                  value={profile.documentNumber}
                  disabled
                  className="w-full bg-[#121829] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </aside>

        {/* COLUMNA DERECHA: BENEFICIOS Y BANNER */}
        <section className="md:col-span-8 space-y-6">
          <h3 className="text-xl font-black text-white">Beneficios {profile.membershipLevel}</h3>

          {/* RENDERING DINÁMICO DE BENEFICIOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ALL_BENEFITS.map((benefit) => {
              const benefitWeight = LEVEL_ORDER[benefit.requiredLevel];
              const isUnlocked = userLevelWeight >= benefitWeight;

              return (
                <div
                  key={benefit.id}
                  className={`rounded-2xl p-5 border backdrop-blur-md transition-all ${
                    isUnlocked
                      ? 'bg-[#121829]/80 border-white/10'
                      : 'bg-[#121829]/30 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <svg
                      className={`w-8 h-8 ${isUnlocked ? 'text-purple-400' : 'text-slate-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={benefit.iconPath} />
                    </svg>

                    {isUnlocked ? (
                      <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
                        ✓ Desbloqueado
                      </span>
                    ) : (
                      <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                        🔒 Nivel {benefit.requiredLevel}
                      </span>
                    )}
                  </div>

                  <h4 className={`text-sm font-bold mb-1 ${isUnlocked ? 'text-white' : 'text-slate-300'}`}>
                    {benefit.title}
                  </h4>
                  <p className={`text-xs ${isUnlocked ? 'text-slate-400' : 'text-slate-500'}`}>
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* BANNER DECORATIVO */}
          <div className="rounded-2xl min-h-[160px] bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 border border-white/10 flex items-center justify-center p-6 md:p-8 text-center shadow-2xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 tracking-widest uppercase">
              Escapa a lo Extraordinario
            </h2>
          </div>
        </section>

      </main>

      {/* NAVBAR INFERIOR FIX PARA MOBILE CON Z-INDEX OPTIMIZADO */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex justify-around items-center z-50 shadow-2xl">
        <a href="#" className="flex flex-col items-center text-slate-400 text-[10px] gap-1 hover:text-purple-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          Movies
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 text-[10px] gap-1 hover:text-purple-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          Tickets
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 text-[10px] gap-1 hover:text-purple-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          CinePass
        </a>
        <a href="#" className="flex flex-col items-center text-purple-400 font-bold text-[10px] gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </a>
      </nav>

    </div>
  );
};
