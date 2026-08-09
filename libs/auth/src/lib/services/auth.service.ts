import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '@sistema-inscripciones-frontend/shared';
import { ApiResponse } from '@sistema-inscripciones-frontend/shared';

export interface LoginCredentials {
  email: string;
  password: string;
  universidadId?: string;
}

export interface AuthDataResponse {
  access_token: string;
  refresh_token: string; // <-- Añadimos el token de refresco
  usuario: {
    id: string;
    email: string;
    roles: string[];
    universidadesIds: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);

  public login(credentials: LoginCredentials): Observable<ApiResponse<AuthDataResponse>> {
    return this.api.post<AuthDataResponse, LoginCredentials>('auth/login', credentials).pipe(
      tap((response) => {
        if (response.statusCode === 200 && response.data) {
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token); // Guardamos el refresh token

          if (credentials.universidadId) {
            localStorage.setItem('active_universidad_id', credentials.universidadId);
          } else if (response.data.usuario.universidadesIds?.length === 1) {
            localStorage.setItem('active_universidad_id', response.data.usuario.universidadesIds[0]);
          }
        }
      }),
    );
  }

  /**
   * Pide un nuevo Access Token utilizando el Refresh Token almacenado
   */
  public refreshToken(): Observable<ApiResponse<{ access_token: string }>> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.api
      .post<{ access_token: string }, { refresh_token: string | null }>('auth/refresh', {
        refresh_token: refreshToken,
      })
      .pipe(
        tap((response) => {
          if (response.statusCode === 200 && response.data) {
            localStorage.setItem('access_token', response.data.access_token);
          }
        }),
      );
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('active_universidad_id');
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public getActiveUniversidadId(): string | null {
    return localStorage.getItem('active_universidad_id');
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
