import { Injectable, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subject, timer, Subscription } from 'rxjs'; // <-- Importamos Subscription
import { takeUntil, auditTime } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  private router = inject(Router);
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);

  private destroy$ = new Subject<void>();
  private readonly idleTimeMinutes = 10;

  // Tipado estricto sin 'any' para satisfacer el linter corporativo
  private timerSubscription?: Subscription;

  public startWatching(): void {
    this.ngZone.runOutsideAngular(() => {
      const userActivity$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'click'),
        fromEvent(window, 'scroll'),
      ).pipe(auditTime(2000), takeUntil(this.destroy$));

      userActivity$.subscribe(() => {
        this.resetTimer();
      });
    });

    this.resetTimer();
  }

  private resetTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.ngZone.runOutsideAngular(() => {
      this.timerSubscription = timer(this.idleTimeMinutes * 60 * 1000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.ngZone.run(() => {
            console.warn('[Seguridad] Sesión cerrada automáticamente por inactividad en equipo de terceros.');
            this.authService.logout();
            this.router.navigate(['/auth'], { queryParams: { expired: 'true' } });
          });
        });
    });
  }

  public stopWatching(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
