import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'universidades',
    loadComponent: () =>
      import('./features/universidades/pages/gestion-universidades/gestion-universidades.component').then(
        (m) => m.GestionUniversidadesComponent,
      ),
    children: [
      {
        path: 'crear',
        // Aquí se activa el formulario en modo creación a la izquierda
        loadComponent: () =>
          import('./features/universidades/pages/crear-universidades/crear-universidad.component').then(
            (m) => m.CrearUniversidadComponent,
          ),
      },
      {
        path: 'editar/:id',
        // Aquí se activa el formulario en modo edición (cargando los datos de la ID) a la izquierda
        loadComponent: () =>
          import('./features/universidades/pages/crear-universidades/crear-universidad.component').then(
            (m) => m.CrearUniversidadComponent,
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'universidades',
    pathMatch: 'full',
  },
];
