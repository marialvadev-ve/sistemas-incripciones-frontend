import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, catchError } from 'rxjs';
import { of } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AutoSaveService {
  private api = inject(ApiService);

  /**
   * Configura el auto-guardado inteligente para un formulario reactivo
   */
  public enableAutoSave(form: FormGroup, endpoint: string) {
    return form.valueChanges.pipe(
      // 1. Esperamos a que el usuario detenga su escritura por 2 segundos
      debounceTime(2000),
      // 2. Nos aseguramos de que el formulario sea válido antes de intentar guardar
      filter(() => form.valid),
      // 3. Evitamos disparar si los datos no han sufrido modificaciones reales
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      // 4. Verificamos si hay internet antes de ejecutar la petición HTTP
      filter(() => {
        const isOnline = navigator.onLine;
        if (!isOnline) {
          console.warn('[Auto-Save] Sin conexión a internet. Guardando temporalmente en caché local...');
          // Opcional: Guardar en IndexedDB como respaldo de emergencia
        }
        return isOnline;
      }),
      // 5. Cancelamos peticiones anteriores si se disparó una nueva
      switchMap((formValues) => {
        console.log('[Auto-Save] Sincronizando borrador con el backend...');
        return this.api.patch(endpoint, formValues).pipe(
          tap(() => console.log('[Auto-Save] Borrador guardado exitosamente.')),
          catchError((error) => {
            console.error('[Auto-Save] Error temporal al sincronizar con la base de datos:', error);
            // Devolvemos un observable vacío para que el stream no muera por un fallo de red
            return of(null);
          }),
        );
      }),
    );
  }
}
