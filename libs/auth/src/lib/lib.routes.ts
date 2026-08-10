import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RecoverPassword } from './pages/recover-password/recover-password';

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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
