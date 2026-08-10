import { ApiResponse } from '@sistema-inscripciones-frontend/shared';

export interface AuthDataResponse {
  access_token: string;
  refresh_token: string;
  usuario: {
    id: string;
    email: string;
    roles: string[];
    universidadesIds: string[];
  };
}

// La respuesta completa del endpoint de login tipada con el envoltorio estándar
export type AuthApiResponse = ApiResponse<AuthDataResponse>;
