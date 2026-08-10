import { Component, input, computed, inject, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { merge } from 'rxjs';
import { FORM_VALIDATION_MESSAGES } from '../../tokens/validation-messages.token';

@Component({
  selector: 'lib-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error.component.html', //[cite: 1]
  styleUrl: './form-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent {
  readonly control = input<AbstractControl | null>(null);
  private readonly customMessages = inject(FORM_VALIDATION_MESSAGES);

  // Señal interna que se incrementa cada vez que el control emite un cambio de valor o estado
  private readonly trigger = signal(0);

  constructor() {
    // Effect que se suscribe automáticamente al control actual y limpia la suscripción si el control cambia
    effect((onCleanup) => {
      const ctrl = this.control();
      if (!ctrl) return;

      const sub = merge(ctrl.valueChanges, ctrl.statusChanges).subscribe(() => {
        this.trigger.update((v) => v + 1); // Forzamos la actualización reactiva
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  // Señal computada infalible que evalúa los errores en tiempo real
  protected readonly errorMessage = computed(() => {
    // Leemos el trigger para registrar la dependencia reactiva
    this.trigger();

    const ctrl = this.control();
    if (!ctrl || !ctrl.errors) {
      return null;
    }

    const hasValue = ctrl.value !== null && ctrl.value !== undefined && ctrl.value !== '';

    // Si el control está intacto (pristine), no ha sido tocado y está completamente vacío, no mostramos error
    if (!ctrl.touched && ctrl.pristine && !hasValue) {
      return null;
    }

    const errorKeys = Object.keys(ctrl.errors);
    if (errorKeys.length === 0) return null;

    const firstErrorKey = errorKeys[0];
    const errorFn = this.customMessages[firstErrorKey];

    if (errorFn) {
      return errorFn(ctrl.errors[firstErrorKey] as Record<string, unknown>);
    }

    return 'Campo inválido.';
  });
}
