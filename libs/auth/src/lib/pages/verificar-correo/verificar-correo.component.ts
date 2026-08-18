import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

type VerificationState = 'loading' | 'success' | 'error-404' | 'error-410' | 'error-generic';

@Component({
  selector: 'lib-verificar-correo',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './verificar-correo.component.html',
  styleUrls: ['./verificar-correo.component.scss'],
})
export class VerificarCorreoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  state = signal<VerificationState>('loading');
  errorMessage = signal<string>('');
  token = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.state.set('error-404');
      this.errorMessage.set('Este enlace no es válido.');
      return;
    }

    this.verificarToken();
  }

  verificarToken(): void {
    this.state.set('loading');

    this.http.get(`/auth/verificar/${this.token}`).subscribe({
      next: () => {
        this.state.set('success');
      },
      error: (err) => {
        if (err.status === 404) {
          this.state.set('error-404');
          this.errorMessage.set('Este enlace no es válido.');
        } else if (err.status === 410) {
          this.state.set('error-410');
          this.errorMessage.set('Este enlace ya fue usado o expiró.');
        } else {
          this.state.set('error-generic');
          this.errorMessage.set(err.error?.message || 'Ocurrió un error al verificar tu correo.');
        }
      },
    });
  }

  reenviarCorreo(): void {
    // Lógica para reenvío de correo pendiente
    console.log('Reenviando correo de verificación...');
  }
}
