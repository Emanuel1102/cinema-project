import { useCallback, useSyncExternalStore } from "react";
import { cities, countries, departments, type City } from "./data";

export type StoredLocation = {
  countryId: string;
  departmentId: string;
  cityId: string;
};

export type Reservation = {
  id: string;
  movieId: string;
  movieTitle: string;
  date: string;
  time: string;
  format: string;
  complex: string;
  seats: number;
  seatCodes?: string[];
  total: number;
};

export type User = { name: string; email: string };

const LOCATION_KEY = "riwi:location";
const USER_KEY = "riwi:user";
const RESERVATIONS_KEY = "riwi:reservations";

/**
 * Tiny shared store backed by Local Storage so every component
 * (header, cartelera, detalle) sees the same value.
 */
function createPersistedStore<T>(key: string, fallback: T) {
  let value: T = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load(): T {
    if (loaded || typeof window === "undefined") return value;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) value = JSON.parse(raw) as T;
    } catch {
      /* ignore corrupted storage */
    }
    loaded = true;
    return value;
  }

  function set(next: T) {
    value = next;
    loaded = true;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(next));
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  return { load, set, subscribe, get: () => value };
}

const locationStore = createPersistedStore<StoredLocation | null>(LOCATION_KEY, null);
const userStore = createPersistedStore<User | null>(USER_KEY, null);
const reservationsStore = createPersistedStore<Reservation[]>(RESERVATIONS_KEY, []);

function usePersisted<T>(store: ReturnType<typeof createPersistedStore<T>>) {
  const value = useSyncExternalStore(store.subscribe, store.load, store.get);
  return { value, ready: true };
}

export function useHydrated() {
  return typeof window !== "undefined";
}

/** Simula la consulta asíncrona de catálogos (país → departamento → ciudad). */
function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const locationApi = {
  getCountries: () => delay(countries),
  getDepartments: (countryId: string) =>
    delay(departments.filter((d) => d.countryId === countryId)),
  getCities: (departmentId: string) =>
    delay(cities.filter((c) => c.departmentId === departmentId)),
};

export function useLocation() {
  const { value: location, ready } = usePersisted(locationStore);

  const save = useCallback((next: StoredLocation) => locationStore.set(next), []);
  const clear = useCallback(() => locationStore.set(null), []);

  const city: City | null = location
    ? (cities.find((c) => c.id === location.cityId) ?? null)
    : null;

  return { location, city, save, clear, ready };
}

export function useAuth() {
  const { value: user } = usePersisted(userStore);

  const login = useCallback((email: string, name?: string) => {
    const next: User = { email, name: name || email.split("@")[0]! };
    userStore.set(next);
    return next;
  }, []);

  const logout = useCallback(() => userStore.set(null), []);

  return { user, login, logout };
}

export function useReservations() {
  const { value: reservations } = usePersisted(reservationsStore);

  const add = useCallback((reservation: Omit<Reservation, "id">) => {
    reservationsStore.set([
      { ...reservation, id: Math.random().toString(36).slice(2, 10) },
      ...reservationsStore.load(),
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    reservationsStore.set(reservationsStore.load().filter((r) => r.id !== id));
  }, []);

  return { reservations, add, remove };
}
