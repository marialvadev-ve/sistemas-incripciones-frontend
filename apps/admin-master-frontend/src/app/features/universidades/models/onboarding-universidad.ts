import { EntityState, Identifiable } from '@sistema-inscripciones-frontend/shared';

export interface OnboardingUniversidad extends Identifiable {
  id: string;
  nombre: string;
  siglas: string;
  rif: string;
  ubicacion?: string;
  telefono?: string;
  correoInstitucional?: string;
  adminEmail: string;
  isDirty: EntityState;
}
