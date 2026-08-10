import { signalStore, withState, withMethods, patchState } from '@ngrx/signals'; // o tu implementación actual de signals store
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '@sistema-inscripciones-frontend/shared';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      router = inject(Router),
      notification = inject(NotificationService),
    ) => ({
      async login(credentials: { email: string; password: string }) {
        patchState(store, { isLoading: true, error: null });

        authService.login(credentials).subscribe({
          next: (response) => {
            patchState(store, { isLoading: false, isAuthenticated: true });

            // Disparamos la notificación de éxito global que configuramos
            notification.success('¡Bienvenido al Portal Académico!');

            // Redirigimos al dashboard o panel principal
            router.navigate(['/dashboard']);
          },
          error: (err) => {
            const errorMsg = err.error?.message || 'Credenciales inválidas o error de conexión.';
            patchState(store, { isLoading: false, error: errorMsg });

            // Disparamos la notificación de error global
            notification.error(errorMsg);
          },
        });
      },

      clearError() {
        patchState(store, { error: null });
      },
    }),
  ),
);
