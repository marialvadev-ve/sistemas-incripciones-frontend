import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent, InputComponent } from '@sistema-inscripciones-frontend/shared';

@Component({
  selector: 'lib-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule, InputComponent, ButtonComponent],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoverPassword {
  private fb = inject(FormBuilder);

  isLoading = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);

  recoverForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public onSubmit(): void {
    if (this.recoverForm.invalid) {
      this.recoverForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    // Simulación de envío de enlace de recuperación al backend
    setTimeout(() => {
      this.isLoading.set(false);
      this.isSubmitted.set(true);
    }, 1500);
  }
}
