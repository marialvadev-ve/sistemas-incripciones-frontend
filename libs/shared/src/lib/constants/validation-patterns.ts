import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rifVenezolanoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rif = control.value;
    if (!rif) {
      return null; // Si está vacío, dejamos que actúe el Validators.required si lo tiene
    }

    // 1. Validar formato básico con Regex (Ej: J-12345678-9, V-12345678-9, etc.)
    const formatoRegex = /^[VEJPGvejpg]-\d{8}-\d{1}$/;
    if (!formatoRegex.test(rif)) {
      return { rifFormatoInvalido: { rif } };
    }

    // 2. Extraer partes del RIF y tipar el diccionario de manera segura
    const [tipo, n, d] = rif.split('-');
    const valoresTipo: Record<string, number> = { V: 1, E: 2, J: 3, P: 4, G: 5 };
    const valorTipo = valoresTipo[tipo.toUpperCase()];

    if (valorTipo === undefined || !n || !d) {
      return { rifInvalido: { rif } };
    }

    // 3. Algoritmo de cálculo del dígito verificador
    const pesos = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    const cadenaSuma = valorTipo + n.padStart(8, '0');

    let suma = 0;
    for (let i = 0; i < pesos.length; i++) {
      suma += parseInt(cadenaSuma[i], 10) * pesos[i];
    }

    const digitoCalculado = (11 - (suma % 11)) % 11;

    // 4. Comparar el dígito calculado con el dígito ingresado
    if (digitoCalculado !== parseInt(d, 10)) {
      return { rifDigitoVerificador: { rif } }; // Error específico de dígito verificador
    }

    return null; // ¡RIF válido!
  };
}

/**
 * Validador personalizado para el teléfono venezolano (Móviles y Fijos)
 */
export function telefonoVenezolanoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const telefono = control.value;
    if (!telefono) {
      return null; // Si está vacío, dejamos que actúe el Validators.required si lo tiene
    }

    // 1. Limpiamos espacios, guiones o paréntesis para validar solo los dígitos
    const telefonoLimpiio = String(telefono).replace(/[\s\-()]/g, '');

    // 2. Expresión regular para Venezuela:
    // - Debe empezar por 0
    // - Código de área fijo (02xx -> 3 dígitos) o móvil (0412, 0414, 0424, 0416, 0426 -> 4 dígitos)
    // - Seguido de exactamente 7 dígitos
    const telefonoRegex = /^0(2\d{2}|412|414|424|416|426)\d{7}$/;

    if (!telefonoRegex.test(telefonoLimpiio)) {
      return { telefonoFormatoInvalido: { telefono } };
    }

    return null; // ¡Teléfono válido!
  };
}

export function cedulaVenezolanaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cedula = control.value;
    if (!cedula) {
      return null; // Si está vacío, actúa el Validators.required si lo tiene
    }

    // Acepta V-1234567, V-12345678, E-12345678 (con o sin guion)
    const formatoRegex = /^[VEve]-?\d{6,8}$/;
    if (!formatoRegex.test(cedula)) {
      return { cedulaFormatoInvalido: { cedula } };
    }

    return null; // ¡Cédula válida!
  };
}

export function pasaporteValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pasaporte = control.value;
    if (!pasaporte) {
      return null; // Si está vacío, actúa el Validators.required si lo tiene
    }

    // Formato estándar: 1 letra al inicio y de 7 a 8 números
    const formatoRegex = /^[A-Za-z]\d{7,8}$/;
    if (!formatoRegex.test(pasaporte)) {
      return { pasaporteFormatoInvalido: { pasaporte } };
    }

    return null; // ¡Pasaporte válido!
  };
}

export function correoEstrictoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const correo = control.value;
    if (!correo) {
      return null; // Si está vacío, dejamos que actúe el Validators.required si lo tiene
    }

    // Expresión regular estricta:
    // 1. Usuario: letras, números, puntos, guiones, etc.
    // 2. Un arroba (@)
    // 3. Dominio: letras, números o guiones
    // 4. Extensión (TLD): un punto seguido de al menos 2 letras (ej: .com, .net, .ve, .org)
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!correoRegex.test(correo)) {
      return { correoFormatoInvalido: { correo } };
    }

    return null; // ¡Correo válido!
  };
}
