import type { UserProfile } from '../interfaces/user.interface';

const PROFILE_STORAGE_KEY = 'user_profile_data';

// Datos de prueba iniciales (Mock)
const MOCK_USER: UserProfile = {
  id: 'usr-001',
  fullName: 'Juan Bolívar',
  email: 'juan.bolivar@example.com',
  phone: '3001234567',
  documentNumber: '1098765432',
  membershipLevel: 'ORO',
  membershipCode: 'MEMB-2026-JUAN',
  points: 1250,
};

// Obtener los datos del perfil guardados en LocalStorage o devolver el Mock
export const getUserProfile = async (): Promise<UserProfile> => {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (stored) {
    return Promise.resolve(JSON.parse(stored));
  }
  // Si es la primera vez, guardamos el mock y lo retornamos
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(MOCK_USER));
  return Promise.resolve(MOCK_USER);
};

// Función para actualizar datos (editar teléfono, nombre, etc.)
export const updateUserProfile = async (updatedData: Partial<UserProfile>): Promise<UserProfile> => {
  const current = await getUserProfile();
  const newData = { ...current, ...updatedData };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newData));
  return Promise.resolve(newData);
};