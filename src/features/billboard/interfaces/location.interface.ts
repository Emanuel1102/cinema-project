// Define cómo se ve un País
export interface Country {
  id: string;
  name: string;
}

// Define cómo se ve un Departamento
export interface Department {
  id: string;
  name: string;
  countryId: string;
}

// Define cómo se ve una Ciudad
export interface City {
  id: string;
  name: string;
  departmentId: string;
  isActive: boolean;
}

// Define cómo se guarda la preferencia del usuario en el navegador
export interface UserLocationPreference {
  countryId: string;
  departmentId: string;
  cityId: string;
  cityName: string;
}