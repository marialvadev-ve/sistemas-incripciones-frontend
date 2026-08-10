export interface Usuario {
  id: string;
  personaId?: string | null;
  email: string;
  activo: boolean;
  emailVerificado: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
