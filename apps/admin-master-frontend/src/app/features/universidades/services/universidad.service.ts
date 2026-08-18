import { inject, Injectable } from '@angular/core';
import {
  ApiResponse,
  ApiService,
  handleApiError,
  handleApiResponse,
  Universidad,
  Usuario,
} from '@sistema-inscripciones-frontend/shared';
import { map, Observable } from 'rxjs';
import { OnboardingUniversidad } from '../models/onboarding-universidad';

export interface ResponseUniversidad {
  universidad: Universidad;
  administrador: Usuario;
}

export interface ResponseUniversidadUpdate {
  id: string;
  nombre: string;
  siglas: string;
  rif: string;
  ubicacion: string;
  telefono: string;
  correo: string;
  activo: boolean;
  administrador: Usuario;
}

@Injectable({
  providedIn: 'root',
})
export class UniversidadService {
  private api = inject(ApiService);

  public getListUniversidades(): Observable<OnboardingUniversidad[]> {
    return this.api.get<OnboardingUniversidad[]>('universidades/universidadesAdmin').pipe(
      map((result) => {
        if (!result.isSuccess) {
          throw new Error(result.message || 'Error de validación en el servidor');
        }
        return result.data ?? [];
      }),
    );
  }

  public createUniversity(data: OnboardingUniversidad): Observable<ResponseUniversidad> {
    const { id, ...dataUniversidad } = data;
    return this.api
      .post<ApiResponse<ResponseUniversidad>>('universidades/onboarding', dataUniversidad)
      .pipe(handleApiResponse<ResponseUniversidad>(), handleApiError<ResponseUniversidad>());
  }

  public updateUniversity(id: string, data: Partial<Universidad>): Observable<ResponseUniversidadUpdate> {
    return this.api
      .patch<ApiResponse<ResponseUniversidadUpdate>>(`universidades/${id}`, data)
      .pipe(handleApiResponse<ResponseUniversidadUpdate>(), handleApiError<ResponseUniversidadUpdate>());
  }

  /**
   * (Próximamente) Elimina lógicamente o físicamente una universidad
   */
  public deleteUniversity(id: string): Observable<void> {
    return this.api
      .delete<ApiResponse<OnboardingUniversidad>>(`universidades/${id}`)
      .pipe(handleApiResponse<void>(), handleApiError<void>());
  }
}
