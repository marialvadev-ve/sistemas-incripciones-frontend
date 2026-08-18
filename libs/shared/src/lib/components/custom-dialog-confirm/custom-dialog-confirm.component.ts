import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogData } from '../../models/custom/custom-dialog-confirm.model';
@Component({
  selector: 'lib-custom-dialog-confirm',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './custom-dialog-confirm.component.html',
  styleUrls: ['./custom-dialog-confirm.component.scss'],
})
export class CustomDialogConfirmComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CustomDialogConfirmComponent>);

  /**
   * Retorna el nombre del Material Icon según el tipo configurado
   */
  getIconName(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warning_amber';
      case 'danger':
        return 'error_outline';
      case 'confirmation':
      default:
        return 'help_outline';
    }
  }

  /**
   * Retorna la clase CSS de color para el icono
   */
  getIconClass(): string {
    switch (this.data.type) {
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-danger';
      case 'confirmation':
      default:
        return 'text-primary';
    }
  }
}
