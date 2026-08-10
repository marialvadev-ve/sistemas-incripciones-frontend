import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  /**
   * Muestra una notificación de error institucional
   */
  public error(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      panelClass: ['snackbar-error'],
    });
  }

  /**
   * Muestra una notificación de éxito o confirmación
   */
  public success(message: string): void {
    this.snackBar.open(message, 'OK', {
      ...this.defaultConfig,
      panelClass: ['snackbar-success'],
    });
  }

  /**
   * Muestra una notificación informativa
   */
  public info(message: string): void {
    this.snackBar.open(message, 'Entendido', {
      ...this.defaultConfig,
      panelClass: ['snackbar-info'],
    });
  }
}
