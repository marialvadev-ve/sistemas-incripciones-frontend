import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { TenantService } from '@sistema-inscripciones-frontend/shared';

// Función de fábrica que Angular ejecutará al arrancar
export function initializeTenant(tenantService: TenantService) {
  return () => tenantService.loadTenantConfiguration();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),

    // Inyectamos el inicializador Multi-Tenant
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTenant,
      deps: [TenantService],
      multi: true,
    },
  ],
};
