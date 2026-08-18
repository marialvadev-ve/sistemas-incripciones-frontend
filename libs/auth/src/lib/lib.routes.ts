import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RecoverPassword } from './pages/recover-password/recover-password';
import { VerificarCorreoComponent } from './pages/verificar-correo/verificar-correo.component';
import { EstablecerPasswordComponent } from './pages/establecer-password/establecer-password.component';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'recover-password',
    component: RecoverPassword,
  },
  {
    path: 'verificar-correo',
    component: VerificarCorreoComponent,
  },
  {
    path: 'establecer-password',
    component: EstablecerPasswordComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
