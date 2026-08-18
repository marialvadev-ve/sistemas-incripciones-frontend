import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'lib-establecer-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './establecer-password.component.html',
  styleUrls: ['./establecer-password.component.scss'],
})
export class EstablecerPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  token = '';
  isSubmitting = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  hideNueva = signal<boolean>(true);
  hideConfirmar = signal<boolean>(true);

  // Señales para el checklist de requisitos en tiempo real
  hasLength = signal<boolean>(false);
  hasLower = signal<boolean>(false);
  hasUpper = signal<boolean>(false);
  hasNum = signal<boolean>(false);
  hasSpecial = signal<boolean>(false);

  // Expresión regular robusta de validación
  private readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,64}$/;

  form: FormGroup = this.fb.group(
    {
      nuevaPassword: ['', [Validators.required, Validators.maxLength(8), Validators.pattern(this.passwordRegex)]],
      confirmarPassword: ['', [Validators.required, Validators.maxLength(8)]],
    },
    { validators: this.passwordMatchValidator },
  );

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.errorMessage.set('El enlace de invitación no es válido o está incompleto.');
    }

    // Escuchar los cambios en tiempo real para actualizar el checklist visual
    this.form.get('nuevaPassword')?.valueChanges.subscribe((value) => {
      const val = value || '';
      this.hasLength.set(val.length >= 8);
      this.hasLower.set(/[a-z]/.test(val));
      this.hasUpper.set(/[A-Z]/.test(val));
      this.hasNum.set(/\d/.test(val));
      this.hasSpecial.set(/[@$!%*?&._-]/.test(val));
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('nuevaPassword');
    const confirmPassword = control.get('confirmarPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      token: this.token,
      nuevaPassword: this.form.value.nuevaPassword,
    };

    this.http.post('/auth/resetear-password', payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 404) {
          this.errorMessage.set('Este enlace no es válido.');
        } else if (err.status === 410) {
          this.errorMessage.set('Este enlace ya fue usado o expiró.');
        } else {
          this.errorMessage.set(err.error?.message || 'Ocurrió un error al establecer la contraseña.');
        }
      },
    });
  }
}
