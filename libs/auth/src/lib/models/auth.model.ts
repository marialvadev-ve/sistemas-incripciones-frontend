import { ApiResponse } from '@sistema-inscripciones-frontend/shared';

export interface LoginResponseData {
  access_token: string;
  usuario: {
    id: string;
    email: string;
    roles: string[];
  };
}

// La respuesta completa del endpoint de login vendrá tipada así:
export type AuthApiResponse = ApiResponse<LoginResponseData>;
