/* eslint-disable @typescript-eslint/no-explicit-any */
import { map, catchError, throwError, OperatorFunction } from 'rxjs';
import { formatApiError } from '../utils/error-handler.util';
import { ApiResponse } from '../models/api/api-response.interface';

/**
 * Operador para procesar respuestas exitosas de la API y extraer la data.
 */
export function handleApiResponse<T>(): OperatorFunction<any, T> {
  return map((result: any) => {
    if (result && typeof result === 'object' && 'isSuccess' in result) {
      const res = result as ApiResponse<T>;
      if (!res.isSuccess) {
        throw new Error(res.message || 'Error en la operación');
      }
      return (res.data as T) ?? ({} as T);
    }
    return result as T;
  });
}

/**
 * Operador para interceptar errores HTTP y mantener el tipo T en el pipe.
 */
export function handleApiError<T>(): OperatorFunction<T, T> {
  return catchError((error: unknown) => {
    const errorMessage = formatApiError(error);
    return throwError(() => new Error(errorMessage));
  });
}
