import { InjectionToken } from '@angular/core';

export type ErrorMessageFn = (params: Record<string, unknown>) => string;
export type ValidationMessageRegistry = Record<string, ErrorMessageFn>;

export const DEFAULT_VALIDATION_MESSAGES: ValidationMessageRegistry = {
  required: () => 'Este campo es obligatorio.',
  email: () => 'Ingresa un formato de correo electrónico válido.',
  minlength: (params) => `Debe tener al menos ${String(params['requiredLength'])} caracteres.`,
  maxlength: (params) => `No puede exceder los ${String(params['requiredLength'])} caracteres.`,
  min: (params) => `El valor mínimo permitido es ${String(params['min'])}.`,
  max: (params) => `El valor máximo permitido es ${String(params['max'])}.`,
  pattern: () => 'El formato ingresado no es válido.',
};

export const FORM_VALIDATION_MESSAGES = new InjectionToken<ValidationMessageRegistry>('FormValidationMessages', {
  providedIn: 'root',
  factory: () => DEFAULT_VALIDATION_MESSAGES,
});
