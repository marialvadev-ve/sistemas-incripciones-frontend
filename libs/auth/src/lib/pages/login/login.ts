import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../store/auth.store';
import {
  ButtonComponent,
  FormErrorComponent,
  InputComponent,
  NotificationService,
} from '@sistema-inscripciones-frontend/shared';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    InputComponent,
    ButtonComponent,
    FormErrorComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private notification = inject(NotificationService); // 👈 Inyección del servicio global

  private readonly authStore = inject(AuthStore);
  protected readonly isLoading = this.authStore.isLoading;

  private readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  loginForm: FormGroup = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.emailPattern), // 👈 Reemplazamos Validators.email por Validators.pattern estricto
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    // Efecto reactivo limpio que invoca al servicio global de notificaciones
    effect(() => {
      const errorMessage = this.authStore.error();
      if (errorMessage) {
        this.notification.error(errorMessage);
        this.authStore.clearError();
      }
    });
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authStore.login(this.loginForm.value);
  }
}
