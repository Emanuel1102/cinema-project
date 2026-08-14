const API_BASE = (import.meta as any).env?.VITE_API_BASE || "";

async function safeFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  return (await res.json()) as T;
}

export async function getCountries(): Promise<string[]> {
  if (!API_BASE) throw new Error("API base not configured");
  return safeFetch<string[]>(`${API_BASE.replace(/\/$/,"")}/countries`);
}

export async function getDepartments(country: string): Promise<string[]> {
  if (!API_BASE) throw new Error("API base not configured");
  return safeFetch<string[]>(`${API_BASE.replace(/\/$/,"")}/countries/${encodeURIComponent(country)}/departments`);
}

export async function getCities(department: string): Promise<string[]> {
  if (!API_BASE) throw new Error("API base not configured");
  return safeFetch<string[]>(`${API_BASE.replace(/\/$/,"")}/departments/${encodeURIComponent(department)}/cities`);
}

// Fallback helpers for when backend isn't available
export const FALLBACK = {
  countries: ["colombia", "peru"],
  departamentsByCountry: {
    colombia: ["choco", "atlantico", "cordoba"],
    peru: ["cusco", "lima", "ucayali"],
  } as Record<string, string[]>,
  citiesByDepartament: {
    choco: ["quibdo", "istmina", "condoto"],
    atlantico: ["barranquilla", "soledad", "sabanalarga"],
    cordoba: ["monteria", "lorica", "sahagun"],
    cusco: ["cusco", "pisac", "ollantaytambo"],
    lima: ["lima", "miraflores", "barranco"],
    ucayali: ["pucallpa", "atalaya", "purus"],
  } as Record<string, string[]>,
};

export default {
  getCountries,
  getDepartments,
  getCities,
  FALLBACK,
};
