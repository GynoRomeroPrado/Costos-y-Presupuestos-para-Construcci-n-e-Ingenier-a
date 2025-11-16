/**
 * Validaciones de formularios
 */

/**
 * Valida un RUC peruano (11 dígitos)
 */
export function validateRUC(ruc: string): boolean {
  if (!ruc) return false;
  const rucPattern = /^\d{11}$/;
  return rucPattern.test(ruc);
}

/**
 * Valida un email
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Valida un número de teléfono peruano
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  // Acepta formatos: 999999999, +51999999999, 999-999-999, etc.
  const phonePattern = /^(\+51)?[\s-]?(\d{3})[\s-]?(\d{3})[\s-]?(\d{3})$/;
  return phonePattern.test(phone.replace(/\s/g, ''));
}

/**
 * Valida que un string no esté vacío
 */
export function validateRequired(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * Valida que un número esté dentro de un rango
 */
export function validateRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Valida que un número sea positivo
 */
export function validatePositive(value: number): boolean {
  return value > 0;
}

/**
 * Valida que un número no sea negativo
 */
export function validateNonNegative(value: number): boolean {
  return value >= 0;
}

/**
 * Valida longitud mínima
 */
export function validateMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Valida longitud máxima
 */
export function validateMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

/**
 * Valida un código alfanumérico
 */
export function validateCode(code: string): boolean {
  if (!code) return false;
  const codePattern = /^[A-Z0-9-]+$/i;
  return codePattern.test(code);
}

/**
 * Valida tamaño de archivo
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Valida tipo de archivo
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}
