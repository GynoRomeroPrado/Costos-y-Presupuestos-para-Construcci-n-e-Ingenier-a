import { CURRENCIES, TIPO_COLORS, TIPO_LABELS } from '../constants';

/**
 * Formatea un número como moneda
 */
export function formatCurrency(value: number, currency: string = 'PEN'): string {
  const currencyData = CURRENCIES[currency as keyof typeof CURRENCIES] || CURRENCIES.PEN;
  return `${currencyData.symbol} ${value.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Obtiene la clase CSS de color para un tipo de insumo
 */
export function getTipoColor(tipo: string): string {
  return TIPO_COLORS[tipo as keyof typeof TIPO_COLORS] || 'bg-gray-100 text-gray-800';
}

/**
 * Obtiene la etiqueta legible para un tipo de insumo
 */
export function getTipoLabel(tipo: string): string {
  return TIPO_LABELS[tipo as keyof typeof TIPO_LABELS] || tipo;
}

/**
 * Formatea un porcentaje
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Capitaliza la primera letra de un string
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convierte un string a formato de título (Title Case)
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}
