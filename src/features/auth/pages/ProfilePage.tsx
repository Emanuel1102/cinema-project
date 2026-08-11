import React, { useEffect, useState } from 'react';
// Importamos la interfaz (forma de los datos) y el servicio que lee del LocalStorage
import type { UserProfile } from '../interfaces/user.interface';
import { getUserProfile, updateUserProfile } from '../services/profileService';

export const ProfilePage: React.FC = () => {
  // ==========================================
  // 1. ESTADOS (Memoria local de la pantalla)
  // ==========================================
  
  // Guardará los datos del usuario (Nombre, puntos, etc.) una vez que se carguen.
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Controla si mostramos los datos estáticos (false) o el formulario de edición (true).
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Guarda lo que el usuario va escribiendo en los inputs cuando edita su perfil.
  const [formData, setFormData] = useState({ fullName: '', phone: '' });

  // ==========================================
  // 2. EFECTOS Y FUNCIONES (Lógica)
  // ==========================================
  
  // useEffect se ejecuta automáticamente SOLO UNA VEZ cuando la pantalla se carga por primera vez.
  useEffect(() => {
    // Llamamos al servicio para pedir los datos del perfil
    getUserProfile().then((data) => {
      setProfile(data); // Guardamos la info en el estado 'profile'
      if (data) {
        // Pre-llenamos el formulario con el nombre y teléfono actuales
        setFormData({ fullName: data.fullName, phone: data.phone });
      }
    });
  }, []); // El arreglo vacío [] asegura que solo se ejecute una vez al inicio

  // Función que se dispara cuando el usuario presiona "Guardar y Actualizar"
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue por defecto al enviar el formulario
    if (!profile) return;

    // Enviamos los nuevos datos al servicio para guardarlos
    const updated = await updateUserProfile(formData);
    
    setProfile(updated); // Actualizamos la pantalla con los nuevos datos
    setIsEditing(false);  // Cerramos el modo edición para volver a la vista normal
  };

  // Si los datos aún no terminan de cargar, mostramos una pantalla simple de "Cargando..."
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          {/* Círculo animado giratorio */}
          <div className="w-5 h-5 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando perfil de Cineplex...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. ESTRUCTURA VISUAL (Lo que ve el usuario)
  // ==========================================
  return (
    // Contenedor principal con fondo oscuro (#0F172A)
    <div className="min-h-screen bg-[#0F172A] text-white p-4 sm:p-8 md:p-12 font-sans relative overflow-hidden">
      
      {/* Círculos de luz difuminados al fondo (Efecto futurista de neón) */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#7C3AED]/15 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#DB2777]/10 rounded-full filter blur-[140px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        
        {/* ENCABEZADO: Título y Botón de Editar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#818CF8] uppercase">Barranquilla, CO</span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">MI PERFIL</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Gestiona tu cuenta, membresía VIP y preferencias.</p>
          </div>

          {/* Botón que conmuta 'isEditing' entre true y false al hacer clic */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-auto px-5 py-2.5 text-xs font-bold tracking-wide uppercase bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl transition-all duration-300 active:scale-95 border-glow-purple"
          >
            {isEditing ? '✕ Cancelar' : '⚙️ Editar Perfil'}
          </button>
        </div>

        {/* GRID PRINCIPAL: 2 Columnas (Membresía a la izquierda, Datos a la derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* -------------------------------------------------------------
              COLUMNA 1: Tarjeta de Membresía (CinePass+)
              ------------------------------------------------------------- */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#DB2777] via-[#818CF8]/40 to-[#0F172A] p-1 rounded-3xl glow-pink-btn">
            <div className="bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-8 rounded-[22px] flex flex-col items-center text-center relative overflow-hidden">
              
              {/* Nivel de Membresía */}
              <div className="w-full flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#DB2777]/20 text-[#DB2777] border border-[#DB2777]/40">
                  {profile.membershipLevel} VIP
                </span>
                <span className="text-xl font-black italic tracking-wider text-white">P<span className="text-[#DB2777]">+</span></span>
              </div>

              <h2 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#818CF8] my-1">
                CINEPASS+
              </h2>
              <p className="text-xs text-slate-400 font-medium">Miembro VIP ({profile.points} PTS)</p>

              {/* Generador automático de QR dinámico basado en el código del usuario */}
              <div className="bg-white p-3 rounded-2xl shadow-2xl my-6 border-glow-blue transition-transform duration-300 hover:scale-105">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${profile.membershipCode}`}
                  alt="QR Membresía"
                  className="w-32 h-32"
                />
              </div>

              {/* Código alfanumérico */}
              <p className="text-[11px] font-mono text-slate-400 tracking-widest bg-slate-900/80 px-4 py-1.5 rounded-lg border border-slate-800">
                {profile.membershipCode}
              </p>

              {/* Caja de Puntos acumulados */}
              <div className="mt-8 w-full bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Puntos Acumulados</span>
                  <p className="text-xl font-black text-[#818CF8] mt-0.5">{profile.points} PTS</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#818CF8]/10 flex items-center justify-center text-lg">
                  🍿
                </div>
              </div>

            </div>
          </div>

          {/* -------------------------------------------------------------
              COLUMNA 2: Detalles Personales
              ------------------------------------------------------------- */}
          <div className="lg:col-span-7 bg-glass border-glow-purple p-6 sm:p-8 rounded-3xl space-y-6">
            
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
              DETALLES PERSONALES
            </h2>

            {/* CONDICIONAL: Si 'isEditing' es true muestra el Formulario, si es false muestra las Tarjetas */}
            {isEditing ? (
              
              /* --- FORMULARIO PARA EDITAR --- */
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.fullName} // Muestra el valor del estado formData
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} // Actualiza el estado cuando escribes
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
                  className="w-full bg-[#DB2777] hover:bg-[#BE185D] py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest text-white transition-all duration-300 active:scale-95 glow-pink-btn mt-4"
                >
                  Guardar y Actualizar
                </button>
              </form>

            ) : (

              /* --- VISTA NORMAL DE DATOS --- */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nombre */}
                <div className="bg-[#0F172A]/70 p-4 rounded-2xl border-glow-blue flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-slate-300 text-sm">
                    👤
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Nombre Completo</span>
                    <p className="font-bold text-sm text-slate-100 truncate">{profile.fullName}</p>
                  </div>
                </div>

                {/* Correo */}
                <div className="bg-[#0F172A]/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-sm">
                    ✉️
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Correo Electrónico</span>
                    <p className="font-bold text-sm text-slate-100 truncate">{profile.email}</p>
                  </div>
                </div>

                {/* Cédula/Documento */}
                <div className="bg-[#0F172A]/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-sm">
                    🆔
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Número de Documento</span>
                    <p className="font-bold text-sm text-slate-100 truncate">{profile.documentNumber}</p>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="bg-[#0F172A]/70 p-4 rounded-2xl border-glow-blue flex items-center gap-4">
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

            {/* Preferencias ficticias de adorno visual */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3">Preferencias de cuenta</span>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-slate-900 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  🔔 Notificaciones de estrenos
                </span>
                <span className="text-xs bg-slate-900 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  💳 Métodos de pago
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};