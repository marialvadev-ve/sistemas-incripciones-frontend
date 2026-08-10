export interface UserProfile {
  id: string | number;
  email: string;
  nombre: string;
  rol?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  universidadId?: string;
}
