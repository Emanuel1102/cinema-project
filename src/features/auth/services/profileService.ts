import type { UserProfile } from '../interfaces/user.interface';

// 1. AÑADES AQUÍ LA CONFIGURACIÓN DE RANGOS Y BENEFICIOS
export const RANK_CONFIG = {
  BRONCE: {
    name: 'BRONCE',
    minPoints: 0,
    maxPoints: 500,
    badgeColor: 'bg-amber-700/20 text-amber-500 border-amber-600/40',
    cardGradient: 'from-amber-900/60 via-slate-900 to-[#0F172A]',
    accentColor: '#D97706',
    glowClass: 'shadow-amber-500/10',
    benefits: [
      { id: 'b1', title: '5% Descuento en Dulcería', description: 'En todos tus combos de crispetas y gaseosa', icon: '🍿', unlocked: true },
      { id: 'b2', title: 'Boleta de Cumpleaños', description: '1 entrada 2D gratis en el mes de tu cumpleaños', icon: '🎂', unlocked: true },
      { id: 'b3', title: 'Martes 2x1', description: 'Acceso a promociones de boletería los martes', icon: '🎟️', unlocked: true },
      { id: 'b4', title: 'Fila Preferencial VIP', description: 'Atención rápida en taquilla y dulcería', icon: '⚡', unlocked: false },
      { id: 'b5', title: 'Refill Gratis de Crispetas', description: 'Aplica para tamaño Extra Grande', icon: '🥤', unlocked: false },
    ]
  },
  PLATA: {
    name: 'PLATA',
    minPoints: 500,
    maxPoints: 1500,
    badgeColor: 'bg-slate-300/20 text-slate-200 border-slate-400/40',
    cardGradient: 'from-slate-600/40 via-slate-800 to-[#0F172A]',
    accentColor: '#94A3B8',
    glowClass: 'shadow-slate-400/20',
    benefits: [
      { id: 'b1', title: '10% Descuento en Dulcería', description: 'En todos tus combos de crispetas y gaseosa', icon: '🍿', unlocked: true },
      { id: 'b2', title: 'Boleta de Cumpleaños 3D', description: '1 entrada 2D/3D gratis en tu mes', icon: '🎂', unlocked: true },
      { id: 'b3', title: 'Martes 2x1', description: 'Acceso a promociones de boletería los martes', icon: '🎟️', unlocked: true },
      { id: 'b4', title: 'Fila Preferencial VIP', description: 'Atención rápida en taquilla y dulcería', icon: '⚡', unlocked: true },
      { id: 'b5', title: 'Refill Gratis de Crispetas', description: 'Aplica para tamaño Extra Grande', icon: '🥤', unlocked: false },
    ]
  },
  ORO: {
    name: 'ORO',
    minPoints: 1500,
    maxPoints: 3000,
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    cardGradient: 'from-amber-500/30 via-[#7C3AED]/30 to-[#0F172A]',
    accentColor: '#F59E0B',
    glowClass: 'shadow-amber-500/20',
    benefits: [
      { id: 'b1', title: '15% Descuento en Dulcería', description: 'En todos tus combos de crispetas y gaseosa', icon: '🍿', unlocked: true },
      { id: 'b2', title: 'Combo Cumpleaños Doble', description: '2 entradas + combo mediano gratis', icon: '🎂', unlocked: true },
      { id: 'b3', title: 'Preestrenos Exclusivos', description: 'Reserva de entradas 48h antes que el público general', icon: '🎬', unlocked: true },
      { id: 'b4', title: 'Fila Preferencial VIP', description: 'Atención rápida en taquilla y dulcería', icon: '⚡', unlocked: true },
      { id: 'b5', title: 'Refill Gratis de Crispetas', description: 'Aplica para tamaño Extra Grande', icon: '🥤', unlocked: true },
    ]
  },
  DIAMANTE: {
    name: 'DIAMANTE',
    minPoints: 3000,
    maxPoints: 5000,
    badgeColor: 'bg-[#DB2777]/20 text-[#DB2777] border-[#DB2777]/40',
    cardGradient: 'from-[#DB2777]/40 via-[#7C3AED]/40 to-[#0F172A]',
    accentColor: '#DB2777',
    glowClass: 'shadow-pink-500/30',
    benefits: [
      { id: 'b1', title: '20% Descuento General', description: 'Aplica en boletería, dulcería y promociones', icon: '👑', unlocked: true },
      { id: 'b2', title: 'VIP Combo Cumpleaños', description: 'Entradas VIP ilimitadas en tu mes de cumpleaños', icon: '🎂', unlocked: true },
      { id: 'b3', title: 'Acceso a Sala Lounge VIP', description: 'Espera el inicio de tu película en zona exclusiva', icon: '🛋️', unlocked: true },
      { id: 'b4', title: 'Upgrade Gratis a Sala VIP/3D', description: 'Sujeto a disponibilidad en taquilla', icon: '✨', unlocked: true },
      { id: 'b5', title: 'Refill Ilimitado', description: 'Gaseosa y crispetas ilimitadas en tu visita', icon: '🥤', unlocked: true },
    ]
  }
};

// 2. TUS FUNCIONES HABITUALES DEL SERVICIO
const PROFILE_STORAGE_KEY = 'user_profile_data';

const INITIAL_PROFILE: UserProfile = {
  id: 'usr-101',
  fullName: 'Juan Bolívar',
  email: 'juan.bolivar@email.com',
  phone: '+57 300 123 4567',
  documentNumber: '1098765432',
  membershipLevel: 'ORO',
  membershipCode: 'CINEPASS-2026-JB',
  points: 1850,
  nextLevelPoints: 3000
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const data = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(INITIAL_PROFILE));
    return Promise.resolve(INITIAL_PROFILE);
  }
  return Promise.resolve(JSON.parse(data));
};

export const updateUserProfile = async (
  updatedData: Partial<UserProfile>
): Promise<UserProfile> => {
  const currentProfile = await getUserProfile();
  const newProfile: UserProfile = { ...currentProfile, ...updatedData };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
  return Promise.resolve(newProfile);
};