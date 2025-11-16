/**
 * Constantes de la aplicación
 */

// Paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
} as const;

// Monedas
export const CURRENCIES = {
  PEN: { code: 'PEN', symbol: 'S/', name: 'Soles Peruanos' },
  USD: { code: 'USD', symbol: '$', name: 'Dólares Americanos' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euros' },
} as const;

// Especialidades CAPECO
export const ESPECIALIDADES = [
  'Obras Preliminares',
  'Movimiento de Tierras',
  'Obras de Concreto Simple',
  'Obras de Concreto Armado',
  'Estructuras Metálicas',
  'Arquitectura',
  'Instalaciones Sanitarias',
  'Instalaciones Eléctricas',
  'Instalaciones Mecánicas',
  'Acabados',
  'Varios',
] as const;

// Unidades de medida
export const UNIDADES_MEDIDA = [
  'm',
  'm2',
  'm3',
  'kg',
  'tn',
  'und',
  'pza',
  'glb',
  'ml',
  'día',
  'hh',
  'hm',
  'lt',
  'gal',
  'bls',
] as const;

// Tipos de insumo
export const TIPOS_INSUMO = {
  MATERIAL: 'material',
  MANO_OBRA: 'mano_obra',
  EQUIPO: 'equipo',
  SUBCONTRATO: 'subcontrato',
} as const;

// Estados de proyecto
export const ESTADOS_PROYECTO = {
  ACTIVO: 'activo',
  PAUSADO: 'pausado',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
} as const;

// Configuración de caché React Query
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutos
  GC_TIME: 10 * 60 * 1000, // 10 minutos
  RETRY: 1,
} as const;

// Formatos de fecha
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'dd/MM/yyyy HH:mm',
} as const;

// IGV
export const IGV_DEFAULT = 18; // 18%

// Toast duración
export const TOAST_DURATION = 3000; // 3 segundos

// Límites de archivo
export const FILE_LIMITS = {
  MAX_SIZE_MB: 10,
  ALLOWED_EXCEL_TYPES: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
} as const;

// Colores por tipo de insumo
export const TIPO_COLORS = {
  material: 'bg-blue-100 text-blue-800',
  mano_obra: 'bg-green-100 text-green-800',
  equipo: 'bg-yellow-100 text-yellow-800',
  subcontrato: 'bg-purple-100 text-purple-800',
} as const;

// Labels por tipo de insumo
export const TIPO_LABELS = {
  material: 'Material',
  mano_obra: 'Mano de Obra',
  equipo: 'Equipo',
  subcontrato: 'Subcontrato',
} as const;
