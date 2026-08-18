import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ResponseUniversidad, ResponseUniversidadUpdate, UniversidadService } from './universidad.service';
import { OnboardingUniversidad } from '../models/onboarding-universidad';
import { Universidad } from '@sistema-inscripciones-frontend/shared';

@Injectable({
  providedIn: 'root',
})
export class UniversidadStateService {
  private universidadService = inject(UniversidadService);

  // 1. Signal privada mutable que almacena el listado en memoria
  private _universidades = signal<OnboardingUniversidad[]>([]);

  // 2. Signal pública de solo lectura para que los componentes la consuman de forma segura
  public readonly universidades = this._universidades.asReadonly();

  /**
   * Carga inicial de la lista de universidades desde el backend
   */
  public cargarUniversidades(): void {
    this.universidadService.getListUniversidades().subscribe({
      next: (data) => {
        const dataList = data.map((item) => {
          item.isDirty = 'UNCHANGED';
          return item;
        });
        return this._universidades.set(dataList);
      },
      error: (err) => console.error('Error al cargar universidades:', err),
    });
  }

  /**
   * Busca una universidad por su ID directamente en la Signal en memoria.
   * Muy útil para el modo edición al navegar directamente sin llamadas innecesarias al backend.
   */
  public getUniversidadById(id: string): OnboardingUniversidad | undefined {
    const data = this._universidades().find((u) => u.id === id);
    if (!data) {
      return undefined;
    }
    return {
      ...data,
      isDirty: 'UNCHANGED',
    };
  }

  /**
   * Crea una universidad mediante el servicio HTTP e inyecta el resultado al inicio de la Signal
   */
  public crearUniversidad(data: OnboardingUniversidad): Observable<ResponseUniversidad> {
    return this.universidadService.createUniversity(data).pipe(
      tap((nuevaUniversidad: ResponseUniversidad) => {
        const universidad: OnboardingUniversidad = {
          id: nuevaUniversidad.universidad.id,
          nombre: nuevaUniversidad.universidad.nombre,
          siglas: nuevaUniversidad.universidad.siglas,
          rif: nuevaUniversidad.universidad.rif,
          ubicacion: nuevaUniversidad.universidad.ubicacion ?? '',
          telefono: nuevaUniversidad.universidad.telefono ?? '',
          correoInstitucional: nuevaUniversidad.universidad.correo ?? '',
          adminEmail: nuevaUniversidad.administrador.email,
          isDirty: 'UNCHANGED',
        };
        this._universidades.update((listaActual) => [universidad, ...listaActual]);
      }),
    );
  }

  /**
   * Actualiza una universidad existente y reemplaza el registro afectado en la Signal en memoria
   */
  public actualizarUniversidad(
    universidadId: string,
    data: Partial<Universidad>,
  ): Observable<ResponseUniversidadUpdate> {
    const { id, ...dataSave } = data;
    return this.universidadService.updateUniversity(universidadId, dataSave).pipe(
      tap((universidadActualizada: ResponseUniversidadUpdate) => {
        const { administrador, correo, ...uni } = universidadActualizada;
        const universidadSincronizada: OnboardingUniversidad = {
          ...uni,
          correoInstitucional: correo,
          adminEmail: administrador.email,
          isDirty: 'UNCHANGED',
        };

        this._universidades.update((listaActual) =>
          listaActual.map((u) => (u.id === id ? universidadSincronizada : u)),
        );
      }),
    );
  }

  public eliminarUniversidad(id: string): Observable<void> {
    return this.universidadService.deleteUniversity(id).pipe(
      tap(() => {
        // Filtramos la lista actual excluyendo el ID que se acaba de eliminar
        this._universidades.update((listaActual) => listaActual.filter((u) => u.id !== id));
      }),
    );
  }
}
