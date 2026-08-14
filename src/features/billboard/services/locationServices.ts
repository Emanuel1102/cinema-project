import type { Country, Department, City, UserLocationPreference } from '../interfaces/location.interface';

const LOCATION_STORAGE_KEY = 'user_location_preference';

// Datos MOCK de prueba para ubicaciones
const MOCK_COUNTRIES: Country[] = [
  { id: 'co', name: 'Colombia' },
  { id: 'mx', name: 'México' },
];

const MOCK_DEPARTMENTS: Department[] = [
  { id: 'atl', name: 'Atlántico', countryId: 'co' },
  { id: 'bog', name: 'Bogotá D.C.', countryId: 'co' },
];

const MOCK_CITIES: City[] = [
  { id: 'baq', name: 'Barranquilla', departmentId: 'atl', isActive: true },
  { id: 'sol', name: 'Soledad', departmentId: 'atl', isActive: true },
  { id: 'bog-city', name: 'Bogotá', departmentId: 'bog', isActive: true },
];

// Métodos para consultar las listas
export const getCountries = async (): Promise<Country[]> => Promise.resolve(MOCK_COUNTRIES);

export const getDepartmentsByCountry = async (countryId: string): Promise<Department[]> => {
  return Promise.resolve(MOCK_DEPARTMENTS.filter((dep) => dep.countryId === countryId));
};

export const getCitiesByDepartment = async (departmentId: string): Promise<City[]> => {
  return Promise.resolve(MOCK_CITIES.filter((city) => city.departmentId === departmentId && city.isActive));
};

// Guardar la elección del usuario en localStorage
export const saveLocationPreference = (preference: UserLocationPreference): void => {
  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(preference));
};

// Leer la ubicación guardada desde localStorage (Esta es la que llama tu movieServices.ts)
export const getSavedLocationPreference = (): UserLocationPreference | null => {
  const data = localStorage.getItem(LOCATION_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};