import React, { useEffect, useState } from 'react';
import type { UserProfile, MembershipLevel } from '../interfaces/user.interface';
import { getUserProfile, updateUserProfile, RANK_CONFIG } from '../services/profileService';

export const ProfilePage: React.FC = () => {
  // Estados principales de la vista
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
    const updated = await updateUserProfile(formData);
    setProfile(updated);
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando perfil de Cineplex...</span>
        </div>
      </div>
    );
  }

  // Obtener la configuración visual del rango actual
  const currentRank = RANK_CONFIG[profile.membershipLevel as MembershipLevel] || RANK_CONFIG.ORO;
  
  // Cálculo de porcentaje para la barra de progreso
  const progressPercent = Math.min(
    Math.round(((profile.points - currentRank.minPoints) / (currentRank.maxPoints - currentRank.minPoints)) * 100),
    100
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 sm:p-8 md:p-12 font-sans relative overflow-hidden">
      
      {/* Luces neón ambientales de fondo */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#7C3AED]/15 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#DB2777]/10 rounded-full filter blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-widest text-[#818CF8] uppercase">Barranquilla, CO</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">ID: {profile.id}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">MI PERFIL Y MEMBRESÍA</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Acumula puntos con tus compras de entradas y snacks para subir de categoría.
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-auto px-5 py-2.5 text-xs font-bold tracking-wide uppercase bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl transition-all duration-300 active:scale-95 border border-[#818CF8]/30 shadow-lg shadow-[#7C3AED]/20"
          >
            {isEditing ? '✕ Cancelar' : '⚙️ Editar Perfil'}
          </button>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================
              COLUMNA IZQUIERDA: TARJETA CINEPASS + BARRA DE PROGRESO
             ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tarjeta CinePass con gradiente dinámico según Rango */}
            <div className={`bg-gradient-to-br ${currentRank.cardGradient} p-1 rounded-3xl border border-slate-700/50 shadow-2xl ${currentRank.glowClass}`}>
              <div className="bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-8 rounded-[22px] flex flex-col items-center text-center relative overflow-hidden">
                
                {/* Badge Superior */}
                <div className="w-full flex justify-between items-center mb-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${currentRank.badgeColor}`}>
                    NIVEL {currentRank.name}
                  </span>
                  <span className="text-xl font-black italic tracking-wider text-white">
                    P<span className="text-[#DB2777]">+</span>
                  </span>
                </div>

                <h2 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#818CF8] my-1">
                  CINEPASS+
                </h2>
                <p className="text-xs text-slate-400 font-medium">Miembro VIP ({profile.points} PTS)</p>

                {/* Código QR Dinámico */}
                <div className="bg-white p-3 rounded-2xl shadow-2xl my-6 border border-slate-700 transition-transform duration-300 hover:scale-105">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${profile.membershipCode}`}
                    alt="QR Membresía"
                    className="w-32 h-32"
                  />
                </div>

                <p className="text-[11px] font-mono text-slate-400 tracking-widest bg-slate-900/80 px-4 py-1.5 rounded-lg border border-slate-800">
                  {profile.membershipCode}
                </p>

                {/* Caja de Puntos */}
                <div className="mt-6 w-full bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Puntos Disponibles</span>
                    <p className="text-xl font-black text-[#818CF8] mt-0.5">{profile.points} PTS</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#818CF8]/10 flex items-center justify-center text-lg">
                    🍿
                  </div>
                </div>

              </div>
            </div>

            {/* TARJETA DE PROGRESO DE RANGO */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Progreso hacia el nivel siguiente</span>
                <span className="font-bold text-[#818CF8]">{progressPercent}%</span>
              </div>

              {/* Barra de estado con Tailwind */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className="bg-gradient-to-r from-[#7C3AED] to-[#DB2777] h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono pt-1">
                <span>{profile.points} pts</span>
                <span>Faltan {Math.max(0, currentRank.maxPoints - profile.points)} pts para {profile.membershipLevel === 'ORO' ? 'DIAMANTE' : 'siguiente nivel'}</span>
              </div>
            </div>

          </div>

          {/* =========================================================
              COLUMNA DERECHA: BENEFICIOS + DETALLES PERSONALES
             ========================================================= */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* SECCIÓN DE BENEFICIOS DEL RANGO */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DB2777] animate-pulse"></span>
                    BENEFICIOS NIVEL {currentRank.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Ventajas activas e incentivos desbloqueables</p>
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${currentRank.badgeColor}`}>
                  {currentRank.name}
                </span>
              </div>

              {/* Lista de beneficios */}
              <div className="grid grid-cols-1 gap-3">
                {currentRank.benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                      benefit.unlocked
                        ? 'bg-[#0F172A]/80 border-[#7C3AED]/30 shadow-md shadow-[#7C3AED]/5'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                      benefit.unlocked ? 'bg-[#7C3AED]/20 border border-[#7C3AED]/40' : 'bg-slate-800/50'
                    }`}>
                      {benefit.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-100">{benefit.title}</h3>
                        {benefit.unlocked ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            Desbloqueado
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            🔒 Bloqueado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN DETALLES PERSONALES / FORMULARIO */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
              
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]"></span>
                INFORMACIÓN PERSONAL
              </h2>

              {isEditing ? (
                /* Formulario de Edición */
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Nombre Completo</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#0F172A] border border-slate-700 focus:border-[#7C3AED] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Teléfono</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#0F172A] border border-slate-700 focus:border-[#7C3AED] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#DB2777] hover:bg-[#BE185D] py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest text-white transition-all duration-300 active:scale-95 shadow-lg shadow-pink-500/20 mt-4"
                  >
                    Guardar Cambios
                  </button>
                </form>
              ) : (
                /* Vista Estática de Datos */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="bg-[#0F172A]/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-slate-300 text-sm">
                      👤
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Nombre Completo</span>
                      <p className="font-bold text-sm text-slate-100 truncate">{profile.fullName}</p>
                    </div>
                  </div>

                  <div className="bg-[#0F172A]/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-sm">
                      ✉️
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Correo Electrónico</span>
                      <p className="font-bold text-sm text-slate-100 truncate">{profile.email}</p>
                    </div>
                  </div>

                  <div className="bg-[#0F172A]/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-sm">
                      🆔
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Documento</span>
                      <p className="font-bold text-sm text-slate-100 truncate">{profile.documentNumber}</p>
                    </div>
                  </div>

                  <div className="bg-[#0F172A]/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#818CF8]/20 border border-[#818CF8]/40 flex items-center justify-center text-[#818CF8] text-sm">
                      📞
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Teléfono</span>
                      <p className="font-bold text-sm text-slate-100 truncate">{profile.phone}</p>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};