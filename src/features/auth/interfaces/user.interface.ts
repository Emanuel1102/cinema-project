export type MembershipLevel = 'BRONCE' | 'PLATA' | 'ORO' | 'DIAMANTE';

export interface UserBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  documentNumber: string;
  membershipLevel: MembershipLevel;
  membershipCode: string;
  points: number;
  nextLevelPoints: number;
}