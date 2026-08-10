export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  documentNumber: string;
  membershipLevel: 'BRONCE' | 'PLATA' | 'ORO';
  membershipCode: string; // Para el código QR de membresía
  points: number;
}