import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, filter, take, throwError, timer, retry } from 'rxjs';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Variables de estado compartidas en el ámbito del módulo del interceptor
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = localStorage.getItem('access_token');
  const activeUniversidadId = localStorage.getItem('active_universidad_id');

  const headersToModify: Record<string, string> = {};

  if (token) {
    headersToModify['Authorization'] = `Bearer ${token}`;
  }

  if (activeUniversidadId) {
    headersToModify['X-Universidad-Id'] = activeUniversidadId;
  }

  const clonedRequest = req.clone({
    setHeaders: headersToModify,
  });

  return next(clonedRequest).pipe(
    // 1. Tolerancia a fallos por saturación momentánea de la BD o infraestructura (Backoff progresivo)
    retry({
      count: 3,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        if (error.status === 503 || error.status === 504 || error.status === 0) {
          const delayTime = retryCount * 1500; // 1.5s, 3s, 4.5s
          console.warn(
            `[Sistema Multi-Tenant] Servidor ocupado. Reintento automático #${retryCount} en ${delayTime}ms...`,
          );
          return timer(delayTime);
        }
        return throwError(() => error);
      },
    }),

    // 2. Control de errores y gestión de Sesión Expirada (401)
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Evitamos bucles infinitos si la petición que falló fue la de login o el propio refresh
        if (req.url.includes('auth/refresh') || req.url.includes('auth/login')) {
          authService.logout();
          router.navigate(['/auth']);
          return throwError(() => error);
        }

        return handle401Error(clonedRequest, next, authService, router, error);
      }

      return throwError(() => error);
    }),
  );
};

/**
 * Función encargada de gestionar la renovación silenciosa y encolar peticiones concurrentes
 */
function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
  error: HttpErrorResponse,
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        const newAccessToken = response.data.access_token;

        // Liberamos la cola notificando a las demás peticiones en espera
        refreshTokenSubject.next(newAccessToken);

        // Reintentamos la petición original que disparó el 401
        return next(
          request.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` },
          }),
        );
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        // Si el refresh token también expiró o es inválido, cerramos sesión de forma segura
        console.error('[Seguridad] El Refresh Token ha expirado. Cerrando sesión.');
        authService.logout();
        router.navigate(['/auth']);
        return throwError(() => refreshError);
      }),
    );
  } else {
    // Si ya hay un proceso de refresh en curso, pausamos esta petición en la cola hasta que haya un token nuevo
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        return next(
          request.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          }),
        );
      }),
    );
  }
}
