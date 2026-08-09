import { Route } from '@angular/router';

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
];
