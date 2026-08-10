import { Route } from '@angular/router';
import { NotFoundComponent } from '@sistema-inscripciones-frontend/shared';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('@sistema-inscripciones-frontend/auth').then((m) => m.authRoutes),
  },
  {
    path: 'expediente',
    loadChildren: () => import('@sistema-inscripciones-frontend/expediente').then((m) => m.expedienteRoutes),
  },
  {
    path: 'backoffice',
    loadChildren: () => import('@sistema-inscripciones-frontend/backoffice').then((m) => m.backofficeRoutes),
  },
  {
    path: '**',
    component: NotFoundComponent, // O redirigir a una ruta de error 404 personalizada
  },
];
