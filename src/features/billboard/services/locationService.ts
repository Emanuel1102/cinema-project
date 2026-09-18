import type {
  Country,
  Department,
  City,
  UserLocationPreference,
} from '../interfaces/location.interface';

const LOCATION_STORAGE_KEY = 'user_location_preference';
// Apunta a la variable de entorno o por defecto al json-server local en puerto 3000
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  return (await res.json()) as T;
}

// 1. GET /countries
export async function getCountries(): Promise<Country[]> {
  return fetchJson<Country[]>(`${API_BASE}/countries`);
}

// 2. GET /departments?countryId={id} (soporta ambos nombres de exportación)
export async function getDepartments(countryId: string): Promise<Department[]> {
  return fetchJson<Department[]>(`${API_BASE}/departments?countryId=${encodeURIComponent(countryId)}`);
}
export const getDepartmentsByCountry = getDepartments;

// 3. GET /cities?departmentId={id}   
export async function getCities(departmentId: string): Promise<City[]> {
  return fetchJson<City[]>(`${API_BASE}/cities?departmentId=${encodeURIComponent(departmentId)}`);
}
export const getCitiesByDepartment = getCities;

// 4. Manejo de LocalStorage para persistir la selección
export function saveLocationPreference(preference: UserLocationPreference): void {
  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(preference));
}

export function getSavedLocationPreference(): UserLocationPreference | null {
  const data = localStorage.getItem(LOCATION_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export default {
  getCountries,
  getDepartments,
  getDepartmentsByCountry,
  getCities,
  getCitiesByDepartment,
  saveLocationPreference,
  getSavedLocationPreference,
};