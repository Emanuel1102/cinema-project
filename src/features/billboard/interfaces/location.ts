export type CountryCode = string;
export type DepartamentCode = string;
export type CityCode = string;

export interface SelectedLocation {
  country: CountryCode;
  departament: DepartamentCode;
  city: CityCode;
}
