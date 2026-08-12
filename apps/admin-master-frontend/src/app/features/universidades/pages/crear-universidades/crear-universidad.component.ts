import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-universidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-universidad.component.html',
  styleUrls: ['./crear-universidad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearUniversidadComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    siglas: ['', Validators.required],
    ubicacion: [''],
    telefono: [''],
    correoInstitucional: ['', [Validators.email]],
  });

  // Método para cerrar el formulario y regresar a la vista general de universidades
  cerrarFormulario(): void {
    this.router.navigate(['/universidades']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Datos de universidad:', this.form.value);
      this.cerrarFormulario();
    }
  }
}
