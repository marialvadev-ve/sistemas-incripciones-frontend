import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Si no está autenticado, redirigimos al login institucional
    this.router.navigate(['/auth/login']);
    return false;
  }
}
