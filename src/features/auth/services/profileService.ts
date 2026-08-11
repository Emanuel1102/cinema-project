// Importamos la interfaz que define qué estructura deben tener los datos del usuario
import type { UserProfile } from '../interfaces/user.interface';

// Clave con la que guardaremos y leeremos los datos en el LocalStorage del navegador
const PROFILE_STORAGE_KEY = 'user_profile_data';

// Datos iniciales de prueba (Mock Data) que se usarán la primera vez que abra la app
const INITIAL_PROFILE: UserProfile = {
  id: 'usr-101',
  fullName: 'Juan Bolívar',
  email: 'juan.bolivar@email.com',
  phone: '+57 300 123 4567',
  documentNumber: '1098765432',
  membershipLevel: 'ORO',
  membershipCode: 'CINEPASS-2026-JB',
  points: 1250,
};

/**
 * Función asíncrona para obtener los datos del perfil del usuario.
 * @returns Promesa con los datos del perfil (UserProfile)
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  // 1. Buscamos si ya existen datos guardados en el LocalStorage
  const data = localStorage.getItem(PROFILE_STORAGE_KEY);

  // 2. Si es la primera vez (no hay datos en LocalStorage):
  if (!data) {
    // Guardamos los datos de prueba iniciales en el almacenamiento local
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(INITIAL_PROFILE));
    // Retornamos esos mismos datos iniciales dentro de una Promesa
    return Promise.resolve(INITIAL_PROFILE);
  }

  // 3. Si ya existían datos, los convertimos de texto JSON a un objeto JavaScript y lo retornamos
  return Promise.resolve(JSON.parse(data));
};

/**
 * Función asíncrona para actualizar los datos editados por el usuario.
 * @param updatedData Objeto con solo los campos que se van a modificar (ej. fullName o phone)
 * @returns Promesa con el perfil actualizado
 */
export const updateUserProfile = async (
  updatedData: Partial<UserProfile>
): Promise<UserProfile> => {
  // 1. Obtenemos la información actual guardada
  const currentProfile = await getUserProfile();

  // 2. Mezclamos la información vieja con los nuevos cambios recibidos (...spread operator)
  const newProfile: UserProfile = { ...currentProfile, ...updatedData };

  // 3. Guardamos la nueva versión actualizada en el LocalStorage convertida a texto
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));

  // 4. Retornamos el objeto actualizado
  return Promise.resolve(newProfile);
};