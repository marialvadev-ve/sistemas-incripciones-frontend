import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../models/api/api-response.interface';

export function formatApiError(error: unknown): string {
  if (error instanceof HttpErrorResponse && error.error) {
    const apiError = error.error as ApiErrorResponse; // Ya podemos usar nuestra interfaz tipada
    const msg = apiError.message;
    const detalles = apiError.errors?.detalle;

    const mensajesAProcesar: string[] = [];

    // 1. Si 'message' es un texto válido diferente de vacío, lo agregamos
    if (typeof msg === 'string' && msg.trim() !== '') {
      mensajesAProcesar.push(msg);
    }
    // Si por compatibilidad 'message' llega como un arreglo clásico de NestJS
    else if (Array.isArray(msg)) {
      mensajesAProcesar.push(...msg);
    }

    // 2. Si 'errors.detalle' es un arreglo con elementos, los sumamos a la lista
    if (Array.isArray(detalles) && detalles.length > 0) {
      mensajesAProcesar.push(...detalles);
    }

    // Si recolectamos mensajes, los formateamos en forma de lista vertical
    if (mensajesAProcesar.length > 0) {
      // Si solo hay un mensaje, lo devolvemos tal cual sin viñeta innecesaria
      if (mensajesAProcesar.length === 1) {
        return mensajesAProcesar[0];
      }
      // Si hay varios, los convertimos en una lista ordenada con viñetas
      return mensajesAProcesar.map((m) => `• ${m}`).join('\n');
    }

    // Fallback si hay un campo 'error' general en la respuesta
    if (apiError.error) {
      return `${apiError.error}: Ocurrió un error en la solicitud.`;
    }
  }

  // Fallback genérico para errores de red u otros
  return 'Error de conexión o de validación en el servidor';
}
