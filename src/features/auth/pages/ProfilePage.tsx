import React, { useEffect, useState } from 'react';
import type { UserProfile } from '../interfaces/user.interface';
import { getUserProfile, updateUserProfile } from '../services/profileService';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '' });

  useEffect(() => {
    getUserProfile().then((data) => {
      setProfile(data);
      setFormData({ fullName: data.fullName, phone: data.phone });
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
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-gray-400">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 tracking-wide text-white">
          Mi Perfil & Membresía
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta de Membresía (Estilo CINEPLEX Pass) */}
          <div className="bg-[#182238] border border-gray-800 p-6 rounded-2xl flex flex-col items-center justify-between text-center shadow-2xl">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#818CF8]">
              Pase Exclusivo
            </span>
            <h2 className="text-3xl font-black text-[#DB2777] my-3 tracking-wide">
              {profile.membershipLevel}
            </h2>

            {/* Código QR */}
            <div className="bg-white p-3 rounded-xl shadow-lg my-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${profile.membershipCode}`}
                alt="Código QR Membresía"
                className="w-32 h-32"
              />
            </div>
            <p className="text-xs text-gray-400 font-mono mt-1">
              {profile.membershipCode}
            </p>

            <div className="mt-6 w-full pt-4 border-t border-gray-800">
              <span className="text-xs text-gray-400">Puntos Acumulados</span>
              <p className="text-2xl font-bold text-[#818CF8]">{profile.points} pts</p>
            </div>
          </div>

          {/* Formulario / Información del usuario */}
          <div className="md:col-span-2 bg-[#182238] border border-gray-800 p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Detalles Personales</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-xs font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition duration-200"
              >
                {isEditing ? 'Cancelar' : 'Editar Datos'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#DB2777] hover:bg-[#BE185D] py-2.5 rounded-xl text-sm font-bold transition duration-200 mt-2"
                >
                  Guardar Cambios
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="bg-[#0F172A] p-4 rounded-xl border border-gray-800/50">
                  <span className="block text-xs text-gray-500 mb-1">Nombre Completo</span>
                  <p className="font-semibold text-gray-200">{profile.fullName}</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-gray-800/50">
                  <span className="block text-xs text-gray-500 mb-1">Correo Electrónico</span>
                  <p className="font-semibold text-gray-200">{profile.email}</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-gray-800/50">
                  <span className="block text-xs text-gray-500 mb-1">Documento</span>
                  <p className="font-semibold text-gray-200">{profile.documentNumber}</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-gray-800/50">
                  <span className="block text-xs text-gray-500 mb-1">Teléfono</span>
                  <p className="font-semibold text-gray-200">{profile.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};