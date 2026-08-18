import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormErrorComponent, InputComponent } from '@sistema-inscripciones-frontend/shared';
// Importa tus componentes compartidos de input y error si aplican en tu librería:
// import { InputComponent } from '@sistema-inscripciones-frontend/shared';

@Component({
  selector: 'app-modificar-email-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, InputComponent, FormErrorComponent, MatInputModule],
  templateUrl: './modificar-email-dialog.component.html',
  styleUrls: ['./modificar-email-dialog.component.scss'],
})
export class ModificarEmailDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ModificarEmailDialogComponent>);
  private data = inject<{ correoActual: string }>(MAT_DIALOG_DATA);

  form: FormGroup = this.fb.group({
    nuevoCorreo: [this.data.correoActual || '', [Validators.required, Validators.email]],
  });

  cerrar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.nuevoCorreo);
    }
  }
}
